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
    <header className="sticky top-0 z-40 w-full border-b border-[#E4E2E1] bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-container items-center justify-between px-4 md:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-[#8f4e00] font-heading">खांदेश विवाह</span>
          <span className="hidden text-xs font-medium text-[#d3ae36] md:block">| Khandesh Vivah</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/search" className="text-sm font-medium text-[#554336] transition-colors hover:text-[#8f4e00]">{t("nav.search")}</Link>
          <Link href="/matches" className="text-sm font-medium text-[#554336] transition-colors hover:text-[#8f4e00]">{t("nav.matches")}</Link>
          <Link href="/success-stories" className="text-sm font-medium text-[#554336] transition-colors hover:text-[#8f4e00]">{t("nav.successStories")}</Link>
          <Link href="/premium" className="text-sm font-semibold text-[#d3ae36] transition-colors hover:text-[#FFD700]">{t("nav.premium")}</Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocale(locale === "mr" ? "en" : "mr")}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-[#554336] transition-colors hover:bg-[#F6F3F2]"
          >
            <Globe className="h-3.5 w-3.5" />
            {locale === "mr" ? "EN" : "मराठी"}
          </button>

          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-lg p-2 text-[#554336] transition-colors hover:bg-[#F6F3F2]"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {isClerkConfigured ? <ClerkHeaderSection /> : <PublicHeaderActions />}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-[#554336] md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[#E4E2E1] bg-white px-4 pb-4 pt-2 md:hidden animate-slide-down">
          <nav className="flex flex-col gap-2">
            <Link href="/search" className="rounded-lg px-3 py-2 text-sm text-[#554336] hover:bg-[#F6F3F2]">{t("nav.search")}</Link>
            <Link href="/matches" className="rounded-lg px-3 py-2 text-sm text-[#554336] hover:bg-[#F6F3F2]">{t("nav.matches")}</Link>
            <Link href="/success-stories" className="rounded-lg px-3 py-2 text-sm text-[#554336] hover:bg-[#F6F3F2]">{t("nav.successStories")}</Link>
            <Link href="/premium" className="rounded-lg px-3 py-2 text-sm font-semibold text-[#d3ae36] hover:bg-[#F6F3F2]">{t("nav.premium")}</Link>
            {isClerkConfigured ? <ClerkMobileMenu /> : <PublicMobileMenuItems />}
          </nav>
        </div>
      )}
    </header>
  )
}
