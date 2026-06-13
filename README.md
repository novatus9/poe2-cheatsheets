# PoE2 Cheatsheets

Data-driven cheatsheets for **Path of Exile 2**. Mobile- and desktop-friendly, built to be quick to update when patches land.

**Live site:** https://novatus9.github.io/poe2-cheatsheets/

The first cheatsheet covers **0.5 (Return of the Ancients) campaign rewards** — permanent buffs, ascendancy unlocks, pick-one choice rewards, and the optional gem/orb item rewards from the Runes of Aldur league mechanic.

## Features

- **Two reward kinds, colour-coded** — **Permanent** (fixed buffs *and* pick-one choices) and **Optional** (uncut gems, currency orbs, runes, uniques). Filter chips multi-select; defaults to Permanent only.
- **Location hints** — commonly-missed rewards show a 📍 line on where/how to find or complete them.
- **Filters** — by act, "missable only", and free-text search.
- **Progress checklist** — tick off rewards as you collect them on a run; saved in your browser (`localStorage`).
- **Light, readable design** — restrained PoE-flavoured palette, responsive multi-column cards that collapse to a single column on mobile.

> Note: a class/ascendancy selector that highlighted the recommended option on each choice was removed for now. The data to support it (`recommendedFor` tags, [`src/data/classes.json`](src/data/classes.json)) is still in place, so it can be re-added later.

## Tech

- [Astro](https://astro.build) static site (ships almost no JS).
- One [Preact](https://preactjs.com) island ([`src/components/Cheatsheet.tsx`](src/components/Cheatsheet.tsx)) for the interactive filtering/checklist.
- All content is **hand-curated JSON** in [`src/data/`](src/data/) — no scraping, fully version-controlled.
- Auto-deploys to **GitHub Pages** via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push to `main`.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321/poe2-cheatsheets
npm run build    # outputs to ./dist
npm run preview  # preview the production build
```

## Updating data after a patch

Cheatsheet content lives in plain JSON — no code changes needed for most updates:

- [`src/data/campaign-rewards.json`](src/data/campaign-rewards.json) — the rewards. Each entry carries `kind` (`permanent` | `optional`), `act`, `zone`, `quest`, `category`, `priority`, `missable`, `refarmable`, an optional `location`, and — for choice rewards (`category: "choice"`) — an `options` array. Bump `patch` and `lastVerified` at the top.
- [`src/data/types.ts`](src/data/types.ts) — the schema these JSON files follow.
- [`src/data/classes.json`](src/data/classes.json) — classes, ascendancies, and build archetypes (kept for the future class-selector feature; not currently rendered).

Edit, commit, and push to `main` — the site rebuilds and redeploys automatically in ~40s.

Adding a new cheatsheet later (e.g. gem links, vendor recipes) means adding a new JSON file + page that reuse the same component pattern.

## Deploying (already configured)

This repo is already wired to GitHub Pages:

1. `site`/`base` are set in [`astro.config.mjs`](astro.config.mjs) (`base` = `/poe2-cheatsheets`, matching the repo name).
2. Pages **Source = GitHub Actions** is enabled.
3. Pushing to `main` runs the workflow, which builds with Astro and publishes `./dist`.

To deploy under a different account or repo name, update `SITE` and `BASE` in `astro.config.mjs` to match.

## Data sources

Seeded and cross-referenced from community references (Maxroll, Game8, PoE Vault, Mobalytics, Boostmatch, PoE2 wiki). Each reward records its source key in the JSON. Always verify against the live game — stats and zone names shift between patches.
