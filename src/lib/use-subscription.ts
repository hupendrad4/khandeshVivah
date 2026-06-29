"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import toast from "react-hot-toast"

export interface Plan {
  id: string
  name: string
  priceMr: string
  priceEn: string
  pricePaise: number
  periodMr: string
  periodEn: string
  durationDays: number
  features: { mr: string; en: string }[]
  popular?: boolean
}

export const plans: Plan[] = [
  {
    id: "silver",
    name: "Silver",
    priceMr: "₹१,५००",
    priceEn: "₹1,500",
    pricePaise: 150000,
    periodMr: "३ महिने",
    periodEn: "3 months",
    durationDays: 90,
    features: [
      { mr: "अमर्यादित मेसेज पाठवा", en: "Unlimited messages" },
      { mr: "५० संपर्कांचे तपशील पहा", en: "View 50 contact details" },
    ],
  },
  {
    id: "gold",
    name: "Gold",
    priceMr: "₹३,५००",
    priceEn: "₹3,500",
    pricePaise: 350000,
    periodMr: "६ महिने",
    periodEn: "6 months",
    durationDays: 180,
    popular: true,
    features: [
      { mr: "अमर्यादित मेसेज आणि चॅट", en: "Unlimited messages & chat" },
      { mr: "१५० संपर्कांचे तपशील पहा", en: "View 150 contact details" },
      { mr: "प्रोफाईल बूस्ट (दर आठवड्याला)", en: "Profile boost (weekly)" },
      { mr: "कुंडली मॅचिंग रिपोर्ट", en: "Kundali matching report" },
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    priceMr: "₹६,०००",
    priceEn: "₹6,000",
    pricePaise: 600000,
    periodMr: "१ वर्ष",
    periodEn: "1 year",
    durationDays: 365,
    features: [
      { mr: "सर्व काही अमर्यादित", en: "Everything unlimited" },
      { mr: "पर्सनलाइज्ड मॅचमेकर", en: "Personalized matchmaker" },
      { mr: "प्रोफाईल हायलाईट (टॉप रिझल्ट)", en: "Profile highlight (top result)" },
      { mr: "मॅरेज कौन्सिलिंग सेशन", en: "Marriage counseling session" },
    ],
  },
]

export type PaymentPhase = "idle" | "payment-screen" | "processing" | "success"
export type PaymentMethod = "upi" | "card" | "netbanking"

// Module-level subscription state for cross-component signaling
let _externalPremium = false
export function isExternalPremium() { return _externalPremium }
export function setExternalPremium(v: boolean) { _externalPremium = v }
let _subListeners: Array<(v: boolean) => void> = []
export function onPremiumChange(cb: (v: boolean) => void) { _subListeners.push(cb); return () => { _subListeners = _subListeners.filter(l => l !== cb) } }
function notifyPremium(v: boolean) { _subListeners.forEach(cb => cb(v)) }

export function useSubscription() {
  const { user, setUser } = useAuthStore()
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [showExpiryWarning, setShowExpiryWarning] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentPhase, setPaymentPhase] = useState<PaymentPhase>("idle")
  const [pendingPlan, setPendingPlan] = useState<Plan | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi")
  const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | null>(null)

  const daysRemaining = useCallback(() => {
    if (!user?.subscriptionEndDate) return 0
    const end = new Date(user.subscriptionEndDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }, [user?.subscriptionEndDate])

  const isSubscribed = !!user?.isPremium
  const remaining = user?.subscriptionEndDate ? daysRemaining() : 0
  const isExpiringSoon = isSubscribed && remaining > 0 && remaining <= 15

  const createDemoUser = useCallback(() => ({
    id: `demo_${Date.now()}`,
    email: "demo@khandeshvivah.com",
    mobile: "+919876543210",
    role: "USER",
    membershipTier: "NONE",
    verification: "PENDING",
    isVerified: true,
    isPremium: false,
    isProfilePublic: true,
    profileComplete: 0,
    profileViews: 0,
    createdAt: new Date().toISOString(),
  }), [])

  const handleSubscribe = useCallback((plan: Plan, onSuccess?: () => void) => {
    setPendingPlan(plan)
    setPaymentPhase("payment-screen")
    setPaymentMethod("upi")
    if (onSuccess) setOnSuccessCallback(() => onSuccess)
  }, [])

  const completePayment = useCallback(async () => {
    console.log("[subscription] completePayment called, pendingPlan:", pendingPlan?.id)
    const plan = pendingPlan
    if (!plan || isProcessing) {
      console.log("[subscription] blocked: plan=", !!plan, "isProcessing=", isProcessing)
      return
    }
    setIsProcessing(true)
    setPaymentPhase("processing")

    try {
      const currentUser = user || createDemoUser()
      console.log("[subscription] using user:", currentUser?.id, "isPremium:", currentUser?.isPremium)
      if (setUser && !user) {
        console.log("[subscription] setting demo user")
        setUser(currentUser)
      }

      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, planAmount: plan.pricePaise, planType: plan.name.toUpperCase() }),
      })

      if (!orderRes.ok) {
        const err = await orderRes.json()
        throw new Error(err.error || "Failed to create payment order")
      }

      const { orderId, simulation } = await orderRes.json()
      console.log("[subscription] order created:", orderId, "simulation:", simulation)

      let razorpayResult

      if (simulation) {
        console.log("[subscription] simulation mode, waiting 3s...")
        await new Promise((resolve) => setTimeout(resolve, 3000))
        razorpayResult = {
          razorpay_payment_id: `sim_pay_${Date.now()}`,
          razorpay_order_id: orderId,
          razorpay_signature: "sim_signature",
        }
      } else {
        if (!(window as any).Razorpay) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script")
            script.src = "https://checkout.razorpay.com/v1/checkout.js"
            script.async = true
            script.onload = () => resolve()
            script.onerror = () => reject(new Error("Failed to load Razorpay SDK"))
            document.body.appendChild(script)
          })
        }

        razorpayResult = await new Promise<{ razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }>(
          (resolve, reject) => {
            const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ""
            if (!razorpayKey) {
              reject(new Error("Razorpay key is not configured"))
              return
            }
            const opts = {
              key: razorpayKey,
              amount: plan.pricePaise,
              currency: "INR",
              name: "Khandesh Vivah",
              description: "Premium Membership",
              order_id: orderId,
              prefill: { contact: currentUser?.mobile || "", email: currentUser?.email || "" },
              theme: { color: "#8f4e00" },
              handler: (response: any) => resolve({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
              modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
            }
            const rzp = new (window as any).Razorpay(opts)
            rzp.open()
          },
        )
      }

      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: razorpayResult.razorpay_order_id,
          razorpay_payment_id: razorpayResult.razorpay_payment_id,
          razorpay_signature: razorpayResult.razorpay_signature,
          userId: currentUser.id,
          actionType: "subscribe",
          targetUserId: null,
          simulation,
          planAmount: plan.pricePaise,
          planType: plan.name.toUpperCase(),
        }),
      })

      if (!verifyRes.ok) {
        const err = await verifyRes.json()
        throw new Error(err.error || "Payment verification failed")
      }

      const endDate = new Date()
      endDate.setDate(endDate.getDate() + plan.durationDays)

      console.log("[subscription] payment verified, showing success")
      setPaymentPhase("success")
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("[subscription] activating premium user")
      const premiumUser = {
        ...currentUser,
        isPremium: true,
        membershipTier: plan.name.toUpperCase() as any,
        subscriptionEndDate: endDate.toISOString(),
      }
      if (setUser) {
        setUser(premiumUser)
      }
      setExternalPremium(true)
      notifyPremium(true)

      console.log("[subscription] closing modal, isSubscribed will be true")
      setShowModal(false)
      const msg = simulation
        ? plan.name + " plan activated!"
        : "Payment successful! " + plan.name + " activated."
      toast.success(msg)
      onSuccessCallback?.()

      // Send email notification (fire-and-forget)
      fetch("/api/email/subscription-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentUser.email,
          planName: plan.name,
          planDuration: plan.periodEn,
          planPrice: plan.priceEn,
          endDate: endDate.toLocaleDateString("en-IN", {
            day: "numeric", month: "long", year: "numeric",
          }),
        }),
      }).catch((e) => console.error("[email] failed:", e))
    } catch (err: any) {
      if (err.message === "Payment cancelled") {
        setPaymentPhase("payment-screen")
        return
      }
      console.error("Subscription error:", err)
      toast.error(err.message || "Subscription failed. Please try again.")
      setPaymentPhase("payment-screen")
    } finally {
      setIsProcessing(false)
      setPendingPlan(null)
      setOnSuccessCallback(null)
    }
  }, [isProcessing, user, setUser, pendingPlan, createDemoUser, onSuccessCallback])

  const requireSubscription = (action: () => void) => {
    if (isSubscribed) {
      action()
    } else {
      setShowModal(true)
    }
  }

  return {
    isSubscribed,
    isExpiringSoon,
    daysRemaining: remaining,
    showModal,
    setShowModal,
    showExpiryWarning,
    setShowExpiryWarning,
    isProcessing,
    paymentPhase,
    pendingPlan,
    paymentMethod,
    setPaymentMethod,
    handleSubscribe,
    completePayment,
    requireSubscription,
    plans,
  }
}
