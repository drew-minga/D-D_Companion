'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ApiList, ApiRef } from '@/lib/api';

interface Props {
  title: string;
  fetcher: () => Promise<ApiList>;
  onSelect: (ref: ApiRef) => void;
  selectedIndex?: string | null;
  initialQuery?: string;
}

export default function LookupList({ title, fetcher, onSelect, selectedIndex, initialQuery = '' }: Props) {
  const [data, setData] = useState<ApiRef[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then((d) => {
        if (!cancelled) setData(d.results);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [fetcher]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((r) => r.name.toLowerCase().includes(q));
  }, [data, query]);

  return (
    <aside className="card flex h-full min-h-[60vh] flex-col">
      <h2 className="heading text-lg">{title}</h2>
      <input
        className="input mt-2"
        placeholder={`Search ${title.toLowerCase()}...`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {error && <p className="mt-2 text-sm text-blood">Failed to load: {error}</p>}
      {!data && !error && <p className="mt-3 text-sm text-ink/60">Loading…</p>}
      {data && (
        <ul className="mt-3 flex-1 overflow-auto pr-1 space-y-1">
          {filtered.map((r) => (
            <li key={r.index}>
              <button
                onClick={() => onSelect(r)}
                className={
                  'w-full rounded border px-2 py-1 text-left text-sm transition ' +
                  (selectedIndex === r.index
                    ? 'border-blood bg-blood/10'
                    : 'border-ink/10 bg-white/60 hover:bg-white')
                }
              >
                {r.name}
              </button>
            </li>
          ))}
          {filtered.length === 0 && <li className="text-sm text-ink/60">No matches.</li>}
        </ul>
      )}
    </aside>
  );
}
