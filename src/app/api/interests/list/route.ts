export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const type = searchParams.get("type") || "all"

    if (!userId) return NextResponse.json({ interests: [] })

    const where: any = {}
    if (type === "sent") where.senderId = userId
    else if (type === "received") where.receiverId = userId
    else where.OR = [{ senderId: userId }, { receiverId: userId }]

    const interests = await prisma.interest.findMany({
      where,
      include: {
        sender: { include: { profile: true, photos: { where: { isPrimary: true } } } },
        receiver: { include: { profile: true, photos: { where: { isPrimary: true } } } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, interests })
  } catch {
    return NextResponse.json({ interests: [] })
  }
}
