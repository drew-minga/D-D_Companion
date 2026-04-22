'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useLocalState } from '@/lib/storage';
import type { Character } from '@/lib/types';
import { migrateCharacter, newCharacter } from '@/lib/characters';
import { SPECIES_MAP } from '@/lib/data/species';

function speciesLabel(c: Character): string {
  if (c.species) return SPECIES_MAP[c.species]?.name ?? c.species;
  return c.race ?? '';
}

export default function CharactersPage() {
  const [rawCharacters, setRawCharacters] = useLocalState<Character[]>('characters', []);
  const characters = useMemo(() => rawCharacters.map(migrateCharacter), [rawCharacters]);

  function quickCreate() {
    setRawCharacters((cs) => [newCharacter(), ...cs]);
  }

  function remove(id: string) {
    if (!confirm('Delete this character? This cannot be undone.')) return;
    setRawCharacters((cs) => cs.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="heading text-3xl text-blood">Characters</h1>
        <div className="flex gap-2">
          <button onClick={quickCreate} className="btn text-sm text-ink/60">Quick Create</button>
          <Link href="/characters/new" className="btn-primary">+ New Character</Link>
        </div>
      </div>

      {characters.length === 0 ? (
        <div className="card text-center space-y-3">
          <p className="text-ink/70">No characters yet. Start with the 5.5e creation wizard!</p>
          <Link href="/characters/new" className="btn-primary inline-block">Create Your First Character</Link>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {characters.map((c) => (
            <li key={c.id} className="card flex items-center justify-between">
              <Link href={`/characters/edit/?id=${c.id}`} className="flex-1">
                <div className="heading text-lg text-blood">{c.name}</div>
                <div className="text-sm text-ink/70">
                  Level {c.level} {speciesLabel(c)} {c.class}
                  {c.subclass ? ` (${c.subclass})` : ''}
                </div>
                <div className="mt-1 text-xs text-ink/50">
                  HP {c.hp.current}/{c.hp.max} · AC {c.ac}
                  {(c.exhaustion ?? 0) > 0 && <span className="ml-2 text-amber-700">Exhaustion {c.exhaustion}</span>}
                  {c.heroicInspiration && <span className="ml-2 text-gold">★ Inspired</span>}
                </div>
              </Link>
              <button onClick={() => remove(c.id)} className="btn text-xs text-blood">Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
