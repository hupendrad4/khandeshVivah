"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MainLayout } from "@/components/layout/MainLayout"
import { useI18n } from "@/lib/i18n"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Heart, Shield, Users, Target } from "lucide-react"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function AboutPage() {
  const { t, locale } = useI18n()

  return (
    <MainLayout>
      <div className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80')" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-[#9B1B30]/80 via-[#D4AF37]/70 to-[#9B1B30]/90" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-3">{t("footer.about")}</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/80 text-lg max-w-xl mx-auto">
            {locale === "mr" ? "खांदेश विवाह — तुमच्या संस्कृतीचा वारसा जपणारा विश्वासार्ह विवाह मंच" : "Khandesh Vivah — a trusted matrimonial platform rooted in tradition"}
          </motion.p>
        </div>
      </div>

      <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-10 bg-mandala-ornamental">
        <div className="ornamental-corner-tl" /><div className="ornamental-corner-br" />
        <Link href="/" className="mb-4 inline-flex items-center gap-1 text-xs text-[#C4A0A3] hover:text-[#9B1B30]">
          <ChevronLeft className="h-3 w-3" /> {t("common.back")}
        </Link>

        <motion.div variants={fadeUp} initial="initial" animate="animate" className="mb-8 rounded-2xl bg-surface-container-low p-6 shadow-sm border-0">
          <p className="leading-relaxed text-[#5C4B4D]">
            {locale === "mr"
              ? "खांदेश विवाह म्हणजे तुमच्यासाठी. तुम्ही जळगावचे असाल, धुळ्याचे, नंदुरबारचे किंवा नाशिकचे — इथे तुम्हाला तुमच्याच समाजातील, तुमच्याच भागातील पडताळणी केलेली स्थळं मिळतील. तुमची माहिती सुरक्षित, तुमचं प्रोफाइल तुमच्या नियंत्रणात. इतकंच."
              : "Khandesh Vivah is built for you. Whether you're from Jalgaon, Dhule, Nandurbar, or Nashik — find verified profiles from your own community, your own region. Your data stays safe, your profile stays in your control. That's it."}
          </p>
        </motion.div>

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          {[
            { icon: Target, titleMr: "तुम्हाला हवं ते स्थळ मिळेल", titleEn: "Find What You're Looking For", descMr: "तुमच्या पसंतीचे फिल्टर लावा — जिल्हा, तालुका, जात, शिक्षण, नोकरी. मग तुमच्यासाठी योग्य असलेली स्थळं शोधा.", descEn: "Set your filters by district, taluka, caste, education, occupation — then browse profiles that actually match what you want." },
            { icon: Shield, titleMr: "सुरक्षितता आमची जबाबदारी", titleEn: "Safety Is Our Priority", descMr: "तुमच्यासाठी एक सुरक्षित वातावरण देणं आमचं कर्तव्य आहे. प्रत्येक प्रोफाइलची पडताळणी केली जाते. तुम्हाला हवं तर तुमचं प्रोफाइल लपवून ठेवू शकता.", descEn: "Every profile is verified. Every user is real. And you control who sees your details — not us." },
            { icon: Heart, titleMr: "आपल्याच संस्कारातला जोडीदार", titleEn: "Your Community, Your Match", descMr: "खांदेश विभाग — जळगाव, धुळे, नंदुरबार, नाशिक, चाळीसगाव, भुसावळ, यावल — इथल्या प्रत्येक गावातून स्थळं शोधा.", descEn: "Search across all of Khandesh — Jalgaon, Dhule, Nandurbar, Nashik, Chalisgaon, Bhusawal, Yawal, every village. Find someone who shares your roots." },
            { icon: Users, titleMr: "कुटुंबासोबत शोधा", titleEn: "Family Can Join Too", descMr: "तुमचं प्रोफाइल तयार करताना कुटुंबियांनाही सोबत ठेवा. एकत्र बसून स्थळं पाहा, निर्णय घ्या. सगळं एकाच मंचावर.", descEn: "Create and manage profiles together with your family. Browse, shortlist, and decide — all on one platform, together." },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-surface-container-low border-0 shadow-sm">
                <CardContent className="p-5">
                  <item.icon className="mb-3 h-8 w-8 text-[#9B1B30]" />
                  <h3 className="mb-1 font-bold text-[#1b1c1c]">{locale === "mr" ? item.titleMr : item.titleEn}</h3>
                  <p className="text-sm text-[#5C4B4D]">{locale === "mr" ? item.descMr : item.descEn}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
