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
    { href: "/chat", icon: MessageCircle, label: t("nav.chat") },
    { href: "/profile", icon: User, label: t("nav.profile") },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary/10 bg-white shadow-[0_-4px_30px_rgba(155,27,48,0.06)] pb-safe md:hidden">
      <div className="flex items-center justify-around py-1">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-0.5 px-3 pt-2 pb-1.5 transition-all rounded-xl min-w-[64px] ${
                isActive ? "text-primary" : "text-outline"
              }`}
            >
              <div className={`flex items-center justify-center w-11 h-9 rounded-xl transition-all ${
                isActive
                  ? "bg-gradient-to-b from-primary/10 to-transparent"
                  : ""
              }`}>
                <Icon className={`h-6 w-6 transition-all ${
                  isActive ? "text-primary" : ""
                }`} />
              </div>
              <span className={`text-xs font-semibold tracking-wide ${
                isActive ? "text-primary" : "text-outline"
              }`}>{label}</span>
              {isActive && (
                <span className="absolute top-0 left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary via-[#D4AF37] to-primary/60" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
