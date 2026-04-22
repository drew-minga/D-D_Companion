'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLocalState } from '@/lib/storage';
import { abilityModifier, proficiencyBonus, roll, uid } from '@/lib/dice';
import type { Ability, Character, RollResult } from '@/lib/types';
import { ABILITIES, ABILITY_LABELS, SKILLS } from '@/lib/types';
import { migrateCharacter } from '@/lib/characters';
import { SPECIES_MAP } from '@/lib/data/species';
import { CLASSES_MAP, getFeaturesUpToLevel } from '@/lib/data/classes';
import { FEATS_MAP } from '@/lib/data/feats';
import { getCasterType, getSlotsForClass, PACT_SLOTS } from '@/lib/data/spellSlots';

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

  const [rawCharacters, setRawCharacters] = useLocalState<Character[]>('characters', []);
  const characters = useMemo(() => rawCharacters.map(migrateCharacter), [rawCharacters]);
  const [history, setHistory] = useLocalState<RollResult[]>('dice:history', []);
  const [toast, setToast] = useState<string | null>(null);
  const [showSpeciesTraits, setShowSpeciesTraits] = useState(false);
  const [showClassFeatures, setShowClassFeatures] = useState(false);
  const [newSpellInput, setNewSpellInput] = useState('');

  const character = useMemo(() => characters.find((c) => c.id === id) ?? null, [characters, id]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1500);
    return () => clearTimeout(t);
  }, [toast]);

  if (!id) return <p className="text-ink/70">No character selected. <Link className="underline" href="/characters">Back</Link></p>;
  if (!character) return <p className="text-ink/70">Character not found. <Link className="underline" href="/characters">Back</Link></p>;

  function update(patch: Partial<Character>) {
    setRawCharacters((cs) =>
      cs.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: Date.now() } : c)),
    );
  }

  function updateAbility(key: Ability, value: number) {
    update({ abilities: { ...character!.abilities, [key]: value } });
  }

  function toggleSave(a: Ability) {
    const has = character!.proficientSaves.includes(a);
    update({ proficientSaves: has ? character!.proficientSaves.filter((x) => x !== a) : [...character!.proficientSaves, a] });
  }

  function toggleSkill(key: string) {
    const has = character!.proficientSkills.includes(key);
    update({ proficientSkills: has ? character!.proficientSkills.filter((x) => x !== key) : [...character!.proficientSkills, key] });
  }

  function logRoll(expr: string, tag: string) {
    const o = roll(expr);
    if (!o) return;
    setHistory((h) => [{ id: uid(), expression: expr, rolls: o.rolls, total: o.total, breakdown: o.breakdown, at: Date.now(), tag }, ...h].slice(0, 50));
    setToast(`${tag}: ${o.total} (${o.breakdown})`);
  }

  // Spell slot helpers
  function updateSlotUsed(index: number, delta: number) {
    const slots = character!.spellSlots ?? { total: new Array(9).fill(0), used: new Array(9).fill(0) };
    const newUsed = [...slots.used];
    newUsed[index] = Math.max(0, Math.min(slots.total[index], (newUsed[index] ?? 0) + delta));
    update({ spellSlots: { ...slots, used: newUsed } });
  }

  function resetSlots() {
    const slots = character!.spellSlots ?? { total: new Array(9).fill(0), used: new Array(9).fill(0) };
    update({ spellSlots: { ...slots, used: new Array(9).fill(0) } });
  }

  function updatePactSlotUsed(delta: number) {
    const ps = character!.pactSlots ?? { total: 0, used: 0, slotLevel: 1 };
    update({ pactSlots: { ...ps, used: Math.max(0, Math.min(ps.total, ps.used + delta)) } });
  }

  // Sync spell slots when level or class changes
  function handleLevelChange(newLevel: number) {
    const casterType = getCasterType(character!.class);
    if (casterType !== 'none' && casterType !== 'pact') {
      const newTotal = getSlotsForClass(character!.class, newLevel);
      update({ level: newLevel, spellSlots: { total: newTotal, used: new Array(9).fill(0) } });
    } else if (casterType === 'pact') {
      const pactRow = PACT_SLOTS[Math.max(0, Math.min(19, newLevel - 1))];
      update({ level: newLevel, pactSlots: { total: pactRow.slots, used: 0, slotLevel: pactRow.level } });
    } else {
      update({ level: newLevel });
    }
  }

  function addSpell() {
    const name = newSpellInput.trim();
    if (!name) return;
    const spells = character!.knownSpells ?? [];
    if (!spells.includes(name)) {
      update({ knownSpells: [...spells, name] });
    }
    setNewSpellInput('');
  }

  function removeSpell(name: string) {
    update({ knownSpells: (character!.knownSpells ?? []).filter((s) => s !== name) });
  }

  const prof = proficiencyBonus(character.level);
  const speciesData = SPECIES_MAP[character.species ?? ''];
  const classData = CLASSES_MAP[Object.keys(CLASSES_MAP).find((k) => CLASSES_MAP[k].name === character.class) ?? ''];
  const casterType = getCasterType(character.class);
  const classFeatures = classData ? getFeaturesUpToLevel(classData.id, character.level) : [];
  const spellSlots = character.spellSlots ?? { total: new Array(9).fill(0), used: new Array(9).fill(0) };
  const pactSlots = character.pactSlots ?? { total: 0, used: 0, slotLevel: 1 };
  const exhaustion = character.exhaustion ?? 0;
  const deathSaves = character.deathSaves ?? { successes: 0, failures: 0 };
  const currency = character.currency ?? { pp: 0, gp: 0, ep: 0, sp: 0, cp: 0 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/characters" className="text-sm underline text-ink/70">← All characters</Link>
        <button
          onClick={() => {
            if (confirm('Delete this character?')) {
              setRawCharacters((cs) => cs.filter((c) => c.id !== id));
              router.push('/characters');
            }
          }}
          className="btn text-xs text-blood"
        >
          Delete
        </button>
      </div>

      {/* Identity */}
      <section className="card grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <label className="label">Name</label>
          <input className="input" value={character.name} onChange={(e) => update({ name: e.target.value })} />
        </div>
        <div>
          <label className="label">Class</label>
          <select
            className="input"
            value={character.class}
            onChange={(e) => update({ class: e.target.value, subclass: '' })}
          >
            <option value="">— choose —</option>
            {Object.values(CLASSES_MAP).map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
            {character.class && !Object.values(CLASSES_MAP).find((c) => c.name === character.class) && (
              <option value={character.class}>{character.class}</option>
            )}
          </select>
        </div>
        <div>
          <label className="label">Level</label>
          <input
            type="number"
            min={1}
            max={20}
            className="input"
            value={character.level}
            onChange={(e) => handleLevelChange(Math.max(1, Math.min(20, parseInt(e.target.value || '1', 10))))}
          />
        </div>
        <div>
          <label className="label">Species</label>
          <select
            className="input"
            value={character.species ?? ''}
            onChange={(e) => update({ species: e.target.value, race: SPECIES_MAP[e.target.value]?.name ?? e.target.value })}
          >
            <option value="">— choose —</option>
            {Object.values(SPECIES_MAP).map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
            {character.species && !SPECIES_MAP[character.species] && (
              <option value={character.species}>{character.species}</option>
            )}
          </select>
        </div>
        <div>
          <label className="label">Subclass</label>
          <input className="input" value={character.subclass ?? ''} onChange={(e) => update({ subclass: e.target.value })} placeholder="e.g. Champion" />
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

      {/* Vitals + Status */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <h2 className="heading text-lg">Vitals</h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div>
              <label className="label">HP</label>
              <input type="number" className="input" value={character.hp.current}
                onChange={(e) => update({ hp: { ...character.hp, current: parseInt(e.target.value || '0', 10) } })} />
            </div>
            <div>
              <label className="label">Max</label>
              <input type="number" className="input" value={character.hp.max}
                onChange={(e) => update({ hp: { ...character.hp, max: parseInt(e.target.value || '0', 10) } })} />
            </div>
            <div>
              <label className="label">Temp</label>
              <input type="number" className="input" value={character.hp.temp}
                onChange={(e) => update({ hp: { ...character.hp, temp: parseInt(e.target.value || '0', 10) } })} />
            </div>
            <div>
              <label className="label">AC</label>
              <input type="number" className="input" value={character.ac}
                onChange={(e) => update({ ac: parseInt(e.target.value || '0', 10) })} />
            </div>
            <div>
              <label className="label">Speed</label>
              <input type="number" className="input" value={character.speed}
                onChange={(e) => update({ speed: parseInt(e.target.value || '0', 10) })} />
            </div>
            <div>
              <label className="label">Init</label>
              <input type="number" className="input" value={character.initiativeBonus}
                onChange={(e) => update({ initiativeBonus: parseInt(e.target.value || '0', 10) })} />
            </div>
          </div>
          <button
            onClick={() => logRoll(`1d20${character.initiativeBonus >= 0 ? '+' : ''}${character.initiativeBonus}`, 'initiative')}
            className="btn-gold mt-3 w-full"
          >
            Roll Initiative
          </button>
        </div>

        {/* Status: Inspiration, Exhaustion, Death Saves */}
        <div className="card space-y-4">
          <h2 className="heading text-lg">Status</h2>

          {/* Heroic Inspiration */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Heroic Inspiration</span>
            <button
              onClick={() => update({ heroicInspiration: !character.heroicInspiration })}
              className={`px-3 py-1 rounded text-sm font-semibold border transition-colors ${
                character.heroicInspiration
                  ? 'bg-gold text-ink border-gold/60'
                  : 'bg-white/50 text-ink/60 border-ink/20'
              }`}
            >
              {character.heroicInspiration ? '★ Inspired' : '☆ No Inspiration'}
            </button>
          </div>

          {/* Exhaustion */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold">Exhaustion</span>
              <span className={`text-sm font-bold ${exhaustion >= 6 ? 'text-blood' : exhaustion > 0 ? 'text-amber-700' : 'text-ink/40'}`}>
                {exhaustion === 6 ? 'DEAD' : exhaustion === 0 ? 'None' : `Level ${exhaustion}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => update({ exhaustion: Math.max(0, exhaustion - 1) })} className="btn text-sm px-2">−</button>
              <div className="flex gap-1 flex-1 justify-center">
                {[1, 2, 3, 4, 5, 6].map((lvl) => (
                  <div
                    key={lvl}
                    onClick={() => update({ exhaustion: exhaustion === lvl ? lvl - 1 : lvl })}
                    className={`w-5 h-5 rounded-full border cursor-pointer ${
                      lvl <= exhaustion
                        ? lvl === 6 ? 'bg-blood border-blood' : 'bg-amber-600 border-amber-700'
                        : 'bg-white/50 border-ink/20'
                    }`}
                  />
                ))}
              </div>
              <button onClick={() => update({ exhaustion: Math.min(6, exhaustion + 1) })} className="btn text-sm px-2">+</button>
            </div>
            {exhaustion > 0 && exhaustion < 6 && (
              <p className="text-xs text-ink/60 mt-1 text-center">−{exhaustion} to d20 tests · −{exhaustion * 5} ft. Speed</p>
            )}
          </div>

          {/* Death Saves (show when HP = 0) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold">Death Saves</span>
              <button
                onClick={() => update({ deathSaves: { successes: 0, failures: 0 } })}
                className="text-xs text-ink/40 underline"
              >
                Reset
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-green-700 font-semibold w-16">Success:</span>
              {[1, 2, 3].map((i) => (
                <input
                  key={i}
                  type="checkbox"
                  checked={deathSaves.successes >= i}
                  onChange={() => update({ deathSaves: { ...deathSaves, successes: deathSaves.successes >= i ? i - 1 : i } })}
                  className="accent-green-600 w-4 h-4"
                />
              ))}
            </div>
            <div className="flex items-center gap-3 text-xs mt-1">
              <span className="text-blood font-semibold w-16">Failure:</span>
              {[1, 2, 3].map((i) => (
                <input
                  key={i}
                  type="checkbox"
                  checked={deathSaves.failures >= i}
                  onChange={() => update({ deathSaves: { ...deathSaves, failures: deathSaves.failures >= i ? i - 1 : i } })}
                  className="accent-red-700 w-4 h-4"
                />
              ))}
            </div>
            {deathSaves.successes >= 3 && <p className="text-xs text-green-700 font-semibold mt-1">Stable ✓</p>}
            {deathSaves.failures >= 3 && <p className="text-xs text-blood font-semibold mt-1">Death ✗</p>}
          </div>
        </div>

        <div className="card md:col-span-1">
          <h2 className="heading text-lg">Abilities</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {ABILITIES.map((a) => {
              const score = character.abilities[a];
              const mod = abilityModifier(score);
              const saveBonus = mod + (character.proficientSaves.includes(a) ? prof : 0);
              return (
                <div key={a} className="rounded-md border border-ink/15 bg-white/70 p-2">
                  <div className="flex items-center justify-between">
                    <span className="label text-xs">{ABILITY_LABELS[a].slice(0, 3).toUpperCase()}</span>
                    <span className="heading text-base">{fmt(mod)}</span>
                  </div>
                  <input
                    type="number"
                    className="input mt-1 text-center"
                    value={score}
                    onChange={(e) => updateAbility(a, Math.max(1, Math.min(30, parseInt(e.target.value || '10', 10))))}
                  />
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <label className="flex items-center gap-1">
                      <input type="checkbox" checked={character.proficientSaves.includes(a)} onChange={() => toggleSave(a)} />
                      save {fmt(saveBonus)}
                    </label>
                    <div className="flex gap-1">
                      <button className="btn text-xs px-1" onClick={() => logRoll(`1d20${mod >= 0 ? '+' : ''}${mod}`, `${a} check`)}>Chk</button>
                      <button className="btn text-xs px-1" onClick={() => logRoll(`1d20${saveBonus >= 0 ? '+' : ''}${saveBonus}`, `${a} save`)}>Sav</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="card">
        <h2 className="heading text-lg">Skills</h2>
        <ul className="mt-3 grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map((s) => {
            const hasProficiency = character.proficientSkills.includes(s.key);
            const bonus = abilityModifier(character.abilities[s.ability]) + (hasProficiency ? prof : 0);
            return (
              <li key={s.key} className="flex items-center justify-between rounded border border-ink/10 bg-white/60 px-2 py-1 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={hasProficiency} onChange={() => toggleSkill(s.key)} />
                  <span>{s.label}</span>
                  <span className="text-xs text-ink/50 uppercase">{s.ability}</span>
                </label>
                <button className="btn text-xs" onClick={() => logRoll(`1d20${bonus >= 0 ? '+' : ''}${bonus}`, s.label)}>
                  {fmt(bonus)}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Species Traits */}
      {speciesData && (
        <section className="card">
          <button
            className="flex w-full items-center justify-between"
            onClick={() => setShowSpeciesTraits((v) => !v)}
          >
            <h2 className="heading text-lg">{speciesData.name} Traits</h2>
            <span className="text-ink/40 text-sm">{showSpeciesTraits ? '▲ Hide' : '▼ Show'}</span>
          </button>
          {showSpeciesTraits && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-ink/50">{speciesData.size} · Speed {speciesData.speed} ft. · Languages: {speciesData.languages.join(', ')}</p>
              {speciesData.traits.map((t) => (
                <div key={t.name}>
                  <span className="text-sm font-semibold">{t.name}. </span>
                  <span className="text-sm text-ink/80">{t.description}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Class Features */}
      {classFeatures.length > 0 && (
        <section className="card">
          <button
            className="flex w-full items-center justify-between"
            onClick={() => setShowClassFeatures((v) => !v)}
          >
            <h2 className="heading text-lg">{character.class} Features (Level {character.level})</h2>
            <span className="text-ink/40 text-sm">{showClassFeatures ? '▲ Hide' : '▼ Show'}</span>
          </button>
          {showClassFeatures && (
            <div className="mt-3 space-y-2">
              {classFeatures.map((f) => (
                <div key={`${f.level}-${f.name}`} className="rounded border border-ink/10 bg-white/60 p-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold">{f.name}</span>
                    <span className="chip text-xs">Lv {f.level}</span>
                  </div>
                  <p className="text-xs text-ink/70 mt-1">{f.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Feats */}
      {(character.feats ?? []).length > 0 && (
        <section className="card">
          <h2 className="heading text-lg">Feats</h2>
          <div className="mt-3 space-y-2">
            {(character.feats ?? []).map((cf) => {
              const feat = FEATS_MAP[cf.featId];
              if (!feat) return null;
              return (
                <div key={cf.featId} className="rounded border border-ink/10 bg-white/60 p-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{feat.name}</span>
                    <span className="chip text-xs">{cf.source}</span>
                  </div>
                  <p className="text-xs text-ink/70 mt-1">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Spell Slots — full/half casters */}
      {(casterType === 'full' || casterType === 'half' || casterType === 'third') && (
        <section className="card">
          <div className="flex items-center justify-between">
            <h2 className="heading text-lg">Spell Slots</h2>
            <button onClick={resetSlots} className="btn text-xs text-ink/60">Reset (Long Rest)</button>
          </div>
          <div className="mt-3 space-y-2">
            {spellSlots.total.map((total, i) => {
              if (total === 0) return null;
              const used = spellSlots.used[i] ?? 0;
              const remaining = total - used;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm w-12 text-ink/70">{i + 1}{['st','nd','rd','th','th','th','th','th','th'][i]}</span>
                  <div className="flex gap-1 flex-1">
                    {Array.from({ length: total }, (_, j) => (
                      <button
                        key={j}
                        onClick={() => updateSlotUsed(i, j < remaining ? 1 : -1)}
                        className={`w-6 h-6 rounded-full border text-xs transition-colors ${
                          j < remaining ? 'bg-blood border-blood/70 text-parchment' : 'bg-white/50 border-ink/20'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1 items-center">
                    <button onClick={() => updateSlotUsed(i, 1)} className="btn text-xs px-1">Use</button>
                    <button onClick={() => updateSlotUsed(i, -1)} className="btn text-xs px-1">+1</button>
                  </div>
                  <span className="text-xs text-ink/50 w-12 text-right">{remaining}/{total}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Pact Magic — warlock */}
      {casterType === 'pact' && (
        <section className="card">
          <div className="flex items-center justify-between">
            <h2 className="heading text-lg">Pact Magic</h2>
            <button onClick={() => updatePactSlotUsed(-(pactSlots.used))} className="btn text-xs text-ink/60">Reset</button>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div>
              <p className="text-sm text-ink/60">Slot Level: <span className="font-semibold text-ink">{pactSlots.slotLevel}</span></p>
              <p className="text-sm text-ink/60">Slots: <span className="font-semibold text-ink">{pactSlots.total - pactSlots.used}/{pactSlots.total}</span></p>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: pactSlots.total }, (_, j) => (
                <div key={j} className={`w-8 h-8 rounded border ${j < pactSlots.total - pactSlots.used ? 'bg-blood/70 border-blood' : 'bg-white/50 border-ink/20'}`} />
              ))}
            </div>
            <div className="flex gap-1">
              <button onClick={() => updatePactSlotUsed(1)} className="btn text-xs">Use</button>
              <button onClick={() => updatePactSlotUsed(-1)} className="btn text-xs">+1</button>
            </div>
          </div>
        </section>
      )}

      {/* Known Spells */}
      {casterType !== 'none' && (
        <section className="card">
          <h2 className="heading text-lg">Known Spells</h2>
          <div className="mt-2 flex gap-2">
            <input
              className="input flex-1"
              value={newSpellInput}
              onChange={(e) => setNewSpellInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSpell()}
              placeholder="Fireball, Cure Wounds…"
            />
            <button onClick={addSpell} className="btn-primary">Add</button>
          </div>
          {(character.knownSpells ?? []).length === 0 ? (
            <p className="mt-3 text-sm text-ink/50">No spells recorded yet.</p>
          ) : (
            <ul className="mt-3 grid gap-1 sm:grid-cols-2">
              {(character.knownSpells ?? []).map((sp) => (
                <li key={sp} className="flex items-center justify-between rounded border border-ink/10 bg-white/60 px-2 py-1 text-sm">
                  <span>{sp}</span>
                  <div className="flex gap-2 items-center">
                    <Link href={`/lookup/spells?q=${encodeURIComponent(sp)}`} className="text-xs text-blood underline" target="_blank">Look up</Link>
                    <button onClick={() => removeSpell(sp)} className="text-xs text-ink/40">✕</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Inventory + Currency + Notes */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-4">
          <h2 className="heading text-lg">Inventory</h2>
          {/* Currency */}
          <div>
            <p className="label mb-1">Currency</p>
            <div className="grid grid-cols-5 gap-1 text-center text-xs">
              {(['pp', 'gp', 'ep', 'sp', 'cp'] as const).map((coin) => (
                <div key={coin}>
                  <div className="text-ink/50 uppercase mb-1">{coin}</div>
                  <input
                    type="number"
                    min={0}
                    className="input text-center px-1"
                    value={currency[coin]}
                    onChange={(e) => update({ currency: { ...currency, [coin]: Math.max(0, parseInt(e.target.value || '0', 10)) } })}
                  />
                </div>
              ))}
            </div>
          </div>
          <InventoryEditor character={character} update={update} />
        </div>
        <div className="card">
          <h2 className="heading text-lg">Notes</h2>
          <textarea
            className="input mt-2 min-h-[200px]"
            value={character.notes}
            onChange={(e) => update({ notes: e.target.value })}
            placeholder="Backstory, features, equipment notes, anything."
          />
        </div>
      </section>

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-md bg-ink text-parchment px-4 py-2 shadow-lg text-sm z-50">
          {toast}
        </div>
      )}
    </div>
  );
}

function InventoryEditor({ character, update }: { character: Character; update: (p: Partial<Character>) => void }) {
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
      <div className="flex gap-2">
        <input className="input flex-1" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="Longsword, potion…" />
        <input type="number" className="input w-16" value={qty} onChange={(e) => setQty(parseInt(e.target.value || '1', 10) || 1)} />
        <button onClick={add} className="btn-primary">Add</button>
      </div>
      {character.inventory.length === 0 ? (
        <p className="mt-3 text-sm text-ink/60">Nothing in your pack yet.</p>
      ) : (
        <ul className="mt-3 space-y-1">
          {character.inventory.map((it, i) => (
            <li key={i} className="flex items-center justify-between rounded border border-ink/10 bg-white/60 px-2 py-1 text-sm">
              <span>{it.qty}× {it.name}</span>
              <button onClick={() => remove(i)} className="text-xs text-blood">Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
