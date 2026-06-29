"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainLayout } from "@/components/layout/MainLayout"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { FileUpload } from "@/components/ui/file-upload"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { isClerkConfigured } from "@/app/providers"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import type { PhotoItem } from "@/types"

const ClerkGoogleSignUp = dynamic(
  () => import("./ClerkGoogleSignUp"),
  { ssr: false },
)

interface CasteOption {
  id: string; en: string; mr: string; subCastes: { en: string; mr: string }[]
}
interface DistrictOption { id: string; en: string; mr: string }
interface TalukaOption { id: string; en: string; mr: string }
interface VillageOption { en: string; mr: string }

const steps = [
  { id: "basic", titleMr: "प्राथमिक माहिती", titleEn: "Basic Info" },
  { id: "family", titleMr: "कौटुंबिक माहिती", titleEn: "Family" },
  { id: "education", titleMr: "शिक्षण आणि नोकरी", titleEn: "Education" },
  { id: "horoscope", titleMr: "पत्रिका आणि जीवनशैली", titleEn: "Horoscope" },
  { id: "photos", titleMr: "फोटो आणि पूर्णता", titleEn: "Photos" },
]

export default function RegisterPage() {
  const { t, locale } = useI18n()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const isLast = currentStep === steps.length - 1
  const progress = ((currentStep + 1) / steps.length) * 100
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const [form, setForm] = useState({
    mobile: "", email: "", password: "",
    fullNameMr: "", gender: "", dateOfBirth: "", height: "", weight: "",
    religion: "", caste: "", subCaste: "", motherTongue: "मराठी", maritalStatus: "",
    education: "", occupation: "", income: "", village: "", taluka: "",
    district: "", aboutMe: "", expectations: "",
    fatherName: "", motherName: "", brothers: "", sisters: "",
    familyType: "", familyStatus: "",
    nakshatra: "", raashi: "", manglik: "",
    foodPreference: "", smoking: "", drinking: "",
  })
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [biodataUrl, setBiodataUrl] = useState<string | null>(null)
  const [biodataUploading, setBiodataUploading] = useState(false)
  const [biodataFileName, setBiodataFileName] = useState<string | null>(null)
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [otpValue, setOtpValue] = useState(["","","","","",""])
  const [resendTimer, setResendTimer] = useState(0)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const [castes, setCastes] = useState<CasteOption[]>([])
  const [districts, setDistricts] = useState<DistrictOption[]>([])
  const [talukas, setTalukas] = useState<TalukaOption[]>([])
  const [villages, setVillages] = useState<VillageOption[]>([])
  const [loadingDistricts, setLoadingDistricts] = useState(true)
  const [loadingCastes, setLoadingCastes] = useState(true)
  const [loadingTalukas, setLoadingTalukas] = useState(false)
  const [loadingVillages, setLoadingVillages] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/locations?type=districts").then(r => r.json()),
      fetch("/api/locations?type=castes").then(r => r.json()),
    ]).then(([d, c]) => {
      setDistricts(d.data || [])
      setCastes(c.data || [])
    }).catch(e => console.error("Failed to load districts/castes:", e)).finally(() => {
      setLoadingDistricts(false)
      setLoadingCastes(false)
    })
  }, [])

  useEffect(() => {
    if (form.district) {
      setLoadingTalukas(true)
      setVillages([])
      fetch(`/api/locations?type=talukas&districtId=${form.district}`)
        .then(r => r.json()).then(d => {
          setTalukas(d.data || [])
        }).catch(e => console.error("Failed to load talukas:", e)).finally(() => {
          setLoadingTalukas(false)
        })
    } else {
      setTalukas([]); setVillages([])
    }
  }, [form.district])

  useEffect(() => {
    if (form.district && form.taluka) {
      setLoadingVillages(true)
      fetch(`/api/locations?type=villages&districtId=${form.district}&talukaId=${form.taluka}`)
        .then(r => r.json()).then(d => setVillages(d.data || []))
        .catch(e => console.error("Failed to load villages:", e)).finally(() => {
          setLoadingVillages(false)
        })
    } else {
      setVillages([])
    }
  }, [form.taluka, form.district])

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1)
  }
  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1)
  }

  const uploadBiodata = async (file: File) => {
    setBiodataUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "document")
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Upload failed")
      setBiodataUrl(data.url)
      setBiodataFileName(file.name)
      toast.success(t("profile.biodataUploaded"))
    } catch (err: any) {
      toast.error(err.message || t("profile.uploadFailed"))
    } finally {
      setBiodataUploading(false)
    }
  }

  const handleSendOtp = async () => {
    const identifier = form.mobile || form.email
    if (!identifier) {
      toast.error(locale === "mr" ? "मोबाइल किंवा ईमेल प्रविष्ट करा" : "Enter mobile or email first")
      return
    }
    setSendingOtp(true)
    try {
      const body = form.mobile ? { mobile: form.mobile } : { email: form.email }
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send OTP")
      setOtpSent(true)
      toast.success(t("auth.otpSent"))
      setResendTimer(30)
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) { clearInterval(timer); return 0 }
          return prev - 1
        })
      }, 1000)
    } catch (err: any) {
      toast.error(err.message || locale === "mr" ? "ओटीपी पाठवण्यात त्रुटी" : "Failed to send OTP")
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    const otpStr = otpValue.join("")
    if (otpStr.length < 6) return
    setVerifyingOtp(true)
    try {
      const body = form.mobile ? { mobile: form.mobile, otp: otpStr } : { email: form.email, otp: otpStr }
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Invalid OTP")
      setOtpVerified(true)
      toast.success(locale === "mr" ? "ओटीपी सत्यापित" : "OTP verified")
    } catch (err: any) {
      toast.error(err.message || locale === "mr" ? "अवैध ओटीपी" : "Invalid OTP")
    } finally {
      setVerifyingOtp(false)
    }
  }

  const handleSubmit = async () => {
    if (!form.mobile && !form.email) {
      toast.error(locale === "mr" ? "मोबाइल किंवा ईमेल आवश्यक आहे" : "Mobile or email is required")
      return
    }
    if (!form.password && !form.mobile) {
      toast.error(locale === "mr" ? "पासवर्ड आवश्यक आहे" : "Password is required")
      return
    }
    if (!otpVerified) {
      toast.error(locale === "mr" ? "कृपया प्रथम ओटीपी सत्यापित करा" : "Please verify OTP first")
      return
    }
    if (photos.length < 3) {
      toast.error(t("profile.minPhotos"))
      return
    }

    if (!biodataUrl) {
      toast.error(t("profile.biodataRequired"))
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: form.mobile || null,
          email: form.email || null,
          password: form.password || null,
          photos: photos.map((p) => ({ url: p.url, isPrimary: p.isPrimary })),
          biodata: biodataUrl,
          profile: {
            fullNameMr: form.fullNameMr,
            gender: form.gender || null,
            dateOfBirth: form.dateOfBirth || null,
            height: form.height || null,
            weight: form.weight || null,
            religion: form.religion || null,
            caste: form.caste || null,
            subCaste: form.subCaste || null,
            motherTongue: form.motherTongue || null,
            maritalStatus: form.maritalStatus || null,
            education: form.education || null,
            occupation: form.occupation || null,
            income: form.income || null,
            village: form.village || null,
            taluka: form.taluka || null,
            district: form.district || null,
            aboutMe: form.aboutMe || null,
            expectations: form.expectations || null,
          },
          family: {
            fatherName: form.fatherName || null,
            motherName: form.motherName || null,
            brothers: form.brothers ? parseInt(form.brothers) : null,
            sisters: form.sisters ? parseInt(form.sisters) : null,
            familyType: form.familyType || null,
            familyStatus: form.familyStatus || null,
          },
          horoscope: {
            nakshatra: form.nakshatra || null,
            raashi: form.raashi || null,
            manglik: form.manglik === "yes" ? true : form.manglik === "no" ? false : null,
          },
          lifestyle: {
            foodPreference: form.foodPreference || null,
            smoking: form.smoking === "yes" ? true : form.smoking === "no" ? false : null,
            drinking: form.drinking === "yes" ? true : form.drinking === "no" ? false : null,
          },
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create profile")

      setShowSuccess(true)
    } catch (err: any) {
      toast.error(err.message || (locale === "mr" ? "प्रोफाइल तयार करताना त्रुटी" : "Error creating profile"))
    } finally {
      setSubmitting(false)
    }
  }

  const currentCaste = castes.find((c) => c.id === form.caste)
  const selectedCaste = form.caste

  const renderCasteOptions = () => {
    if (loadingCastes) return <SelectItem value="loading" disabled>{t("common.loading")}</SelectItem>
    if (castes.length === 0) return <SelectItem value="none" disabled>{locale === "mr" ? "कोणतीही जात उपलब्ध नाही" : "No castes available"}</SelectItem>
    return (
      <>
        {castes.map((c) => (
          <SelectItem key={c.id} value={c.id}>{locale === "mr" ? c.mr : c.en}</SelectItem>
        ))}
        <SelectItem value="OTHER">{locale === "mr" ? "इतर (यादीत नाही)" : "Other (Not Listed)"}</SelectItem>
      </>
    )
  }

  const renderDistrictOptions = () => {
    if (loadingDistricts) return <SelectItem value="loading" disabled>{t("common.loading")}</SelectItem>
    if (districts.length === 0) return <SelectItem value="none" disabled>{locale === "mr" ? "कोणताही जिल्हा उपलब्ध नाही" : "No districts available"}</SelectItem>
    return districts.map((d) => (
      <SelectItem key={d.id} value={d.id}>{locale === "mr" ? d.mr : d.en}</SelectItem>
    ))
  }

  const renderTalukaOptions = () => {
    if (!form.district) return null
    if (loadingTalukas) return <SelectItem value="loading" disabled>{t("common.loading")}</SelectItem>
    if (talukas.length === 0) return <SelectItem value="none" disabled>{locale === "mr" ? "कोणताही तालुका उपलब्ध नाही" : "No talukas available"}</SelectItem>
    return (
      <>
        {talukas.map((t) => (
          <SelectItem key={t.id} value={t.id}>{locale === "mr" ? t.mr : t.en}</SelectItem>
        ))}
        <SelectItem value="OTHER">{locale === "mr" ? "इतर (यादीत नाही)" : "Other (Not Listed)"}</SelectItem>
      </>
    )
  }

  const renderVillageOptions = () => {
    if (!form.taluka) return null
    if (loadingVillages) return <SelectItem value="loading" disabled>{t("common.loading")}</SelectItem>
    if (villages.length === 0) return <SelectItem value="none" disabled>{locale === "mr" ? "कोणतेही गाव उपलब्ध नाही" : "No villages available"}</SelectItem>
    return (
      <>
        {villages.map((v) => (
          <SelectItem key={v.en} value={v.en}>{locale === "mr" ? v.mr : v.en}</SelectItem>
        ))}
        <SelectItem value="OTHER">{locale === "mr" ? "इतर (यादीत नाही)" : "Other (Not Listed)"}</SelectItem>
      </>
    )
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl px-4 pt-24 bg-mandala-ornamental">
        <div className="ornamental-corner-tl" /><div className="ornamental-corner-br" />
        <Link href="/" className="mb-4 inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          {t("common.back")}
        </Link>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-headline-lg text-headline-lg text-royal-ink mb-2">{t("auth.register")}</h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-primary-container to-tertiary-container mx-auto mb-3 rounded-full" />
          <p className="text-body-md text-on-surface-variant">{t("app.tagline")}</p>
        </div>

        {/* Clerk / Divider */}
        <div className="mb-6">
          {isClerkConfigured ? (
            <ClerkGoogleSignUp />
          ) : (
            <Button variant="outline" className="w-full gap-2 border-outline-variant/50 text-on-surface-variant" size="lg" disabled>
              <span className="material-symbols-outlined">login</span>
              {t("auth.registerWithGoogle")}
            </Button>
          )}
          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background-cream px-2 text-xs text-on-surface-variant">
              {t("common.or")}
            </span>
          </div>
        </div>

        {/* Progress + Step Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            {steps.map((s, i) => (
              <div key={s.id} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  i <= currentStep
                    ? "bg-primary text-on-primary shadow-md"
                    : "bg-surface-container-low text-on-surface-variant"
                }`}>
                  {i + 1}
                </div>
                <span className={`text-[10px] mt-1 text-center leading-tight max-w-[60px] ${
                  i <= currentStep ? "text-primary font-semibold" : "text-on-surface-variant"
                }`}>
                  {locale === "mr" ? s.titleMr : s.titleEn}
                </span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2 bg-surface-container-low [&>div]:bg-primary [&>div]:rounded-full" />
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-[0_8px_40px_rgba(0,27,77,0.05)] bg-surface-container-low rounded-2xl overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {currentStep === 0 && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>badge</span>
                      <h2 className="font-headline-md text-headline-md text-secondary">{t("registration.basicInfo")}</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">{t("auth.fullName")} (मराठी)</Label>
                        <Input value={form.fullNameMr} onChange={(e) => update("fullNameMr", e.target.value)} placeholder="उदा. प्रिया पाटील" className="bg-surface-container-low/50 border-outline-variant/30 focus:border-primary" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">{t("registration.gender")}</Label>
                        <Select onValueChange={(v) => update("gender", v)}>
                          <SelectTrigger className="bg-surface-container-low/50 border-outline-variant/30"><SelectValue placeholder={t("registration.gender")} /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MALE">{t("registration.male")}</SelectItem>
                            <SelectItem value="FEMALE">{t("registration.female")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">{t("registration.dateOfBirth")}</Label>
                        <Input type="date" value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} className="bg-surface-container-low/50 border-outline-variant/30 focus:border-primary" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">{t("registration.motherTongue")}</Label>
                        <Input value={form.motherTongue} onChange={(e) => update("motherTongue", e.target.value)} className="bg-surface-container-low/50 border-outline-variant/30 focus:border-primary" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">{t("registration.religion")}</Label>
                        <Select onValueChange={(v) => update("religion", v)}>
                          <SelectTrigger className="bg-surface-container-low/50 border-outline-variant/30"><SelectValue placeholder={t("registration.religion")} /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HINDU">हिंदू</SelectItem>
                            <SelectItem value="MUSLIM">मुस्लिम</SelectItem>
                            <SelectItem value="BUDDHIST">बौद्ध</SelectItem>
                            <SelectItem value="JAIN">जैन</SelectItem>
                            <SelectItem value="CHRISTIAN">ख्रिश्चन</SelectItem>
                            <SelectItem value="SIKH">शीख</SelectItem>
                            <SelectItem value="OTHER">इतर</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">{t("registration.caste")}</Label>
                        <Select onValueChange={(v) => { update("caste", v); update("subCaste", "") }}>
                          <SelectTrigger className="bg-surface-container-low/50 border-outline-variant/30"><SelectValue placeholder={t("registration.caste")} /></SelectTrigger>
                          <SelectContent>
                            {renderCasteOptions()}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">{t("registration.subCaste")}</Label>
                        <Select onValueChange={(v) => update("subCaste", v)}>
                          <SelectTrigger className="bg-surface-container-low/50 border-outline-variant/30"><SelectValue placeholder={t("registration.subCaste")} /></SelectTrigger>
                          <SelectContent>
                            {currentCaste?.subCastes.length ? (
                              currentCaste.subCastes.map((sc, idx) => (
                                <SelectItem key={idx} value={sc.en}>{locale === "mr" ? sc.mr : sc.en}</SelectItem>
                              ))
                            ) : (
                              <SelectItem value="none">-</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">{t("registration.maritalStatus")}</Label>
                        <Select onValueChange={(v) => update("maritalStatus", v)}>
                          <SelectTrigger className="bg-surface-container-low/50 border-outline-variant/30"><SelectValue placeholder={t("registration.maritalStatus")} /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NEVER_MARRIED">कधीही विवाह केलेला नाही</SelectItem>
                            <SelectItem value="DIVORCED">घटस्फोटित</SelectItem>
                            <SelectItem value="WIDOWED">विधवा/विधुर</SelectItem>
                            <SelectItem value="AWAITING_DIVORCE">घटस्फोट प्रतीक्षेत</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="h-px bg-gradient-to-r from-primary-container/50 via-tertiary-container/50 to-secondary-container/50 my-4" />
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                      <h3 className="font-label-md text-secondary">{locale === "mr" ? "खांदेश माहिती" : "Khandesh Info"}</h3>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">{t("registration.district")}</Label>
                        <Select onValueChange={(v) => { update("district", v); update("taluka", ""); update("village", "") }}>
                          <SelectTrigger className="bg-surface-container-low/50 border-outline-variant/30"><SelectValue placeholder={t("registration.district")} /></SelectTrigger>
                          <SelectContent>
                            {renderDistrictOptions()}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">{t("registration.taluka")}</Label>
                        <Select onValueChange={(v) => { update("taluka", v); update("village", "") }} disabled={!form.district}>
                          <SelectTrigger className="bg-surface-container-low/50 border-outline-variant/30"><SelectValue placeholder={!form.district ? (locale === "mr" ? "प्रथम जिल्हा निवडा" : "Select district first") : t("registration.taluka")} /></SelectTrigger>
                          <SelectContent>
                            {renderTalukaOptions()}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">{t("registration.village")}</Label>
                        <Select onValueChange={(v) => update("village", v)} disabled={!form.taluka}>
                          <SelectTrigger className="bg-surface-container-low/50 border-outline-variant/30"><SelectValue placeholder={!form.taluka ? (locale === "mr" ? "प्रथम तालुका निवडा" : "Select taluka first") : t("registration.village")} /></SelectTrigger>
                          <SelectContent>
                            {renderVillageOptions()}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-on-surface-variant font-medium">{t("registration.aboutMe")}</Label>
                      <textarea
                        className="min-h-[100px] w-full rounded-lg border border-outline-variant/30 bg-surface-container-low/50 p-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-outline/60"
                        value={form.aboutMe}
                        onChange={(e) => update("aboutMe", e.target.value)}
                        placeholder="तुमच्याबद्दल थोडक्यात सांगा..."
                      />
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>diversity_3</span>
                      <h2 className="font-headline-md text-headline-md text-secondary">{t("registration.familyDetails")}</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2"><Label className="text-on-surface-variant font-medium">{t("registration.fatherName")}</Label><Input value={form.fatherName} onChange={(e) => update("fatherName", e.target.value)} className="bg-surface-container-low/50 border-outline-variant/30 focus:border-primary" /></div>
                      <div className="space-y-2"><Label className="text-on-surface-variant font-medium">{t("registration.motherName")}</Label><Input value={form.motherName} onChange={(e) => update("motherName", e.target.value)} className="bg-surface-container-low/50 border-outline-variant/30 focus:border-primary" /></div>
                      <div className="space-y-2"><Label className="text-on-surface-variant font-medium">{t("registration.brothers")}</Label><Input type="number" value={form.brothers} onChange={(e) => update("brothers", e.target.value)} className="bg-surface-container-low/50 border-outline-variant/30 focus:border-primary" /></div>
                      <div className="space-y-2"><Label className="text-on-surface-variant font-medium">{t("registration.sisters")}</Label><Input type="number" value={form.sisters} onChange={(e) => update("sisters", e.target.value)} className="bg-surface-container-low/50 border-outline-variant/30 focus:border-primary" /></div>
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">{t("registration.familyType")}</Label>
                        <Select onValueChange={(v) => update("familyType", v)}>
                          <SelectTrigger className="bg-surface-container-low/50 border-outline-variant/30"><SelectValue placeholder={t("registration.familyType")} /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NUCLEAR">{locale === "mr" ? "एकत्र कुटुंब" : "Nuclear"}</SelectItem>
                            <SelectItem value="JOINT">{locale === "mr" ? "विभक्त कुटुंब" : "Joint"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">{t("registration.familyStatus")}</Label>
                        <Select onValueChange={(v) => update("familyStatus", v)}>
                          <SelectTrigger className="bg-surface-container-low/50 border-outline-variant/30"><SelectValue placeholder={t("registration.familyStatus")} /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MIDDLE_CLASS">{locale === "mr" ? "मध्यम वर्ग" : "Middle Class"}</SelectItem>
                            <SelectItem value="UPPER_MIDDLE_CLASS">{locale === "mr" ? "उच्च मध्यम वर्ग" : "Upper Middle Class"}</SelectItem>
                            <SelectItem value="RICH">{locale === "mr" ? "श्रीमंत" : "Rich"}</SelectItem>
                            <SelectItem value="AFFLUENT">{locale === "mr" ? "अत्यंत श्रीमंत" : "Affluent"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                      <h2 className="font-headline-md text-headline-md text-secondary">{t("registration.educationCareer")}</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">{t("registration.education")}</Label>
                        <Select onValueChange={(v) => update("education", v)}>
                          <SelectTrigger className="bg-surface-container-low/50 border-outline-variant/30"><SelectValue placeholder={t("registration.education")} /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ssc">SSC / 10वी</SelectItem>
                            <SelectItem value="hsc">HSC / 12वी</SelectItem>
                            <SelectItem value="diploma">डिप्लोमा</SelectItem>
                            <SelectItem value="graduate">पदवी (बॅचलर)</SelectItem>
                            <SelectItem value="postgraduate">पदव्युत्तर (मास्टर्स)</SelectItem>
                            <SelectItem value="phd">पीएच.डी.</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">{t("registration.occupation")}</Label>
                        <Select onValueChange={(v) => update("occupation", v)}>
                          <SelectTrigger className="bg-surface-container-low/50 border-outline-variant/30"><SelectValue placeholder={t("registration.occupation")} /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="government">सरकारी नोकरी</SelectItem>
                            <SelectItem value="private">खाजगी नोकरी</SelectItem>
                            <SelectItem value="business">व्यवसाय</SelectItem>
                            <SelectItem value="agriculture">शेती</SelectItem>
                            <SelectItem value="doctor">डॉक्टर</SelectItem>
                            <SelectItem value="engineer">अभियंता</SelectItem>
                            <SelectItem value="teacher">शिक्षक</SelectItem>
                            <SelectItem value="lawyer">वकील</SelectItem>
                            <SelectItem value="other">इतर</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">{t("registration.income")}</Label>
                        <Select onValueChange={(v) => update("income", v)}>
                          <SelectTrigger className="bg-surface-container-low/50 border-outline-variant/30"><SelectValue placeholder={t("registration.income")} /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-3lakh">₹0 - ₹3 लाख</SelectItem>
                            <SelectItem value="3-6lakh">₹3 - ₹6 लाख</SelectItem>
                            <SelectItem value="6-10lakh">₹6 - ₹10 लाख</SelectItem>
                            <SelectItem value="10-20lakh">₹10 - ₹20 लाख</SelectItem>
                            <SelectItem value="20lakh+">₹20 लाख+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                      <h2 className="font-headline-md text-headline-md text-secondary">{t("registration.horoscope")}</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">नक्षत्र</Label>
                        <Select onValueChange={(v) => update("nakshatra", v)}>
                          <SelectTrigger className="bg-surface-container-low/50 border-outline-variant/30"><SelectValue placeholder="नक्षत्र निवडा" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ASHWINI">अश्विनी</SelectItem>
                            <SelectItem value="BHARANI">भरणी</SelectItem>
                            <SelectItem value="KRITTIKA">कृत्तिका</SelectItem>
                            <SelectItem value="ROHINI">रोहिणी</SelectItem>
                            <SelectItem value="MRIGASHIRA">मृगशीर्ष</SelectItem>
                            <SelectItem value="ARDRA">आर्द्रा</SelectItem>
                            <SelectItem value="PUNARVASU">पुनर्वसु</SelectItem>
                            <SelectItem value="PUSHYA">पुष्य</SelectItem>
                            <SelectItem value="ASHLESHA">आश्लेषा</SelectItem>
                            <SelectItem value="MAGHA">मघा</SelectItem>
                            <SelectItem value="PURVA_PHALGUNI">पूर्व फाल्गुनी</SelectItem>
                            <SelectItem value="UTTARA_PHALGUNI">उत्तर फाल्गुनी</SelectItem>
                            <SelectItem value="HASTA">हस्त</SelectItem>
                            <SelectItem value="CHITRA">चित्रा</SelectItem>
                            <SelectItem value="SWATI">स्वाती</SelectItem>
                            <SelectItem value="VISHAKHA">विशाखा</SelectItem>
                            <SelectItem value="ANURADHA">अनुराधा</SelectItem>
                            <SelectItem value="JYESHTHA">ज्येष्ठा</SelectItem>
                            <SelectItem value="MULA">मूळ</SelectItem>
                            <SelectItem value="PURVA_ASHADHA">पूर्व आषाढा</SelectItem>
                            <SelectItem value="UTTARA_ASHADHA">उत्तर आषाढा</SelectItem>
                            <SelectItem value="SHRAVANA">श्रवण</SelectItem>
                            <SelectItem value="DHANISHTA">धनिष्ठा</SelectItem>
                            <SelectItem value="SHATABHISHA">शतभिषा</SelectItem>
                            <SelectItem value="PURVA_BHADRAPADA">पूर्व भाद्रपदा</SelectItem>
                            <SelectItem value="UTTARA_BHADRAPADA">उत्तर भाद्रपदा</SelectItem>
                            <SelectItem value="REVATI">रेवती</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">राशी</Label>
                        <Select onValueChange={(v) => update("raashi", v)}>
                          <SelectTrigger className="bg-surface-container-low/50 border-outline-variant/30"><SelectValue placeholder="राशी निवडा" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MESH">मेष</SelectItem>
                            <SelectItem value="VRISHABH">वृषभ</SelectItem>
                            <SelectItem value="MITHUN">मिथुन</SelectItem>
                            <SelectItem value="KARK">कर्क</SelectItem>
                            <SelectItem value="SIMHA">सिंह</SelectItem>
                            <SelectItem value="KANYA">कन्या</SelectItem>
                            <SelectItem value="TULA">तूळ</SelectItem>
                            <SelectItem value="VRISHCHIK">वृश्चिक</SelectItem>
                            <SelectItem value="DHANUSH">धनुष्य</SelectItem>
                            <SelectItem value="MAKAR">मकर</SelectItem>
                            <SelectItem value="KUMBH">कुंभ</SelectItem>
                            <SelectItem value="MEEN">मीन</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">मांगलिक</Label>
                        <Select onValueChange={(v) => update("manglik", v)}>
                          <SelectTrigger className="bg-surface-container-low/50 border-outline-variant/30"><SelectValue placeholder="निवडा" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">मांगलिक</SelectItem>
                            <SelectItem value="no">अनाल</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">{t("registration.foodPreference")}</Label>
                        <Select onValueChange={(v) => update("foodPreference", v)}>
                          <SelectTrigger className="bg-surface-container-low/50 border-outline-variant/30"><SelectValue placeholder="निवडा" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VEGETARIAN">शाकाहारी</SelectItem>
                            <SelectItem value="NON_VEGETARIAN">मांसाहारी</SelectItem>
                            <SelectItem value="JAIN">जैन</SelectItem>
                            <SelectItem value="VEGAN">व्हिगन</SelectItem>
                            <SelectItem value="EGGITARIAN">इगेटेरियन</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-on-surface-variant font-medium">{t("registration.expectations")}</Label>
                      <textarea
                        className="min-h-[100px] w-full rounded-lg border border-outline-variant/30 bg-surface-container-low/50 p-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-outline/60"
                        value={form.expectations}
                        onChange={(e) => update("expectations", e.target.value)}
                        placeholder="तुमच्या जोडीदाराकडून अपेक्षा..."
                      />
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
                      <h2 className="font-headline-md text-headline-md text-secondary">{t("registration.photos")}</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">{locale === "mr" ? "मोबाइल नंबर" : "Mobile Number"}</Label>
                        <Input
                          type="tel"
                          value={form.mobile}
                          onChange={(e) => update("mobile", e.target.value)}
                          placeholder="+91 9876543210"
                          className="bg-surface-container-low/50 border-outline-variant/30 focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-on-surface-variant font-medium">Email</Label>
                        <Input
                          type="email"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="user@example.com"
                          className="bg-surface-container-low/50 border-outline-variant/30 focus:border-primary"
                        />
                      </div>
                      {(form.mobile || form.email) && (
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-on-surface-variant font-medium">{locale === "mr" ? "पासवर्ड" : "Password"}</Label>
                          <Input
                            type="password"
                            value={form.password}
                            onChange={(e) => update("password", e.target.value)}
                            placeholder={locale === "mr" ? "किमान 6 अक्षरे" : "Minimum 6 characters"}
                            className="bg-surface-container-low/50 border-outline-variant/30 focus:border-primary"
                          />
                        </div>
                      )}
                    </div>

                    {(form.mobile || form.email) && !otpVerified && (
                      <div className="space-y-4 rounded-xl border border-outline-variant/30 bg-surface-container-low/50 p-5">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">verified</span>
                          <h3 className="font-label-md text-secondary">
                            {locale === "mr" ? "मोबाइल/ईमेल सत्यापन" : "Mobile/Email Verification"}
                          </h3>
                        </div>
                        {!otpSent ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSendOtp}
                            disabled={sendingOtp}
                            className="gap-2 border-primary/30 text-primary"
                          >
                            {sendingOtp ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <span className="material-symbols-outlined text-[18px]">mail</span>
                            )}
                            {sendingOtp
                              ? (locale === "mr" ? "पाठवत आहे..." : "Sending...")
                              : (locale === "mr" ? "ओटीपी पाठवा" : "Send OTP")}
                          </Button>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-xs text-on-surface-variant">
                              {locale === "mr"
                                ? `${form.mobile || form.email} वर ओटीपी पाठवला गेला`
                                : `OTP sent to ${form.mobile || form.email}`}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1.5">
                                {[0,1,2,3,4,5].map((i) => (
                                  <input
                                    key={i}
                                    type="tel"
                                    maxLength={1}
                                    value={otpValue[i]}
                                    onChange={(e) => {
                                      const val = e.target.value.replace(/\D/g, "")
                                      const newOtp = [...otpValue]
                                      newOtp[i] = val
                                      setOtpValue(newOtp)
                                      if (val && i < 5) document.getElementById(`reg-otp-${i + 1}`)?.focus()
                                    }}
                                    id={`reg-otp-${i}`}
                                    className="h-10 w-9 rounded-lg border-2 border-outline-variant/30 bg-surface-white text-center text-sm font-bold text-on-surface outline-none transition-all focus:border-primary"
                                  />
                                ))}
                              </div>
                              <Button
                                size="sm"
                                onClick={handleVerifyOtp}
                                disabled={otpValue.join("").length < 6 || verifyingOtp}
                                className="bg-primary text-on-primary hover:bg-on-primary-container"
                              >
                                {verifyingOtp ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <span className="material-symbols-outlined text-[18px]">check</span>
                                )}
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              {resendTimer > 0 ? (
                                <span className="text-xs text-on-surface-variant">
                                  {resendTimer}{locale === "mr" ? " सेकंद" : "s"}
                                </span>
                              ) : (
                                <button
                                  onClick={handleSendOtp}
                                  disabled={sendingOtp}
                                  className="text-xs font-medium text-primary"
                                >
                                  {locale === "mr" ? "पुन्हा पाठवा" : "Resend OTP"}
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {otpVerified && (
                      <div className="rounded-xl bg-emerald-growth/10 p-3 text-center flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-emerald-growth" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        <p className="text-sm font-medium text-emerald-growth">
                          {locale === "mr" ? "मोबाइल/ईमेल सत्यापित!" : "Mobile/Email Verified!"}
                        </p>
                      </div>
                    )}

                    {/* Photo Upload */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="font-semibold text-secondary flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">photo_library</span>
                          {t("profile.photosRequired")}
                        </Label>
                        <span className={`text-xs font-medium ${photos.length >= 3 ? "text-emerald-growth" : "text-primary"}`}>
                          {photos.length >= 3
                            ? t("profile.photosComplete")
                            : t("profile.photosCount", { count: photos.length })}
                        </span>
                      </div>
                      <FileUpload
                        photos={photos}
                        onPhotosChange={setPhotos}
                        onUpload={() => {}}
                        maxFiles={5}
                      />
                      {photos.length > 0 && photos.length < 3 && (
                        <p className="text-xs text-primary">
                          {t("profile.photosRemaining", { n: 3 - photos.length })}
                        </p>
                      )}
                    </div>

                    {/* Biodata Upload */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="font-semibold text-secondary flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">description</span>
                          {t("profile.uploadDocument")}
                        </Label>
                        {biodataUrl && (
                          <span className="text-xs font-medium text-emerald-growth">
                            {t("profile.uploadedStatus")}
                          </span>
                        )}
                      </div>
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={async (e) => {
                          e.preventDefault()
                          const file = e.dataTransfer.files[0]
                          if (file && file.type === "application/pdf" && file.size <= 5 * 1024 * 1024) {
                            await uploadBiodata(file)
                          } else {
                            toast.error(t("profile.pdfOnlyError"))
                          }
                        }}
                        className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
                          biodataUrl
                            ? "border-emerald-growth bg-emerald-growth/5"
                            : "border-outline-variant/30 hover:border-primary hover:bg-primary/5"
                        }`}
                      >
                        {biodataUploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-on-surface-variant">{t("profile.uploadProgress")}</p>
                          </div>
                        ) : biodataUrl ? (
                          <div className="flex flex-col items-center gap-2">
                            <span className="material-symbols-outlined text-emerald-growth text-4xl">description</span>
                            <p className="text-sm font-medium text-emerald-growth">{biodataFileName || "Biodata.pdf"}</p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setBiodataUrl(null)
                                setBiodataFileName(null)
                              }}
                              className="text-xs text-destructive hover:text-destructive/80"
                            >
                              {t("profile.removeFile")}
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-primary text-4xl mb-2">description</span>
                            <p className="font-semibold text-on-surface">
                              {t("profile.uploadBiodata")}
                            </p>
                            <p className="mt-1 text-xs text-on-surface-variant">
                              {t("profile.pdfHint")}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-3 border-primary/30 text-primary"
                              onClick={async (e) => {
                                e.stopPropagation()
                                const input = document.createElement("input")
                                input.type = "file"
                                input.accept = ".pdf"
                                input.onchange = async () => {
                                  const file = input.files?.[0]
                                  if (file) await uploadBiodata(file)
                                }
                                input.click()
                              }}
                            >
                              {t("profile.chooseFile")}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Legal Disclaimer */}
                    <div className="rounded-xl border border-primary/20 bg-primary-container/10 p-5">
                      <div className="mb-3 flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary shrink-0 mt-0.5">warning</span>
                        <div>
                          <h4 className="text-sm font-bold text-secondary">{t("legal.disclaimerTitle")}</h4>
                          <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                            {t("legal.disclaimerContent")}
                          </p>
                        </div>
                      </div>
                      <div className="h-px bg-gradient-to-r from-primary-container/50 to-tertiary-container/50 my-3" />
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={acceptedTerms}
                          onChange={(e) => setAcceptedTerms(e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-outline-variant/50 text-primary focus:ring-primary"
                        />
                        <span className="text-xs leading-relaxed text-on-surface-variant">
                          {t("legal.acceptTerms")}
                        </span>
                      </label>
                    </div>

                    <div className="mt-4 text-center">
                      <Button
                        size="lg"
                        className="w-full bg-primary text-on-primary hover:bg-on-primary-container active:scale-95 transition-all gap-2"
                        onClick={handleSubmit}
                        disabled={submitting || (!form.mobile && !form.email) || !otpVerified || !acceptedTerms || photos.length < 3 || !biodataUrl}
                      >
                        {submitting ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <span className="material-symbols-outlined">check_circle</span>
                        )}
                        {t("registration.submit")}
                      </Button>
                      {!form.mobile && !form.email && (
                        <p className="mt-2 text-xs text-on-surface-variant">
                          {locale === "mr" ? "कृपया मोबाइल किंवा ईमेल प्रविष्ट करा" : "Please enter mobile or email"}
                        </p>
                      )}
                      {form.mobile && !otpVerified && (
                        <p className="mt-2 text-xs text-primary">
                          {locale === "mr" ? "कृपया प्रथम ओटीपी सत्यापित करा" : "Please verify OTP first"}
                        </p>
                      )}
                      {otpVerified && photos.length < 3 && (
                        <p className="mt-2 text-xs text-primary">
                          {locale === "mr" ? `किमान ३ फोटो आवश्यक (${photos.length}/3)` : `Minimum 3 photos required (${photos.length}/3)`}
                        </p>
                      )}
                      {otpVerified && photos.length >= 3 && !biodataUrl && (
                        <p className="mt-2 text-xs text-primary">
                          {locale === "mr" ? "कृपया बायोडाटा अपलोड करा" : "Please upload biodata"}
                        </p>
                      )}
                      {!acceptedTerms && otpVerified && photos.length >= 3 && biodataUrl && (
                        <p className="mt-2 text-xs text-primary">
                          {locale === "mr" ? "कृपया अटी व शर्ती मान्य करा" : "Please accept the terms & disclaimer"}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="gap-1 border-outline-variant/30 text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                {t("registration.previous")}
              </Button>
              {isLast ? (
                <Button onClick={handleSubmit} className="bg-primary text-on-primary hover:bg-on-primary-container gap-1" disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  )}
                  {t("registration.submit")}
                </Button>
              ) : (
                <Button onClick={handleNext} className="bg-primary text-on-primary hover:bg-on-primary-container gap-1">
                  {t("registration.next")}
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <span className="material-symbols-outlined text-emerald-growth text-5xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="block text-headline-md font-headline-md text-royal-ink">{t("auth.profileCreatedTitle")}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center text-sm text-on-surface-variant">
            <p>{t("auth.profilePendingApproval")}</p>
          </div>
          <div className="mt-4 text-center">
            <Button
              onClick={() => router.push("/login")}
              size="lg"
              className="bg-primary text-on-primary hover:bg-on-primary-container w-full"
            >
              {t("auth.goToLogin")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}
