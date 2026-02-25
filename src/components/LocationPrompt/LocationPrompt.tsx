import { useState, type FormEvent } from 'react'
import { getLocationName, type Location } from '../../services/location.ts'
import { t } from '../../i18n/useTranslation.ts'
import styles from './LocationPrompt.module.css'

interface Props {
  onLocationSelect: (location: Location) => void
}

async function searchLocation(query: string): Promise<{ lat: number; lon: number; name: string }> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`,
    {
      headers: {
        'User-Agent': 'FishingForecastApp/1.0',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Geocoding failed')
  }

  const data = await response.json()

  if (!data || data.length === 0) {
    throw new Error('Location not found')
  }

  const result = data[0]
  const name =
    result.address?.city ||
    result.address?.town ||
    result.address?.village ||
    result.address?.municipality ||
    result.address?.county ||
    result.name ||
    query

  return {
    lat: parseFloat(result.lat),
    lon: parseFloat(result.lon),
    name,
  }
}

export function LocationPrompt({ onLocationSelect }: Props) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAllowLocation = async () => {
    setLoading(true)
    setError('')
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported on this device')
      setLoading(false)
      return
    }
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          { enableHighAccuracy: true, timeout: 15000 }
        )
      })

      const { latitude, longitude } = position.coords
      const name = await getLocationName(latitude, longitude)
      onLocationSelect({ latitude, longitude, name })
    } catch (err) {
      let message: string
      if (err instanceof GeolocationPositionError) {
        if (err.code === 1) {
          message = 'Location permission denied. Please allow location access or search manually.'
        } else if (err.code === 2) {
          message = 'Location unavailable. Please search manually.'
        } else {
          message = 'Location request timed out. Please try again or search manually.'
        }
      } else if (err instanceof Error && err.message.includes('secure origins')) {
        message = 'Location requires HTTPS. Please search for your location manually.'
      } else {
        message = 'Unable to get location. Please search manually.'
      }
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!query.trim()) {
      setError('Please enter a location name')
      return
    }

    setLoading(true)
    try {
      const result = await searchLocation(query)
      onLocationSelect({
        latitude: result.lat,
        longitude: result.lon,
        name: result.name,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Location not found')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('selectLocation')}</h2>
      
      <button
        type="button"
        className={styles.primaryButton}
        onClick={handleAllowLocation}
        disabled={loading}
      >
        {loading ? t('gettingLocation') : t('allowLocation')}
      </button>

      <div className={styles.divider}>
        <span>or</span>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="location" className={styles.label}>{t('enterLocation')}</label>
          <input
            id="location"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.input}
            placeholder={t('enterLocation')}
            disabled={loading}
          />
        </div>

        <button type="submit" className={styles.secondaryButton} disabled={loading || !query.trim()}>
          {loading ? t('loading') : t('search')}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
