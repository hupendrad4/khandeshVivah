"use client"

import { ReactNode } from "react"
import dynamic from "next/dynamic"
import { I18nProvider } from "@/lib/i18n"

const PK = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ""
export const isClerkConfigured = PK.startsWith("pk_") && PK.length > 40 && !PK.includes("placeholder")

const ClerkOnlyProvider = dynamic(
  () => import("./clerk-only-provider"),
  { ssr: false },
)

function NoopProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function Providers({ children, locale }: { children: ReactNode; locale?: "mr" | "en" }) {
  const Provider = isClerkConfigured ? ClerkOnlyProvider : NoopProvider

  return (
    <Provider>
      <I18nProvider initialLocale={locale}>
        {children}
      </I18nProvider>
    </Provider>
  )
}
