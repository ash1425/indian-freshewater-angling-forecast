export interface ScoreWeights {
  temperature: number
  pressure: number
  wind: number
  moon: number
  cloud: number
}

export const DEFAULT_WEIGHTS: ScoreWeights = {
  temperature: 0.30,
  pressure: 0.30,
  wind: 0.20,
  moon: 0.10,
  cloud: 0.10,
}

export const HOURLY_WEIGHTS: ScoreWeights = {
  temperature: 0.30,
  pressure: 0.30,
  wind: 0.20,
  moon: 0.0,
  cloud: 0.20,
}
