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
      <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-10">
        <Link href="/" className="mb-4 inline-flex items-center gap-1 text-xs text-[#887364] hover:text-[#FF21A5]">
          <ChevronLeft className="h-3 w-3" /> {t("common.back")}
        </Link>
        <motion.h1 variants={fadeUp} initial="initial" animate="animate" className="mb-6 text-2xl font-bold text-[#1b1c1c]">{t("nav.contact")}</motion.h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            {[
              { icon: Phone, labelMr: "फोन", labelEn: "Phone", value: "+91-XXXXX XXXXX" },
              { icon: Mail, labelMr: "ईमेल", labelEn: "Email", value: "info@khandeshvivah.com" },
              { icon: MapPin, labelMr: "पत्ता", labelEn: "Address", valueMr: "जळगाव, महाराष्ट्र, भारत", valueEn: "Jalgaon, Maharashtra, India" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} initial="initial" animate="animate" transition={{ delay: i * 0.1 }}>
                <Card>
                  <CardContent className="flex items-center gap-3 p-4">
                    <item.icon className="h-5 w-5 text-[#FF21A5]" />
                    <div>
                      <p className="text-sm font-medium text-[#1b1c1c]">{locale === "mr" ? item.labelMr : item.labelEn}</p>
                      <p className="text-xs text-[#887364]">{locale === "mr" && item.valueMr ? item.valueMr : item.valueEn || item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeUp} initial="initial" animate="animate">
            <Card>
              <CardContent className="p-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t("auth.fullName")}</Label>
                    <Input placeholder={locale === "mr" ? "तुमचे नाव" : "Your name"} className="bg-[#F5C6E4]" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("auth.emailAddress")}</Label>
                    <Input type="email" placeholder="your@email.com" className="bg-[#F5C6E4]" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("auth.mobileNumber")}</Label>
                    <Input placeholder="+91 98765 43210" className="bg-[#F5C6E4]" />
                  </div>
                  <div className="space-y-2">
                    <Label>{locale === "mr" ? "संदेश" : "Message"}</Label>
                    <textarea className="min-h-[120px] w-full rounded-lg border border-[#E4E2E1] bg-[#F5C6E4] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF21A5]" />
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
