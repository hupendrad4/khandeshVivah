"use client"

import { ReactNode } from "react"
import { ClerkProvider } from "@clerk/nextjs"

const appearance = {
  variables: {
    colorPrimary: "#9B1B30",
    colorText: "#1b1c1c",
    colorBackground: "#FFFAFA",
    colorInputBackground: "#FFF5F5",
    colorInputText: "#1b1c1c",
    borderRadius: "0.75rem",
    fontFamily: "'Manrope', 'Noto Sans Devanagari', sans-serif",
  },
  elements: {
    card: "shadow-elevated border-0",
    socialButtonsBlockButton: "border border-[#E8B8BC] hover:bg-[#FFF5F5] text-sm",
    formFieldInput: "border-[#E8B8BC] bg-[#FFF5F5] rounded-lg",
    footerActionLink: "text-[#9B1B30] hover:underline",
  },
}

export default function ClerkOnlyProvider({ children }: { children: ReactNode }) {
  return <ClerkProvider appearance={appearance}>{children}</ClerkProvider>
}
