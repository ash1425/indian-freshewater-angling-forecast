import type { Bait, FishSpecies } from '../types/index.ts'

const BAIT_DATA: Record<FishSpecies, Bait[]> = {
  tilapia: [
    { name: 'Bread', type: 'live', reason: 'Tilapia are omnivorous and love bread', score: 90 },
    { name: 'Corn', type: 'live', reason: 'Sweet corn is irresistible to tilapia', score: 85 },
    { name: 'Worms', type: 'live', reason: 'Protein-rich, works well in warm water', score: 80 },
    { name: 'Vegetables', type: 'live', reason: 'Peas, lettuce - plant-based baits work', score: 75 },
    { name: 'Tilapia Feed', type: 'artificial', reason: 'Commercial feed pellets', score: 70 },
  ],
  barb: [
    { name: 'Worms', type: 'live', reason: 'Barbs are bottom feeders, love worms', score: 95 },
    { name: 'Insects', type: 'live', reason: 'Crickets, grasshoppers - natural prey', score: 90 },
    { name: 'Small Lures', type: 'artificial', reason: 'Tiny spinners work great', score: 85 },
    { name: 'Bread', type: 'live', reason: 'Attracts barbs in murky water', score: 80 },
    { name: 'Fruit', type: 'live', reason: 'Banana, mango pieces work well', score: 75 },
  ],
  calbasu: [
    { name: 'Vegetables', type: 'live', reason: 'Calbasu loves boiled vegetables', score: 95 },
    { name: 'Fruits', type: 'live', reason: 'Banana, jackfruit - their favorites', score: 90 },
    { name: 'Bread', type: 'live', reason: 'Effective and easy to find', score: 85 },
    { name: 'Rice', type: 'live', reason: 'Cooked rice balls work well', score: 80 },
    { name: 'Tubers', type: 'live', reason: 'Sweet potato, arrowroot', score: 75 },
  ],
  otherCarps: [
    { name: 'Corn', type: 'live', reason: 'Classic carp bait, works year-round', score: 95 },
    { name: 'Boiled Potatoes', type: 'live', reason: 'Firm, durable, loves by carps', score: 90 },
    { name: 'Bread', type: 'live', reason: 'Easy to use, attracts big carps', score: 85 },
    { name: 'Carp Pellets', type: 'artificial', reason: 'Commercial baits for carp', score: 80 },
    { name: 'Worms', type: 'live', reason: 'Great for smaller carps', score: 75 },
  ],
}

export function getBaitsForSpecies(species: FishSpecies, temperature: number, pressure: number): Bait[] {
  const baits: Bait[] = [...BAIT_DATA[species]]

  if (temperature < 20) {
    baits.push({ name: 'Live Shrimp', type: 'live', reason: 'Cold water - slower presentations work best', score: 70 })
  }

  if (pressure > 1015) {
    baits.push({ name: 'Crankbaits', type: 'artificial', reason: 'High pressure - fish deeper', score: 65 })
  }

  if (pressure < 1010) {
    baits.push({ name: 'Topwater Lures', type: 'artificial', reason: 'Low pressure brings fish to surface', score: 65 })
  }

  return baits.slice(0, 5)
}
