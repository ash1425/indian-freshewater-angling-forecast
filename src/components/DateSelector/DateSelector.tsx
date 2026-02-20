import { t } from '../../i18n/useTranslation.ts'
import styles from './DateSelector.module.css'

interface Props {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export function DateSelector({ selectedDate, onDateChange }: Props) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dates: Date[] = []
  for (let i = 0; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    dates.push(date)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString()
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>{t('date')}</label>
      <div className={styles.dates}>
        {dates.map((date) => (
          <button
            key={date.toISOString()}
            className={`${styles.dateButton} ${isSelected(date) ? styles.selected : ''}`}
            onClick={() => onDateChange(date)}
          >
            {formatDate(date)}
          </button>
        ))}
      </div>
    </div>
  )
}
