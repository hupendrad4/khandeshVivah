import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateOTP } from "@/lib/utils"
import nodemailer from "nodemailer"

// MSG91 API config
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY
const MSG91_OTP_TEMPLATE_ID = process.env.MSG91_OTP_TEMPLATE_ID

// Nodemailer transporter (lazy-init)
let transporter: nodemailer.Transporter | null = null
function getMailTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }
  return transporter
}

/** Send OTP via MSG91 SMS gateway (Indian mobile numbers) */
async function sendSmsOtp(mobile: string): Promise<{ success: boolean; error?: string }> {
  if (!MSG91_AUTH_KEY || !MSG91_OTP_TEMPLATE_ID) {
    console.warn("MSG91 credentials not configured — falling back to console OTP")
    return { success: false, error: "SMS gateway not configured" }
  }

  try {
    const response = await fetch("https://control.msg91.com/api/v5/otp", {
      method: "POST",
      headers: {
        authkey: MSG91_AUTH_KEY,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        template_id: MSG91_OTP_TEMPLATE_ID,
        mobile: `91${mobile.replace(/^\+?91/, "").trim()}`, // Normalize to 91XXXXXXXXXX
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data?.message || `MSG91 error: ${response.status}` }
    }

    return { success: true }
  } catch (err) {
    console.error("MSG91 send error:", err)
    return { success: false, error: "Failed to reach SMS gateway" }
  }
}

/** Send OTP via Email using Nodemailer */
async function sendEmailOtp(email: string, otp: string): Promise<{ success: boolean; error?: string }> {
  try {
    const mailer = getMailTransporter()
    await mailer.sendMail({
      from: process.env.OTP_EMAIL_FROM || `"Khandesh Vivah" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP for Khandesh Vivah",
      html: `<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #b91c1c;">Khandesh Vivah</h2>
        <p>Your One-Time Password (OTP) is:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 16px; background: #fef2f2; border-radius: 8px; margin: 16px 0;">
          ${otp}
        </div>
        <p>This OTP is valid for <strong>10 minutes</strong>.</p>
        <p style="color: #666; font-size: 12px;">If you did not request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee;" />
        <p style="color: #999; font-size: 11px;">Khandesh Vivah — Matrimonial platform for the Khandesh region.</p>
      </div>`,
    })
    return { success: true }
  } catch (err) {
    console.error("Email send error:", err)
    return { success: false, error: "Failed to send email" }
  }
}

export async function POST(req: Request) {
  try {
    const { mobile, email } = await req.json()

    if (!mobile && !email) {
      return NextResponse.json({ error: "Mobile or email required" }, { status: 400 })
    }

    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    // Store OTP in DB for verification
    await prisma.oTP.create({
      data: {
        mobile: mobile || null,
        email: email || null,
        otp,
        type: mobile ? "MOBILE" : "EMAIL",
        expiresAt,
      },
    })

    if (mobile) {
      // Priority: MSG91 SMS gateway
      const smsResult = await sendSmsOtp(mobile)
      if (!smsResult.success) {
        // Fallback: log to console if gateway fails
        console.log(`[FALLBACK] OTP for ${mobile}: ${otp}`)
        return NextResponse.json({
          success: true,
          message: "OTP sent via SMS (fallback)",
          gateway: "fallback",
        })
      }
      return NextResponse.json({
        success: true,
        message: "OTP sent successfully",
        gateway: "msg91",
      })
    }

    if (email) {
      // Send OTP via email using nodemailer
      const emailResult = await sendEmailOtp(email, otp)
      if (!emailResult.success) {
        // Fallback: log to console
        console.log(`[FALLBACK] OTP for ${email}: ${otp}`)
      }
      return NextResponse.json({
        success: true,
        message: "OTP sent successfully",
        gateway: emailResult.success ? "email" : "fallback",
      })
    }

    return NextResponse.json({ error: "Mobile or email required" }, { status: 400 })
  } catch (error) {
    console.error("OTP send error:", error)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}
