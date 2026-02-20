import { t } from '../i18n/useTranslation.ts'
import styles from './Notes.module.css'

interface NotesProps {
  notes: string[]
}

export function Notes({ notes }: NotesProps) {
  if (notes.length === 0) return null

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t('tips')}</h3>
      <ul className={styles.list}>
        {notes.map((note, index) => (
          <li key={index} className={styles.item}>{note}</li>
        ))}
      </ul>
    </div>
  )
}
