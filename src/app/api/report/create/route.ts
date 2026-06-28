import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { reporterId, reportedId, reason, description } = await req.json()

    if (!reporterId || !reportedId || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const report = await prisma.report.create({
      data: { reporterId, reportedId, reason, description, status: "PENDING" },
    })

    await prisma.notification.create({
      data: {
        userId: reportedId,
        type: "REPORT",
        title: "You have been reported",
        message: `Report reason: ${reason}. Our team will review this.`,
      },
    })

    return NextResponse.json({ success: true, report })
  } catch (error) {
    console.error("Report error:", error)
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 })
  }
}
