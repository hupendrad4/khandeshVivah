"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { usePaymentGate } from "@/lib/use-payment-gate"
import { useAuthStore } from "@/store/auth-store"
import toast from "react-hot-toast"
import { maskName } from "@/lib/utils"

const recommendations = [
  { name: "प्रियांका पाटील", age: "२५", education: "बी.ई. कॉम्प्युटर", location: "जळगाव / पाचोरा", photo: "https://i.pravatar.cc/400?img=5" },
  { name: "स्नेहा महाजन", age: "२७", education: "एम.बी.ए.", location: "धुळे / शिरपूर", photo: "https://i.pravatar.cc/400?img=9" },
  { name: "आरती चौधरी", age: "२४", education: "एम.ए. मराठी", location: "नंदुरबार / शहादा", photo: "https://i.pravatar.cc/400?img=7" },
]

const recentViewers = [
  { name: "कोमल सोनवणे", age: "२४", occupation: "आर्किटेक्ट", location: "जळगाव", time: "२ तास आधी", photo: "https://i.pravatar.cc/100?img=10" },
  { name: "दीक्षा पाटील", age: "२६", occupation: "शिक्षिका", location: "भुसावळ", time: "५ तास आधी", photo: "https://i.pravatar.cc/100?img=8" },
]

export default function DashboardPage() {
  const { t, locale } = useI18n()
  const { executeWithGate, isProcessing } = usePaymentGate()
  const { user } = useAuthStore()
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set())

  return (
    <>
      <div className="pt-20 pb-24 px-4 md:px-8 max-w-container mx-auto">
        {/* Profile Completion */}
        <section className="mb-8">
          <div className="bg-surface-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,27,77,0.05)] border border-outline-variant/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <span className="material-symbols-outlined text-7xl">edit_note</span>
            </div>
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="font-headline-md text-headline-md text-primary mb-1">
                  {locale === "mr" ? "नमस्कार, सदस्य!" : "Hello, Member!"}
                </h2>
                <p className="font-body-md text-on-surface-variant">
                  {locale === "mr" ? "तुमची प्रोफाइल ७०% पूर्ण आहे" : "Your profile is 70% complete"}
                </p>
              </div>
              <span className="font-label-md text-primary font-bold">७०%</span>
            </div>
            <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: "70%" }} />
            </div>
            <Link href="/register" className="mt-6 text-primary flex items-center gap-2 font-label-md hover:underline">
              {locale === "mr" ? "तुमची माहिती पूर्ण करा" : "Complete your profile"}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* Recommended */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-headline-md text-headline-md text-royal-ink flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              {locale === "mr" ? "तुमच्यासाठी शिफारस केलेले" : "Recommended for you"}
            </h3>
            <Link href="/search" className="text-primary font-label-md">{locale === "mr" ? "सर्व पहा" : "View All"}</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x" style={{ scrollbarWidth: "none" }}>
            {recommendations.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="min-w-[280px] md:min-w-[320px] bg-surface-white rounded-2xl shadow-[0_4px_20px_rgba(0,27,77,0.05)] border border-outline-variant/20 snap-start overflow-hidden group"
              >
                <div className="h-48 relative bg-gradient-to-br from-[#8f4e00]/10 to-[#435b9f]/10">
                  <div className="absolute top-3 left-3 bg-emerald-growth/90 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm">
                    Verified
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-headline-md text-[18px] text-royal-ink">{r.name}</h4>
                  <p className="text-on-surface-variant text-sm mb-3">{r.age}{locale === "mr" ? " वर्षे" : " yrs"} • {r.education}</p>
                  <div className="flex items-center gap-1 text-on-surface-variant text-sm mb-4">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {r.location}
                  </div>
                  <button
                    onClick={() => {
                      if (shortlistedIds.has(r.name)) {
                        setShortlistedIds(prev => { const n = new Set(prev); n.delete(r.name); return n })
                      } else {
                        setShortlistedIds(prev => new Set(prev).add(r.name))
                      }
                    }}
                    className="w-full py-2 bg-primary text-white rounded-lg font-label-md hover:bg-on-primary-container transition-colors active:scale-95 flex justify-center items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: shortlistedIds.has(r.name) ? "'FILL' 1" : "'FILL' 0" }}>
                      favorite
                    </span>
                    {shortlistedIds.has(r.name)
                      ? (locale === "mr" ? "आवड पाठवली" : "Interest Sent")
                      : (locale === "mr" ? "आवड पाठवा" : "Send Interest")}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Who Viewed */}
        <section className="mb-8">
          <h3 className="font-headline-md text-headline-md text-royal-ink mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">visibility</span>
            {locale === "mr" ? "कोणी पाहिले?" : "Who viewed you?"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentViewers.map((v, i) => (
              <motion.div
                key={v.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface-white p-4 rounded-2xl flex items-center gap-4 border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-[#8f4e00]/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{v.name[0]}</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-on-surface">{v.name}</h4>
                    <span className="text-[10px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">{v.time}</span>
                  </div>
                  <p className="text-caption text-on-surface-variant">{v.age}{locale === "mr" ? " वर्षे" : " yrs"} • {v.occupation} • {v.location}</p>
                </div>
                <span className="material-symbols-outlined text-primary-container">chevron_right</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Bento */}
        <section className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-primary-container/10 p-5 rounded-2xl border border-primary-container/20 flex flex-col justify-between">
            <span className="material-symbols-outlined text-primary text-3xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
            <div>
              <div className="text-2xl font-extrabold text-primary">१२</div>
              <div className="text-sm font-medium text-on-primary-container">{locale === "mr" ? "नवीन संदेश" : "New Messages"}</div>
            </div>
          </div>
          <div className="bg-secondary-container/10 p-5 rounded-2xl border border-secondary-container/20 flex flex-col justify-between">
            <span className="material-symbols-outlined text-secondary text-3xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span>
            <div>
              <div className="text-2xl font-extrabold text-secondary">४५</div>
              <div className="text-sm font-medium text-on-secondary-container">{locale === "mr" ? "मॅचेस" : "Matches"}</div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
