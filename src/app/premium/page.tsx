"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MainLayout } from "@/components/layout/MainLayout"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Sparkles, Star, Shield, Zap, Crown, ChevronLeft } from "lucide-react"

const plans = [
  {
    name: "मासिक",
    nameEn: "Monthly",
    price: "₹499",
    period: "/month",
    popular: false,
    features: ["unlimitedInterests", "unlimitedMessages", "contactDetails", "verifiedBadge", "whoViewedMe"],
  },
  {
    name: "त्रैमासिक",
    nameEn: "Quarterly",
    price: "₹999",
    period: "/3 months",
    popular: true,
    features: ["unlimitedInterests", "unlimitedMessages", "contactDetails", "verifiedBadge", "whoViewedMe", "priorityListing", "profileBoost"],
  },
  {
    name: "वार्षिक",
    nameEn: "Yearly",
    price: "₹2,499",
    period: "/year",
    popular: false,
    features: ["unlimitedInterests", "unlimitedMessages", "contactDetails", "verifiedBadge", "whoViewedMe", "priorityListing", "profileBoost", "aiRecommendations", "incognitoMode", "advancedFilters", "prioritySupport"],
  },
]

export default function PremiumPage() {
  const { t, locale } = useI18n()

  return (
    <MainLayout>
      <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-10">
        <Link href="/dashboard" className="mb-4 inline-flex items-center gap-1 text-xs text-[#887364] hover:text-[#FF21A5]">
          <ChevronLeft className="h-3 w-3" /> {t("common.back")}
        </Link>

        <div className="mb-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="premium" className="mb-4"><Sparkles className="mr-1 h-4 w-4" />{t("premium.premiumBenefits")}</Badge>
            <h1 className="mb-4 text-3xl font-bold text-[#1b1c1c] md:text-4xl">{t("premium.becomePremium")}</h1>
            <p className="mx-auto max-w-2xl text-[#554336]">{t("app.tagline")}</p>
          </motion.div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                  <Badge variant="premium" className="px-4 py-1 text-sm"><Crown className="mr-1 h-4 w-4" />{t("premium.mostPopular")}</Badge>
                </div>
              )}
              <Card className={`h-full ${plan.popular ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/20 shadow-elevated" : ""}`}>
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-6 text-center">
                    <h3 className="text-xl font-bold text-[#1b1c1c]">{locale === "mr" ? plan.name : plan.nameEn}</h3>
                    <div className="mt-3 flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-extrabold text-[#002366]">{plan.price}</span>
                      <span className="text-sm text-[#887364]">{plan.period}</span>
                    </div>
                  </div>
                  <div className="mb-8 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm text-[#554336]">
                        <CheckCircle className="h-4 w-4 text-[#50C878]" />
                        {t(`premium.${f}` as any)}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant={plan.popular ? "premium" : "outline"}
                    size="lg"
                    className="w-full"
                  >
                    {t("premium.subscribeNow")}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-12">
          <div className="mx-auto max-w-2xl">
            <Card className="bg-gradient-to-r from-[#002366]/5 to-[#002366]/10 border-none">
              <CardContent className="p-6">
                <h3 className="mb-4 text-center text-lg font-bold text-[#002366]">✨ {t("premium.premiumBenefits")}</h3>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    { label: "unlimitedInterests", icon: Star },
                    { label: "unlimitedMessages", icon: Zap },
                    { label: "contactDetails", icon: Crown },
                    { label: "whoViewedMe", icon: Shield },
                  ].map((b) => (
                    <div key={b.label} className="rounded-xl bg-white p-3 text-center shadow-sm">
                      <b.icon className="mx-auto mb-1 h-5 w-5 text-[#D4AF37]" />
                      <p className="text-xs font-medium text-[#554336]">{t(`premium.${b.label}` as any)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
