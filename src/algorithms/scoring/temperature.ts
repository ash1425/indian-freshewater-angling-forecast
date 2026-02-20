export interface ScoreResult {
  score: number
  label: string
  description: string
}

export function calculateTemperatureScore(temp: number): ScoreResult {
  if (temp >= 25 && temp <= 30) {
    return { score: 100, label: 'Optimal', description: 'Perfect temperature for fishing activity' }
  }
  if (temp >= 20 && temp < 25) {
    return { score: 75, label: 'Good', description: 'Good fishing conditions' }
  }
  if (temp >= 30 && temp < 33) {
    return { score: 70, label: 'Warm', description: 'Fish are active but seek cooler water' }
  }
  if (temp >= 15 && temp < 20) {
    return { score: 55, label: 'Cool', description: 'Fish metabolism slowing down' }
  }
  if (temp >= 33 && temp < 37) {
    return { score: 40, label: 'Hot', description: 'Fish seek deeper, cooler water' }
  }
  if (temp >= 10 && temp < 15) {
    return { score: 30, label: 'Cold', description: 'Fish are sluggish' }
  }
  return { score: 15, label: 'Extreme', description: 'Very unfavorable conditions' }
}

export function getTemperatureAdvice(temp: number): string {
  if (temp > 35) return 'Very hot - fish early morning or late evening only'
  if (temp < 15) return 'Cold weather - slow down your presentation'
  return ''
}
