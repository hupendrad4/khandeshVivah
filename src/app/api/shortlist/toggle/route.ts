import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { userId, targetId } = await req.json()

    if (!userId || !targetId) {
      return NextResponse.json({ error: "userId and targetId are required" }, { status: 400 })
    }

    // Check if already shortlisted
    const existing = await prisma.shortlist.findUnique({
      where: { userId_targetId: { userId, targetId } },
    })

    if (existing) {
      // Un-shortlist (remove)
      await prisma.shortlist.delete({
        where: { id: existing.id },
      })
      return NextResponse.json({ success: true, shortlisted: false })
    }

    // Add to shortlist
    await prisma.shortlist.create({
      data: { userId, targetId },
    })

    return NextResponse.json({ success: true, shortlisted: true })
  } catch (error) {
    console.error("Shortlist toggle error:", error)
    return NextResponse.json({ error: "Failed to toggle shortlist" }, { status: 500 })
  }
}
