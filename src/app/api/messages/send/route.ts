import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { senderId, receiverId, content, imageUrl } = await req.json()

    const message = await prisma.message.create({
      data: { senderId, receiverId, content, imageUrl },
    })

    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: "MESSAGE",
        title: "New Message",
        message: content.substring(0, 100),
      },
    })

    return NextResponse.json({ success: true, message })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
