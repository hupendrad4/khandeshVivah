import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY

/** Verify OTP via MSG91's verification API (for mobile OTPs sent through their gateway) */
async function verifySmsOtp(mobile: string, otp: string): Promise<boolean> {
  if (!MSG91_AUTH_KEY) {
    console.warn("MSG91_AUTH_KEY not configured — falling back to DB verification")
    return false
  }

  try {
    const normalizedMobile = `91${mobile.replace(/^\+?91/, "").trim()}`
    const url = new URL("https://control.msg91.com/api/v5/otp/verify")
    url.searchParams.set("mobile", normalizedMobile)
    url.searchParams.set("otp", otp)

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        authkey: MSG91_AUTH_KEY,
        accept: "application/json",
      },
    })

    const data = await response.json()

    // MSG91 returns success type "success" on verification
    return response.ok && data?.type === "success"
  } catch (err) {
    console.error("MSG91 verify error:", err)
    return false
  }
}

export async function POST(req: Request) {
  try {
    const { mobile, email, otp } = await req.json()

    if (!otp) {
      return NextResponse.json({ error: "OTP is required" }, { status: 400 })
    }

    // ── Mobile OTP: verify via MSG91 first, then fallback to DB ──
    if (mobile) {
      const msg91Verified = await verifySmsOtp(mobile, otp)

      if (msg91Verified) {
        // Mark any pending DB records as used (for tracking)
        await prisma.oTP.updateMany({
          where: { mobile, isUsed: false, expiresAt: { gte: new Date() } },
          data: { isUsed: true },
        })

        // Find or create user
        let user = await prisma.user.findUnique({ where: { mobile } })
        if (!user) {
          user = await prisma.user.create({
            data: { mobile, role: "BRIDE" },
          })
        }

        return NextResponse.json({
          success: true,
          user: { id: user.id, mobile: user.mobile, role: user.role },
        })
      }

      // MSG91 didn't verify — try DB record as fallback
      const dbRecord = await prisma.oTP.findFirst({
        where: {
          mobile,
          otp,
          isUsed: false,
          expiresAt: { gte: new Date() },
        },
        orderBy: { createdAt: "desc" },
      })

      if (!dbRecord) {
        return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
      }

      await prisma.oTP.update({
        where: { id: dbRecord.id },
        data: { isUsed: true },
      })

      let user = await prisma.user.findUnique({ where: { mobile } })
      if (!user) {
        user = await prisma.user.create({
          data: { mobile, role: "BRIDE" },
        })
      }

      return NextResponse.json({
        success: true,
        user: { id: user.id, mobile: user.mobile, role: user.role },
      })
    }

    // ── Email OTP: verify via DB record ──
    if (email) {
      const record = await prisma.oTP.findFirst({
        where: {
          email,
          otp,
          isUsed: false,
          expiresAt: { gte: new Date() },
        },
        orderBy: { createdAt: "desc" },
      })

      if (!record) {
        return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
      }

      await prisma.oTP.update({
        where: { id: record.id },
        data: { isUsed: true },
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Mobile or email required" }, { status: 400 })
  } catch (error) {
    console.error("OTP verify error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
