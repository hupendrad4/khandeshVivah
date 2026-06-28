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
      include: {
        profile: true,
        family: true,
        horoscope: true,
        lifestyle: true,
        photos: { orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }] },
        documents: true,
      },
    })

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    return NextResponse.json({ success: true, profile: user })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
