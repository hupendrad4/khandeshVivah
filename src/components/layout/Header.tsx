"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { useThemeStore } from "@/store/theme-store"
import { useAuthStore } from "@/store/auth-store"
import { isClerkConfigured } from "@/app/providers"
import {
  Menu, X, Globe, Moon, Sun, Bell, Heart,
} from "lucide-react"

const ClerkHeaderSection = dynamic(
  () => import("./ClerkHeaderSection"),
  { ssr: false },
)

const ClerkMobileMenu = dynamic(
  () => import("./ClerkMobileMenu"),
  { ssr: false },
)

const navLinks = [
  { href: "/search", label: "nav.search" },
  { href: "/matches", label: "nav.matches" },
  { href: "/dashboard", label: "nav.dashboard" },
  { href: "/success-stories", label: "nav.successStories" },
  { href: "/premium", label: "nav.premium", premium: true },
]

function PublicHeaderActions() {
  const { t } = useI18n()
  return (
    <>
      <Link href="/login">
        <Button variant="default" size="default" className="hidden md:flex text-sm px-5">{t("nav.login")}</Button>
      </Link>
      <Link href="/register" className="hidden md:block">
        <Button variant="secondary" size="default" className="text-sm px-5">{t("nav.register")}</Button>
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
  const pathname = usePathname()

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
    <header className="sticky top-0 z-40 w-full bg-surface-white shadow-[0_2px_24px_rgba(155,27,48,0.08)]">
      <div className="mx-auto flex h-16 max-w-container items-center justify-between px-4 md:px-gutter">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[#9B1B30]/80 shadow-sm">
            <span className="text-white text-base font-black font-heading tracking-tight">KV</span>
          </div>
          <div>
            <span className="text-2xl font-black text-gradient font-heading tracking-tight leading-none">
              {locale === "mr" ? "खांदेश विवाह" : "Khandesh Vivah"}
            </span>
            <span className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-outline/70 leading-tight">
              {locale === "mr" ? "विवाह सेवा" : "Matrimony Services"}
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label, premium }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/")
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-2 text-base font-semibold transition-all rounded-lg ${
                  premium
                    ? "text-tertiary hover:text-tertiary/80"
                    : isActive
                      ? "text-primary bg-primary/5"
                      : "text-on-surface-variant hover:text-primary hover:bg-primary/5"
                }`}
              >
                {t(label)}
                {isActive && !premium && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-primary via-[#D4AF37] to-primary/60" />
                )}
                {premium && (
                  <span className="ml-1.5 text-[10px] font-bold text-tertiary align-super">✦</span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setLocale(locale === "mr" ? "en" : "mr")}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-outline hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <Globe className="h-4 w-4" />
            {locale === "mr" ? "EN" : "मराठी"}
          </button>

          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-lg p-2.5 text-outline hover:text-primary hover:bg-primary/5 transition-colors"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          <Link
            href="/notifications"
            className="relative rounded-lg p-2.5 text-outline hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary text-white text-[9px] font-bold px-1 shadow-sm">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          {isClerkConfigured ? <ClerkHeaderSection /> : <PublicHeaderActions />}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2.5 text-outline hover:text-primary hover:bg-primary/5 transition-colors md:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl animate-slide-in-right">
            <div className="flex items-center gap-3 px-5 h-16 border-b border-primary/10">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-[#9B1B30]/80 shadow-sm">
                <span className="text-white text-sm font-black">KV</span>
              </div>
              <span className="text-lg font-bold text-gradient">{locale === "mr" ? "मेनू" : "Menu"}</span>
              <button onClick={() => setMobileMenuOpen(false)} className="ml-auto rounded-lg p-2 text-outline hover:bg-primary/5">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-0.5 p-4 overflow-y-auto max-h-[calc(100dvh-4rem)]">
              <Link href="/search?gender=MALE" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all">
                <span className="material-symbols-outlined text-xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>male</span>
                {locale === "mr" ? "मुलांची प्रोफाइल" : "Boys Profiles"}
              </Link>
              <Link href="/search?gender=FEMALE" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all">
                <span className="material-symbols-outlined text-xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>female</span>
                {locale === "mr" ? "मुलींची प्रोफाइल" : "Girls Profiles"}
              </Link>
              <div className="border-t border-primary/10 my-2" />
              {navLinks.map(({ href, label, premium }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/")
                return (
                  <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all ${
                      premium
                        ? "text-tertiary hover:bg-tertiary/5"
                        : isActive
                          ? "text-primary bg-primary/5"
                          : "text-on-surface-variant hover:bg-primary/5 hover:text-primary"
                    }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      isActive ? "bg-primary" : premium ? "bg-tertiary" : "bg-outline"
                    }`} />
                    <span>{t(label)}</span>
                    {premium && (
                      <span className="ml-auto text-[11px] font-bold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded">PRO</span>
                    )}
                  </Link>
                )
              })}
              <div className="border-t border-primary/10 my-2" />
              {isClerkConfigured ? <ClerkMobileMenu /> : <PublicMobileMenuItems />}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
