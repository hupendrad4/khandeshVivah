import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { viewerId, targetId } = await req.json()

    if (!viewerId || !targetId || viewerId === targetId) {
      return NextResponse.json({ success: false }, { status: 400 })
    }

    const recent = await prisma.profileView.findFirst({
      where: { viewerId, targetId, createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    })

    if (!recent) {
      await Promise.all([
        prisma.profileView.create({ data: { viewerId, targetId } }),
        prisma.user.update({ where: { id: targetId }, data: { profileViews: { increment: 1 } } }),
      ])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile view error:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
