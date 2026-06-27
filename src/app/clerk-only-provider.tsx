"use client"

import { ReactNode } from "react"
import { ClerkProvider } from "@clerk/nextjs"

const appearance = {
  variables: {
    colorPrimary: "#FF21A5",
    colorText: "#1b1c1c",
    colorBackground: "#FCF4F8",
    colorInputBackground: "#F5C6E4",
    colorInputText: "#1b1c1c",
    borderRadius: "0.75rem",
    fontFamily: "'Manrope', 'Noto Sans Devanagari', sans-serif",
  },
  elements: {
    card: "shadow-elevated border-0",
    socialButtonsBlockButton: "border border-[#E4E2E1] hover:bg-[#F6F3F2] text-sm",
    formFieldInput: "border-[#E4E2E1] bg-[#F5C6E4] rounded-lg",
    footerActionLink: "text-[#FF21A5] hover:underline",
  },
}

export default function ClerkOnlyProvider({ children }: { children: ReactNode }) {
  return <ClerkProvider appearance={appearance}>{children}</ClerkProvider>
}
