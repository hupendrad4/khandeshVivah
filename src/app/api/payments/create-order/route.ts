import { NextResponse } from "next/server"
import Razorpay from "razorpay"
import { prisma } from "@/lib/prisma"
import { isPaymentConfigured } from "@/lib/payment-config"

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
})

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Verify user exists
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If Razorpay is not configured, return a simulated order
    if (!isPaymentConfigured()) {
      return NextResponse.json({
        orderId: `sim_order_${Date.now()}`,
        amount: 49900,
        currency: "INR",
        simulation: true,
      })
    }

    // Create Razorpay order for premium upgrade (₹499)
    const order = await razorpay.orders.create({
      amount: 49900, // ₹499 in paise
      currency: "INR",
      receipt: `premium_${userId}_${Date.now()}`,
      notes: {
        userId,
        type: "premium_upgrade",
      },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      simulation: false,
    })
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 })
  }
}
