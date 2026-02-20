import type { WeatherData } from '../../types/index.ts'
import type { Location } from '../../services/location.ts'
import { t } from '../../i18n/useTranslation.ts'
import styles from './WeatherDisplay.module.css'

interface Props {
  weather: WeatherData
  location?: Location
}

export function WeatherDisplay({ weather, location }: Props) {
  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  const getMoonPhaseName = (phase: number) => {
    if (phase >= 0 && phase < 0.125) return 'New Moon'
    if (phase >= 0.125 && phase < 0.25) return 'Waxing Crescent'
    if (phase >= 0.25 && phase < 0.375) return 'First Quarter'
    if (phase >= 0.375 && phase < 0.5) return 'Waxing Gibbous'
    if (phase >= 0.5 && phase < 0.625) return 'Full Moon'
    if (phase >= 0.625 && phase < 0.75) return 'Waning Gibbous'
    if (phase >= 0.75 && phase < 0.875) return 'Last Quarter'
    return 'Waning Crescent'
  }

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    const index = Math.round(degrees / 45) % 8
    return directions[index]
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('weather')} - {location?.name || 'Selected Location'}</h2>
      
      <div className={styles.mainStats}>
        <div className={styles.stat}>
          <span className={styles.label}>{t('temperature')}</span>
          <span className={styles.value}>{weather.temperature}°C</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>{t('humidity')}</span>
          <span className={styles.value}>{weather.humidity}%</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>{t('pressure')}</span>
          <span className={styles.value}>{weather.pressure} hPa</span>
        </div>
      </div>

      <div className={styles.secondaryStats}>
        <div className={styles.stat}>
          <span className={styles.label}>{t('wind')}</span>
          <span className={styles.value}>{weather.windSpeed} km/h {getWindDirection(weather.windDirection)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>{t('cloudCover')}</span>
          <span className={styles.value}>{weather.cloudCover}%</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>{t('uvIndex')}</span>
          <span className={styles.value}>{weather.uvIndex}</span>
        </div>
      </div>

      <div className={styles.sunMoon}>
        <div className={styles.stat}>
          <span className={styles.label}>{t('sunrise')}</span>
          <span className={styles.value}>{formatTime(weather.sunrise)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>{t('sunset')}</span>
          <span className={styles.value}>{formatTime(weather.sunset)}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>{t('moon')}</span>
          <span className={styles.value}>{getMoonPhaseName(weather.moonPhase)} ({weather.moonIllumination}%)</span>
        </div>
      </div>
    </div>
  )
}
