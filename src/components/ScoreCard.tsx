import { ScoreBar } from './ui/ScoreBar.tsx'
import { t } from '../i18n/useTranslation.ts'
import styles from './ScoreCard.module.css'

interface ScoreItem {
  label: string
  score: number
  tooltipKey?: 'tempTooltip' | 'pressureTooltip' | 'windTooltip' | 'moonTooltip' | 'cloudTooltip'
}

interface ScoreCardProps {
  title?: string
  scores: ScoreItem[]
}

export function ScoreCard({ title, scores }: ScoreCardProps) {
  return (
    <div className={styles.container}>
      {title && (
        <h3 className={styles.title}>
          {title}
          <span className={styles.helpTooltip} title={t('whyThisScore')}>ⓘ</span>
        </h3>
      )}
      <div className={styles.scores}>
        {scores.map((item) => (
          <ScoreBar
            key={item.label}
            label={item.label}
            score={item.score}
            tooltipKey={item.tooltipKey}
          />
        ))}
      </div>
    </div>
  )
}
