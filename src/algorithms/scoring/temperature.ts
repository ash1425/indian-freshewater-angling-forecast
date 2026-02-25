export interface ScoreResult {
  score: number
  label: string
  description: string
}

// Tuned for Indian tropical freshwater conditions.
// Indian Major Carps (Rohu, Catla), Tilapia and Calbasu: optimal 25-30°C.
// Above 33°C fish retreat to deeper, cooler layers.
// Below 22°C metabolism slows noticeably in tropical species.
export function calculateTemperatureScore(temp: number): ScoreResult {
  if (temp >= 25 && temp <= 30) {
    return { score: 100, label: 'Optimal', description: 'Peak feeding activity for Indian carps and Tilapia' }
  }
  if (temp > 30 && temp <= 33) {
    return { score: 80, label: 'Warm', description: 'Warm but fish still actively feeding' }
  }
  if (temp >= 22 && temp < 25) {
    return { score: 80, label: 'Good', description: 'Good conditions – fish comfortable and feeding' }
  }
  if (temp > 33 && temp <= 36) {
    return { score: 60, label: 'Hot', description: 'Fish seeking cooler deeper water; early morning best' }
  }
  if (temp >= 18 && temp < 22) {
    return { score: 55, label: 'Cool', description: 'Fish metabolism slowing – slower presentations work better' }
  }
  if (temp > 36 && temp <= 39) {
    return { score: 35, label: 'Very Hot', description: 'Fish largely inactive; only dawn and dusk windows viable' }
  }
  if (temp >= 13 && temp < 18) {
    return { score: 30, label: 'Cold', description: 'Tropical species sluggish; slow bottom rigs recommended' }
  }
  if (temp > 39) {
    return { score: 15, label: 'Extreme Heat', description: 'Extreme heat – avoid midday; fish inactive' }
  }
  return { score: 15, label: 'Extreme Cold', description: 'Very unfavorable – fish barely moving' }
}

export function getTemperatureAdvice(temp: number): string {
  if (temp > 39) return 'Extreme heat – fish only at dawn or after sunset'
  if (temp > 36) return 'Very hot – restrict fishing to early morning (5–8 AM) and evening (5–7 PM)'
  if (temp > 33) return 'Hot – target shaded deep spots; fish move to cooler layers'
  if (temp < 18) return 'Cool water – slow your presentation; bottom feeding rigs more effective'
  return ''
}
