import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })

    const views = await prisma.profileView.findMany({
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
      take: 50,
    })

    return NextResponse.json({
      success: true,
      views: views.map(v => ({
        id: v.id,
        viewedAt: v.createdAt,
        viewer: {
          id: v.viewer.id,
          name: v.viewer.profile?.fullNameEn || v.viewer.profile?.fullNameMr,
          gender: v.viewer.profile?.gender,
          village: v.viewer.profile?.village,
          district: v.viewer.profile?.district,
          occupation: v.viewer.profile?.occupation,
          photo: v.viewer.photos[0]?.url,
        },
      })),
    })
  } catch (error) {
    console.error("Profile viewers error:", error)
    return NextResponse.json({ error: "Failed to fetch viewers" }, { status: 500 })
  }
}
