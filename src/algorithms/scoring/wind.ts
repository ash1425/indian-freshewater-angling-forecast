export interface ScoreResult {
  score: number
  label: string
  description: string
}

export function calculateWindScore(windSpeed: number): ScoreResult {
  if (windSpeed >= 8 && windSpeed <= 12) {
    return { score: 100, label: 'Optimal', description: 'Moderate wind oxygenates water and moves bait' }
  }
  if (windSpeed >= 5 && windSpeed < 8) {
    return { score: 80, label: 'Good', description: 'Good conditions' }
  }
  if (windSpeed > 12 && windSpeed <= 18) {
    return { score: 70, label: 'Moderate', description: 'Acceptable conditions' }
  }
  if (windSpeed < 5) {
    return { score: 65, label: 'Calm', description: 'Calm conditions - fish may be picky' }
  }
  if (windSpeed > 18 && windSpeed <= 25) {
    return { score: 45, label: 'Strong', description: 'Difficult conditions - use heavier weights' }
  }
  if (windSpeed > 25) {
    return { score: 20, label: 'Very Strong', description: 'Not recommended for fishing' }
  }
  return { score: 60, label: 'Light', description: 'Light breeze' }
}

export function getWindAdvice(windSpeed: number): string {
  if (windSpeed > 20) return 'High winds - fish deeper, use heavier weights'
  return ''
}
