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

  const conditionsScore = weatherScore
  const baitRigScore = bestCombos[0]?.combinedScore ?? 70
  
  const optimalCount = [
    tempResult.score >= 90,
    pressureResult.score >= 90,
    windResult.score >= 80,
  ].filter(Boolean).length
  
  const realismPenalty = optimalCount === 3 ? 0 : (3 - optimalCount) * 5
  
  const overallRating = Math.max(0, Math.min(100,
    Math.round(conditionsScore * 0.5 + baitRigScore * 0.5) - realismPenalty
  ))

  return {
    overallRating,
    temperatureScore: tempResult.score,
    pressureScore: pressureResult.score,
    windScore: windResult.score,
    moonScore: moonResult.score,
    sunScore: cloudResult.score,
    bestTimeOfDay: getBestFishingTimes(weather.sunrise, weather.sunset, weather.pressure),
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
