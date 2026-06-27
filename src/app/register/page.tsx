"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { MainLayout } from "@/components/layout/MainLayout"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { FileUpload } from "@/components/ui/file-upload"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { isClerkConfigured } from "@/app/providers"
import { CheckCircle, ChevronLeft, ChevronRight, Chrome, Loader2, Mail, AlertTriangle, FileText } from "lucide-react"
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
    }).catch(() => {}).finally(() => {
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
        }).catch(() => {}).finally(() => {
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
        .catch(() => {}).finally(() => {
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
      <div className="mx-auto max-w-2xl bg-gradient-warm px-4 py-8 md:px-6">
        <Link href="/" className="mb-4 inline-flex items-center gap-1 text-xs text-[#887364] hover:text-[#FF21A5]">
          <ChevronLeft className="h-3 w-3" /> {t("common.back")}
        </Link>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gradient-pink">{t("auth.register")}</h1>
          <div className="divider-pink mx-auto my-2 max-w-[80px]" />
          <p className="text-sm text-[#554336]">{t("app.tagline")}</p>
        </div>

        <div className="mb-6">
          {isClerkConfigured ? (
            <ClerkGoogleSignUp />
          ) : (
            <Button variant="outline" className="w-full gap-2" size="lg" disabled>
              <Chrome className="h-5 w-5" /> {t("auth.registerWithGoogle")}
            </Button>
          )}
          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FCF4F8] px-2 text-xs text-[#887364]">
              {t("common.or")}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <div className="mt-2 flex justify-between text-xs text-[#887364]">
            {steps.map((s, i) => (
              <span key={s.id} className={i <= currentStep ? "font-semibold text-gradient-pink" : ""}>
                {locale === "mr" ? s.titleMr : s.titleEn}
              </span>
            ))}
          </div>
        </div>

        <Card className="card-premium">
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
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-[#002366]">{t("registration.basicInfo")}</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>{t("auth.fullName")} (मराठी)</Label>
                        <Input value={form.fullNameMr} onChange={(e) => update("fullNameMr", e.target.value)} placeholder="उदा. प्रिया पाटील" />
                      </div>
                      <div className="space-y-2">
                        <Label>{t("registration.gender")}</Label>
                        <Select onValueChange={(v) => update("gender", v)}>
                          <SelectTrigger><SelectValue placeholder={t("registration.gender")} /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MALE">{t("registration.male")}</SelectItem>
                            <SelectItem value="FEMALE">{t("registration.female")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>{t("registration.dateOfBirth")}</Label>
                        <Input type="date" value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>{t("registration.motherTongue")}</Label>
                        <Input value={form.motherTongue} onChange={(e) => update("motherTongue", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>{t("registration.religion")}</Label>
                        <Select onValueChange={(v) => update("religion", v)}>
                          <SelectTrigger><SelectValue placeholder={t("registration.religion")} /></SelectTrigger>
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
                        <Label>{t("registration.caste")}</Label>
                        <Select onValueChange={(v) => { update("caste", v); update("subCaste", "") }}>
                          <SelectTrigger><SelectValue placeholder={t("registration.caste")} /></SelectTrigger>
                          <SelectContent>
                            {renderCasteOptions()}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>{t("registration.subCaste")}</Label>
                        <Select onValueChange={(v) => update("subCaste", v)}>
                          <SelectTrigger><SelectValue placeholder={t("registration.subCaste")} /></SelectTrigger>
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
                        <Label>{t("registration.maritalStatus")}</Label>
                        <Select onValueChange={(v) => update("maritalStatus", v)}>
                          <SelectTrigger><SelectValue placeholder={t("registration.maritalStatus")} /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NEVER_MARRIED">कधीही विवाह केलेला नाही</SelectItem>
                            <SelectItem value="DIVORCED">घटस्फोटित</SelectItem>
                            <SelectItem value="WIDOWED">विधवा/विधुर</SelectItem>
                            <SelectItem value="AWATTING_DIVORCE">घटस्फोट प्रतीक्षेत</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="divider-gold my-4" />
                    <h3 className="text-sm font-semibold text-[#002366]">{locale === "mr" ? "खांदेश माहिती" : "Khandesh Info"}</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>{t("registration.district")}</Label>
                        <Select onValueChange={(v) => { update("district", v); update("taluka", ""); update("village", "") }}>
                          <SelectTrigger><SelectValue placeholder={t("registration.district")} /></SelectTrigger>
                          <SelectContent>
                            {renderDistrictOptions()}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>{t("registration.taluka")}</Label>
                        <Select onValueChange={(v) => { update("taluka", v); update("village", "") }} disabled={!form.district}>
                          <SelectTrigger><SelectValue placeholder={!form.district ? (locale === "mr" ? "प्रथम जिल्हा निवडा" : "Select district first") : t("registration.taluka")} /></SelectTrigger>
                          <SelectContent>
                            {renderTalukaOptions()}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>{t("registration.village")}</Label>
                        <Select onValueChange={(v) => update("village", v)} disabled={!form.taluka}>
                          <SelectTrigger><SelectValue placeholder={!form.taluka ? (locale === "mr" ? "प्रथम तालुका निवडा" : "Select taluka first") : t("registration.village")} /></SelectTrigger>
                          <SelectContent>
                            {renderVillageOptions()}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{t("registration.aboutMe")}</Label>
                      <textarea
                        className="min-h-[100px] w-full rounded-lg border border-[#E4E2E1] bg-[#F5C6E4] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF21A5]"
                        value={form.aboutMe}
                        onChange={(e) => update("aboutMe", e.target.value)}
                        placeholder="तुमच्याबद्दल थोडक्यात सांगा..."
                      />
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-[#002366]">{t("registration.familyDetails")}</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2"><Label>{t("registration.fatherName")}</Label><Input value={form.fatherName} onChange={(e) => update("fatherName", e.target.value)} /></div>
                      <div className="space-y-2"><Label>{t("registration.motherName")}</Label><Input value={form.motherName} onChange={(e) => update("motherName", e.target.value)} /></div>
                      <div className="space-y-2"><Label>{t("registration.brothers")}</Label><Input type="number" value={form.brothers} onChange={(e) => update("brothers", e.target.value)} /></div>
                      <div className="space-y-2"><Label>{t("registration.sisters")}</Label><Input type="number" value={form.sisters} onChange={(e) => update("sisters", e.target.value)} /></div>
                      <div className="space-y-2">
                        <Label>{t("registration.familyType")}</Label>
                        <Select onValueChange={(v) => update("familyType", v)}>
                          <SelectTrigger><SelectValue placeholder={t("registration.familyType")} /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NUCLEAR">{locale === "mr" ? "एकत्र कुटुंब" : "Nuclear"}</SelectItem>
                            <SelectItem value="JOINT">{locale === "mr" ? "विभक्त कुटुंब" : "Joint"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>{t("registration.familyStatus")}</Label>
                        <Select onValueChange={(v) => update("familyStatus", v)}>
                          <SelectTrigger><SelectValue placeholder={t("registration.familyStatus")} /></SelectTrigger>
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
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-[#002366]">{t("registration.educationCareer")}</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>{t("registration.education")}</Label>
                        <Select onValueChange={(v) => update("education", v)}>
                          <SelectTrigger><SelectValue placeholder={t("registration.education")} /></SelectTrigger>
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
                        <Label>{t("registration.occupation")}</Label>
                        <Select onValueChange={(v) => update("occupation", v)}>
                          <SelectTrigger><SelectValue placeholder={t("registration.occupation")} /></SelectTrigger>
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
                        <Label>{t("registration.income")}</Label>
                        <Select onValueChange={(v) => update("income", v)}>
                          <SelectTrigger><SelectValue placeholder={t("registration.income")} /></SelectTrigger>
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
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-[#002366]">{t("registration.horoscope")}</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>नक्षत्र</Label>
                        <Select onValueChange={(v) => update("nakshatra", v)}>
                          <SelectTrigger><SelectValue placeholder="नक्षत्र निवडा" /></SelectTrigger>
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
                        <Label>राशी</Label>
                        <Select onValueChange={(v) => update("raashi", v)}>
                          <SelectTrigger><SelectValue placeholder="राशी निवडा" /></SelectTrigger>
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
                        <Label>मांगलिक</Label>
                        <Select onValueChange={(v) => update("manglik", v)}>
                          <SelectTrigger><SelectValue placeholder="निवडा" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">मांगलिक</SelectItem>
                            <SelectItem value="no">अनाल</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>{t("registration.foodPreference")}</Label>
                        <Select onValueChange={(v) => update("foodPreference", v)}>
                          <SelectTrigger><SelectValue placeholder="निवडा" /></SelectTrigger>
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
                      <Label>{t("registration.expectations")}</Label>
                      <textarea
                        className="min-h-[100px] w-full rounded-lg border border-[#E4E2E1] bg-[#F5C6E4] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF21A5]"
                        value={form.expectations}
                        onChange={(e) => update("expectations", e.target.value)}
                        placeholder="तुमच्या जोडीदाराकडून अपेक्षा..."
                      />
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-bold text-[#002366]">{t("registration.photos")}</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>{locale === "mr" ? "मोबाइल नंबर" : "Mobile Number"}</Label>
                        <Input
                          type="tel"
                          value={form.mobile}
                          onChange={(e) => update("mobile", e.target.value)}
                          placeholder="+91 9876543210"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="user@example.com"
                        />
                      </div>
                      {(form.mobile || form.email) && (
                        <div className="space-y-2 md:col-span-2">
                          <Label>{locale === "mr" ? "पासवर्ड" : "Password"}</Label>
                          <Input
                            type="password"
                            value={form.password}
                            onChange={(e) => update("password", e.target.value)}
                            placeholder={locale === "mr" ? "किमान 6 अक्षरे" : "Minimum 6 characters"}
                          />
                        </div>
                      )}
                    </div>

                    {(form.mobile || form.email) && !otpVerified && (
                      <div className="space-y-4 rounded-xl border border-[#E4E2E1] bg-[#F5C6E4] p-4">
                        <h3 className="text-sm font-semibold text-[#002366]">
                          {locale === "mr" ? "मोबाइल/ईमेल सत्यापन" : "Mobile/Email Verification"}
                        </h3>
                        {!otpSent ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSendOtp}
                            disabled={sendingOtp}
                            className="gap-2"
                          >
                            {sendingOtp ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Mail className="h-4 w-4" />
                            )}
                            {sendingOtp
                              ? (locale === "mr" ? "पाठवत आहे..." : "Sending...")
                              : (locale === "mr" ? "ओटीपी पाठवा" : "Send OTP")}
                          </Button>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-xs text-[#554336]">
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
                                    className="h-10 w-9 rounded-lg border-2 border-[#E4E2E1] bg-white text-center text-sm font-bold text-[#1b1c1c] outline-none transition-all focus:border-[#FF21A5]"
                                  />
                                ))}
                              </div>
                              <Button
                                size="sm"
                                onClick={handleVerifyOtp}
                                disabled={otpValue.join("").length < 6 || verifyingOtp}
                              >
                                {verifyingOtp ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              {resendTimer > 0 ? (
                                <span className="text-xs text-[#887364]">
                                  {resendTimer}{locale === "mr" ? " सेकंद" : "s"}
                                </span>
                              ) : (
                                <button
                                  onClick={handleSendOtp}
                                  disabled={sendingOtp}
                                  className="text-xs font-medium text-[#FF21A5]"
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
                      <div className="rounded-xl bg-[#50C878]/10 p-3 text-center">
                        <CheckCircle className="mx-auto mb-1 h-5 w-5 text-[#50C878]" />
                        <p className="text-sm font-medium text-[#2d6e4e]">
                          {locale === "mr" ? "मोबाइल/ईमेल सत्यापित!" : "Mobile/Email Verified!"}
                        </p>
                      </div>
                    )}

                    {/* ✅ Photo Upload - Minimum 3 Required */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="font-semibold text-[#002366]">
                          {t("profile.photosRequired")}
                        </Label>
                        <span className={`text-xs font-medium ${photos.length >= 3 ? "text-[#50C878]" : "text-[#FF21A5]"}`}>
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
                        <p className="text-xs text-[#FF21A5]">
                          {t("profile.photosRemaining", { n: 3 - photos.length })}
                        </p>
                      )}
                    </div>

                    {/* ✅ Biodata Upload - Required */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="font-semibold text-[#002366]">
                          {t("profile.uploadDocument")}
                        </Label>
                        {biodataUrl && (
                          <span className="text-xs font-medium text-[#50C878]">
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
                            ? "border-[#50C878] bg-[#50C878]/5"
                            : "border-[#E4E2E1] hover:border-[#FF21A5] hover:bg-[#FF21A5]/5"
                        }`}
                      >
                        {biodataUploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-[#FF21A5]" />
                            <p className="text-sm text-[#554336]">{t("profile.uploadProgress")}</p>
                          </div>
                        ) : biodataUrl ? (
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="h-8 w-8 text-[#50C878]" />
                            <p className="text-sm font-medium text-[#2d6e4e]">{biodataFileName || "Biodata.pdf"}</p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setBiodataUrl(null)
                                setBiodataFileName(null)
                              }}
                              className="text-xs text-red-500 hover:text-red-700"
                            >
                              {t("profile.removeFile")}
                            </button>
                          </div>
                        ) : (
                          <>
                            <FileText className="mx-auto mb-2 h-8 w-8 text-[#FF21A5]" />
                            <p className="font-semibold text-[#1b1c1c]">
                              {t("profile.uploadBiodata")}
                            </p>
                            <p className="mt-1 text-xs text-[#887364]">
                              {t("profile.pdfHint")}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-3"
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

                    {/* Legal Disclaimer & Terms Acceptance */}
                    <div className="rounded-xl border border-[#FF21A5]/30 bg-[#F0ADD6] p-4">
                      <div className="mb-3 flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#FF21A5]" />
                        <div>
                          <h4 className="text-sm font-bold text-[#002366]">{t("legal.disclaimerTitle")}</h4>
                          <p className="mt-1 text-xs leading-relaxed text-[#554336]">
                            {t("legal.disclaimerContent")}
                          </p>
                        </div>
                      </div>
                      <div className="divider-gold my-2" />
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={acceptedTerms}
                          onChange={(e) => setAcceptedTerms(e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-[#E4E2E1] text-[#FF21A5] focus:ring-[#FF21A5]"
                        />
                        <span className="text-xs leading-relaxed text-[#554336]">
                          {t("legal.acceptTerms")}
                        </span>
                      </label>
                    </div>

                    <div className="mt-4 text-center">
                      <Button
                        variant="gold"
                        size="lg"
                        className="btn-premium gap-2"
                        onClick={handleSubmit}
                        disabled={submitting || (!form.mobile && !form.email) || !otpVerified || !acceptedTerms || photos.length < 3 || !biodataUrl}
                      >
                        {submitting ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <CheckCircle className="h-5 w-5" />
                        )}
                        {t("registration.submit")}
                      </Button>
                      {!form.mobile && !form.email && (
                        <p className="mt-2 text-xs text-[#887364]">
                          {locale === "mr" ? "कृपया मोबाइल किंवा ईमेल प्रविष्ट करा" : "Please enter mobile or email"}
                        </p>
                      )}
                      {form.mobile && !otpVerified && (
                        <p className="mt-2 text-xs text-[#FF21A5]">
                          {locale === "mr" ? "कृपया प्रथम ओटीपी सत्यापित करा" : "Please verify OTP first"}
                        </p>
                      )}
                      {otpVerified && photos.length < 3 && (
                        <p className="mt-2 text-xs text-[#FF21A5]">
                          {locale === "mr" ? `किमान ३ फोटो आवश्यक (${photos.length}/3)` : `Minimum 3 photos required (${photos.length}/3)`}
                        </p>
                      )}
                      {otpVerified && photos.length >= 3 && !biodataUrl && (
                        <p className="mt-2 text-xs text-[#FF21A5]">
                          {locale === "mr" ? "कृपया बायोडाटा अपलोड करा" : "Please upload biodata"}
                        </p>
                      )}
                      {!acceptedTerms && otpVerified && photos.length >= 3 && biodataUrl && (
                        <p className="mt-2 text-xs text-[#FF21A5]">
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
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> {t("registration.previous")}
              </Button>
              {isLast ? (
                <Button onClick={handleSubmit} className="btn-premium gap-1" disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {t("registration.submit")}
                </Button>
              ) : (
                <Button onClick={handleNext} className="btn-premium gap-1">
                  {t("registration.next")} <ChevronRight className="h-4 w-4" />
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
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
              <span>{t("auth.profileCreatedTitle")}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center text-sm text-[#554336]">
            <p>{t("auth.profilePendingApproval")}</p>
          </div>
          <div className="mt-4 text-center">
            <Button
              onClick={() => router.push("/login")}
              variant="gold"
              size="lg"
              className="btn-premium w-full"
            >
              {t("auth.goToLogin")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}
