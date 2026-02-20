export interface ScoreResult {
  score: number
  label: string
  description: string
}

export function calculatePressureScore(
  pressure: number,
  trend: 'rising' | 'falling' | 'stable' = 'stable'
): ScoreResult {
  let baseScore: number
  let label: string
  let description: string

  if (pressure >= 1012 && pressure <= 1018) {
    baseScore = 100
    label = 'Optimal'
    description = 'Stable, normal pressure - fish comfortable'
  } else if (pressure >= 1008 && pressure < 1012) {
    baseScore = 80
    label = 'Good'
    description = 'Good pressure conditions'
  } else if (pressure > 1018 && pressure <= 1022) {
    baseScore = 75
    label = 'Slightly High'
    description = 'Acceptable conditions'
  } else if (pressure >= 1005 && pressure < 1008) {
    baseScore = 65
    label = 'Low'
    description = 'Falling pressure - fish may be more active'
  } else if (pressure > 1022 && pressure <= 1028) {
    baseScore = 50
    label = 'High'
    description = 'Rising pressure - fish moving to deeper water'
  } else if (pressure >= 1000 && pressure < 1005) {
    baseScore = 45
    label = 'Very Low'
    description = 'Storm approaching - expect feeding frenzy'
  } else if (pressure > 1028) {
    baseScore = 30
    label = 'Very High'
    description = 'Fish seek deeper water'
  } else if (pressure < 1000) {
    baseScore = 25
    label = 'Extreme Low'
    description = 'Storm conditions'
  } else {
    baseScore = 60
    label = 'Normal'
    description = 'Standard conditions'
  }

  let trendModifier = 0
  if (trend === 'falling') {
    trendModifier = 10
    description += ' (pressure falling)'
  } else if (trend === 'rising') {
    trendModifier = -5
    description += ' (pressure rising)'
  }

  const finalScore = Math.min(100, baseScore + trendModifier)
  return { score: finalScore, label, description }
}

export function getPressureAdvice(pressure: number, trend?: 'rising' | 'falling' | 'stable'): string {
  if (pressure > 1020) return 'High pressure - fish slower, try deeper presentations'
  if (pressure < 1010) {
    if (trend === 'falling') return 'Falling pressure - fish very active, excellent conditions!'
    return 'Low pressure - fish more active, try surface lures'
  }
  return ''
}
