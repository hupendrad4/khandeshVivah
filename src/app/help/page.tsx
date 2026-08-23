"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MainLayout } from "@/components/layout/MainLayout"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Search, HelpCircle, MessageCircle, Phone, Mail, ChevronRight } from "lucide-react"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function HelpPage() {
  const { t, locale } = useI18n()

  const faqs = [
    { qMr: "खांदेश विवाह म्हणजे काय?", qEn: "What is Khandesh Vivah?", aMr: "खांदेश विवाह हा खांदेश समाजासाठी समर्पित विवाह मंच आहे.", aEn: "Khandesh Vivah is a matrimonial platform dedicated to the Khandesh community." },
    { qMr: "नोंदणी कशी करावी?", qEn: "How to register?", aMr: "मोबाइल नंबर किंवा ईमेलद्वारे सहज नोंदणी करा.", aEn: "Register easily with mobile number or email." },
    { qMr: "प्रीमियम सदस्यत्व कसे घ्यावे?", qEn: "How to get premium membership?", aMr: "प्रीमियम पेजवर जाऊन तुम्ही सबस्क्राइब करू शकता.", aEn: "You can subscribe by visiting the Premium page." },
    { qMr: "प्रोफाइल कसे हटवावे?", qEn: "How to delete profile?", aMr: "सेटिंग्जमध्ये जाऊन तुम्ही प्रोफाइल डिलीट करू शकता.", aEn: "You can delete your profile from Settings." },
    { qMr: "फोटो कसे अपलोड करावेत?", qEn: "How to upload photos?", aMr: "प्रोफाइल एडिट पेजवरून फोटो अपलोड करा.", aEn: "Upload photos from the profile edit page." },
  ]

  return (
    <MainLayout>
      <div className="relative min-h-[35vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573497620053-e4e2924b8f1f?w=1600&q=80')" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-[#9B1B30]/80 via-[#D4AF37]/70 to-[#9B1B30]/90" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-white font-label-md mb-4">
            <HelpCircle className="h-4 w-4" />
            {locale === "mr" ? "आम्ही मदतीसाठी आहोत" : "We're here to help"}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-3">{t("nav.help")}</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/80 text-lg max-w-xl mx-auto">
            {locale === "mr" ? "तुमच्या प्रश्नांची उत्तरे आणि सहाय्य" : "Answers and support for your questions"}
          </motion.p>
        </div>
      </div>

      <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-10 bg-mandala-ornamental">
        <div className="ornamental-corner-tl" /><div className="ornamental-corner-br" />
        <Link href="/" className="mb-4 inline-flex items-center gap-1 text-xs text-[#C4A0A3] hover:text-[#9B1B30]">
          <ChevronLeft className="h-3 w-3" /> {t("common.back")}
        </Link>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C4A0A3]" />
          <Input placeholder={t("home.searchPlaceholder")} className="pl-9" />
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            { icon: MessageCircle, labelMr: "लाइव्ह चॅट", labelEn: "Live Chat", descMr: "सपोर्टशी चॅट करा", descEn: "Chat with support" },
            { icon: Phone, labelMr: "फोन सपोर्ट", labelEn: "Phone Support", descMr: "+91-XXXXX XXXXX", descEn: "+91-XXXXX XXXXX" },
            { icon: Mail, labelMr: "ईमेल सपोर्ट", labelEn: "Email Support", descMr: "support@khandeshvivah.com", descEn: "support@khandeshvivah.com" },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeUp} initial="initial" animate="animate" transition={{ delay: i * 0.1 }}>
              <Card className="bg-surface-container-low border-0 shadow-sm cursor-pointer hover:shadow-elevated">
                <CardContent className="flex flex-col items-center p-5 text-center">
                  <item.icon className="mb-2 h-8 w-8 text-[#9B1B30]" />
                  <h3 className="font-semibold text-[#1b1c1c]">{locale === "mr" ? item.labelMr : item.labelEn}</h3>
                  <p className="text-xs text-[#C4A0A3]">{locale === "mr" ? item.descMr : item.descEn}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="relative mb-6">
          <div className="ornamental-band mb-4" />
          <h2 className="text-lg font-bold text-[#1b1c1c] flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#9B1B30]" />
            {t("home.faq")}
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-surface-container-low border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between cursor-pointer">
                    <div>
                      <h3 className="font-medium text-[#1b1c1c]">{locale === "mr" ? faq.qMr : faq.qEn}</h3>
                      <p className="mt-1 text-sm text-[#5C4B4D]">{locale === "mr" ? faq.aMr : faq.aEn}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#C4A0A3] shrink-0 mt-1" />
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
