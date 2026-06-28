"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/MainLayout"
import { useI18n } from "@/lib/i18n"
import { useAuthStore } from "@/store/auth-store"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { maskName, getAge } from "@/lib/utils"
import { useSubscription } from "@/lib/use-subscription"
import toast from "react-hot-toast"

export default function MatchesPage() {
  const { t, locale } = useI18n()
  const router = useRouter()
  const { user } = useAuthStore()
  const subscription = useSubscription()
  const [activeTab, setActiveTab] = useState<"received" | "sent" | "accepted" | "shortlisted">("received")
  const [interests, setInterests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [shortlisted, setShortlisted] = useState<any[]>([])

  useEffect(() => {
    if (!user?.id) return
    Promise.all([
      fetch(`/api/interests/list?userId=${user.id}`).then(r => r.json()),
      fetch(`/api/shortlist?userId=${user.id}`).then(r => r.json()),
    ]).then(([iData, sData]) => {
      if (iData.success) setInterests(iData.interests || [])
      if (sData.success) setShortlisted(sData.profiles || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [user?.id])

  const respondInterest = async (interestId: string, status: string) => {
    const res = await fetch("/api/interests/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interestId, status }),
    })
    const data = await res.json()
    if (data.success) {
      setInterests(prev => prev.map(i => i.id === interestId ? { ...i, status } : i))
      toast.success(status === "ACCEPTED"
        ? (locale === "mr" ? "आवड स्वीकारली! आता चॅट करू शकता." : "Interest accepted! You can now chat.")
        : (locale === "mr" ? "आवड नाकारली" : "Interest rejected"))
    } else {
      toast.error(locale === "mr" ? "अयशस्वी" : "Failed")
    }
  }

  const received = interests.filter(i => i.receiverId === user?.id && i.status === "PENDING")
  const sent = interests.filter(i => i.senderId === user?.id && i.status === "PENDING")
  const accepted = interests.filter(i => i.status === "ACCEPTED")

  const renderShortlistedProfile = (profile: any) => {
    const p = profile?.profile || {}
    const photo = profile?.photos?.[0]?.url
    const age = p.dateOfBirth ? getAge(p.dateOfBirth) : "?"
    return (
      <motion.div key={profile.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container-low rounded-2xl overflow-hidden shadow-sm border-0 group hover:shadow-md transition-all duration-300">
        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-[#8f4e00]/10 to-[#435b9f]/10">
          {photo ? (
            <img src={photo} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="material-symbols-outlined text-5xl text-primary/30">person</span>
            </div>
          )}
          <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-2 left-3 text-white">
            <p className="font-bold">{p.fullNameEn ? maskName(p.fullNameEn, false) : "Profile"}</p>
            <p className="text-xs opacity-80">{age} {locale === "mr" ? "वर्ष" : "yrs"} · {p.village || ""}</p>
          </div>
        </div>
        <CardContent className="p-3">
          <div className="space-y-1.5 text-xs text-on-surface-variant mb-3">
            {p.occupation && <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">work</span>{p.occupation}</div>}
            {p.education && <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">school</span>{p.education}</div>}
          </div>
          <Button size="sm" onClick={() => router.push(`/profile?userId=${profile.id}`)}
            className="w-full bg-primary text-white text-xs h-8 gap-1">
            <span className="material-symbols-outlined text-[14px]">person</span>
            {locale === "mr" ? "प्रोफाइल पहा" : "View Profile"}
          </Button>
        </CardContent>
      </motion.div>
    )
  }

  const renderProfile = (interest: any, type: "sent" | "received" | "accepted") => {
    const isReceived = type === "received"
    const profile = isReceived ? interest.sender : interest.receiver
    const p = profile?.profile || {}
    const photo = profile?.photos?.[0]?.url
    const age = p.dateOfBirth ? getAge(p.dateOfBirth) : "?"

    return (
      <motion.div key={interest.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container-low rounded-2xl overflow-hidden shadow-sm border-0 group hover:shadow-md transition-all duration-300">
        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-[#8f4e00]/10 to-[#435b9f]/10">
          {photo ? (
            <img src={photo} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="material-symbols-outlined text-5xl text-primary/30">person</span>
            </div>
          )}
          <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-2 left-3 text-white">
            <p className="font-bold">{p.fullNameEn ? maskName(p.fullNameEn, false) : "Profile"}</p>
            <p className="text-xs opacity-80">{age} {locale === "mr" ? "वर्ष" : "yrs"} · {p.village || ""}</p>
          </div>
          {type === "accepted" && (
            <div className="absolute top-2 right-2 bg-emerald-growth/90 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 backdrop-blur-sm">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              {locale === "mr" ? "जुळले" : "Matched"}
            </div>
          )}
        </div>
        <CardContent className="p-3">
          <div className="space-y-1.5 text-xs text-on-surface-variant mb-3">
            {p.occupation && <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">work</span>{p.occupation}</div>}
            {p.education && <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">school</span>{p.education}</div>}
          </div>
          <div className="flex gap-1.5">
            {type === "received" && (
              <>
                <Button size="sm" onClick={() => respondInterest(interest.id, "ACCEPTED")}
                  className="flex-1 bg-primary text-white text-xs h-8 gap-1">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  {locale === "mr" ? "स्वीकारा" : "Accept"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => respondInterest(interest.id, "REJECTED")}
                  className="flex-1 text-xs h-8 gap-1 text-on-surface-variant border-outline-variant/30">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                  {locale === "mr" ? "नकारा" : "Reject"}
                </Button>
              </>
            )}
            {type === "sent" && (
              <div className="w-full text-center text-xs text-on-surface-variant py-2 flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">hourglass_empty</span>
                {locale === "mr" ? "प्रतिसादाची प्रतीक्षा आहे" : "Waiting for response"}
              </div>
            )}
            {type === "accepted" && (
              <Button size="sm" onClick={() => subscription.requireSubscription(() => {
                window.location.href = `/chat?userId=${profile?.id}`
              })} className="flex-1 bg-emerald-growth text-white text-xs h-8 gap-1">
                <span className="material-symbols-outlined text-[14px]">chat</span>
                {locale === "mr" ? "चॅट करा" : "Chat"}
              </Button>
            )}
          </div>
        </CardContent>
      </motion.div>
    )
  }

  return (
    <MainLayout>
      <div className="relative">
        <button onClick={() => router.back()}
          className="absolute top-4 left-4 z-20 flex items-center gap-1 text-white/80 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          <span className="text-sm font-medium hidden md:inline">{locale === "mr" ? "मागे" : "Back"}</span>
        </button>
      </div>
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <img src="https://i.pinimg.com/1200x/32/64/4b/32644b996d26cc359628ac78fe6227e7.jpg" alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center 30%" }} />
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      </div>

      <div className="bg-mandala-ornamental min-h-screen">
        <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-10">
          <div className="ornamental-corner-tl" /><div className="ornamental-corner-br" />

          {/* Tabs */}
          <div className="flex gap-1 bg-surface-container-low rounded-xl p-1 mb-6 shadow-sm">
            {(["received", "sent", "accepted", "shortlisted"] as const).map(tab => {
              const count = tab === "received" ? received.length : tab === "sent" ? sent.length : tab === "accepted" ? accepted.length : shortlisted.length
              return (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab ? "bg-primary text-white shadow-sm" : "text-on-surface-variant hover:text-primary"
                  }`}>
                  {tab === "received" ? (locale === "mr" ? "मिळालेल्या" : "Received") :
                   tab === "sent" ? (locale === "mr" ? "पाठवलेल्या" : "Sent") :
                   tab === "accepted" ? (locale === "mr" ? "जुळलेल्या" : "Accepted") :
                   (locale === "mr" ? "शॉर्टलिस्ट" : "Shortlisted")}
                  {count > 0 && <span className="ml-1.5 text-[10px] opacity-80">({count})</span>}
                </button>
              )
            })}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-surface-container-low rounded-2xl overflow-hidden animate-pulse border-0 shadow-sm">
                  <div className="h-36 bg-gradient-to-br from-[#8f4e00]/5 to-[#435b9f]/5" />
                  <div className="p-4 space-y-3"><div className="h-3 bg-surface-container-low rounded w-2/3" /><div className="h-3 bg-surface-container-low rounded w-1/2" /></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {activeTab === "received" && (
                received.length === 0 ? (
                  <div className="text-center py-16 bg-surface-container-low rounded-2xl border-0 shadow-sm">
                    <span className="material-symbols-outlined text-6xl text-outline mb-4">favorite</span>
                    <h3 className="text-lg font-medium text-on-surface-variant">
                      {locale === "mr" ? "कोणतीही नवीन आवड नाही" : "No new interests"}
                    </h3>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {received.map(i => renderProfile(i, "received"))}
                  </div>
                )
              )}
              {activeTab === "sent" && (
                sent.length === 0 ? (
                  <div className="text-center py-16 bg-surface-container-low rounded-2xl border-0 shadow-sm">
                    <span className="material-symbols-outlined text-6xl text-outline mb-4">send</span>
                    <h3 className="text-lg font-medium text-on-surface-variant">
                      {locale === "mr" ? "तुम्ही अजून कोणाला आवड पाठवली नाही" : "You haven't sent any interests yet"}
                    </h3>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sent.map(i => renderProfile(i, "sent"))}
                  </div>
                )
              )}
              {activeTab === "shortlisted" && (
                shortlisted.length === 0 ? (
                  <div className="text-center py-16 bg-surface-container-low rounded-2xl border-0 shadow-sm">
                    <span className="material-symbols-outlined text-6xl text-outline mb-4">bookmark</span>
                    <h3 className="text-lg font-medium text-on-surface-variant">
                      {locale === "mr" ? "कोणतेही शॉर्टलिस्ट केलेले प्रोफाइल नाही" : "No shortlisted profiles"}
                    </h3>
                    <p className="text-xs text-on-surface-variant/60 mt-1">
                      {locale === "mr" ? "प्रोफाइल शोधा आणि जतन करा" : "Search profiles and save them"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {shortlisted.map(p => renderShortlistedProfile(p))}
                  </div>
                )
              )}
              {activeTab === "accepted" && (
                accepted.length === 0 ? (
                  <div className="text-center py-16 bg-surface-container-low rounded-2xl border-0 shadow-sm">
                    <span className="material-symbols-outlined text-6xl text-outline mb-4">group</span>
                    <h3 className="text-lg font-medium text-on-surface-variant">
                      {locale === "mr" ? "अजून कोणतेही जुळणारे नाहीत" : "No matches yet"}
                    </h3>
                    <p className="text-xs text-on-surface-variant/60 mt-1">
                      {locale === "mr" ? "आवड पाठवा आणि प्रतिसादाची प्रतीक्षा करा" : "Send interests and wait for responses"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {accepted.map(i => renderProfile(i, "accepted"))}
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
