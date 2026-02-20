import { useState, useEffect, useCallback } from 'react'
import { fetchWeatherData, fetchHourlyWeatherData } from './services/weather.ts'
import { calculateFishingForecast, calculateHourlyForecasts } from './services/fishingForecast.ts'
import { getCurrentLocation, DEFAULT_LOCATION, getLocationName, type Location } from './services/location.ts'
import { WeatherDisplay } from './components/WeatherDisplay/index.ts'
import { FishingForecast } from './components/FishingForecast/index.ts'
import { DateSelector } from './components/DateSelector/index.ts'
import { LocationDisplay } from './components/LocationDisplay/index.ts'
import { FishingForecastGraph } from './components/FishingForecastGraph/FishingForecastGraph.tsx'
import { LanguageSelector } from './components/LanguageSelector/index.ts'
import { Footer } from './components/Footer/Footer.tsx'
import { t } from './i18n/useTranslation.ts'
import type { WeatherData, FishingConditions, FishSpecies, HourlyFishingForecast } from './types/index.ts'
import styles from './App.module.css'
import { Analytics } from '@vercel/analytics/react';

interface UseForecastDataResult {
  location: Location
  selectedDate: Date
  selectedSpecies: FishSpecies | null
  weather: WeatherData | null
  forecast: FishingConditions | null
  hourlyForecasts: HourlyFishingForecast[]
  loading: boolean
  error: string | null
  locationLoading: boolean
  setSelectedDate: (date: Date) => void
  setSelectedSpecies: (species: FishSpecies | null) => void
}

function getLocationFromParams(): Location | null {
  const params = new URLSearchParams(window.location.search)
  const lat = params.get('lat')
  const lon = params.get('lon')
  if (lat && lon) {
    const latitude = parseFloat(lat)
    const longitude = parseFloat(lon)
    if (!isNaN(latitude) && !isNaN(longitude)) {
      return { latitude, longitude, name: 'Custom Location' }
    }
  }
  return null
}

function useForecastData(): UseForecastDataResult {
  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedSpecies, setSelectedSpecies] = useState<FishSpecies | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<FishingConditions | null>(null)
  const [hourlyForecasts, setHourlyForecasts] = useState<HourlyFishingForecast[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)

  const loadData = useCallback(async (loc: Location, date: Date, species: FishSpecies | null) => {
    try {
      setLoading(true)
      const weatherData = await fetchWeatherData(loc, date)
      setWeather(weatherData)

      const forecastData = calculateFishingForecast(weatherData, species ?? 'otherCarps')
      setForecast(forecastData)

      const hourlyWeather = await fetchHourlyWeatherData(loc, date)
      const hourlyData = calculateHourlyForecasts(hourlyWeather, weatherData.sunrise, weatherData.sunset)
      setHourlyForecasts(hourlyData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setLocationLoading(true)

    const urlLocation = getLocationFromParams()
    if (urlLocation) {
      getLocationName(urlLocation.latitude, urlLocation.longitude).then((name) => {
        const loc = { ...urlLocation, name }
        setLocation(loc)
        loadData(loc, selectedDate, selectedSpecies)
        setLocationLoading(false)
      })
      return
    }

    getCurrentLocation()
      .then((loc) => {
        setLocation(loc)
        loadData(loc, selectedDate, selectedSpecies)
      })
      .catch(() => {
        loadData(DEFAULT_LOCATION, selectedDate, selectedSpecies)
      })
      .finally(() => {
        setLocationLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (weather) {
      const forecastData = calculateFishingForecast(weather, selectedSpecies ?? 'otherCarps')
      setForecast(forecastData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSpecies])

  useEffect(() => {
    loadData(location, selectedDate, selectedSpecies)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, selectedDate])

  return {
    location,
    selectedDate,
    selectedSpecies,
    weather,
    forecast,
    hourlyForecasts,
    loading,
    error,
    locationLoading,
    setSelectedDate,
    setSelectedSpecies,
  }
}

function App() {
  const {
    location,
    selectedDate,
    selectedSpecies,
    weather,
    forecast,
    hourlyForecasts,
    loading,
    error,
    locationLoading,
    setSelectedDate,
    setSelectedSpecies,
  } = useForecastData()

  if (loading && !weather) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>{t('appTitle')}</h1>
        <p className={styles.loading}>{locationLoading ? t('gettingLocation') : t('loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>{t('appTitle')}</h1>
        <p className={styles.error}>{t('error')}: {error}</p>
      </div>
    )
  }

  if (!weather || !forecast) {
    return null
  }

  return (
    <main className={styles.main}>
      <Analytics />
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <img src="/logo.svg" alt="Logo" className={styles.logo} />
            <h1 className={styles.title}>{t('appTitle')}</h1>
          </div>
          <LanguageSelector />
        </div>

        <LocationDisplay location={location} isLoading={locationLoading} />

        <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />

        <div className={styles.grid}>
          <WeatherDisplay weather={weather} location={location} />
          <FishingForecast
            forecast={forecast}
            location={location}
            selectedSpecies={selectedSpecies}
            onSpeciesChange={setSelectedSpecies}
          />
        </div>

        <FishingForecastGraph hourlyForecasts={hourlyForecasts} />

        <Footer />
      </div>
    </main>
  )
}

export default App
