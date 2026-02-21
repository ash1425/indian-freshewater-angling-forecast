import { describe, expect, it } from 'vitest'
import { calculateFishingForecast } from '../services/fishingForecast.ts'
import type { WeatherData } from '../types/index.ts'

const createMockWeather = (overrides: Partial<WeatherData> = {}): WeatherData => ({
  temperature: 25,
  humidity: 60,
  pressure: 1013,
  pressureTrend: 'stable',
  windSpeed: 5,
  windDirection: 180,
  cloudCover: 30,
  precipitation: 0,
  uvIndex: 5,
  sunrise: '2024-01-15T06:30:00',
  sunset: '2024-01-15T18:30:00',
  moonPhase: 0.5,
  moonIllumination: 50,
  ...overrides,
})

describe('calculateFishingForecast', () => {
  describe('temperature scoring', () => {
    it('returns high score for optimal temperature range (20-30°C)', () => {
      const weather = createMockWeather({ temperature: 25 })
      const result = calculateFishingForecast(weather, 'otherCarps')
      expect(result.temperatureScore).toBe(100)
    })

    it('returns good score for temperatures 15-20°C', () => {
      const weather = createMockWeather({ temperature: 17 })
      const result = calculateFishingForecast(weather, 'otherCarps')
      expect(result.temperatureScore).toBe(55)
    })

    it('returns lower score for extreme temperatures', () => {
      const weather = createMockWeather({ temperature: 40 })
      const result = calculateFishingForecast(weather, 'otherCarps')
      expect(result.temperatureScore).toBeLessThan(50)
    })
  })

  describe('pressure scoring', () => {
    it('returns high score for normal pressure', () => {
      const weather = createMockWeather({ pressure: 1013 })
      const result = calculateFishingForecast(weather, 'otherCarps')
      expect(result.pressureScore).toBe(100)
    })

    it('returns lower score for extreme pressure deviation', () => {
      const weather = createMockWeather({ pressure: 1050 })
      const result = calculateFishingForecast(weather, 'otherCarps')
      expect(result.pressureScore).toBeLessThan(50)
    })
  })

  describe('wind scoring', () => {
    it('returns high score for moderate wind', () => {
      const weather = createMockWeather({ windSpeed: 10 })
      const result = calculateFishingForecast(weather, 'otherCarps')
      expect(result.windScore).toBe(100)
    })

    it('returns lower score for high wind', () => {
      const weather = createMockWeather({ windSpeed: 25 })
      const result = calculateFishingForecast(weather, 'otherCarps')
      expect(result.windScore).toBe(45)
    })
  })

  describe('moon scoring', () => {
    it('returns good score for quarter moons', () => {
      const weather = createMockWeather({ moonPhase: 0.2, moonIllumination: 60 })
      const result = calculateFishingForecast(weather, 'otherCarps')
      expect(result.moonScore).toBeGreaterThanOrEqual(75)
    })
  })

  describe('cloud scoring', () => {
    it('returns good score for partial cloud cover', () => {
      const weather = createMockWeather({ cloudCover: 40 })
      const result = calculateFishingForecast(weather, 'otherCarps')
      expect(result.sunScore).toBe(90)
    })
  })

  describe('overall rating', () => {
    it('calculates overall rating as weighted average', () => {
      const weather = createMockWeather({
        temperature: 25,
        pressure: 1013,
        windSpeed: 5,
        moonPhase: 0.2,
        moonIllumination: 60,
        cloudCover: 40,
        uvIndex: 4,
      })
      const result = calculateFishingForecast(weather, 'otherCarps')
      expect(result.overallRating).toBeGreaterThan(80)
      expect(result.overallRating).toBeLessThanOrEqual(100)
    })
  })

  describe('best time of day', () => {
    it('returns early morning and evening times', () => {
      const weather = createMockWeather()
      const result = calculateFishingForecast(weather, 'otherCarps')
      expect(result.bestTimeOfDay.length).toBeGreaterThan(0)
      expect(result.bestTimeOfDay[0]).toContain('Early Morning')
      expect(result.bestTimeOfDay[1]).toContain('Evening')
    })
  })

  describe('species specific baits', () => {
    it('returns baits for tilapia', () => {
      const weather = createMockWeather({ temperature: 25 })
      const result = calculateFishingForecast(weather, 'tilapia')
      expect(result.suggestedBaits.length).toBeGreaterThan(0)
      expect(result.bestCombos.length).toBeGreaterThan(0)
      expect(result.targetSpecies).toBe('tilapia')
    })

    it('returns baits for barb', () => {
      const weather = createMockWeather({ temperature: 25 })
      const result = calculateFishingForecast(weather, 'barb')
      expect(result.suggestedBaits.length).toBeGreaterThan(0)
      expect(result.targetSpecies).toBe('barb')
    })

    it('returns baits for calbasu', () => {
      const weather = createMockWeather({ temperature: 25 })
      const result = calculateFishingForecast(weather, 'calbasu')
      expect(result.suggestedBaits.length).toBeGreaterThan(0)
      expect(result.targetSpecies).toBe('calbasu')
    })

    it('returns baits for otherCarps', () => {
      const weather = createMockWeather({ temperature: 25 })
      const result = calculateFishingForecast(weather, 'otherCarps')
      expect(result.suggestedBaits.length).toBeGreaterThan(0)
      expect(result.targetSpecies).toBe('otherCarps')
    })
  })

  describe('species specific rigs', () => {
    it('returns multiple rig options', () => {
      const weather = createMockWeather()
      const result = calculateFishingForecast(weather, 'otherCarps')
      expect(result.suggestedRigs.length).toBeGreaterThan(0)
    })

    it('returns paternoster rig for high wind', () => {
      const weather = createMockWeather({ windSpeed: 20 })
      const result = calculateFishingForecast(weather, 'otherCarps')
      expect(result.suggestedRigs.some(r => r.name === 'Paternoster Rig')).toBe(true)
    })
  })

  describe('best combos', () => {
    it('returns sorted combinations by score', () => {
      const weather = createMockWeather({ temperature: 25, pressure: 1013, windSpeed: 5 })
      const result = calculateFishingForecast(weather, 'otherCarps')
      expect(result.bestCombos.length).toBeGreaterThan(0)
      expect(result.bestCombos[0].combinedScore).toBeGreaterThanOrEqual(result.bestCombos[1]?.combinedScore ?? 0)
    })
  })

  describe('notes', () => {
    it('adds note for high wind', () => {
      const weather = createMockWeather({ windSpeed: 25 })
      const result = calculateFishingForecast(weather, 'otherCarps')
      expect(result.notes.some(n => n.includes('High winds'))).toBe(true)
    })

    it('adds note for high pressure', () => {
      const weather = createMockWeather({ pressure: 1026 })
      const result = calculateFishingForecast(weather, 'otherCarps')
      expect(result.notes.some(n => n.includes('High pressure'))).toBe(true)
    })

    it('adds note for low pressure', () => {
      const weather = createMockWeather({ pressure: 1005 })
      const result = calculateFishingForecast(weather, 'otherCarps')
      expect(result.notes.some(n => n.includes('Low pressure'))).toBe(true)
    })

    it('adds note for very hot temperature', () => {
      const weather = createMockWeather({ temperature: 39 })
      const result = calculateFishingForecast(weather, 'otherCarps')
      expect(result.notes.some(n => n.includes('Very hot'))).toBe(true)
    })

    it('adds note for cold temperature', () => {
      const weather = createMockWeather({ temperature: 12 })
      const result = calculateFishingForecast(weather, 'otherCarps')
      expect(result.notes.some(n => n.includes('Cold weather'))).toBe(true)
    })
  })
})
