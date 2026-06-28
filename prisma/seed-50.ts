import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const districts = ["JALGAON", "DHULE", "NANDURBAR", "NASHIK_NORTH"]
const talukasByDistrict: Record<string, string[]> = {
  JALGAON: ["CHOPDA", "YAVAL", "RAIVER", "BHUSAWAL", "JAMNER", "ERANDOL", "AMALNER", "MALEK"],
  DHULE: ["DHULE", "SHIRPUR", "SINDKHEDA", "SAKRI"],
  NANDURBAR: ["NANDURBAR", "NAVAPUR", "TALODA"],
  NASHIK_NORTH: ["BAGLAN", "KALWAN", "SURGANA", "PETH", "TRIMBAK", "IGATPURI", "NASHIK", "NIPHAD", "SINNAR", "DINDORI", "CHANDWAD"],
}
const religions = ["HINDU", "MUSLIM", "BUDDHIST", "JAIN", "CHRISTIAN", "SIKH"]
const castes = ["MARATHA", "LEVA_PATIL", "KUNBI", "MALI", "BRAHMIN", "DHANGAR", "SUTAR", "SONAR", "TELI", "WANI", "LINGAYAT", "RAJPUT", "VANJARI", "AHIRE", "OTHER"]
const educations = ["engineering", "medical", "graduate", "postgraduate"]
const occupations = [
  "Teacher", "Engineer", "Doctor", "Farmer", "Business Owner", "Government Officer",
  "Bank Manager", "Software Developer", "Professor", "Lawyer", "Accountant", "Police Officer",
  "Agricultural Scientist", "Social Worker", "Pharmacist", "Architect", "Journalist", "Nurse",
]

const maleNames = [
  { en: "Amit Patil", mr: "अमित पाटील" }, { en: "Sachin Deshmukh", mr: "सचिन देशमुख" },
  { en: "Rahul Jadhav", mr: "राहुल जाधव" }, { en: "Vikas Pawar", mr: "विकास पवार" },
  { en: "Sunil More", mr: "सुनील मोरे" }, { en: "Deepak Shinde", mr: "दीपक शिंदे" },
  { en: "Nitin Mahajan", mr: "नितीन महाजन" }, { en: "Pravin Aher", mr: "प्रवीण आहिर" },
  { en: "Manoj Bari", mr: "मनोज बारी" }, { en: "Santosh Gaikwad", mr: "संतोष गायकवाड" },
  { en: "Rajesh Kulkarni", mr: "राजेश कुलकर्णी" }, { en: "Kiran Joshi", mr: "किरण जोशी" },
  { en: "Vijay Salunkhe", mr: "विजय साळुंखे" }, { en: "Anil Bagul", mr: "अनिल बागुल" },
  { en: "Ganesh Borse", mr: "गणेश बोरसे" }, { en: "Mahesh Sonawane", mr: "महेश सोनवणे" },
  { en: "Sagar Wagh", mr: "सागर वाघ" }, { en: "Prasad Bhalerao", mr: "प्रसाद भालेराव" },
  { en: "Hrishikesh Giri", mr: "हृषिकेश गिरी" }, { en: "Omkar Chavan", mr: "ओंकार चव्हाण" },
  { en: "Shubham Khairnar", mr: "शुभम खैरनार" }, { en: "Yogesh Deore", mr: "योगेश देवरे" },
  { en: "Rohan Mahale", mr: "रोहन महाले" }, { en: "Siddharth Narkhede", mr: "सिद्धार्थ नरखेडे" },
  { en: "Akash Baviskar", mr: "आकाश बाविस्कर" },
]

const femaleNames = [
  { en: "Priya Patil", mr: "प्रिया पाटील" }, { en: "Sneha Deshmukh", mr: "स्नेहा देशमुख" },
  { en: "Anita Jadhav", mr: "अनिता जाधव" }, { en: "Manisha Pawar", mr: "मनीषा पवार" },
  { en: "Shweta More", mr: "श्वेता मोरे" }, { en: "Kavita Shinde", mr: "कविता शिंदे" },
  { en: "Neha Mahajan", mr: "नेहा महाजन" }, { en: "Pooja Aher", mr: "पूजा आहिर" },
  { en: "Rupali Bari", mr: "रुपाली बारी" }, { en: "Sonal Gaikwad", mr: "सोनल गायकवाड" },
  { en: "Tejaswini Kulkarni", mr: "तेजस्विनी कुलकर्णी" }, { en: "Vaishali Joshi", mr: "वैशाली जोशी" },
  { en: "Pallavi Salunkhe", mr: "पल्लवी साळुंखे" }, { en: "Sakshi Bagul", mr: "साक्षी बागुल" },
  { en: "Renuka Borse", mr: "रेणुका बोरसे" }, { en: "Swati Sonawane", mr: "स्वाती सोनवणे" },
  { en: "Sayali Wagh", mr: "सायली वाघ" }, { en: "Aishwarya Bhalerao", mr: "ऐश्वर्या भालेराव" },
  { en: "Janhavi Giri", mr: "जान्हवी गिरी" }, { en: "Shruti Chavan", mr: "श्रुती चव्हाण" },
  { en: "Nikita Khairnar", mr: "निकिता खैरनार" }, { en: "Komal Deore", mr: "कोमल देवरे" },
  { en: "Rutuja Mahale", mr: "रुतुजा महाले" }, { en: "Mrunal Narkhede", mr: "मृणाल नरखेडे" },
  { en: "Aditi Baviskar", mr: "अदिती बाविस्कर" },
]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomAge(min = 22, max = 42) {
  const now = new Date()
  const years = min + Math.floor(Math.random() * (max - min))
  return new Date(now.getFullYear() - years, Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28))
}

function randomHeight(): number {
  return 150 + Math.floor(Math.random() * 35)
}

async function main() {
  console.log("Seeding 50 profiles...")

  // Clean test users created earlier
  await prisma.photo.deleteMany({ where: { user: { email: { startsWith: "test" } } } })
  await prisma.interest.deleteMany({ where: { OR: [{ sender: { email: { startsWith: "test" } } }, { receiver: { email: { startsWith: "test" } } }] } })
  await prisma.profile.deleteMany({ where: { user: { email: { startsWith: "test" } } } })
  await prisma.user.deleteMany({ where: { email: { startsWith: "test" } } })

  let created = 0
  for (let i = 0; i < 50; i++) {
    const isMale = i < 25
    const name = isMale ? maleNames[i] : femaleNames[i - 25]
    const gender = isMale ? "MALE" : "FEMALE"
    const role = isMale ? "GROOM" : "BRIDE"
    const district = randomItem(districts)
    const taluka = randomItem(talukasByDistrict[district])
    const religion = randomItem(religions)
    const caste = randomItem(castes)
    const education = randomItem(educations)
    const occupation = randomItem(occupations)
    const age = randomAge(22, 40)
    const height = randomHeight()
    const income = ["₹2,00,000 - ₹4,00,000", "₹4,00,000 - ₹6,00,000", "₹6,00,000 - ₹8,00,000", "₹8,00,000 - ₹12,00,000", "₹12,00,000+"]
    const villages = ["Mhasawad", "Dondaicha", "Chopda", "Shirpur", "Navapur", "Sakri", "Bhusawal", "Jalgaon", "Dhule", "Nandurbar", "Amalner", "Pahur", "Songir", "Kusumba", "Laling"]
    const foodPrefs = ["VEGETARIAN", "NON_VEGETARIAN", "EGGITARIAN", "JAIN", "VEGAN"]
    const familyTypes = ["NUCLEAR", "JOINT"]
    const familyStatuses = ["MIDDLE_CLASS", "UPPER_MIDDLE_CLASS", "RICH"]
    const martialStatuses = ["NEVER_MARRIED", "DIVORCED", "WIDOWED"]

    const photoIndex = (i % 69) + 1

    try {
      await prisma.user.create({
        data: {
          email: `profile${i + 1}@khandeshvivah.com`,
          role,
          isActive: true,
          isBlocked: false,
          isAdminApproved: true,
          isVerified: Math.random() > 0.3,
          isPremium: i < 8,
          profileComplete: 100,
          profileViews: Math.floor(Math.random() * 150),
          profile: {
            create: {
              gender: gender as any,
              fullNameMr: name.mr,
              fullNameEn: name.en,
              dateOfBirth: age,
              height,
              weight: height - 100 + Math.floor(Math.random() * 15),
              religion: religion as any,
              caste: caste as any,
              subCaste: "",
              motherTongue: "Marathi",
              maritalStatus: randomItem(martialStatuses) as any,
              education,
              occupation,
              income: randomItem(income),
              address: `${villages[i % villages.length]}, ${district.charAt(0) + district.slice(1).toLowerCase().replace("_", " ")}`,
              village: villages[i % villages.length],
              taluka: taluka as any,
              district: district as any,
              state: "Maharashtra",
              country: "India",
              nativePlace: villages[i % villages.length],
              aboutMe: isMale
                ? `नमस्कार, मी ${name.mr}. मूळचा ${district === "NASHIK_NORTH" ? "नाशिक" : district === "JALGAON" ? "जळगाव" : district === "DHULE" ? "धुळे" : "नंदुरबार"} चा. ${occupation} म्हणून कार्यरत आहे. प्रामाणिकपणा आणि कुटुंब मूल्यांवर विश्वास ठेवतो.`
                : `नमस्कार, मी ${name.mr}. मूळची ${district === "NASHIK_NORTH" ? "नाशिक" : district === "JALGAON" ? "जळगाव" : district === "DHULE" ? "धुळे" : "नंदुरबार"} ची. ${occupation} आहे. संस्कारक्षम, शिक्षित आणि कुटुंबाभिमुख जोडीदाराच्या शोधात आहे.`,
              expectations: "प्रामाणिक, शिक्षित, नोकरी/व्यवसाय करणारा/करणारी, कुटुंबाभिमुख जोडीदार हवा/हवी आहे.",
              isManglik: Math.random() > 0.7,
              photoPrivacy: false,
              showContact: isMale && Math.random() > 0.5,
            },
          },
          family: {
            create: {
              fatherName: isMale ? `श्री. ${name.en.split(" ")[1]}राव ${name.en.split(" ")[0]}` : `श्री. ${name.en.split(" ")[1]}राव ${name.en.split(" ")[0]}`,
              motherName: isMale ? `श्रीमती. ${name.en.split(" ")[1]}बाई` : `श्रीमती. ${name.en.split(" ")[1]}बाई`,
              brothers: Math.floor(Math.random() * 3),
              sisters: Math.floor(Math.random() * 3),
              familyType: randomItem(familyTypes) as any,
              familyStatus: randomItem(familyStatuses) as any,
              familyOrigin: district === "NASHIK_NORTH" ? "नाशिक" : district,
              agriculture: Math.random() > 0.5,
              business: Math.random() > 0.6,
              govEmployee: Math.random() > 0.7,
            },
          },
          photos: {
            create: [
              { url: `https://i.pravatar.cc/400?img=${photoIndex}`, isPrimary: true, isApproved: true },
              { url: `https://i.pravatar.cc/400?img=${(photoIndex % 69) + 1}`, isPrimary: false, isApproved: true },
              { url: `https://i.pravatar.cc/400?img=${(photoIndex + 10) % 70 + 1}`, isPrimary: false, isApproved: true },
            ],
          },
          lifestyle: {
            create: {
              foodPreference: randomItem(foodPrefs) as any,
              smoking: Math.random() > 0.8,
              drinking: Math.random() > 0.75,
              hobbies: isMale ? "क्रिकेट, वाचन, प्रवास" : "स्वयंपाक, गायन, बागकाम",
            },
          },
          horoscope: {
            create: {
              nakshatra: (["ASHWINI", "ROHINI", "MAGHA", "HASTA", "ANURADHA", "SHRAVANA", "REVATI", "PUSHYA", "CHITRA", "MULA"] as any)[i % 10],
              raashi: (["MESH", "KANYA", "TULA", "VRISHCHIK", "MAKAR", "KUMBH", "MEEN", "DHANUSH", "MITHUN", "KARK"] as any)[i % 10],
              manglik: Math.random() > 0.7,
            },
          },
        },
      })
      created++
      if (created % 10 === 0) console.log(`  ${created}/50 profiles created`)
    } catch (err) {
      console.error(`  Failed on profile ${i + 1}:`, (err as any).message)
    }
  }
  console.log(`Done. ${created} profiles seeded.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
