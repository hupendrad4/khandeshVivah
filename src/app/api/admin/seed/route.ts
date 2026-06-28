import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const districts = ["JALGAON", "DHULE", "NANDURBAR", "NASHIK_NORTH"]
const talukas: Record<string, string[]> = {
  JALGAON: ["CHOPDA", "YAVAL", "RAIVER", "BHUSAWAL", "JAMNER", "ERANDOL", "AMALNER", "MALEK"],
  DHULE: ["DHULE", "SHIRPUR", "SINDKHEDA", "SAKRI"],
  NANDURBAR: ["NANDURBAR", "NAVAPUR", "TALODA"],
  NASHIK_NORTH: ["BAGLAN", "KALWAN", "SURGANA", "PETH", "TRIMBAK", "IGATPURI", "NASHIK", "NIPHAD", "SINNAR", "DINDORI", "CHANDWAD"],
}
const religions = ["HINDU", "MUSLIM", "BUDDHIST", "JAIN", "CHRISTIAN", "SIKH"]
const castes = ["MARATHA", "LEVA_PATIL", "KUNBI", "MALI", "BRAHMIN", "DHANGAR", "SUTAR", "SONAR", "TELI", "WANI", "LINGAYAT", "RAJPUT", "VANJARI", "AHIRE", "OTHER"]
const villages = ["Mhasawad", "Dondaicha", "Chopda", "Shirpur", "Navapur", "Sakri", "Bhusawal", "Jalgaon", "Dhule", "Nandurbar", "Amalner", "Pahur", "Songir", "Kusumba", "Laling"]

const mNames = "Amit,Sachin,Rahul,Vikas,Sunil,Deepak,Nitin,Pravin,Manoj,Santosh,Rajesh,Kiran,Vijay,Anil,Ganesh,Mahesh,Sagar,Prasad,Hrishikesh,Omkar,Shubham,Yogesh,Rohan,Siddharth,Akash".split(",")
const fNames = "Priya,Sneha,Anita,Manisha,Shweta,Kavita,Neha,Pooja,Rupali,Sonal,Tejaswini,Vaishali,Pallavi,Sakshi,Renuka,Swati,Sayali,Aishwarya,Janhavi,Shruti,Nikita,Komal,Rutuja,Mrunal,Aditi".split(",")

function rand<T>(a: T[]): T { return a[Math.floor(Math.random() * a.length)] }
function dob(min = 22, max = 42) { const n = new Date(); return new Date(n.getFullYear() - (min + Math.floor(Math.random() * (max - min))), Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28)) }

export async function GET() {
  try {
    const existing = await prisma.user.findFirst({ where: { email: { startsWith: "p" } } })
    if (existing) return NextResponse.json({ success: true, message: "Already seeded" })

    let c = 0
    for (let i = 0; i < 50; i++) {
      const isMale = i < 25
      const name = isMale ? mNames[i] : fNames[i - 25]
      const dist = rand(districts)
      const photoId = (i % 69) + 1
      await prisma.user.create({
        data: {
          email: `p${i + 1}@kv.com`,
          role: isMale ? "GROOM" : "BRIDE",
          isActive: true, isBlocked: false, isAdminApproved: true,
          isVerified: Math.random() > 0.3,
          isPremium: i < 8,
          profileComplete: 100,
          profile: {
            create: {
              gender: (isMale ? "MALE" : "FEMALE") as any,
              fullNameMr: name,
              fullNameEn: name,
              dateOfBirth: dob(),
              height: 155 + Math.floor(Math.random() * 30),
              religion: rand(religions) as any,
              caste: rand(castes) as any,
              motherTongue: "Marathi",
              maritalStatus: "NEVER_MARRIED" as any,
              education: rand(["engineering", "medical", "graduate", "postgraduate"]),
              occupation: rand(["Teacher", "Engineer", "Doctor", "Farmer", "Business", "Govt Officer", "Bank Mgr", "Developer", "Professor", "Lawyer"]),
              income: rand(["₹2-4L", "₹4-6L", "₹6-8L", "₹8-12L", "₹12L+"]),
              village: rand(villages),
              taluka: rand(talukas[dist]) as any,
              district: dist as any,
              state: "Maharashtra",
              country: "India",
              nativePlace: rand(villages),
              aboutMe: isMale ? `नमस्कार, मी ${name}.` : `नमस्कार, मी ${name}.`,
              expectations: "प्रामाणिक, शिक्षित जोडीदार.",
              isManglik: Math.random() > 0.7,
            },
          },
          photos: {
            create: [
              { url: `https://i.pravatar.cc/400?img=${photoId}`, isPrimary: true, isApproved: true },
              { url: `https://i.pravatar.cc/400?img=${(photoId % 69) + 1}`, isPrimary: false, isApproved: true },
            ],
          },
        },
      })
      c++
    }
    return NextResponse.json({ success: true, message: `${c} profiles seeded` })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
