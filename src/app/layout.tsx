import type { Metadata } from "next"
import { Providers } from "./providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "खांदेश विवाह | Khandesh Vivah - Trusted Matrimonial Platform",
  description: "खांदेश समाजासाठी विश्वासार्ह विवाह मंच. Find your perfect life partner from the Khandesh community.",
  keywords: ["khandesh vivah", "khandesh matrimony", "marathi matrimonial", "khandeshi wedding", "jalgaon matrimony", "dhule matrimony", "nandurbar matrimony"],
  openGraph: {
    title: "खांदेश विवाह | Khandesh Vivah",
    description: "आपल्या खांदेशातील विश्वासार्ह विवाह मंच",
    type: "website",
    locale: "mr_IN",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mr" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
