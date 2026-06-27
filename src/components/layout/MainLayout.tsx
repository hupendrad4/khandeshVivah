"use client"

import { ReactNode } from "react"
import { Header } from "./Header"
import { BottomNav } from "./BottomNav"
import { Footer } from "./Footer"
import { ToastProvider } from "@/components/ui/toast"
import { FontSwitcher } from "@/components/FontSwitcher"

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ToastProvider />
      <div className="ornamental-corner-tl" aria-hidden="true" />
      <div className="ornamental-corner-br" aria-hidden="true" />
      <div className="flex min-h-screen flex-col bg-mandala-ornamental relative z-[1]">
        <div className="ornamental-band" aria-hidden="true" />
        <Header />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
        <FontSwitcher />
      </div>
    </>
  )
}
