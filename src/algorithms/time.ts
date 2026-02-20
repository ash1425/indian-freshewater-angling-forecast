export interface TimeMultiplier {
  label: string
  multiplier: number
}

export function getTimeMultiplier(hour: number, sunrise: number, sunset: number): TimeMultiplier {
  if (hour >= sunrise && hour < sunrise + 3) {
    return { label: 'Early Morning', multiplier: 1.15 }
  }
  if (hour >= sunset - 2 && hour <= sunset + 1) {
    return { label: 'Evening', multiplier: 1.10 }
  }
  if (hour >= 10 && hour < 14) {
    return { label: 'Midday', multiplier: 0.90 }
  }
  return { label: 'Normal', multiplier: 1.0 }
}

export function getBestFishingTimes(sunrise: string, sunset: string, pressure: number): string[] {
  const times: string[] = []
  const sunriseTime = new Date(sunrise).getHours()
  const sunsetTime = new Date(sunset).getHours()

  times.push(`${sunriseTime}:00 - ${sunriseTime + 2}:00 (Early Morning)`)
  times.push(`${sunsetTime - 2}:00 - ${sunsetTime}:00 (Evening)`)

  if (pressure > 1015) {
    times.push('10:00 - 12:00 (Morning Feed)')
  }

  return times
}
