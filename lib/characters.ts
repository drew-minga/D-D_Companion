import type { Ability, Character, Currency, DeathSaves, SpellSlotState } from './types';
import { uid } from './dice';
import { CLASSES_MAP } from './data/classes';
import { SPECIES_MAP } from './data/species';
import { BACKGROUNDS_MAP } from './data/backgrounds';
import { getSlotsForClass } from './data/spellSlots';

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
    subclass: '',
    exhaustion: 0,
    heroicInspiration: false,
    deathSaves: defaultDeathSaves(),
    currency: defaultCurrency(),
    spellSlots: defaultSpellSlots(),
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
  classId: string;
  backgroundId: string;
  alignment: string;
  baseAbilities: Record<Ability, number>;
  asiVariant: 'twoOne' | 'threeOne';
  chosenClassSkills: string[];
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
    if (input.asiVariant === 'twoOne') {
      const { plus2, plus1 } = backgroundDef.abilityScoreIncreases.twoOne;
      abilities[plus2] = (abilities[plus2] ?? 10) + 2;
      abilities[plus1] = (abilities[plus1] ?? 10) + 1;
    } else {
      for (const ab of backgroundDef.abilityScoreIncreases.threeOne) {
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
