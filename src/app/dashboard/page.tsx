"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { MainLayout } from "@/components/layout/MainLayout"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePaymentGate } from "@/lib/use-payment-gate"
import { useAuthStore } from "@/store/auth-store"
import toast from "react-hot-toast"
import {
  Heart, MessageCircle, Eye, Star, Bell, Settings, UserCheck,
  Users, Sparkles, ChevronRight, Clock, Shield, Camera,
  Bookmark, TrendingUp,
} from "lucide-react"

function ProfileCompletionCard() {
  const { t } = useI18n()
  return (
    <Card className="accent-strip">
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-[#1b1c1c]">{t("dashboard.profileCompletion")}</h3>
          <Badge variant="default">60%</Badge>
        </div>
        <Progress value={60} className="mb-3 h-2" />
        <div className="space-y-2 text-sm text-[#554336]">
          <div className="flex items-center justify-between"><span>{t("registration.photos")}</span><span className="text-[#50C878]"><CheckCircle className="mr-1 inline h-3 w-3" />Done</span></div>
          <div className="flex items-center justify-between"><span>{t("registration.aboutMe")}</span><span className="text-[#50C878]"><CheckCircle className="mr-1 inline h-3 w-3" />Done</span></div>
          <div className="flex items-center justify-between"><span>{t("registration.horoscope")}</span><span className="text-[#50C878]"><CheckCircle className="mr-1 inline h-3 w-3" />Done</span></div>
          <div className="flex items-center justify-between"><span>{t("registration.familyDetails")}</span><span className="text-[#FF21A5]"><Camera className="mr-1 inline h-3 w-3" />Pending</span></div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatsRow() {
  const { t } = useI18n()
  const stats = [
    { label: t("dashboard.profileViews"), value: "128", icon: Eye, color: "text-blue-600" },
    { label: t("dashboard.interests"), value: "12", icon: Heart, color: "text-red-500" },
    { label: t("dashboard.shortlisted"), value: "8", icon: Bookmark, color: "text-[#D4AF37]" },
    { label: t("dashboard.messages"), value: "5", icon: MessageCircle, color: "text-[#50C878]" },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label} className="card-premium">
          <CardContent className="p-4 text-center">
            <s.icon className={`mx-auto mb-1 h-5 w-5 ${s.color}`} />
            <p className="text-xl font-bold text-[#1b1c1c]">{s.value}</p>
            <p className="text-xs text-[#887364]">{s.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function RecommendedMatches() {
  const { t, locale } = useI18n()
  const { executeWithGate, isProcessing } = usePaymentGate()
  const { user } = useAuthStore()
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set())
  const matches = [
    { name: "प्रिया पाटील", age: "25", location: "Jalgaon", score: 92, photo: "https://i.pravatar.cc/200?img=1" },
    { name: "स्नेहा जाधव", age: "24", location: "Dhule", score: 88, photo: "https://i.pravatar.cc/200?img=2" },
    { name: "रुपाली महाजन", age: "26", location: "Nandurbar", score: 85, photo: "https://i.pravatar.cc/200?img=3" },
  ]
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gradient-pink">{t("dashboard.recommendedMatches")}</h2>
        <Link href="/search"><Button variant="ghost" size="sm" className="gap-1">{t("dashboard.viewAll")}<ChevronRight className="h-3 w-3" /></Button></Link>
      </div>
      <div className="divider-pink mx-auto mb-6 w-16" />
      <div className="grid gap-4 md:grid-cols-3">
        {matches.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="overflow-hidden card-premium">
              <div className="relative h-32 bg-gradient-to-br from-[#FF21A5]/20 to-[#002366]/20">
                <Avatar className="absolute -bottom-8 left-4 h-16 w-16 border-4 border-white">
                  <AvatarImage src={m.photo} />
                  <AvatarFallback>{m.name[0]}</AvatarFallback>
                </Avatar>
                <Badge variant="success" className="absolute right-3 top-3">
                  <Sparkles className="mr-1 h-3 w-3" />{m.score}%
                </Badge>
              </div>
              <CardContent className="pt-10">
                <h3 className="font-bold text-[#1b1c1c]">{m.name}</h3>
                <p className="text-xs text-[#887364]">{m.age} yrs, {m.location}</p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    className="flex-1 btn-premium"
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
                    disabled={isProcessing}
                    onClick={async () => {
                      if (!user?.id) {
                        toast.error(locale === "mr" ? "कृपया प्रथम लॉगिन करा" : "Please login first")
                        return
                      }
                      const res = await fetch("/api/shortlist/toggle", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: user.id, targetId: m.name }),
                      })
                      const data = await res.json()
                      if (data.success) {
                        setShortlistedIds((prev) => {
                          const next = new Set(prev)
                          if (data.shortlisted) next.add(m.name)
                          else next.delete(m.name)
                          return next
                        })
                        toast.success(data.shortlisted ? t("profile.shortlistAdded") : t("profile.shortlistRemoved"))
                      }
                    }}
                  >
                    <Bookmark className={`mr-1 h-3 w-3 ${shortlistedIds.has(m.name) ? "fill-[#FF21A5] text-[#FF21A5]" : ""}`} />{t("profile.shortlist")}
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
        ))}
      </div>
    </div>
  )
}

function RecentVisitors() {
  const { t } = useI18n()
  const { executeWithGate, isProcessing } = usePaymentGate()
  return (
    <Card className="card-premium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Eye className="h-4 w-4 text-[#FF21A5]" /> {t("dashboard.recentVisitors")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`https://i.pravatar.cc/100?img=${i + 10}`} />
                <AvatarFallback>V</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1b1c1c]">Visitor {i}</p>
                <p className="text-xs text-[#887364]">{i}h ago</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
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
              >{t("profile.sendInterest")}</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { t } = useI18n()
  return (
    <MainLayout>
      <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-10 bg-gradient-warm rounded-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1b1c1c]">{t("dashboard.welcome")}, प्रिया!</h1>
          <p className="text-sm text-[#554336]">{t("app.tagline")}</p>
        </div>

        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <StatsRow />
            <RecommendedMatches />
          </div>
          <div className="space-y-6">
            <ProfileCompletionCard />
            <RecentVisitors />
          </div>
        </div>

        <Card className="bg-gradient-to-r from-[#FF21A5] to-[#FF2E96] text-white shadow-premium">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-lg font-bold">{t("premium.becomePremium")}</h3>
              <p className="text-sm opacity-90">{t("premium.premiumBenefits")}</p>
            </div>
            <Link href="/premium">
              <Button variant="secondary" className="bg-white text-[#FF21A5] hover:bg-white/90 whitespace-nowrap">
                {t("premium.upgradeNow")} <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

function CheckCircle({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
}
