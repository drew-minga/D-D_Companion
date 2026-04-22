const BASE = 'https://www.dnd5eapi.co/api';

export interface ApiRef {
  index: string;
  name: string;
  url: string;
}

export interface ApiList<T = ApiRef> {
  count: number;
  results: T[];
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API ${res.status} for ${path}`);
  return (await res.json()) as T;
}

export const api = {
  listSpells: () => get<ApiList>('/spells'),
  getSpell: (index: string) => get<SpellDetail>(`/spells/${index}`),
  listMonsters: () => get<ApiList>('/monsters'),
  getMonster: (index: string) => get<MonsterDetail>(`/monsters/${index}`),
};

export interface SpellDetail {
  index: string;
  name: string;
  level: number;
  school: { name: string };
  casting_time: string;
  range: string;
  components: string[];
  duration: string;
  desc: string[];
  higher_level?: string[];
  classes: { name: string }[];
  ritual?: boolean;
  concentration?: boolean;
}

export interface MonsterDetail {
  index: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  armor_class: { type: string; value: number }[];
  hit_points: number;
  hit_dice: string;
  speed: Record<string, string>;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  challenge_rating: number;
  xp: number;
  actions?: { name: string; desc: string }[];
  special_abilities?: { name: string; desc: string }[];
  senses?: Record<string, string | number>;
  languages?: string;
}
