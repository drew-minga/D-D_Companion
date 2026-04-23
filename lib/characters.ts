import type { Ability, Character, Currency, DeathSaves, SpellSlotState } from './types';
import { uid } from './dice';
import { CLASSES_MAP } from './data/classes';
import { SPECIES_MAP } from './data/species';
import { BACKGROUNDS_MAP } from './data/backgrounds';
import { getSlotsForClass, PACT_SLOTS } from './data/spellSlots';

export const CURRENT_SCHEMA_VERSION = 2;

function defaultCurrency(): Currency {
  return { pp: 0, gp: 0, ep: 0, sp: 0, cp: 0 };
}

function defaultDeathSaves(): DeathSaves {
  return { successes: 0, failures: 0 };
}

function defaultSpellSlots(): SpellSlotState {
  return { total: new Array(9).fill(0), used: new Array(9).fill(0) };
}

export function newCharacter(): Character {
  const now = Date.now();
  return {
    id: uid(),
    name: 'New Adventurer',
    race: '',
    class: '',
    level: 1,
    alignment: '',
    background: '',
    abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    proficientSaves: [],
    proficientSkills: [],
    hp: { current: 10, max: 10, temp: 0 },
    ac: 10,
    speed: 30,
    initiativeBonus: 0,
    inventory: [],
    notes: '',
    species: '',
    speciesLineage: '',
    subclass: '',
    exhaustion: 0,
    heroicInspiration: false,
    deathSaves: defaultDeathSaves(),
    currency: defaultCurrency(),
    spellSlots: defaultSpellSlots(),
    knownCantrips: [],
    knownSpells: [],
    feats: [],
    toolProficiencies: [],
    languages: [],
    schemaVersion: CURRENT_SCHEMA_VERSION,
    createdAt: now,
    updatedAt: now,
  };
}

export function migrateCharacter(c: unknown): Character {
  const raw = c as Record<string, unknown>;
  const base = newCharacter();
  return {
    ...base,
    ...(raw as Partial<Character>),
    species: (raw.species as string | undefined) || (raw.race as string | undefined) || '',
    subclass: (raw.subclass as string | undefined) ?? '',
    exhaustion: typeof raw.exhaustion === 'number' ? raw.exhaustion : 0,
    heroicInspiration: typeof raw.heroicInspiration === 'boolean' ? raw.heroicInspiration : false,
    deathSaves: (raw.deathSaves as DeathSaves | undefined) ?? defaultDeathSaves(),
    currency: (raw.currency as Currency | undefined) ?? defaultCurrency(),
    spellSlots: (raw.spellSlots as SpellSlotState | undefined) ?? defaultSpellSlots(),
    knownCantrips: Array.isArray(raw.knownCantrips) ? (raw.knownCantrips as string[]) : [],
    knownSpells: Array.isArray(raw.knownSpells) ? (raw.knownSpells as string[]) : [],
    feats: Array.isArray(raw.feats) ? raw.feats : [],
    toolProficiencies: Array.isArray(raw.toolProficiencies) ? (raw.toolProficiencies as string[]) : [],
    languages: Array.isArray(raw.languages) ? (raw.languages as string[]) : [],
    schemaVersion: CURRENT_SCHEMA_VERSION,
  };
}

export interface WizardOutput {
  name: string;
  speciesId: string;
  lineageId: string;
  classId: string;
  backgroundId: string;
  alignment: string;
  baseAbilities: Record<Ability, number>;
  asiMode: 'twoOne' | 'threeOne';
  asiPlus2: Ability | null;
  asiPlus1: Ability | null;
  chosenClassSkills: string[];
  chosenCantrips: string[];
}

export function createCharacterFromWizard(input: WizardOutput): Character {
  const now = Date.now();
  const classDef = CLASSES_MAP[input.classId];
  const speciesDef = SPECIES_MAP[input.speciesId];
  const backgroundDef = BACKGROUNDS_MAP[input.backgroundId];

  const proficientSaves: Ability[] = classDef ? [...classDef.savingThrows] : [];

  // Merge background skills + chosen class skills (deduplicate)
  const bgSkills = backgroundDef ? [...backgroundDef.skillProficiencies] : [];
  const proficientSkills = [...new Set([...bgSkills, ...input.chosenClassSkills])];

  // Apply background ASI to base scores
  const abilities = { ...input.baseAbilities };
  if (backgroundDef) {
    if (input.asiMode === 'twoOne' && input.asiPlus2 && input.asiPlus1) {
      abilities[input.asiPlus2] = (abilities[input.asiPlus2] ?? 10) + 2;
      abilities[input.asiPlus1] = (abilities[input.asiPlus1] ?? 10) + 1;
    } else if (input.asiMode === 'threeOne') {
      for (const ab of backgroundDef.abilityScoreIncreases.abilities) {
        abilities[ab] = (abilities[ab] ?? 10) + 1;
      }
    }
  }

  // Starting HP: max hit die + CON modifier
  const conMod = Math.floor((abilities.con - 10) / 2);
  const hitDie = classDef?.hitDie ?? 8;
  const maxHp = hitDie + conMod;

  const dexMod = Math.floor((abilities.dex - 10) / 2);
  const speed = speciesDef?.speed ?? 30;

  const totalSlots = classDef ? getSlotsForClass(classDef.name, 1) : new Array(9).fill(0);

  return {
    id: uid(),
    name: input.name || 'New Adventurer',
    race: speciesDef?.name ?? input.speciesId,
    species: input.speciesId,
    speciesLineage: input.lineageId,
    class: classDef?.name ?? input.classId,
    subclass: '',
    level: 1,
    alignment: input.alignment,
    background: backgroundDef?.name ?? input.backgroundId,
    abilities,
    proficientSaves,
    proficientSkills,
    hp: { current: Math.max(1, maxHp), max: Math.max(1, maxHp), temp: 0 },
    ac: 10,
    speed,
    initiativeBonus: dexMod,
    inventory: [],
    notes: '',
    exhaustion: 0,
    heroicInspiration: false,
    deathSaves: defaultDeathSaves(),
    currency: defaultCurrency(),
    spellSlots: { total: totalSlots, used: new Array(9).fill(0) },
    knownCantrips: input.chosenCantrips ?? [],
    knownSpells: [],
    feats: backgroundDef
      ? [{ featId: backgroundDef.originFeatId, source: 'origin', level: 1 }]
      : [],
    toolProficiencies: backgroundDef?.toolProficiency ? [backgroundDef.toolProficiency] : [],
    languages: [
      ...(speciesDef?.languages ?? []),
      ...(backgroundDef?.languageProficiency ? [backgroundDef.languageProficiency] : []),
    ],
    schemaVersion: CURRENT_SCHEMA_VERSION,
    createdAt: now,
    updatedAt: now,
  };
}

export interface LevelUpChoices {
  /** HP rolled on hit die (null = take average) */
  hpRoll: number | null;
  /** If ASI level: +2 to this ability (null if taking split option) */
  asiPlus2: Ability | null;
  /** If ASI level: +1 to this ability (used for both split and combined) */
  asiPlus1: Ability | null;
  /** 'plus2' = +2 one ability; 'split' = +1 to two abilities */
  asiMode: 'plus2' | 'split';
  /** New cantrip gained at this level (null if no gain) */
  newCantrip: string | null;
}

export function levelUpCharacter(c: Character, choices: LevelUpChoices): Character {
  const newLevel = c.level + 1;
  const classDef = Object.values(CLASSES_MAP).find((cl) => cl.name === c.class) ?? CLASSES_MAP[c.class];
  const hitDie = classDef?.hitDie ?? 8;
  const conMod = Math.floor((c.abilities.con - 10) / 2);

  // HP increase
  const hpGain = Math.max(1,
    choices.hpRoll !== null
      ? choices.hpRoll + conMod
      : Math.floor(hitDie / 2) + 1 + conMod,
  );

  // ASI
  const newAbilities = { ...c.abilities };
  const isASILevel = classDef?.features.some(
    (f) => f.level === newLevel && f.name === 'Ability Score Improvement',
  ) ?? false;
  if (isASILevel) {
    if (choices.asiMode === 'plus2' && choices.asiPlus2) {
      newAbilities[choices.asiPlus2] = Math.min(20, newAbilities[choices.asiPlus2] + 2);
    } else if (choices.asiMode === 'split' && choices.asiPlus2 && choices.asiPlus1) {
      newAbilities[choices.asiPlus2] = Math.min(20, newAbilities[choices.asiPlus2] + 1);
      newAbilities[choices.asiPlus1] = Math.min(20, newAbilities[choices.asiPlus1] + 1);
    }
  }

  // Spell slots
  const casterType = classDef?.spellcastingType ?? 'none';
  const currentSlots = c.spellSlots ?? defaultSpellSlots();
  let newSpellSlots = currentSlots;
  if (casterType !== 'none' && casterType !== 'pact') {
    const newTotal = classDef ? getSlotsForClass(classDef.name, newLevel) : currentSlots.total;
    const newUsed = currentSlots.used.map((u, i) => Math.min(u, newTotal[i]));
    newSpellSlots = { total: newTotal, used: newUsed };
  }

  // Pact slots
  let newPactSlots = c.pactSlots;
  if (casterType === 'pact') {
    const pactRow = PACT_SLOTS[Math.max(0, Math.min(19, newLevel - 1))];
    const currentUsed = c.pactSlots?.used ?? 0;
    newPactSlots = { total: pactRow.slots, used: Math.min(currentUsed, pactRow.slots), slotLevel: pactRow.level };
  }

  // Cantrips
  const newCantrips =
    choices.newCantrip && !c.knownCantrips?.includes(choices.newCantrip)
      ? [...(c.knownCantrips ?? []), choices.newCantrip]
      : c.knownCantrips ?? [];

  return {
    ...c,
    level: newLevel,
    hp: { ...c.hp, max: c.hp.max + hpGain, current: c.hp.current + hpGain },
    abilities: newAbilities,
    spellSlots: newSpellSlots,
    pactSlots: newPactSlots,
    knownCantrips: newCantrips,
    updatedAt: Date.now(),
  };
}
