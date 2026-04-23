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

export const SKILLS: { key: string; label: string; ability: Ability; description: string }[] = [
  { key: 'acrobatics', label: 'Acrobatics', ability: 'dex', description: 'Tumbling, balancing, and avoiding holds through agility. Used to stay upright on treacherous surfaces or escape grapples.' },
  { key: 'animal-handling', label: 'Animal Handling', ability: 'wis', description: 'Calming frightened animals, controlling mounts, or intuiting what an animal is likely to do next.' },
  { key: 'arcana', label: 'Arcana', ability: 'int', description: 'Knowledge of spells, magic items, eldritch symbols, and the planes of existence.' },
  { key: 'athletics', label: 'Athletics', ability: 'str', description: 'Climbing, jumping, swimming, and feats of raw physical strength like shoving enemies or breaking free from restraints.' },
  { key: 'deception', label: 'Deception', ability: 'cha', description: 'Hiding the truth through misdirection, misleading statements, or outright lies — including disguises and planted false evidence.' },
  { key: 'history', label: 'History', ability: 'int', description: 'Recalling lore about historical events, legendary people, ancient kingdoms, lost civilizations, and past wars.' },
  { key: 'insight', label: 'Insight', ability: 'wis', description: "Reading people — determining a creature's true intentions, detecting lies, and sensing emotional states." },
  { key: 'intimidation', label: 'Intimidation', ability: 'cha', description: 'Influencing others through threats, hostile actions, or a commanding physical presence to inspire fear or compliance.' },
  { key: 'investigation', label: 'Investigation', ability: 'int', description: 'Searching for clues, deducing from evidence, spotting subtle details, and inferring what must have happened.' },
  { key: 'medicine', label: 'Medicine', ability: 'wis', description: 'Stabilizing dying creatures, diagnosing illnesses, determining the cause of death, and treating injuries.' },
  { key: 'nature', label: 'Nature', ability: 'int', description: 'Knowledge of terrain, plants, animals, weather, natural cycles, and the identifying features of the natural world.' },
  { key: 'perception', label: 'Perception', ability: 'wis', description: 'Spotting, hearing, or otherwise detecting the presence of something. The most commonly-called skill in the game.' },
  { key: 'performance', label: 'Performance', ability: 'cha', description: 'Entertaining others through music, dance, acting, storytelling, or other performing arts.' },
  { key: 'persuasion', label: 'Persuasion', ability: 'cha', description: 'Influencing others through tact, good-faith reasoning, diplomacy, and genuine charm rather than threats or lies.' },
  { key: 'religion', label: 'Religion', ability: 'int', description: 'Knowledge of deities, rites, prayers, religious hierarchies, holy symbols, and the practices of cults and sects.' },
  { key: 'sleight-of-hand', label: 'Sleight of Hand', ability: 'dex', description: 'Picking pockets, palming objects, planting items on others, and other feats of manual trickery and prestidigitation.' },
  { key: 'stealth', label: 'Stealth', ability: 'dex', description: 'Moving silently and hiding from enemies without being seen or heard.' },
  { key: 'survival', label: 'Survival', ability: 'wis', description: 'Following tracks, hunting game, navigating terrain, predicting weather, and surviving in the wilderness.' },
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
  speciesLineage?: string;
  subclass?: string;
  exhaustion?: number;
  heroicInspiration?: boolean;
  deathSaves?: DeathSaves;
  currency?: Currency;
  spellSlots?: SpellSlotState;
  pactSlots?: PactSlotState;
  knownCantrips?: string[];
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
