"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useI18n } from "@/lib/i18n"
import { useAuthStore } from "@/store/auth-store"
import Link from "next/link"

export function ExpiryReminderBanner() {
  const { locale } = useI18n()
  const { user } = useAuthStore()
  const [dismissed, setDismissed] = useState(false)

  if (!user?.subscriptionEndDate || !user?.isPremium) return null

  const end = new Date(user.subscriptionEndDate)
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  const daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  const hoursRemaining = Math.max(0, Math.floor(diff / (1000 * 60 * 60)))

  if (daysRemaining > 15 || dismissed) return null

  const isExpired = daysRemaining === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative px-4 py-3 text-center text-sm font-medium ${
        isExpired
          ? "bg-destructive/10 text-destructive border-b border-destructive/20"
          : daysRemaining <= 3
          ? "bg-[#9B1B30]/10 text-primary border-b border-primary/20"
          : "bg-tertiary-container/20 text-tertiary border-b border-tertiary-container/20"
      }`}
    >
      <div className="max-w-container mx-auto flex items-center justify-center gap-3 flex-wrap">
        {isExpired ? (
          <>
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
            <span>
              {locale === "mr"
                ? "तुमचे सबस्क्रिप्शन संपले आहे. कृपया नूतनीकरण करा."
                : "Your subscription has expired. Please renew."}
            </span>
            <Link
              href="/premium"
              className="inline-flex items-center gap-1 px-4 py-1.5 bg-primary text-white rounded-full text-xs font-bold hover:bg-on-primary-container transition-all"
            >
              {locale === "mr" ? "नूतनीकरण करा" : "Renew Now"}
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </>
        ) : daysRemaining <= 3 ? (
          <>
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
            <span>
              {locale === "mr"
                ? `तुमचे सबस्क्रिप्शन फक्त ${daysRemaining} दिवस शिल्लक आहे. नूतनीकरण करा!`
                : `Your subscription expires in ${daysRemaining} day${daysRemaining > 1 ? "s" : ""}. Renew now!`}
            </span>
            <Link
              href="/premium"
              className="inline-flex items-center gap-1 px-4 py-1.5 bg-primary text-white rounded-full text-xs font-bold hover:bg-on-primary-container transition-all"
            >
              {locale === "mr" ? "नूतनीकरण करा" : "Renew"}
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[20px]">schedule</span>
            <span>
              {locale === "mr"
                ? `तुमचे सबस्क्रिप्शन ${daysRemaining} दिवसात संपेल`
                : `Your subscription will expire in ${daysRemaining} days`}
            </span>
            <Link
              href="/premium"
              className="text-primary font-bold hover:underline text-xs"
            >
              {locale === "mr" ? "विस्तार करा" : "Extend"}
            </Link>
          </>
        )}
        <button onClick={() => setDismissed(true)} className="ml-auto p-1 hover:opacity-70">
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </motion.div>
  )
}
