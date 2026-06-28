import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { userId, name, filters } = await req.json()

    if (!userId || !name || !filters) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const saved = await prisma.savedSearch.create({
      data: { userId, name, filters: JSON.stringify(filters) },
    })

    return NextResponse.json({ success: true, savedSearch: saved })
  } catch (error) {
    console.error("Save search error:", error)
    return NextResponse.json({ error: "Failed to save search" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })

    const savedSearches = await prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      savedSearches: savedSearches.map(s => ({
        ...s,
        filters: JSON.parse(s.filters),
      })),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

    await prisma.savedSearch.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
