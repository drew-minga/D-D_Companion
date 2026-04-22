export type Ability = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export const ABILITIES: readonly Ability[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;

export const ABILITY_LABELS: Record<Ability, string> = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

export const SKILLS: { key: string; label: string; ability: Ability }[] = [
  { key: 'acrobatics', label: 'Acrobatics', ability: 'dex' },
  { key: 'animal-handling', label: 'Animal Handling', ability: 'wis' },
  { key: 'arcana', label: 'Arcana', ability: 'int' },
  { key: 'athletics', label: 'Athletics', ability: 'str' },
  { key: 'deception', label: 'Deception', ability: 'cha' },
  { key: 'history', label: 'History', ability: 'int' },
  { key: 'insight', label: 'Insight', ability: 'wis' },
  { key: 'intimidation', label: 'Intimidation', ability: 'cha' },
  { key: 'investigation', label: 'Investigation', ability: 'int' },
  { key: 'medicine', label: 'Medicine', ability: 'wis' },
  { key: 'nature', label: 'Nature', ability: 'int' },
  { key: 'perception', label: 'Perception', ability: 'wis' },
  { key: 'performance', label: 'Performance', ability: 'cha' },
  { key: 'persuasion', label: 'Persuasion', ability: 'cha' },
  { key: 'religion', label: 'Religion', ability: 'int' },
  { key: 'sleight-of-hand', label: 'Sleight of Hand', ability: 'dex' },
  { key: 'stealth', label: 'Stealth', ability: 'dex' },
  { key: 'survival', label: 'Survival', ability: 'wis' },
];

// --- 5.5e supporting types ---

export interface DeathSaves {
  successes: number;
  failures: number;
}

export interface SpellSlotState {
  /** 9-element array; index 0 = 1st-level slots */
  total: number[];
  used: number[];
}

export interface PactSlotState {
  total: number;
  used: number;
  slotLevel: number;
}

export interface Currency {
  pp: number;
  gp: number;
  ep: number;
  sp: number;
  cp: number;
}

export interface CharacterFeat {
  featId: string;
  source: 'origin' | 'asi' | 'class' | 'other';
  level: number;
}

export interface Character {
  // --- Core fields (unchanged) ---
  id: string;
  name: string;
  /** @deprecated Use species. Kept for backward compatibility. */
  race: string;
  class: string;
  level: number;
  alignment: string;
  background: string;
  abilities: Record<Ability, number>;
  proficientSaves: Ability[];
  proficientSkills: string[];
  hp: { current: number; max: number; temp: number };
  ac: number;
  speed: number;
  initiativeBonus: number;
  inventory: { name: string; qty: number; notes?: string }[];
  notes: string;
  createdAt: number;
  updatedAt: number;

  // --- 5.5e fields (optional for backward compat) ---
  species?: string;
  subclass?: string;
  exhaustion?: number;
  heroicInspiration?: boolean;
  deathSaves?: DeathSaves;
  currency?: Currency;
  spellSlots?: SpellSlotState;
  pactSlots?: PactSlotState;
  knownSpells?: string[];
  feats?: CharacterFeat[];
  toolProficiencies?: string[];
  languages?: string[];
  schemaVersion?: number;
}

export interface Combatant {
  id: string;
  name: string;
  initiative: number;
  hp: number;
  maxHp: number;
  ac: number;
  conditions: string[];
  isPlayer: boolean;
  notes?: string;
  exhaustion?: number;
}

export interface Encounter {
  round: number;
  activeIndex: number;
  combatants: Combatant[];
}

export interface RollResult {
  id: string;
  expression: string;
  rolls: number[];
  total: number;
  breakdown: string;
  at: number;
  tag?: string;
}
