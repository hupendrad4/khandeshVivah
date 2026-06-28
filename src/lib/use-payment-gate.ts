"use client"

import { useState, useCallback } from "react"
import { useAuthStore } from "@/store/auth-store"
import toast from "react-hot-toast"
import { useI18n } from "@/lib/i18n"

interface PaymentGateOptions {
  amount?: number
  onSuccess?: () => void
}

interface PaymentGateResult {
  executeWithGate: (action: () => Promise<void>, actionType?: string, targetUserId?: string) => Promise<void>
  isProcessing: boolean
}

export function usePaymentGate(options: PaymentGateOptions = {}): PaymentGateResult {
  const { t } = useI18n()
  const { user, setUser } = useAuthStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const ensureUser = useCallback(() => {
    if (user) return user
    const demoUser = {
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
    }
    if (setUser) setUser(demoUser)
    return demoUser
  }, [user, setUser])

  const executeWithGate = useCallback(
    async (action: () => Promise<void>, actionType?: string, targetUserId?: string) => {
      if (isProcessing) return

      const currentUser = ensureUser()

      if (currentUser?.isPremium) {
        await action()
        return
      }

      setIsProcessing(true)

      try {
        const orderRes = await fetch("/api/payments/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUser?.id }),
        })

        if (!orderRes.ok) {
          const err = await orderRes.json()
          throw new Error(err.error || "Failed to create payment order")
        }

        const { orderId, amount, currency, simulation } = await orderRes.json()

        let razorpayResult

        if (simulation) {
          await new Promise((resolve) => setTimeout(resolve, 1500))
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
                key: razorpayKey, amount, currency,
                name: "Khandesh Vivah", description: "Premium Membership",
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
            userId: currentUser?.id,
            actionType,
            targetUserId,
            simulation,
          }),
        })

        if (!verifyRes.ok) {
          const err = await verifyRes.json()
          throw new Error(err.error || "Payment verification failed")
        }

        if (currentUser && setUser) {
          setUser({ ...currentUser, isPremium: true, membershipTier: "PREMIUM" as any })
        }

        const msg = simulation
          ? "Premium activated (simulation mode)"
          : t("premium.paymentSuccess") || "Payment successful! Premium activated."
        toast.success(msg)

        if (actionType === "send_interest" || actionType === "send_message") {
          options.onSuccess?.()
        } else {
          await action()
        }
      } catch (err: any) {
        if (err.message === "Payment cancelled") return
        toast.error(err.message || "Something went wrong")
        throw err
      } finally {
        setIsProcessing(false)
      }
    },
    [user, setUser, isProcessing, t, options.onSuccess, ensureUser],
  )

  return { executeWithGate, isProcessing }
}
