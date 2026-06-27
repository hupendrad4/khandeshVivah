"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MainLayout } from "@/components/layout/MainLayout"
import { useI18n } from "@/lib/i18n"
import { ChevronLeft } from "lucide-react"

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function TermsPage() {
  const { t, locale } = useI18n()

  return (
    <MainLayout>
      <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-10">
        <Link href="/" className="mb-4 inline-flex items-center gap-1 text-xs text-[#887364] hover:text-[#FF21A5]">
          <ChevronLeft className="h-3 w-3" /> {t("common.back")}
        </Link>
        <motion.h1 variants={fadeUp} initial="initial" animate="animate" className="mb-2 text-2xl font-bold text-[#1b1c1c]">{t("common.terms")}</motion.h1>
        <motion.p variants={fadeUp} initial="initial" animate="animate" className="mb-8 text-sm text-[#554336]">{locale === "mr" ? "शेवटचे अपडेट: जानेवारी २०२४" : "Last updated: January 2024"}</motion.p>

        <div className="space-y-6">
          {[
            { title: locale === "mr" ? "अटींची स्वीकृती" : "1. Acceptance of Terms",
              content: locale === "mr" ? "खांदेश विवाह वापरून, तुम्ही या अटी व शर्ती मान्य करता. जर तुम्ही सहमत नसाल तर कृपया सेवा वापरू नका." : "By using Khandesh Vivah, you agree to these terms and conditions. If you do not agree, please do not use the service." },
            { title: locale === "mr" ? "वापरकर्ता जबाबदाऱ्या" : "2. User Responsibilities",
              content: locale === "mr" ? "तुम्ही अचूक माहिती प्रदान करण्यास, खोटे प्रोफाइल तयार न करण्यास आणि इतर वापरकर्त्यांचा आदर करण्यास सहमत आहात." : "You agree to provide accurate information, not create fake profiles, and respect other users." },
            { title: locale === "mr" ? "गोपनीयता" : "3. Privacy",
              content: locale === "mr" ? "तुमची वैयक्तिक माहिती आमच्या गोपनीयता धोरणानुसार हाताळली जाईल." : "Your personal information will be handled in accordance with our Privacy Policy." },
            { title: locale === "mr" ? "सेवा नियम" : "4. Service Rules",
              content: locale === "mr" ? "स्पॅमिंग, शिवीगाळ, खोटी माहिती किंवा कोणतीही बेकायदेशीर क्रिया करण्यास मनाई आहे." : "Spamming, abusive language, false information, or any illegal activity is prohibited." },
            { title: locale === "mr" ? "खाते समाप्ती" : "5. Account Termination",
              content: locale === "mr" ? "या अटींचे उल्लंघन केल्यास खाते समाप्त करण्याचा अधिकार आमच्याकडे आहे." : "We reserve the right to terminate accounts that violate these terms." },
          ].map((section, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-[#E4E2E1] bg-white p-5 shadow-card"
            >
              <h2 className="mb-2 text-lg font-bold text-[#1b1c1c]">{section.title}</h2>
              <p className="text-sm leading-relaxed text-[#554336]">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
