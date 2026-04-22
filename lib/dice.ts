export interface ParsedRoll {
  count: number;
  sides: number;
  modifier: number;
}

export interface DiceOutcome {
  rolls: number[];
  total: number;
  breakdown: string;
}

const DICE_RE = /^\s*(\d*)d(\d+)\s*([+-]\s*\d+)?\s*$/i;

export function parse(expression: string): ParsedRoll | null {
  const m = DICE_RE.exec(expression);
  if (!m) return null;
  const count = Math.max(1, Math.min(100, parseInt(m[1] || '1', 10)));
  const sides = Math.max(2, Math.min(1000, parseInt(m[2], 10)));
  const modifier = m[3] ? parseInt(m[3].replace(/\s+/g, ''), 10) : 0;
  return { count, sides, modifier };
}

function rollOne(sides: number): number {
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return (buf[0] % sides) + 1;
  }
  return Math.floor(Math.random() * sides) + 1;
}

export function roll(expression: string): DiceOutcome | null {
  const parsed = parse(expression);
  if (!parsed) return null;
  const rolls = Array.from({ length: parsed.count }, () => rollOne(parsed.sides));
  const sum = rolls.reduce((a, b) => a + b, 0);
  const total = sum + parsed.modifier;
  const mod = parsed.modifier ? ` ${parsed.modifier > 0 ? '+' : '-'} ${Math.abs(parsed.modifier)}` : '';
  const breakdown = `[${rolls.join(', ')}]${mod} = ${total}`;
  return { rolls, total, breakdown };
}

export function rollAdvantage(sides = 20, modifier = 0): DiceOutcome {
  const a = rollOne(sides);
  const b = rollOne(sides);
  const best = Math.max(a, b);
  const mod = modifier ? ` ${modifier > 0 ? '+' : '-'} ${Math.abs(modifier)}` : '';
  return {
    rolls: [a, b],
    total: best + modifier,
    breakdown: `adv [${a}, ${b}] → ${best}${mod} = ${best + modifier}`,
  };
}

export function rollDisadvantage(sides = 20, modifier = 0): DiceOutcome {
  const a = rollOne(sides);
  const b = rollOne(sides);
  const worst = Math.min(a, b);
  const mod = modifier ? ` ${modifier > 0 ? '+' : '-'} ${Math.abs(modifier)}` : '';
  return {
    rolls: [a, b],
    total: worst + modifier,
    breakdown: `dis [${a}, ${b}] → ${worst}${mod} = ${worst + modifier}`,
  };
}

export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function proficiencyBonus(level: number): number {
  return Math.ceil(1 + level / 4);
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
