"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { type Locale, locales, defaultLocale, type TranslationKey } from "@/i18n/config"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType>({
  locale: defaultLocale,
  setLocale: () => {},
  t: (key) => key,
})

export function I18nProvider({
  children,
  initialLocale = defaultLocale,
}: {
  children: ReactNode
  initialLocale?: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", newLocale)
    }
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split(".")
      let value: any = locales[locale]
      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k]
        } else {
          let fallback: any = locales[defaultLocale]
          for (const fk of keys) {
            if (fallback && typeof fallback === "object" && fk in fallback) {
              fallback = fallback[fk]
            } else {
              return key
            }
          }
          value = typeof fallback === "string" ? fallback : key
          break
        }
      }
      const result = typeof value === "string" ? value : key
      if (!params) return result
      return result.replace(/\{(\w+)\}/g, (_, name) => {
        return name in params ? String(params[name]) : `{${name}}`
      })
    },
    [locale],
  )

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
