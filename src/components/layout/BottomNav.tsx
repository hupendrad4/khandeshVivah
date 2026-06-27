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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E4E2E1] bg-white pb-safe md:hidden">
      <div className="flex items-center justify-around py-2">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive ? "text-[#FF21A5]" : "text-[#887364]"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "fill-[#FF21A5]/20" : ""}`} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
