"use client"

import Link from "next/link"
import { useUser, useClerk } from "@clerk/nextjs"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"

export default function ClerkHeaderSection() {
  const { t } = useI18n()
  const { isSignedIn, user } = useUser()
  const { signOut } = useClerk()

  if (!isSignedIn) {
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

  return (
    <div className="hidden items-center gap-1.5 md:flex">
      <Link href="/dashboard">
        <div className="flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-primary/5 transition-colors cursor-pointer">
          <Avatar className="h-8 w-8 ring-2 ring-primary/20">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-[#D4AF37]/10 text-sm font-semibold text-primary">
              {user?.firstName?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-base font-semibold text-on-surface-variant hover:text-primary transition-colors">
            {user?.firstName || t("nav.profile")}
          </span>
        </div>
      </Link>
      <button
        onClick={() => signOut()}
        className="rounded-lg p-2.5 text-outline hover:text-primary hover:bg-primary/5 transition-colors"
        title={t("nav.logout")}
      >
        <LogOut className="h-5 w-5" />
      </button>
    </div>
  )
}
