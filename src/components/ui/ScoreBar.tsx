import { t } from '../../i18n/useTranslation.ts'
import styles from './ScoreBar.module.css'

interface ScoreBarProps {
  label: string
  score: number
  tooltipKey?: 'tempTooltip' | 'pressureTooltip' | 'windTooltip' | 'moonTooltip' | 'cloudTooltip'
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#16a34a'
  if (score >= 60) return '#22c55e'
  if (score >= 40) return '#eab308'
  return '#ef4444'
}

export function ScoreBar({ label, score, tooltipKey }: ScoreBarProps) {
  return (
    <div className={styles.scoreItem}>
      <span className={styles.scoreLabel}>{label}</span>
      <div className={styles.scoreBar}>
        <div
          className={styles.scoreFill}
          style={{ width: `${score}%`, backgroundColor: getScoreColor(score) }}
        />
      </div>
      <span className={styles.scoreValue}>
        {score}
        {tooltipKey && (
          <span className={styles.tooltip} title={t(tooltipKey)}>
            ⓘ
          </span>
        )}
      </span>
    </div>
  )
}
