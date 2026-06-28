import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { userId, partnerName, title, content, imageUrl } = await req.json()

    if (!userId || !title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const story = await prisma.successStory.create({
      data: { userId, partnerName, title, content, imageUrl, approved: false },
    })

    return NextResponse.json({ success: true, story })
  } catch (error) {
    console.error("Create story error:", error)
    return NextResponse.json({ error: "Failed to submit story" }, { status: 500 })
  }
}
