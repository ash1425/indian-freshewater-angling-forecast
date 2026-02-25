export interface ScoreResult {
  score: number
  label: string
  description: string
}

// Overcast is strongly preferred in tropical India – it reduces UV stress on fish,
// keeps water temperature lower, and diffuses light so fish feed throughout the day
// rather than only at dawn/dusk.
// Clear skies are not disastrous but restrict good fishing to the early morning
// and evening windows.
export function calculateCloudScore(cloudCover: number): ScoreResult {
  if (cloudCover >= 60) {
    return { score: 100, label: 'Overcast', description: 'Overcast – fish confident and feeding throughout the day' }
  }
  if (cloudCover >= 40) {
    return { score: 90, label: 'Mostly Cloudy', description: 'Mostly cloudy – excellent varied light conditions' }
  }
  if (cloudCover >= 20) {
    return { score: 80, label: 'Partly Cloudy', description: 'Partly cloudy – good overall conditions' }
  }
  if (cloudCover >= 10) {
    return { score: 70, label: 'Mostly Clear', description: 'Mostly clear – fish more cautious; use stealth' }
  }
  return { score: 65, label: 'Clear', description: 'Clear skies – restrict fishing to dawn and dusk windows' }
}

export function getCloudAdvice(cloudCover: number): string {
  if (cloudCover >= 60) return 'Overcast sky – fish active throughout the day, not just at dawn/dusk'
  if (cloudCover < 15) return 'Clear sky – bright conditions; fish move to shade or deeper water by 8 AM'
  return ''
}
