// Shared types for cheatsheet data. Keep these in sync with the JSON files.

/** Build archetype tags used to recommend choice rewards for a player's build. */
export type Archetype =
  | 'attack'
  | 'caster'
  | 'minion'
  | 'crit'
  | 'energy-shield'
  | 'armour'
  | 'evasion'
  | 'chaos-dot'
  | 'life'
  | 'mana-stacking'
  | 'elemental';

/**
 * Primary grouping/colour dimension:
 * - permanent: a permanent character reward — fixed buffs and pick-one choices
 *   (a choice reward is flagged with `category: "choice"` and carries `options`).
 * - optional: item rewards from optional content — uncut gems, currency orbs, runes,
 *   uniques. In 0.5 these come from the Runes of Aldur league mechanic.
 */
export type RewardKind = 'permanent' | 'optional';

/** Relative importance — drives the subtle ★ "don't-miss" marker on cards. */
export type Priority = 'critical' | 'useful' | 'minor';

export type RewardCategory =
  | 'skill-points'
  | 'weapon-set-points'
  | 'spirit'
  | 'life'
  | 'mana'
  | 'resistance'
  | 'attribute'
  | 'charm'
  | 'flask'
  | 'defence'
  | 'ascendancy'
  | 'choice'
  | 'currency'
  | 'gem'
  | 'rune'
  | 'unique';

export interface ChoiceOption {
  label: string;
  detail: string;
  /** Archetypes this option is best for. Empty = generally fine for anyone. */
  recommendedFor: Archetype[];
}

export interface Reward {
  id: string;
  kind: RewardKind;
  /** 1-4 for acts, or "interlude" / "atlas" for post-act content. */
  act: number | 'interlude' | 'atlas';
  zone: string;
  quest: string;
  category: RewardCategory;
  /** Short fixed reward text. For `category: "choice"`, use `options` instead. */
  reward?: string;
  options?: ChoiceOption[];
  missable: boolean;
  refarmable: boolean;
  priority: Priority;
  /** Where/how to find or complete it — shown prominently on the card. */
  location?: string;
  /** Plain-language explanation shown to new players. */
  why?: string;
  /** Terse note shown to experienced/veteran players. */
  note?: string;
  /** Source key, see CheatsheetData.sources. */
  source: string;
}

export interface SourceRef {
  key: string;
  label: string;
  url: string;
}

export interface CheatsheetData {
  patch: string;
  title: string;
  lastVerified: string;
  intro: string;
  sources: SourceRef[];
  rewards: Reward[];
}

export interface ClassInfo {
  name: string;
  ascendancies: string[];
  /** Default archetypes for this class, used to pre-select build recommendations. */
  archetypes: Archetype[];
}

export interface ClassData {
  classes: ClassInfo[];
  archetypeLabels: Record<Archetype, string>;
}

// ---- Generic "reference" cheatsheet (explanatory sheets, e.g. Resistances) ----

export interface RefCard {
  title: string;
  /** Optional short highlighted value, e.g. a cap. */
  value?: string;
  body: string;
  /** "warn" renders a caution callout (e.g. verify-in-game). */
  flag?: 'warn';
}

export interface RefTable {
  columns: string[];
  rows: string[][];
}

export interface RefSection {
  id: string;
  heading: string;
  blurb?: string;
  table?: RefTable;
  cards?: RefCard[];
  /** A closing note under the section. */
  note?: string;
}

export interface ReferenceSheet {
  title: string;
  patch: string;
  lastVerified: string;
  intro: string;
  sections: RefSection[];
  sources: SourceRef[];
}
