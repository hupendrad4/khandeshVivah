import { mr as localeMr } from "./locales/mr"
import { en as localeEn } from "./locales/en"

export type Locale = "mr" | "en"
export const defaultLocale: Locale = "mr"

export const locales: Record<Locale, typeof localeMr> = {
  mr: localeMr,
  en: localeEn,
}

export function getTranslations(locale: Locale) {
  return locales[locale] || locales.mr
}

export type TranslationKey = keyof typeof localeMr
