'use client';

import Link from 'next/link';
import { useLocalState } from '@/lib/storage';
import type { Character } from '@/lib/types';
import { newCharacter } from '@/lib/characters';

export default function CharactersPage() {
  const [characters, setCharacters] = useLocalState<Character[]>('characters', []);

  function create() {
    setCharacters((cs) => [newCharacter(), ...cs]);
  }

  function remove(id: string) {
    if (!confirm('Delete this character? This cannot be undone.')) return;
    setCharacters((cs) => cs.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="heading text-3xl text-blood">Characters</h1>
        <button onClick={create} className="btn-primary">+ New character</button>
      </div>

      {characters.length === 0 ? (
        <div className="card text-center">
          <p className="text-ink/70">No characters yet. Create your first adventurer!</p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {characters.map((c) => (
            <li key={c.id} className="card flex items-center justify-between">
              <Link href={`/characters/edit/?id=${c.id}`} className="flex-1">
                <div className="heading text-lg text-blood">{c.name}</div>
                <div className="text-sm text-ink/70">
                  Level {c.level} {c.race} {c.class}
                </div>
                <div className="mt-1 text-xs text-ink/50">
                  HP {c.hp.current}/{c.hp.max} · AC {c.ac}
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
