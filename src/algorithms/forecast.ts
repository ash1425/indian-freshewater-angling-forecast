import type { WeatherData, FishingConditions, BaitRigCombo, FishSpecies, HourlyWeatherData, HourlyFishingForecast } from '../types/index.ts'
import {
  calculateTemperatureScore,
  calculatePressureScore,
  calculateWindScore,
  calculateMoonScore,
  calculateCloudScore,
  getTemperatureAdvice,
  getPressureAdvice,
  getWindAdvice,
  getMoonAdvice,
  getCloudAdvice,
} from './scoring/index.ts'
import { DEFAULT_WEIGHTS, HOURLY_WEIGHTS, type ScoreWeights } from './weights.ts'
import { getBestFishingTimes, getTimeMultiplier } from './time.ts'
import { getBaitsForSpecies } from './baits.ts'
import { getRigsForSpecies } from './rigs.ts'

function combineScores(
  tempScore: number,
  pressureScore: number,
  windScore: number,
  moonScore: number,
  cloudScore: number,
  weights: ScoreWeights
): number {
  return Math.round(
    tempScore * weights.temperature +
    pressureScore * weights.pressure +
    windScore * weights.wind +
    moonScore * weights.moon +
    cloudScore * weights.cloud
  )
}

function calculateBestCombos(baits: ReturnType<typeof getBaitsForSpecies>, rigs: ReturnType<typeof getRigsForSpecies>): BaitRigCombo[] {
  const combos: BaitRigCombo[] = []
  const baitWeight = 0.6
  const rigWeight = 0.4

  for (const bait of baits) {
    for (const rig of rigs) {
      const combinedScore = Math.round(bait.score * baitWeight + rig.score * rigWeight)
      combos.push({ bait, rig, combinedScore })
    }
  }

  return combos.sort((a, b) => b.combinedScore - a.combinedScore).slice(0, 5)
}

// Indian seasonal modifier based on monsoon cycles.
// Month is 1-based (1 = January … 12 = December).
//
// Post-monsoon Oct–Nov: best fishing – ideal temperature, stable clearing water, good oxygen.
// SW Monsoon Jun–Sep:  falling pressure triggers feeding; +5 overall.
// NE Monsoon/Winter Dec–Feb: neutral; carps slow but acceptable.
// Pre-monsoon Mar–May: worst season – extreme heat, low water, fish lethargic.
function getSeasonalModifier(month: number): { modifier: number; note: string | null } {
  if (month === 10 || month === 11) {
    return {
      modifier: 10,
      note: 'Post-monsoon season (Oct–Nov) – best fishing period in India; ideal temperature and clear oxygenated water',
    }
  }
  if (month >= 6 && month <= 9) {
    return {
      modifier: 5,
      note: 'Monsoon season (Jun–Sep) – falling pressure triggers aggressive feeding; avoid fishing during heavy downpours',
    }
  }
  if (month === 12 || month <= 2) {
    return {
      modifier: 0,
      note: null,
    }
  }
  // March – May (pre-monsoon / peak summer)
  return {
    modifier: -10,
    note: 'Pre-monsoon summer (Mar–May) – extreme heat makes midday fishing poor; restrict to early morning (5–8 AM) and evening (5–7 PM)',
  }
}

// Precipitation scoring tuned for Indian freshwater conditions.
// Light rain: excellent – surface disturbance, insects falling, fresh oxygen.
// Heavy rain: poor – dangerous conditions, extreme turbidity.
function getPrecipitationAdvice(precipitation: number): string | null {
  if (precipitation >= 10) return 'Heavy rainfall – high turbidity and strong currents; consider postponing'
  if (precipitation >= 5) return 'Moderate rain – fish feeding but casting difficult; use heavier weights'
  if (precipitation >= 1) return 'Light rain – excellent conditions! Fish feeding actively near the surface'
  return null
}

function getPrecipitationModifier(precipitation: number): number {
  if (precipitation >= 10) return -15
  if (precipitation >= 5) return -5
  if (precipitation >= 1) return 8
  return 0
}

export function calculateFishingForecast(
  weather: WeatherData,
  species: FishSpecies = 'otherCarps'
): FishingConditions {
  const tempResult = calculateTemperatureScore(weather.temperature)
  const pressureResult = calculatePressureScore(weather.pressure, weather.pressureTrend)
  const windResult = calculateWindScore(weather.windSpeed)
  const moonResult = calculateMoonScore(weather.moonPhase, weather.moonIllumination)
  const cloudResult = calculateCloudScore(weather.cloudCover)

  const weatherScore = combineScores(
    tempResult.score,
    pressureResult.score,
    windResult.score,
    moonResult.score,
    cloudResult.score,
    DEFAULT_WEIGHTS
  )

  const suggestedBaits = getBaitsForSpecies(species, weather.temperature, weather.pressure)
  const suggestedRigs = getRigsForSpecies(species, weather.windSpeed)
  const bestCombos = calculateBestCombos(suggestedBaits, suggestedRigs)

  const notes: string[] = []
  const adviceFunctions = [
    getTemperatureAdvice(weather.temperature),
    getPressureAdvice(weather.pressure, weather.pressureTrend),
    getWindAdvice(weather.windSpeed),
    getMoonAdvice(weather.moonIllumination),
    getCloudAdvice(weather.cloudCover),
  ]
  adviceFunctions.forEach(advice => {
    if (advice) notes.push(advice)
  })

  // Seasonal modifier – derived from the sunrise date
  const month = new Date(weather.sunrise).getMonth() + 1
  const seasonal = getSeasonalModifier(month)
  if (seasonal.note) notes.push(seasonal.note)

  // Precipitation modifier
  const precipAdvice = getPrecipitationAdvice(weather.precipitation)
  if (precipAdvice) notes.push(precipAdvice)
  const precipModifier = getPrecipitationModifier(weather.precipitation)

  const conditionsScore = weatherScore
  const baitRigScore = bestCombos[0]?.combinedScore ?? 70

  const optimalCount = [
    tempResult.score >= 90,
    pressureResult.score >= 90,
    windResult.score >= 80,
  ].filter(Boolean).length

  const realismPenalty = optimalCount === 3 ? 0 : (3 - optimalCount) * 5

  const overallRating = Math.max(0, Math.min(100,
    Math.round(conditionsScore * 0.5 + baitRigScore * 0.5)
    - realismPenalty
    + seasonal.modifier
    + precipModifier
  ))

  const hourlyForecasts = weather.hourly
    ? calculateHourlyForecasts(weather.hourly, weather.sunrise, weather.sunset)
    : undefined

  return {
    overallRating,
    temperatureScore: tempResult.score,
    pressureScore: pressureResult.score,
    windScore: windResult.score,
    moonScore: moonResult.score,
    sunScore: cloudResult.score,
    bestTimeOfDay: getBestFishingTimes(weather.sunrise, weather.sunset, weather.pressure, hourlyForecasts),
    suggestedBaits,
    suggestedRigs,
    bestCombos,
    targetSpecies: species,
    notes,
  }
}

export function calculateHourlyForecasts(
  hourlyWeather: HourlyWeatherData[],
  sunrise: string,
  sunset: string
): HourlyFishingForecast[] {
  const sunriseHour = new Date(sunrise).getHours()
  const sunsetHour = new Date(sunset).getHours()

  return hourlyWeather.map((hourly) => {
    const hour = new Date(hourly.time).getHours()
    const timeMultiplier = getTimeMultiplier(hour, sunriseHour, sunsetHour)

    const tempResult = calculateTemperatureScore(hourly.temperature)
    const pressureResult = calculatePressureScore(hourly.pressure)
    const windResult = calculateWindScore(hourly.windSpeed)
    const cloudResult = calculateCloudScore(hourly.cloudCover)

    const baseScore = combineScores(
      tempResult.score,
      pressureResult.score,
      windResult.score,
      75,
      cloudResult.score,
      HOURLY_WEIGHTS
    )

    const score = Math.round(baseScore * timeMultiplier.multiplier)

    return {
      time: hourly.time,
      hour,
      score: Math.min(100, Math.max(0, score)),
      temperature: hourly.temperature,
      pressure: hourly.pressure,
      windSpeed: hourly.windSpeed,
    }
  })
}
