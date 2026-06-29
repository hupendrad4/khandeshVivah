"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/MainLayout"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/ui/file-upload"
import { maskName } from "@/lib/utils"
import { usePaymentGate } from "@/lib/use-payment-gate"
import { useAuthStore } from "@/store/auth-store"
import { GunaMatchModal } from "@/components/GunaMatchModal"
import toast from "react-hot-toast"
import type { PhotoItem } from "@/types"

export default function ProfilePage() {
  const { t, locale } = useI18n()
  const searchParams = useSearchParams()
  const router = useRouter()
  const profileUserId = searchParams.get("userId")
  const { executeWithGate, isProcessing } = usePaymentGate()
  const { user } = useAuthStore()

  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [gallery, setGallery] = useState<PhotoItem[]>([])
  const [activeTab, setActiveTab] = useState("about")
  const [isShortlisted, setIsShortlisted] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)
  const [showReportForm, setShowReportForm] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportDesc, setReportDesc] = useState("")
  const [showGunaMatch, setShowGunaMatch] = useState(false)
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<string | null>(null)

  const isProfileOwner = !profileUserId || profileUserId === user?.id
  const targetUserId = profileUserId || user?.id
  const isViewerPremium = user?.isPremium || false

  useEffect(() => {
    if (!targetUserId) return
    setLoading(true)
    fetch(`/api/users/profile?userId=${targetUserId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setProfile(data.profile)
          setGallery(data.profile.photos || [])
          setSubscriptionEndDate(data.profile.subscriptionEndDate || null)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [targetUserId])

  useEffect(() => {
    if (!user?.id || !targetUserId || isProfileOwner) return
    fetch(`/api/block?userId=${user.id}&targetId=${targetUserId}`)
      .then(r => r.json()).then(d => { if (d.success) setIsBlocked(d.isBlocked) }).catch(() => {})
    fetch(`/api/shortlist?userId=${user.id}&targetId=${targetUserId}`)
      .then(r => r.json()).then(d => { if (d.success) setIsShortlisted(d.isShortlisted) }).catch(() => {})
  }, [user?.id, targetUserId, isProfileOwner])

  useEffect(() => {
    if (!user?.id || !targetUserId || isProfileOwner) return
    fetch("/api/profile/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ viewerId: user.id, targetId: targetUserId }),
    }).catch(() => {})
  }, [user?.id, targetUserId, isProfileOwner])

  const p = profile?.profile || {}
  const displayName = isViewerPremium || isProfileOwner
    ? (p.fullNameEn || p.fullNameMr || "User")
    : maskName(p.fullNameEn || p.fullNameMr, false)

  const handleInterest = async () => {
    if (!user?.id || !targetUserId) return
    const res = await fetch("/api/interests/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId: user.id, receiverId: targetUserId }),
    })
    const data = await res.json()
    if (data.success) toast.success(t("profile.interestSent"))
    else toast.error(data.error || "Failed")
  }

  const handleShortlist = async () => {
    if (!user?.id || !targetUserId) return
    const res = await fetch("/api/shortlist/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, targetId: targetUserId }),
    })
    const data = await res.json()
    if (data.success) {
      setIsShortlisted(data.shortlisted)
      toast.success(data.shortlisted ? t("profile.shortlistAdded") : t("profile.shortlistRemoved"))
    }
  }

  const handleBlock = async () => {
    if (!user?.id || !targetUserId) return
    const res = await fetch("/api/block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blockerId: user.id, blockedId: targetUserId, action: isBlocked ? "unblock" : "block" }),
    })
    const data = await res.json()
    if (data.success) {
      setIsBlocked(data.blocked)
      toast.success(data.blocked
        ? (locale === "mr" ? "ब्लॉक केले" : "Blocked")
        : (locale === "mr" ? "अनब्लॉक केले" : "Unblocked"))
    }
  }

  const handleReport = async () => {
    if (!user?.id || !targetUserId || !reportReason) return
    const res = await fetch("/api/report/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reporterId: user.id, reportedId: targetUserId, reason: reportReason, description: reportDesc }),
    })
    const data = await res.json()
    if (data.success) {
      toast.success(locale === "mr" ? "रिपोर्ट सबमिट केला" : "Report submitted")
      setShowReportForm(false)
      setReportReason("")
      setReportDesc("")
    } else toast.error("Failed to submit report")
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-10">
          <button onClick={() => router.back()}
            className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary transition-colors mb-4">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span className="hidden md:inline">{locale === "mr" ? "मागे" : "Back"}</span>
          </button>
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-surface-container-low rounded-xl" />
            <div className="h-8 bg-surface-container-low rounded w-1/3" />
            <div className="h-4 bg-surface-container-low rounded w-1/2" />
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-10 bg-mandala-ornamental">
        <button onClick={() => router.back()}
          className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary transition-colors mb-4">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span className="hidden md:inline">{locale === "mr" ? "मागे" : "Back"}</span>
        </button>
        <div className="ornamental-corner-tl" /><div className="ornamental-corner-br" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card className="bg-surface-container-low border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="relative h-48 rounded-t-xl bg-gradient-to-br from-[#8f4e00]/20 to-[#435b9f]/20">
                  {gallery[0]?.url ? (
                    <img src={gallery[0].url} alt="" className="h-full w-full rounded-t-xl object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-primary/40">person</span>
                    </div>
                  )}
                </div>
                <div className="px-5 pb-5">
                  <div className="relative -mt-12 mb-3">
                    <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg">
                      {gallery[0]?.url ? (
                        <img src={gallery[0].url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-[#8f4e00]/10">
                          <span className="material-symbols-outlined text-3xl text-primary">person</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <h1 className="text-center text-xl font-bold text-royal-ink">
                    {displayName}
                    {!isViewerPremium && !isProfileOwner && (
                      <span className="material-symbols-outlined ml-1 align-middle text-[18px] text-primary">lock</span>
                    )}
                  </h1>
                  <p className="text-center text-sm text-on-surface-variant">
                    {p.dateOfBirth ? `${new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear()} yrs` : ""}
                    {p.height ? `, ${p.height} cm` : ""}
                    {p.district ? ` | ${p.district}` : ""}
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    {profile?.isVerified && <Badge variant="success" className="gap-1"><span className="material-symbols-outlined text-[14px]">verified</span>Verified</Badge>}
                    {profile?.isPremium && <Badge variant="premium" className="gap-1"><span className="material-symbols-outlined text-[14px]">star</span>Premium</Badge>}
                  </div>

                  {!isViewerPremium && !isProfileOwner && (
                    <div className="mt-3 rounded-lg bg-primary-container/20 border border-primary/20 p-3 text-center">
                      <span className="material-symbols-outlined mx-auto mb-1 text-primary">lock</span>
                      <p className="text-xs text-on-surface-variant">
                        {locale === "mr"
                          ? "प्रीमियम सबस्क्रिप्शनवर संपूर्ण प्रोफाइल दिसेल"
                          : "Full profile visible with Premium subscription"}
                      </p>
                      <Link href="/premium">
                        <Button size="sm" variant="gold" className="mt-2 gap-1">
                          <span className="material-symbols-outlined text-[16px]">crown</span>
                          {t("profile.viewPremium")}
                        </Button>
                      </Link>
                    </div>
                  )}

                  {subscriptionEndDate && (
                    <div className="mt-2 text-center text-[10px] text-primary">
                      {locale === "mr" ? "प्रीमियम सदस्यता:" : "Premium until:"} {new Date(subscriptionEndDate).toLocaleDateString()}
                    </div>
                  )}

                  {!isProfileOwner && (
                    <div className="mt-4 flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 gap-1" onClick={handleInterest}>
                          <span className="material-symbols-outlined text-[16px]">favorite</span>
                          {t("profile.sendInterest")}
                        </Button>
                        <Button size="sm" variant="ghost" disabled={isProcessing} onClick={handleShortlist}>
                          <span className="material-symbols-outlined" style={{ fontVariationSettings: isShortlisted ? "'FILL' 1" : "'FILL' 0" }}>
                            bookmark
                          </span>
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => {
                          executeWithGate(async () => {
                            window.location.href = `/chat?userId=${targetUserId}`
                          }, "send_message")
                        }}>
                          <span className="material-symbols-outlined text-[16px]">chat</span>
                          {t("profile.chat")}
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => setShowGunaMatch(true)}>
                          <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                          {locale === "mr" ? "कुंडली" : "Kundali"}
                        </Button>
                      </div>
                      <div className="flex gap-2 mt-1">
                        <Button size="sm" variant="ghost" className="text-xs gap-1 text-on-surface-variant" onClick={handleBlock}>
                          <span className="material-symbols-outlined text-[14px]">block</span>
                          {isBlocked
                            ? (locale === "mr" ? "अनब्लॉक करा" : "Unblock")
                            : (locale === "mr" ? "ब्लॉक करा" : "Block")}
                        </Button>
                        <Button size="sm" variant="ghost" className="text-xs gap-1 text-on-surface-variant" onClick={() => setShowReportForm(true)}>
                          <span className="material-symbols-outlined text-[14px]">flag</span>
                          {locale === "mr" ? "रिपोर्ट करा" : "Report"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {isProfileOwner && (
                    <div className="mt-4">
                      <Link href="/register">
                        <Button size="sm" variant="outline" className="w-full gap-1">
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          {t("profile.editProfile")}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Report Form */}
            {showReportForm && (
              <Card className="bg-surface-container-low border-0 shadow-sm mt-4">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-bold text-royal-ink">
                    {locale === "mr" ? "रिपोर्ट का करत आहात?" : "Why are you reporting?"}
                  </h3>
                  <select value={reportReason} onChange={e => setReportReason(e.target.value)}
                    className="w-full bg-background-cream border-none rounded-xl p-2 text-sm focus:ring-2 focus:ring-primary outline-none">
                    <option value="">{locale === "mr" ? "कारण निवडा" : "Select reason"}</option>
                    <option value="FAKE_PROFILE">{locale === "mr" ? "बनावट प्रोफाइल" : "Fake Profile"}</option>
                    <option value="HARASSMENT">{locale === "mr" ? "छळ" : "Harassment"}</option>
                    <option value="INAPPROPRIATE">{locale === "mr" ? "अयोग्य सामग्री" : "Inappropriate Content"}</option>
                    <option value="SPAM">{locale === "mr" ? "स्पॅम" : "Spam"}</option>
                    <option value="OTHER">{locale === "mr" ? "इतर" : "Other"}</option>
                  </select>
                  <textarea value={reportDesc} onChange={e => setReportDesc(e.target.value)}
                    placeholder={locale === "mr" ? "अधिक माहिती (पर्यायी)" : "More details (optional)"}
                    className="w-full bg-background-cream border-none rounded-xl p-2 text-sm focus:ring-2 focus:ring-primary outline-none resize-none h-20" />
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-red-500 hover:bg-red-600" onClick={handleReport}>
                      {locale === "mr" ? "रिपोर्ट सबमिट करा" : "Submit Report"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowReportForm(false)}>
                      {t("common.cancel")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="about" className="flex-1">{t("profile.aboutMe")}</TabsTrigger>
                <TabsTrigger value="family" className="flex-1">{t("profile.familyInfo")}</TabsTrigger>
                <TabsTrigger value="horoscope" className="flex-1">{t("profile.horoscope")}</TabsTrigger>
                <TabsTrigger value="gallery" className="flex-1">{t("profile.photoGallery")}</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6 space-y-4">
                {p.aboutMe && (
                  <Card className="bg-surface-container-low border-0 shadow-sm">
                    <CardContent className="p-5">
                      <h3 className="mb-3 font-bold text-royal-ink">{t("profile.aboutMe")}</h3>
                      <p className="text-sm leading-relaxed text-on-surface-variant">
                        {(() => {
                          if (isViewerPremium || isProfileOwner) return p.aboutMe
                          return p.aboutMe.slice(0, 100) + (p.aboutMe.length > 100 ? "..." : "")
                        })()}
                      </p>
                    </CardContent>
                  </Card>
                )}
                <Card>
                  <CardContent className="divide-y divide-surface-container p-0">
                    {[
                      ...(p.education ? [{ icon: "school", label: t("registration.education"), value: p.education }] : []),
                      ...(p.occupation ? [{ icon: "work", label: t("registration.occupation"), value: p.occupation }] : []),
                      ...(p.village ? [{ icon: "location_on", label: t("registration.village"), value: p.village }] : []),
                      ...(p.caste ? [{ icon: "groups", label: t("registration.caste"), value: p.caste }] : []),
                      ...(p.maritalStatus ? [{ icon: "favorite", label: t("registration.maritalStatus"), value: p.maritalStatus }] : []),
                      ...(p.district ? [{ icon: "map", label: t("registration.district"), value: p.district }] : []),
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 px-5 py-3">
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">{item.icon}</span>
                        <span className="flex-1 text-sm text-on-surface-variant">{item.label}</span>
                        <span className="text-sm font-medium text-royal-ink">{item.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                {p.expectations && (
                  <Card className="bg-surface-container-low border-0 shadow-sm">
                    <CardContent className="p-5">
                      <h3 className="mb-3 font-bold text-royal-ink">{t("profile.expectations")}</h3>
                      <p className="text-sm leading-relaxed text-on-surface-variant">{p.expectations}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="family" className="mt-6">
                <Card>
                  <CardContent className="divide-y divide-surface-container p-0">
                    {(profile?.family ? [
                      { label: t("registration.fatherName"), value: profile.family.fatherName },
                      { label: t("registration.motherName"), value: profile.family.motherName },
                      { label: t("registration.brothers"), value: profile.family.brothers?.toString() },
                      { label: t("registration.sisters"), value: profile.family.sisters?.toString() },
                      { label: t("registration.familyType"), value: profile.family.familyType },
                      { label: t("registration.familyStatus"), value: profile.family.familyStatus },
                    ] : [
                      { label: t("registration.fatherName"), value: "-" },
                      { label: t("registration.motherName"), value: "-" },
                    ]).filter(item => item.value).map((item, i) => (
                      <div key={i} className="flex items-center justify-between px-5 py-3">
                        <span className="text-sm text-on-surface-variant">{item.label}</span>
                        <span className="text-sm font-medium text-royal-ink">{item.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="horoscope" className="mt-6">
                <Card>
                  <CardContent className="divide-y divide-surface-container p-0">
                    {(profile?.horoscope ? [
                      { label: locale === "mr" ? "नक्षत्र" : "Nakshatra", value: profile.horoscope.nakshatra || "-" },
                      { label: locale === "mr" ? "राशी" : "Raashi", value: profile.horoscope.raashi || "-" },
                      { label: locale === "mr" ? "मांगलिक" : "Manglik", value: profile.horoscope.manglik ? (locale === "mr" ? "होय" : "Yes") : (locale === "mr" ? "नाही" : "No") },
                    ] : [
                      { label: locale === "mr" ? "नक्षत्र" : "Nakshatra", value: "-" },
                      { label: locale === "mr" ? "राशी" : "Raashi", value: "-" },
                      { label: locale === "mr" ? "मांगलिक" : "Manglik", value: "-" },
                    ]).map((item, i) => (
                      <div key={i} className="flex items-center justify-between px-5 py-3">
                        <span className="text-sm text-on-surface-variant">{item.label}</span>
                        <span className="text-sm font-medium text-royal-ink">{item.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                {!isProfileOwner && user?.id && (
                  <Button variant="outline" className="w-full mt-4 gap-2" onClick={() => setShowGunaMatch(true)}>
                    <span className="material-symbols-outlined">auto_awesome</span>
                    {locale === "mr" ? "कुंडली जुळणी पहा" : "View Kundali Matching"}
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="gallery" className="mt-6 space-y-4">
                <Card>
                  <CardContent className="p-5">
                    <h3 className="mb-4 font-bold text-royal-ink">{t("profile.photoGallery")}</h3>
                    {gallery.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {gallery.map((photo, i) => (
                          <div key={photo.url || i} className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-outline-variant/30 transition-shadow hover:shadow-md">
                            <img src={photo.thumbUrl || photo.url} alt="" className="h-full w-full object-cover" />
                            {photo.isPrimary && (
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                                <span className="flex items-center gap-1 text-[10px] font-semibold text-white">
                                  <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                  Primary
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-sm text-on-surface-variant">{t("profile.noPhotosGallery")}</p>
                    )}
                    {isProfileOwner && (
                      <div className="mt-4">
                        <FileUpload photos={gallery} onPhotosChange={setGallery} onUpload={() => {}} maxFiles={5} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {showGunaMatch && user?.id && targetUserId && (
        <GunaMatchModal
          open={showGunaMatch}
          onClose={() => setShowGunaMatch(false)}
          userId1={user.id}
          userId2={targetUserId}
        />
      )}
    </MainLayout>
  )
}
