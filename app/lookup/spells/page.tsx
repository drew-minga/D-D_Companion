'use client';

import { useCallback, useEffect, useState } from 'react';
import LookupList from '@/components/LookupList';
import { api, type ApiRef, type SpellDetail } from '@/lib/api';

export default function SpellsLookup() {
  const [selected, setSelected] = useState<ApiRef | null>(null);
  const [detail, setDetail] = useState<SpellDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetcher = useCallback(() => api.listSpells(), []);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .getSpell(selected.index)
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
      <LookupList title="Spells" fetcher={fetcher} onSelect={setSelected} selectedIndex={selected?.index} />
      <section className="card min-h-[60vh]">
        {!selected && <p className="text-ink/60">Select a spell to view details.</p>}
        {selected && loading && <p className="text-ink/60">Loading {selected.name}…</p>}
        {error && <p className="text-blood">Failed to load: {error}</p>}
        {detail && !loading && (
          <article className="prose prose-sm max-w-none">
            <h2 className="heading text-2xl text-blood">{detail.name}</h2>
            <p className="text-sm text-ink/70 italic">
              {detail.level === 0 ? 'Cantrip' : `Level ${detail.level}`} · {detail.school.name}
              {detail.ritual ? ' · Ritual' : ''}
              {detail.concentration ? ' · Concentration' : ''}
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <dt className="label">Casting time</dt>
              <dd>{detail.casting_time}</dd>
              <dt className="label">Range</dt>
              <dd>{detail.range}</dd>
              <dt className="label">Components</dt>
              <dd>{detail.components.join(', ')}</dd>
              <dt className="label">Duration</dt>
              <dd>{detail.duration}</dd>
              <dt className="label">Classes</dt>
              <dd>{detail.classes.map((c) => c.name).join(', ')}</dd>
            </dl>
            <div className="mt-4 space-y-2 text-sm leading-relaxed">
              {detail.desc.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {detail.higher_level && detail.higher_level.length > 0 && (
              <div className="mt-3 rounded border border-ink/10 bg-white/60 p-3 text-sm">
                <strong>At higher levels.</strong>{' '}
                {detail.higher_level.map((p, i) => (
                  <span key={i}>{p}</span>
                ))}
              </div>
            )}
          </article>
        )}
      </section>
    </div>
  );
}
