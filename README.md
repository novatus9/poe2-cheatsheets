# PoE2 Cheatsheets

Customizable, data-driven cheatsheets for **Path of Exile 2**. Mobile- and desktop-friendly, built to be quick to update when patches land.

The first cheatsheet covers **0.5 (Return of the Ancients) campaign rewards** — permanent buffs, ascendancy unlocks, and build-dependent choice rewards, with a per-tier view for new, experienced, and veteran players.

## Features

- **Tier toggle** — New / Experienced / Veteran changes information density. New players see explanations and only the rewards that matter; veterans get a dense lookup table.
- **Build-aware** — pick your class (and ascendancy) to highlight the recommended option on every *choice* reward.
- **Filters** — by act, reward type, "missable only", and free-text search.
- **Progress checklist** — tick off buffs as you collect them on a run; saved in your browser (`localStorage`).
- **Light, readable design** — restrained PoE-flavored palette, responsive cards.

## Tech

- [Astro](https://astro.build) static site (ships almost no JS).
- One [Preact](https://preactjs.com) island for the interactive cheatsheet.
- All content is **hand-curated JSON** in [`src/data/`](src/data/) — no scraping, fully version-controlled.
- Deploys to **GitHub Pages** via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to ./dist
npm run preview  # preview the production build
```

## Updating data after a patch

Cheatsheet content lives in plain JSON — no code changes needed for most updates:

- [`src/data/campaign-rewards.json`](src/data/campaign-rewards.json) — the rewards. Each entry carries `act`, `zone`, `quest`, `category`, `priority`, `missable`, and (for choices) `options` with `recommendedFor` build tags. Bump `patch` and `lastVerified` at the top.
- [`src/data/classes.json`](src/data/classes.json) — classes, ascendancies, and their default build archetypes.
- [`src/data/types.ts`](src/data/types.ts) — the schema these JSON files follow.

Adding a new cheatsheet later (e.g. gem links, vendor recipes) means adding a new JSON file + page that reuse the same component pattern.

## Deploying

1. Push to a GitHub repo named to match `base` in [`astro.config.mjs`](astro.config.mjs) (default `/poe2-cheatsheets`).
2. In the repo: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
3. Push to `main`; the workflow builds and publishes automatically.

If you use a different repo name, update `site` and `base` in `astro.config.mjs`.

## Data sources

Seeded and cross-referenced from community references (Game8, Maxroll, Mobalytics, Boostmatch). Each reward records its source key in the JSON. Always verify against the live game — stats shift between patches.
