import { t } from '../../i18n/useTranslation.ts'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.citation}>{t('citation')}</p>
      <div className={styles.contactCard}>
        <div className={styles.avatar}>🎣</div>
        <div className={styles.contactInfo}>
          <span className={styles.name}>Ashay T</span>
          <span className={styles.title}>Angling Enthusiast</span>
          <a href="mailto:ash1425+fishing@gmail.com" className={styles.email}>ash1425+fishing@gmail.com</a>
        </div>
      </div>
      <p className={styles.builtWith}>
        Powered by OpenCode AI
      </p>
    </footer>
  )
}
