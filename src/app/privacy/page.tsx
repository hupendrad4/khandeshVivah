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

export default function PrivacyPage() {
  const { t, locale } = useI18n()

  return (
    <MainLayout>
      <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-10">
        <Link href="/" className="mb-4 inline-flex items-center gap-1 text-xs text-[#C4A0A3] hover:text-[#9B1B30]">
          <ChevronLeft className="h-3 w-3" /> {t("common.back")}
        </Link>
        <motion.h1 variants={fadeUp} initial="initial" animate="animate" className="mb-2 text-2xl font-bold text-[#1b1c1c]">{t("common.privacy")}</motion.h1>
        <motion.p variants={fadeUp} initial="initial" animate="animate" className="mb-8 text-sm text-[#5C4B4D]">{locale === "mr" ? "शेवटचे अपडेट: जानेवारी २०२४" : "Last updated: January 2024"}</motion.p>

        <div className="space-y-6">
          {[
            { title: locale === "mr" ? "आम्ही कोणती माहिती गोळा करतो" : "1. Information We Collect",
              content: locale === "mr" ? "आम्ही तुमचे नाव, संपर्क तपशील, वैयक्तिक माहिती, फोटो आणि प्लॅटफॉर्म वापराशी संबंधित डेटा गोळा करतो." : "We collect your name, contact details, personal information, photos, and data related to platform usage." },
            { title: locale === "mr" ? "आम्ही तुमची माहिती कशी वापरतो" : "2. How We Use Your Information",
              content: locale === "mr" ? "तुमची माहिती प्रोफाइल तयार करणे, जोडीदार शोध सुधारणे, सेवा प्रदान करणे आणि सुरक्षितता सुनिश्चित करण्यासाठी वापरली जाते." : "Your information is used for profile creation, matchmaking improvements, service delivery, and ensuring safety." },
            { title: locale === "mr" ? "माहिती संरक्षण" : "3. Data Protection",
              content: locale === "mr" ? "आम्ही तुमच्या डेटाचे अनधिकृत प्रवेशापासून संरक्षण करण्यासाठी मानक सुरक्षा उपाय वापरतो." : "We use standard security measures to protect your data from unauthorized access." },
            { title: locale === "mr" ? "तुमचे हक्क" : "4. Your Rights",
              content: locale === "mr" ? "तुम्ही तुमची माहिती पाहणे, सुधारणे, हटवणे किंवा निर्यात करण्याची विनंती करू शकता." : "You may request to view, modify, delete, or export your information." },
          ].map((section, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-[#E8B8BC] bg-white p-5 shadow-card"
            >
              <h2 className="mb-2 text-lg font-bold text-[#1b1c1c]">{section.title}</h2>
              <p className="text-sm leading-relaxed text-[#5C4B4D]">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
