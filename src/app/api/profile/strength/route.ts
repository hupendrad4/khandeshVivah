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
      include: { profile: true, family: true, horoscope: true, lifestyle: true, photos: true, documents: true },
    })

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const checks = [
      { key: "basicInfo", label: "Basic Information", weight: 20, done: !!(user.profile?.fullNameEn && user.profile?.gender && user.profile?.dateOfBirth) },
      { key: "photos", label: "Profile Photos", weight: 20, done: user.photos.length >= 3 },
      { key: "contact", label: "Contact Info", weight: 10, done: !!(user.email || user.mobile) },
      { key: "education", label: "Education & Career", weight: 10, done: !!(user.profile?.education && user.profile?.occupation) },
      { key: "family", label: "Family Details", weight: 10, done: !!(user.family?.fatherName || user.family?.motherName) },
      { key: "location", label: "Location Details", weight: 10, done: !!(user.profile?.village && user.profile?.district) },
      { key: "horoscope", label: "Horoscope", weight: 10, done: !!(user.horoscope?.nakshatra || user.horoscope?.raashi) },
      { key: "about", label: "About Me", weight: 5, done: !!user.profile?.aboutMe },
      { key: "expectations", label: "Partner Expectations", weight: 5, done: !!user.profile?.expectations },
    ]

    const completed = checks.filter(c => c.done).reduce((sum, c) => sum + c.weight, 0)
    const pendingItems = checks.filter(c => !c.done).map(c => c.label)

    await prisma.user.update({ where: { id: userId }, data: { profileComplete: completed } })

    return NextResponse.json({ success: true, score: completed, checks, pendingItems })
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
