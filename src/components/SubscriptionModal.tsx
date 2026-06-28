"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useI18n } from "@/lib/i18n"
import type { Plan, PaymentPhase, PaymentMethod } from "@/lib/use-subscription"

interface SubscriptionModalProps {
  open: boolean
  onClose: () => void
  plans: Plan[]
  selectedPlan: string
  onSelectPlan: (id: string) => void
  onSubscribe: (plan: Plan) => void
  isProcessing: boolean
  paymentPhase: PaymentPhase
  paymentMethod: PaymentMethod
  onPaymentMethodChange: (method: PaymentMethod) => void
  onPayNow: () => void
  titleMr?: string
  titleEn?: string
  subtitleMr?: string
  subtitleEn?: string
}

const paymentMethods: { id: PaymentMethod; labelEn: string; labelMr: string; icon: string }[] = [
  { id: "upi", labelEn: "UPI", labelMr: "UPI", icon: "qrcode" },
  { id: "card", labelEn: "Credit / Debit Card", labelMr: "क्रेडिट / डेबिट कार्ड", icon: "credit_card" },
  { id: "netbanking", labelEn: "Net Banking", labelMr: "नेट बँकिंग", icon: "account_balance" },
]

export function SubscriptionModal({
  open,
  onClose,
  plans,
  selectedPlan,
  onSelectPlan,
  onSubscribe,
  isProcessing,
  paymentPhase,
  paymentMethod,
  onPaymentMethodChange,
  onPayNow,
  titleMr,
  titleEn,
  subtitleMr,
  subtitleEn,
}: SubscriptionModalProps) {
  const { locale } = useI18n()
  const chosen = plans.find(p => p.id === selectedPlan)!

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70"
            onClick={paymentPhase === "idle" ? onClose : undefined}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200"
          >
            {paymentPhase === "success" ? (
              <SuccessView plan={chosen} locale={locale} />
            ) : paymentPhase === "payment-screen" ? (
              <PaymentScreenView
                plan={chosen}
                locale={locale}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={onPaymentMethodChange}
                onPayNow={onPayNow}
                isProcessing={isProcessing}
              />
            ) : isProcessing || paymentPhase === "processing" ? (
              <ProcessingView plan={chosen} locale={locale} />
            ) : (
              <PlanSelectionView
                plans={plans}
                selectedPlan={selectedPlan}
                onSelectPlan={onSelectPlan}
                onSubscribe={onSubscribe}
                chosen={chosen}
                onClose={onClose}
                locale={locale}
                titleMr={titleMr}
                titleEn={titleEn}
                subtitleMr={subtitleMr}
                subtitleEn={subtitleEn}
              />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function PlanSelectionView({
  plans,
  selectedPlan,
  onSelectPlan,
  onSubscribe,
  chosen,
  onClose,
  locale,
  titleMr,
  titleEn,
  subtitleMr,
  subtitleEn,
}: {
  plans: Plan[]
  selectedPlan: string
  onSelectPlan: (id: string) => void
  onSubscribe: (plan: Plan) => void
  chosen: Plan
  onClose: () => void
  locale: string
  titleMr?: string
  titleEn?: string
  subtitleMr?: string
  subtitleEn?: string
}) {
  return (
    <>
      <div className="bg-gradient-to-r from-primary to-primary-container p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-headline-lg text-headline-lg">
              {locale === "mr" ? titleMr || "प्रीमियम सबस्क्रिप्शन" : titleEn || "Premium Subscription"}
            </h2>
            <p className="text-white/80 text-sm mt-1">
              {locale === "mr"
                ? subtitleMr || "अनलॉक करा सर्व प्रीमियम सुविधा"
                : subtitleEn || "Unlock all premium features"}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <p className="text-sm text-on-surface-variant text-center">
          {locale === "mr"
            ? "तुमच्यासाठी योग्य प्लॅन निवडा आणि सर्व प्रीमियम सुविधा अनलॉक करा."
            : "Choose the right plan for you and unlock all premium features."}
        </p>

        <div className="grid grid-cols-1 gap-3">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelectPlan(plan.id)}
              className={`relative flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all ${
                selectedPlan === plan.id
                  ? "border-primary bg-primary/5"
                  : "border-outline-variant/30 hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === plan.id ? "border-primary" : "border-outline-variant"
                }`}>
                  {selectedPlan === plan.id && (
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-on-surface">{plan.name}</h3>
                  <ul className="text-xs text-on-surface-variant mt-1 space-y-0.5">
                    {plan.features.slice(0, 2).map((f, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-emerald-growth">check</span>
                        {locale === "mr" ? f.mr : f.en}
                      </li>
                    ))}
                    {plan.features.length > 2 && (
                      <li className="text-primary text-[10px]">+{plan.features.length - 2} more</li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-on-surface">{locale === "mr" ? plan.priceMr : plan.priceEn}</div>
                <div className="text-[10px] text-on-surface-variant">{locale === "mr" ? plan.periodMr : plan.periodEn}</div>
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            if (chosen) onSubscribe(chosen)
          }}
          className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-lg shadow-lg hover:bg-on-primary-container transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">lock</span>
          {locale === "mr" ? "सबस्क्राईब करा" : "Subscribe Now"} — {locale === "mr" ? chosen?.priceMr : chosen?.priceEn}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full text-sm text-on-surface-variant hover:text-primary py-2 transition-colors"
        >
          {locale === "mr" ? "नंतर निर्णय घेईन" : "Maybe Later"}
        </button>
      </div>
    </>
  )
}

function PaymentScreenView({
  plan,
  locale,
  paymentMethod,
  onPaymentMethodChange,
  onPayNow,
  isProcessing,
}: {
  plan: Plan
  locale: string
  paymentMethod: PaymentMethod
  onPaymentMethodChange: (method: PaymentMethod) => void
  onPayNow: () => void
  isProcessing: boolean
}) {
  const t = locale === "mr"

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">verified</span>
          <h3 className="font-bold text-on-surface">{t ? "सुरक्षित पेमेंट" : "Secure Payment"}</h3>
        </div>
        <span className="text-xs text-on-surface-variant flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          SSL Secure
        </span>
      </div>

      <div className="bg-primary/5 rounded-2xl p-4 mb-5 border border-primary/10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-on-surface-variant">{t ? "प्लॅन" : "Plan"}</span>
          <span className="font-bold text-on-surface">{plan.name}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-on-surface-variant">{t ? "कालावधी" : "Duration"}</span>
          <span>{t ? plan.periodMr : plan.periodEn}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-primary/20">
          <span className="font-bold">{t ? "एकूण रक्कम" : "Total Amount"}</span>
          <span className="font-bold text-lg text-primary">{t ? plan.priceMr : plan.priceEn}</span>
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs text-on-surface-variant mb-3 font-medium uppercase tracking-wider">
          {t ? "पेमेंट पद्धत निवडा" : "Select Payment Method"}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {paymentMethods.map((pm) => (
            <button
              key={pm.id}
              type="button"
              onClick={() => onPaymentMethodChange(pm.id)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
                paymentMethod === pm.id
                  ? "border-primary bg-primary/5"
                  : "border-outline-variant/30 hover:border-primary/50"
              }`}
            >
              <span className={`material-symbols-outlined ${paymentMethod === pm.id ? "text-primary" : "text-on-surface"}`}>
                {pm.icon}
              </span>
              <span className="text-[10px] text-center leading-tight text-on-surface-variant">
                {t ? pm.labelMr : pm.labelEn}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        disabled={isProcessing}
        onClick={onPayNow}
        className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-lg shadow-lg hover:bg-on-primary-container transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {isProcessing ? (
          <>{t ? "प्रक्रिया करत आहे..." : "Processing..."}</>
        ) : (
          <>
            <span className="material-symbols-outlined">lock_open</span>
            {t ? "पेमेंट करा" : "Pay Now"} — {t ? plan.priceMr : plan.priceEn}
          </>
        )}
      </button>

      <p className="text-[10px] text-on-surface-variant text-center mt-3">
        {t
          ? "तुमचे पेमेंट सुरक्षित एन्क्रिप्टेड कनेक्शनद्वारे प्रक्रिया केले जाईल."
          : "Your payment will be processed through a secure encrypted connection."}
      </p>
    </div>
  )
}

function ProcessingView({ plan, locale }: { plan: Plan; locale: string }) {
  const t = locale === "mr"

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">verified</span>
          <h3 className="font-bold text-on-surface">{t ? "सुरक्षित पेमेंट" : "Secure Payment"}</h3>
        </div>
        <span className="text-xs text-on-surface-variant flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          SSL Secure
        </span>
      </div>

      <div className="bg-primary/5 rounded-2xl p-4 mb-5 border border-primary/10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-on-surface-variant">{t ? "प्लॅन" : "Plan"}</span>
          <span className="font-bold text-on-surface">{plan.name}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-on-surface-variant">{t ? "कालावधी" : "Duration"}</span>
          <span>{t ? plan.periodMr : plan.periodEn}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-primary/20">
          <span className="font-bold">{t ? "एकूण रक्कम" : "Total Amount"}</span>
          <span className="font-bold text-lg text-primary">{t ? plan.priceMr : plan.priceEn}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 py-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">payments</span>
          </div>
        </div>
        <p className="text-sm font-medium text-on-surface">
          {t ? "पेमेंट प्रक्रिया करत आहे..." : "Processing payment..."}
        </p>
        <p className="text-xs text-on-surface-variant text-center max-w-xs">
          {t
            ? "कृपया प्रतीक्षा करा, तुमचे पेमेंट प्रक्रिया होत आहे."
            : "Please wait while your payment is being processed."}
        </p>
      </div>
    </div>
  )
}

function SuccessView({ plan, locale }: { plan: Plan; locale: string }) {
  const t = locale === "mr"

  return (
    <div className="p-6 flex flex-col items-center text-center gap-4 py-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-emerald-growth/10 flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-emerald-growth text-4xl">check_circle</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <h3 className="font-headline-lg text-headline-lg text-on-surface">
          {t ? "पेमेंट यशस्वी!" : "Payment Successful!"}
        </h3>
        <p className="text-on-surface-variant">
          {t
            ? `तुमचा ${plan.name} प्लॅन आता सक्रिय झाला आहे.`
            : `Your ${plan.name} plan is now active.`}
        </p>
        <div className="bg-primary/5 rounded-xl p-3 mt-4 border border-primary/10">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-on-surface-variant">{t ? "प्लॅन" : "Plan"}</span>
            <span className="font-bold text-on-surface">{plan.name}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-on-surface-variant">{t ? "रक्कम" : "Amount"}</span>
            <span className="font-bold text-primary">{t ? plan.priceMr : plan.priceEn}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">{t ? "कालावधी" : "Duration"}</span>
            <span>{t ? plan.periodMr : plan.periodEn}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
