"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useI18n } from "@/lib/i18n"
import { useAuthStore } from "@/store/auth-store"
import { ExpiryReminderBanner } from "@/components/ExpiryReminderBanner"
import { MainLayout } from "@/components/layout/MainLayout"
import toast from "react-hot-toast"
import { maskName, getAge } from "@/lib/utils"

export default function DashboardPage() {
  const { t, locale } = useI18n()
  const router = useRouter()
  const { user } = useAuthStore()
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set())
  const [profileScore, setProfileScore] = useState(0)
  const [pendingItems, setPendingItems] = useState<string[]>([])
  const [recentViewers, setRecentViewers] = useState<any[]>([])
  const [totalViews, setTotalViews] = useState(0)
  const [recommendedMatches, setRecommendedMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [matchCount, setMatchCount] = useState(0)
  const [messageCount, setMessageCount] = useState(0)

  useEffect(() => {
    if (!user?.id) return
    const uid = user.id
    Promise.all([
      fetch(`/api/profile/strength?userId=${uid}`).then(r => r.json()),
      fetch(`/api/dashboard/views?userId=${uid}`).then(r => r.json()),
      fetch(`/api/dashboard/matches?userId=${uid}`).then(r => r.json()),
      fetch(`/api/shortlist?userId=${uid}`).then(r => r.json()),
    ]).then(([strength, views, matches, shortlist]) => {
      if (strength.success) {
        setProfileScore(strength.score)
        setPendingItems(strength.pendingItems)
      }
      if (views.success) {
        setTotalViews(views.totalViews)
        setRecentViewers(views.recentViews)
      }
      if (matches.success) {
        setRecommendedMatches(matches.matches)
      }
      if (shortlist.success) {
        setShortlistedIds(new Set((shortlist.profiles || []).map((p: any) => p.id)))
      }
    }).catch(e => console.error("Failed to load dashboard data:", e)).finally(() => setLoading(false))
  }, [user?.id])

  useEffect(() => {
    if (!user?.id) return
    fetch(`/api/messages/count?userId=${user.id}`).then(r => r.json()).then(d => {
      if (d.count !== undefined) setMessageCount(d.count)
    }).catch(e => console.error("Failed to load message count:", e))
    fetch(`/api/interests/count?userId=${user.id}`).then(r => r.json()).then(d => {
      if (d.count !== undefined) setMatchCount(d.count)
    }).catch(e => console.error("Failed to load interests count:", e))
  }, [user?.id])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500"
    if (score >= 50) return "bg-amber-500"
    return "bg-primary"
  }
  const getScoreLabel = (score: number) => {
    if (score >= 80) return locale === "mr" ? "उत्तम!" : "Great!"
    if (score >= 50) return locale === "mr" ? "चांगले" : "Good"
    return locale === "mr" ? "सुधारणा आवश्यक" : "Needs Improvement"
  }

  return (
    <MainLayout>
      <ExpiryReminderBanner />
      <div className="pt-20 pb-24 px-4 md:px-8 max-w-container mx-auto">
        <button onClick={() => router.back()}
          className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary transition-colors mb-2">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span className="hidden md:inline">{locale === "mr" ? "मागे" : "Back"}</span>
        </button>
        {/* Profile Completion */}
        <section className="mb-8">
          <div className="bg-surface-container-low p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,27,77,0.05)] border-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <span className="material-symbols-outlined text-7xl">edit_note</span>
            </div>
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="font-headline-md text-headline-md text-primary mb-1">
                  {locale === "mr" ? `नमस्कार, सदस्य!` : `Hello, Member!`}
                </h2>
                <p className="font-body-md text-on-surface-variant">
                  {locale === "mr"
                    ? `तुमची प्रोफाइल ${profileScore}% पूर्ण आहे`
                    : `Your profile is ${profileScore}% complete`}
                </p>
              </div>
              <span className="font-label-md text-primary font-bold">{profileScore}%</span>
            </div>
            <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden">
              <div className={`${getScoreColor(profileScore)} h-full rounded-full transition-all duration-1000`}
                style={{ width: `${profileScore}%` }} />
            </div>
            {pendingItems.length > 0 && (
              <div className="mt-4 space-y-1">
                <p className="text-xs font-medium text-on-surface-variant">
                  {locale === "mr" ? "सुधारणा सुचवा:" : "Suggestions to improve:"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {pendingItems.map(item => (
                    <span key={item} className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <Link href="/register" className="mt-4 text-primary flex items-center gap-2 font-label-md hover:underline">
              {locale === "mr" ? "तुमची माहिती पूर्ण करा" : "Complete your profile"}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* Stats Bento */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-primary-container/10 p-5 rounded-2xl border border-primary-container/20 flex flex-col justify-between">
            <span className="material-symbols-outlined text-primary text-3xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
            <div>
              <div className="text-2xl font-extrabold text-primary">{totalViews}</div>
              <div className="text-sm font-medium text-on-primary-container">
                {locale === "mr" ? "प्रोफाइल दृश्ये" : "Profile Views"}
              </div>
            </div>
          </div>
          <div className="bg-secondary-container/10 p-5 rounded-2xl border border-secondary-container/20 flex flex-col justify-between">
            <span className="material-symbols-outlined text-secondary text-3xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span>
            <div>
              <div className="text-2xl font-extrabold text-secondary">{matchCount}</div>
              <div className="text-sm font-medium text-on-secondary-container">
                {locale === "mr" ? "इंटरेस्ट" : "Interests"}
              </div>
            </div>
          </div>
          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200/50 flex flex-col justify-between">
            <span className="material-symbols-outlined text-emerald-600 text-3xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
            <div>
              <div className="text-2xl font-extrabold text-emerald-700">{messageCount}</div>
              <div className="text-sm font-medium text-emerald-700">
                {locale === "mr" ? "संदेश" : "Messages"}
              </div>
            </div>
          </div>
          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200/50 flex flex-col justify-between">
            <span className="material-symbols-outlined text-amber-600 text-3xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            <div>
              <div className="text-2xl font-extrabold text-amber-700">{getScoreLabel(profileScore)}</div>
              <div className="text-sm font-medium text-amber-700">
                {locale === "mr" ? "प्रोफाइल स्कोअर" : "Profile Score"}
              </div>
            </div>
          </div>
        </section>

        {/* Recommended Matches */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-headline-md text-headline-md text-royal-ink flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              {locale === "mr" ? "तुमच्यासाठी शिफारस केलेले" : "Recommended for you"}
            </h3>
            <Link href="/search" className="text-primary font-label-md">
              {locale === "mr" ? "सर्व पहा" : "View All"}
            </Link>
          </div>
          {loading ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[1,2,3].map(i => (
                <div key={i} className="min-w-[280px] bg-surface-container-low rounded-2xl animate-pulse h-72 border-0" />
              ))}
            </div>
          ) : recommendedMatches.length === 0 ? (
            <div className="bg-surface-container-low p-8 rounded-2xl text-center border-0 shadow-sm">
              <span className="material-symbols-outlined text-4xl text-outline mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>search_off</span>
              <p className="text-on-surface-variant">
                {locale === "mr" ? "अजून कोणतेही सामने नाहीत" : "No matches yet"}
              </p>
              <Link href="/search" className="mt-2 inline-block text-primary font-label-md hover:underline">
                {locale === "mr" ? "सर्च करा" : "Search now"}
              </Link>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x" style={{ scrollbarWidth: "none" }}>
              {recommendedMatches.map((m, i) => {
                const isShortlisted = shortlistedIds.has(m.id)
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="min-w-[280px] md:min-w-[320px] bg-surface-container-low rounded-2xl shadow-[0_4px_20px_rgba(0,27,77,0.05)] border-0 snap-start overflow-hidden group"
                  >
                    <Link href={`/profile?userId=${m.id}`}>
                      <div className="h-48 relative bg-gradient-to-br from-[#9B1B30]/10 to-[#D4AF37]/10">
                        {m.photos?.[0]?.url ? (
                          <img src={m.photos[0].url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="material-symbols-outlined text-5xl text-primary/30">person</span>
                          </div>
                        )}
                        {m.isVerified && (
                          <div className="absolute top-3 left-3 bg-emerald-growth/90 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm">
                            Verified
                          </div>
                        )}
                        {m.isPremium && (
                          <div className="absolute top-3 right-3 bg-tertiary-container/90 text-on-tertiary-container text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm">
                            Premium
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link href={`/profile?userId=${m.id}`}>
                        <h4 className="font-headline-md text-[18px] text-royal-ink">
                          {m.isPremium ? (m.profile?.fullNameEn || m.profile?.fullNameMr) : maskName(m.profile?.fullNameEn || m.profile?.fullNameMr, false)}
                        </h4>
                      </Link>
                      <p className="text-on-surface-variant text-sm mb-3">
                        {m.profile?.dateOfBirth ? getAge(m.profile.dateOfBirth) : "?"}{locale === "mr" ? " वर्षे" : " yrs"}
                        {m.profile?.education ? ` • ${m.profile.education}` : ""}
                      </p>
                      <div className="flex items-center gap-1 text-on-surface-variant text-sm mb-4">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        {m.profile?.village}{m.profile?.district ? `, ${m.profile.district}` : ""}
                      </div>
                      <button
                        onClick={async () => {
                          if (!user?.id) return
                          const res = await fetch("/api/shortlist/toggle", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userId: user.id, targetId: m.id }),
                          })
                          const data = await res.json()
                          if (data.success) {
                            setShortlistedIds(prev => {
                              const n = new Set(prev)
                              if (data.shortlisted) n.add(m.id)
                              else n.delete(m.id)
                              return n
                            })
                          }
                        }}
                        className="w-full py-2 bg-primary text-white rounded-lg font-label-md hover:bg-on-primary-container transition-colors active:scale-95 flex justify-center items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: isShortlisted ? "'FILL' 1" : "'FILL' 0" }}>
                          bookmark
                        </span>
                        {isShortlisted
                          ? (locale === "mr" ? "यादीत" : "Shortlisted")
                          : (locale === "mr" ? "यादीत टाका" : "Shortlist")}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </section>

        {/* Who Viewed */}
        <section className="mb-8">
          <h3 className="font-headline-md text-headline-md text-royal-ink mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">visibility</span>
            {locale === "mr" ? "कोणी पाहिले?" : "Who viewed you?"}
          </h3>
          {recentViewers.length === 0 ? (
            <div className="bg-surface-container-low p-6 rounded-2xl text-center border-0 shadow-sm">
              <span className="material-symbols-outlined text-3xl text-outline mb-2">visibility_off</span>
              <p className="text-sm text-on-surface-variant">
                {locale === "mr" ? "अजून कोणीही पाहिले नाही" : "No one has viewed your profile yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentViewers.map((v, i) => (
                <motion.div
                  key={v.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-surface-container-low p-4 rounded-2xl flex items-center gap-4 border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-[#9B1B30]/10 flex items-center justify-center">
                    {v.photo ? (
                      <img src={v.photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-primary">person</span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-on-surface">
                        {maskName(v.name, false)}
                      </h4>
                      <span className="text-[10px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                        {v.viewedAt ? new Date(v.viewedAt).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <p className="text-caption text-on-surface-variant">
                      {v.village}{v.district ? `, ${v.district}` : ""}
                    </p>
                  </div>
                  <Link href={`/profile?userId=${v.id}`}>
                    <span className="material-symbols-outlined text-primary">chevron_right</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  )
}
