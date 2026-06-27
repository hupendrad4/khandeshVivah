"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

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
    <div className="flex min-h-screen items-center justify-center bg-[#FCF4F8]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#FF21A5] border-t-transparent" />
        <p className="text-sm text-[#554336]">Signing in...</p>
      </div>
    </div>
  )
}
