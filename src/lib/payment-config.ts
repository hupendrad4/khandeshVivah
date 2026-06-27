/**
 * Payment configuration utility
 * Detects whether Razorpay is properly configured or we're in simulation mode.
 */

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ""
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || ""

const PLACEHOLDER_IDS = [
  "placeholder",
  "rzp_test_placeholder",
  "rzp_test_your_key_here",
  "rzp_test_SIqjnGAXPtwrkh", // test key without a matching secret = simulate
]

export function isPaymentConfigured(): boolean {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) return false
  if (PLACEHOLDER_IDS.includes(RAZORPAY_KEY_SECRET)) return false
  if (RAZORPAY_KEY_SECRET.includes("placeholder")) return false
  if (RAZORPAY_KEY_SECRET.length < 10) return false
  return true
}

export function getRazorpayKeyId(): string {
  return RAZORPAY_KEY_ID
}
