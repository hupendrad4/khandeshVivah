"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { useThemeStore } from "@/store/theme-store"
import { useAuthStore } from "@/store/auth-store"
import { isClerkConfigured } from "@/app/providers"
import {
  Menu, X, Globe, Moon, Sun, Bell,
} from "lucide-react"

const ClerkHeaderSection = dynamic(
  () => import("./ClerkHeaderSection"),
  { ssr: false },
)

const ClerkMobileMenu = dynamic(
  () => import("./ClerkMobileMenu"),
  { ssr: false },
)

function PublicHeaderActions() {
  const { t } = useI18n()
  return (
    <>
      <Link href="/login">
        <Button variant="default" size="sm" className="hidden md:flex">{t("nav.login")}</Button>
      </Link>
      <Link href="/register" className="hidden md:block">
        <Button variant="secondary" size="sm">{t("nav.register")}</Button>
      </Link>
    </>
  )
}

function PublicMobileMenuItems() {
  const { t } = useI18n()
  return (
    <>
      <Link href="/login" className="mt-2"><Button variant="default" className="w-full">{t("nav.login")}</Button></Link>
      <Link href="/register"><Button variant="secondary" className="w-full">{t("nav.register")}</Button></Link>
    </>
  )
}

export function Header() {
  const { t, locale, setLocale } = useI18n()
  const { theme, setTheme } = useThemeStore()
  const { user: dbUser } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!dbUser?.id) return
    const fetchCount = () => {
      fetch(`/api/notifications/list?userId=${dbUser.id}`)
        .then(r => r.json())
        .then(d => { if (d.success) setUnreadCount(d.unread || 0) })
        .catch(() => {})
    }
    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [dbUser?.id])

  return (
    <>
    <header className="sticky top-0 z-40 w-full border-b border-outline-variant/20 bg-surface-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-container items-center justify-between px-4 md:px-gutter">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-primary font-heading">
            {locale === "mr" ? "खांदेश विवाह" : "Khandesh Vivah"}
          </span>
          <span className="hidden text-xs font-medium text-tertiary md:block">| Khandesh Vivah</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/search" className="text-sm font-medium text-on-surface-variant transition-colors hover:text-primary">{t("nav.search")}</Link>
          <Link href="/matches" className="text-sm font-medium text-on-surface-variant transition-colors hover:text-primary">{t("nav.matches")}</Link>
          <Link href="/dashboard" className="text-sm font-medium text-on-surface-variant transition-colors hover:text-primary">{t("nav.dashboard")}</Link>
          <Link href="/success-stories" className="text-sm font-medium text-on-surface-variant transition-colors hover:text-primary">{t("nav.successStories")}</Link>
          <Link href="/premium" className="text-sm font-semibold text-tertiary transition-colors hover:text-tertiary/80">{t("nav.premium")}</Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocale(locale === "mr" ? "en" : "mr")}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low"
          >
            <Globe className="h-3.5 w-3.5" />
            {locale === "mr" ? "EN" : "मराठी"}
          </button>

          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          <Link href="/notifications" className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex items-center justify-center min-w-[16px] h-[16px] rounded-full bg-primary text-white text-[8px] font-bold px-1">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          {isClerkConfigured ? <ClerkHeaderSection /> : <PublicHeaderActions />}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-on-surface-variant md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

    </header>

      {/* Mobile slide-in drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 w-72 max-w-[85vw] bg-white shadow-xl animate-slide-in-right rounded-bl-2xl">
            <div className="flex items-center justify-between border-b border-outline-variant/20 px-4 h-14">
              <span className="text-base font-bold text-primary">{locale === "mr" ? "मेनू" : "Menu"}</span>
              <button onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-low">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-4 overflow-y-auto max-h-[calc(100dvh-4rem)]">
              <Link href="/search?gender=MALE" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>male</span>
                {locale === "mr" ? "मुलांची प्रोफाइल" : "Boys Profiles"}
              </Link>
              <Link href="/search?gender=FEMALE" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>female</span>
                {locale === "mr" ? "मुलींची प्रोफाइल" : "Girls Profiles"}
              </Link>
              <Link href="/search" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">search</span>
                {t("nav.search")}
              </Link>
              <Link href="/matches" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">favorite</span>
                {t("nav.matches")}
              </Link>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">dashboard</span>
                {t("nav.dashboard")}
              </Link>
              <Link href="/success-stories" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">auto_stories</span>
                {t("nav.successStories")}
              </Link>
              <Link href="/premium" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-tertiary hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">stars</span>
                {t("nav.premium")}
              </Link>
              <div className="border-t border-outline-variant/10 my-2" />
              {isClerkConfigured ? <ClerkMobileMenu /> : <PublicMobileMenuItems />}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
