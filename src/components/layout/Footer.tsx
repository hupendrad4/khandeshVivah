"use client"

import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="mt-auto border-t border-outline-variant/20 bg-background-cream">
      <div className="mx-auto max-w-container px-4 py-12 md:px-gutter">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-extrabold text-primary font-heading">खांदेश विवाह</span>
            </div>
            <p className="mb-4 text-sm italic text-outline">{t("footer.tagline")}</p>
            <p className="text-xs text-outline">{t("footer.copyright")}</p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#D4AF37]">{t("footer.about")}</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><Link href="/about" className="transition-colors hover:text-primary">{t("nav.about")}</Link></li>
              <li><Link href="/success-stories" className="transition-colors hover:text-primary">{t("nav.successStories")}</Link></li>
              <li><Link href="/help" className="transition-colors hover:text-primary">{t("nav.help")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#D4AF37]">{t("common.support")}</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><Link href="/contact" className="transition-colors hover:text-primary">{t("nav.contact")}</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-primary">{t("footer.privacy")}</Link></li>
              <li><Link href="/terms" className="transition-colors hover:text-primary">{t("footer.terms")}</Link></li>
              <li><Link href="/refund" className="transition-colors hover:text-primary">{t("footer.refund")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#D4AF37]">{t("nav.contact")}</h4>
            <ul className="space-y-3 text-sm text-on-surface-variant">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +91-XXXXX XXXXX</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> info@khandeshvivah.com</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Jalgaon, Maharashtra</li>
            </ul>
            <div className="mt-4 flex gap-3">
              <Link href="#" className="rounded-full bg-surface-container p-2 transition-colors hover:bg-primary/20"><Facebook className="h-4 w-4 text-on-surface-variant" /></Link>
              <Link href="#" className="rounded-full bg-surface-container p-2 transition-colors hover:bg-primary/20"><Twitter className="h-4 w-4 text-on-surface-variant" /></Link>
              <Link href="#" className="rounded-full bg-surface-container p-2 transition-colors hover:bg-primary/20"><Instagram className="h-4 w-4 text-on-surface-variant" /></Link>
              <Link href="#" className="rounded-full bg-surface-container p-2 transition-colors hover:bg-primary/20"><Youtube className="h-4 w-4 text-on-surface-variant" /></Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
