'use client';

import { useCallback, useEffect, useState } from 'react';
import LookupList from '@/components/LookupList';
import { api, type ApiRef, type MonsterDetail } from '@/lib/api';
import { abilityModifier } from '@/lib/dice';

function fmt(n: number) {
  return n >= 0 ? `+${n}` : `${n}`;
}

export default function MonstersLookup() {
  const [selected, setSelected] = useState<ApiRef | null>(null);
  const [detail, setDetail] = useState<MonsterDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetcher = useCallback(() => api.listMonsters(), []);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .getMonster(selected.index)
      .then((d) => {
        if (!cancelled) setDetail(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selected]);

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(240px,_1fr)_2fr]">
      <LookupList title="Monsters" fetcher={fetcher} onSelect={setSelected} selectedIndex={selected?.index} />
      <section className="card min-h-[60vh]">
        {!selected && <p className="text-ink/60">Select a monster to view its stat block.</p>}
        {selected && loading && <p className="text-ink/60">Loading {selected.name}…</p>}
        {error && <p className="text-blood">Failed to load: {error}</p>}
        {detail && !loading && (
          <article>
            <h2 className="heading text-2xl text-blood">{detail.name}</h2>
            <p className="text-sm italic text-ink/70">
              {detail.size} {detail.type}, {detail.alignment}
            </p>
            <hr className="my-3 border-ink/15" />
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="label">Armor Class</dt>
              <dd>
                {detail.armor_class.map((a) => `${a.value} (${a.type})`).join(', ')}
              </dd>
              <dt className="label">Hit Points</dt>
              <dd>
                {detail.hit_points} ({detail.hit_dice})
              </dd>
              <dt className="label">Speed</dt>
              <dd>
                {Object.entries(detail.speed)
                  .map(([k, v]) => `${k} ${v}`)
                  .join(', ')}
              </dd>
              <dt className="label">Challenge</dt>
              <dd>
                {detail.challenge_rating} ({detail.xp} XP)
              </dd>
            </dl>
            <hr className="my-3 border-ink/15" />
            <table className="w-full text-center text-sm">
              <thead>
                <tr className="text-ink/60">
                  <th>STR</th>
                  <th>DEX</th>
                  <th>CON</th>
                  <th>INT</th>
                  <th>WIS</th>
                  <th>CHA</th>
                </tr>
              </thead>
              <tbody>
                <tr className="font-medium">
                  {[detail.strength, detail.dexterity, detail.constitution, detail.intelligence, detail.wisdom, detail.charisma].map(
                    (s, i) => (
                      <td key={i}>
                        {s} ({fmt(abilityModifier(s))})
                      </td>
                    ),
                  )}
                </tr>
              </tbody>
            </table>
            {detail.special_abilities && detail.special_abilities.length > 0 && (
              <section className="mt-4">
                <h3 className="heading text-lg">Traits</h3>
                <ul className="mt-1 space-y-2 text-sm">
                  {detail.special_abilities.map((a) => (
                    <li key={a.name}>
                      <strong>{a.name}.</strong> {a.desc}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {detail.actions && detail.actions.length > 0 && (
              <section className="mt-4">
                <h3 className="heading text-lg">Actions</h3>
                <ul className="mt-1 space-y-2 text-sm">
                  {detail.actions.map((a) => (
                    <li key={a.name}>
                      <strong>{a.name}.</strong> {a.desc}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        )}
      </section>
    </div>
  );
}
