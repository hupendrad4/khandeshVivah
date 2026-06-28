"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useI18n } from "@/lib/i18n"
import { Home, Search, Heart, MessageCircle, User } from "lucide-react"

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useI18n()

  const tabs = [
    { href: "/home", icon: Home, label: t("nav.home") },
    { href: "/search", icon: Search, label: t("nav.search") },
    { href: "/matches", icon: Heart, label: t("nav.matches") },
    { href: "/chat", icon: MessageCircle, label: t("nav.messages") },
    { href: "/profile", icon: User, label: t("nav.profile") },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-outline-variant/10 bg-surface-white shadow-[0_-4px_20px_rgba(0,27,77,0.06)] pb-safe md:hidden">
      <div className="flex items-center justify-around py-1">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 transition-all rounded-xl min-w-[56px] ${
                isActive ? "bg-primary text-white -translate-y-1 shadow-md" : "text-outline"
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive ? "text-white" : ""}`} />
              <span className={`text-xs font-semibold ${isActive ? "text-white" : ""}`}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
