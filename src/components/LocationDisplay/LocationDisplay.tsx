import { useState } from 'react'
import type { Location } from '../../services/location.ts'
import { currentLanguage } from '../../i18n/useTranslation.ts'
import { t } from '../../i18n/useTranslation.ts'
import styles from './LocationDisplay.module.css'

interface Props {
  location: Location
  isLoading?: boolean
  onChangeLocation?: () => void
}

export function LocationDisplay({ location, isLoading, onChangeLocation }: Props) {
  const [copied, setCopied] = useState(false)

  const zoom = 10
  const tileX = Math.floor((location.longitude + 180) / 360 * Math.pow(2, zoom))
  const latRad = location.latitude * Math.PI / 180
  const tileY = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * Math.pow(2, zoom))
  const mapUrl = `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`

  const handleShare = async () => {
    const url = new URL(window.location.href)
    url.searchParams.set('lang', currentLanguage)
    url.searchParams.set('lat', location.latitude.toFixed(4))
    url.searchParams.set('lon', location.longitude.toFixed(4))
    
    const shareText = `${window.location.origin}${window.location.pathname}?lang=${currentLanguage}&lat=${location.latitude.toFixed(4)}&lon=${location.longitude.toFixed(4)}`
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Indian Freshwater Fishing Forecast',
          text: 'Check out this fishing forecast!',
          url: shareText,
        })
      } else {
        await navigator.clipboard.writeText(shareText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.mapWrapper}>
        <img 
          src={mapUrl} 
          alt="Location map" 
          className={styles.map}
        />
        <div className={styles.marker}>📍</div>
      </div>
      <div className={styles.info}>
        <span className={styles.name}>{isLoading ? t('gettingLocation') : location.name}</span>
        <span className={styles.coords}>
          {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°E
        </span>
        <button className={styles.shareButton} onClick={handleShare}>
          {copied ? t('shareCopied') : t('share')}
        </button>
        {onChangeLocation && (
          <button className={styles.shareButton} onClick={onChangeLocation}>
            {t('changeLocation')}
          </button>
        )}
      </div>
    </div>
  )
}
