import { useEffect, useMemo, useState } from 'preact/hooks';
import type { CheatsheetData, Reward, RewardKind } from '../data/types';

interface Props {
  data: CheatsheetData;
}

const KIND_LABELS: Record<RewardKind, string> = {
  permanent: 'Permanent',
  optional: 'Optional',
};

const ALL_KINDS: RewardKind[] = ['permanent', 'optional'];

const ACT_LABEL = (act: Reward['act']) =>
  act === 'interlude' ? 'Interludes' : act === 'atlas' ? 'Atlas' : `Act ${act}`;

const ACT_ORDER = (act: Reward['act']) =>
  act === 'interlude' ? 90 : act === 'atlas' ? 91 : (act as number);

const LS = {
  checked: 'poe2cs.campaign.checked',
  kinds: 'poe2cs.kinds',
};

function load<T>(key: string, fallback: T): T {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export default function Cheatsheet({ data }: Props) {
  const [actFilter, setActFilter] = useState<string>('all');
  const [kinds, setKinds] = useState<RewardKind[]>(['permanent']);
  const [missableOnly, setMissableOnly] = useState(false);
  const [query, setQuery] = useState('');
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setChecked(load<Record<string, boolean>>(LS.checked, {}));
    const savedKinds = load<RewardKind[]>(LS.kinds, ['permanent']).filter((k) =>
      ALL_KINDS.includes(k)
    );
    setKinds(savedKinds.length ? savedKinds : ['permanent']);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(LS.checked, JSON.stringify(checked));
  }, [checked, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem(LS.kinds, JSON.stringify(kinds));
  }, [kinds, hydrated]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.rewards.filter((r) => {
      if (!kinds.includes(r.kind)) return false;
      if (actFilter !== 'all' && String(r.act) !== actFilter) return false;
      if (missableOnly && !r.missable) return false;
      if (q) {
        const hay = `${r.quest} ${r.zone} ${r.reward ?? ''} ${r.category} ${
          r.options?.map((o) => o.label).join(' ') ?? ''
        }`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [data, kinds, actFilter, missableOnly, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, Reward[]>();
    for (const r of visible) {
      const key = String(r.act);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return Array.from(map.entries()).sort(
      (a, b) => ACT_ORDER(coerceAct(a[0])) - ACT_ORDER(coerceAct(b[0]))
    );
  }, [visible]);

  // Progress tracks the character-power rewards (permanent buffs + choices),
  // not the optional gem/orb item rewards.
  const trackable = useMemo(
    () => data.rewards.filter((r) => r.kind !== 'optional' && r.missable),
    [data]
  );
  const doneCount = trackable.filter((r) => checked[r.id]).length;
  const pct = trackable.length ? Math.round((doneCount / trackable.length) * 100) : 0;

  const kindCounts = useMemo(() => {
    const c: Record<RewardKind, number> = { permanent: 0, optional: 0 };
    for (const r of data.rewards) c[r.kind]++;
    return c;
  }, [data]);

  const allKindsOn = ALL_KINDS.every((k) => kinds.includes(k));
  const toggleKind = (k: RewardKind) =>
    setKinds((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));

  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const resetChecks = () => {
    if (confirm('Clear all checked rewards?')) setChecked({});
  };

  return (
    <div>
      <div class="controls">
        <div class="control-row">
          <div class="control-group grow">
            <span class="control-label">Search</span>
            <input
              type="search"
              placeholder="Quest, zone or reward…"
              value={query}
              onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
            />
          </div>
        </div>

        <div class="control-row">
          <div class="kind-filter" role="group" aria-label="Filter by reward kind (multi-select)">
            {(Object.keys(KIND_LABELS) as RewardKind[]).map((k) => (
              <button
                key={k}
                type="button"
                class={`kind-chip ${k}`}
                aria-pressed={kinds.includes(k)}
                onClick={() => toggleKind(k)}
              >
                {KIND_LABELS[k]} <span class="kc">{kindCounts[k]}</span>
              </button>
            ))}
            <button
              type="button"
              class="kind-chip all"
              aria-pressed={allKindsOn}
              onClick={() => setKinds(allKindsOn ? ['permanent'] : [...ALL_KINDS])}
            >
              {allKindsOn ? 'Reset' : 'Show all'}
            </button>
          </div>

          <select
            value={actFilter}
            onChange={(e) => setActFilter((e.target as HTMLSelectElement).value)}
            aria-label="Filter by act"
          >
            <option value="all">All acts</option>
            <option value="1">Act 1</option>
            <option value="2">Act 2</option>
            <option value="3">Act 3</option>
            <option value="4">Act 4</option>
            <option value="interlude">Interludes</option>
            <option value="atlas">Atlas</option>
          </select>

          <label class="check-toggle">
            <input
              type="checkbox"
              checked={missableOnly}
              onChange={(e) => setMissableOnly((e.target as HTMLInputElement).checked)}
            />
            Missable only
          </label>
        </div>

        <div class="control-row">
          <div class="progress-wrap">
            <span class="progress" aria-hidden="true">
              <span style={{ width: `${pct}%` }} />
            </span>
            <span class="progress-text">
              {doneCount}/{trackable.length} collected
            </span>
          </div>
          <button type="button" class="btn-reset" onClick={resetChecks}>
            Reset
          </button>
        </div>
      </div>

      {grouped.length === 0 && <p class="empty">No rewards match your filters.</p>}

      {grouped.map(([key, rewards]) => (
        <section class="act-section" key={key}>
          <div class="act-heading">
            <h2>{ACT_LABEL(coerceAct(key))}</h2>
            <span class="count">{rewards.length}</span>
          </div>
          <div class="cards">
            {rewards.map((r) => (
              <RewardCard
                key={r.id}
                reward={r}
                checked={!!checked[r.id]}
                onToggle={() => toggle(r.id)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function coerceAct(key: string): Reward['act'] {
  if (key === 'interlude' || key === 'atlas') return key;
  return Number(key);
}

interface CardProps {
  reward: Reward;
  checked: boolean;
  onToggle: () => void;
}

function RewardCard({ reward, checked, onToggle }: CardProps) {
  const isChoice = reward.category === 'choice' && reward.options;

  return (
    <article class={`reward-card kind-${reward.kind} ${checked ? 'checked' : ''}`}>
      <div class="card-top">
        <label class="reward-check">
          <input
            type="checkbox"
            checked={checked}
            onChange={onToggle}
            aria-label={`Mark ${reward.quest} collected`}
          />
        </label>
        <div class="reward-head">
          <span class="reward-title">{reward.quest}</span>
          <span class="reward-where">{reward.zone}</span>
        </div>
        {reward.priority === 'critical' && (
          <span class="star" title="Don't miss this one">★</span>
        )}
      </div>

      {reward.reward && (
        <div class="reward-value">
          {isChoice ? reward.reward : <span class="lead">{reward.reward}</span>}
        </div>
      )}

      {reward.location && (
        <div class="reward-loc">
          <span class="pin" aria-hidden="true">📍</span>
          {reward.location}
        </div>
      )}

      {isChoice && (
        <ul class="options">
          {reward.options!.map((opt) => (
            <li class="option" key={opt.label}>
              <span class="option-label">{opt.label}</span>
            </li>
          ))}
        </ul>
      )}

      <div class="tags">
        <span class={`tag kind-tag kind-${reward.kind}`}>{KIND_LABELS[reward.kind]}</span>
        <span class="tag cat">{reward.category.replace(/-/g, ' ')}</span>
        {reward.missable && <span class="tag missable">Missable</span>}
        {reward.refarmable && <span class="tag refarmable">Re-farmable</span>}
      </div>
    </article>
  );
}
