import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

const hash = (pw: string) =>
  createHash("sha256").update(pw).digest("hex");

async function main() {
  console.log("🌱 Seeding Khandesh Vivah database...");

  // Clean existing data
  await prisma.ticketResponse.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.successStory.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.report.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.shortlist.deleteMany();
  await prisma.message.deleteMany();
  await prisma.interest.deleteMany();
  await prisma.document.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.lifestyle.deleteMany();
  await prisma.horoscope.deleteMany();
  await prisma.family.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.oTP.deleteMany();
  await prisma.user.deleteMany();

  const defaultHash = hash("Admin@123");

  // ─── USERS ────────────────────────────────────────────────────────────

  const admin = await prisma.user.create({
    data: {
      email: "admin@khandeshvivah.com",
      mobile: "9876543210",
      password: defaultHash,
      role: "SUPER_ADMIN",
      membershipTier: "VIP",
      verification: "VERIFIED",
      isVerified: true,
      isPremium: true,
      isAdminApproved: true,
      profileComplete: 100,
      profileViews: 1247,
    },
  });

  const moderator = await prisma.user.create({
    data: {
      email: "mod@khandeshvivah.com",
      mobile: "9876543211",
      password: defaultHash,
      role: "MODERATOR",
      membershipTier: "PREMIUM_PLUS",
      verification: "VERIFIED",
      isVerified: true,
      isPremium: true,
      isAdminApproved: true,
      profileComplete: 100,
    },
  });

  // Bride 1 – Leva Patil, Jalgaon
  const bride1 = await prisma.user.create({
    data: {
      email: "priya.patil@example.com",
      mobile: "9123456001",
      role: "BRIDE",
      membershipTier: "PREMIUM",
      verification: "VERIFIED",
      isVerified: true,
      isPremium: true,
      isAdminApproved: true,
      profileComplete: 90,
      profileViews: 342,
    },
  });

  // Bride 2 – Maratha, Dhule
  const bride2 = await prisma.user.create({
    data: {
      email: "swati.deshmukh@example.com",
      mobile: "9123456002",
      role: "BRIDE",
      membershipTier: "FREE",
      verification: "VERIFIED",
      isVerified: true,
      isAdminApproved: true,
      profileComplete: 75,
      profileViews: 186,
    },
  });

  // Bride 3 – Kunbi, Nandurbar
  const bride3 = await prisma.user.create({
    data: {
      email: "rutuja.borse@example.com",
      mobile: "9123456003",
      role: "BRIDE",
      membershipTier: "FREE",
      verification: "NOT_SUBMITTED",
      isVerified: false,
      isAdminApproved: true,
      profileComplete: 60,
      profileViews: 93,
    },
  });

  // Bride 4 – Mali, Nashik
  const bride4 = await prisma.user.create({
    data: {
      email: "pooja.mali@example.com",
      mobile: "9123456004",
      role: "BRIDE",
      membershipTier: "PREMIUM_PLUS",
      verification: "VERIFIED",
      isVerified: true,
      isPremium: true,
      isAdminApproved: true,
      profileComplete: 95,
      profileViews: 521,
    },
  });

  // Groom 1 – Leva Patil, Jalgaon
  const groom1 = await prisma.user.create({
    data: {
      email: "amit.patil@example.com",
      mobile: "9123456101",
      role: "GROOM",
      membershipTier: "PREMIUM",
      verification: "VERIFIED",
      isVerified: true,
      isPremium: true,
      isAdminApproved: true,
      profileComplete: 90,
      profileViews: 412,
    },
  });

  // Groom 2 – Maratha, Dhule
  const groom2 = await prisma.user.create({
    data: {
      email: "rohit.deore@example.com",
      mobile: "9123456102",
      role: "GROOM",
      membershipTier: "FREE",
      verification: "VERIFIED",
      isVerified: true,
      isAdminApproved: true,
      profileComplete: 80,
      profileViews: 267,
    },
  });

  // Groom 3 – Brahmin, Nashik
  const groom3 = await prisma.user.create({
    data: {
      email: "sagar.joshi@example.com",
      mobile: "9123456103",
      role: "GROOM",
      membershipTier: "FREE",
      verification: "PENDING",
      isVerified: false,
      isAdminApproved: true,
      profileComplete: 70,
      profileViews: 154,
    },
  });

  // Groom 4 – Kunbi, Nandurbar
  const groom4 = await prisma.user.create({
    data: {
      email: "vijay.borse@example.com",
      mobile: "9123456104",
      role: "GROOM",
      membershipTier: "PREMIUM_PLUS",
      verification: "VERIFIED",
      isVerified: true,
      isPremium: true,
      isAdminApproved: true,
      profileComplete: 85,
      profileViews: 389,
    },
  });

  // ─── PROFILES ─────────────────────────────────────────────────────────

  // Admin / Mod profiles
  await prisma.profile.create({
    data: {
      userId: admin.id,
      gender: "MALE",
      fullNameMr: "प्रशासक",
      fullNameEn: "Admin Khandesh Vivah",
      religion: "HINDU",
      caste: "BRAHMIN",
      motherTongue: "मराठी",
      maritalStatus: "NEVER_MARRIED",
    },
  });

  await prisma.profile.create({
    data: {
      userId: moderator.id,
      gender: "MALE",
      fullNameMr: "मॉडरेटर",
      fullNameEn: "Moderator Khandesh",
      religion: "HINDU",
      caste: "LEVA_PATIL",
      motherTongue: "मराठी",
      maritalStatus: "NEVER_MARRIED",
    },
  });

  // Bride 1 – Priya Patil
  await prisma.profile.create({
    data: {
      userId: bride1.id,
      gender: "FEMALE",
      fullNameMr: "प्रिया पाटील",
      fullNameEn: "Priya Patil",
      dateOfBirth: new Date("1998-06-15"),
      height: 160,
      weight: 55,
      religion: "HINDU",
      caste: "LEVA_PATIL",
      subCaste: "पाटील",
      motherTongue: "मराठी",
      maritalStatus: "NEVER_MARRIED",
      education: "B.Sc. Nursing",
      educationDetail: "M.Sc. Nursing (Pursuing)",
      occupation: "Staff Nurse",
      occupationDetail: "Civil Hospital, Jalgaon",
      income: "₹3,00,000 - ₹4,00,000",
      address: "Shivaji Nagar, Jalgaon",
      village: "मेहूणे",
      taluka: "JAMNER",
      district: "JALGAON",
      state: "Maharashtra",
      country: "India",
      nativePlace: "जळगाव",
      aboutMe:
        "मी एक साधी, प्रामाणिक आणि कुटुंबाभिमुख मुलगी आहे. मला परिचारिका म्हणून सेवा करताना आनंद मिळतो. मला वाचन, गाणे आणि स्वयंपाकाचा छंद आहे.",
      expectations:
        "मी एक सुशिक्षित, प्रामाणिक आणि कर्तव्यदक्ष जोडीदार शोधत आहे. त्याने माझ्या कुटुंबाला समजून घेणारा आणि आदर देणारा असावा.",
      isManglik: false,
      showContact: true,
    },
  });

  // Bride 2 – Swati Deshmukh
  await prisma.profile.create({
    data: {
      userId: bride2.id,
      gender: "FEMALE",
      fullNameMr: "स्वाती देशमुख",
      fullNameEn: "Swati Deshmukh",
      dateOfBirth: new Date("1996-03-22"),
      height: 158,
      weight: 52,
      religion: "HINDU",
      caste: "MARATHA",
      subCaste: "देशमुख",
      motherTongue: "मराठी",
      maritalStatus: "NEVER_MARRIED",
      education: "M.Com",
      educationDetail: "B.Ed",
      occupation: "Teacher",
      occupationDetail: "Zilla Parishad School, Dhule",
      income: "₹2,50,000 - ₹3,50,000",
      address: "Mahatma Nagar, Dhule",
      village: "शिरपूर",
      taluka: "SHIRPUR",
      district: "DHULE",
      state: "Maharashtra",
      country: "India",
      nativePlace: "धुळे",
      aboutMe:
        "मला शिक्षणक्षेत्रात कार्य करताना खूप आनंद मिळतो. मी संगीत आणि नृत्याची आवड आहे. मी कुटुंबाभिमुख आणि साधी आहे.",
      expectations:
        "मी एक चांगले शिक्षित, नोकरी करणारा आणि कुटुंबाभिमुख जोडीदार शोधत आहे.",
      isManglik: true,
      showContact: false,
    },
  });

  // Bride 3 – Rutuja Borse
  await prisma.profile.create({
    data: {
      userId: bride3.id,
      gender: "FEMALE",
      fullNameMr: "रुतुजा बोरसे",
      fullNameEn: "Rutuja Borse",
      dateOfBirth: new Date("2000-11-10"),
      height: 155,
      weight: 50,
      religion: "HINDU",
      caste: "KUNBI",
      motherTongue: "मराठी",
      maritalStatus: "NEVER_MARRIED",
      education: "BA",
      occupation: "Home Maker",
      occupationDetail: "ग्रामोद्योग",
      income: "₹1,00,000 - ₹2,00,000",
      address: "Nandurbar",
      village: "नवापूर",
      taluka: "NAVAPUR",
      district: "NANDURBAR",
      state: "Maharashtra",
      country: "India",
      nativePlace: "नंदुरबार",
      aboutMe:
        "मी शेती कुटुंबातील साधी मुलगी. मला ग्रामीण जीवनाची आवड आहे. मी शिवणकाम आणि स्वयंपाकात हुशार आहे.",
      expectations:
        "मला एक प्रामाणिक, शेती किंवा व्यवसाय करणारा जोडीदार हवा आहे.",
      isManglik: true,
    },
  });

  // Bride 4 – Pooja Mali
  await prisma.profile.create({
    data: {
      userId: bride4.id,
      gender: "FEMALE",
      fullNameMr: "पूजा माळी",
      fullNameEn: "Pooja Mali",
      dateOfBirth: new Date("1995-09-05"),
      height: 163,
      weight: 57,
      religion: "HINDU",
      caste: "MALI",
      motherTongue: "मराठी",
      maritalStatus: "DIVORCED",
      education: "MBA Marketing",
      educationDetail: "MBA",
      occupation: "Business Development Manager",
      occupationDetail: "Private Company, Nashik",
      income: "₹6,00,000 - ₹8,00,000",
      address: "Gangapur Road, Nashik",
      village: "दिंडोरी",
      taluka: "DINDORI",
      district: "NASHIK_NORTH",
      state: "Maharashtra",
      country: "India",
      nativePlace: "नाशिक",
      aboutMe:
        "मी एक आत्मविश्वासी, स्वावलंबी आणि मैत्रीपूर्ण व्यक्ती आहे. मला प्रवास, नवीन लोक भेटणे आणि वाचन आवडते. माझा भूतकाळ माझ्या भविष्याचा निकष नाही.",
      expectations:
        "मी एक प्रगत विचारसरणीचा, प्रामाणिक आणि माझ्या भूतकाळाला स्वीकारणारा जोडीदार शोधत आहे.",
      isManglik: false,
      showContact: true,
    },
  });

  // Groom 1 – Amit Patil
  await prisma.profile.create({
    data: {
      userId: groom1.id,
      gender: "MALE",
      fullNameMr: "अमित पाटील",
      fullNameEn: "Amit Patil",
      dateOfBirth: new Date("1994-01-20"),
      height: 175,
      weight: 72,
      religion: "HINDU",
      caste: "LEVA_PATIL",
      subCaste: "पाटील",
      motherTongue: "मराठी",
      maritalStatus: "NEVER_MARRIED",
      education: "BE Computer Science",
      educationDetail: "BE",
      occupation: "Software Engineer",
      occupationDetail: "TCS, Pune",
      income: "₹10,00,000 - ₹12,00,000",
      address: "Pimple Saudagar, Pune",
      village: "यावल",
      taluka: "YAVAL",
      district: "JALGAON",
      state: "Maharashtra",
      country: "India",
      nativePlace: "यावल",
      aboutMe:
        "मी सॉफ्टवेअर इंजिनिअर आहे. पुण्यात नोकरी करतो. मला संगीत, फोटोग्राफी आणि ट्रेकिंगची आवड आहे. मी कुटुंबाभिमुख असून आईवडिलांच्या संमतीने लग्न करू इच्छितो.",
      expectations:
        "मला एक शिक्षित, करिअर करणारी आणि कुटुंबाभिमुख मुलगी हवी आहे.",
      isManglik: false,
      showContact: true,
    },
  });

  // Groom 2 – Rohit Deore
  await prisma.profile.create({
    data: {
      userId: groom2.id,
      gender: "MALE",
      fullNameMr: "रोहित देओरे",
      fullNameEn: "Rohit Deore",
      dateOfBirth: new Date("1992-07-14"),
      height: 170,
      weight: 68,
      religion: "HINDU",
      caste: "MARATHA",
      motherTongue: "मराठी",
      maritalStatus: "NEVER_MARRIED",
      education: "B.Com",
      educationDetail: "D.Ed",
      occupation: "Teacher",
      occupationDetail: "Private School, Dhule",
      income: "₹2,00,000 - ₹3,00,000",
      address: "Shahid Chowk, Dhule",
      village: "बोराडी",
      taluka: "DHULE",
      district: "DHULE",
      state: "Maharashtra",
      country: "India",
      nativePlace: "धुळे",
      aboutMe:
        "मी एक शिक्षक आहे. मला मुलांना शिकवण्याचे वेड आहे. मी साधा, प्रामाणिक आणि कुटुंबाभिमुख आहे. माझे वडील शेतकरी आहेत.",
      expectations:
        "मी एक सुसंस्कारित, शिक्षणक्षेत्रात रुची असलेली किंवा गृहिणी जोडीदार हवी आहे.",
      isManglik: false,
    },
  });

  // Groom 3 – Sagar Joshi
  await prisma.profile.create({
    data: {
      userId: groom3.id,
      gender: "MALE",
      fullNameMr: "सागर जोशी",
      fullNameEn: "Sagar Joshi",
      dateOfBirth: new Date("1993-12-01"),
      height: 168,
      weight: 65,
      religion: "HINDU",
      caste: "BRAHMIN",
      motherTongue: "मराठी",
      maritalStatus: "NEVER_MARRIED",
      education: "LLB",
      educationDetail: "LLB",
      occupation: "Lawyer",
      occupationDetail: "District Court, Nashik",
      income: "₹5,00,000 - ₹7,00,000",
      address: "Panchavati, Nashik",
      village: "त्र्यंबकेश्वर",
      taluka: "TRIMBAK",
      district: "NASHIK_NORTH",
      state: "Maharashtra",
      country: "India",
      nativePlace: "नाशिक",
      aboutMe:
        "मी वकील आहे. कायदा आणि न्यायक्षेत्रात कार्यरत आहे. मला वाचन, भाषण आणि सामाजिक कार्य करण्याची आवड आहे. मी शाकाहारी आहे.",
      expectations:
        "मला एक शिक्षित, संस्कारी आणि ब्राह्मण कुळातील मुलगी हवी आहे.",
      isManglik: true,
    },
  });

  // Groom 4 – Vijay Borse
  await prisma.profile.create({
    data: {
      userId: groom4.id,
      gender: "MALE",
      fullNameMr: "विजय बोरसे",
      fullNameEn: "Vijay Borse",
      dateOfBirth: new Date("1990-05-18"),
      height: 172,
      weight: 75,
      religion: "HINDU",
      caste: "KUNBI",
      motherTongue: "मराठी",
      maritalStatus: "NEVER_MARRIED",
      education: "B.Sc. Agriculture",
      educationDetail: "B.Sc. Agriculture",
      occupation: "Farmer & Agri Business",
      occupationDetail: "Owner, Borse Agro Products",
      income: "₹8,00,000 - ₹10,00,000",
      address: "Shahada Road, Nandurbar",
      village: "शहादा",
      taluka: "NANDURBAR",
      district: "NANDURBAR",
      state: "Maharashtra",
      country: "India",
      nativePlace: "नंदुरबार",
      aboutMe:
        "मी शेती व्यवसायिक आहे. आधुनिक शेतीतंत्रज्ञानाचा वापर करून शेती करतो. मला प्रामाणिकपणा आणि मेहनतीवर विश्वास आहे.",
      expectations:
        "मला शेती समजून घेणारी, कुटुंबाभिमुख आणि साधी जोडीदार हवी आहे.",
      isManglik: false,
      showContact: true,
    },
  });

  // ─── FAMILIES ─────────────────────────────────────────────────────────

  await prisma.family.create({
    data: {
      userId: bride1.id,
      fatherName: "Suresh Patil",
      motherName: "Manisha Patil",
      brothers: 1,
      sisters: 0,
      familyType: "NUCLEAR",
      familyStatus: "UPPER_MIDDLE_CLASS",
      familyOrigin: "जळगाव",
      agriculture: true,
      govEmployee: false,
    },
  });

  await prisma.family.create({
    data: {
      userId: bride2.id,
      fatherName: "Vijay Deshmukh",
      motherName: "Asha Deshmukh",
      brothers: 2,
      sisters: 1,
      familyType: "JOINT",
      familyStatus: "MIDDLE_CLASS",
      familyOrigin: "धुळे",
      agriculture: true,
      business: false,
    },
  });

  await prisma.family.create({
    data: {
      userId: bride3.id,
      fatherName: "Kishor Borse",
      motherName: "Sunita Borse",
      brothers: 1,
      sisters: 2,
      familyType: "JOINT",
      familyStatus: "MIDDLE_CLASS",
      familyOrigin: "नंदुरबार",
      agriculture: true,
    },
  });

  await prisma.family.create({
    data: {
      userId: bride4.id,
      fatherName: "Ram Mali",
      motherName: "Kavita Mali",
      brothers: 0,
      sisters: 1,
      familyType: "NUCLEAR",
      familyStatus: "UPPER_MIDDLE_CLASS",
      familyOrigin: "नाशिक",
      business: true,
    },
  });

  await prisma.family.create({
    data: {
      userId: groom1.id,
      fatherName: "Dilip Patil",
      motherName: "Sarita Patil",
      brothers: 1,
      sisters: 1,
      familyType: "NUCLEAR",
      familyStatus: "UPPER_MIDDLE_CLASS",
      familyOrigin: "यावल",
      agriculture: true,
    },
  });

  await prisma.family.create({
    data: {
      userId: groom2.id,
      fatherName: "Shankar Deore",
      motherName: "Lata Deore",
      brothers: 2,
      sisters: 0,
      familyType: "JOINT",
      familyStatus: "MIDDLE_CLASS",
      familyOrigin: "धुळे",
      agriculture: true,
    },
  });

  await prisma.family.create({
    data: {
      userId: groom3.id,
      fatherName: "Ganesh Joshi",
      motherName: "Neeta Joshi",
      brothers: 0,
      sisters: 1,
      familyType: "NUCLEAR",
      familyStatus: "UPPER_MIDDLE_CLASS",
      familyOrigin: "नाशिक",
      govEmployee: true,
    },
  });

  await prisma.family.create({
    data: {
      userId: groom4.id,
      fatherName: "Madhukar Borse",
      motherName: "Vanita Borse",
      brothers: 1,
      sisters: 2,
      familyType: "JOINT",
      familyStatus: "RICH",
      familyOrigin: "नंदुरबार",
      agriculture: true,
      business: true,
    },
  });

  // ─── HOROSCOPES ───────────────────────────────────────────────────────

  await prisma.horoscope.create({
    data: {
      userId: bride1.id,
      nakshatra: "REVATI",
      raashi: "MEEN",
      manglik: false,
    },
  });

  await prisma.horoscope.create({
    data: {
      userId: bride2.id,
      nakshatra: "ASHWINI",
      raashi: "MESH",
      manglik: true,
    },
  });

  await prisma.horoscope.create({
    data: {
      userId: bride3.id,
      nakshatra: "PURVA_PHALGUNI",
      raashi: "SIMHA",
      manglik: true,
    },
  });

  await prisma.horoscope.create({
    data: {
      userId: bride4.id,
      nakshatra: "CHITRA",
      raashi: "KANYA",
      manglik: false,
    },
  });

  await prisma.horoscope.create({
    data: {
      userId: groom1.id,
      nakshatra: "UTTARA_PHALGUNI",
      raashi: "SIMHA",
      manglik: false,
    },
  });

  await prisma.horoscope.create({
    data: {
      userId: groom2.id,
      nakshatra: "MRIGASHIRA",
      raashi: "MITHUN",
      manglik: false,
    },
  });

  await prisma.horoscope.create({
    data: {
      userId: groom3.id,
      nakshatra: "PUSHYA",
      raashi: "KARK",
      manglik: true,
    },
  });

  await prisma.horoscope.create({
    data: {
      userId: groom4.id,
      nakshatra: "DHANISHTA",
      raashi: "KUMBH",
      manglik: false,
    },
  });

  // ─── LIFESTYLES ──────────────────────────────────────────────────────

  await prisma.lifestyle.create({
    data: {
      userId: bride1.id,
      foodPreference: "VEGETARIAN",
      smoking: false,
      drinking: false,
      hobbies: "वाचन, स्वयंपाक, भजन",
      interests: "संगीत, बागकाम",
    },
  });

  await prisma.lifestyle.create({
    data: {
      userId: bride2.id,
      foodPreference: "VEGETARIAN",
      smoking: false,
      drinking: false,
      hobbies: "नृत्य, गायन, वाचन",
      interests: "शिक्षण, समाजसेवा",
    },
  });

  await prisma.lifestyle.create({
    data: {
      userId: bride3.id,
      foodPreference: "VEGETARIAN",
      smoking: false,
      drinking: false,
      hobbies: "शिवणकाम, स्वयंपाक",
      interests: "शेती, ग्रामीण विकास",
    },
  });

  await prisma.lifestyle.create({
    data: {
      userId: bride4.id,
      foodPreference: "NON_VEGETARIAN",
      smoking: false,
      drinking: true,
      hobbies: "प्रवास, फोटोग्राफी, वाचन",
      interests: "व्यवसाय, क्रीडा",
    },
  });

  await prisma.lifestyle.create({
    data: {
      userId: groom1.id,
      foodPreference: "VEGETARIAN",
      smoking: false,
      drinking: false,
      hobbies: "फोटोग्राफी, ट्रेकिंग, संगीत",
      interests: "तंत्रज्ञान, गाड्या",
    },
  });

  await prisma.lifestyle.create({
    data: {
      userId: groom2.id,
      foodPreference: "VEGETARIAN",
      smoking: false,
      drinking: false,
      hobbies: "वाचन, बागकाम, क्रिकेट",
      interests: "शेती, शिक्षण",
    },
  });

  await prisma.lifestyle.create({
    data: {
      userId: groom3.id,
      foodPreference: "VEGETARIAN",
      smoking: false,
      drinking: false,
      hobbies: "वाचन, भाषण, सामाजिक कार्य",
      interests: "कायदा, राजकारण",
    },
  });

  await prisma.lifestyle.create({
    data: {
      userId: groom4.id,
      foodPreference: "VEGETARIAN",
      smoking: false,
      drinking: false,
      hobbies: "शेती, व्यवसाय, व्यायाम",
      interests: "आधुनिक शेती, agri-business",
    },
  });

  // ─── PHOTOS ───────────────────────────────────────────────────────────

  const photoUrls = {
    bride1: [
      "https://randomuser.me/api/portraits/women/1.jpg",
      "https://randomuser.me/api/portraits/women/2.jpg",
    ],
    bride2: [
      "https://randomuser.me/api/portraits/women/3.jpg",
    ],
    bride3: [
      "https://randomuser.me/api/portraits/women/4.jpg",
    ],
    bride4: [
      "https://randomuser.me/api/portraits/women/5.jpg",
      "https://randomuser.me/api/portraits/women/6.jpg",
    ],
    groom1: [
      "https://randomuser.me/api/portraits/men/1.jpg",
      "https://randomuser.me/api/portraits/men/2.jpg",
    ],
    groom2: [
      "https://randomuser.me/api/portraits/men/3.jpg",
    ],
    groom3: [
      "https://randomuser.me/api/portraits/men/4.jpg",
    ],
    groom4: [
      "https://randomuser.me/api/portraits/men/5.jpg",
    ],
  };

  for (const [url, userId] of [
    [photoUrls.bride1[0], bride1.id],
    [photoUrls.bride1[1], bride1.id],
    [photoUrls.bride2[0], bride2.id],
    [photoUrls.bride3[0], bride3.id],
    [photoUrls.bride4[0], bride4.id],
    [photoUrls.bride4[1], bride4.id],
    [photoUrls.groom1[0], groom1.id],
    [photoUrls.groom1[1], groom1.id],
    [photoUrls.groom2[0], groom2.id],
    [photoUrls.groom3[0], groom3.id],
    [photoUrls.groom4[0], groom4.id],
  ] as const) {
    await prisma.photo.create({
      data: {
        url: url!,
        userId: userId,
        isPrimary: true,
        isApproved: true,
      },
    });
  }

  // ─── INTERESTS ────────────────────────────────────────────────────────

  // Amit -> Priya (PENDING)
  const interest1 = await prisma.interest.create({
    data: {
      senderId: groom1.id,
      receiverId: bride1.id,
      status: "PENDING",
    },
  });

  // Rohit -> Swati (ACCEPTED)
  const interest2 = await prisma.interest.create({
    data: {
      senderId: groom2.id,
      receiverId: bride2.id,
      status: "ACCEPTED",
    },
  });

  // Vijay -> Rutuja (PENDING)
  await prisma.interest.create({
    data: {
      senderId: groom4.id,
      receiverId: bride3.id,
      status: "PENDING",
    },
  });

  // Sagar -> Pooja (ACCEPTED)
  const interest4 = await prisma.interest.create({
    data: {
      senderId: groom3.id,
      receiverId: bride4.id,
      status: "ACCEPTED",
    },
  });

  // Priya -> Vijay (REJECTED)
  await prisma.interest.create({
    data: {
      senderId: bride1.id,
      receiverId: groom4.id,
      status: "REJECTED",
    },
  });

  // ─── MESSAGES ─────────────────────────────────────────────────────────

  // Rohit <-> Swati (accepted)
  await prisma.message.create({
    data: {
      senderId: groom2.id,
      receiverId: bride2.id,
      content:
        "नमस्कार स्वाती, मला तुझं प्रोफाइल खूप आवडलं. आपण एकमेकांशी बोलू शकतो का?",
      createdAt: new Date("2026-05-10T09:00:00Z"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: bride2.id,
      receiverId: groom2.id,
      content:
        "नमस्कार रोहित, हो नक्की. मलाही तुमच्याशी संवाद साधण्यात आनंद होईल.",
      createdAt: new Date("2026-05-10T10:30:00Z"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: groom2.id,
      receiverId: bride2.id,
      content:
        "आपण भेटू शकतो का? मला तुझ्याशी प्रत्यक्ष बोलायला आवडेल.",
      createdAt: new Date("2026-05-11T08:00:00Z"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: bride2.id,
      receiverId: groom2.id,
      content:
        "हो नक्की. या शनिवारी आपण धुळ्यात भेटू शकतो का? कुटुंबासह.",
      createdAt: new Date("2026-05-11T14:00:00Z"),
    },
  });

  // Sagar <-> Pooja (accepted)
  await prisma.message.create({
    data: {
      senderId: groom3.id,
      receiverId: bride4.id,
      content:
        "Hi Pooja, I really appreciate your profile and your bold approach towards life. Would love to connect.",
      createdAt: new Date("2026-05-12T11:00:00Z"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: bride4.id,
      receiverId: groom3.id,
      content:
        "Thank you Sagar! I appreciate that you took the effort to read my profile properly. Tell me about yourself.",
      createdAt: new Date("2026-05-12T13:00:00Z"),
    },
  });

  await prisma.message.create({
    data: {
      senderId: groom3.id,
      receiverId: bride4.id,
      content:
        "I'm a lawyer practicing in Nashik district court. I come from a traditional Brahmin family but have modern outlook. I believe in equality and mutual respect.",
      createdAt: new Date("2026-05-12T15:00:00Z"),
    },
  });

  // ─── SHORTLISTS ──────────────────────────────────────────────────────

  await prisma.shortlist.create({
    data: { userId: groom1.id, targetId: bride1.id },
  });
  await prisma.shortlist.create({
    data: { userId: groom1.id, targetId: bride4.id },
  });
  await prisma.shortlist.create({
    data: { userId: groom2.id, targetId: bride2.id },
  });
  await prisma.shortlist.create({
    data: { userId: groom3.id, targetId: bride4.id },
  });
  await prisma.shortlist.create({
    data: { userId: groom4.id, targetId: bride3.id },
  });
  await prisma.shortlist.create({
    data: { userId: bride1.id, targetId: groom1.id },
  });
  await prisma.shortlist.create({
    data: { userId: bride4.id, targetId: groom3.id },
  });

  // ─── NOTIFICATIONS ────────────────────────────────────────────────────

  const notifications = [
    {
      userId: bride1.id,
      type: "INTEREST_RECEIVED",
      title: "नवीन संपर्क",
      message: "अमित पाटील यांनी तुम्हाला संपर्क पाठवला आहे",
    },
    {
      userId: groom1.id,
      type: "INTEREST_SENT",
      title: "संपर्क पाठवला",
      message: "तुम्ही प्रिया पाटील यांना संपर्क पाठवला आहे",
    },
    {
      userId: bride2.id,
      type: "INTEREST_ACCEPTED",
      title: "संपर्क स्वीकारला",
      message: "रोहित देओरे यांनी तुमचा संपर्क स्वीकारला आहे",
    },
    {
      userId: groom2.id,
      type: "MESSAGE_RECEIVED",
      title: "नवीन संदेश",
      message: "स्वाती देशमुख यांनी संदेश पाठवला आहे",
    },
    {
      userId: groom3.id,
      type: "INTEREST_ACCEPTED",
      title: "संपर्क स्वीकारला",
      message: "पूजा माळी यांनी तुमचा संपर्क स्वीकारला आहे",
    },
    {
      userId: bride4.id,
      type: "PROFILE_VIEW",
      title: "प्रोफाइल पाहिले",
      message: "सागर जोशी यांनी तुमचे प्रोफाइल पाहिले आहे",
    },
    {
      userId: admin.id,
      type: "NEW_USER",
      title: "नवीन सदस्य",
      message: "नवीन सदस्य नोंदणीकृत झाला आहे",
    },
    {
      userId: bride3.id,
      type: "INTEREST_RECEIVED",
      title: "नवीन संपर्क",
      message: "विजय बोरसे यांनी तुम्हाला संपर्क पाठवला आहे",
    },
    {
      userId: bride1.id,
      type: "PREMIUM_OFFER",
      title: "प्रीमियम ऑफर",
      message:
        "प्रीमियम सदस्यत्व घ्या आणि अधिक सुविधा मिळवा! फक्त ₹४९९ पासून सुरुवात.",
    },
  ];

  for (const n of notifications) {
    await prisma.notification.create({ data: n });
  }

  // ─── PAYMENTS ─────────────────────────────────────────────────────────

  await prisma.payment.create({
    data: {
      userId: groom1.id,
      amount: 999,
      currency: "INR",
      status: "SUCCESS",
      method: "UPI",
      planType: "PREMIUM",
      transactionId: "TXN_KV_001",
    },
  });

  await prisma.payment.create({
    data: {
      userId: bride1.id,
      amount: 999,
      currency: "INR",
      status: "SUCCESS",
      method: "Credit Card",
      planType: "PREMIUM",
      transactionId: "TXN_KV_002",
    },
  });

  await prisma.payment.create({
    data: {
      userId: bride4.id,
      amount: 2499,
      currency: "INR",
      status: "SUCCESS",
      method: "Net Banking",
      planType: "PREMIUM_PLUS",
      transactionId: "TXN_KV_003",
    },
  });

  await prisma.payment.create({
    data: {
      userId: groom4.id,
      amount: 2499,
      currency: "INR",
      status: "SUCCESS",
      method: "UPI",
      planType: "PREMIUM_PLUS",
      transactionId: "TXN_KV_004",
    },
  });

  await prisma.payment.create({
    data: {
      userId: admin.id,
      amount: 0,
      currency: "INR",
      status: "SUCCESS",
      method: "Admin",
      planType: "VIP",
      transactionId: "TXN_KV_ADMIN",
    },
  });

  // ─── BLOGS ────────────────────────────────────────────────────────────

  await prisma.blog.create({
    data: {
      authorId: admin.id,
      title: "खान्देशमध्ये विवाह परंपरा",
      content: `खान्देश विभागात विवाह अनेक शतकांच्या परंपरेनुसार साजरे केले जातात. लेवा पाटील, मराठा, कुणबी, माळी, ब्राह्मण अशा विविध जातींच्या स्वतःच्या खास रीतीरिवाज आहेत. प्रत्येक जातीचे वैशिष्ट्य म्हणजे त्यांचे गाणे, नृत्य आणि खानपान. या परंपरा आजही तितक्याच उत्साहाने पाळल्या जातात. खान्देशातील विवाह हे केवळ दोन व्यक्तींचे नव्हे, तर दोन कुटुंबांचे मिलन असते.`,
      slug: "khandesh-vivah-parampara",
      published: true,
      imageUrl:
        "https://picsum.photos/seed/tradition/800/400",
    },
  });

  await prisma.blog.create({
    data: {
      authorId: admin.id,
      title: "लग्नासाठी योग्य जोडीदार कसा शोधावा?",
      content: `योग्य जोडीदार शोधणे हे प्रत्येकाच्या आयुष्यातील महत्त्वाचे पाऊल आहे. खान्देश विवाह प्लॅटफॉर्म तुम्हाला तुमच्या आवडीचा जोडीदार शोधण्यात मदत करतो. प्रथम स्वतःच्या गरजा ओळखा, तुमची मते, मूल्ये आणि जीवनशैली याचा विचार करा. कुटुंबाची मते जाणून घ्या. आमच्या प्लॅटफॉर्मवर तुम्ही जात, गाव, तालुका, शिक्षण, व्यवसाय यानुसार फिल्टर करू शकता.`,
      slug: "yogya-jodidar-kasa-shodhava",
      published: true,
      imageUrl:
        "https://picsum.photos/seed/search/800/400",
    },
  });

  await prisma.blog.create({
    data: {
      authorId: admin.id,
      title: "खान्देश विवाह यशोगाथा",
      content: `खान्देश विवाह प्लॅटफॉर्मवरून आतापर्यंत १५० हून अधिक जोडपी यशस्वीरीत्या विवाहबद्ध झाली आहेत. यामध्ये जळगाव, धुळे, नंदुरबार आणि नाशिक या जिल्ह्यांतील जोडप्यांचा समावेश आहे. आमच्या यशोगाथा पहा आणि आपल्या प्रेरणा घ्या.`,
      slug: "khandesh-vivah-yashogatha",
      published: true,
    },
  });

  // ─── SUCCESS STORIES ──────────────────────────────────────────────────

  await prisma.successStory.create({
    data: {
      userId: groom1.id,
      partnerName: "अनिता पाटील",
      title: "यावल ते पुणे - एक सुंदर सुरुवात",
      content:
        "आमची ओळख खान्देश विवाह वरून झाली. दोन महिने ऑनलाइन बोलल्यानंतर आम्ही भेटलो. आज आम्हाला लग्नाला एक वर्ष पूर्ण झाले. खान्देश विवाह मुळेच आमचे आयुष्य बदलले.",
      imageUrl:
        "https://picsum.photos/seed/couple1/600/400",
      approved: true,
    },
  });

  await prisma.successStory.create({
    data: {
      userId: bride1.id,
      partnerName: "आशिष पाटील",
      title: "खान्देश विवाह - विश्वासाची जोड",
      content:
        "सुरुवातीला ऑनलाइन प्लॅटफॉर्म वरून जोडीदार शोधण्याची मला खूप शंका होती. पण खान्देश विवाह ने माझा विश्वास जिंकला. आता मी सुखी वैवाहिक जीवन जगत आहे.",
      imageUrl:
        "https://picsum.photos/seed/couple2/600/400",
      approved: true,
    },
  });

  await prisma.successStory.create({
    data: {
      userId: bride2.id,
      partnerName: "महेश पवार",
      title: "धुळ्यातील प्रेमकहाणी",
      content:
        "आम्ही दोघेही धुळ्याचे. पण कधी भेटलो नव्हतो. खान्देश विवाह वर प्रोफाइल बघून एकमेकांना संपर्क केला. आज आम्ही आयुष्यभराचे साथीदार झालो आहोत.",
      imageUrl:
        "https://picsum.photos/seed/couple3/600/400",
      approved: true,
    },
  });

  await prisma.successStory.create({
    data: {
      userId: bride3.id,
      partnerName: "दीपक बोरसे",
      title: "नंदुरबारची यशस्वी जोडी",
      content:
        "खान्देश विवाह मुळे आम्हाला एकमेकांसारखी व्यक्ती भेटली. आम्ही दोघेही शेती कुटुंबातील. एकमेकांच्या समस्या समजून घेतल्या. आज लग्नाला ६ महिने झाले.",
      approved: true,
    },
  });

  // ─── SUPPORT TICKETS ─────────────────────────────────────────────────

  const ticket1 = await prisma.supportTicket.create({
    data: {
      userId: bride1.id,
      subject: "फोटो अपलोड करताना समस्या",
      message:
        "मी माझे फोटो अपलोड करत आहे पण फोटो अपलोड होत नाहीत. कृपया मदत करा.",
      status: "RESOLVED",
    },
  });

  await prisma.ticketResponse.create({
    data: {
      ticketId: ticket1.id,
      message:
        "प्रिय प्रिया, आपण फोटोचा आकार 5MB पेक्षा कमी असल्याची खात्री करा. JPEG किंवा PNG फॉरमॅट वापरा. अजूनही समस्या असल्यास कृपया कळवा.",
      isAdmin: true,
    },
  });

  const ticket2 = await prisma.supportTicket.create({
    data: {
      userId: groom2.id,
      subject: "प्रीमियम सदस्यत्वाबद्दल माहिती",
      message: "प्रीमियम सदस्यत्व घेतल्यास कोणकोणत्या सुविधा मिळतात?",
      status: "OPEN",
    },
  });

  // ─── REPORTS ─────────────────────────────────────────────────────────

  await prisma.report.create({
    data: {
      reporterId: bride1.id,
      reportedId: groom1.id,
      reason: "अयोग्य संदेश",
      description: "या वापरकर्त्याने मला अयोग्य संदेश पाठवले आहेत.",
      status: "PENDING",
    },
  });

  console.log("✅ Seeding complete!");
  console.log("─".repeat(40));
  console.log(`👤 Users created: 10`);
  console.log(`📋 Profiles created: 10`);
  console.log(`👨‍👩‍👧‍👦 Families created: 8`);
  console.log(`🌙 Horoscopes created: 8`);
  console.log(`🏃 Lifestyles created: 8`);
  console.log(`📸 Photos created: 11`);
  console.log(`💌 Interests created: 5`);
  console.log(`💬 Messages created: 7`);
  console.log(`⭐ Shortlists created: 7`);
  console.log(`🔔 Notifications created: 9`);
  console.log(`💳 Payments created: 5`);
  console.log(`📝 Blogs created: 3`);
  console.log(`🎉 Success stories created: 4`);
  console.log(`🎫 Support tickets created: 2`);
  console.log(`🚨 Reports created: 1`);
  console.log("─".repeat(40));
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
