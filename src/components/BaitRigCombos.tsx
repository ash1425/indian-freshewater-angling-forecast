import type { BaitRigCombo } from '../types/index.ts'
import { t } from '../i18n/useTranslation.ts'
import styles from './BaitRigCombos.module.css'

interface BaitRigCombosProps {
  combos: BaitRigCombo[]
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#16a34a'
  if (score >= 60) return '#22c55e'
  if (score >= 40) return '#eab308'
  return '#ef4444'
}

export function BaitRigCombos({ combos }: BaitRigCombosProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{t('bestBaitRigCombinations')}</h3>
      <ul className={styles.list}>
        {combos.map((combo, index) => (
          <li key={index} className={styles.item}>
            <div className={styles.header}>
              <span className={styles.rank}>#{index + 1}</span>
              <span
                className={styles.score}
                style={{ backgroundColor: getScoreColor(combo.combinedScore) }}
              >
                {combo.combinedScore}
              </span>
            </div>
            <div className={styles.details}>
              <span className={styles.bait}>{combo.bait.name}</span>
              <span className={styles.plus}>+</span>
              <span className={styles.rig}>{combo.rig.name}</span>
            </div>
            <div className={styles.reason}>{combo.bait.reason}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
