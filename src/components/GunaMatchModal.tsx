"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useI18n } from "@/lib/i18n"
import { X } from "lucide-react"

interface GunaMatchModalProps {
  open: boolean
  onClose: () => void
  userId1: string
  userId2: string
}

const gunaLabels = {
  varna: { en: "Varna (1)", mr: "वर्ण (१)" },
  vashya: { en: "Vashya (2)", mr: "वश्य (२)" },
  tara: { en: "Tara (3)", mr: "तारा (३)" },
  yoni: { en: "Yoni (4)", mr: "योनी (४)" },
  grahaMaitri: { en: "Graha Maitri (5)", mr: "ग्रह मैत्री (५)" },
  gana: { en: "Gana (6)", mr: "गण (६)" },
  bhakoota: { en: "Bhakoota (7)", mr: "भकूट (७)" },
  nadi: { en: "Nadi (8)", mr: "नाडी (८)" },
}

export function GunaMatchModal({ open, onClose, userId1, userId2 }: GunaMatchModalProps) {
  const { locale } = useI18n()
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch("/api/horoscope/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId1, userId2 }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) setResult(data)
        else setResult(null)
      })
      .catch(() => setResult(null))
      .finally(() => setLoading(false))
  }, [open, userId1, userId2])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-5 border-b border-surface-container">
              <h2 className="font-bold text-lg text-royal-ink">
                {locale === "mr" ? "कुंडली जुळणी" : "Kundali Matching"}
              </h2>
              <button onClick={onClose} className="p-1 hover:bg-surface-container rounded-full transition-colors">
                <X className="h-5 w-5 text-on-surface-variant" />
              </button>
            </div>

            <div className="p-5">
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="h-4 bg-surface-container-low rounded w-1/3" />
                      <div className="h-4 bg-surface-container-low rounded w-16" />
                    </div>
                  ))}
                </div>
              ) : result ? (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#f1f1f1" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke={result.result.percentage >= 60 ? "#50C878" : result.result.percentage >= 40 ? "#D4AF37" : "#ef4444"} strokeWidth="3"
                          strokeDasharray={`${result.result.percentage}, 100`} strokeLinecap="round" />
                      </svg>
                      <span className="absolute text-2xl font-bold text-royal-ink">{result.result.total}/36</span>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-royal-ink">{result.result.percentage}%</p>
                    <p className={`text-sm font-medium mt-1 ${
                      result.result.percentage >= 60 ? "text-emerald-600" : result.result.percentage >= 40 ? "text-amber-600" : "text-red-500"
                    }`}>
                      {result.result.verdict}
                    </p>
                  </div>

                  {result.manglikDosha && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                      <p className="text-sm font-medium text-red-700">
                        {locale === "mr" ? "⚠ मांगलिक दोष" : "⚠ Manglik Dosha"}
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        {locale === "mr"
                          ? "एक व्यक्ती मांगलिक आहे आणि दुसरी नाही. योग्य उपाय करून घ्यावेत."
                          : "One person is Manglik and the other is not. Appropriate remedies should be performed."}
                      </p>
                    </div>
                  )}

                  {/* Detailed Breakdown */}
                  <div className="space-y-3">
                    {Object.entries(result.result.details).map(([key, val]: [string, any]) => (
                      <div key={key} className="flex items-center justify-between py-2 px-3 bg-surface-container-low rounded-xl">
                        <div>
                          <span className="font-medium text-sm text-royal-ink">
                            {(gunaLabels as any)[key]?.[locale === "mr" ? "mr" : "en"] || key}
                          </span>
                          <p className="text-[10px] text-on-surface-variant mt-0.5">{val.description}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            val.score >= val.max ? "bg-emerald-100 text-emerald-700" :
                            val.score >= val.max / 2 ? "bg-amber-100 text-amber-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {val.score}
                          </div>
                          <span className="text-xs text-on-surface-variant">/{val.max}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Profile info */}
                  {result.boy && result.girl && (
                    <div className="bg-primary-container/10 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-royal-ink">
                          {locale === "mr" ? "वर:" : "Boy:"} {result.boy.name}
                        </span>
                        <span className="text-on-surface-variant">{result.boy.nakshatra}, {result.boy.raashi}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-royal-ink">
                          {locale === "mr" ? "वधू:" : "Girl:"} {result.girl.name}
                        </span>
                        <span className="text-on-surface-variant">{result.girl.nakshatra}, {result.girl.raashi}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10">
                  <span className="material-symbols-outlined text-5xl text-outline mb-3">auto_awesome</span>
                  <p className="text-on-surface-variant">
                    {locale === "mr"
                      ? "कुंडली जुळणीसाठी दोन्ही व्यक्तींची होरास्कोप माहिती आवश्यक आहे"
                      : "Both users need horoscope information for Kundali matching"}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
