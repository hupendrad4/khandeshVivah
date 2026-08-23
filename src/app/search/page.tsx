"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { usePaymentGate } from "@/lib/use-payment-gate"
import { useSubscription } from "@/lib/use-subscription"
import { SubscriptionModal } from "@/components/SubscriptionModal"
import { useAuthStore } from "@/store/auth-store"
import { MainLayout } from "@/components/layout/MainLayout"
import { maskName, getAge } from "@/lib/utils"
import toast from "react-hot-toast"

interface DistrictOption { id: string; en: string; mr: string }
interface TalukaOption { id: string; en: string; mr: string }
interface VillageOption { en: string; mr: string }

const OTHER_VALUE = "OTHER"

const religionList = ["HINDU", "MUSLIM", "BUDDHIST", "JAIN", "CHRISTIAN", "SIKH"]
const educationList = [
  { value: "engineering", mr: "इंजिनिअरिंग", en: "Engineering" },
  { value: "medical", mr: "वैद्यकीय", en: "Medical" },
  { value: "graduate", mr: "पदवीधर", en: "Graduate" },
  { value: "postgraduate", mr: "पदव्युत्तर", en: "Post Graduate" },
]
const ageRanges = [
  { label: "18-25", min: 18, max: 25 },
  { label: "26-32", min: 26, max: 32 },
  { label: "33-40", min: 33, max: 40 },
  { label: "40+", min: 40, max: 99 },
]

export default function SearchPage() {
  const { t, locale } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { executeWithGate, isProcessing } = usePaymentGate()
  const { user } = useAuthStore()
  const subscription = useSubscription()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [selectedTaluka, setSelectedTaluka] = useState("")
  const [selectedCastes, setSelectedCastes] = useState<string[]>([])
  const [selectedReligions, setSelectedReligions] = useState<string[]>([])
  const [selectedEducation, setSelectedEducation] = useState("")
  const [selectedAgeRange, setSelectedAgeRange] = useState("")
  const [genderFilter, setGenderFilter] = useState<string>("")
  const [villageQuery, setVillageQuery] = useState("")
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortOrder, setSortOrder] = useState("newest")
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set())
  const [interestSent, setInterestSent] = useState<Set<string>>(new Set())
  const [interestAccepted, setInterestAccepted] = useState<Set<string>>(new Set())
  const [selectedPlan, setSelectedPlan] = useState("gold")
  const [districts, setDistricts] = useState<DistrictOption[]>([])
  const [talukas, setTalukas] = useState<TalukaOption[]>([])
  const [villages, setVillages] = useState<VillageOption[]>([])
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [savedSearches, setSavedSearches] = useState<any[]>([])
  const [saveSearchName, setSaveSearchName] = useState("")
  const [showSaveInput, setShowSaveInput] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [showOtherDistrict, setShowOtherDistrict] = useState(false)
  const [showOtherTaluka, setShowOtherTaluka] = useState(false)
  const [customDistrict, setCustomDistrict] = useState("")
  const [customTaluka, setCustomTaluka] = useState("")
  const [customVillage, setCustomVillage] = useState("")

  useEffect(() => {
    const g = searchParams.get("gender")
    if (g) setGenderFilter(g)
    const age = searchParams.get("age")
    if (age) setSelectedAgeRange(age)
    const rel = searchParams.get("religion")
    if (rel) setSelectedReligions(rel.split(","))
    const dist = searchParams.get("district")
    if (dist) setSelectedDistricts(dist.split(","))
    const q = searchParams.get("q")
    if (q) setSearchQuery(q)
    const verified = searchParams.get("verifiedOnly")
    if (verified === "true") setVerifiedOnly(true)
  }, [])

  useEffect(() => {
    fetch("/api/locations?type=districts").then(r => r.json()).then(d => setDistricts(d.data || [])).catch(e => console.error("Failed to load districts:", e))
  }, [])

  useEffect(() => {
    if (selectedDistricts.length > 0) {
      fetch(`/api/locations?type=talukas&districtId=${selectedDistricts[0]}`)
        .then(r => r.json()).then(d => setTalukas(d.data || [])).catch(e => { console.error("Failed to load talukas:", e); setTalukas([]); })
    } else { setTalukas([]) }
  }, [selectedDistricts])

  useEffect(() => {
    if (selectedDistricts.length > 0 && selectedTaluka && selectedTaluka !== OTHER_VALUE) {
      fetch(`/api/locations?type=villages&districtId=${selectedDistricts[0]}&talukaId=${selectedTaluka}`)
        .then(r => r.json()).then(d => setVillages(d.data || [])).catch(e => { console.error("Failed to load villages:", e); setVillages([]); })
    } else { setVillages([]) }
  }, [selectedDistricts, selectedTaluka])

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/saved-searches?userId=${user.id}`).then(r => r.json()).then(d => {
        if (d.success) setSavedSearches(d.savedSearches)
      }).catch(e => console.error("Failed to load saved searches:", e))
      fetch(`/api/shortlist?userId=${user.id}`).then(r => r.json()).then(d => {
        if (d.success && d.profiles) setShortlistedIds(new Set(d.profiles.map((p: any) => p.id)))
      }).catch(e => console.error("Failed to load shortlist:", e))
    }
  }, [user?.id])

  const fetchResults = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = {}
      if (genderFilter) params.gender = genderFilter
      if (selectedAgeRange) {
        const range = ageRanges.find(r => r.label === selectedAgeRange)
        if (range) { params.ageMin = range.min; params.ageMax = range.max }
      }
      if (selectedCastes.length > 0) params.caste = selectedCastes[0]
      if (selectedReligions.length > 0) params.religion = selectedReligions[0]
      if (selectedDistricts.length > 0) {
        if (showOtherDistrict && customDistrict) {
          params.district = customDistrict
        } else if (selectedDistricts[0] !== OTHER_VALUE) {
          params.district = selectedDistricts[0]
        }
      }
      if (selectedTaluka) {
        if (showOtherTaluka && customTaluka) {
          params.taluka = customTaluka
        } else if (selectedTaluka !== OTHER_VALUE) {
          params.taluka = selectedTaluka
        }
      }
      if (villageQuery) params.village = villageQuery
      if (customVillage) params.village = customVillage
      if (selectedEducation) params.education = selectedEducation
      if (verifiedOnly) params.verifiedOnly = true
      if (sortOrder) params.sortBy = sortOrder
      if (user?.id) params.currentUserId = user.id

      const res = await fetch("/api/users/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      })
      const data = await res.json()
      if (data.success) {
        setResults(data.users)
      } else {
        setResults([])
      }
    } catch {
      setResults([])
    } finally { setLoading(false) }
  }, [genderFilter, selectedAgeRange, selectedCastes, selectedReligions, selectedDistricts, selectedTaluka, villageQuery, selectedEducation, verifiedOnly, sortOrder, user?.id])

  useEffect(() => { fetchResults() }, [fetchResults])

  useEffect(() => {
    if (!user?.id || results.length === 0) return
    results.forEach(r => {
      fetch(`/api/interests/status?senderId=${user.id}&receiverId=${r.id}`)
        .then(res => res.json()).then(d => {
          if (d.status === "PENDING") setInterestSent(prev => new Set(prev).add(r.id))
          else if (d.status === "ACCEPTED") setInterestAccepted(prev => new Set(prev).add(r.id))
        }).catch(e => console.error("Failed to check interest status:", e))
    })
  }, [results, user?.id])

  const toggleShortlist = async (targetId: string, targetName: string) => {
    if (!user?.id) {
      toast.error(locale === "mr" ? "कृपया प्रथम लॉगिन करा" : "Please login first")
      router.push("/login")
      return
    }
    const res = await fetch("/api/shortlist/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, targetId }),
    })
    const data = await res.json()
    if (data.success) {
      setShortlistedIds(prev => {
        const n = new Set(prev)
        if (data.shortlisted) n.add(targetId)
        else n.delete(targetId)
        return n
      })
      toast.success(data.shortlisted
        ? (locale === "mr" ? `${targetName} यांना शॉर्टलिस्ट केले!` : `${targetName} shortlisted!`)
        : (locale === "mr" ? `${targetName} यांना शॉर्टलिस्टमधून काढले` : `Removed ${targetName} from shortlist`))
    } else {
      toast.error(data.error || (locale === "mr" ? "अयशस्वी" : "Failed"))
    }
  }

  const sendInterest = async (targetId: string, targetName: string) => {
    if (!user?.id) {
      toast.error(locale === "mr" ? "कृपया प्रथम लॉगिन करा" : "Please login first")
      router.push("/login")
      return
    }
    const res = await fetch("/api/interests/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId: user.id, receiverId: targetId }),
    })
    const data = await res.json()
    if (data.success) {
      setInterestSent(prev => new Set(prev).add(targetId))
      toast.success(locale === "mr" ? `${targetName} यांना आवड पाठवली!` : `Interest sent to ${targetName}!`)
    } else {
      toast.error(data.error || (locale === "mr" ? "अयशस्वी" : "Failed"))
    }
  }

  useEffect(() => {
    if (filterOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [filterOpen])

  const getCurrentFilters = () => ({
    genderFilter, selectedAgeRange, selectedCastes, selectedReligions,
    selectedDistricts, selectedTaluka, villageQuery, verifiedOnly, searchQuery,
    showOtherDistrict, showOtherTaluka, customDistrict, customTaluka, customVillage,
  })

  const saveCurrentSearch = async () => {
    if (!saveSearchName.trim() || !user?.id) return
    const res = await fetch("/api/saved-searches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, name: saveSearchName, filters: getCurrentFilters() }),
    })
    const data = await res.json()
    if (data.success) {
      setSavedSearches(prev => [data.savedSearch, ...prev])
      setShowSaveInput(false)
      setSaveSearchName("")
      toast.success(locale === "mr" ? "सर्च सेव्ह केला" : "Search saved")
    }
  }

  const applySavedSearch = (saved: any) => {
    const f = saved.filters
    setGenderFilter(f.genderFilter || "")
    setSelectedAgeRange(f.selectedAgeRange || "")
    setSelectedCastes(f.selectedCastes || [])
    setSelectedReligions(f.selectedReligions || [])
    setSelectedDistricts(f.selectedDistricts || [])
    setSelectedTaluka(f.selectedTaluka || "")
    setVillageQuery(f.villageQuery || "")
    setVerifiedOnly(f.verifiedOnly || false)
    setSearchQuery(f.searchQuery || "")
    setShowOtherDistrict(f.showOtherDistrict || false)
    setShowOtherTaluka(f.showOtherTaluka || false)
    setCustomDistrict(f.customDistrict || "")
    setCustomTaluka(f.customTaluka || "")
    setCustomVillage(f.customVillage || "")
  }

  const toggleDistrict = (id: string) => {
    setSelectedDistricts(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id])
  }
  const toggleCaste = (caste: string) => {
    setSelectedCastes(prev => prev.includes(caste) ? prev.filter(c => c !== caste) : [...prev, caste])
  }
  const toggleReligion = (religion: string) => {
    setSelectedReligions(prev => prev.includes(religion) ? prev.filter(r => r !== religion) : [...prev, religion])
  }

  const clearAllFilters = useCallback(() => {
    setGenderFilter("")
    setSelectedAgeRange("")
    setSelectedCastes([])
    setSelectedReligions([])
    setSelectedDistricts([])
    setSelectedTaluka("")
    setVillageQuery("")
    setVerifiedOnly(false)
    setSearchQuery("")
    setSelectedEducation("")
    setShowOtherDistrict(false)
    setShowOtherTaluka(false)
    setCustomDistrict("")
    setCustomTaluka("")
    setCustomVillage("")
  }, [])

  const activeFilterCount = [genderFilter, selectedAgeRange, selectedEducation, selectedTaluka, villageQuery, customVillage, customDistrict, customTaluka]
    .filter(Boolean).length +
    selectedCastes.length + selectedReligions.length + selectedDistricts.length +
    (verifiedOnly ? 1 : 0)

  const genderOptions = [
    { value: "", label: locale === "mr" ? "सर्व" : "All", icon: "group" },
    { value: "FEMALE", label: locale === "mr" ? "स्त्री" : "Female", icon: "female" },
    { value: "MALE", label: locale === "mr" ? "पुरुष" : "Male", icon: "male" },
  ]

  const SectionLabel = ({ icon, label }: { icon: string; label: string }) => (
    <div className="flex items-center gap-2 mb-3">
      <span className="material-symbols-outlined text-[18px] text-primary/60">{icon}</span>
      <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{label}</span>
    </div>
  )

  const ChipButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button type="button" onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
        active
          ? "bg-primary text-white border-primary shadow-sm"
          : "bg-surface-container-low text-on-surface-variant border-transparent hover:border-primary/30 hover:text-primary"
      }`}>
      {children}
    </button>
  )

  const FilterSection = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
    <div>
      <SectionLabel icon={icon} label={title} />
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )

  return (
    <MainLayout>
      <div className="min-h-screen bg-background-cream">
        <div className="mx-auto max-w-container px-4 md:px-gutter">
          {/* Top bar */}
          <div className="flex items-center justify-between py-4 border-b border-outline-variant/10">
            <div className="flex items-center gap-3">
              <button onClick={() => router.back()}
                className="flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
              <div>
                <h1 className="text-lg font-bold text-royal-ink">
                  {locale === "mr" ? "जोडीदार शोधा" : "Search Matches"}
                </h1>
                {!loading && (
                  <p className="text-xs text-on-surface-variant">
                    {results.length} {locale === "mr" ? "सामने सापडले" : "matches found"}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setFilterOpen(!filterOpen)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-outline-variant/20 text-sm text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all">
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span>{locale === "mr" ? "फिल्टर" : "Filters"}</span>
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{activeFilterCount}</span>
                )}
              </button>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs text-on-surface-variant whitespace-nowrap">
                  {locale === "mr" ? "क्रमवारी:" : "Sort:"}
                </span>
                <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}
                  className="bg-background-cream border border-outline-variant/20 text-sm rounded-lg p-2 focus:ring-1 focus:ring-primary outline-none">
                  <option value="newest">{locale === "mr" ? "नवीन" : "Newest"}</option>
                  <option value="oldest">{locale === "mr" ? "जुने" : "Oldest"}</option>
                  <option value="name_asc">{locale === "mr" ? "नाव A-Z" : "Name A-Z"}</option>
                  <option value="name_desc">{locale === "mr" ? "नाव Z-A" : "Name Z-A"}</option>
                  <option value="age_asc">{locale === "mr" ? "वय (लहान)" : "Age (Young)"}</option>
                  <option value="age_desc">{locale === "mr" ? "वय (मोठे)" : "Age (Old)"}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile filter backdrop */}
          {filterOpen && <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setFilterOpen(false)} />}

          <div className="flex gap-6 py-6 relative">
            {/* Filter sidebar - always visible on desktop, drawer on mobile */}
            <aside className={`
              shrink-0 w-full lg:w-72 xl:w-80
              ${filterOpen
                ? 'fixed inset-x-0 top-0 z-40 m-0 px-4 pt-safe pb-4 overflow-y-auto max-h-dvh lg:relative lg:inset-auto lg:z-auto lg:px-0 lg:pt-0 lg:max-h-none lg:block'
                : 'hidden lg:block'}
            `}>
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(155,27,48,0.05)] border border-outline-variant/10 overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3.5 border-b border-outline-variant/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                    <h2 className="font-semibold text-sm text-royal-ink">
                      {locale === "mr" ? "फिल्टर" : "Filters"}
                    </h2>
                    {activeFilterCount > 0 && (
                      <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{activeFilterCount}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {activeFilterCount > 0 && (
                      <button onClick={clearAllFilters}
                        className="text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center gap-0.5 px-2 py-1 rounded-lg hover:bg-primary/5">
                        <span className="material-symbols-outlined text-[14px]">refresh</span>
                        {locale === "mr" ? "साफ" : "Clear"}
                      </button>
                    )}
                    <button onClick={() => setFilterOpen(false)}
                      className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors">
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                </div>

                {/* Filters body */}
                <div className="p-4 space-y-5 max-h-[calc(100dvh-200px)] lg:max-h-[calc(100vh-250px)] overflow-y-auto">
                  {/* Search */}
                  <div>
                    <SectionLabel icon="search" label={locale === "mr" ? "शोधा" : "Search"} />
                    <div className="relative">
                      <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        placeholder={locale === "mr" ? "नाव किंवा आयडी..." : "Name or ID..."}
                        className="w-full pl-9 pr-3 py-2.5 bg-background-cream border border-outline-variant/20 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                      <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <SectionLabel icon="wc" label={locale === "mr" ? "लिंग" : "Gender"} />
                    <div className="grid grid-cols-3 gap-1.5">
                      {genderOptions.map(g => (
                        <button key={g.value} type="button" onClick={() => setGenderFilter(g.value)}
                          className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
                            genderFilter === g.value
                              ? "bg-primary text-white border-primary shadow-sm"
                              : "bg-background-cream text-on-surface-variant border-transparent hover:border-primary/30 hover:text-primary"
                          }`}>
                          <span className="material-symbols-outlined text-[18px]">{g.icon}</span>
                          <span className="leading-tight">{g.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Age Range */}
                  <div>
                    <SectionLabel icon="calendar_month" label={locale === "mr" ? "वय श्रेणी" : "Age Range"} />
                    <div className="grid grid-cols-2 gap-1.5">
                      {ageRanges.map(r => (
                        <ChipButton key={r.label}
                          active={selectedAgeRange === r.label}
                          onClick={() => setSelectedAgeRange(selectedAgeRange === r.label ? "" : r.label)}>
                          {r.label}
                        </ChipButton>
                      ))}
                    </div>
                  </div>

                  {/* Religion */}
                  <div>
                    <SectionLabel icon="church" label={locale === "mr" ? "धर्म" : "Religion"} />
                    <div className="flex flex-wrap gap-1.5">
                      {religionList.map(r => (
                        <ChipButton key={r} active={selectedReligions.includes(r)}
                          onClick={() => toggleReligion(r)}>
                          {locale === "mr" ? t(`search.religions.${r}`) : t(`search.religions.${r}`)}
                        </ChipButton>
                      ))}
                    </div>
                  </div>

                  {/* District */}
                  <div>
                    <SectionLabel icon="map" label={locale === "mr" ? "जिल्हा" : "District"} />
                    {showOtherDistrict ? (
                      <div className="space-y-2">
                        <input type="text" value={customDistrict} onChange={e => setCustomDistrict(e.target.value)}
                          placeholder={locale === "mr" ? "तुमचा जिल्हा लिहा..." : "Type your district..."}
                          className="w-full bg-background-cream border border-outline-variant/20 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-primary outline-none" />
                        <button onClick={() => { setShowOtherDistrict(false); setCustomDistrict(""); setSelectedDistricts([]) }}
                          className="text-xs text-primary hover:text-on-primary-container transition-colors">
                          {locale === "mr" ? "यादीतून निवडा" : "Select from list"}
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-1.5">
                        {districts.length > 0 ? districts.map(d => (
                          <ChipButton key={d.id} active={selectedDistricts.includes(d.id)}
                            onClick={() => toggleDistrict(d.id)}>
                            {locale === "mr" ? d.mr : d.en}
                          </ChipButton>
                        )) : (
                          ["JALGAON", "DHULE", "NANDURBAR", "NASHIK_NORTH"].map(d => (
                            <ChipButton key={d} active={selectedDistricts.includes(d)}
                              onClick={() => toggleDistrict(d)}>
                              {d.charAt(0) + d.slice(1).toLowerCase()}
                            </ChipButton>
                          ))
                        )}
                        <ChipButton active={false} onClick={() => { setSelectedDistricts([OTHER_VALUE]); setShowOtherDistrict(true) }}>
                          {locale === "mr" ? "इतर..." : "Other..."}
                        </ChipButton>
                      </div>
                    )}
                  </div>

                  {/* Taluka */}
                  <div>
                    <SectionLabel icon="location_on" label={locale === "mr" ? "तालुका" : "Taluka"} />
                    {showOtherTaluka ? (
                      <div className="space-y-2">
                        <input type="text" value={customTaluka} onChange={e => setCustomTaluka(e.target.value)}
                          placeholder={locale === "mr" ? "तुमचा तालुका लिहा..." : "Type your taluka..."}
                          className="w-full bg-background-cream border border-outline-variant/20 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-primary outline-none" />
                        <button onClick={() => { setShowOtherTaluka(false); setCustomTaluka(""); setSelectedTaluka("") }}
                          className="text-xs text-primary hover:text-on-primary-container transition-colors">
                          {locale === "mr" ? "यादीतून निवडा" : "Select from list"}
                        </button>
                      </div>
                    ) : (
                      <select value={selectedTaluka} onChange={e => {
                        const v = e.target.value
                        if (v === OTHER_VALUE) { setShowOtherTaluka(true); setSelectedTaluka("") }
                        else { setSelectedTaluka(v) }
                      }}
                        className="w-full bg-background-cream border border-outline-variant/20 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all">
                        <option value="">{locale === "mr" ? "सर्व तालुके" : "All Talukas"}</option>
                        {talukas.map(t => <option key={t.id} value={t.id}>{locale === "mr" ? t.mr : t.en}</option>)}
                        <option value={OTHER_VALUE}>{locale === "mr" ? "इतर (लिहा)..." : "Other (type)..."}</option>
                      </select>
                    )}
                  </div>

                  {/* Village */}
                  <div>
                    <SectionLabel icon="home" label={locale === "mr" ? "गाव" : "Village"} />
                    {selectedTaluka && selectedTaluka !== OTHER_VALUE && villages.length > 0 ? (
                      <select value={villageQuery} onChange={e => {
                        const v = e.target.value
                        if (v === OTHER_VALUE) { setVillageQuery(""); setCustomVillage("") }
                        else { setVillageQuery(v); setCustomVillage("") }
                      }}
                        className="w-full bg-background-cream border border-outline-variant/20 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all">
                        <option value="">{locale === "mr" ? "सर्व गावे" : "All Villages"}</option>
                        {villages.map((v, i) => (
                          <option key={i} value={v.en}>{locale === "mr" ? v.mr : v.en}</option>
                        ))}
                        <option value={OTHER_VALUE}>{locale === "mr" ? "इतर (लिहा)..." : "Other (type)..."}</option>
                      </select>
                    ) : villageQuery === OTHER_VALUE ? (
                      <div className="space-y-2">
                        <input type="text" value={customVillage} onChange={e => setCustomVillage(e.target.value)}
                          placeholder={locale === "mr" ? "गावाचे नाव लिहा..." : "Type village name..."}
                          className="w-full bg-background-cream border border-outline-variant/20 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-primary outline-none" />
                        <button onClick={() => { setVillageQuery(""); setCustomVillage("") }}
                          className="text-xs text-primary hover:text-on-primary-container transition-colors">
                          {locale === "mr" ? "यादीतून निवडा" : "Select from list"}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <input type="text" value={villageQuery || customVillage} onChange={e => {
                          setVillageQuery(e.target.value)
                          setCustomVillage("")
                        }}
                          placeholder={locale === "mr" ? "गावाचे नाव टाका" : "Enter village name"}
                          className="w-full bg-background-cream border border-outline-variant/20 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all" />
                        {customVillage && (
                          <p className="text-[11px] text-primary/60">{locale === "mr" ? "इतर गाव:" : "Other village:"} {customVillage}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Education */}
                  <div>
                    <SectionLabel icon="school" label={locale === "mr" ? "शिक्षण" : "Education"} />
                    <div className="flex flex-wrap gap-1.5">
                      {educationList.map(e => (
                        <ChipButton key={e.value} active={selectedEducation === e.value}
                          onClick={() => setSelectedEducation(selectedEducation === e.value ? "" : e.value)}>
                          {locale === "mr" ? e.mr : e.en}
                        </ChipButton>
                      ))}
                    </div>
                  </div>

                  {/* Verified Only */}
                  <label className="flex items-center gap-3 p-2.5 rounded-xl bg-background-cream border border-outline-variant/10 cursor-pointer hover:bg-primary/5 transition-colors">
                    <input type="checkbox" checked={verifiedOnly}
                      onChange={e => setVerifiedOnly(e.target.checked)}
                      className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4" />
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      <span className="text-sm font-medium">
                        {locale === "mr" ? "फक्त वेरिफाइड" : "Verified Only"}
                      </span>
                    </div>
                  </label>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-outline-variant/10">
                  <button onClick={fetchResults}
                    className="w-full bg-primary text-white font-semibold py-2.5 rounded-xl hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm">
                    <span className="material-symbols-outlined text-[18px]">search</span>
                    {locale === "mr" ? "शोधा" : "Search"}
                    {activeFilterCount > 0 && ` (${activeFilterCount})`}
                  </button>
                </div>
              </div>

              {/* Save Search */}
              <div className="mt-3 bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
                <div className="p-3">
                  {showSaveInput ? (
                    <div className="space-y-2">
                      <input type="text" value={saveSearchName} onChange={e => setSaveSearchName(e.target.value)}
                        placeholder={locale === "mr" ? "सर्चचे नाव..." : "Search name..."}
                        className="w-full bg-background-cream border border-outline-variant/20 rounded-xl p-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
                      <div className="flex gap-2">
                        <button onClick={saveCurrentSearch}
                          className="flex-1 bg-primary text-white text-xs py-1.5 rounded-lg font-medium hover:brightness-110 transition-all">
                          {locale === "mr" ? "सेव्ह करा" : "Save"}
                        </button>
                        <button onClick={() => { setShowSaveInput(false); setSaveSearchName("") }}
                          className="px-2 text-xs text-on-surface-variant hover:text-primary transition-colors">
                          {t("common.cancel")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setShowSaveInput(true)}
                      className="w-full flex items-center justify-center gap-1.5 text-primary text-sm font-medium hover:bg-primary/5 rounded-lg py-2 transition-colors">
                      <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
                      {locale === "mr" ? "सर्च सेव्ह करा" : "Save Search"}
                    </button>
                  )}

                  {savedSearches.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-outline-variant/10 space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant px-1 mb-1.5">
                        {locale === "mr" ? "सेव्ह केलेले:" : "Saved:"}
                      </p>
                      {savedSearches.map((s: any) => (
                        <button key={s.id} onClick={() => applySavedSearch(s)}
                          className="w-full text-left text-sm text-primary hover:bg-primary/5 rounded-lg p-1.5 transition-colors flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px]">bookmark</span>
                          <span className="truncate text-xs">{s.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse border border-outline-variant/10 shadow-sm">
                      <div className="aspect-[4/3] bg-primary/5" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-surface-container-low rounded w-2/3" />
                        <div className="h-3 bg-surface-container-low rounded w-1/2" />
                        <div className="h-3 bg-surface-container-low rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <span className="material-symbols-outlined text-6xl text-outline mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>search_off</span>
                  <h3 className="text-lg font-semibold text-on-surface-variant">
                    {locale === "mr" ? "कोणतेही सामने सापडले नाहीत" : "No matches found"}
                  </h3>
                  <p className="text-sm text-on-surface-variant mt-1">
                    {locale === "mr" ? "कृपया फिल्टर बदलून पुन्हा प्रयत्न करा." : "Try changing your filters."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {results.map((profile: any, i) => {
                    const p = profile.profile || {}
                    const photo = profile.photos?.[0]?.url
                    const isShortlisted = shortlistedIds.has(profile.id)
                    const age = p.dateOfBirth ? getAge(p.dateOfBirth) : "?"
                    const displayName = profile.isPremium ? (p.fullNameEn || p.fullNameMr) : maskName(p.fullNameEn || p.fullNameMr, false)
                    return (
                      <motion.div key={profile.id} initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                        className="bg-white rounded-xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                        {/* Photo */}
                        <Link href={`/profile?userId=${profile.id}`} className="block relative aspect-[4/3] overflow-hidden bg-primary/5">
                          {photo ? (
                            <img src={photo} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <span className="material-symbols-outlined text-5xl text-primary/20">person</span>
                            </div>
                          )}
                          {profile.isPremium && (
                            <span className="absolute top-2 right-2 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[10px] font-bold px-2 py-0.5 rounded-full text-[#1B1C1C] shadow-md flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[12px]">crown</span>
                              PREMIUM
                            </span>
                          )}
                          {profile.isVerified && (
                            <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md">
                              <span className="material-symbols-outlined text-[12px]">verified</span>
                              VERIFIED
                            </span>
                          )}
                        </Link>

                        {/* Info */}
                        <div className="p-4">
                          <Link href={`/profile?userId=${profile.id}`} className="block">
                            <h3 className="font-bold text-royal-ink truncate">
                              {displayName}
                            </h3>
                            <p className="text-xs text-on-surface-variant mt-0.5">
                              {age} {locale === "mr" ? "वर्ष" : "yrs"}
                              {p.height ? ` · ${p.height} cm` : ""}
                            </p>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-on-surface-variant/70">
                              {p.village && (
                                <span className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[12px]">location_on</span>
                                  <span>{p.village}{p.district ? `, ${p.district}` : ""}</span>
                                </span>
                              )}
                              {p.education && (
                                <span className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[12px]">school</span>
                                  <span className="truncate max-w-[150px]">{p.education}</span>
                                </span>
                              )}
                            </div>
                          </Link>

                          <div className="mt-3 pt-3 border-t border-outline-variant/10 flex items-center gap-2">
                            {interestAccepted.has(profile.id) ? (
                              <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); subscription.requireSubscription(() => {
                                window.location.href = `/chat?userId=${profile.id}`
                              }) }}
                                className="flex-1 bg-success text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-transform">
                                <span className="material-symbols-outlined text-[14px]">chat</span>
                                {locale === "mr" ? "चॅट" : "Chat"}
                              </button>
                            ) : interestSent.has(profile.id) ? (
                              <div className="flex-1 flex items-center justify-center gap-1 text-success text-xs font-semibold px-3 py-2">
                                <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                {locale === "mr" ? "पाठवले" : "Sent"}
                              </div>
                            ) : (
                              <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); sendInterest(profile.id, displayName) }}
                                className="flex-1 bg-primary text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 transition-transform hover:brightness-110">
                                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                {locale === "mr" ? "आवड" : "Interest"}
                              </button>
                            )}
                            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleShortlist(profile.id, displayName) }}
                              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                                isShortlisted
                                  ? "border-primary text-primary bg-primary/5"
                                  : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                              }`}>
                              <span className="material-symbols-outlined text-[15px]"
                                style={{ fontVariationSettings: isShortlisted ? "'FILL' 1" : "'FILL' 0" }}>
                                favorite
                              </span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SubscriptionModal
        open={subscription.showModal}
        onClose={() => subscription.setShowModal(false)}
        plans={subscription.plans}
        selectedPlan={selectedPlan}
        onSelectPlan={setSelectedPlan}
        onSubscribe={subscription.handleSubscribe}
        isProcessing={subscription.isProcessing}
        paymentPhase={subscription.paymentPhase}
        paymentMethod={subscription.paymentMethod}
        onPaymentMethodChange={subscription.setPaymentMethod}
        onPayNow={subscription.completePayment}
      />
    </MainLayout>
  )
}
