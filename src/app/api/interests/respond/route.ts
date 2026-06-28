import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { interestId, status } = await req.json()

    if (!interestId || !["ACCEPTED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const interest = await prisma.interest.findUnique({ where: { id: interestId } })
    if (!interest) return NextResponse.json({ error: "Interest not found" }, { status: 404 })

    const updated = await prisma.interest.update({
      where: { id: interestId },
      data: { status },
    })

    if (status === "ACCEPTED") {
      await prisma.notification.create({
        data: {
          userId: interest.senderId,
          type: "INTEREST_ACCEPTED",
          title: "Interest Accepted",
          message: "Your interest has been accepted! You can now chat.",
        },
      })

      await prisma.notification.create({
        data: {
          userId: interest.receiverId,
          type: "INTEREST_ACCEPTED",
          title: "Interest Accepted",
          message: "You accepted an interest. Start chatting!",
        },
      })
    }

    return NextResponse.json({ success: true, interest: updated })
  } catch (error) {
    console.error("Interest respond error:", error)
    return NextResponse.json({ error: "Failed to update interest" }, { status: 500 })
  }
}
