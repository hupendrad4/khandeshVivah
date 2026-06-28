import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const targetId = searchParams.get("targetId")

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    if (targetId) {
      const existing = await prisma.shortlist.findUnique({
        where: { userId_targetId: { userId, targetId } },
      })
      return NextResponse.json({ success: true, shortlisted: !!existing })
    }

    const shortlists = await prisma.shortlist.findMany({
      where: { userId },
      include: {
        target: {
          include: {
            profile: true,
            photos: { where: { isPrimary: true }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const profiles = shortlists.map((s) => ({
      ...s.target,
      shortlistedAt: s.createdAt,
    }))

    return NextResponse.json({ success: true, profiles })
  } catch (error) {
    console.error("Fetch shortlist error:", error)
    return NextResponse.json({ error: "Failed to fetch shortlist" }, { status: 500 })
  }
}
