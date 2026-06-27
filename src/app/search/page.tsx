"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/MainLayout"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search, SlidersHorizontal, Heart, MessageCircle, MapPin,
  Shield, Star, X, Filter, Sparkles, ChevronDown, Lock, Bookmark,
} from "lucide-react"
import { maskName } from "@/lib/utils"
import { usePaymentGate } from "@/lib/use-payment-gate"
import { useAuthStore } from "@/store/auth-store"
import toast from "react-hot-toast"

interface DistrictOption { id: string; en: string; mr: string }
interface TalukaOption { id: string; en: string; mr: string }
interface CasteOption {
  id: string; en: string; mr: string; subCastes: { en: string; mr: string }[]
}

const sampleResults = [
  { name: "प्रिया पाटील", age: 25, height: "5'4\"", caste: "Leva Patil", education: "B.E. Computer", occupation: "Software Engineer", district: "Jalgaon", village: "Chopda", score: 92, verified: true, premium: true, photo: "https://i.pravatar.cc/200?img=5" },
  { name: "स्नेहा जाधव", age: 24, height: "5'2\"", caste: "Maratha", education: "M.Sc. Botany", occupation: "Teacher", district: "Dhule", village: "Shirpur", score: 88, verified: true, premium: false, photo: "https://i.pravatar.cc/200?img=6" },
  { name: "रुपाली महाजन", age: 26, height: "5'6\"", caste: "Kunbi", education: "MBA", occupation: "Bank Manager", district: "Nandurbar", village: "Navapur", score: 85, verified: false, premium: true, photo: "https://i.pravatar.cc/200?img=7" },
  { name: "अर्चना पवार", age: 23, height: "5'3\"", caste: "Mali", education: "B.A. History", occupation: "Govt Employee", district: "Jalgaon", village: "Bhusawal", score: 80, verified: true, premium: false, photo: "https://i.pravatar.cc/200?img=8" },
  { name: "वैशाली सोनवणे", age: 27, height: "5'5\"", caste: "Leva Patil", education: "B.Sc. Nursing", occupation: "Staff Nurse", district: "Nashik", village: "Baglan", score: 78, verified: false, premium: false, photo: "https://i.pravatar.cc/200?img=9" },
  { name: "दीपाली बागुल", age: 25, height: "5'4\"", caste: "Maratha", education: "LLB", occupation: "Lawyer", district: "Dhule", village: "Sindkheda", score: 75, verified: true, premium: true, photo: "https://i.pravatar.cc/200?img=10" },
]

export default function SearchPage() {
  const { t, locale } = useI18n()
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [districts, setDistricts] = useState<DistrictOption[]>([])
  const [castes, setCastes] = useState<CasteOption[]>([])
  const [talukas, setTalukas] = useState<TalukaOption[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const { executeWithGate, isProcessing } = usePaymentGate()
  const { user } = useAuthStore()
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set())
  const [loadingDistricts, setLoadingDistricts] = useState(true)
  const [loadingCastes, setLoadingCastes] = useState(true)
  const [loadingTalukas, setLoadingTalukas] = useState(false)

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
    <MainLayout>
      <div className="mx-auto max-w-container px-4 py-6 md:px-6 lg:px-10 bg-gradient-warm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gradient-pink">{t("search.searchMatches")}</h1>
          <div className="divider-pink mt-1 mb-2" />
          <p className="text-sm text-[#554336]">{t("home.heroSubtitle")}</p>
        </div>

        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#887364]" />
            <Input
              placeholder={t("home.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden md:inline">{t("common.filter")}</span>
          </Button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 card-premium p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gradient-pink">{t("search.advancedSearch")}</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              <div className="space-y-2">
                <Label className="text-xs">{t("search.ageRange")}</Label>
                <div className="flex gap-2">
                  <Input type="number" placeholder="18" className="text-center" />
                  <span className="flex items-center text-[#887364]">-</span>
                  <Input type="number" placeholder="45" className="text-center" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">{t("search.district")}</Label>                        <Select onValueChange={(v) => setSelectedDistrict(v === "all" ? "" : v)}>
                          <SelectTrigger><SelectValue placeholder={t("registration.district")} /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{t("common.all")}</SelectItem>
                            {loadingDistricts ? (
                              <SelectItem value="loading" disabled>{t("common.loading")}</SelectItem>
                            ) : (
                              districts.map((d) => (
                                <SelectItem key={d.id} value={d.id}>{locale === "mr" ? d.mr : d.en}</SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">{t("search.taluka")}</Label>                        <Select disabled={!selectedDistrict}>
                          <SelectTrigger><SelectValue placeholder={t("registration.taluka")} /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{t("common.all")}</SelectItem>
                            {loadingTalukas ? (
                              <SelectItem value="loading" disabled>{t("common.loading")}</SelectItem>
                            ) : (
                              talukas.map((t) => (
                                <SelectItem key={t.id} value={t.id}>{locale === "mr" ? t.mr : t.en}</SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">{t("registration.caste")}</Label>                        <Select>
                          <SelectTrigger><SelectValue placeholder={t("registration.caste")} /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{t("common.all")}</SelectItem>
                            {loadingCastes ? (
                              <SelectItem value="loading" disabled>{t("common.loading")}</SelectItem>
                            ) : (
                              castes.map((c) => (
                                <SelectItem key={c.id} value={c.id}>{locale === "mr" ? c.mr : c.en}</SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="photo" className="rounded border-[#E4E2E1]" />
                <label htmlFor="photo" className="text-sm text-[#554336]">{t("search.photoAvailable")}</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="verified" className="rounded border-[#E4E2E1]" />
                <label htmlFor="verified" className="text-sm text-[#554336]">{t("search.verifiedOnly")}</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="premium" className="rounded border-[#E4E2E1]" />
                <label htmlFor="premium" className="text-sm text-[#554336]">{t("search.premiumOnly")}</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="online" className="rounded border-[#E4E2E1]" />
                <label htmlFor="online" className="text-sm text-[#554336]">{t("search.onlineNow")}</label>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <Button variant="outline" size="sm">{t("search.resetFilters")}</Button>
              <Button size="sm">{t("search.applyFilters")}</Button>
              <Button variant="gold" size="sm">{t("search.saveSearch")}</Button>
            </div>
          </motion.div>
        )}

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">{t("common.all")}</TabsTrigger>
            <TabsTrigger value="brides">{t("registration.female")}</TabsTrigger>
            <TabsTrigger value="grooms">{t("registration.male")}</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-[#887364]">{sampleResults.length} {t("search.searchResults")}</p>
              <Select defaultValue="compatibility">
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compatibility">{t("search.compatibility")}</SelectItem>
                  <SelectItem value="newest">{t("search.recentlyJoined")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sampleResults.map((profile, i) => {
              const displayName = profile.premium ? profile.name : maskName(profile.name, false)
              return (
                <motion.div
                  key={profile.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="overflow-hidden cursor-pointer shadow-premium hover:shadow-luxury transition-all group">
                    <div className="relative h-28 bg-gradient-to-br from-[#FF21A5]/10 to-[#002366]/10">
                      <Avatar className="absolute -bottom-8 left-4 h-16 w-16 border-4 border-white shadow-md">
                        <AvatarImage src={profile.photo} />
                        <AvatarFallback>{displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute right-3 top-3 flex gap-1">
                        {profile.verified && <Badge variant="verified"><Shield className="mr-1 h-3 w-3" />{t("common.verified")}</Badge>}
                        {profile.premium && <Badge variant="premium"><Star className="mr-1 h-3 w-3" />Premium</Badge>}
                      </div>
                    </div>
                    <CardContent className="pt-10">
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-[#1b1c1c]">
                            {displayName}
                            {!profile.premium && (
                              <Lock className="ml-1 inline h-3 w-3 text-[#887364]" />
                            )}
                          </h3>
                          <p className="text-xs text-[#887364]">{profile.age} yrs, {profile.height} | {profile.caste}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-sm font-bold text-[#50C878]">
                            <Sparkles className="h-3 w-3" />{profile.score}%
                          </div>
                          <p className="text-xs text-[#887364]">{t("search.compatibility")}</p>
                        </div>
                      </div>
                      {!profile.premium && (
                        <div className="mb-2 rounded-lg bg-[#F0ADD6] p-2 text-center">
                          <p className="text-[10px] text-[#887364]">
                            <Lock className="mr-1 inline h-3 w-3" />
                            {t("privacy.subscribeToView")}
                          </p>
                        </div>
                      )}
                      <div className="divider-gold my-2" />
                      <div className="mb-2 flex items-center gap-1 text-xs text-[#887364]">
                        <MapPin className="h-3 w-3" /> {profile.village}, {profile.district}
                      </div>
                      <div className="mb-3 flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-[10px]">{profile.education}</Badge>
                        <Badge variant="outline" className="text-[10px]">{profile.occupation}</Badge>
                      </div>
                      <div className="divider-gold my-2" />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          className="flex-1"
                          disabled={isProcessing}
                          onClick={() => {
                            executeWithGate(
                              async () => {
                                toast.success(t("profile.interestSent"))
                              },
                              "send_interest",
                              undefined,
                            )
                          }}
                        ><Heart className="mr-1 h-3 w-3" />{t("profile.sendInterest")}</Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={async () => {
                            if (!user?.id) {
                              toast.error(locale === "mr" ? "कृपया प्रथम लॉगिन करा" : "Please login first")
                              return
                            }
                            const res = await fetch("/api/shortlist/toggle", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ userId: user.id, targetId: profile.name }),
                            })
                            const data = await res.json()
                            if (data.success) {
                              setShortlistedIds((prev) => {
                                const next = new Set(prev)
                                if (data.shortlisted) next.add(profile.name)
                                else next.delete(profile.name)
                                return next
                              })
                              toast.success(data.shortlisted ? t("profile.shortlistAdded") : t("profile.shortlistRemoved"))
                            }
                          }}
                        >
                          <Bookmark className={`mr-1 h-3 w-3 ${shortlistedIds.has(profile.name) ? "fill-[#FF21A5] text-[#FF21A5]" : ""}`} />{t("profile.shortlist")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          disabled={isProcessing}
                          onClick={() => {
                            executeWithGate(
                              async () => {
                                toast.success(t("profile.chat") + " coming soon")
                              },
                              "send_message",
                              undefined,
                            )
                          }}
                        ><MessageCircle className="mr-1 h-3 w-3" />{t("profile.chat")}</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
