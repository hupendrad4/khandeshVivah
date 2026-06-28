export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const senderId = searchParams.get("senderId")
    const receiverId = searchParams.get("receiverId")

    if (!senderId || !receiverId) return NextResponse.json({ status: null })

    const interest = await prisma.interest.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ status: interest?.status || null, interest })
  } catch {
    return NextResponse.json({ status: null })
  }
}
