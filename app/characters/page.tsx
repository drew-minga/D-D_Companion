'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useLocalState } from '@/lib/storage';
import type { Ability, Character } from '@/lib/types';
import { SKILLS, ABILITIES, ABILITY_LABELS } from '@/lib/types';
import { migrateCharacter, newCharacter } from '@/lib/characters';
import { SPECIES_MAP } from '@/lib/data/species';
import { abilityModifier, proficiencyBonus } from '@/lib/dice';
import { FEATS_MAP } from '@/lib/data/feats';

function speciesLabel(c: Character): string {
  if (c.species) return SPECIES_MAP[c.species]?.name ?? c.species;
  return c.race ?? '';
}

function fmtMod(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function exportJson(c: Character) {
  const blob = new Blob([JSON.stringify(c, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${c.name.replace(/[^a-z0-9]/gi, '_')}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function generateSheetHtml(c: Character): string {
  const pb = proficiencyBonus(c.level);
  const abMod = (ab: Ability) => abilityModifier(c.abilities[ab]);

  const abilitiesHtml = ABILITIES.map((ab) => `
    <div class="ability-box">
      <div class="ability-label">${ab.toUpperCase()}</div>
      <div class="ability-score">${c.abilities[ab]}</div>
      <div class="ability-mod">${fmtMod(abMod(ab))}</div>
    </div>`).join('');

  const savesHtml = ABILITIES.map((ab) => {
    const prof = c.proficientSaves?.includes(ab) ?? false;
    const total = abMod(ab) + (prof ? pb : 0);
    return `<div class="row${prof ? ' prof' : ''}">
      <span class="dot">${prof ? '●' : '○'}</span>
      <span class="val">${fmtMod(total)}</span>
      <span>${esc(ABILITY_LABELS[ab])}</span>
    </div>`;
  }).join('');

  const skillsHtml = SKILLS.map((sk) => {
    const prof = c.proficientSkills?.includes(sk.key) ?? false;
    const total = abMod(sk.ability) + (prof ? pb : 0);
    return `<div class="row${prof ? ' prof' : ''}">
      <span class="dot">${prof ? '●' : '○'}</span>
      <span class="val">${fmtMod(total)}</span>
      <span>${esc(sk.label)} <small>(${sk.ability.toUpperCase()})</small></span>
    </div>`;
  }).join('');

  const deathSucc = c.deathSaves?.successes ?? 0;
  const deathFail = c.deathSaves?.failures ?? 0;
  const deathSavesHtml = `
    <div class="death-row">
      <span class="death-label">Successes</span>
      ${Array.from({ length: 3 }, (_, i) => `<span class="dsave succ${i < deathSucc ? ' filled' : ''}">${i < deathSucc ? '●' : '○'}</span>`).join('')}
    </div>
    <div class="death-row">
      <span class="death-label">Failures</span>
      ${Array.from({ length: 3 }, (_, i) => `<span class="dsave fail${i < deathFail ? ' filled' : ''}">${i < deathFail ? '●' : '○'}</span>`).join('')}
    </div>`;

  let slotSectionHtml = '';
  if (c.spellSlots) {
    const slotRows = c.spellSlots.total
      .map((total, i) => ({ level: i + 1, total, used: c.spellSlots!.used[i] ?? 0 }))
      .filter(({ total }) => total > 0)
      .map(({ level, total, used }) => {
        const circles = Array.from({ length: total }, (_, i) =>
          `<span class="slot${i < used ? ' used' : ''}">${i < used ? '●' : '○'}</span>`
        ).join(' ');
        return `<div class="slot-row"><span class="slot-lv">Lv ${level}</span>${circles}<small> (${total - used} left)</small></div>`;
      }).join('');

    const spellList = c.knownSpells?.length
      ? `<p class="spell-list"><strong>Known Spells:</strong> ${esc(c.knownSpells.join(', '))}</p>`
      : '';

    if (slotRows || spellList) {
      slotSectionHtml = `<section><h2>Spells</h2>${slotRows}${spellList}</section>`;
    }
  }

  const inventoryHtml = c.inventory?.length
    ? c.inventory.map((item) =>
        `<li>${item.qty > 1 ? `${item.qty}× ` : ''}${esc(item.name)}${item.notes ? ` <small>(${esc(item.notes)})</small>` : ''}</li>`
      ).join('')
    : '<li class="empty">— empty —</li>';

  const cur = c.currency;
  const currencyHtml = cur && Object.values(cur).some((v) => v > 0)
    ? `<section><h2>Currency</h2><div class="currency">${
        (['pp', 'gp', 'ep', 'sp', 'cp'] as const)
          .filter((k) => cur[k] > 0)
          .map((k) => `<span><strong>${cur[k]}</strong> ${k.toUpperCase()}</span>`)
          .join('')
      }</div></section>`
    : '';

  const featsHtml = c.feats?.length
    ? c.feats.map((f) => {
        const feat = FEATS_MAP[f.featId];
        return feat
          ? `<div class="feat"><strong>${esc(feat.name)}</strong> <small>(${f.source})</small> — ${esc(feat.description)}</div>`
          : `<div class="feat"><strong>${esc(f.featId)}</strong> <small>(${f.source})</small></div>`;
      }).join('')
    : '<p class="empty">None</p>';

  const profLines = [
    c.languages?.length ? `<p><strong>Languages:</strong> ${esc(c.languages.join(', '))}</p>` : '',
    c.toolProficiencies?.length ? `<p><strong>Tools:</strong> ${esc(c.toolProficiencies.join(', '))}</p>` : '',
  ].filter(Boolean).join('');

  const initiative = abMod('dex') + (c.initiativeBonus ?? 0);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${esc(c.name)} — Character Sheet</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Georgia,serif;font-size:12px;color:#1a1a1a;background:#fff;padding:20px;max-width:960px;margin:0 auto}
  h1{font-size:26px;color:#7c1e1e;border-bottom:2px solid #7c1e1e;padding-bottom:4px;margin-bottom:2px}
  h2{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#7c1e1e;border-bottom:1px solid #e0d9d0;padding-bottom:2px;margin:14px 0 6px}
  section{margin-bottom:14px}
  .subtitle{color:#666;font-size:12px;margin-bottom:14px}
  .two-col{display:grid;grid-template-columns:220px 1fr;gap:20px}
  .abilities-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-bottom:12px}
  .ability-box{border:1px solid #c8bfb0;border-radius:6px;text-align:center;padding:5px 2px;background:#fdf8f1}
  .ability-label{font-size:7px;text-transform:uppercase;letter-spacing:.08em;color:#7c1e1e;font-weight:bold}
  .ability-score{font-size:20px;font-weight:bold;line-height:1.1}
  .ability-mod{font-size:11px;color:#555;border-top:1px solid #e8e0d8;margin-top:2px;padding-top:2px}
  .stat-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}
  .stat{border:1px solid #c8bfb0;border-radius:6px;padding:4px 8px;text-align:center;background:#fdf8f1;min-width:64px}
  .stat .v{font-size:16px;font-weight:bold}
  .stat .l{font-size:8px;text-transform:uppercase;color:#888;letter-spacing:.06em}
  .row{display:flex;align-items:center;gap:5px;padding:1.5px 0;font-size:11px}
  .row.prof{font-weight:bold}
  .dot{color:#7c1e1e;width:10px;text-align:center;font-size:10px;flex-shrink:0}
  .val{width:26px;text-align:right;font-variant-numeric:tabular-nums;flex-shrink:0}
  .death-row{display:flex;align-items:center;gap:5px;margin:3px 0;font-size:11px}
  .death-label{width:70px;font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:#666}
  .dsave{font-size:13px}
  .dsave.succ.filled{color:#15803d}
  .dsave.fail.filled{color:#7c1e1e}
  .slot-row{font-size:11px;margin:2px 0}
  .slot-lv{display:inline-block;width:32px;font-weight:bold;color:#7c1e1e}
  .slot{color:#7c1e1e}.slot.used{color:#ccc}
  .spell-list{font-size:11px;margin-top:6px}
  .currency{display:flex;gap:14px;font-size:12px}
  ul{list-style:disc;padding-left:16px}
  li{font-size:11px;margin:1.5px 0}
  .feat{margin-bottom:6px;font-size:11px;line-height:1.5}
  .empty{color:#aaa;font-style:italic}
  .footer{color:#bbb;font-size:9px;text-align:right;margin-top:20px;border-top:1px solid #eee;padding-top:6px}
  @media print{body{padding:0;font-size:11px}.two-col{grid-template-columns:200px 1fr}}
  @page{margin:1.2cm;size:letter}
</style>
</head>
<body>
<h1>${esc(c.name)}</h1>
<p class="subtitle">
  Level ${c.level} ${esc(speciesLabel(c))} ${esc(c.class)}${c.subclass ? ` (${esc(c.subclass)})` : ''}${c.background ? ` &nbsp;·&nbsp; ${esc(c.background)}` : ''}${c.alignment ? ` &nbsp;·&nbsp; ${esc(c.alignment)}` : ''}
</p>

<section>
  <h2>Ability Scores</h2>
  <div class="abilities-grid">${abilitiesHtml}</div>
  <div class="stat-strip">
    <div class="stat"><div class="v">${c.hp.current}/${c.hp.max}</div><div class="l">Hit Points</div></div>
    ${c.hp.temp ? `<div class="stat"><div class="v">${c.hp.temp}</div><div class="l">Temp HP</div></div>` : ''}
    <div class="stat"><div class="v">${c.ac}</div><div class="l">Armor Class</div></div>
    <div class="stat"><div class="v">${c.speed} ft</div><div class="l">Speed</div></div>
    <div class="stat"><div class="v">${fmtMod(initiative)}</div><div class="l">Initiative</div></div>
    <div class="stat"><div class="v">${fmtMod(pb)}</div><div class="l">Prof Bonus</div></div>
    <div class="stat"><div class="v">d${c.class ? (c.level) : '?'}×${c.level}</div><div class="l">Hit Dice</div></div>
    ${(c.exhaustion ?? 0) > 0 ? `<div class="stat" style="border-color:#b45309"><div class="v" style="color:#b45309">${c.exhaustion}</div><div class="l">Exhaustion</div></div>` : ''}
    ${c.heroicInspiration ? `<div class="stat" style="border-color:#b45309"><div class="v" style="color:#b45309">★</div><div class="l">Inspired</div></div>` : ''}
  </div>
</section>

<div class="two-col">
  <div>
    <section>
      <h2>Saving Throws</h2>
      ${savesHtml}
    </section>
    <section>
      <h2>Death Saves</h2>
      ${deathSavesHtml}
    </section>
    ${profLines ? `<section><h2>Proficiencies</h2>${profLines}</section>` : ''}
  </div>
  <div>
    <section>
      <h2>Skills</h2>
      ${skillsHtml}
    </section>
  </div>
</div>

${currencyHtml}
${slotSectionHtml}

<section>
  <h2>Inventory</h2>
  <ul>${inventoryHtml}</ul>
</section>

<section>
  <h2>Feats &amp; Features</h2>
  ${featsHtml}
</section>

${c.notes ? `<section><h2>Notes</h2><p style="white-space:pre-wrap;font-size:11px;line-height:1.6">${esc(c.notes)}</p></section>` : ''}

<p class="footer">D&amp;D Companion 2024 &nbsp;·&nbsp; Exported ${new Date().toLocaleDateString()}</p>
</body>
</html>`;
}

function exportSheet(c: Character) {
  const html = generateSheetHtml(c);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
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
            <li key={c.id} className="card flex items-start justify-between gap-3">
              <Link href={`/characters/edit/?id=${c.id}`} className="flex-1 min-w-0">
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
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button
                  onClick={() => exportSheet(c)}
                  className="btn text-xs px-2 py-1"
                  title="Open printable character sheet in new tab (print to PDF)"
                >
                  📄 Sheet
                </button>
                <button
                  onClick={() => exportJson(c)}
                  className="btn text-xs px-2 py-1"
                  title="Download character data as JSON"
                >
                  ↓ JSON
                </button>
                <button
                  onClick={() => remove(c.id)}
                  className="btn text-xs px-2 py-1 text-blood"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
