import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, locale = "mr") {
  return new Intl.DateTimeFormat(locale === "mr" ? "mr-IN" : "en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

export function getAge(dateOfBirth: string | Date) {
  const today = new Date()
  const birth = new Date(dateOfBirth)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

export function calculateCompatibility(user1: any, user2: any): number {
  let score = 0
  const factors = []

  if (user1?.profile?.religion === user2?.profile?.religion) {
    score += 20
    factors.push("religion")
  }
  if (user1?.profile?.caste === user2?.profile?.caste) {
    score += 15
    factors.push("caste")
  }
  if (user1?.horoscope?.manglik === user2?.horoscope?.manglik) {
    score += 10
    factors.push("manglik")
  }
  if (user1?.lifestyle?.foodPreference === user2?.lifestyle?.foodPreference) {
    score += 10
    factors.push("food")
  }
  if (user1?.profile?.education === user2?.profile?.education) {
    score += 10
    factors.push("education")
  }
  if (user1?.profile?.district === user2?.profile?.district) {
    score += 15
    factors.push("location")
  }
  if (user1?.profile?.maritalStatus === user2?.profile?.maritalStatus) {
    score += 10
    factors.push("maritalStatus")
  }
  if (user1?.lifestyle?.smoking === user2?.lifestyle?.smoking) {
    score += 5
    factors.push("smoking")
  }
  if (user1?.lifestyle?.drinking === user2?.lifestyle?.drinking) {
    score += 5
    factors.push("drinking")
  }

  return Math.min(score, 100)
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}

export function maskName(name: string | null | undefined, isPremium: boolean): string {
  if (!name) return ""
  if (isPremium) return name
  // Show only first 2 characters + asterisks
  if (name.length <= 2) return name[0] + "***"
  return name.slice(0, 2) + "***"
}

export function maskMobile(mobile: string | null | undefined, isPremium: boolean): string {
  if (!mobile) return ""
  if (isPremium) return mobile
  // Show last 4 digits only
  if (mobile.length <= 4) return "******" + mobile
  return "******" + mobile.slice(-4)
}

export function maskEmail(email: string | null | undefined, isPremium: boolean): string {
  if (!email) return ""
  if (isPremium) return email
  const [local, domain] = email.split("@")
  if (!domain) return "***@***"
  // Show first 2 chars of local part + *** + domain first char + ***
  const maskedLocal = local.length <= 2 ? local[0] + "***" : local.slice(0, 2) + "***"
  const maskedDomain = domain.length <= 2 ? domain[0] + "***" : domain.slice(0, 1) + "***"
  return `${maskedLocal}@${maskedDomain}`
}


