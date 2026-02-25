import type { HourlyFishingForecast } from '../types/index.ts'

export interface TimeMultiplier {
  label: string
  multiplier: number
}

// Tuned for tropical India:
// - Early morning (sunrise to +3 hrs): strongest feeding window, coolest temps
// - Evening (sunset -2 to sunset +1): second peak, temps dropping rapidly
// - Midday (10:00–15:00): severe slump – tropical heat pushes fish deep;
//   multiplier dropped from 0.90 to 0.75 to reflect Indian summer reality
// - Late afternoon (15:00 to sunset -2): recovery window as temps ease
export function getTimeMultiplier(hour: number, sunrise: number, sunset: number): TimeMultiplier {
  if (hour >= sunrise && hour < sunrise + 3) {
    return { label: 'Early Morning', multiplier: 1.20 }
  }
  if (hour >= sunset - 2 && hour <= sunset + 1) {
    return { label: 'Evening', multiplier: 1.15 }
  }
  if (hour >= 10 && hour < 15) {
    return { label: 'Midday', multiplier: 0.75 }
  }
  if (hour >= 15 && hour < sunset - 2) {
    return { label: 'Afternoon', multiplier: 0.95 }
  }
  return { label: 'Normal', multiplier: 1.0 }
}

export function getBestFishingTimes(
  sunrise: string,
  sunset: string,
  pressure: number,
  hourlyForecasts?: HourlyFishingForecast[]
): string[] {
  if (hourlyForecasts && hourlyForecasts.length > 0) {
    return getBestTimesFromHourly(hourlyForecasts, sunrise, sunset)
  }

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

function getBestTimesFromHourly(
  hourlyForecasts: HourlyFishingForecast[],
  sunrise: string,
  sunset: string
): string[] {
  const sunriseTime = new Date(sunrise).getHours()
  const sunsetTime = new Date(sunset).getHours()

  const morningSlots = hourlyForecasts.filter(
    (h) => h.hour >= sunriseTime && h.hour < sunriseTime + 3
  )
  const eveningSlots = hourlyForecasts.filter(
    (h) => h.hour >= sunsetTime - 2 && h.hour <= sunsetTime + 1
  )

  const bestMorning = morningSlots.length > 0
    ? morningSlots.reduce((a, b) => (a.score > b.score ? a : b))
    : null
  const bestEvening = eveningSlots.length > 0
    ? eveningSlots.reduce((a, b) => (a.score > b.score ? a : b))
    : null

  const times: string[] = []

  if (bestMorning && bestMorning.score >= 30) {
    times.push(`${bestMorning.hour}:00 - ${bestMorning.hour + 1}:00 (Morning ${bestMorning.score}%)`)
  }

  if (bestEvening && bestEvening.score >= 30) {
    times.push(`${bestEvening.hour}:00 - ${bestEvening.hour + 1}:00 (Evening ${bestEvening.score}%)`)
  }

  if (bestMorning && bestEvening) {
    const usedHours = [bestMorning.hour, bestEvening.hour]
    const otherSlots = hourlyForecasts
      .filter((h) => !usedHours.includes(h.hour))
      .sort((a, b) => b.score - a.score)
    if (otherSlots.length > 0 && otherSlots[0].score >= 40) {
      const thirdSlot = otherSlots[0]
      const label = getTimeLabel(thirdSlot.hour, sunriseTime, sunsetTime)
      times.push(`${thirdSlot.hour}:00 - ${thirdSlot.hour + 1}:00 (${label} ${thirdSlot.score}%)`)
    }
  }

  if (times.length === 0) {
    times.push(`${sunriseTime}:00 - ${sunriseTime + 2}:00 (Morning)`)
    times.push(`${sunsetTime - 2}:00 - ${sunsetTime}:00 (Evening)`)
  }

  return times
}

function getTimeLabel(hour: number, sunrise: number, sunset: number): string {
  if (hour >= sunrise && hour < sunrise + 3) return 'Early Morning'
  if (hour >= sunset - 2 && hour <= sunset + 1) return 'Evening'
  if (hour >= 10 && hour < 15) return 'Midday'
  if (hour >= 15 && hour < sunset - 2) return 'Afternoon'
  return 'Day'
}
