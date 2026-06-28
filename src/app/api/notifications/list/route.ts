export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    if (!userId) return NextResponse.json({ notifications: [] })

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    const unread = await prisma.notification.count({
      where: { userId, isRead: false },
    })

    return NextResponse.json({ success: true, notifications, unread })
  } catch {
    return NextResponse.json({ notifications: [], unread: 0 })
  }
}

export async function PUT(req: Request) {
  try {
    const { notificationId, userId } = await req.json()
    if (notificationId) {
      await prisma.notification.update({ where: { id: notificationId }, data: { isRead: true } })
    } else if (userId) {
      await prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false })
  }
}
