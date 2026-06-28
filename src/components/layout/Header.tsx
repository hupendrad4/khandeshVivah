"use client"

import { useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { useThemeStore } from "@/store/theme-store"
import { isClerkConfigured } from "@/app/providers"
import {
  Menu, X, Globe, Moon, Sun,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
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

          {isClerkConfigured ? <ClerkHeaderSection /> : <PublicHeaderActions />}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-on-surface-variant md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-outline-variant/20 bg-surface-white px-4 pb-4 pt-2 md:hidden animate-slide-down">
          <nav className="flex flex-col gap-2">
            <Link href="/search" className="rounded-lg px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container-low">{t("nav.search")}</Link>
            <Link href="/matches" className="rounded-lg px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container-low">{t("nav.matches")}</Link>
            <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container-low">{t("nav.dashboard")}</Link>
            <Link href="/success-stories" className="rounded-lg px-3 py-2 text-sm text-on-surface-variant hover:bg-surface-container-low">{t("nav.successStories")}</Link>
            <Link href="/premium" className="rounded-lg px-3 py-2 text-sm font-semibold text-tertiary hover:bg-surface-container-low">{t("nav.premium")}</Link>
            {isClerkConfigured ? <ClerkMobileMenu /> : <PublicMobileMenuItems />}
          </nav>
        </div>
      )}
    </header>
  )
}
