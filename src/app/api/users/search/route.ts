import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const filters = await req.json()
    const {
      gender, ageMin, ageMax, religion, caste, district, taluka, village, education,
      verifiedOnly, premiumOnly, currentUserId, sortBy,
    } = filters

    const where: any = { isActive: true, isBlocked: false }

    if (gender) where.role = gender === "MALE" ? "GROOM" : "BRIDE"

    if (district) {
      where.profile = { ...(where.profile || {}), district }
    }
    if (taluka) {
      where.profile = { ...(where.profile || {}), taluka }
    }
    if (village) {
      where.profile = { ...(where.profile || {}), village }
    }
    if (verifiedOnly) where.isVerified = true
    if (premiumOnly) where.isPremium = true

    if (religion === "OTHER") {
      where.profile = {
        ...(where.profile || {}),
        religion: { notIn: ["HINDU", "MUSLIM", "BUDDHIST", "JAIN", "CHRISTIAN", "SIKH"] },
      }
    } else if (religion) {
      const rel = religion.toUpperCase()
      if (rel === "MUSLIM") {
        where.profile = { ...(where.profile || {}), religion: "MUSLIM", caste: { in: ["MUSLIM", "OTHER"] } }
      } else {
        where.profile = { ...(where.profile || {}), religion: rel }
      }
    }

    if (caste) where.profile = { ...(where.profile || {}), caste }
    if (education) where.profile = { ...(where.profile || {}), education }

    if (ageMin || ageMax) {
      const now = new Date()
      const dateFilter: any = {}
      if (ageMin) {
        const maxDate = new Date(now.getFullYear() - ageMin, now.getMonth(), now.getDate())
        dateFilter.lte = maxDate
      }
      if (ageMax) {
        const minDate = new Date(now.getFullYear() - ageMax - 1, now.getMonth(), now.getDate())
        dateFilter.gte = minDate
      }
      where.profile = { ...(where.profile || {}), dateOfBirth: dateFilter }
    }

    if (currentUserId) {
      where.id = { not: currentUserId }
    }

    let orderBy: any = { createdAt: "desc" }
    if (sortBy === "oldest") orderBy = { createdAt: "asc" }
    else if (sortBy === "name_asc") orderBy = { profile: { fullNameEn: "asc" } }
    else if (sortBy === "name_desc") orderBy = { profile: { fullNameEn: "desc" } }
    else if (sortBy === "age_asc") orderBy = { profile: { dateOfBirth: "desc" } }
    else if (sortBy === "age_desc") orderBy = { profile: { dateOfBirth: "asc" } }

    const users = await prisma.user.findMany({
      where,
      include: { profile: true, photos: { where: { isPrimary: true } } },
      orderBy,
      take: 50,
    })

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
