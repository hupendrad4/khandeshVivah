import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import fs from "fs"
import path from "path"

interface KmmProfile {
  sourceId: string
  gender: string
  name: string
  dateOfBirth: string | null
  height: number | null
  education: string
  occupation: string
  income: string | null
  residence: string
  maritalStatus: string
  district: string
  photoUrls: string[]
  aboutMe: string
  expectations: string
  religion: string
  caste: string
  motherTongue: string
  state: string
  country: string
}

const VILLAGES = ["Mhasawad", "Dondaicha", "Chopda", "Shirpur", "Navapur", "Sakri", "Bhusawal", "Jalgaon", "Dhule", "Nandurbar", "Amalner", "Pahur", "Songir", "Kusumba", "Laling"]

function extractVillage(residence: string): string {
  for (const v of VILLAGES) if (residence.includes(v)) return v
  return residence.slice(0, 15) || "Jalgaon"
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    if (searchParams.get("force") === "true") {
      await prisma.user.deleteMany({ where: { email: { startsWith: "kmm." } } })
    } else {
      const existing = await prisma.user.findFirst({ where: { email: { startsWith: "kmm." } } })
      if (existing) return NextResponse.json({ success: true, message: "Already imported. Pass ?force=true to re-import." })
    }

    const filePath = path.join(process.cwd(), "scripts", "kmm-data.json")
    if (!fs.existsSync(filePath)) return NextResponse.json({ error: "kmm-data.json not found. Run scripts/scrape-kmm.mjs first." }, { status: 400 })

    const raw = fs.readFileSync(filePath, "utf-8")
    const profiles: KmmProfile[] = JSON.parse(raw)

    let c = 0
    const BATCH = 20

    const makeUserData = (p: KmmProfile, idx: number) => {
      const isMale = p.gender === "MALE"
      const photoCreates = p.photoUrls.length > 0
        ? p.photoUrls.map((url, i) => ({ url, isPrimary: i === 0, isApproved: true }))
        : [{ url: `https://i.pravatar.cc/400?img=${(parseInt(p.sourceId.replace(/\D/g, "")) % 69) + 1}`, isPrimary: true, isApproved: true }]
      return prisma.user.create({
        data: {
          email: `kmm.${p.sourceId}@local.test`,
          role: isMale ? "GROOM" : "BRIDE",
          isActive: true, isBlocked: false, isAdminApproved: true,
          isVerified: true,
          isPremium: idx < 20,
          profileComplete: 100,
          profile: {
            create: {
              gender: (isMale ? "MALE" : "FEMALE") as any,
              fullNameMr: p.name,
              fullNameEn: p.name,
              dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth) : undefined,
              height: p.height || undefined,
              religion: p.religion as any,
              caste: p.caste as any,
              motherTongue: p.motherTongue,
              maritalStatus: p.maritalStatus as any,
              education: p.education || undefined,
              occupation: p.occupation || undefined,
              income: p.income || undefined,
              village: extractVillage(p.residence),
              district: p.district as any,
              state: p.state,
              country: p.country,
              nativePlace: p.residence,
              aboutMe: p.aboutMe,
              expectations: p.expectations,
            },
          },
          photos: { create: photoCreates },
        },
      })
    }

    for (let i = 0; i < profiles.length; i += BATCH) {
      const batch = profiles.slice(i, i + BATCH)
      await Promise.all(batch.map((p, j) => makeUserData(p, i + j).then(() => c++)))
    }

    return NextResponse.json({ success: true, message: `${c} profiles imported from KMM` })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
