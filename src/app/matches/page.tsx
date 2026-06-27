"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/MainLayout"
import { useI18n } from "@/lib/i18n"
import { useAuthStore } from "@/store/auth-store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Heart, MessageCircle, UserCheck, X, Check, Clock, Sparkles, Bookmark, Trash2 } from "lucide-react"
import { maskName } from "@/lib/utils"
import toast from "react-hot-toast"
import type { IUser } from "@/types"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function MatchesPage() {
  const { t, locale } = useI18n()
  const { user } = useAuthStore()
  const [shortlisted, setShortlisted] = useState<(IUser & { shortlistedAt: string })[]>([])
  const [loadingShortlisted, setLoadingShortlisted] = useState(false)

  const interests = [
    { name: "राजेश पाटील", age: 28, location: locale === "mr" ? "चोपडा, जळगाव" : "Chopda, Jalgaon", status: "interest_sent", photo: "https://i.pravatar.cc/200?img=11" },
    { name: "अमित जाधव", age: 27, location: locale === "mr" ? "धुळे" : "Dhule", status: "interest_received", photo: "https://i.pravatar.cc/200?img=12" },
  ]

  // Fetch shortlisted profiles
  const fetchShortlisted = async () => {
    if (!user?.id) return
    setLoadingShortlisted(true)
    try {
      const res = await fetch(`/api/shortlist?userId=${user.id}`)
      const data = await res.json()
      if (data.success) {
        setShortlisted(data.profiles || [])
      }
    } catch {
      // silent fail
    } finally {
      setLoadingShortlisted(false)
    }
  }

  useEffect(() => {
    if (user?.id) fetchShortlisted()
  }, [user?.id])

  const handleRemoveShortlist = async (targetId: string) => {
    if (!user?.id) return
    const res = await fetch("/api/shortlist/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, targetId }),
    })
    const data = await res.json()
    if (data.success) {
      setShortlisted((prev) => prev.filter((p) => p.id !== targetId))
      toast.success(t("profile.shortlistRemoved"))
    }
  }

  const getDisplayName = (profile: IUser) => {
    return profile.profile?.fullNameMr || profile.profile?.fullNameEn || profile.email || profile.mobile || "User"
  }

  const getPrimaryPhoto = (profile: IUser) => {
    return profile.photos?.[0]?.url || "https://i.pravatar.cc/200?img=0"
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-10">
        <motion.h1 variants={fadeUp} initial="initial" animate="animate" className="mb-6 text-2xl font-bold text-[#1b1c1c]">{t("nav.matches")}</motion.h1>

        <Tabs defaultValue="interests">
          <TabsList>
            <TabsTrigger value="interests">{t("dashboard.interests")}</TabsTrigger>
            <TabsTrigger value="shortlisted">{t("dashboard.shortlisted")}</TabsTrigger>
            <TabsTrigger value="accepted">{t("dashboard.messages")}</TabsTrigger>
          </TabsList>

          <TabsContent value="interests" className="mt-4 space-y-4">
            {interests.length > 0 ? interests.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card>
                  <CardContent className="flex items-center gap-4 p-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={item.photo} />
                      <AvatarFallback>{item.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1b1c1c]">{item.name}</h3>
                      <p className="text-xs text-[#887364]">{item.age} {locale === "mr" ? "वर्ष" : "yrs"}, {item.location}</p>
                      <Badge variant="default" className="mt-1">
                        {item.status === "interest_sent" ? (locale === "mr" ? "आवड पाठवली" : "Interest Sent") : (locale === "mr" ? "आवड प्राप्त" : "Interest Received")}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {item.status === "interest_received" ? (
                        <>
                          <Button size="sm" variant="default"><Check className="mr-1 h-4 w-4" />{locale === "mr" ? "स्वीकारा" : "Accept"}</Button>
                          <Button size="sm" variant="outline"><X className="mr-1 h-4 w-4" /></Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" disabled>{locale === "mr" ? "प्रतीक्षेत" : "Pending"}</Button>
                      )}
                      <Button size="sm" variant="ghost"><MessageCircle className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )) : (
              <motion.div variants={fadeUp} initial="initial" animate="animate">
                <EmptyState
                  icon={<Heart className="h-12 w-12" />}
                  title={locale === "mr" ? "अद्याप आवडी नाहीत" : "No interests yet"}
                  description={locale === "mr" ? "जेव्हा कोणी तुमच्या प्रोफाइलमध्ये रस दाखवेल तेव्हा तुम्हाला येथे दिसेल" : "When someone shows interest in your profile, you'll see it here"}
                />
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="shortlisted" className="mt-4">
            {loadingShortlisted ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF21A5] border-t-transparent" />
              </div>
            ) : shortlisted.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {shortlisted.map((profile, i) => {
                  const displayName = getDisplayName(profile)
                  const photo = getPrimaryPhoto(profile)
                  return (
                    <motion.div
                      key={profile.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="overflow-hidden card-premium">
                        <div className="relative h-28 bg-gradient-to-br from-[#FF21A5]/10 to-[#002366]/10">
                          <Avatar className="absolute -bottom-8 left-4 h-16 w-16 border-4 border-white shadow-md">
                            <AvatarImage src={photo} />
                            <AvatarFallback>{displayName[0]}</AvatarFallback>
                          </Avatar>
                          <button
                            onClick={() => handleRemoveShortlist(profile.id)}
                            className="absolute right-3 top-3 rounded-full bg-red-500/80 p-1.5 text-white transition-colors hover:bg-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <CardContent className="pt-10">
                          <div className="mb-1 flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-[#1b1c1c]">
                                {user?.isPremium ? displayName : maskName(displayName, !!user?.isPremium)}
                              </h3>
                              <p className="text-xs text-[#887364]">
                                {profile.profile?.education || ""} | {profile.profile?.occupation || ""}
                              </p>
                            </div>
                          </div>
                          <div className="mb-2 flex items-center gap-1 text-xs text-[#887364]">
                            <Bookmark className="h-3 w-3 text-[#FF21A5]" />
                            {locale === "mr" ? "आवडीत टाकले" : "Shortlisted"} · {new Date(profile.shortlistedAt).toLocaleDateString()}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="default" className="flex-1">
                              <Heart className="mr-1 h-3 w-3" />{t("profile.sendInterest")}
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <MessageCircle className="mr-1 h-3 w-3" />{t("profile.chat")}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <motion.div variants={fadeUp} initial="initial" animate="animate">
                <EmptyState
                  icon={<Bookmark className="h-12 w-12" />}
                  title={locale === "mr" ? "शॉर्टलिस्ट केलेले प्रोफाइल नाहीत" : "No shortlisted profiles"}
                  description={locale === "mr" ? "प्रोफाइलवर आवडीत टाका बटण दाबून तुम्ही प्रोफाइल येथे जतन करू शकता" : "Click the Shortlist button on profiles to save them here"}
                />
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="accepted" className="mt-4">
            <motion.div variants={fadeUp} initial="initial" animate="animate">
              <EmptyState
                icon={<Heart className="h-12 w-12" />}
                title={locale === "mr" ? "अद्याप स्वीकारलेली जुळणी नाही" : "No accepted matches yet"}
                description={locale === "mr" ? "जेव्हा तुमची आवड स्वीकारली जाईल तेव्हा तुम्ही संभाषण सुरू करू शकता" : "When your interest is accepted, you can start chatting"}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
