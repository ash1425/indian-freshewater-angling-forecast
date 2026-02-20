export interface ScoreResult {
  score: number
  label: string
  description: string
}

export function calculateCloudScore(cloudCover: number): ScoreResult {
  if (cloudCover >= 60) {
    return { score: 100, label: 'Overcast', description: 'Fish more confident in low light' }
  }
  if (cloudCover >= 40) {
    return { score: 90, label: 'Mostly Cloudy', description: 'Good conditions with varied light' }
  }
  if (cloudCover >= 20) {
    return { score: 80, label: 'Partly Cloudy', description: 'Normal fishing conditions' }
  }
  if (cloudCover >= 10) {
    return { score: 70, label: 'Mostly Clear', description: 'Bright conditions - use stealth' }
  }
  return { score: 60, label: 'Clear', description: 'Bright conditions - fish more cautious' }
}

export function getCloudAdvice(cloudCover: number): string {
  if (cloudCover >= 60) return 'Overcast - fish more active throughout the day'
  return ''
}
