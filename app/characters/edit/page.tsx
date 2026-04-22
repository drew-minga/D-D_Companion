'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLocalState } from '@/lib/storage';
import { abilityModifier, proficiencyBonus, roll, uid } from '@/lib/dice';
import type { Ability, Character, RollResult } from '@/lib/types';
import { ABILITIES, ABILITY_LABELS, SKILLS } from '@/lib/types';

function fmt(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

export default function CharacterEditorPage() {
  return (
    <Suspense fallback={<p className="text-ink/70">Loading…</p>}>
      <CharacterEditor />
    </Suspense>
  );
}

function CharacterEditor() {
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get('id');

  const [characters, setCharacters] = useLocalState<Character[]>('characters', []);
  const [history, setHistory] = useLocalState<RollResult[]>('dice:history', []);
  const [toast, setToast] = useState<string | null>(null);

  const character = useMemo(() => characters.find((c) => c.id === id) ?? null, [characters, id]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1500);
    return () => clearTimeout(t);
  }, [toast]);

  if (!id) {
    return <p className="text-ink/70">No character selected. <Link className="underline" href="/characters">Back</Link></p>;
  }
  if (!character) {
    return <p className="text-ink/70">Character not found. <Link className="underline" href="/characters">Back</Link></p>;
  }

  function update(patch: Partial<Character>) {
    setCharacters((cs) =>
      cs.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: Date.now() } : c)),
    );
  }

  function updateAbility(key: Ability, value: number) {
    const next = { ...character!.abilities, [key]: value };
    update({ abilities: next });
  }

  function toggleSave(a: Ability) {
    const has = character!.proficientSaves.includes(a);
    update({
      proficientSaves: has
        ? character!.proficientSaves.filter((x) => x !== a)
        : [...character!.proficientSaves, a],
    });
  }

  function toggleSkill(key: string) {
    const has = character!.proficientSkills.includes(key);
    update({
      proficientSkills: has
        ? character!.proficientSkills.filter((x) => x !== key)
        : [...character!.proficientSkills, key],
    });
  }

  const prof = proficiencyBonus(character.level);

  function logRoll(expr: string, tag: string) {
    const o = roll(expr);
    if (!o) return;
    setHistory((h) => [{ id: uid(), expression: expr, rolls: o.rolls, total: o.total, breakdown: o.breakdown, at: Date.now(), tag }, ...h].slice(0, 50));
    setToast(`${tag}: ${o.total} (${o.breakdown})`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/characters" className="text-sm underline text-ink/70">← All characters</Link>
        <button
          onClick={() => {
            if (confirm('Delete this character?')) {
              setCharacters((cs) => cs.filter((c) => c.id !== id));
              router.push('/characters');
            }
          }}
          className="btn text-xs text-blood"
        >
          Delete
        </button>
      </div>

      <section className="card grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <label className="label">Name</label>
          <input className="input" value={character.name} onChange={(e) => update({ name: e.target.value })} />
        </div>
        <div>
          <label className="label">Class</label>
          <input className="input" value={character.class} onChange={(e) => update({ class: e.target.value })} />
        </div>
        <div>
          <label className="label">Level</label>
          <input
            type="number"
            min={1}
            max={20}
            className="input"
            value={character.level}
            onChange={(e) => update({ level: Math.max(1, Math.min(20, parseInt(e.target.value || '1', 10))) })}
          />
        </div>
        <div>
          <label className="label">Race</label>
          <input className="input" value={character.race} onChange={(e) => update({ race: e.target.value })} />
        </div>
        <div>
          <label className="label">Background</label>
          <input className="input" value={character.background} onChange={(e) => update({ background: e.target.value })} />
        </div>
        <div>
          <label className="label">Alignment</label>
          <input className="input" value={character.alignment} onChange={(e) => update({ alignment: e.target.value })} />
        </div>
        <div>
          <label className="label">Proficiency</label>
          <div className="mt-1 heading text-xl">{fmt(prof)}</div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <h2 className="heading text-lg">Vitals</h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div>
              <label className="label">HP</label>
              <input
                type="number"
                className="input"
                value={character.hp.current}
                onChange={(e) => update({ hp: { ...character.hp, current: parseInt(e.target.value || '0', 10) } })}
              />
            </div>
            <div>
              <label className="label">Max</label>
              <input
                type="number"
                className="input"
                value={character.hp.max}
                onChange={(e) => update({ hp: { ...character.hp, max: parseInt(e.target.value || '0', 10) } })}
              />
            </div>
            <div>
              <label className="label">Temp</label>
              <input
                type="number"
                className="input"
                value={character.hp.temp}
                onChange={(e) => update({ hp: { ...character.hp, temp: parseInt(e.target.value || '0', 10) } })}
              />
            </div>
            <div>
              <label className="label">AC</label>
              <input
                type="number"
                className="input"
                value={character.ac}
                onChange={(e) => update({ ac: parseInt(e.target.value || '0', 10) })}
              />
            </div>
            <div>
              <label className="label">Speed</label>
              <input
                type="number"
                className="input"
                value={character.speed}
                onChange={(e) => update({ speed: parseInt(e.target.value || '0', 10) })}
              />
            </div>
            <div>
              <label className="label">Init</label>
              <input
                type="number"
                className="input"
                value={character.initiativeBonus}
                onChange={(e) => update({ initiativeBonus: parseInt(e.target.value || '0', 10) })}
              />
            </div>
          </div>
          <button
            onClick={() => logRoll(`1d20${character.initiativeBonus >= 0 ? '+' : ''}${character.initiativeBonus}`, 'initiative')}
            className="btn-gold mt-3 w-full"
          >
            Roll initiative
          </button>
        </div>

        <div className="card md:col-span-2">
          <h2 className="heading text-lg">Abilities</h2>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ABILITIES.map((a) => {
              const score = character.abilities[a];
              const mod = abilityModifier(score);
              const saveBonus = mod + (character.proficientSaves.includes(a) ? prof : 0);
              return (
                <div key={a} className="rounded-md border border-ink/15 bg-white/70 p-2">
                  <div className="flex items-center justify-between">
                    <span className="label">{ABILITY_LABELS[a]}</span>
                    <span className="heading text-lg">{fmt(mod)}</span>
                  </div>
                  <input
                    type="number"
                    className="input mt-1"
                    value={score}
                    onChange={(e) => updateAbility(a, Math.max(1, Math.min(30, parseInt(e.target.value || '10', 10))))}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <label className="flex items-center gap-1 text-xs">
                      <input
                        type="checkbox"
                        checked={character.proficientSaves.includes(a)}
                        onChange={() => toggleSave(a)}
                      />
                      save {fmt(saveBonus)}
                    </label>
                    <div className="flex gap-1">
                      <button
                        className="btn text-xs"
                        onClick={() => logRoll(`1d20${mod >= 0 ? '+' : ''}${mod}`, `${a} check`)}
                      >
                        Check
                      </button>
                      <button
                        className="btn text-xs"
                        onClick={() => logRoll(`1d20${saveBonus >= 0 ? '+' : ''}${saveBonus}`, `${a} save`)}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="heading text-lg">Skills</h2>
        <ul className="mt-3 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map((s) => {
            const prof0 = character.proficientSkills.includes(s.key);
            const bonus = abilityModifier(character.abilities[s.ability]) + (prof0 ? prof : 0);
            return (
              <li key={s.key} className="flex items-center justify-between rounded border border-ink/10 bg-white/60 px-2 py-1 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={prof0} onChange={() => toggleSkill(s.key)} />
                  <span>{s.label}</span>
                  <span className="text-xs text-ink/50 uppercase">{s.ability}</span>
                </label>
                <button
                  className="btn text-xs"
                  onClick={() => logRoll(`1d20${bonus >= 0 ? '+' : ''}${bonus}`, s.label)}
                >
                  {fmt(bonus)}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="heading text-lg">Inventory</h2>
          <InventoryEditor character={character} update={update} />
        </div>
        <div className="card">
          <h2 className="heading text-lg">Notes</h2>
          <textarea
            className="input mt-2 min-h-[200px]"
            value={character.notes}
            onChange={(e) => update({ notes: e.target.value })}
            placeholder="Backstory, features, spells, anything."
          />
        </div>
      </section>

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-md bg-ink text-parchment px-4 py-2 shadow-lg text-sm">
          {toast}
        </div>
      )}
    </div>
  );
}

function InventoryEditor({
  character,
  update,
}: {
  character: Character;
  update: (p: Partial<Character>) => void;
}) {
  const [name, setName] = useState('');
  const [qty, setQty] = useState(1);

  function add() {
    if (!name.trim()) return;
    update({ inventory: [...character.inventory, { name: name.trim(), qty }] });
    setName('');
    setQty(1);
  }

  function remove(i: number) {
    update({ inventory: character.inventory.filter((_, idx) => idx !== i) });
  }

  return (
    <div>
      <div className="mt-2 flex gap-2">
        <input className="input flex-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Longsword, potion..." />
        <input type="number" className="input w-20" value={qty} onChange={(e) => setQty(parseInt(e.target.value || '1', 10) || 1)} />
        <button onClick={add} className="btn-primary">Add</button>
      </div>
      {character.inventory.length === 0 ? (
        <p className="mt-3 text-sm text-ink/60">Nothing in your pack yet.</p>
      ) : (
        <ul className="mt-3 space-y-1">
          {character.inventory.map((it, i) => (
            <li key={i} className="flex items-center justify-between rounded border border-ink/10 bg-white/60 px-2 py-1 text-sm">
              <span>
                {it.qty}× {it.name}
              </span>
              <button onClick={() => remove(i)} className="text-xs text-blood">Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
