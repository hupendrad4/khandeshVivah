import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/server-auth"
import type { VerificationStatus } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { mobile, email, password, profile, family, horoscope, lifestyle, photos, biodata } = data

    const hashedPassword = password ? hashPassword(password) : undefined

    // Check if user already exists (e.g., created via OTP verify)
    const existingUser = mobile
      ? await prisma.user.findUnique({ where: { mobile } })
      : email
        ? await prisma.user.findUnique({ where: { email } })
        : null

    const user = existingUser
      ? await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            ...(email && !existingUser.email ? { email } : {}),
            ...(password ? { password: hashedPassword } : {}),
            isAdminApproved: true,
            profileComplete: calculateProfileCompletion(profile),
          },
          include: { profile: true, family: true, horoscope: true, lifestyle: true },
        })
      : await prisma.user.create({
          data: {
            mobile,
            email,
            password: hashedPassword,
            isAdminApproved: true,
            profileComplete: calculateProfileCompletion(profile),
            profile: profile ? {
              create: {
                fullNameMr: profile.fullNameMr,
                fullNameEn: profile.fullNameEn,
                gender: profile.gender,
                dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined,
                height: profile.height ? parseInt(profile.height) : undefined,
                weight: profile.weight ? parseInt(profile.weight) : undefined,
                religion: profile.religion,
                caste: profile.caste,
                subCaste: profile.subCaste,
                motherTongue: profile.motherTongue,
                maritalStatus: profile.maritalStatus,
                education: profile.education,
                occupation: profile.occupation,
                income: profile.income,
                village: profile.village,
                taluka: profile.taluka,
                district: profile.district,
                aboutMe: profile.aboutMe,
                expectations: profile.expectations,
              },
            } : undefined,
            family: family ? { create: family } : undefined,
            horoscope: horoscope ? { create: horoscope } : undefined,
            lifestyle: lifestyle ? { create: lifestyle } : undefined,
          },
          include: { profile: true, family: true, horoscope: true, lifestyle: true },
        })

    // Create photo records
    if (photos && photos.length > 0) {
      const userId = existingUser ? existingUser.id : user.id
      // Remove existing photos to replace
      await prisma.photo.deleteMany({ where: { userId } })
      // Add new photos with isPrimary flag from client
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i]
        await prisma.photo.create({
          data: {
            userId,
            url: typeof photo === "string" ? photo : photo.url,
            isPrimary: typeof photo === "string" ? i === 0 : photo.isPrimary === true,
            isApproved: true,
          },
        })
      }
    }

    // Create biodata document record
    if (biodata) {
      const userId = existingUser ? existingUser.id : user.id
      await prisma.document.upsert({
        where: {
          id: (await prisma.document.findFirst({ where: { userId, type: "BIODATA" } }))?.id || "none",
        },
        update: { url: biodata, status: "VERIFIED" as VerificationStatus },
        create: {
          userId,
          type: "BIODATA",
          url: biodata,
          status: "VERIFIED" as VerificationStatus,
        },
      })
    }

    // If user existed, still update/create related records
    if (existingUser) {
      if (profile) {
        await prisma.profile.upsert({
          where: { userId: existingUser.id },
          update: {
            fullNameMr: profile.fullNameMr,
            fullNameEn: profile.fullNameEn,
            gender: profile.gender,
            dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined,
            height: profile.height ? parseInt(profile.height) : undefined,
            weight: profile.weight ? parseInt(profile.weight) : undefined,
            religion: profile.religion,
            caste: profile.caste,
            subCaste: profile.subCaste,
            motherTongue: profile.motherTongue,
            maritalStatus: profile.maritalStatus,
            education: profile.education,
            occupation: profile.occupation,
            income: profile.income,
            village: profile.village,
            taluka: profile.taluka,
            district: profile.district,
            aboutMe: profile.aboutMe,
            expectations: profile.expectations,
          },
          create: {
            userId: existingUser.id,
            fullNameMr: profile.fullNameMr,
            fullNameEn: profile.fullNameEn,
            gender: profile.gender,
            dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined,
            height: profile.height ? parseInt(profile.height) : undefined,
            weight: profile.weight ? parseInt(profile.weight) : undefined,
            religion: profile.religion,
            caste: profile.caste,
            subCaste: profile.subCaste,
            motherTongue: profile.motherTongue,
            maritalStatus: profile.maritalStatus,
            education: profile.education,
            occupation: profile.occupation,
            income: profile.income,
            village: profile.village,
            taluka: profile.taluka,
            district: profile.district,
            aboutMe: profile.aboutMe,
            expectations: profile.expectations,
          },
        })
      }
      if (family) {
        await prisma.family.upsert({
          where: { userId: existingUser.id },
          update: family,
          create: { userId: existingUser.id, ...family },
        })
      }
      if (horoscope) {
        await prisma.horoscope.upsert({
          where: { userId: existingUser.id },
          update: horoscope,
          create: { userId: existingUser.id, ...horoscope },
        })
      }
      if (lifestyle) {
        await prisma.lifestyle.upsert({
          where: { userId: existingUser.id },
          update: lifestyle,
          create: { userId: existingUser.id, ...lifestyle },
        })
      }
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("User creation error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

function calculateProfileCompletion(profile: any): number {
  if (!profile) return 0
  let filled = 0
  const fields = ["fullNameMr", "gender", "dateOfBirth", "religion", "caste", "education", "occupation", "village", "taluka", "district", "aboutMe"]
  fields.forEach((f) => { if (profile[f]) filled++ })
  return Math.round((filled / fields.length) * 100)
}
