import { NextRequest, NextResponse } from "next/server"
import { Webhook } from "svix"
import { prisma } from "@/lib/prisma"

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ""

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    return NextResponse.json({ error: "CLERK_WEBHOOK_SECRET not configured" }, { status: 500 })
  }

  const svix_id = req.headers.get("svix-id")
  const svix_timestamp = req.headers.get("svix-timestamp")
  const svix_signature = req.headers.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 })
  }

  const body = await req.text()

  let evt: any
  try {
    const wh = new Webhook(webhookSecret)
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    })
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 })
  }

  const { type, data } = evt

  try {
    switch (type) {
      case "user.created": {
        const existing = await prisma.user.findFirst({
          where: {
            OR: [
              { clerkId: data.id },
              ...(data.email_addresses?.[0]?.email_address
                ? [{ email: data.email_addresses[0].email_address }]
                : []),
              ...(data.phone_numbers?.[0]?.phone_number
                ? [{ mobile: data.phone_numbers[0].phone_number }]
                : []),
            ],
          },
        })

        if (existing) {
          await prisma.user.update({
            where: { id: existing.id },
            data: {
              clerkId: data.id,
              ...(data.email_addresses?.[0]?.email_address && !existing.email
                ? { email: data.email_addresses[0].email_address }
                : {}),
              ...(data.phone_numbers?.[0]?.phone_number && !existing.mobile
                ? { mobile: data.phone_numbers[0].phone_number }
                : {}),
            },
          })
        } else {
          await prisma.user.create({
            data: {
              clerkId: data.id,
              email: data.email_addresses?.[0]?.email_address || null,
              mobile: data.phone_numbers?.[0]?.phone_number || null,
            },
          })
        }
        break
      }

      case "user.updated": {
        await prisma.user.updateMany({
          where: { clerkId: data.id },
          data: {
            email: data.email_addresses?.[0]?.email_address || undefined,
            mobile: data.phone_numbers?.[0]?.phone_number || undefined,
          },
        })
        break
      }

      case "user.deleted": {
        await prisma.user.updateMany({
          where: { clerkId: data.id },
          data: { isActive: false },
        })
        break
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
