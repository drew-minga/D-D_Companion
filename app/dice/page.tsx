'use client';

import { useState } from 'react';
import { useLocalState } from '@/lib/storage';
import { roll, rollAdvantage, rollDisadvantage, uid } from '@/lib/dice';
import type { RollResult } from '@/lib/types';

const QUICK = [4, 6, 8, 10, 12, 20, 100];

export default function DicePage() {
  const [expr, setExpr] = useState('1d20');
  const [modifier, setModifier] = useState(0);
  const [history, setHistory] = useLocalState<RollResult[]>('dice:history', []);
  const [error, setError] = useState<string | null>(null);

  function push(expression: string, outcome: { rolls: number[]; total: number; breakdown: string }, tag?: string) {
    const next: RollResult = {
      id: uid(),
      expression,
      rolls: outcome.rolls,
      total: outcome.total,
      breakdown: outcome.breakdown,
      at: Date.now(),
      tag,
    };
    setHistory((h) => [next, ...h].slice(0, 50));
  }

  function doRoll(expression: string) {
    const o = roll(expression);
    if (!o) {
      setError(`Couldn't parse "${expression}". Try e.g. 2d6+3.`);
      return;
    }
    setError(null);
    push(expression, o);
  }

  function doQuick(sides: number) {
    const expression = `1d${sides}${modifier ? (modifier > 0 ? `+${modifier}` : `${modifier}`) : ''}`;
    doRoll(expression);
  }

  function doAdv() {
    const o = rollAdvantage(20, modifier);
    push(`1d20 adv${modifier ? (modifier > 0 ? `+${modifier}` : `${modifier}`) : ''}`, o, 'advantage');
    setError(null);
  }

  function doDis() {
    const o = rollDisadvantage(20, modifier);
    push(`1d20 dis${modifier ? (modifier > 0 ? `+${modifier}` : `${modifier}`) : ''}`, o, 'disadvantage');
    setError(null);
  }

  return (
    <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
      <section className="space-y-6">
        <div className="card">
          <h1 className="heading text-2xl text-blood">Dice Roller</h1>
          <p className="mt-1 text-sm text-ink/70">Use standard dice notation (e.g. <code>2d6+3</code>) or the quick buttons.</p>

          <form
            className="mt-4 flex flex-wrap gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              doRoll(expr.trim());
            }}
          >
            <input
              className="input flex-1 min-w-[180px]"
              value={expr}
              onChange={(e) => setExpr(e.target.value)}
              placeholder="e.g. 2d6+3"
              aria-label="Dice expression"
            />
            <button type="submit" className="btn-primary">Roll</button>
          </form>
          {error && <p className="mt-2 text-sm text-blood">{error}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <label className="label">Mod</label>
            <input
              type="number"
              className="input w-20"
              value={modifier}
              onChange={(e) => setModifier(parseInt(e.target.value || '0', 10) || 0)}
              aria-label="Modifier"
            />
            <div className="ml-2 flex flex-wrap gap-1">
              {QUICK.map((s) => (
                <button key={s} onClick={() => doQuick(s)} className="btn">d{s}</button>
              ))}
            </div>
            <div className="ml-auto flex gap-1">
              <button onClick={doAdv} className="btn-gold">Advantage</button>
              <button onClick={doDis} className="btn">Disadvantage</button>
            </div>
          </div>
        </div>

        {history[0] && (
          <div className="card">
            <div className="label">Last roll</div>
            <div className="mt-1 flex flex-wrap items-baseline gap-3">
              <span className="heading text-5xl text-blood">{history[0].total}</span>
              <span className="text-sm text-ink/70">{history[0].expression}</span>
              {history[0].tag && <span className="chip">{history[0].tag}</span>}
            </div>
            <div className="mt-2 text-sm text-ink/70">{history[0].breakdown}</div>
          </div>
        )}
      </section>

      <aside className="card">
        <div className="flex items-center justify-between">
          <h2 className="heading text-lg">History</h2>
          {history.length > 0 && (
            <button onClick={() => setHistory([])} className="btn text-xs">Clear</button>
          )}
        </div>
        {history.length === 0 ? (
          <p className="mt-2 text-sm text-ink/60">No rolls yet.</p>
        ) : (
          <ul className="mt-3 space-y-2 max-h-[60vh] overflow-auto pr-1">
            {history.map((r) => (
              <li key={r.id} className="rounded border border-ink/10 bg-white/60 p-2 text-sm">
                <div className="flex items-baseline justify-between">
                  <span className="heading text-lg">{r.total}</span>
                  <span className="text-xs text-ink/50">{new Date(r.at).toLocaleTimeString()}</span>
                </div>
                <div className="text-xs text-ink/70">{r.expression}</div>
                <div className="text-xs text-ink/50">{r.breakdown}</div>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
