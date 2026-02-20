import type { Rig, FishSpecies } from '../types/index.ts'

const RIG_DATA: Record<FishSpecies, Rig[]> = {
  tilapia: [
    { name: 'Float Rig', description: 'Bobber presentation, natural drift', bestFor: 'Shallow water, finicky fish', score: 95 },
    { name: 'Carolina Rig', description: 'Sliding sinker, free-moving hook', bestFor: 'Medium depth', score: 85 },
    { name: 'Feeder Rig', description: 'Feed cylinder with hook, Method feeder', bestFor: 'Still water, carp family', score: 80 },
  ],
  barb: [
    { name: 'Drift Rig', description: 'Natural drift with light weight', bestFor: 'Flowing water', score: 95 },
    { name: 'Float Rig', description: 'Light bobber, sensitive to bites', bestFor: 'Shallow streams', score: 90 },
    { name: 'Small Hook Rig', description: 'Tiny hooks, subtle presentations', bestFor: 'Small barb fish', score: 85 },
  ],
  calbasu: [
    { name: 'Feeder Rig', description: 'Method feeder with PVA bags', bestFor: 'Still water, bottom feeding', score: 95 },
    { name: 'Pole Rig', description: 'Long pole with elastic', bestFor: 'Precise presentation', score: 90 },
    { name: 'Ledger Rig', description: 'Bottom fishing with weight', bestFor: 'Deep water', score: 85 },
  ],
  otherCarps: [
    { name: 'Hair Rig', description: 'Knotless knot, boilie on hair', bestFor: 'Carp fishing, big fish', score: 95 },
    { name: 'Method Feeder', description: 'Feed mold with hook buried', bestFor: 'Still water, carps', score: 90 },
    { name: 'Paternoster Rig', description: 'Two hooks above weight', bestFor: 'Distance fishing', score: 85 },
  ],
}

export function getRigsForSpecies(species: FishSpecies, windSpeed: number): Rig[] {
  const rigs: Rig[] = [...RIG_DATA[species]]

  if (windSpeed > 15) {
    rigs.push({
      name: 'Paternoster Rig',
      description: 'Heavy weight at bottom, hooks above - stable in current',
      bestFor: 'Fast water, windy conditions',
      score: 75,
    })
  }

  rigs.push({
    name: 'Float Rig',
    description: 'Bobber presentation, natural drift',
    bestFor: 'Calm water, finicky fish',
    score: 80,
  })

  return rigs.slice(0, 4)
}
