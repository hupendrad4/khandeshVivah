"use client"

import Link from "next/link"
import { useUser, useClerk } from "@clerk/nextjs"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"

export default function ClerkMobileMenu() {
  const { t } = useI18n()
  const { isSignedIn } = useUser()
  const { signOut } = useClerk()

  if (isSignedIn) {
    return (
      <>
        <Link href="/notifications"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-xl">notifications</span>
          {t("nav.notifications")}
        </Link>
        <Link href="/dashboard"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-xl">dashboard</span>
          {t("nav.dashboard")}
        </Link>
        <Link href="/profile"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-xl">person</span>
          {t("nav.profile")}
        </Link>
        <Link href="/settings"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-xl">settings</span>
          {t("nav.settings")}
        </Link>
        <button onClick={() => signOut()}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-outline hover:bg-red-50 hover:text-red-600 transition-colors mt-1 w-full text-left">
          <span className="material-symbols-outlined text-xl">logout</span>
          {t("nav.logout")}
        </button>
      </>
    )
  }

  return (
    <div className="flex flex-col gap-2 mt-2">
      <Link href="/login"><Button variant="default" className="w-full text-base py-3">{t("nav.login")}</Button></Link>
      <Link href="/register"><Button variant="outline" className="w-full border-primary text-primary text-base py-3">{t("nav.register")}</Button></Link>
    </div>
  )
}
