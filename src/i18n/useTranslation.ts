import { translations, type Language, type TranslationKey } from './translations.ts'

function getInitialLanguage(): Language {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const urlLang = params.get('lang')
    if (urlLang && urlLang in translations) {
      localStorage.setItem('language', urlLang)
      return urlLang as Language
    }

    const saved = localStorage.getItem('language') as Language
    if (saved && saved in translations) {
      return saved
    }
    const browserLang = navigator.language.split('-')[0]
    if (browserLang in translations) {
      return browserLang as Language
    }
  }
  return 'en'
}

export const currentLanguage = getInitialLanguage()

export function t(key: TranslationKey): string {
  return translations[currentLanguage][key] || translations.en[key] || key
}

export function setLanguage(lang: Language) {
  localStorage.setItem('language', lang)
  const url = new URL(window.location.href)
  url.searchParams.set('lang', lang)
  window.location.href = url.toString()
}
