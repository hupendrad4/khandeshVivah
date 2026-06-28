export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const stories = await prisma.successStory.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json({ success: true, stories })
  } catch (error) {
    console.error("Fetch stories error:", error)
    return NextResponse.json({ success: true, stories: [] })
  }
}
