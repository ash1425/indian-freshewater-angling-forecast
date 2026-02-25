export interface ScoreResult {
  score: number
  label: string
  description: string
}

// Tuned for Indian conditions.
// Trend is MORE important than absolute value in the tropics.
// Falling pressure (monsoon onset, pre-storm) triggers aggressive feeding.
// Rising pressure pushes fish deeper and reduces surface activity.
export function calculatePressureScore(
  pressure: number,
  trend: 'rising' | 'falling' | 'stable' = 'stable'
): ScoreResult {
  let baseScore: number
  let label: string
  let description: string

  if (pressure >= 1010 && pressure <= 1018) {
    baseScore = 100
    label = 'Optimal'
    description = 'Stable normal pressure – fish comfortable and feeding'
  } else if (pressure >= 1006 && pressure < 1010) {
    baseScore = 82
    label = 'Low-Normal'
    description = 'Slightly low – fish moving toward the surface'
  } else if (pressure > 1018 && pressure <= 1022) {
    baseScore = 75
    label = 'Slightly High'
    description = 'Slight high pressure – acceptable, fish less aggressive'
  } else if (pressure >= 1002 && pressure < 1006) {
    baseScore = 68
    label = 'Low'
    description = 'Low pressure – pre-storm feeding activity likely'
  } else if (pressure > 1022 && pressure <= 1028) {
    baseScore = 50
    label = 'High'
    description = 'High pressure – fish retreating to deeper water'
  } else if (pressure >= 998 && pressure < 1002) {
    baseScore = 50
    label = 'Very Low'
    description = 'Storm approaching – short but intense feeding frenzy possible'
  } else if (pressure > 1028) {
    baseScore = 30
    label = 'Very High'
    description = 'Very high pressure – fish deep and inactive'
  } else if (pressure < 998) {
    baseScore = 25
    label = 'Extreme Low'
    description = 'Storm conditions – unsafe for fishing'
  } else {
    baseScore = 60
    label = 'Normal'
    description = 'Standard conditions'
  }

  // Trend modifier: falling pressure is the single strongest feeding trigger
  // in Indian freshwater fish (swim bladder response).
  // +15 for falling (up from +10), -8 for rising (up from -5).
  let trendModifier = 0
  if (trend === 'falling') {
    trendModifier = 15
    description += ' – pressure falling, feeding surge expected'
  } else if (trend === 'rising') {
    trendModifier = -8
    description += ' – pressure rising, fish moving deeper'
  }

  const finalScore = Math.min(100, Math.max(0, baseScore + trendModifier))
  return { score: finalScore, label, description }
}

export function getPressureAdvice(pressure: number, trend?: 'rising' | 'falling' | 'stable'): string {
  if (trend === 'falling' && pressure < 1012) return 'Falling pressure – fish are feeding aggressively! Great time to be on the water'
  if (trend === 'falling') return 'Pressure falling – expect increased feeding activity in the next few hours'
  if (pressure > 1022) return 'High pressure – fish slower; try deep bottom rigs with light presentations'
  if (pressure < 1006) return 'Low pressure – fish near surface; try surface or mid-water rigs'
  return ''
}
