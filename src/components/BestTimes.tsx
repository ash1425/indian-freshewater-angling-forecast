import { t } from '../i18n/useTranslation.ts'
import styles from './BestTimes.module.css'

interface BestTimesProps {
  times: string[]
}

export function BestTimes({ times }: BestTimesProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t('bestTimes')}</h3>
      <ul className={styles.list}>
        {times.map((time, index) => (
          <li key={index} className={styles.item}>{time}</li>
        ))}
      </ul>
    </div>
  )
}
