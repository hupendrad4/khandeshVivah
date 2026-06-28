import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { blockerId, blockedId, action } = await req.json()

    if (!blockerId || !blockedId) {
      return NextResponse.json({ error: "Missing user IDs" }, { status: 400 })
    }

    if (action === "block") {
      const existing = await prisma.blockedUser.findUnique({
        where: { blockerId_blockedId: { blockerId, blockedId } },
      })
      if (existing) {
        return NextResponse.json({ success: true, blocked: true })
      }
      await prisma.blockedUser.create({ data: { blockerId, blockedId } })
      return NextResponse.json({ success: true, blocked: true })
    } else {
      await prisma.blockedUser.deleteMany({
        where: { blockerId, blockedId },
      })
      return NextResponse.json({ success: true, blocked: false })
    }
  } catch (error) {
    console.error("Block error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const targetId = searchParams.get("targetId")

    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })

    if (targetId) {
      const block = await prisma.blockedUser.findUnique({
        where: { blockerId_blockedId: { blockerId: userId, blockedId: targetId } },
      })
      return NextResponse.json({ success: true, isBlocked: !!block })
    }

    const blockedUsers = await prisma.blockedUser.findMany({
      where: { blockerId: userId },
      include: {
        blocked: {
          include: {
            profile: { select: { fullNameEn: true, fullNameMr: true } },
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      blockedUsers: blockedUsers.map(b => ({
        id: b.blocked.id,
        name: b.blocked.profile?.fullNameEn || b.blocked.profile?.fullNameMr || "Unknown",
        blockedAt: b.createdAt,
      })),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
