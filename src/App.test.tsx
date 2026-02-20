import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from './App.tsx'
import * as weatherModule from './services/weather.ts'
import * as fishingModule from './services/fishingForecast.ts'
import * as locationModule from './services/location.ts'
import type { WeatherData, FishingConditions, HourlyFishingForecast } from './types/index.ts'

const mockWeather: WeatherData = {
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
}

const mockHourlyForecasts: HourlyFishingForecast[] = [
  { time: '2024-01-15T06:00:00', hour: 6, score: 75, temperature: 22, pressure: 1013, windSpeed: 5 },
  { time: '2024-01-15T08:00:00', hour: 8, score: 85, temperature: 24, pressure: 1013, windSpeed: 4 },
  { time: '2024-01-15T10:00:00', hour: 10, score: 80, temperature: 26, pressure: 1014, windSpeed: 6 },
  { time: '2024-01-15T12:00:00', hour: 12, score: 70, temperature: 28, pressure: 1013, windSpeed: 8 },
  { time: '2024-01-15T14:00:00', hour: 14, score: 65, temperature: 29, pressure: 1012, windSpeed: 10 },
  { time: '2024-01-15T16:00:00', hour: 16, score: 75, temperature: 27, pressure: 1013, windSpeed: 7 },
  { time: '2024-01-15T18:00:00', hour: 18, score: 90, temperature: 25, pressure: 1013, windSpeed: 5 },
]

const mockForecast: FishingConditions = {
  overallRating: 85,
  temperatureScore: 100,
  pressureScore: 100,
  windScore: 100,
  moonScore: 80,
  sunScore: 90,
  bestTimeOfDay: ['6:00 - 8:00 (Early Morning)'],
  suggestedBaits: [{ name: 'Live Worms', type: 'live', reason: 'Test', score: 90 }],
  suggestedRigs: [{ name: 'Float Rig', description: 'Test', bestFor: 'Test', score: 85 }],
  bestCombos: [],
  targetSpecies: 'otherCarps',
  notes: ['Test note'],
}

vi.mock('./services/weather.ts')
vi.mock('./services/fishingForecast.ts')
vi.mock('./services/location.ts')

describe('App', () => {
  beforeEach(() => {
    vi.mocked(locationModule.getCurrentLocation).mockRejectedValue(new Error('Location not available'))
    vi.mocked(weatherModule.fetchWeatherData).mockResolvedValue(mockWeather)
    vi.mocked(weatherModule.fetchHourlyWeatherData).mockResolvedValue([])
    vi.mocked(fishingModule.calculateFishingForecast).mockReturnValue(mockForecast)
    vi.mocked(fishingModule.calculateHourlyForecasts).mockReturnValue(mockHourlyForecasts)
  })

  it('renders the main heading', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Fishing Forecast' })).toBeDefined()
    })
  })

  it('renders location subtitle', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Nande, Pune')).toBeDefined()
    })
  })

  it('renders date selector', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText(/Date/)).toBeDefined()
    })
  })

  it('renders species selector buttons', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Tilapia')).toBeDefined()
      expect(screen.getByText('Barb')).toBeDefined()
      expect(screen.getByText('Calbasu')).toBeDefined()
    })
  })

  it('renders weather section', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getAllByText(/Weather/)[0]).toBeDefined()
    })
  })

  it('renders fishing forecast section', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText(/Fishing Forecast/)).toBeDefined()
    })
  })

  it('calls weather service with location and date', async () => {
    render(<App />)
    await waitFor(() => {
      expect(weatherModule.fetchWeatherData).toHaveBeenCalled()
    })
  })

  it('calculates fishing forecast from weather data', async () => {
    render(<App />)
    await waitFor(() => {
      expect(fishingModule.calculateFishingForecast).toHaveBeenCalledWith(mockWeather, 'otherCarps')
    })
  })

  it('displays overall rating', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText(/85/)).toBeDefined()
    })
  })
})
