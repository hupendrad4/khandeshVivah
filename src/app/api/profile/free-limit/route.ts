export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const FREE_VIEW_LIMIT = 2

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    if (!userId) return NextResponse.json({ remaining: 0, limit: FREE_VIEW_LIMIT })

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isPremium: true },
    })

    if (user?.isPremium) {
      return NextResponse.json({ remaining: -1, limit: FREE_VIEW_LIMIT, isPremium: true })
    }

    const count = await prisma.profileView.count({
      where: { viewerId: userId },
    })

    const remaining = Math.max(0, FREE_VIEW_LIMIT - count)
    return NextResponse.json({ remaining, used: count, limit: FREE_VIEW_LIMIT, isPremium: false })
  } catch {
    return NextResponse.json({ remaining: 0 })
  }
}

export async function POST(req: Request) {
  try {
    const { viewerId, targetId } = await req.json()
    if (!viewerId || !targetId) return NextResponse.json({ allowed: false })

    const viewer = await prisma.user.findUnique({
      where: { id: viewerId },
      select: { isPremium: true },
    })

    if (viewer?.isPremium) {
      return NextResponse.json({ allowed: true, isPremium: true })
    }

    const count = await prisma.profileView.count({
      where: { viewerId },
    })

    if (count >= FREE_VIEW_LIMIT) {
      return NextResponse.json({ allowed: false, remaining: 0, limit: FREE_VIEW_LIMIT })
    }

    const existing = await prisma.profileView.findFirst({
      where: { viewerId, targetId },
    })

    if (!existing) {
      await prisma.profileView.create({ data: { viewerId, targetId } })
    }

    const remaining = FREE_VIEW_LIMIT - (count + 1)
    return NextResponse.json({ allowed: true, remaining, limit: FREE_VIEW_LIMIT })
  } catch {
    return NextResponse.json({ allowed: false })
  }
}
