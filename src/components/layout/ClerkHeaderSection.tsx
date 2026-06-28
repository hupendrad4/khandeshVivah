"use client"

import Link from "next/link"
import { useUser, useClerk } from "@clerk/nextjs"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Bell, LogOut } from "lucide-react"

export default function ClerkHeaderSection() {
  const { t } = useI18n()
  const { isSignedIn, user } = useUser()
  const { signOut } = useClerk()

  if (!isSignedIn) {
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

  return (
    <>
      <Link href="/notifications">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#8f4e00]" />
        </Button>
      </Link>

      <div className="hidden items-center gap-2 md:flex">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback className="bg-[#8f4e00]/10 text-xs text-[#8f4e00]">
                {user?.firstName?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-[#1b1c1c]">{user?.firstName || t("nav.profile")}</span>
          </Button>
        </Link>
        <button onClick={() => signOut()} className="rounded-lg p-2 text-[#554336] transition-colors hover:bg-[#F6F3F2]">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </>
  )
}
