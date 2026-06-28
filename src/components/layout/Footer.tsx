"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="mt-auto border-t border-[#E4E2E1] bg-[#FFFEF2]">
      <div className="mx-auto max-w-container px-4 py-12 md:px-6 lg:px-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Heart className="h-6 w-6 text-[#8f4e00]" />
              <span className="text-xl font-extrabold text-[#8f4e00] font-heading">खांदेश विवाह</span>
            </div>
            <p className="mb-4 text-sm italic text-[#887364]">{t("footer.tagline")}</p>
            <p className="text-xs text-[#887364]">{t("footer.copyright")}</p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#435b9f]">{t("footer.about")}</h4>
            <ul className="space-y-2 text-sm text-[#554336]">
              <li><Link href="/about" className="transition-colors hover:text-[#8f4e00]">{t("nav.about")}</Link></li>
              <li><Link href="/blog" className="transition-colors hover:text-[#8f4e00]">{t("nav.blog")}</Link></li>
              <li><Link href="/success-stories" className="transition-colors hover:text-[#8f4e00]">{t("nav.successStories")}</Link></li>
              <li><Link href="/help" className="transition-colors hover:text-[#8f4e00]">{t("nav.help")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#435b9f]">{t("common.support")}</h4>
            <ul className="space-y-2 text-sm text-[#554336]">
              <li><Link href="/contact" className="transition-colors hover:text-[#8f4e00]">{t("nav.contact")}</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-[#8f4e00]">{t("footer.privacy")}</Link></li>
              <li><Link href="/terms" className="transition-colors hover:text-[#8f4e00]">{t("footer.terms")}</Link></li>
              <li><Link href="/refund" className="transition-colors hover:text-[#8f4e00]">{t("footer.refund")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#435b9f]">{t("nav.contact")}</h4>
            <ul className="space-y-3 text-sm text-[#554336]">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#8f4e00]" /> +91-XXXXX XXXXX</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#8f4e00]" /> info@khandeshvivah.com</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#8f4e00]" /> Jalgaon, Maharashtra</li>
            </ul>
            <div className="mt-4 flex gap-3">
              <Link href="#" className="rounded-full bg-[#F0EDED] p-2 transition-colors hover:bg-[#8f4e00]/20"><Facebook className="h-4 w-4 text-[#554336]" /></Link>
              <Link href="#" className="rounded-full bg-[#F0EDED] p-2 transition-colors hover:bg-[#8f4e00]/20"><Twitter className="h-4 w-4 text-[#554336]" /></Link>
              <Link href="#" className="rounded-full bg-[#F0EDED] p-2 transition-colors hover:bg-[#8f4e00]/20"><Instagram className="h-4 w-4 text-[#554336]" /></Link>
              <Link href="#" className="rounded-full bg-[#F0EDED] p-2 transition-colors hover:bg-[#8f4e00]/20"><Youtube className="h-4 w-4 text-[#554336]" /></Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
