export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })

    const count = await prisma.profileView.count({ where: { targetId: userId } })
    const recentViews = await prisma.profileView.findMany({
      where: { targetId: userId },
      include: {
        viewer: {
          include: {
            profile: { select: { fullNameEn: true, fullNameMr: true, gender: true, dateOfBirth: true, village: true, district: true, occupation: true } },
            photos: { where: { isPrimary: true }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    return NextResponse.json({
      success: true,
      totalViews: count,
      recentViews: recentViews.map(v => ({
        id: v.viewer.id,
        name: v.viewer.profile?.fullNameEn || v.viewer.profile?.fullNameMr,
        gender: v.viewer.profile?.gender,
        village: v.viewer.profile?.village,
        district: v.viewer.profile?.district,
        occupation: v.viewer.profile?.occupation,
        photo: v.viewer.photos[0]?.url,
        viewedAt: v.createdAt,
      })),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
