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
        <Link href="/notifications" className="rounded-lg px-3 py-2 text-sm text-[#554336] hover:bg-[#F6F3F2]">{t("nav.notifications")}</Link>
        <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm text-[#554336] hover:bg-[#F6F3F2]">{t("nav.dashboard")}</Link>
        <Link href="/profile" className="rounded-lg px-3 py-2 text-sm text-[#554336] hover:bg-[#F6F3F2]">{t("nav.profile")}</Link>
        <Link href="/settings" className="rounded-lg px-3 py-2 text-sm text-[#554336] hover:bg-[#F6F3F2]">{t("nav.settings")}</Link>
        <button onClick={() => signOut()} className="mt-2 w-full rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-[#F6F3F2]">{t("nav.logout")}</button>
      </>
    )
  }

  return (
    <>
      <Link href="/login" className="mt-2"><Button variant="default" className="w-full">{t("nav.login")}</Button></Link>
      <Link href="/register"><Button variant="secondary" className="w-full">{t("nav.register")}</Button></Link>
    </>
  )
}
