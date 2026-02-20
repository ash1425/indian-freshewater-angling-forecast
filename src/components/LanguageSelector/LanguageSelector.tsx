import { currentLanguage, setLanguage } from '../../i18n/useTranslation.ts'
import type { Language } from '../../i18n/translations.ts'
import styles from './LanguageSelector.module.css'

const LANGUAGES: { code: Language; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
]

export function LanguageSelector() {
  return (
    <div className={styles.container}>
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          className={`${styles.button} ${currentLanguage === lang.code ? styles.selected : ''}`}
          onClick={() => setLanguage(lang.code)}
        >
          {lang.nativeLabel}
        </button>
      ))}
    </div>
  )
}
