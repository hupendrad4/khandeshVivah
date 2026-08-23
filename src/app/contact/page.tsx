"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MainLayout } from "@/components/layout/MainLayout"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Phone, Mail, MapPin, Send } from "lucide-react"
import toast from "react-hot-toast"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function ContactPage() {
  const { t, locale } = useI18n()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success(locale === "mr" ? "संदेश यशस्वीरित्या पाठवला!" : "Message sent successfully!")
  }

  return (
    <MainLayout>
      <div className="relative min-h-[35vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=1600&q=80')" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-[#9B1B30]/80 via-[#D4AF37]/70 to-[#9B1B30]/90" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-3">{t("nav.contact")}</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/80 text-lg max-w-xl mx-auto">
            {locale === "mr" ? "आमच्याशी संपर्क साधा. तुमचे प्रश्न ऐकण्यासाठी आम्ही सदैव तयार आहोत." : "Get in touch. We're always ready to hear from you."}
          </motion.p>
        </div>
      </div>

      <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-10 bg-mandala-ornamental">
        <div className="ornamental-corner-tl" /><div className="ornamental-corner-br" />
        <Link href="/" className="mb-4 inline-flex items-center gap-1 text-xs text-[#C4A0A3] hover:text-[#9B1B30]">
          <ChevronLeft className="h-3 w-3" /> {t("common.back")}
        </Link>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            {[
              { icon: Phone, labelMr: "फोन", labelEn: "Phone", value: "+91-XXXXX XXXXX" },
              { icon: Mail, labelMr: "ईमेल", labelEn: "Email", value: "info@khandeshvivah.com" },
              { icon: MapPin, labelMr: "पत्ता", labelEn: "Address", valueMr: "जळगाव, महाराष्ट्र, भारत", valueEn: "Jalgaon, Maharashtra, India" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} initial="initial" animate="animate" transition={{ delay: i * 0.1 }}>
                <Card className="bg-surface-container-low border-0 shadow-sm">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="rounded-full bg-[#9B1B30]/10 p-2">
                      <item.icon className="h-5 w-5 text-[#9B1B30]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1b1c1c]">{locale === "mr" ? item.labelMr : item.labelEn}</p>
                      <p className="text-xs text-[#C4A0A3]">{locale === "mr" && item.valueMr ? item.valueMr : item.valueEn || item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeUp} initial="initial" animate="animate">
            <Card className="bg-surface-container-low border-0 shadow-sm">
              <CardContent className="p-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t("auth.fullName")}</Label>
                    <Input placeholder={locale === "mr" ? "तुमचे नाव" : "Your name"} className="bg-[#FDE8EA] border-0" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("auth.emailAddress")}</Label>
                    <Input type="email" placeholder="your@email.com" className="bg-[#FDE8EA] border-0" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("auth.mobileNumber")}</Label>
                    <Input placeholder="+91 98765 43210" className="bg-[#FDE8EA] border-0" />
                  </div>
                  <div className="space-y-2">
                    <Label>{locale === "mr" ? "संदेश" : "Message"}</Label>
                    <textarea className="min-h-[120px] w-full rounded-lg border-0 bg-[#FDE8EA] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#9B1B30]" />
                  </div>
                  <Button type="submit" className="w-full gap-2">
                    <Send className="h-4 w-4" /> {t("common.submit")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  )
}
