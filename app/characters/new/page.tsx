'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocalState } from '@/lib/storage';
import { createCharacterFromWizard, type WizardOutput } from '@/lib/characters';
import type { Ability, Character } from '@/lib/types';
import { ABILITIES, ABILITY_LABELS, SKILLS } from '@/lib/types';
import { abilityModifier, proficiencyBonus } from '@/lib/dice';
import { SPECIES } from '@/lib/data/species';
import { CLASSES } from '@/lib/data/classes';
import { BACKGROUNDS } from '@/lib/data/backgrounds';
import { FEATS_MAP } from '@/lib/data/feats';

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

const ALIGNMENTS = [
  'Lawful Good', 'Neutral Good', 'Chaotic Good',
  'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil',
];

function fmt(n: number) {
  return n >= 0 ? `+${n}` : `${n}`;
}

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <span className="relative group/tip inline-flex items-center">
      {children}
      <span className="pointer-events-none absolute bottom-full left-0 mb-1.5 z-20 hidden group-hover/tip:block w-56 rounded-md bg-ink text-parchment text-xs px-2.5 py-2 shadow-lg leading-snug">
        {text}
        <span className="absolute top-full left-3 -mt-px border-4 border-transparent border-t-ink" />
      </span>
    </span>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all ${
            i < current ? 'w-6 bg-gold' : i === current ? 'w-8 bg-blood' : 'w-4 bg-ink/20'
          }`}
        />
      ))}
    </div>
  );
}

export default function NewCharacterPage() {
  const router = useRouter();
  const [characters, setCharacters] = useLocalState<Character[]>('characters', []);

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [alignment, setAlignment] = useState('');
  const [speciesId, setSpeciesId] = useState('');
  const [classId, setClassId] = useState('');
  const [chosenClassSkills, setChosenClassSkills] = useState<string[]>([]);
  const [backgroundId, setBackgroundId] = useState('');
  const [asiMode, setAsiMode] = useState<'twoOne' | 'threeOne'>('twoOne');
  const [asiPlus2, setAsiPlus2] = useState<Ability | null>(null);
  const [asiPlus1, setAsiPlus1] = useState<Ability | null>(null);
  const [baseAbilities, setBaseAbilities] = useState<Record<Ability, number>>({
    str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8,
  });
  const [arrayAssignments, setArrayAssignments] = useState<Record<Ability, number | null>>({
    str: null, dex: null, con: null, int: null, wis: null, cha: null,
  });
  const [abilityMode, setAbilityMode] = useState<'array' | 'manual' | 'roll'>('array');
  const [rollDice, setRollDice] = useState<Record<Ability, number[]>>(
    { str: [], dex: [], con: [], int: [], wis: [], cha: [] },
  );

  const selectedSpecies = SPECIES.find((s) => s.id === speciesId);
  const selectedClass = CLASSES.find((c) => c.id === classId);
  const selectedBackground = BACKGROUNDS.find((b) => b.id === backgroundId);

  const STEPS = ['Identity', 'Species', 'Class', 'Background', 'Abilities'];

  function canProceed(): boolean {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return speciesId !== '';
    if (step === 2) return classId !== '' && chosenClassSkills.length === (selectedClass?.skillChoiceCount ?? 0);
    if (step === 3) {
      if (!backgroundId) return false;
      if (asiMode === 'twoOne') return asiPlus2 !== null && asiPlus1 !== null;
      return true;
    }
    if (step === 4) {
      if (abilityMode === 'array') return Object.values(arrayAssignments).every((v) => v !== null);
      if (abilityMode === 'roll') return ABILITIES.every((ab) => rollDice[ab].length > 0);
      return true;
    }
    return true;
  }

  function handleClassSkillToggle(skill: string) {
    if (!selectedClass) return;
    const bgSkills: string[] = selectedBackground ? [...selectedBackground.skillProficiencies] : [];
    const available = selectedClass.skillChoicePool.filter((s) => !bgSkills.includes(s));
    const max = selectedClass.skillChoiceCount;
    if (chosenClassSkills.includes(skill)) {
      setChosenClassSkills((prev) => prev.filter((s) => s !== skill));
    } else if (chosenClassSkills.length < max) {
      setChosenClassSkills((prev) => [...prev, skill]);
    }
    void available;
  }

  function handleArrayAssign(ability: Ability, value: number | null) {
    setArrayAssignments((prev) => {
      const next = { ...prev };
      // Remove existing assignment for this value
      if (value !== null) {
        for (const k of ABILITIES) {
          if (next[k] === value) next[k] = null;
        }
      }
      next[ability] = value;
      return next;
    });
  }

  function d6(): number {
    if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      return (buf[0] % 6) + 1;
    }
    return Math.floor(Math.random() * 6) + 1;
  }

  function roll4d6(): { dice: number[]; score: number } {
    const dice = [d6(), d6(), d6(), d6()];
    const sorted = [...dice].sort((a, b) => a - b);
    const score = sorted[1] + sorted[2] + sorted[3]; // drop sorted[0] (lowest)
    return { dice, score };
  }

  function rollSingle(ab: Ability) {
    const { dice, score } = roll4d6();
    setRollDice((prev) => ({ ...prev, [ab]: dice }));
    setBaseAbilities((prev) => ({ ...prev, [ab]: score }));
  }

  function rollAllAbilities() {
    const newDice = { ...rollDice };
    const newScores = { ...baseAbilities };
    for (const ab of ABILITIES) {
      const { dice, score } = roll4d6();
      newDice[ab] = dice;
      newScores[ab] = score;
    }
    setRollDice(newDice);
    setBaseAbilities(newScores);
  }

  function getEffectiveAbilities(): Record<Ability, number> {
    const base: Record<Ability, number> = abilityMode === 'array'
      ? { ...baseAbilities }
      : { ...baseAbilities };

    if (abilityMode === 'array') {
      for (const ab of ABILITIES) {
        base[ab] = arrayAssignments[ab] ?? 8;
      }
    }
    return base;
  }

  function getPreviewAbilities(): Record<Ability, number> {
    const base = getEffectiveAbilities();
    if (!selectedBackground) return base;
    const result = { ...base };
    if (asiMode === 'twoOne' && asiPlus2 && asiPlus1) {
      result[asiPlus2] = (result[asiPlus2] ?? 10) + 2;
      result[asiPlus1] = (result[asiPlus1] ?? 10) + 1;
    } else if (asiMode === 'threeOne') {
      for (const ab of selectedBackground.abilityScoreIncreases.abilities) {
        result[ab] = (result[ab] ?? 10) + 1;
      }
    }
    return result;
  }

  function usedArrayValues(): number[] {
    return Object.values(arrayAssignments).filter((v) => v !== null) as number[];
  }

  function handleCreate() {
    const effectiveAbilities = getEffectiveAbilities();
    const output: WizardOutput = {
      name,
      speciesId,
      classId,
      backgroundId,
      alignment,
      baseAbilities: effectiveAbilities,
      asiMode,
      asiPlus2,
      asiPlus1,
      chosenClassSkills,
    };
    const newChar = createCharacterFromWizard(output);
    setCharacters((cs) => [newChar, ...cs]);
    router.push(`/characters/edit/?id=${newChar.id}`);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="heading text-3xl text-blood">New Character</h1>
        <button onClick={() => router.push('/characters')} className="btn text-sm text-ink/60">
          ← Cancel
        </button>
      </div>

      <StepIndicator current={step} total={STEPS.length} />

      <div className="text-center text-sm text-ink/50 -mt-4 mb-2">
        Step {step + 1} of {STEPS.length}: <span className="text-ink font-semibold">{STEPS[step]}</span>
      </div>

      {/* Step 0: Identity */}
      {step === 0 && (
        <div className="card space-y-4">
          <h2 className="heading text-xl">Who are you?</h2>
          <div>
            <label className="label">Character Name</label>
            <input
              className="input mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Thorin Ironfist, Lyra Moonwhisper…"
              autoFocus
            />
          </div>
          <div>
            <label className="label">Alignment <span className="text-ink/40">(optional)</span></label>
            <select className="input mt-1" value={alignment} onChange={(e) => setAlignment(e.target.value)}>
              <option value="">— choose —</option>
              {ALIGNMENTS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Step 1: Species */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm text-ink/60">
            In 5.5e, your species grants traits and features — ability score increases come from your Background.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SPECIES.map((sp) => (
              <button
                key={sp.id}
                onClick={() => setSpeciesId(sp.id)}
                className={`card text-left transition-all ${
                  speciesId === sp.id ? 'ring-2 ring-gold bg-gold/10' : 'hover:bg-white/80'
                }`}
              >
                <div className="heading text-base text-blood">{sp.name}</div>
                <div className="text-xs text-ink/60 mt-1">{sp.size} · Speed {sp.speed} ft.</div>
                <div className="text-xs text-ink/50 mt-1">{sp.traits.slice(0, 2).map((t) => t.name).join(', ')}{sp.traits.length > 2 ? '…' : ''}</div>
              </button>
            ))}
          </div>

          {selectedSpecies && (
            <div className="card bg-parchment/60">
              <h3 className="heading text-lg text-blood">{selectedSpecies.name}</h3>
              <p className="text-xs text-ink/50 mb-3">{selectedSpecies.size} · Speed {selectedSpecies.speed} ft. · Languages: {selectedSpecies.languages.join(', ')}</p>
              <div className="space-y-2">
                {selectedSpecies.traits.map((t) => (
                  <div key={t.name}>
                    <span className="text-sm font-semibold">{t.name}. </span>
                    <span className="text-sm text-ink/80">{t.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Class */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CLASSES.map((cls) => (
              <button
                key={cls.id}
                onClick={() => { setClassId(cls.id); setChosenClassSkills([]); }}
                className={`card text-left transition-all ${
                  classId === cls.id ? 'ring-2 ring-gold bg-gold/10' : 'hover:bg-white/80'
                }`}
              >
                <div className="heading text-base text-blood">{cls.name}</div>
                <div className="text-xs text-ink/60 mt-1">d{cls.hitDie} · {cls.primaryAbility}</div>
                <div className="text-xs text-ink/50 mt-1">
                  {cls.spellcastingType !== 'none' ? `✦ ${cls.spellcastingType} caster` : '⚔ martial'}
                </div>
              </button>
            ))}
          </div>

          {selectedClass && (
            <div className="card bg-parchment/60 space-y-3">
              <h3 className="heading text-lg text-blood">{selectedClass.name}</h3>
              <div className="text-xs text-ink/60 flex flex-wrap gap-2">
                <span>Hit Die: d{selectedClass.hitDie}</span>
                <span>· Saves: {selectedClass.savingThrows.map((s) => ABILITY_LABELS[s]).join(', ')}</span>
                <span>· Armor: {selectedClass.armorProficiencies.join(', ') || 'None'}</span>
              </div>

              <div>
                <p className="text-sm font-semibold mb-1">
                  Choose {selectedClass.skillChoiceCount} skills:
                  <span className="font-normal text-ink/60"> ({chosenClassSkills.length}/{selectedClass.skillChoiceCount} selected)</span>
                </p>
                <div className="grid gap-1 sm:grid-cols-2">
                  {selectedClass.skillChoicePool.map((sk) => {
                    const alreadyFromBg = selectedBackground?.skillProficiencies.includes(sk) ?? false;
                    const checked = chosenClassSkills.includes(sk) || alreadyFromBg;
                    const disabled = alreadyFromBg || (!chosenClassSkills.includes(sk) && chosenClassSkills.length >= selectedClass.skillChoiceCount);
                    const skillDef = SKILLS.find((s) => s.key === sk);
                    return (
                      <label key={sk} className={`flex items-center gap-2 text-sm rounded px-2 py-1 ${disabled && !alreadyFromBg ? 'opacity-40' : ''} ${alreadyFromBg ? 'text-ink/40 italic' : ''}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={disabled}
                          onChange={() => !alreadyFromBg && handleClassSkillToggle(sk)}
                        />
                        {skillDef?.description ? (
                          <Tooltip text={`${ABILITY_LABELS[skillDef.ability]} — ${skillDef.description}`}>
                            <span className="capitalize underline decoration-dotted decoration-ink/30 cursor-help">
                              {sk.replace(/-/g, ' ')}
                            </span>
                          </Tooltip>
                        ) : (
                          <span className="capitalize">{sk.replace(/-/g, ' ')}</span>
                        )}
                        {alreadyFromBg && <span className="text-xs">(from background)</span>}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-1">Level 1–3 Features:</p>
                <ul className="space-y-1">
                  {selectedClass.features.filter((f) => f.level <= 3).map((f) => (
                    <li key={f.name} className="text-sm">
                      <span className="font-semibold">{f.name}</span>
                      <span className="text-ink/60"> (Lv {f.level}) — </span>
                      <span className="text-ink/80">{f.description.slice(0, 100)}{f.description.length > 100 ? '…' : ''}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Background */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm text-ink/60">
            In 5.5e, your Background provides your ability score increases (+2/+1 or three +1s), an Origin Feat, and two skill proficiencies.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BACKGROUNDS.map((bg) => {
              const feat = FEATS_MAP[bg.originFeatId];
              return (
                <button
                  key={bg.id}
                  onClick={() => { setBackgroundId(bg.id); setAsiMode('twoOne'); setAsiPlus2(null); setAsiPlus1(null); }}
                  className={`card text-left transition-all ${
                    backgroundId === bg.id ? 'ring-2 ring-gold bg-gold/10' : 'hover:bg-white/80'
                  }`}
                >
                  <div className="heading text-base text-blood">{bg.name}</div>
                  <div className="text-xs text-ink/60 mt-1">{bg.skillProficiencies.join(', ').replace(/-/g, ' ')}</div>
                  <div className="text-xs text-ink/50 mt-1">Feat: {feat?.name ?? bg.originFeatId}</div>
                </button>
              );
            })}
          </div>

          {selectedBackground && (
            <div className="card bg-parchment/60 space-y-3">
              <h3 className="heading text-lg text-blood">{selectedBackground.name}</h3>
              <p className="text-sm text-ink/70">{selectedBackground.description}</p>

              <div>
                <p className="text-sm font-semibold mb-2">Ability Score Increases — choose distribution:</p>
                <div className="space-y-1">
                  {selectedBackground.abilityScoreIncreases.abilities.flatMap((a, i, arr) =>
                    arr.filter((_, j) => j !== i).map((b) => (
                      <label key={`${a}-${b}`} className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="asi"
                          checked={asiMode === 'twoOne' && asiPlus2 === a && asiPlus1 === b}
                          onChange={() => { setAsiMode('twoOne'); setAsiPlus2(a); setAsiPlus1(b); }}
                        />
                        +2 {ABILITY_LABELS[a]}, +1 {ABILITY_LABELS[b]}
                      </label>
                    ))
                  )}
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="asi"
                      checked={asiMode === 'threeOne'}
                      onChange={() => { setAsiMode('threeOne'); setAsiPlus2(null); setAsiPlus1(null); }}
                    />
                    +1 each: {selectedBackground.abilityScoreIncreases.abilities.map((a) => ABILITY_LABELS[a]).join(', ')}
                  </label>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold">Skills: </p>
                <p className="text-sm text-ink/70">{selectedBackground.skillProficiencies.join(', ').replace(/-/g, ' ')}</p>
              </div>

              {(selectedBackground.toolProficiency || selectedBackground.languageProficiency) && (
                <div>
                  <p className="text-sm font-semibold">Also grants: </p>
                  <p className="text-sm text-ink/70">
                    {[selectedBackground.toolProficiency, selectedBackground.languageProficiency].filter(Boolean).join(' · ')}
                  </p>
                </div>
              )}

              {FEATS_MAP[selectedBackground.originFeatId] && (
                <div>
                  <p className="text-sm font-semibold">Origin Feat: {FEATS_MAP[selectedBackground.originFeatId].name}</p>
                  <p className="text-sm text-ink/70">{FEATS_MAP[selectedBackground.originFeatId].description}</p>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    {FEATS_MAP[selectedBackground.originFeatId].benefits.map((b, i) => (
                      <li key={i} className="text-xs text-ink/70">{b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 4: Abilities */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="abilityMode" checked={abilityMode === 'array'} onChange={() => setAbilityMode('array')} />
              Standard Array (15, 14, 13, 12, 10, 8)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="abilityMode" checked={abilityMode === 'roll'} onChange={() => setAbilityMode('roll')} />
              Roll 4d6 Drop Lowest
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="abilityMode" checked={abilityMode === 'manual'} onChange={() => setAbilityMode('manual')} />
              Manual Entry
            </label>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="heading text-base">Assign Ability Scores</h3>
              {abilityMode === 'roll' && (
                <button onClick={rollAllAbilities} className="btn-gold text-sm px-3 py-1">
                  ↻ Roll All 6
                </button>
              )}
            </div>
            {selectedBackground && (
              <p className="text-xs text-ink/60 mb-3">
                Background ASIs (+2/+1 or three +1s) are previewed below but applied at character creation.
              </p>
            )}
            {abilityMode === 'roll' && (
              <p className="text-xs text-ink/60 mb-3">
                Roll 4d6 for each ability — the lowest die is dropped automatically.
              </p>
            )}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ABILITIES.map((ab) => {
                const previewScore = getPreviewAbilities()[ab];
                const dice = rollDice[ab];
                const hasRolled = dice.length > 0;
                const sortedDice = hasRolled ? [...dice].sort((a, b) => a - b) : [];
                const rolledBase = hasRolled ? sortedDice[1] + sortedDice[2] + sortedDice[3] : 0;
                const baseScore = abilityMode === 'array'
                  ? (arrayAssignments[ab] ?? 8)
                  : (baseAbilities[ab] ?? 10);
                const asiBonus = previewScore - (abilityMode === 'roll' ? rolledBase : baseScore);
                return (
                  <div key={ab} className="rounded-md border border-ink/15 bg-white/70 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="label">{ABILITY_LABELS[ab]}</div>
                      {abilityMode === 'roll' && (
                        <button onClick={() => rollSingle(ab)} className="btn text-xs py-0.5 px-2">
                          {hasRolled ? '↻ Reroll' : '↻ Roll'}
                        </button>
                      )}
                    </div>

                    {abilityMode === 'array' && (
                      <select
                        className="input"
                        value={arrayAssignments[ab] ?? ''}
                        onChange={(e) => handleArrayAssign(ab, e.target.value === '' ? null : parseInt(e.target.value, 10))}
                      >
                        <option value="">—</option>
                        {STANDARD_ARRAY.map((v) => (
                          <option key={v} value={v} disabled={usedArrayValues().includes(v) && arrayAssignments[ab] !== v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    )}

                    {abilityMode === 'manual' && (
                      <input
                        type="number"
                        min={3}
                        max={18}
                        className="input"
                        value={baseAbilities[ab]}
                        onChange={(e) => setBaseAbilities((prev) => ({ ...prev, [ab]: Math.max(3, Math.min(18, parseInt(e.target.value || '10', 10))) }))}
                      />
                    )}

                    {abilityMode === 'roll' && (
                      hasRolled ? (
                        <div className="flex gap-1 flex-wrap mt-1">
                          {sortedDice.map((d, i) => (
                            <span
                              key={i}
                              title={i === 0 ? 'Dropped (lowest)' : 'Kept'}
                              className={`inline-flex items-center justify-center w-7 h-7 rounded border text-sm font-bold ${
                                i === 0
                                  ? 'text-ink/25 border-ink/15 bg-white/40 line-through'
                                  : 'text-ink border-ink/40 bg-white'
                              }`}
                            >
                              {d}
                            </span>
                          ))}
                          <span className="text-xs text-ink/50 self-center ml-1">= {rolledBase}</span>
                        </div>
                      ) : (
                        <div className="text-center text-ink/35 text-sm py-1">— not rolled —</div>
                      )
                    )}

                    <div className="mt-2 text-center">
                      <span className="heading text-xl">{abilityMode === 'roll' && !hasRolled ? '?' : previewScore}</span>
                      {asiBonus > 0 && hasRolled && <span className="text-xs text-green-700 ml-1">(+{asiBonus} bg)</span>}
                      {asiBonus > 0 && abilityMode !== 'roll' && <span className="text-xs text-green-700 ml-1">(+{asiBonus} bg)</span>}
                      {(abilityMode !== 'roll' || hasRolled) && (
                        <span className="text-xs text-ink/50 ml-2">{fmt(abilityModifier(previewScore))}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary preview */}
          <div className="card bg-parchment/60">
            <h3 className="heading text-lg text-blood mb-3">Character Summary</h3>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div><span className="font-semibold">Name:</span> {name || '—'}</div>
              <div><span className="font-semibold">Alignment:</span> {alignment || '—'}</div>
              <div><span className="font-semibold">Species:</span> {selectedSpecies?.name ?? '—'}</div>
              <div><span className="font-semibold">Class:</span> {selectedClass?.name ?? '—'} (d{selectedClass?.hitDie})</div>
              <div><span className="font-semibold">Background:</span> {selectedBackground?.name ?? '—'}</div>
              <div><span className="font-semibold">Origin Feat:</span> {selectedBackground ? (FEATS_MAP[selectedBackground.originFeatId]?.name ?? '—') : '—'}</div>
              <div><span className="font-semibold">Saves:</span> {selectedClass?.savingThrows.map((s) => ABILITY_LABELS[s]).join(', ') ?? '—'}</div>
              <div><span className="font-semibold">Prof. Bonus:</span> {fmt(proficiencyBonus(1))}</div>
            </div>

            {selectedClass && (
              <div className="mt-3">
                <p className="text-sm font-semibold mb-1">Starting HP:</p>
                <p className="text-sm text-ink/70">
                  {selectedClass.hitDie} (max) + {fmt(abilityModifier(getPreviewAbilities().con))} CON = <strong>{Math.max(1, selectedClass.hitDie + abilityModifier(getPreviewAbilities().con))}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="btn disabled:opacity-30"
        >
          ← Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="btn-primary disabled:opacity-40"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleCreate}
            disabled={!canProceed()}
            className="btn-gold disabled:opacity-40"
          >
            Create Character ✦
          </button>
        )}
      </div>
    </div>
  );
}
