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

export default function RefundPage() {
  const { t, locale } = useI18n()

  return (
    <MainLayout>
      <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-10">
        <Link href="/" className="mb-4 inline-flex items-center gap-1 text-xs text-[#887364] hover:text-[#8f4e00]">
          <ChevronLeft className="h-3 w-3" /> {t("common.back")}
        </Link>
        <motion.h1 variants={fadeUp} initial="initial" animate="animate" className="mb-2 text-2xl font-bold text-[#1b1c1c]">{t("common.refundPolicy")}</motion.h1>
        <motion.p variants={fadeUp} initial="initial" animate="animate" className="mb-8 text-sm text-[#554336]">{locale === "mr" ? "शेवटचे अपडेट: जानेवारी २०२४" : "Last updated: January 2024"}</motion.p>

        <div className="space-y-6">
          {[
            { title: locale === "mr" ? "प्रीमियम सदस्यत्व रिफंड" : "1. Premium Subscription Refunds",
              content: locale === "mr" ? "प्रीमियम सदस्यत्व शुल्क सेवा सक्रिय झाल्यानंतर परत करण्यायोग्य नाही. तुम्ही कधीही स्वयं-नूतनीकरण रद्द करू शकता." : "Premium subscription fees are non-refundable once the service is activated. You may cancel auto-renewal at any time." },
            { title: locale === "mr" ? "तांत्रिक समस्या" : "2. Technical Issues",
              content: locale === "mr" ? "सेवा वापरण्यापासून प्रतिबंधित करणाऱ्या तांत्रिक समस्यांसाठी, निराकरण किंवा रिफंड विचारासाठी ७ दिवसांच्या आत समर्थनाशी संपर्क साधा." : "If you experience technical issues preventing service usage, contact support within 7 days for resolution or refund consideration." },
            { title: locale === "mr" ? "प्रक्रिया वेळ" : "3. Processing Time",
              content: locale === "mr" ? "मंजूर रिफंड मूळ पेमेंट पद्धतीवर ५-१० कामकाजाच्या दिवसांत प्रक्रिया केली जाईल." : "Approved refunds will be processed within 5-10 business days to the original payment method." },
            { title: locale === "mr" ? "संपर्क" : "4. Contact",
              content: locale === "mr" ? "रिफंड विनंत्यांसाठी, refunds@khandeshvivah.com वर ईमेल करा" : "For refund requests, email refunds@khandeshvivah.com" },
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
