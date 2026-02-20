import type { WeatherData, HourlyWeatherData } from '../types/index.ts'
import type { Location } from './location.ts'

function calculateMoonPhase(date: Date): { phase: number; illumination: number } {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  let c = 0
  let e = 0
  let jd = 0
  let b = 0

  if (month < 3) {
    c = year - 1
    e = month + 12
  } else {
    c = year
    e = month
  }

  jd = Math.floor(365.25 * (c + 4716)) + Math.floor(30.6001 * (e + 1)) + day - 1524.5

  b = Math.floor((c - 100) / 400) - Math.floor((c - 100) / 100) + 2
  jd += b

  const daysSinceNew = (jd - 2451549.5) % 29.53
  const phase = daysSinceNew / 29.53
  
  const illumination = Math.round((1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100)

  return { phase, illumination }
}

function getDaysDifference(date: Date): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const targetDate = new Date(date)
  targetDate.setHours(0, 0, 0, 0)
  const diffTime = targetDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function calculatePressureTrend(hourlyData: HourlyWeatherData[]): 'rising' | 'falling' | 'stable' {
  if (hourlyData.length < 3) return 'stable'
  
  const recentPressures = hourlyData.slice(-3).map(h => h.pressure)
  const avgRecent = recentPressures.reduce((a, b) => a + b, 0) / recentPressures.length
  
  const earlierPressures = hourlyData.slice(0, Math.min(3, hourlyData.length)).map(h => h.pressure)
  const avgEarlier = earlierPressures.reduce((a, b) => a + b, 0) / earlierPressures.length
  
  const change = avgRecent - avgEarlier
  
  if (change > 3) return 'rising'
  if (change < -3) return 'falling'
  return 'stable'
}

export async function fetchWeatherData(location: Location, date: Date): Promise<WeatherData> {
  const { latitude, longitude } = location
  const { phase, illumination } = calculateMoonPhase(date)
  const daysFromNow = getDaysDifference(date)

  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', latitude.toString())
  url.searchParams.set('longitude', longitude.toString())
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean,pressure_msl_mean,wind_speed_10m_max,wind_direction_10m_dominant,cloud_cover_mean,precipitation_sum,uv_index_max,sunrise,sunset')
  url.searchParams.set('hourly', 'pressure_msl')
  url.searchParams.set('timezone', 'Asia/Kolkata')

  if (daysFromNow >= 0) {
    url.searchParams.set('forecast_days', Math.max(daysFromNow + 1, 1).toString())
  } else {
    url.searchParams.set('past_days', Math.min(-daysFromNow + 1, 7).toString())
  }

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`)
  }

  const data = await response.json()

  const index = daysFromNow >= 0 ? daysFromNow : data.daily.time.length + daysFromNow

  const hourlyPressureData: HourlyWeatherData[] = []
  if (data.hourly?.pressure_msl) {
    for (let i = 0; i < data.hourly.time.length; i++) {
      hourlyPressureData.push({
        time: data.hourly.time[i],
        temperature: 25,
        humidity: 60,
        pressure: data.hourly.pressure_msl[i] ?? 1013,
        windSpeed: 10,
        windDirection: 180,
        cloudCover: 30,
        precipitation: 0,
        uvIndex: 5,
      })
    }
  }

  const pressureTrend = calculatePressureTrend(hourlyPressureData)

  return {
    temperature: data.daily.temperature_2m_max[index] ?? data.daily.temperature_2m_min[index] ?? 25,
    humidity: data.daily.relative_humidity_2m_mean[index] ?? 60,
    pressure: data.daily.pressure_msl_mean[index] ?? 1013,
    pressureTrend,
    windSpeed: data.daily.wind_speed_10m_max[index] ?? 10,
    windDirection: data.daily.wind_direction_10m_dominant[index] ?? 180,
    cloudCover: data.daily.cloud_cover_mean[index] ?? 30,
    precipitation: data.daily.precipitation_sum[index] ?? 0,
    uvIndex: data.daily.uv_index_max[index] ?? 5,
    sunrise: data.daily.sunrise[index],
    sunset: data.daily.sunset[index],
    moonPhase: phase,
    moonIllumination: illumination,
  }
}

export async function fetchHourlyWeatherData(
  location: Location,
  date: Date
): Promise<HourlyWeatherData[]> {
  const { latitude, longitude } = location

  const targetDate = date.toISOString().split('T')[0]

  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', latitude.toString())
  url.searchParams.set('longitude', longitude.toString())
  url.searchParams.set('hourly', 'temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,wind_direction_10m,cloud_cover,precipitation')
  url.searchParams.set('start_date', targetDate)
  url.searchParams.set('end_date', targetDate)
  url.searchParams.set('timezone', 'Asia/Kolkata')

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`)
  }

  const data = await response.json()

  const hourlyData: HourlyWeatherData[] = []

  for (let i = 0; i < data.hourly.time.length; i += 2) {
    hourlyData.push({
      time: data.hourly.time[i],
      temperature: data.hourly.temperature_2m[i] ?? 25,
      humidity: data.hourly.relative_humidity_2m[i] ?? 60,
      pressure: data.hourly.pressure_msl[i] ?? 1013,
      windSpeed: data.hourly.wind_speed_10m[i] ?? 10,
      windDirection: data.hourly.wind_direction_10m[i] ?? 180,
      cloudCover: data.hourly.cloud_cover[i] ?? 30,
      precipitation: data.hourly.precipitation[i] ?? 0,
      uvIndex: Math.max(0, 10 - (data.hourly.cloud_cover[i] ?? 30) / 10),
    })
  }

  return hourlyData
}
