'use client';

import { useState } from 'react';
import { useLocalState } from '@/lib/storage';
import { roll, uid } from '@/lib/dice';
import type { Combatant, Encounter } from '@/lib/types';

const CONDITIONS = [
  'Blinded',
  'Charmed',
  'Deafened',
  'Frightened',
  'Grappled',
  'Incapacitated',
  'Invisible',
  'Paralyzed',
  'Petrified',
  'Poisoned',
  'Prone',
  'Restrained',
  'Stunned',
  'Unconscious',
  'Concentrating',
];

function initialEncounter(): Encounter {
  return { round: 1, activeIndex: 0, combatants: [] };
}

export default function CombatPage() {
  const [enc, setEnc] = useLocalState<Encounter>('combat', initialEncounter());
  const [name, setName] = useState('');
  const [init, setInit] = useState('');
  const [hp, setHp] = useState(10);
  const [ac, setAc] = useState(10);
  const [isPlayer, setIsPlayer] = useState(false);

  function add() {
    if (!name.trim()) return;
    const rolled = init.trim() === '' ? roll('1d20')?.total ?? 10 : parseInt(init, 10) || 0;
    const c: Combatant = {
      id: uid(),
      name: name.trim(),
      initiative: rolled,
      hp,
      maxHp: hp,
      ac,
      conditions: [],
      isPlayer,
    };
    setEnc((e) => ({ ...e, combatants: sortByInit([...e.combatants, c]) }));
    setName('');
    setInit('');
    setHp(10);
    setAc(10);
  }

  function remove(id: string) {
    setEnc((e) => {
      const idx = e.combatants.findIndex((c) => c.id === id);
      const combatants = e.combatants.filter((c) => c.id !== id);
      let activeIndex = e.activeIndex;
      if (idx !== -1 && idx < e.activeIndex) activeIndex = Math.max(0, activeIndex - 1);
      if (activeIndex >= combatants.length) activeIndex = 0;
      return { ...e, combatants, activeIndex };
    });
  }

  function patch(id: string, p: Partial<Combatant>) {
    setEnc((e) => ({ ...e, combatants: e.combatants.map((c) => (c.id === id ? { ...c, ...p } : c)) }));
  }

  function sortByInit(list: Combatant[]): Combatant[] {
    return [...list].sort((a, b) => b.initiative - a.initiative);
  }

  function resort() {
    setEnc((e) => ({ ...e, combatants: sortByInit(e.combatants), activeIndex: 0 }));
  }

  function next() {
    setEnc((e) => {
      if (e.combatants.length === 0) return e;
      const nextIndex = (e.activeIndex + 1) % e.combatants.length;
      const round = nextIndex === 0 ? e.round + 1 : e.round;
      return { ...e, activeIndex: nextIndex, round };
    });
  }

  function prev() {
    setEnc((e) => {
      if (e.combatants.length === 0) return e;
      const prevIndex = (e.activeIndex - 1 + e.combatants.length) % e.combatants.length;
      const round = e.activeIndex === 0 ? Math.max(1, e.round - 1) : e.round;
      return { ...e, activeIndex: prevIndex, round };
    });
  }

  function reset() {
    if (!confirm('Clear the encounter?')) return;
    setEnc(initialEncounter());
  }

  function toggleCondition(id: string, cond: string) {
    setEnc((e) => ({
      ...e,
      combatants: e.combatants.map((c) =>
        c.id === id
          ? { ...c, conditions: c.conditions.includes(cond) ? c.conditions.filter((x) => x !== cond) : [...c.conditions, cond] }
          : c,
      ),
    }));
  }

  const active = enc.combatants[enc.activeIndex];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="heading text-3xl text-blood">Combat</h1>
        <div className="flex items-center gap-2">
          <span className="chip">Round {enc.round}</span>
          <button onClick={prev} className="btn">← Prev</button>
          <button onClick={next} className="btn-primary">Next →</button>
          <button onClick={resort} className="btn">Re-sort</button>
          <button onClick={reset} className="btn text-blood">Reset</button>
        </div>
      </div>

      <section className="card">
        <h2 className="heading text-lg">Add combatant</h2>
        <form
          className="mt-3 grid gap-2 sm:grid-cols-6"
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <input className="input sm:col-span-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Init (blank = roll)" value={init} onChange={(e) => setInit(e.target.value)} />
          <input type="number" className="input" placeholder="HP" value={hp} onChange={(e) => setHp(parseInt(e.target.value || '0', 10))} />
          <input type="number" className="input" placeholder="AC" value={ac} onChange={(e) => setAc(parseInt(e.target.value || '0', 10))} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isPlayer} onChange={(e) => setIsPlayer(e.target.checked)} />
            Player
          </label>
          <button className="btn-primary sm:col-span-6">Add</button>
        </form>
      </section>

      {enc.combatants.length === 0 ? (
        <div className="card text-center text-ink/70">No combatants yet. Add some to start the encounter.</div>
      ) : (
        <ul className="space-y-2">
          {enc.combatants.map((c, i) => {
            const isActive = i === enc.activeIndex;
            return (
              <li
                key={c.id}
                className={
                  'card flex flex-wrap items-center gap-3 transition ' +
                  (isActive ? 'border-gold shadow-md ring-2 ring-gold/40' : '')
                }
              >
                <span className="heading w-10 text-center text-xl text-blood">{c.initiative}</span>
                <div className="flex-1 min-w-[140px]">
                  <div className="flex items-center gap-2">
                    <input
                      className="input max-w-[220px]"
                      value={c.name}
                      onChange={(e) => patch(c.id, { name: e.target.value })}
                    />
                    {c.isPlayer && <span className="chip">PC</span>}
                    {isActive && <span className="chip bg-gold/30 border-gold">Active</span>}
                  </div>
                  {c.conditions.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {c.conditions.map((cond) => (
                        <span key={cond} className="chip bg-blood/10 border-blood/30">{cond}</span>
                      ))}
                    </div>
                  )}
                </div>
                <label className="flex items-center gap-1 text-xs">
                  HP
                  <input
                    type="number"
                    className="input w-16"
                    value={c.hp}
                    onChange={(e) => patch(c.id, { hp: parseInt(e.target.value || '0', 10) })}
                  />
                  / {c.maxHp}
                </label>
                <label className="flex items-center gap-1 text-xs">
                  AC
                  <input
                    type="number"
                    className="input w-14"
                    value={c.ac}
                    onChange={(e) => patch(c.id, { ac: parseInt(e.target.value || '0', 10) })}
                  />
                </label>
                <details className="relative">
                  <summary className="btn cursor-pointer list-none">Conditions</summary>
                  <div className="absolute right-0 z-10 mt-1 w-56 rounded-md border border-ink/15 bg-white p-2 shadow-lg">
                    <ul className="max-h-64 overflow-auto text-sm">
                      {CONDITIONS.map((cond) => (
                        <li key={cond}>
                          <label className="flex items-center gap-2 rounded px-1 py-0.5 hover:bg-ink/5">
                            <input
                              type="checkbox"
                              checked={c.conditions.includes(cond)}
                              onChange={() => toggleCondition(c.id, cond)}
                            />
                            {cond}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
                <button onClick={() => remove(c.id)} className="btn text-xs text-blood">Remove</button>
              </li>
            );
          })}
        </ul>
      )}

      {active && (
        <div className="card bg-gold/10 border-gold/40">
          <div className="label">On deck</div>
          <div className="heading text-xl">{active.name}</div>
        </div>
      )}
    </div>
  );
}
