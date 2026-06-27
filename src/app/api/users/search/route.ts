import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const filters = await req.json()
    const {
      gender, ageMin, ageMax, religion, caste, district, taluka, village,
      verifiedOnly, premiumOnly, currentUserId,
    } = filters

    const where: any = { isActive: true, isBlocked: false, isAdminApproved: true }

    if (gender) where.role = gender === "MALE" ? "GROOM" : "BRIDE"
    if (district) where.profile = { ...where.profile, district }
    if (taluka) where.profile = { ...where.profile, taluka }
    if (village) where.profile = { ...where.profile, village }
    if (verifiedOnly) where.isVerified = true
    if (premiumOnly) where.isPremium = true

    if (religion) {
      const rel = religion.toUpperCase()
      if (rel === "MUSLIM") {
        where.profile = { ...where.profile, religion: "MUSLIM" }
        where.profile = { ...where.profile, caste: { in: ["MUSLIM", "OTHER"] } }
      } else if (rel === "HINDU") {
        where.profile = { ...where.profile, religion: "HINDU" }
      } else if (rel === "BUDDHIST") {
        where.profile = { ...where.profile, religion: "BUDDHIST" }
      } else if (rel === "JAIN") {
        where.profile = { ...where.profile, religion: "JAIN" }
      } else if (rel === "CHRISTIAN") {
        where.profile = { ...where.profile, religion: "CHRISTIAN" }
      } else if (rel === "SIKH") {
        where.profile = { ...where.profile, religion: "SIKH" }
      } else {
        where.profile = { ...where.profile, religion }
      }
    }

    if (caste) where.profile = { ...where.profile, caste }

    if (ageMin || ageMax) {
      const now = new Date()
      if (ageMin) {
        const maxDate = new Date(now.getFullYear() - ageMin, now.getMonth(), now.getDate())
        where.profile = { ...where.profile, dateOfBirth: { ...(where.profile?.dateOfBirth || {}), lte: maxDate } }
      }
      if (ageMax) {
        const minDate = new Date(now.getFullYear() - ageMax - 1, now.getMonth(), now.getDate())
        where.profile = { ...where.profile, dateOfBirth: { ...(where.profile?.dateOfBirth || {}), gte: minDate } }
      }
    }

    const users = await prisma.user.findMany({
      where,
      include: { profile: true, photos: { where: { isPrimary: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
