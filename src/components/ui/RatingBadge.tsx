import styles from './RatingBadge.module.css'

interface RatingBadgeProps {
  rating: number
  showLabel?: boolean
  size?: 'small' | 'medium' | 'large'
}

function getRatingColor(rating: number): string {
  if (rating >= 80) return '#16a34a'
  if (rating >= 60) return '#22c55e'
  if (rating >= 40) return '#eab308'
  return '#ef4444'
}

function getRatingLabel(rating: number): string {
  if (rating >= 80) return 'Excellent'
  if (rating >= 60) return 'Good'
  if (rating >= 40) return 'Fair'
  return 'Poor'
}

export function RatingBadge({ rating, showLabel = true, size = 'medium' }: RatingBadgeProps) {
  const color = getRatingColor(rating)
  const label = getRatingLabel(rating)

  return (
    <div
      className={`${styles.badge} ${styles[size]}`}
      style={{ backgroundColor: color }}
    >
      {rating}{showLabel && <span className={styles.label}> - {label}</span>}
    </div>
  )
}
