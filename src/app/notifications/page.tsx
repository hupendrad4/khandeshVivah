"use client"

import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/MainLayout"
import { useI18n } from "@/lib/i18n"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Heart, MessageCircle, Eye, Star, Sparkles, Shield, CheckCircle } from "lucide-react"

const notifications = [
  { type: "interest", titleKey: "app.name", messageMr: "राजेश पाटील ने तुमच्या प्रोफाइलमध्ये रस दाखवला आहे", messageEn: "Rajesh Patil has shown interest in your profile", time: "2m ago", read: false, icon: Heart, color: "text-[#FF21A5]" },
  { type: "message", titleKey: "nav.chat", messageMr: "अमित जाधव ने तुम्हाला संदेश पाठवला आहे", messageEn: "Amit Jadhav has sent you a message", time: "1h ago", read: false, icon: MessageCircle, color: "text-[#FF21A5]" },
  { type: "view", titleKey: "profile.profileViews", messageMr: "या आठवड्यात १२ जणांनी तुमचे प्रोफाइल पाहिले", messageEn: "12 people viewed your profile this week", time: "3h ago", read: true, icon: Eye, color: "text-[#002366]" },
  { type: "premium", titleKey: "premium.premium", messageMr: "प्रीमियम सदस्यत्वावर ५०% सूट! आजच सबस्क्राइब करा", messageEn: "50% off on Premium membership! Subscribe today", time: "1d ago", read: true, icon: Sparkles, color: "text-[#D4AF37]" },
  { type: "verification", titleKey: "common.verified", messageMr: "तुमचे प्रोफाइल यशस्वीरित्या पडताळले गेले आहे", messageEn: "Your profile has been verified successfully", time: "2d ago", read: true, icon: Shield, color: "text-[#50C878]" },
]

export default function NotificationsPage() {
  const { t, locale } = useI18n()

  return (
    <MainLayout>
      <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1b1c1c]">{t("nav.notifications")}</h1>
          {notifications.some((n) => !n.read) && (
            <Badge variant="default" className="cursor-pointer">{t("common.all")}</Badge>
          )}
        </div>

        <div className="space-y-3">
          {notifications.map((n, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={`${!n.read ? "border-[#FF21A5]/30 bg-[#FF21A5]/5" : ""}`}>
                <CardContent className="flex items-start gap-3 p-4">
                  <div className={`rounded-full p-2 ${!n.read ? "bg-[#FF21A5]/10" : "bg-[#F6F3F2]"}`}>
                    <n.icon className={`h-5 w-5 ${n.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-[#1b1c1c]">{t(n.titleKey as any)}</p>
                        <p className="text-sm text-[#554336]">{locale === "mr" ? n.messageMr : n.messageEn}</p>
                      </div>
                      {!n.read && <span className="mt-1 h-2 w-2 rounded-full bg-[#FF21A5]" />}
                    </div>
                    <p className="mt-1 text-xs text-[#887364]">{n.time}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
