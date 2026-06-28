import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculateGunaMatch } from "@/lib/kundali"

export async function POST(req: Request) {
  try {
    const { userId1, userId2 } = await req.json()

    const [user1, user2] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId1 }, include: { horoscope: true, profile: true } }),
      prisma.user.findUnique({ where: { id: userId2 }, include: { horoscope: true, profile: true } }),
    ])

    if (!user1?.horoscope || !user2?.horoscope) {
      return NextResponse.json({ error: "Horoscope data not available for one or both users" }, { status: 400 })
    }

    const result = calculateGunaMatch(
      user1.horoscope.nakshatra || "",
      user2.horoscope.nakshatra || "",
      user1.horoscope.raashi || "",
      user2.horoscope.raashi || "",
    )

    const user1Profile = user1.profile ? {
      name: user1.profile.fullNameEn || user1.profile.fullNameMr,
      gender: user1.profile.gender,
      nakshatra: user1.horoscope.nakshatra,
      raashi: user1.horoscope.raashi,
      manglik: user1.horoscope.manglik,
    } : null

    const user2Profile = user2.profile ? {
      name: user2.profile.fullNameEn || user2.profile.fullNameMr,
      gender: user2.profile.gender,
      nakshatra: user2.horoscope.nakshatra,
      raashi: user2.horoscope.raashi,
      manglik: user2.horoscope.manglik,
    } : null

    const boyProfile = user1Profile?.gender === "MALE" ? user1Profile : user2Profile
    const girlProfile = user1Profile?.gender === "FEMALE" ? user1Profile : user2Profile

    return NextResponse.json({
      success: true,
      result,
      boy: boyProfile,
      girl: girlProfile,
      manglikMatch: user1.horoscope.manglik === user2.horoscope.manglik,
      manglikDosha: user1.horoscope.manglik !== user2.horoscope.manglik,
    })
  } catch (error) {
    console.error("Guna match error:", error)
    return NextResponse.json({ error: "Failed to calculate match" }, { status: 500 })
  }
}
