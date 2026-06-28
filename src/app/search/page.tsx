"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useI18n } from "@/lib/i18n"
import { usePaymentGate } from "@/lib/use-payment-gate"
import { useAuthStore } from "@/store/auth-store"
import { maskName } from "@/lib/utils"
import toast from "react-hot-toast"

interface DistrictOption { id: string; en: string; mr: string }
interface TalukaOption { id: string; en: string; mr: string }
interface CasteOption {
  id: string; en: string; mr: string; subCastes: { en: string; mr: string }[]
}

const sampleResults = [
  { id: "1", name: "प्रिया पाटील", age: 25, height: "5'4\"", caste: "लेवा पाटील", education: "M.E. (Computer)", occupation: "सॉफ्टवेअर इंजिनिअर", district: "जळगाव", village: "चोपडा", score: 92, verified: true, premium: false },
  { id: "2", name: "अमोल चौधरी", age: 28, height: "5'11\"", caste: "मराठा", education: "MBA (Finance)", occupation: "बँक मॅनेजर", district: "धुळे", village: "शिरपूर", score: 88, verified: true, premium: true },
  { id: "3", name: "स्नेहा पाटील", age: 26, height: "5'5\"", caste: "लेवा पाटील", education: "MBBS", occupation: "डॉक्टर", district: "नाशिक", village: "बागलाण", score: 85, verified: true, premium: false },
  { id: "4", name: "रुपाली महाजन", age: 24, height: "5'2\"", caste: "कुणबी", education: "M.Sc. Botany", occupation: "शिक्षिका", district: "नंदुरबार", village: "नवापूर", score: 82, verified: false, premium: true },
  { id: "5", name: "अर्चना पवार", age: 23, height: "5'3\"", caste: "माळी", education: "B.A. History", occupation: "सरकारी कर्मचारी", district: "जळगाव", village: "भुसावळ", score: 80, verified: true, premium: false },
  { id: "6", name: "वैशाली सोनवणे", age: 27, height: "5'6\"", caste: "लेवा पाटील", education: "B.Sc. Nursing", occupation: "परिचारिका", district: "जळगाव", village: "पाचोरा", score: 78, verified: false, premium: false },
]

export default function SearchPage() {
  const { t, locale } = useI18n()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set())
  const [districts, setDistricts] = useState<DistrictOption[]>([])
  const [castes, setCastes] = useState<CasteOption[]>([])
  const [talukas, setTalukas] = useState<TalukaOption[]>([])
  const [loadingDistricts, setLoadingDistricts] = useState(true)
  const [loadingCastes, setLoadingCastes] = useState(true)
  const [loadingTalukas, setLoadingTalukas] = useState(false)
  const { executeWithGate, isProcessing } = usePaymentGate()
  const { user } = useAuthStore()

  const profileImages = [
    "https://i.pravatar.cc/400?img=5",
    "https://i.pravatar.cc/400?img=11",
    "https://i.pravatar.cc/400?img=9",
    "https://i.pravatar.cc/400?img=7",
    "https://i.pravatar.cc/400?img=8",
    "https://i.pravatar.cc/400?img=10",
  ]

  useEffect(() => {
    Promise.all([
      fetch("/api/locations?type=districts").then(r => r.json()),
      fetch("/api/locations?type=castes").then(r => r.json()),
    ]).then(([d, c]) => {
      setDistricts(d.data || [])
      setCastes(c.data || [])
      setLoadingDistricts(false)
      setLoadingCastes(false)
    }).catch(() => {
      setLoadingDistricts(false)
      setLoadingCastes(false)
    })
  }, [])

  useEffect(() => {
    if (selectedDistrict) {
      setLoadingTalukas(true)
      fetch(`/api/locations?type=talukas&districtId=${selectedDistrict}`)
        .then(r => r.json()).then(d => {
          setTalukas(d.data || [])
          setLoadingTalukas(false)
        }).catch(() => setLoadingTalukas(false))
    } else {
      setTalukas([])
    }
  }, [selectedDistrict])

  return (
    <>
      <div className="min-h-screen bg-background-cream pt-20 pb-24">
        <div className="mx-auto max-w-container px-4 md:px-gutter grid grid-cols-1 md:grid-cols-12 gap-6 relative">
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #d3ae36 1px, transparent 0)",
            backgroundSize: "24px 24px",
            opacity: 0.05,
          }} />

          {/* Filters Sidebar */}
          <aside className="md:col-span-3 h-fit sticky top-24 space-y-4">
            <div className="bg-surface-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,27,77,0.05)] border border-outline-variant/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline-md text-headline-md text-royal-ink">
                  {locale === "mr" ? "फिल्टर निवडा" : "Select Filters"}
                </h2>
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}>tune</span>
              </div>

              <div className="space-y-6 max-h-[618px] overflow-y-auto pr-2" style={{ scrollbarWidth: "thin", scrollbarColor: "#8f4e00 #f1f1f1" }}>
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={locale === "mr" ? "नाव किंवा आयडी शोधा..." : "Search by name or ID..."}
                    className="w-full pl-10 pr-4 py-3 bg-background-cream border-none rounded-xl focus:ring-2 focus:ring-primary text-body-md outline-none"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                </div>

                {/* District */}
                <div>
                  <label className="block font-label-md text-royal-ink mb-3 uppercase tracking-wider">
                    {locale === "mr" ? "जिल्हा" : "District"}
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {loadingDistricts ? (
                      <p className="text-sm text-on-surface-variant">{t("common.loading")}</p>
                    ) : districts.length > 0 ? districts.map((d) => (
                      <label key={d.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-container/10 transition-colors cursor-pointer">
                        <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary" />
                        <span className="text-body-md">{locale === "mr" ? d.mr : d.en}</span>
                      </label>
                    )) : (
                      <>
                        <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-container/10 transition-colors cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded border-outline-variant text-primary focus:ring-primary" />
                          <span className="text-body-md">जळगाव (Jalgaon)</span>
                        </label>
                        <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-container/10 transition-colors cursor-pointer">
                          <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary" />
                          <span className="text-body-md">धुळे (Dhule)</span>
                        </label>
                        <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-container/10 transition-colors cursor-pointer">
                          <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary" />
                          <span className="text-body-md">नंदुरबार (Nandurbar)</span>
                        </label>
                        <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-container/10 transition-colors cursor-pointer">
                          <input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary" />
                          <span className="text-body-md">नाशिक (Nashik)</span>
                        </label>
                      </>
                    )}
                  </div>
                </div>

                {/* Taluka */}
                <div>
                  <label className="block font-label-md text-royal-ink mb-2">
                    {locale === "mr" ? "तालुका" : "Taluka"}
                  </label>
                  <select className="w-full bg-background-cream border-none rounded-xl p-3 text-body-md focus:ring-2 focus:ring-primary outline-none">
                    <option value="">{locale === "mr" ? "सर्व तालुके" : "All Talukas"}</option>
                    {loadingTalukas ? (
                      <option disabled>{t("common.loading")}</option>
                    ) : (
                      talukas.map((t) => (
                        <option key={t.id} value={t.id}>{locale === "mr" ? t.mr : t.en}</option>
                      ))
                    )}
                  </select>
                </div>

                {/* Caste */}
                <div>
                  <label className="block font-label-md text-royal-ink mb-3">
                    {locale === "mr" ? "जात (Caste)" : "Caste"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["लेवा पाटील", "मराठा", "माळी", "कुणबी"].map((caste) => (
                      <span key={caste} className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-caption cursor-pointer hover:bg-primary-container/20 transition-colors">
                        {caste}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <label className="block font-label-md text-royal-ink mb-2">
                    {locale === "mr" ? "शिक्षण" : "Education"}
                  </label>
                  <select className="w-full bg-background-cream border-none rounded-xl p-3 text-body-md focus:ring-2 focus:ring-primary outline-none">
                    <option value="">{locale === "mr" ? "शिक्षण निवडा" : "Select Education"}</option>
                    <option value="engineering">{locale === "mr" ? "इंजिनिअरिंग" : "Engineering"}</option>
                    <option value="medical">{locale === "mr" ? "वैद्यकीय (Medical)" : "Medical"}</option>
                    <option value="graduate">{locale === "mr" ? "पदवीधर (Graduate)" : "Graduate"}</option>
                    <option value="postgraduate">{locale === "mr" ? "पदव्युत्तर (Post Graduate)" : "Post Graduate"}</option>
                  </select>
                </div>

                {/* Village */}
                <div>
                  <label className="block font-label-md text-royal-ink mb-2">
                    {locale === "mr" ? "मूळ गाव" : "Native Village"}
                  </label>
                  <input
                    type="text"
                    placeholder={locale === "mr" ? "गावाचे नाव टाका" : "Enter village name"}
                    className="w-full bg-background-cream border-none rounded-xl p-3 text-body-md focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <button className="w-full mt-6 bg-primary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-on-primary-container transition-all active:scale-95">
                {locale === "mr" ? "फिल्टर लागू करा" : "Apply Filters"}
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-9 space-y-6">
            {/* Results Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-white p-4 rounded-2xl shadow-sm border border-outline-variant/10">
              <div>
                <h2 className="font-headline-md text-headline-md text-royal-ink">
                  {sampleResults.length}{locale === "mr" ? "+ सामने सापडले" : "+ matches found"}
                </h2>
                <p className="text-caption text-on-surface-variant">
                  {locale === "mr" ? "तुमच्या निवडीनुसार उत्तम स्थळे" : "Best matches based on your preferences"}
                </p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-label-md text-on-surface-variant whitespace-nowrap">
                  {locale === "mr" ? "क्रमवारी:" : "Sort:"}
                </span>
                <select className="bg-background border-none text-label-md rounded-lg p-2 focus:ring-1 focus:ring-primary w-full md:w-40 outline-none">
                  <option value="newest">{locale === "mr" ? "नवीन नोंदणी" : "Newest Registration"}</option>
                  <option value="age">{locale === "mr" ? "वय: कमी ते जास्त" : "Age: Low to High"}</option>
                  <option value="education">{locale === "mr" ? "शिक्षणानुसार" : "By Education"}</option>
                </select>
              </div>
            </div>

            {/* Profile Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleResults.map((profile, i) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-surface-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,27,77,0.05)] border border-outline-variant/20 group hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={profileImages[i]}
                      alt={profile.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {profile.verified && (
                      <div className="absolute top-3 left-3 bg-emerald-growth/90 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-widest backdrop-blur-sm">
                        Verified
                      </div>
                    )}
                    {profile.premium && (
                      <div className="absolute top-3 right-3 bg-tertiary-container/90 text-on-tertiary-container text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-widest backdrop-blur-sm">
                        Premium
                      </div>
                    )}
                    <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="font-bold text-lg">{profile.premium ? profile.name : maskName(profile.name, false)}</p>
                      <p className="text-xs opacity-90">{profile.age} {locale === "mr" ? "वर्ष" : "yrs"} • {profile.height}</p>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px]">school</span>
                      <span className="text-caption">{profile.education}</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                      <span className="text-caption">{profile.village}, {profile.district}</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[18px]">work</span>
                      <span className="text-caption">{profile.occupation}</span>
                    </div>

                    <div className="pt-3 border-t border-outline-variant/20 flex justify-between items-center">
                      <button
                        onClick={() => {
                          if (shortlistedIds.has(profile.id)) {
                            setShortlistedIds(prev => { const n = new Set(prev); n.delete(profile.id); return n })
                          } else {
                            setShortlistedIds(prev => new Set(prev).add(profile.id))
                          }
                        }}
                        className="flex items-center gap-1 text-primary hover:text-on-primary-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: shortlistedIds.has(profile.id) ? "'FILL' 1" : "'FILL' 0" }}>
                          favorite
                        </span>
                        <span className="font-label-md">
                          {shortlistedIds.has(profile.id)
                            ? (locale === "mr" ? "शॉर्टलिस्ट केले" : "Shortlisted")
                            : (locale === "mr" ? "शॉर्टलिस्ट" : "Shortlist")}
                        </span>
                      </button>
                      <button
                        disabled={isProcessing}
                        onClick={() => {
                          executeWithGate(
                            async () => { toast.success(locale === "mr" ? "चॅट लवकरच उपलब्ध" : "Chat coming soon") },
                            "send_message",
                            undefined,
                          )
                        }}
                        className="bg-primary text-white px-4 py-2 rounded-lg font-label-md flex items-center gap-2 active:scale-95 transition-transform"
                      >
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                        {locale === "mr" ? "चॅट करा" : "Chat"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center pt-8">
              <button className="px-8 py-3 bg-surface-white border border-primary text-primary rounded-xl font-bold hover:bg-primary hover:text-white transition-all shadow-sm">
                {locale === "mr" ? "आणखी पहा" : "Load More"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
