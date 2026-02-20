export interface HourlyWeatherData {
  time: string
  temperature: number
  humidity: number
  pressure: number
  windSpeed: number
  windDirection: number
  cloudCover: number
  precipitation: number
  uvIndex: number
}

export interface HourlyFishingForecast {
  time: string
  hour: number
  score: number
  temperature: number
  pressure: number
  windSpeed: number
}

export interface WeatherData {
  temperature: number
  humidity: number
  pressure: number
  pressureTrend: 'rising' | 'falling' | 'stable'
  windSpeed: number
  windDirection: number
  cloudCover: number
  precipitation: number
  uvIndex: number
  sunrise: string
  sunset: string
  moonPhase: number
  moonIllumination: number
}

export type FishSpecies = 'tilapia' | 'barb' | 'calbasu' | 'otherCarps'

export const FISH_SPECIES_OPTIONS: { value: FishSpecies; label: string }[] = [
  { value: 'tilapia', label: 'Tilapia' },
  { value: 'barb', label: 'Barb' },
  { value: 'calbasu', label: 'Calbasu' },
  { value: 'otherCarps', label: 'Other Carps' },
]

export interface Bait {
  name: string
  type: 'live' | 'artificial' | 'fly'
  reason: string
  score: number
}

export interface Rig {
  name: string
  description: string
  bestFor: string
  score: number
}

export interface BaitRigCombo {
  bait: Bait
  rig: Rig
  combinedScore: number
}

export interface FishingConditions {
  overallRating: number
  temperatureScore: number
  pressureScore: number
  windScore: number
  moonScore: number
  sunScore: number
  bestTimeOfDay: string[]
  suggestedBaits: Bait[]
  suggestedRigs: Rig[]
  bestCombos: BaitRigCombo[]
  targetSpecies: FishSpecies
  notes: string[]
}

export type SolunarRating = 'poor' | 'fair' | 'good' | 'excellent'
