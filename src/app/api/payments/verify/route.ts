import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "crypto"
import { isPaymentConfigured } from "@/lib/payment-config"

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      actionType,
      targetUserId,
      messageContent,
      simulation,
      planAmount,
      planType,
    } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const isSimulation = simulation || !isPaymentConfigured()
    const membershipTier = planType || "PREMIUM"
    const amount = planAmount ? Math.round(planAmount / 100) : 499

    if (!isSimulation) {
      // Real payment verification
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json({ error: "Missing payment verification fields" }, { status: 400 })
      }

      // Verify signature
      const body = `${razorpay_order_id}|${razorpay_payment_id}`
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(body)
        .digest("hex")

      if (expectedSignature !== razorpay_signature) {
        return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
      }
    }

    // Upgrade user to premium (skip DB in simulation mode if user doesn't exist)
    if (!isSimulation) {
      await prisma.user.update({
        where: { id: userId },
        data: { isPremium: true, membershipTier },
      })
      await prisma.payment.create({
        data: {
          userId,
          amount,
          currency: "INR",
          status: "completed",
          method: "razorpay",
          planType: membershipTier,
          transactionId: razorpay_payment_id,
        },
      })
    } else {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { isPremium: true, membershipTier },
        })
        await prisma.payment.create({
          data: {
            userId,
            amount,
            currency: "INR",
            status: "completed",
            method: "simulation",
            planType: membershipTier,
            transactionId: `sim_pay_${Date.now()}`,
          },
        })
      } catch {
        // User may not exist in DB (demo mode) — that's fine
      }
    }

    // If there's a pending action (send interest), execute it
    if (actionType === "send_interest" && targetUserId) {
      const existing = await prisma.interest.findFirst({
        where: { senderId: userId, receiverId: targetUserId },
      })
      if (!existing) {
        await prisma.interest.create({
          data: { senderId: userId, receiverId: targetUserId, status: "PENDING" },
        })
        await prisma.notification.create({
          data: {
            userId: targetUserId,
            type: "INTEREST",
            title: "New Interest",
            message: "Someone has shown interest in your profile",
          },
        })
      }
    }

    // If there's a pending message action
    if (actionType === "send_message" && targetUserId && messageContent) {
      await prisma.message.create({
        data: {
          senderId: userId,
          receiverId: targetUserId,
          content: messageContent,
        },
      })
      await prisma.notification.create({
        data: {
          userId: targetUserId,
          type: "MESSAGE",
          title: "New Message",
          message: messageContent.substring(0, 100),
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: isSimulation ? "Premium activated (simulation mode)" : "Payment verified and premium activated",
      isPremium: true,
      simulation: isSimulation,
    })
  } catch (error) {
    console.error("Verify payment error:", error)
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 })
  }
}
