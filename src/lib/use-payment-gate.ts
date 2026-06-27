"use client"

import { useState, useCallback } from "react"
import { useAuthStore } from "@/store/auth-store"
import toast from "react-hot-toast"
import { useI18n } from "@/lib/i18n"

interface PaymentGateOptions {
  amount?: number // in paise (default ₹499 = 49900)
  onSuccess?: () => void
}

interface PaymentGateResult {
  /** Call this with the action to gate behind premium */
  executeWithGate: (action: () => Promise<void>, actionType?: string, targetUserId?: string) => Promise<void>
  isProcessing: boolean
}

/**
 * usePaymentGate — wraps an action behind a premium check.
 * If the user is already premium, the action runs immediately.
 * If not, it opens the Razorpay checkout dialog. On successful payment
 * (including server-side verification), it upgrades the user locally and runs the action.
 */
export function usePaymentGate(options: PaymentGateOptions = {}): PaymentGateResult {
  const { t } = useI18n()
  const { user, setUser } = useAuthStore()
  const [isProcessing, setIsProcessing] = useState(false)

  const executeWithGate = useCallback(
    async (action: () => Promise<void>, actionType?: string, targetUserId?: string) => {
      if (isProcessing) return

      // If user is already premium, run the action directly
      if (user?.isPremium) {
        await action()
        return
      }

      setIsProcessing(true)

      try {
        // Step 1: Create a Razorpay order
        const orderRes = await fetch("/api/payments/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user?.id }),
        })

        if (!orderRes.ok) {
          const err = await orderRes.json()
          throw new Error(err.error || "Failed to create payment order")
        }

        const { orderId, amount, currency } = await orderRes.json()

        // Step 2: Load Razorpay checkout script if not already loaded
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

        // Step 3: Open Razorpay checkout
        const result = await new Promise<{ razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }>(
          (resolve, reject) => {
            const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ""
            if (!razorpayKey) {
              reject(new Error("Razorpay key is not configured"))
              return
            }

            const options = {
              key: razorpayKey,
              amount,
              currency,
              name: "Khandesh Vivah",
              description: "Premium Membership",
              order_id: orderId,
              prefill: {
                contact: user?.mobile || "",
                email: user?.email || "",
              },
              theme: {
                color: "#FF21A5",
              },
              handler: function (response: any) {
                resolve({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                })
              },
              modal: {
                ondismiss: function () {
                  reject(new Error("Payment cancelled"))
                },
              },
            }

            const rzp = new (window as any).Razorpay(options)
            rzp.open()
          },
        )

        // Step 4: Verify payment on the server
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: result.razorpay_order_id,
            razorpay_payment_id: result.razorpay_payment_id,
            razorpay_signature: result.razorpay_signature,
            userId: user?.id,
            actionType,
            targetUserId,
          }),
        })

        if (!verifyRes.ok) {
          const err = await verifyRes.json()
          throw new Error(err.error || "Payment verification failed")
        }

        // Step 5: Update local user state to premium
        if (user && setUser) {
          setUser({ ...user, isPremium: true, membershipTier: "PREMIUM" as any })
        }

        toast.success(t("premium.paymentSuccess") || "Payment successful! Premium activated.")

        // Step 6: Execute the intended action
        if (actionType === "send_interest" || actionType === "send_message") {
          // The server already handled the action in the verify step
          options.onSuccess?.()
        } else {
          await action()
        }
      } catch (err: any) {
        if (err.message === "Payment cancelled") {
          // User closed the Razorpay dialog — don't show an error toast
          return
        }
        toast.error(err.message || "Something went wrong")
        throw err
      } finally {
        setIsProcessing(false)
      }
    },
    [user, setUser, isProcessing, t, options.onSuccess],
  )

  return { executeWithGate, isProcessing }
}
