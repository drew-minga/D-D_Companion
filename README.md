# D&D Companion

A free, open-source companion for Dungeons & Dragons 5e. Runs entirely in your browser — no accounts, no backend, no tracking. Your data stays in `localStorage`.

## Features

- **Dice roller** — Standard dice notation (`2d6+3`), quick buttons for d4–d100, advantage/disadvantage, and a rolling history.
- **Character sheets** — Create unlimited 5e character sheets: abilities, saves, skills, HP/AC/speed, inventory, and notes. Rolls for checks, saves, skills, and initiative are computed automatically.
- **Spell & monster lookup** — Browse the full 5e SRD via the public [D&D 5e API](https://www.dnd5eapi.co/) with live search.
- **Combat tracker** — Initiative order, HP, AC, conditions, round counter, and an "active turn" highlight.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

- `npm run dev` — Start the Next.js dev server.
- `npm run build` — Build a static export in `out/`.
- `npm run typecheck` — Run TypeScript (no emit).
- `npm run lint` — Run ESLint.

## Deploy to GitHub Pages

This repo ships with a GitHub Actions workflow that builds and publishes the site to GitHub Pages on every push to the default branch.

1. Push this repo to GitHub.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main` (or whichever your default branch is). The `Deploy to GitHub Pages` workflow will run, and the site will be available at `https://<user>.github.io/D-D_Companion/`.

If you fork this or rename the repo, update the `repo` constant in `next.config.mjs` to match your repo name.

## Deploy elsewhere

Because the app is a static export (`output: 'export'`) and has no server, you can also drop the contents of `out/` onto any static host — Vercel, Netlify, Cloudflare Pages, S3, etc. For Vercel, no config change is needed; the `basePath` only activates when `GITHUB_PAGES=true`.

## Tech

- [Next.js 14](https://nextjs.org/) (App Router, static export)
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [D&D 5e API](https://www.dnd5eapi.co/) for spell/monster data (SRD content, CC-BY-4.0)

## Privacy

Characters, encounters, and roll history are stored only in your browser's `localStorage`. Clearing site data wipes everything. Nothing is sent to a server except requests to `dnd5eapi.co` when you use the lookup feature.

## License

MIT — see [LICENSE](./LICENSE).

D&D 5e SRD content displayed via the API is licensed under the
[Open Gaming License](https://dnd.wizards.com/articles/features/systems-reference-document-srd) and
[CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/), per the API's terms.
