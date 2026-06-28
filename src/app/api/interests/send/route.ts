import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { senderId, receiverId } = await req.json()

    const existing = await prisma.interest.findFirst({
      where: { senderId, receiverId },
    })

    if (existing) {
      return NextResponse.json({ error: "Interest already sent" }, { status: 400 })
    }

    const interest = await prisma.interest.create({
      data: { senderId, receiverId, status: "PENDING" },
    })

    const sender = await prisma.user.findUnique({ where: { id: senderId }, include: { profile: true } })

    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: "INTEREST",
        title: "New Interest",
        message: `${sender?.profile?.fullNameEn || sender?.profile?.fullNameMr || "Someone"} has shown interest in your profile`,
        data: JSON.stringify({ interestId: interest.id }),
      },
    })

    return NextResponse.json({ success: true, interest })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send interest" }, { status: 500 })
  }
}
