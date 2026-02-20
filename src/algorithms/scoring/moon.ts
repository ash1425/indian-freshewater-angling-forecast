export interface ScoreResult {
  score: number
  label: string
  description: string
}

export function calculateMoonScore(moonPhase: number, moonIllumination: number): ScoreResult {
  let phaseLabel = 'Average'
  if (moonPhase >= 0.0 && moonPhase <= 0.25) {
    phaseLabel = 'New Moon'
  } else if (moonPhase >= 0.75 && moonPhase <= 1.0) {
    phaseLabel = 'Full Moon'
  } else if (moonPhase >= 0.4 && moonPhase <= 0.6) {
    phaseLabel = 'Quarter Moon'
  }

  const phaseScore = (() => {
    if (moonPhase >= 0.0 && moonPhase <= 0.25) return 95
    if (moonPhase >= 0.75 && moonPhase <= 1.0) return 90
    if (moonPhase >= 0.4 && moonPhase <= 0.6) return 70
    return 80
  })()

  const illuminationLabel = moonIllumination >= 50 ? 'Bright' : 'Dark'
  const illuminationScore = moonIllumination >= 50 ? 75 : 65

  const score = Math.round((phaseScore + illuminationScore) / 2)

  return {
    score,
    label: phaseLabel,
    description: `${phaseLabel} - ${illuminationLabel} night`,
  }
}

export function getMoonAdvice(moonIllumination: number): string {
  if (moonIllumination > 70) return 'Full moon - nocturnal fishing can be excellent'
  return ''
}
