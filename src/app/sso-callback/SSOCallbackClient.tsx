"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/MainLayout"

export default function SSOCallbackClient() {
  const router = useRouter()

  useEffect(() => {
    async function handleCallback() {
      try {
        const { useClerk } = await import("@clerk/nextjs")
        const clerk = useClerk()
        await clerk.handleRedirectCallback({ redirectUrl: "/dashboard" })
        router.push("/dashboard")
      } catch {
        router.push("/login")
      }
    }
    handleCallback()
  }, [router])

  return (
    <MainLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-on-surface-variant">Signing in...</p>
        </div>
      </div>
    </MainLayout>
  )
}
