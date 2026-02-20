import { FISH_SPECIES_OPTIONS, type FishSpecies } from '../../types/index.ts'
import { t } from '../../i18n/useTranslation.ts'
import styles from './SpeciesSelector.module.css'

interface Props {
  selectedSpecies: FishSpecies | null
  onSpeciesChange: (species: FishSpecies | null) => void
}

export function SpeciesSelector({ selectedSpecies, onSpeciesChange }: Props) {
  const getSpeciesLabel = (value: FishSpecies): string => {
    const labelMap: Record<FishSpecies, () => string> = {
      tilapia: () => t('tilapia'),
      barb: () => t('barb'),
      calbasu: () => t('calbasu'),
      otherCarps: () => t('otherCarps'),
    }
    return labelMap[value]()
  }

  const handleClick = (species: FishSpecies) => {
    if (selectedSpecies === species) {
      onSpeciesChange(null)
    } else {
      onSpeciesChange(species)
    }
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>{t('targetSpecies')}</label>
      <div className={styles.options}>
        {FISH_SPECIES_OPTIONS.map((option) => (
          <button
            key={option.value}
            className={`${styles.button} ${selectedSpecies === option.value ? styles.selected : ''}`}
            onClick={() => handleClick(option.value)}
          >
            {getSpeciesLabel(option.value)}
          </button>
        ))}
      </div>
    </div>
  )
}
