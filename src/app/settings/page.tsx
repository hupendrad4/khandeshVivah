"use client"

import { motion } from "framer-motion"
import { MainLayout } from "@/components/layout/MainLayout"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useThemeStore } from "@/store/theme-store"
import Link from "next/link"
import { ChevronLeft, Bell, Eye, Lock, Globe, Moon, Sun, Shield, Smartphone, LogOut, Trash2 } from "lucide-react"
import toast from "react-hot-toast"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n()
  const { theme, setTheme } = useThemeStore()

  return (
    <MainLayout>
      <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-10 bg-mandala-ornamental">
        <div className="ornamental-corner-tl" /><div className="ornamental-corner-br" />
        <Link href="/dashboard" className="mb-4 inline-flex items-center gap-1 text-xs text-[#C4A0A3] hover:text-[#9B1B30]">
          <ChevronLeft className="h-3 w-3" /> {t("common.back")}
        </Link>
        <motion.h1 variants={fadeUp} initial="initial" animate="animate" className="mb-6 text-2xl font-bold text-[#1b1c1c]">{t("nav.settings")}</motion.h1>

        <div className="space-y-4">
          <motion.div variants={fadeUp} initial="initial" animate="animate">
            <Card className="bg-surface-container-low border-0 shadow-sm">
              <CardContent className="p-5">
                <h3 className="mb-4 font-semibold text-[#D4AF37]">{t("common.language")}</h3>
                <div className="flex gap-3">
                  <Button
                    variant={locale === "mr" ? "default" : "outline"}
                    onClick={() => setLocale("mr")}
                    className="flex-1"
                  >मराठी</Button>
                  <Button
                    variant={locale === "en" ? "default" : "outline"}
                    onClick={() => setLocale("en")}
                    className="flex-1"
                  >English</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} initial="initial" animate="animate">
            <Card className="bg-surface-container-low border-0 shadow-sm">
              <CardContent className="p-5">
                <h3 className="mb-4 font-semibold text-[#D4AF37]">{t("common.theme")}</h3>
                <div className="flex gap-3">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    onClick={() => setTheme("light")}
                    className="flex-1 gap-2"
                  ><Sun className="h-4 w-4" /> {t("common.lightMode")}</Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => setTheme("dark")}
                    className="flex-1 gap-2"
                  ><Moon className="h-4 w-4" /> {t("common.darkMode")}</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} initial="initial" animate="animate">
            <Card className="bg-surface-container-low border-0 shadow-sm">
              <CardContent className="space-y-4 p-5">
                <h3 className="mb-4 font-semibold text-[#D4AF37]">{t("common.notifications")}</h3>
                {[
                  { labelKey: "nav.notifications", icon: Bell },
                  { labelKey: "nav.notifications", icon: Smartphone },
                  { labelKey: "nav.notifications", icon: Smartphone },
                  { labelKey: "nav.notifications", icon: Globe },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 text-[#C4A0A3]" />
                      <span className="text-sm text-[#5C4B4D]">{t(`${item.labelKey}`)} {idx + 1}</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} initial="initial" animate="animate">
            <Card className="bg-surface-container-low border-0 shadow-sm">
              <CardContent className="space-y-4 p-5">
                <h3 className="mb-4 font-semibold text-[#D4AF37]">{t("common.privacy")}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#1b1c1c]">{locale === "mr" ? "माझे प्रोफाइल सर्वांना दिसावे" : "Show my profile to everyone"}</p>
                    <p className="text-xs text-[#C4A0A3]">{locale === "mr" ? "तुमचे प्रोफाइल शोध निकालात दिसेल" : "Your profile will be visible in search results"}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#1b1c1c]">{locale === "mr" ? "फक्त जुळलेल्यांना फोटो दिसावेत" : "Show photo to matches only"}</p>
                    <p className="text-xs text-[#C4A0A3]">{locale === "mr" ? "फक्त स्वीकृत जोडीदारांनाच तुमचे फोटो दिसतील" : "Only accepted matches can see your photos"}</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#1b1c1c]">{locale === "mr" ? "प्रीमियम सदस्यांना संपर्क दिसावा" : "Show contact info to premium"}</p>
                    <p className="text-xs text-[#C4A0A3]">{locale === "mr" ? "फक्त प्रीमियम सदस्यांनाच संपर्क तपशील दिसतील" : "Only premium members can see contact details"}</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#1b1c1c]">{locale === "mr" ? "इनकॉग्निटो मोड" : "Incognito mode"}</p>
                    <p className="text-xs text-[#C4A0A3]">{locale === "mr" ? "तुम्ही कोणालाही न दिसता प्रोफाइल ब्राउझ करा" : "Browse profiles without being seen"}</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1 gap-2 text-red-500 border-red-200 hover:bg-red-50" size="lg">
              <LogOut className="h-4 w-4" /> {t("nav.logout")}
            </Button>
            <Button variant="outline" className="flex-1 gap-2 text-red-500 border-red-200 hover:bg-red-50" size="lg">
              <Trash2 className="h-4 w-4" /> {t("common.delete")}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
