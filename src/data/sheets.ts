// Registry of cheatsheets — powers the nav and the landing page.
export interface Sheet {
  /** URL slug (relative to base). Empty string is the home/landing page. */
  slug: string;
  /** Full title. */
  title: string;
  /** Short label for the nav bar. */
  short: string;
  /** One-line description for the landing page. */
  blurb: string;
  status: 'live' | 'soon';
}

export const SHEETS: Sheet[] = [
  {
    slug: 'campaign-rewards',
    title: 'Campaign Rewards',
    short: 'Campaign Rewards',
    blurb: 'Permanent buffs, pick-one choices, and optional item rewards across the 0.5 campaign — with locations for the easily-missed ones.',
    status: 'live',
  },
  {
    slug: 'resistances',
    title: 'Resistances & Defenses',
    short: 'Resistances',
    blurb: 'Resistance caps and penalties, the defensive layers (armour, evasion, energy shield, block), ailments, and the breakpoints to aim for.',
    status: 'live',
  },
  {
    slug: 'azmeri-spirits',
    title: 'Azmeri Spirit Stacking',
    short: 'Azmeri Stacking',
    blurb: 'The high-investment Atlas farming loop — spirit types, the mandatory Atlas tree and Hilda notables, tablet setup, map picks, and the in-map execution order for dumping the swarm into premium loot.',
    status: 'live',
  },
  {
    slug: 'island-rumours',
    title: 'Island Rumours & Mapping',
    short: 'Island Rumours',
    blurb: 'Decode every tavern rumour to its island — the remnant/mod gimmick, the layout, and a best-to-worst rating. Plus unique maps, boss islands, and sagas.',
    status: 'live',
  },
];
