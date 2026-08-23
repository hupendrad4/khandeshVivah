"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useI18n } from "@/lib/i18n"
import { usePaymentGate } from "@/lib/use-payment-gate"
import { MainLayout } from "@/components/layout/MainLayout"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"

const plans = [
  {
    name: "Silver", price: "₹१,५००", period: "/ ३ महिने", popular: false,
    features: [
      { mr: "अमर्यादित मेसेज पाठवा", en: "Unlimited messages" },
      { mr: "५० संपर्कांचे तपशील पहा", en: "View 50 contact details" },
      { mr: "प्रोफाईल बूस्ट (महिन्यातून १ वेळा)", en: "Profile boost (1x/month)" },
    ],
    disabled: [false, false, false, true, true],
    extra: [
      { mr: "पर्सनलाइज्ड मॅचमेकर", en: "Personalized matchmaker" },
    ],
  },
  {
    name: "Gold", price: "₹३,५००", period: "/ ६ महिने", popular: true,
    features: [
      { mr: "अमर्यादित मेसेज आणि चॅट", en: "Unlimited messages & chat" },
      { mr: "१५० संपर्कांचे तपशील पहा", en: "View 150 contact details" },
      { mr: "प्रोफाईल बूस्ट (दर आठवड्याला)", en: "Profile boost (weekly)" },
      { mr: "प्राधान्य शोध (Priority Search)", en: "Priority search" },
      { mr: "कुंडली मॅचिंग रिपोर्ट", en: "Kundali matching report" },
    ],
    disabled: [],
    extra: [],
  },
  {
    name: "Platinum", price: "₹६,०००", period: "/ १ वर्ष", popular: false,
    features: [
      { mr: "सर्व काही अमर्यादित", en: "Everything unlimited" },
      { mr: "पर्सनलाइज्ड मॅचमेकर असिस्टन्स", en: "Personalized matchmaker" },
      { mr: "प्रोफाईल हायलाईट (टॉप रिझल्ट)", en: "Profile highlight (top result)" },
      { mr: "मॅरेज कौन्सिलिंग सेशन", en: "Marriage counseling session" },
    ],
    disabled: [],
    extra: [],
  },
]

export default function PremiumPage() {
  const { locale } = useI18n()
  const router = useRouter()
  const { executeWithGate, isProcessing } = usePaymentGate()

  return (
    <MainLayout>
      <div className="relative">
        <button onClick={() => router.back()}
          className="absolute top-4 left-4 z-20 flex items-center gap-1 text-white/80 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          <span className="text-sm font-medium hidden md:inline">{locale === "mr" ? "मागे" : "Back"}</span>
        </button>
      </div>
      <div className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464699575480-3c0e5c77f6b5?w=1600&q=80')" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-[#9B1B30]/80 via-[#D4AF37]/70 to-[#9B1B30]/90" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FFFAFA]" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-white font-label-md mb-4">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            {locale === "mr" ? "प्रीमियम सदस्यत्व" : "Premium Membership"}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-3">
            {locale === "mr" ? "प्रीमियम प्लॅन्स निवडा" : "Choose Your Plan"}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/80 text-lg max-w-2xl mx-auto">
            {locale === "mr"
              ? "तुमच्यासाठी योग्य जोडीदार शोधण्यासाठी आमचे खास प्रीमियम प्लॅन्स निवडा आणि आजच प्रवासाची सुरुवात करा."
              : "Choose our premium plans to find the perfect partner and start your journey today."}
          </motion.p>
        </div>
      </div>
      <div className="min-h-screen pb-24 bg-mandala-ornamental">
        <div className="ornamental-corner-tl" /><div className="ornamental-corner-br" />
        <div className="px-gutter max-w-container mx-auto -mt-8 relative z-20">

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                  plan.popular
                    ? "scale-105 z-10 shadow-xl border-2 border-transparent bg-surface-container-low"
                    : "border border-outline-variant/30 bg-surface-container-low"
                }`}
                style={plan.popular ? {
                  borderImage: "linear-gradient(to bottom right, #D4AF37, #FFD700, #B8860B) 1",
                } : {}}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] to-[#D4AF37] text-white px-6 py-1 rounded-full text-label-md font-bold shadow-md whitespace-nowrap">
                    {locale === "mr" ? "शिफारस केलेले" : "Recommended"}
                  </div>
                )}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-headline-md text-headline-md ${plan.popular ? "text-primary" : "text-on-surface-variant"}`}>
                      {plan.name}
                    </h3>
                    {plan.popular && (
                      <span className="material-symbols-outlined text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className={`text-headline-lg font-bold ${plan.popular ? "text-primary" : "text-secondary"}`}>{plan.price}</span>
                    <span className="text-caption text-on-surface-variant">{plan.period}</span>
                  </div>
                </div>
                <div className="space-y-4 flex-grow mb-8">
                  {plan.features.map((f, fi) => (
                    <div key={fi} className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-emerald-growth text-[20px]">check_circle</span>
                      <p className="font-body-md text-body-md text-on-surface">{locale === "mr" ? f.mr : f.en}</p>
                    </div>
                  ))}
                  {plan.extra.map((f, fi) => (
                    <div key={`extra-${fi}`} className="flex items-start gap-3 opacity-40">
                      <span className="material-symbols-outlined text-[20px]">block</span>
                      <p className="font-body-md text-body-md text-on-surface">{locale === "mr" ? f.mr : f.en}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => executeWithGate(async () => { toast.success("Premium activated!") })}
                  disabled={isProcessing}
                  className={`w-full py-3 px-6 rounded-lg font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/30 hover:brightness-110"
                      : "border-2 border-secondary text-secondary hover:bg-secondary hover:text-white"
                  }`}
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {locale === "mr" ? "खरेदी करा" : "Buy Now"}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <section className="bg-surface-container-low rounded-3xl p-10 relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { icon: "verified_user", title: locale === "mr" ? "१००% सुरक्षित" : "100% Secure", desc: locale === "mr" ? "तुमची माहिती पूर्णपणे सुरक्षित आहे." : "Your information is completely secure." },
                { icon: "groups", title: locale === "mr" ? "मोठी कम्युनिटी" : "Large Community", desc: locale === "mr" ? "खानदेशातील हजारो स्थळे उपलब्ध." : "Thousands of profiles from Khandesh." },
                { icon: "support_agent", title: locale === "mr" ? "२४/७ सपोर्ट" : "24/7 Support", desc: locale === "mr" ? "आम्ही तुमच्या मदतीसाठी नेहमी उपलब्ध आहोत." : "We're always here to help." },
              ].map((b, i) => (
                <div key={i}>
                  <span className="material-symbols-outlined text-primary text-[48px] mb-4">{b.icon}</span>
                  <h4 className="font-headline-md text-headline-md text-primary mb-2">{b.title}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">{b.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  )
}
