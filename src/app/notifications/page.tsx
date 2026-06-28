"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/MainLayout"
import { useI18n } from "@/lib/i18n"
import { Card, CardContent } from "@/components/ui/card"
import { useAuthStore } from "@/store/auth-store"
import { Heart, MessageCircle, Eye, Sparkles, Shield, CheckCheck } from "lucide-react"
import toast from "react-hot-toast"

const iconMap: Record<string, any> = {
  INTEREST: Heart,
  INTEREST_ACCEPTED: Heart,
  MESSAGE: MessageCircle,
  INTEREST_SENT: Heart,
  VIEW: Eye,
  PREMIUM: Sparkles,
  VERIFICATION: Shield,
}

const colorMap: Record<string, string> = {
  INTEREST: "text-[#8f4e00]",
  INTEREST_ACCEPTED: "text-[#50C878]",
  MESSAGE: "text-[#435b9f]",
  VIEW: "text-[#435b9f]",
  PREMIUM: "text-[#d3ae36]",
  VERIFICATION: "text-[#50C878]",
}

export default function NotificationsPage() {
  const { t, locale } = useI18n()
  const router = useRouter()
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    fetch(`/api/notifications/list?userId=${user.id}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setNotifications(d.notifications || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user?.id])

  const markAllRead = async () => {
    if (!user?.id) return
    await fetch("/api/notifications/list", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    })
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    toast.success(locale === "mr" ? "सर्व वाचले म्हणून चिन्हांकित" : "All marked as read")
  }

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <MainLayout>
      <div className="relative">
        <button onClick={() => router.back()}
          className="absolute top-4 left-4 z-20 flex items-center gap-1 text-white/80 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          <span className="text-sm font-medium hidden md:inline">{locale === "mr" ? "मागे" : "Back"}</span>
        </button>
      </div>
      <div className="relative min-h-[30vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555243896-c709bfa0b564?w=1600&q=80')" }} />
          <div className="absolute inset-0 bg-gradient-to-br from-[#8f4e00]/80 via-[#435b9f]/70 to-[#001B4D]/90" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-3">
            {locale === "mr" ? "सूचना" : "Notifications"}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/80 text-lg">{locale === "mr" ? "तुमच्या सर्व सूचना एकाच ठिकाणी" : "All your notifications in one place"}</motion.p>
        </div>
      </div>

      <div className="bg-mandala-ornamental min-h-screen">
        <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-10">
          <div className="ornamental-corner-tl" /><div className="ornamental-corner-br" />

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-royal-ink">
              {locale === "mr" ? "सूचना" : "Notifications"}
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="ml-2 text-sm bg-primary text-white px-2 py-0.5 rounded-full">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </h2>
            {notifications.some(n => !n.isRead) && (
              <button onClick={markAllRead}
                className="flex items-center gap-1 text-sm text-primary hover:text-on-primary-container transition-colors">
                <CheckCheck size={16} />
                {locale === "mr" ? "सर्व वाचले" : "Mark all read"}
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <Card key={i} className="animate-pulse bg-surface-container-low border-0"><CardContent className="p-4"><div className="h-4 bg-surface-container-low rounded w-3/4" /></CardContent></Card>)}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="mx-auto text-outline mb-4" size={48} />
              <h3 className="text-lg font-medium text-on-surface-variant">
                {locale === "mr" ? "कोणत्याही सूचना नाहीत" : "No notifications"}
              </h3>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n) => {
                const Icon = iconMap[n.type] || Bell
                const color = colorMap[n.type] || "text-on-surface-variant"
                return (
                  <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`bg-surface-container-low rounded-2xl border-0 shadow-sm transition-all ${!n.isRead ? 'ring-1 ring-primary/20' : ''}`}>
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className={`mt-1 ${color}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!n.isRead ? 'font-semibold text-royal-ink' : 'text-on-surface-variant'}`}>
                          {n.message || n.title}
                        </p>
                        <p className="text-xs text-on-surface-variant/60 mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                      {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />}
                    </CardContent>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

function Bell(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}
