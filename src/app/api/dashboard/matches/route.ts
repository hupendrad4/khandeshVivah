export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, horoscope: true, lifestyle: true },
    })

    if (!user?.profile) {
      return NextResponse.json({ success: true, matches: [] })
    }

    const oppositeRole = user.profile.gender === "MALE" ? "BRIDE" : "GROOM"
    const minAge = 18
    const maxAge = 70
    const now = new Date()

    const matches = await prisma.user.findMany({
      where: {
        id: { not: userId },
        isActive: true,
        isBlocked: false,
        isAdminApproved: true,
        role: oppositeRole,
        profile: {
          gender: user.profile.gender === "MALE" ? "FEMALE" : "MALE",
          dateOfBirth: {
            gte: new Date(now.getFullYear() - maxAge, now.getMonth(), now.getDate()),
            lte: new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate()),
          },
        },
      },
      include: {
        profile: true,
        photos: { where: { isPrimary: true }, take: 1 },
        horoscope: { select: { nakshatra: true, raashi: true, manglik: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    })

    return NextResponse.json({ success: true, matches })
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
