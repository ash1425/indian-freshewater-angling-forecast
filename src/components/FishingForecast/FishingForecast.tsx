import type { FishingConditions, FishSpecies } from '../../types/index.ts'
import type { Location } from '../../services/location.ts'
import { t } from '../../i18n/useTranslation.ts'
import { ScoreCard } from '../ScoreCard.tsx'
import { BestTimes } from '../BestTimes.tsx'
import { BaitRigCombos } from '../BaitRigCombos.tsx'
import { Notes } from '../Notes.tsx'
import { RatingBadge } from '../ui/RatingBadge.tsx'
import { SpeciesSelector } from '../SpeciesSelector/index.ts'
import styles from './FishingForecast.module.css'

interface Props {
  forecast: FishingConditions
  location?: Location
  selectedSpecies: FishSpecies | null
  onSpeciesChange: (species: FishSpecies | null) => void
}

export function FishingForecast({ forecast, location, selectedSpecies, onSpeciesChange }: Props) {
  const scoreItems = [
    { label: t('temperature'), score: forecast.temperatureScore, tooltipKey: 'tempTooltip' as const },
    { label: t('pressure'), score: forecast.pressureScore, tooltipKey: 'pressureTooltip' as const },
    { label: t('wind'), score: forecast.windScore, tooltipKey: 'windTooltip' as const },
    { label: t('moon'), score: forecast.moonScore, tooltipKey: 'moonTooltip' as const },
    { label: t('cloudCover'), score: forecast.sunScore, tooltipKey: 'cloudTooltip' as const },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {t('fishingForecast')} - {location?.name || 'Selected Location'}
        </h2>
        <RatingBadge rating={forecast.overallRating} />
      </div>

      <ScoreCard title={t('conditionsScore')} scores={scoreItems} />

      <BestTimes times={forecast.bestTimeOfDay} />

      <SpeciesSelector selectedSpecies={selectedSpecies} onSpeciesChange={onSpeciesChange} />

      {selectedSpecies && <BaitRigCombos combos={forecast.bestCombos} />}

      <Notes notes={forecast.notes} />
    </div>
  )
}
