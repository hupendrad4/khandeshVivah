import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

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

export async function POST(req: Request) {
  try {
    const { email, planName, planDuration, planPrice, endDate } = await req.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    const transporter = getMailTransporter()

    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFEF2; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #8f4e00, #ff9933); padding: 32px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">Khandesh Vivah</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">Subscription Confirmed!</p>
        </div>
        <div style="padding: 32px;">
          <p style="color: #001B4D; font-size: 16px; margin: 0 0 16px;">Dear Member,</p>
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            Thank you for subscribing to Khandesh Vivah! Your premium membership is now active.
          </p>
          <div style="background: #f8f4ec; border-radius: 12px; padding: 20px; border: 1px solid #e8dcc8; margin-bottom: 24px;">
            <h3 style="color: #8f4e00; margin: 0 0 16px; font-size: 16px;">Plan Details</h3>
            <table style="width: 100%; font-size: 14px;">
              <tr><td style="color: #666; padding: 4px 0;">Plan</td><td style="color: #001B4D; font-weight: bold; text-align: right;">${planName}</td></tr>
              <tr><td style="color: #666; padding: 4px 0;">Duration</td><td style="color: #001B4D; text-align: right;">${planDuration}</td></tr>
              <tr><td style="color: #666; padding: 4px 0;">Amount Paid</td><td style="color: #001B4D; font-weight: bold; text-align: right;">${planPrice}</td></tr>
              <tr><td style="color: #666; padding: 4px 0;">Valid Until</td><td style="color: #001B4D; text-align: right;">${endDate}</td></tr>
            </table>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            You can now send unlimited messages, view contact details, and connect with potential matches.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000"}/chat"
               style="background: #8f4e00; color: #fff; text-decoration: none; padding: 12px 32px; border-radius: 12px; font-weight: bold; display: inline-block;">
              Start Chatting
            </a>
          </div>
          <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
            Khandesh Vivah — Connecting Marathi Families Since 2024
          </p>
        </div>
      </div>
    `

    await transporter.sendMail({
      from: `"Khandesh Vivah" <${process.env.SMTP_USER || "noreply@khandeshvivah.com"}>`,
      to: email,
      subject: `🎉 Subscription Activated — ${planName} Plan`,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Email send failed:", err)
    return NextResponse.json({ success: false, error: err.message })
  }
}
