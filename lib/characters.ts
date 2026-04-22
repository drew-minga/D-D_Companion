import type { Character } from './types';
import { uid } from './dice';

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
    createdAt: now,
    updatedAt: now,
  };
}
