export type CasterType = 'full' | 'half' | 'third' | 'pact' | 'none';

/**
 * Each inner array: [1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th] slots
 * Index = character level - 1
 */
export const FULL_CASTER_SLOTS: number[][] = [
  [2, 0, 0, 0, 0, 0, 0, 0, 0], // level 1
  [3, 0, 0, 0, 0, 0, 0, 0, 0], // level 2
  [4, 2, 0, 0, 0, 0, 0, 0, 0], // level 3
  [4, 3, 0, 0, 0, 0, 0, 0, 0], // level 4
  [4, 3, 2, 0, 0, 0, 0, 0, 0], // level 5
  [4, 3, 3, 0, 0, 0, 0, 0, 0], // level 6
  [4, 3, 3, 1, 0, 0, 0, 0, 0], // level 7
  [4, 3, 3, 2, 0, 0, 0, 0, 0], // level 8
  [4, 3, 3, 3, 1, 0, 0, 0, 0], // level 9
  [4, 3, 3, 3, 2, 0, 0, 0, 0], // level 10
  [4, 3, 3, 3, 2, 1, 0, 0, 0], // level 11
  [4, 3, 3, 3, 2, 1, 0, 0, 0], // level 12
  [4, 3, 3, 3, 2, 1, 1, 0, 0], // level 13
  [4, 3, 3, 3, 2, 1, 1, 0, 0], // level 14
  [4, 3, 3, 3, 2, 1, 1, 1, 0], // level 15
  [4, 3, 3, 3, 2, 1, 1, 1, 0], // level 16
  [4, 3, 3, 3, 2, 1, 1, 1, 1], // level 17
  [4, 3, 3, 3, 3, 1, 1, 1, 1], // level 18
  [4, 3, 3, 3, 3, 2, 1, 1, 1], // level 19
  [4, 3, 3, 3, 3, 2, 2, 1, 1], // level 20
];

/** Paladin and Ranger (gain slots starting at level 2) */
export const HALF_CASTER_SLOTS: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0], // level 1
  [2, 0, 0, 0, 0, 0, 0, 0, 0], // level 2
  [3, 0, 0, 0, 0, 0, 0, 0, 0], // level 3
  [3, 0, 0, 0, 0, 0, 0, 0, 0], // level 4
  [4, 2, 0, 0, 0, 0, 0, 0, 0], // level 5
  [4, 2, 0, 0, 0, 0, 0, 0, 0], // level 6
  [4, 3, 0, 0, 0, 0, 0, 0, 0], // level 7
  [4, 3, 0, 0, 0, 0, 0, 0, 0], // level 8
  [4, 3, 2, 0, 0, 0, 0, 0, 0], // level 9
  [4, 3, 2, 0, 0, 0, 0, 0, 0], // level 10
  [4, 3, 3, 0, 0, 0, 0, 0, 0], // level 11
  [4, 3, 3, 0, 0, 0, 0, 0, 0], // level 12
  [4, 3, 3, 1, 0, 0, 0, 0, 0], // level 13
  [4, 3, 3, 1, 0, 0, 0, 0, 0], // level 14
  [4, 3, 3, 2, 0, 0, 0, 0, 0], // level 15
  [4, 3, 3, 2, 0, 0, 0, 0, 0], // level 16
  [4, 3, 3, 3, 1, 0, 0, 0, 0], // level 17
  [4, 3, 3, 3, 1, 0, 0, 0, 0], // level 18
  [4, 3, 3, 3, 2, 0, 0, 0, 0], // level 19
  [4, 3, 3, 3, 2, 0, 0, 0, 0], // level 20
];

/** Arcane Trickster (Rogue) and Eldritch Knight (Fighter) */
export const THIRD_CASTER_SLOTS: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0], // level 1
  [0, 0, 0, 0, 0, 0, 0, 0, 0], // level 2
  [2, 0, 0, 0, 0, 0, 0, 0, 0], // level 3
  [3, 0, 0, 0, 0, 0, 0, 0, 0], // level 4
  [3, 0, 0, 0, 0, 0, 0, 0, 0], // level 5
  [3, 0, 0, 0, 0, 0, 0, 0, 0], // level 6
  [4, 2, 0, 0, 0, 0, 0, 0, 0], // level 7
  [4, 2, 0, 0, 0, 0, 0, 0, 0], // level 8
  [4, 2, 0, 0, 0, 0, 0, 0, 0], // level 9
  [4, 3, 0, 0, 0, 0, 0, 0, 0], // level 10
  [4, 3, 0, 0, 0, 0, 0, 0, 0], // level 11
  [4, 3, 0, 0, 0, 0, 0, 0, 0], // level 12
  [4, 3, 2, 0, 0, 0, 0, 0, 0], // level 13
  [4, 3, 2, 0, 0, 0, 0, 0, 0], // level 14
  [4, 3, 2, 0, 0, 0, 0, 0, 0], // level 15
  [4, 3, 3, 0, 0, 0, 0, 0, 0], // level 16
  [4, 3, 3, 0, 0, 0, 0, 0, 0], // level 17
  [4, 3, 3, 0, 0, 0, 0, 0, 0], // level 18
  [4, 3, 3, 1, 0, 0, 0, 0, 0], // level 19
  [4, 3, 3, 1, 0, 0, 0, 0, 0], // level 20
];

/** Warlock Pact Magic — separate from standard slots */
export const PACT_SLOTS: { slots: number; level: number }[] = [
  { slots: 1, level: 1 }, // level 1
  { slots: 2, level: 1 }, // level 2
  { slots: 2, level: 2 }, // level 3
  { slots: 2, level: 2 }, // level 4
  { slots: 2, level: 3 }, // level 5
  { slots: 2, level: 3 }, // level 6
  { slots: 2, level: 4 }, // level 7
  { slots: 2, level: 4 }, // level 8
  { slots: 2, level: 5 }, // level 9
  { slots: 2, level: 5 }, // level 10
  { slots: 3, level: 5 }, // level 11
  { slots: 3, level: 5 }, // level 12
  { slots: 3, level: 5 }, // level 13
  { slots: 3, level: 5 }, // level 14
  { slots: 3, level: 5 }, // level 15
  { slots: 3, level: 5 }, // level 16
  { slots: 4, level: 5 }, // level 17
  { slots: 4, level: 5 }, // level 18
  { slots: 4, level: 5 }, // level 19
  { slots: 4, level: 5 }, // level 20
];

const CASTER_CLASS_MAP: Record<string, CasterType> = {
  Bard: 'full',
  Cleric: 'full',
  Druid: 'full',
  Sorcerer: 'full',
  Wizard: 'full',
  Paladin: 'half',
  Ranger: 'half',
  Warlock: 'pact',
  Barbarian: 'none',
  Fighter: 'none',
  Monk: 'none',
  Rogue: 'none',
};

export function getCasterType(className: string): CasterType {
  return CASTER_CLASS_MAP[className] ?? 'none';
}

/** Returns 9-element array of slot counts for a class at the given level (1-20). */
export function getSlotsForClass(className: string, level: number): number[] {
  const idx = Math.max(0, Math.min(19, level - 1));
  const type = getCasterType(className);
  switch (type) {
    case 'full': return [...FULL_CASTER_SLOTS[idx]];
    case 'half': return [...HALF_CASTER_SLOTS[idx]];
    case 'third': return [...THIRD_CASTER_SLOTS[idx]];
    default: return new Array(9).fill(0);
  }
}
