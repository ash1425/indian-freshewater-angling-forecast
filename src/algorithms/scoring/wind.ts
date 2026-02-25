export interface ScoreResult {
  score: number
  label: string
  description: string
}

// Tuned for Indian freshwater reservoirs and rivers.
// 8–15 km/h is the true optimal window: oxygenates water, diffuses light,
// and moves food to feeding zones without making casting difficult.
// Dead calm (< 5 km/h) makes fish skittish – they can see everything clearly.
export function calculateWindScore(windSpeed: number): ScoreResult {
  if (windSpeed >= 8 && windSpeed <= 15) {
    return { score: 100, label: 'Optimal', description: 'Moderate wind – oxygenates water and obscures the surface' }
  }
  if (windSpeed > 5 && windSpeed < 8) {
    return { score: 80, label: 'Light Breeze', description: 'Light breeze – good conditions' }
  }
  if (windSpeed > 15 && windSpeed <= 20) {
    return { score: 70, label: 'Moderate', description: 'Moderate wind – good fishing on the leeward bank' }
  }
  if (windSpeed <= 5) {
    return { score: 55, label: 'Calm', description: 'Dead calm – fish are alert and cautious; use light tackle' }
  }
  if (windSpeed > 20 && windSpeed <= 28) {
    return { score: 40, label: 'Strong', description: 'Strong wind – use heavier weights; fish sheltered bays' }
  }
  if (windSpeed > 28) {
    return { score: 15, label: 'Very Strong', description: 'Dangerous conditions – not recommended for fishing' }
  }
  return { score: 60, label: 'Light', description: 'Light breeze' }
}

export function getWindAdvice(windSpeed: number): string {
  if (windSpeed > 28) return 'Dangerous winds – avoid open water'
  if (windSpeed > 20) return 'Strong winds – cast into the wind; fish the windward bank where food accumulates'
  if (windSpeed <= 5) return 'Dead calm – fish are easily spooked; use light line and small hooks'
  return ''
}
