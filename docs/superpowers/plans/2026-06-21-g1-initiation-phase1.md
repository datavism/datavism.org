# G1 Interactive Initiation — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn G1 (`/line-g/the-folder`) into an interactive initiation that walks a visitor from a vague suspicion to a shareable **Signal Card** (which can extend into a full Case File), plus a minimal **Signal Archive** and cookieless analytics.

**Architecture:** Pure-static Astro 6 site. All interactivity is client-side Svelte 5 islands backed by `localStorage` (anonymous, no accounts, no network). Pure logic (route suggestions, storage, export, stage derivation) lives in `src/lib/signal-cards/*` and is unit-tested with vitest; Svelte/Astro UI is verified by `astro check` + `astro build` + a Playwright walkthrough. PNG export uses the `modern-screenshot` library on the rendered card node.

**Tech Stack:** Astro 6.4.x, Svelte 5.56.x (runes), TypeScript 6, Tailwind v4 (`@theme` tokens in `src/styles/global.css`), zod 4, vitest 4 (`vitest run`, default node env), `modern-screenshot` (new dep, PNG only).

## Global Constraints

- **Branch:** `feat/g1-initiation`, stacked on `feat/line-k` (PR #22) — it needs the generalized `src/pages/[line]/[station].astro` renderer. Do NOT merge to main; open a PR for review. Merge order: line-k → g1-initiation.
- **Svelte 5 runes only:** `$props()`, `$state()`, `$derived()`, `$effect()`. Match `src/components/SelfCheck.svelte` style (one-time localStorage hydrate via a `loaded` flag, `try/catch` around all storage).
- **Honesty (hard rules):** every card carries `SIGNAL_CARD_DISCLAIMER` ("Not evidence yet…"); uncertainty is required to finish a card; a sensitive-PII warning sits on the suspicion field; archive samples are labeled curated; **no AI, no fake live data**; the ONLY network calls are the cookieless analytics beacon and user-initiated exports/downloads.
- **No new deps except `modern-screenshot`.** No accounts/Firebase/AI in Phase 1 (Phases 2/3).
- **Design tokens:** use `var(--color-...)` from `src/styles/global.css` — never hardcode brand hex. Line accent for G is `var(--color-line-g)` (#00ff88); primary UI accent is `var(--color-signal)` (#ffd23f); live/"ghost" green is `var(--color-ghost)` (#39ff14). Mono font `var(--font-mono)`; display via the existing `font-display` class.
- **Vocabulary mapping (for Phase 2 readiness):** store line ids lowercase (`'g'`); station ids like `g1`. The bridge maps to uppercase later — do not bake uppercase into the data model.
- **Test command:** `npx vitest run <path>` for a single file; `npm test` for all. `npm run check` must stay 0/0/0; `npm run build` must stay green.

---

### Task 1: Signal Card type system + constants

**Files:**
- Create: `src/lib/signal-cards/types.ts`
- Test: `src/lib/signal-cards/types.test.ts`

**Interfaces:**
- Produces: `LineId`, `SystemSignal`, `EvidenceType`, `SignalStage`, `SignalCard` types; `SIGNAL_CARD_DISCLAIMER: string`; `SYSTEM_SIGNALS: {id:SystemSignal;label:string;line:LineId}[]`; `EVIDENCE_TYPES: {id:EvidenceType;label:string;hint:string}[]`; `STAGE_LEGEND: {id:string;label:string}[]`; `deriveStage(c:{actor?:string;sourceLead?:string;publicRelevance?:string}): SignalStage`.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/signal-cards/types.test.ts
import { describe, it, expect } from 'vitest'
import { deriveStage, SYSTEM_SIGNALS, EVIDENCE_TYPES, SIGNAL_CARD_DISCLAIMER } from './types'

describe('signal-card types', () => {
  it('derives case-file only when all three deeper fields are filled', () => {
    expect(deriveStage({})).toBe('question')
    expect(deriveStage({ actor: 'AdCorp' })).toBe('question')
    expect(deriveStage({ actor: 'AdCorp', sourceLead: 'register', publicRelevance: ' ' })).toBe('question')
    expect(deriveStage({ actor: 'AdCorp', sourceLead: 'register', publicRelevance: 'affects many' })).toBe('case-file')
  })

  it('every system signal maps to a real line and a non-empty label', () => {
    for (const s of SYSTEM_SIGNALS) {
      expect(s.label.length).toBeGreaterThan(0)
      expect(['g', 'k', 'r', 'b', 'v']).toContain(s.line)
    }
    expect(SYSTEM_SIGNALS.map((s) => s.id)).toEqual(['tracking', 'money', 'feed', 'future', 'unsure'])
  })

  it('evidence types include the honest "unknown" escape hatch', () => {
    expect(EVIDENCE_TYPES.some((e) => e.id === 'unknown')).toBe(true)
  })

  it('disclaimer states it is not evidence yet', () => {
    expect(SIGNAL_CARD_DISCLAIMER).toMatch(/not evidence yet/i)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/signal-cards/types.test.ts`
Expected: FAIL — cannot find module `./types`.

- [ ] **Step 3: Write the implementation**

```ts
// src/lib/signal-cards/types.ts
// Signal Card data model for G1 — THE FOLDER. A Signal Card is a Stage-2
// (Suspicion → Question) artifact; filling the three deeper fields upgrades it
// to a full Case File #1 (Stage 5 lives in /underground). No PII, no backend.

export type LineId = 'g' | 'k' | 'r' | 'b' | 'v'
export type SystemSignal = 'tracking' | 'money' | 'feed' | 'future' | 'unsure'
export type EvidenceType =
  | 'technical-signal' | 'public-record' | 'platform-output'
  | 'dataset' | 'document' | 'observation' | 'unknown'
export type SignalStage = 'question' | 'case-file'

export type SignalCard = {
  id: string
  version: 1
  createdAt: string
  updatedAt?: string
  line: 'g'
  station: 'g1-the-folder'
  stage: SignalStage
  // Signal Card (Stage-2) fields
  systemSignal: SystemSignal
  suspicion: string
  question: string
  evidenceNeeded: EvidenceType[]
  customEvidenceNote?: string
  uncertainty: string
  // routing
  suggestedLines: LineId[]
  nextLineChoice: LineId
  // Case File extension (optional → upgrades stage to 'case-file')
  actor?: string
  sourceLead?: string
  publicRelevance?: string
  // meta
  tags: string[]
  visibility: 'private' | 'public-anonymous' | 'exported'
  disclaimer: string
}

export const SIGNAL_CARD_DISCLAIMER =
  'This is not evidence yet. This is an investigation question created in DATAVISM G1 — THE FOLDER.'

export const SYSTEM_SIGNALS: { id: SystemSignal; label: string; line: LineId }[] = [
  { id: 'tracking', label: 'I feel watched or profiled.', line: 'k' },
  { id: 'money', label: 'I want to know who benefits.', line: 'r' },
  { id: 'feed', label: 'I keep seeing patterns in feeds or recommendations.', line: 'b' },
  { id: 'future', label: 'I notice a slow change that people ignore.', line: 'v' },
  { id: 'unsure', label: 'I only have a vague feeling.', line: 'g' },
]

export const EVIDENCE_TYPES: { id: EvidenceType; label: string; hint: string }[] = [
  { id: 'technical-signal', label: 'Technical signal', hint: 'request, cookie, pixel, SDK, tag, metadata' },
  { id: 'public-record', label: 'Public record', hint: 'register, policy, procurement, filing, transparency database' },
  { id: 'platform-output', label: 'Platform output', hint: 'feed result, recommendation, category, ranking, ad' },
  { id: 'dataset', label: 'Dataset', hint: 'CSV, API, archive, official data' },
  { id: 'document', label: 'Document', hint: 'PDF, report, article, policy, leaked taxonomy' },
  { id: 'observation', label: 'Observation', hint: 'screenshot, diary, repeated pattern, manual sample' },
  { id: 'unknown', label: 'I do not know yet', hint: '' },
]

export const STAGE_LEGEND: { id: string; label: string }[] = [
  { id: 'suspicion', label: 'Suspicion' },
  { id: 'question', label: 'Question' },
  { id: 'signal', label: 'Signal' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'case-file', label: 'Case File' },
]

const filled = (s?: string) => !!s && s.trim().length > 0

export function deriveStage(c: { actor?: string; sourceLead?: string; publicRelevance?: string }): SignalStage {
  return filled(c.actor) && filled(c.sourceLead) && filled(c.publicRelevance) ? 'case-file' : 'question'
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/signal-cards/types.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/signal-cards/types.ts src/lib/signal-cards/types.test.ts
git commit -m "feat(g1): signal-card type system + constants"
```

---

### Task 2: Route suggestion logic

**Files:**
- Create: `src/lib/signal-cards/route-suggestions.ts`
- Test: `src/lib/signal-cards/route-suggestions.test.ts`

**Interfaces:**
- Consumes: `LineId`, `SystemSignal` from `./types`.
- Produces: `suggestLines(systemSignal: SystemSignal, questionText?: string): LineId[]` — keyword hits first, then the base mapping, deduped, always includes `'g'`, capped at 4.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/signal-cards/route-suggestions.test.ts
import { describe, it, expect } from 'vitest'
import { suggestLines } from './route-suggestions'

describe('suggestLines', () => {
  it('maps each system signal to its base lines', () => {
    expect(suggestLines('tracking')).toEqual(['k', 'g'])
    expect(suggestLines('money')).toEqual(['r', 'g'])
    expect(suggestLines('feed')).toEqual(['b', 'g'])
    expect(suggestLines('future')).toEqual(['v', 'g'])
  })

  it('lets question keywords take precedence and dedups', () => {
    // money base is [r,g] but the text screams tracking → k leads, then base, deduped
    expect(suggestLines('money', 'a cookie and pixel profile follows me')).toEqual(['k', 'r', 'g'])
  })

  it('always includes g and never exceeds four', () => {
    const out = suggestLines('unsure', '')
    expect(out).toContain('g')
    expect(out.length).toBeLessThanOrEqual(4)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/signal-cards/route-suggestions.test.ts`
Expected: FAIL — cannot find module `./route-suggestions`.

- [ ] **Step 3: Write the implementation**

```ts
// src/lib/signal-cards/route-suggestions.ts
// Deterministic next-line suggestions for G1. Advisory only — the user always
// chooses. No AI. Keyword hits (most specific) rank above the base mapping.
import type { LineId, SystemSignal } from './types'

const SYSTEM_SIGNAL_TO_LINES: Record<SystemSignal, LineId[]> = {
  tracking: ['k', 'g'],
  money: ['r', 'g'],
  feed: ['b', 'g'],
  future: ['v', 'g'],
  unsure: ['g', 'k', 'r', 'b', 'v'],
}

const KEYWORDS: { pattern: RegExp; line: LineId }[] = [
  { pattern: /track|cookie|pixel|profil|broker|surveill|\bads?\b/i, line: 'k' },
  { pattern: /money|profit|company|benefit|funding|owner|contract|pric(e|ing)/i, line: 'r' },
  { pattern: /feed|scroll|recommend|algorithm|viral|engagement|rank/i, line: 'b' },
  { pattern: /climate|future|long.?term|archive|trend|over time|warming|emission/i, line: 'v' },
]

export function suggestLines(systemSignal: SystemSignal, questionText = ''): LineId[] {
  const base = SYSTEM_SIGNAL_TO_LINES[systemSignal] ?? ['g']
  const hits = KEYWORDS.filter((k) => k.pattern.test(questionText)).map((k) => k.line)
  const ordered: LineId[] = [...hits, ...base, 'g']
  return [...new Set(ordered)].slice(0, 4)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/signal-cards/route-suggestions.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/signal-cards/route-suggestions.ts src/lib/signal-cards/route-suggestions.test.ts
git commit -m "feat(g1): deterministic route suggestions"
```

---

### Task 3: localStorage persistence

**Files:**
- Create: `src/lib/signal-cards/storage.ts`
- Test: `src/lib/signal-cards/storage.test.ts`

**Interfaces:**
- Consumes: `SignalCard` from `./types`.
- Produces: `newCardId(): string`; `loadDraft(): Partial<SignalCard>|null`; `saveDraft(d: Partial<SignalCard>): void`; `clearDraft(): void`; `loadCards(): SignalCard[]`; `saveCard(c: SignalCard): SignalCard[]`; `removeCard(id: string): SignalCard[]`. Newest card first; `saveCard` replaces an existing id.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/signal-cards/storage.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { newCardId, loadDraft, saveDraft, clearDraft, loadCards, saveCard, removeCard } from './storage'
import type { SignalCard } from './types'

function memoryStorage() {
  const m = new Map<string, string>()
  return {
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    setItem: (k: string, v: string) => void m.set(k, v),
    removeItem: (k: string) => void m.delete(k),
    clear: () => m.clear(),
    key: () => null, length: 0,
  } as Storage
}

const card = (id: string): SignalCard => ({
  id, version: 1, createdAt: '2026-06-21T00:00:00.000Z', line: 'g', station: 'g1-the-folder',
  stage: 'question', systemSignal: 'tracking', suspicion: 's', question: 'q',
  evidenceNeeded: ['technical-signal'], uncertainty: 'u', suggestedLines: ['k', 'g'],
  nextLineChoice: 'k', tags: [], visibility: 'private', disclaimer: 'd',
})

beforeEach(() => { globalThis.localStorage = memoryStorage() })

describe('signal-card storage', () => {
  it('mints a prefixed id', () => {
    expect(newCardId()).toMatch(/^sc_[a-z0-9-]+$/i)
  })

  it('round-trips a draft and clears it', () => {
    saveDraft({ suspicion: 'they watch me' })
    expect(loadDraft()?.suspicion).toBe('they watch me')
    clearDraft()
    expect(loadDraft()).toBeNull()
  })

  it('saves newest-first and replaces by id', () => {
    saveCard(card('a'))
    saveCard(card('b'))
    expect(loadCards().map((c) => c.id)).toEqual(['b', 'a'])
    saveCard({ ...card('a'), question: 'updated' })
    expect(loadCards().map((c) => c.id)).toEqual(['a', 'b'])
    expect(loadCards().find((c) => c.id === 'a')?.question).toBe('updated')
  })

  it('removes a card by id', () => {
    saveCard(card('a')); saveCard(card('b'))
    expect(removeCard('a').map((c) => c.id)).toEqual(['b'])
  })

  it('survives corrupt storage', () => {
    globalThis.localStorage.setItem('datavism:signal-cards', '{not json')
    expect(loadCards()).toEqual([])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/signal-cards/storage.test.ts`
Expected: FAIL — cannot find module `./storage`.

- [ ] **Step 3: Write the implementation**

```ts
// src/lib/signal-cards/storage.ts
// Browser-only persistence for Signal Cards. Anonymous, on-device, no network.
// Account sync (Phase 2) reads these same shapes — keep them serializable.
import type { SignalCard } from './types'

const DRAFT_KEY = 'datavism:g1:draft'
const CARDS_KEY = 'datavism:signal-cards'
const STORAGE_VERSION = 1

type CardsEnvelope = { version: number; cards: SignalCard[] }

const get = (k: string): string | null => { try { return globalThis.localStorage?.getItem(k) ?? null } catch { return null } }
const set = (k: string, v: string): void => { try { globalThis.localStorage?.setItem(k, v) } catch {} }
const del = (k: string): void => { try { globalThis.localStorage?.removeItem(k) } catch {} }

export function newCardId(): string {
  try { return `sc_${globalThis.crypto.randomUUID().slice(0, 8)}` }
  catch { return `sc_${Math.random().toString(36).slice(2, 10)}` }
}

export function loadDraft(): Partial<SignalCard> | null {
  const raw = get(DRAFT_KEY); if (!raw) return null
  try { return JSON.parse(raw) as Partial<SignalCard> } catch { return null }
}
export function saveDraft(d: Partial<SignalCard>): void { set(DRAFT_KEY, JSON.stringify(d)) }
export function clearDraft(): void { del(DRAFT_KEY) }

export function loadCards(): SignalCard[] {
  const raw = get(CARDS_KEY); if (!raw) return []
  try { const env = JSON.parse(raw) as CardsEnvelope; return Array.isArray(env?.cards) ? env.cards : [] }
  catch { return [] }
}
export function saveCard(c: SignalCard): SignalCard[] {
  const cards = [c, ...loadCards().filter((x) => x.id !== c.id)]
  set(CARDS_KEY, JSON.stringify({ version: STORAGE_VERSION, cards }))
  return cards
}
export function removeCard(id: string): SignalCard[] {
  const cards = loadCards().filter((x) => x.id !== id)
  set(CARDS_KEY, JSON.stringify({ version: STORAGE_VERSION, cards }))
  return cards
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/signal-cards/storage.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/signal-cards/storage.ts src/lib/signal-cards/storage.test.ts
git commit -m "feat(g1): localStorage persistence for drafts and cards"
```

---

### Task 4: Markdown / JSON export + download/copy helpers

**Files:**
- Create: `src/lib/signal-cards/export.ts`
- Test: `src/lib/signal-cards/export.test.ts`

**Interfaces:**
- Consumes: `SignalCard` from `./types`; `EVIDENCE_TYPES` from `./types`; `getLineById` from `../curriculum/lines`.
- Produces: `stageLabel(c: SignalCard): string`; `toMarkdown(c: SignalCard): string`; `toJson(c: SignalCard): string`; `downloadFile(filename: string, content: string, mime: string): void`; `copyText(text: string): Promise<boolean>`.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/signal-cards/export.test.ts
import { describe, it, expect } from 'vitest'
import { toMarkdown, toJson, stageLabel } from './export'
import type { SignalCard } from './types'

const base: SignalCard = {
  id: 'sc_1', version: 1, createdAt: '2026-06-21T00:00:00.000Z', line: 'g', station: 'g1-the-folder',
  stage: 'question', systemSignal: 'tracking', suspicion: 'A site knew my search.',
  question: 'What evidence shows cross-site tracking before consent?', evidenceNeeded: ['technical-signal', 'public-record'],
  uncertainty: 'I do not know who receives the data.', suggestedLines: ['k', 'g'], nextLineChoice: 'k',
  tags: [], visibility: 'private', disclaimer: 'This is not evidence yet.',
}

describe('signal-card export', () => {
  it('labels stage by depth', () => {
    expect(stageLabel(base)).toBe('Suspicion → Question')
    expect(stageLabel({ ...base, stage: 'case-file' })).toBe('Case File #1')
  })

  it('markdown carries the question, disclaimer, evidence labels and next line name', () => {
    const md = toMarkdown(base)
    expect(md).toContain('What evidence shows cross-site tracking before consent?')
    expect(md).toMatch(/not evidence yet/i)
    expect(md).toContain('Technical signal')
    expect(md).toContain('KEY / Tracking & OSINT')
    expect(md).not.toContain('## Actor')
  })

  it('markdown adds the deeper sections only for a case-file', () => {
    const md = toMarkdown({ ...base, stage: 'case-file', actor: 'AdCorp', sourceLead: 'register', publicRelevance: 'affects many' })
    expect(md).toContain('## Actor')
    expect(md).toContain('AdCorp')
  })

  it('json round-trips', () => {
    expect(JSON.parse(toJson(base))).toEqual(base)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/signal-cards/export.test.ts`
Expected: FAIL — cannot find module `./export`.

- [ ] **Step 3: Write the implementation**

```ts
// src/lib/signal-cards/export.ts
// Render a Signal Card to shareable formats. Pure string builders are unit-
// tested; download/copy touch the DOM and are exercised in the UI walkthrough.
import type { SignalCard } from './types'
import { EVIDENCE_TYPES } from './types'
import { getLineById } from '../curriculum/lines'

export function stageLabel(c: SignalCard): string {
  return c.stage === 'case-file' ? 'Case File #1' : 'Suspicion → Question'
}

function evidenceLabels(c: SignalCard): string[] {
  return c.evidenceNeeded.map((id) => EVIDENCE_TYPES.find((e) => e.id === id)?.label ?? id)
}

export function toMarkdown(c: SignalCard): string {
  const next = getLineById(c.nextLineChoice)
  const lines = [
    '# DATAVISM Signal Card',
    '',
    `**Stage:** ${stageLabel(c)}  `,
    '**Line:** GHOST / Foundation  ',
    '**Station:** G1 — THE FOLDER  ',
    '**Status:** Not evidence yet. Investigation opened.',
    '',
    '## Suspicion', '', c.suspicion, '',
    '## Question', '', c.question, '',
    '## Evidence Needed', '', ...evidenceLabels(c).map((l) => `- ${l}`),
    ...(c.customEvidenceNote ? ['', c.customEvidenceNote] : []), '',
    '## Uncertainty', '', c.uncertainty, '',
    '## Next Route', '', `${next.code} — ${next.name}`,
  ]
  if (c.stage === 'case-file') {
    lines.push('', '## Actor', '', c.actor ?? '', '', '## Source Lead', '', c.sourceLead ?? '', '', '## Public Relevance', '', c.publicRelevance ?? '')
  }
  lines.push('', '---', '', 'Created with DATAVISM — The Evidence Engine.')
  return lines.join('\n')
}

export function toJson(c: SignalCard): string {
  return JSON.stringify(c, null, 2)
}

export function downloadFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true } catch { return false }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/signal-cards/export.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/signal-cards/export.ts src/lib/signal-cards/export.test.ts
git commit -m "feat(g1): markdown/json export + download/copy helpers"
```

---

### Task 5: SignalCard presentational component

**Files:**
- Create: `src/components/signal-card/SignalCard.svelte`

**Interfaces:**
- Consumes: `SignalCard`, `EVIDENCE_TYPES` from `../../lib/signal-cards/types`; `getLineById` from `../../lib/curriculum/lines`; `stageLabel` from `../../lib/signal-cards/export`.
- Produces: a presentational island. Prop: `card: Partial<SignalCard>` (tolerant of missing fields, used both for the live draft preview and saved cards). Renders an evidence-object styled card. No persistence, no actions.

- [ ] **Step 1: Write the component**

```svelte
<!-- src/components/signal-card/SignalCard.svelte -->
<script>
  import { EVIDENCE_TYPES } from '../../lib/signal-cards/types'
  import { getLineById } from '../../lib/curriculum/lines'

  let { card = {} } = $props()

  const next = $derived(card.nextLineChoice ? getLineById(card.nextLineChoice) : null)
  const stage = $derived(card.stage === 'case-file' ? 'Case File #1' : 'Suspicion → Question')
  const evidence = $derived(
    (card.evidenceNeeded ?? []).map((id) => EVIDENCE_TYPES.find((e) => e.id === id)?.label ?? id),
  )
</script>

<article class="card" style="--accent: var(--color-line-g)">
  <header class="top">
    <span class="brand font-display">DATAVISM</span>
    <span class="code">G1 · THE FOLDER</span>
  </header>

  <div class="stage">{stage}</div>

  <h3 class="q font-display">{card.question || 'Your investigation question'}</h3>

  <dl class="fields">
    <div><dt>System signal</dt><dd>{card.systemSignal ?? '—'}</dd></div>
    <div><dt>Evidence needed</dt><dd>{evidence.length ? evidence.join(', ') : '—'}</dd></div>
    <div><dt>Uncertainty</dt><dd>{card.uncertainty || '—'}</dd></div>
    <div><dt>Next route</dt><dd>{next ? `${next.code} — ${next.name}` : '—'}</dd></div>
    {#if card.stage === 'case-file'}
      <div><dt>Actor</dt><dd>{card.actor || '—'}</dd></div>
      <div><dt>Source lead</dt><dd>{card.sourceLead || '—'}</dd></div>
      <div><dt>Public relevance</dt><dd>{card.publicRelevance || '—'}</dd></div>
    {/if}
  </dl>

  <footer class="foot">
    <span class="stamp">NOT EVIDENCE YET · INVESTIGATION OPENED</span>
    {#if card.id}<span class="id">{card.id}</span>{/if}
  </footer>
</article>

<style>
  .card { position: relative; background: var(--color-panel-2); border: 1px solid var(--color-edge-2); border-top: 3px solid var(--accent); padding: 22px; display: grid; gap: 16px; max-width: 460px; color: var(--color-ink); }
  .top { display: flex; align-items: center; justify-content: space-between; }
  .brand { font-weight: 800; letter-spacing: -0.02em; font-size: 16px; color: var(--color-signal); }
  .code { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.14em; color: var(--color-ink-4); }
  .stage { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.16em; color: var(--accent); }
  .q { font-weight: 800; font-size: clamp(20px, 3.2vw, 28px); line-height: 1.12; letter-spacing: -0.03em; margin: 0; }
  .fields { display: grid; gap: 12px; margin: 0; }
  .fields div { display: grid; gap: 3px; border-top: 1px solid var(--color-edge); padding-top: 10px; }
  dt { font-family: var(--font-mono); font-size: 9.5px; letter-spacing: 0.12em; color: var(--color-ink-5); text-transform: uppercase; }
  dd { margin: 0; font-size: 13.5px; line-height: 1.45; color: var(--color-ink-2); }
  .foot { display: flex; align-items: center; justify-content: space-between; gap: 10px; border-top: 1px solid var(--color-edge); padding-top: 12px; }
  .stamp { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.12em; color: var(--color-magenta); }
  .id { font-family: var(--font-mono); font-size: 9px; color: var(--color-ink-5); }
</style>
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run check`
Expected: 0 errors / 0 warnings / 0 hints.

- [ ] **Step 3: Commit**

```bash
git add src/components/signal-card/SignalCard.svelte
git commit -m "feat(g1): SignalCard presentational component"
```

---

### Task 6: G1 initiation flow — stepper shell (intro → route → card)

**Files:**
- Create: `src/components/initiation/G1InitiationFlow.svelte`

**Interfaces:**
- Consumes: everything from `../../lib/signal-cards/{types,storage,route-suggestions}`; `getLineById`, `LINES` from `../../lib/curriculum/lines`; `SignalCard.svelte`.
- Produces: a `client:load` island. Prop: `stationId = 'the-folder'` (unused logic-wise in Phase 1 but kept for symmetry). Walks the 7 steps, autosaves the draft, and on the card step renders `<SignalCard>` with a "start another" reset. Export/upgrade/archive are added in Tasks 7–8 below it.

- [ ] **Step 1: Write the component**

```svelte
<!-- src/components/initiation/G1InitiationFlow.svelte -->
<script>
  import {
    SYSTEM_SIGNALS, EVIDENCE_TYPES, SIGNAL_CARD_DISCLAIMER, deriveStage,
  } from '../../lib/signal-cards/types'
  import { suggestLines } from '../../lib/signal-cards/route-suggestions'
  import { loadDraft, saveDraft, clearDraft, saveCard, newCardId } from '../../lib/signal-cards/storage'
  import { LINES, getLineById } from '../../lib/curriculum/lines'
  import SignalCard from '../signal-card/SignalCard.svelte'

  const STEPS = ['intro', 'system-signal', 'suspicion', 'question', 'evidence', 'uncertainty', 'route', 'card']
  const PROGRESS = ['Signal', 'Suspicion', 'Question', 'Evidence', 'Uncertainty', 'Route', 'Card']

  let step = $state('intro')
  let draft = $state({ evidenceNeeded: [], tags: [] })

  // one-time hydrate (SelfCheck.svelte pattern)
  let loaded = false
  $effect(() => {
    if (loaded) return
    loaded = true
    const d = loadDraft()
    if (d) draft = { evidenceNeeded: [], tags: [], ...d }
  })

  const stepIndex = $derived(STEPS.indexOf(step))
  const progressIndex = $derived(Math.min(Math.max(stepIndex - 1, 0), PROGRESS.length - 1))

  function persist() { saveDraft($state.snapshot(draft)) }
  function go(next) { step = next; if (next !== 'card') persist() }
  function back() { if (stepIndex > 0) step = STEPS[stepIndex - 1] }

  function pickSignal(s) {
    draft.systemSignal = s.id
    draft.suggestedLines = suggestLines(s.id, draft.question ?? '')
    go('suspicion')
  }
  function toggleEvidence(id) {
    const set = new Set(draft.evidenceNeeded ?? [])
    set.has(id) ? set.delete(id) : set.add(id)
    draft.evidenceNeeded = [...set]
  }
  function enterRoute() {
    draft.suggestedLines = suggestLines(draft.systemSignal, draft.question ?? '')
    if (!draft.nextLineChoice) draft.nextLineChoice = draft.suggestedLines[0] ?? 'g'
    go('route')
  }
  function finishCard() {
    draft.suggestedLines = suggestLines(draft.systemSignal, draft.question ?? '')
    const now = new Date().toISOString()
    draft = {
      ...draft,
      id: draft.id ?? newCardId(),
      version: 1, line: 'g', station: 'g1-the-folder',
      createdAt: draft.createdAt ?? now, updatedAt: now,
      stage: deriveStage(draft),
      visibility: 'private', disclaimer: SIGNAL_CARD_DISCLAIMER,
    }
    saveCard($state.snapshot(draft))
    clearDraft()
    step = 'card'
  }
  function restart() {
    draft = { evidenceNeeded: [], tags: [] }
    clearDraft()
    step = 'intro'
  }

  // gating
  const canSuspicion = $derived((draft.suspicion ?? '').trim().length >= 10)
  const canQuestion = $derived((draft.question ?? '').trim().length >= 10)
  const canUncertainty = $derived((draft.uncertainty ?? '').trim().length >= 5)
  const sensitive = $derived(/\b(\d{2,})\b|@|password|passwort|iban|address|adresse/i.test(draft.suspicion ?? ''))
</script>

<section class="flow" aria-label="G1 initiation">
  {#if step !== 'intro' && step !== 'card'}
    <ol class="progress">
      {#each PROGRESS as label, i (label)}
        <li class:on={i <= progressIndex} class:cur={i === progressIndex}>{i + 1} {label}</li>
      {/each}
    </ol>
  {/if}

  {#if step === 'intro'}
    <div class="panel intro">
      <p class="ghost">A feeling is not evidence. But it can become the beginning of a question.</p>
      <p class="lede">This station turns a vague suspicion into your first DATAVISM Signal Card. You will not prove everything today — you will open an investigation.</p>
      <button class="go" onclick={() => go('system-signal')}>Enter the Folder →</button>
    </div>
  {:else if step === 'system-signal'}
    <div class="panel">
      <p class="ghost">What kind of system is on your mind?</p>
      <div class="grid">
        {#each SYSTEM_SIGNALS as s (s.id)}
          <button class="opt" class:sel={draft.systemSignal === s.id} onclick={() => pickSignal(s)}>{s.label}</button>
        {/each}
      </div>
    </div>
  {:else if step === 'suspicion'}
    <div class="panel">
      <p class="ghost">Do not prove it yet. Name what you noticed.</p>
      <textarea bind:value={draft.suspicion} maxlength="280" rows="3" placeholder="A website seems to know what I was looking for elsewhere."></textarea>
      {#if sensitive}<p class="warn">Keep personal data out — no names, emails, addresses or numbers about real people.</p>{/if}
      <div class="nav"><button class="ghostbtn" onclick={back}>← Back</button><button class="go" disabled={!canSuspicion} onclick={() => go('question')}>Next →</button></div>
    </div>
  {:else if step === 'question'}
    <div class="panel">
      <p class="ghost">Turn the suspicion into a question that could be answered with evidence.</p>
      <textarea bind:value={draft.question} maxlength="280" rows="3" placeholder="What evidence would show that this site tracks me before I consent?"></textarea>
      <div class="hints">
        {#each ['What evidence would show that [system] does [behavior]?', 'Which actors are involved in [system]?', 'Who benefits from [observed pattern]?'] as t (t)}
          <button class="hint" onclick={() => { draft.question = t }}>{t}</button>
        {/each}
      </div>
      <div class="nav"><button class="ghostbtn" onclick={back}>← Back</button><button class="go" disabled={!canQuestion} onclick={() => go('evidence')}>Next →</button></div>
    </div>
  {:else if step === 'evidence'}
    <div class="panel">
      <p class="ghost">Evidence is what would let someone else inspect the claim.</p>
      <div class="grid">
        {#each EVIDENCE_TYPES as e (e.id)}
          <button class="opt" class:sel={(draft.evidenceNeeded ?? []).includes(e.id)} onclick={() => toggleEvidence(e.id)}>
            <span class="ol">{e.label}</span>{#if e.hint}<span class="oh">{e.hint}</span>{/if}
          </button>
        {/each}
      </div>
      <div class="nav"><button class="ghostbtn" onclick={back}>← Back</button><button class="go" onclick={() => go('uncertainty')}>Next →</button></div>
    </div>
  {:else if step === 'uncertainty'}
    <div class="panel">
      <p class="ghost">Uncertainty is not weakness. It is where the investigation stays honest.</p>
      <textarea bind:value={draft.uncertainty} maxlength="280" rows="3" placeholder="I do not know who receives the data."></textarea>
      <div class="nav"><button class="ghostbtn" onclick={back}>← Back</button><button class="go" disabled={!canUncertainty} onclick={enterRoute}>Next →</button></div>
    </div>
  {:else if step === 'route'}
    <div class="panel">
      <p class="ghost">The map can suggest a route. Only you choose the path.</p>
      <div class="grid">
        {#each LINES as l (l.id)}
          <button class="opt" class:sel={draft.nextLineChoice === l.id} class:suggested={(draft.suggestedLines ?? []).includes(l.id)} onclick={() => { draft.nextLineChoice = l.id }}>
            <span class="ol">{l.code} — {l.name}</span><span class="oh">{l.motto}</span>
          </button>
        {/each}
      </div>
      <div class="nav"><button class="ghostbtn" onclick={back}>← Back</button><button class="go" onclick={finishCard}>Generate Signal Card →</button></div>
    </div>
  {:else if step === 'card'}
    <div class="panel cardwrap">
      <p class="ghost done">Investigation opened. This is your Signal Card — it is not evidence yet.</p>
      <SignalCard card={draft} />
      <div class="nav"><button class="ghostbtn" onclick={restart}>Start another →</button></div>
    </div>
  {/if}
</section>

<style>
  .flow { border: 1px solid var(--color-edge); background: var(--color-panel); padding: 22px; }
  .progress { display: flex; flex-wrap: wrap; gap: 8px 14px; list-style: none; margin: 0 0 20px; padding: 0; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; }
  .progress li { color: var(--color-ink-5); }
  .progress li.on { color: var(--color-ink-3); }
  .progress li.cur { color: var(--color-line-g); }
  .panel { display: grid; gap: 16px; }
  .ghost { font-size: clamp(16px, 2.2vw, 20px); line-height: 1.4; color: var(--color-ink); margin: 0; }
  .ghost.done { color: var(--color-line-g); }
  .lede { font-size: 14px; line-height: 1.6; color: var(--color-ink-3); margin: 0; max-width: 58ch; }
  textarea { width: 100%; box-sizing: border-box; background: var(--color-bg); border: 1px solid var(--color-edge-2); color: var(--color-ink); font: inherit; font-size: 15px; line-height: 1.5; padding: 12px; resize: vertical; }
  .grid { display: grid; gap: 10px; }
  .opt { display: grid; gap: 3px; text-align: left; background: var(--color-panel-2); border: 1px solid var(--color-edge); color: var(--color-ink); padding: 13px 15px; cursor: pointer; font: inherit; }
  .opt:hover { border-color: var(--color-edge-3); }
  .opt.sel { border-color: var(--color-line-g); box-shadow: inset 0 0 0 1px var(--color-line-g); }
  .opt.suggested:not(.sel) { border-left: 3px solid var(--color-line-g); }
  .ol { font-size: 14px; }
  .oh { font-size: 11.5px; color: var(--color-ink-4); }
  .hints { display: grid; gap: 6px; }
  .hint { text-align: left; background: transparent; border: 1px dashed var(--color-edge-2); color: var(--color-ink-3); font: inherit; font-size: 12px; padding: 8px 10px; cursor: pointer; }
  .warn { font-size: 12px; color: var(--color-magenta); margin: 0; }
  .nav { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 4px; }
  .go { background: var(--color-signal); color: var(--color-panel-2); border: none; font-family: var(--font-mono); font-size: 12.5px; letter-spacing: 0.06em; text-transform: uppercase; font-weight: 700; padding: 13px 20px; cursor: pointer; }
  .go:disabled { opacity: 0.4; cursor: not-allowed; }
  .ghostbtn { background: transparent; border: 1px solid var(--color-edge-2); color: var(--color-ink-3); font-family: var(--font-mono); font-size: 11.5px; letter-spacing: 0.06em; padding: 11px 16px; cursor: pointer; }
  .cardwrap { justify-items: start; }
</style>
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run check`
Expected: 0 errors / 0 warnings / 0 hints.

- [ ] **Step 3: Commit**

```bash
git add src/components/initiation/G1InitiationFlow.svelte
git commit -m "feat(g1): initiation flow stepper (intro → route → card)"
```

---

### Task 7: Card-step export actions (copy / Markdown / JSON / PNG)

**Files:**
- Modify: `src/components/initiation/G1InitiationFlow.svelte`
- Dependency: add `modern-screenshot`

**Interfaces:**
- Consumes: `toMarkdown`, `toJson`, `downloadFile`, `copyText` from `../../lib/signal-cards/export`; `domToPng` from `modern-screenshot`.
- Produces: export buttons on the card step; PNG renders the wrapped `SignalCard` node.

- [ ] **Step 1: Add the dependency**

Run: `npm install modern-screenshot`
Expected: adds `modern-screenshot` to `dependencies`.

- [ ] **Step 2: Extend the script block** — add to the imports at the top of `G1InitiationFlow.svelte`:

```js
  import { toMarkdown, toJson, downloadFile, copyText } from '../../lib/signal-cards/export'
  import { domToPng } from 'modern-screenshot'
```

And add this state + handlers just below the `restart()` function:

```js
  let cardEl = $state(null)
  let copied = $state(false)

  async function doCopy() {
    copied = await copyText(toMarkdown($state.snapshot(draft)))
    setTimeout(() => (copied = false), 1600)
  }
  function doMarkdown() { downloadFile(`${draft.id}.md`, toMarkdown($state.snapshot(draft)), 'text/markdown') }
  function doJson() { downloadFile(`${draft.id}.json`, toJson($state.snapshot(draft)), 'application/json') }
  async function doPng() {
    if (!cardEl) return
    const url = await domToPng(cardEl, { scale: 2, backgroundColor: '#060608' })
    const a = document.createElement('a')
    a.href = url; a.download = `${draft.id}.png`; a.click()
  }
```

- [ ] **Step 3: Replace the card-step markup** — change the `{:else if step === 'card'}` block to wrap the card in a ref and add an actions row:

```svelte
  {:else if step === 'card'}
    <div class="panel cardwrap">
      <p class="ghost done">Investigation opened. This is your Signal Card — it is not evidence yet.</p>
      <div bind:this={cardEl}><SignalCard card={draft} /></div>
      <div class="actions">
        <button class="act" onclick={doCopy}>{copied ? 'Copied ✓' : 'Copy text'}</button>
        <button class="act" onclick={doMarkdown}>Download .md</button>
        <button class="act" onclick={doJson}>Download .json</button>
        <button class="act" onclick={doPng}>Download .png</button>
      </div>
      <div class="nav"><button class="ghostbtn" onclick={restart}>Start another →</button></div>
    </div>
```

- [ ] **Step 4: Add the actions style** — add inside the `<style>` block:

```css
  .actions { display: flex; flex-wrap: wrap; gap: 8px; }
  .act { background: var(--color-panel-2); border: 1px solid var(--color-edge-2); color: var(--color-ink); font-family: var(--font-mono); font-size: 11.5px; letter-spacing: 0.04em; padding: 10px 14px; cursor: pointer; }
  .act:hover { border-color: var(--color-line-g); }
```

- [ ] **Step 5: Verify build + manual export**

Run: `npm run check && npm run build`
Expected: check 0/0/0; build green.

- [ ] **Step 6: Commit**

```bash
git add src/components/initiation/G1InitiationFlow.svelte package.json package-lock.json
git commit -m "feat(g1): card export — copy/md/json/png (modern-screenshot)"
```

---

### Task 8: Card-step upgrade-to-Case-File + archive contribution

**Files:**
- Modify: `src/components/initiation/G1InitiationFlow.svelte`

**Interfaces:**
- Consumes: `deriveStage`, `saveCard` (already imported).
- Produces: an optional "make it a full Case File" section (3 fields) that re-derives stage + re-saves, and an opt-in contribution block (copy anonymized payload only — no posting).

- [ ] **Step 1: Add state + handlers** — below the PNG handler in the script:

```js
  let showUpgrade = $state(false)
  let contributeMsg = $state('')

  function upgradeFields() {
    draft.stage = deriveStage(draft)
    draft.updatedAt = new Date().toISOString()
    saveCard($state.snapshot(draft))
  }
  async function contribute() {
    const payload = { ...$state.snapshot(draft), visibility: 'public-anonymous', suspicion: undefined }
    const ok = await copyText(JSON.stringify(payload, null, 2))
    contributeMsg = ok
      ? 'Anonymized payload copied. Nothing was posted — send it in if you want it curated into the Archive.'
      : 'Copy failed — your card stays private on this device.'
  }
```

- [ ] **Step 2: Insert the two blocks** — in the `{:else if step === 'card'}` panel, between the `.actions` div and the final `.nav` div:

```svelte
      <div class="upgrade">
        {#if !showUpgrade}
          <button class="ghostbtn" onclick={() => (showUpgrade = true)}>Make it a full Case File →</button>
        {:else}
          <p class="ghost">Three more fields turn the Signal Card into Case File #1.</p>
          <label class="fld">Actor<input bind:value={draft.actor} placeholder="Who creates, operates or benefits?" /></label>
          <label class="fld">Source lead<input bind:value={draft.sourceLead} placeholder="Where could evidence be found?" /></label>
          <label class="fld">Public relevance<input bind:value={draft.publicRelevance} placeholder="Why does this matter beyond one person?" /></label>
          <button class="go" onclick={upgradeFields}>Save Case File</button>
        {/if}
      </div>

      <div class="contribute">
        <p class="muted">Your card is private on this device. You can keep it that way, export it, or contribute an anonymized copy.</p>
        <button class="ghostbtn" onclick={contribute}>Contribute anonymously (copy payload)</button>
        {#if contributeMsg}<p class="muted ok">{contributeMsg}</p>{/if}
        <a class="muted link" href="/archive">View the Signal Archive →</a>
      </div>
```

- [ ] **Step 3: Add styles** — inside `<style>`:

```css
  .upgrade { display: grid; gap: 10px; border-top: 1px solid var(--color-edge); padding-top: 16px; }
  .fld { display: grid; gap: 4px; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.1em; color: var(--color-ink-4); text-transform: uppercase; }
  .fld input { background: var(--color-bg); border: 1px solid var(--color-edge-2); color: var(--color-ink); font: inherit; font-size: 14px; text-transform: none; letter-spacing: 0; padding: 10px; }
  .contribute { display: grid; gap: 8px; border-top: 1px solid var(--color-edge); padding-top: 16px; }
  .muted { font-size: 12px; line-height: 1.55; color: var(--color-ink-4); margin: 0; }
  .muted.ok { color: var(--color-line-g); }
  .link { color: var(--color-signal); text-decoration: none; }
```

- [ ] **Step 4: Verify**

Run: `npm run check && npm run build`
Expected: check 0/0/0; build green.

- [ ] **Step 5: Commit**

```bash
git add src/components/initiation/G1InitiationFlow.svelte
git commit -m "feat(g1): upgrade-to-Case-File + opt-in anonymized contribution"
```

---

### Task 9: Wire the flow into the G1 page (frontmatter-gated)

**Files:**
- Modify: `src/content.config.ts` (add `interactive` field)
- Modify: `src/content/stations/the-folder.md` (set the flag)
- Modify: `src/pages/[line]/[station].astro` (render the flow for G1; skip rail SelfCheck for interactive stations)

**Interfaces:**
- Consumes: `G1InitiationFlow.svelte`.
- Produces: `/line-g/the-folder` shows the interactive flow as its centerpiece; G2–G5 are unchanged (still show the rail `SelfCheck`).

- [ ] **Step 1: Add the schema field** — in `src/content.config.ts`, inside the `z.object({...})`, after the `stationSentence` line:

```ts
    interactive: z.enum(['g1-initiation']).optional(), // opt-in interactive mission island
```

- [ ] **Step 2: Set the flag** — in `src/content/stations/the-folder.md` frontmatter, add this line directly under `status: open`:

```yaml
interactive: g1-initiation
```

- [ ] **Step 3: Import + render the flow** — in `src/pages/[line]/[station].astro`:

Add to the imports:

```astro
import G1InitiationFlow from '../../components/initiation/G1InitiationFlow.svelte'
```

Insert the flow between the closing `</section>` of the hero and the `<!-- BODY -->` comment:

```astro
    {d.interactive === 'g1-initiation' && (
      <section class="initiation">
        <G1InitiationFlow client:load stationId={station.id} />
      </section>
    )}
```

Wrap the existing rail SelfCheck so it is skipped for interactive stations — change:

```astro
        <SelfCheck client:visible stationId={station.id} checks={d.selfChecks ?? []} artifactLabel={cur.artifact} beginHref="#" doneHref="/underground" />
```

to:

```astro
        {!d.interactive && <SelfCheck client:visible stationId={station.id} checks={d.selfChecks ?? []} artifactLabel={cur.artifact} beginHref="#" doneHref="/underground" />}
```

Add to the `<style>` block:

```css
  .initiation { padding: 28px 0 8px; border-bottom: 1px solid var(--color-edge); }
```

- [ ] **Step 4: Verify routing + non-regression**

Run: `npm run check && npm run build`
Expected: check 0/0/0; build green; `/line-g/the-folder/index.html` builds.

Run a Playwright check (preview on `:4330`): navigate to `/line-g/the-folder/`, freeze animations, assert the flow renders and the rail SelfCheck is absent; navigate to `/line-g/command/`, assert SelfCheck IS present.

```js
// after: npx astro build && npx astro preview --port 4330
// browser_evaluate on /line-g/the-folder/
() => ({ flow: !!document.querySelector('.flow'), selfcheck: !!document.querySelector('.panel .kicker') })
// expect: { flow: true, selfcheck: false }
```

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content/stations/the-folder.md "src/pages/[line]/[station].astro"
git commit -m "feat(g1): mount initiation flow on THE FOLDER (frontmatter-gated)"
```

---

### Task 10: Sample Signal Cards (curated archive data)

**Files:**
- Create: `src/data/archive/sample-signal-cards.ts`
- Test: `src/data/archive/sample-signal-cards.test.ts`

**Interfaces:**
- Consumes: `SignalCard`, `SIGNAL_CARD_DISCLAIMER` from `../../lib/signal-cards/types`.
- Produces: `SAMPLE_SIGNAL_CARDS: SignalCard[]` — ~6 authored, honest example cards across lines/stages, each `visibility: 'public-anonymous'`.

- [ ] **Step 1: Write the failing test**

```ts
// src/data/archive/sample-signal-cards.test.ts
import { describe, it, expect } from 'vitest'
import { SAMPLE_SIGNAL_CARDS } from './sample-signal-cards'

describe('sample signal cards', () => {
  it('has at least six curated entries', () => {
    expect(SAMPLE_SIGNAL_CARDS.length).toBeGreaterThanOrEqual(6)
  })
  it('every entry is honest and curated', () => {
    for (const c of SAMPLE_SIGNAL_CARDS) {
      expect(c.question.length).toBeGreaterThan(0)
      expect(c.uncertainty.length).toBeGreaterThan(0)
      expect(c.disclaimer).toMatch(/not evidence yet/i)
      expect(c.visibility).toBe('public-anonymous')
      expect(['question', 'case-file']).toContain(c.stage)
    }
  })
  it('uses unique ids', () => {
    const ids = SAMPLE_SIGNAL_CARDS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/archive/sample-signal-cards.test.ts`
Expected: FAIL — cannot find module `./sample-signal-cards`.

- [ ] **Step 3: Write the implementation** (author 6 honest examples — vary line/systemSignal/stage; all carry uncertainty + disclaimer)

```ts
// src/data/archive/sample-signal-cards.ts
// Curated, illustrative Signal Cards for the public Archive. These are authored
// examples of the method — clearly labeled curated, never presented as real
// user submissions. Every card states its uncertainty and carries the disclaimer.
import type { SignalCard } from '../../lib/signal-cards/types'
import { SIGNAL_CARD_DISCLAIMER } from '../../lib/signal-cards/types'

const base = {
  version: 1 as const, line: 'g' as const, station: 'g1-the-folder' as const,
  createdAt: '2026-06-01T00:00:00.000Z', tags: ['curated'] as string[],
  visibility: 'public-anonymous' as const, disclaimer: SIGNAL_CARD_DISCLAIMER,
}

export const SAMPLE_SIGNAL_CARDS: SignalCard[] = [
  { ...base, id: 'sc_sample01', stage: 'question', systemSignal: 'tracking',
    suspicion: 'A shop showed me an item I only searched for in another app.',
    question: 'What technical signals would show cross-app tracking before I gave consent?',
    evidenceNeeded: ['technical-signal', 'platform-output'], uncertainty: 'I cannot tell which company links the two apps.',
    suggestedLines: ['k', 'g'], nextLineChoice: 'k' },
  { ...base, id: 'sc_sample02', stage: 'question', systemSignal: 'money',
    suspicion: 'A "free" service keeps a problem alive that it also sells the fix for.',
    question: 'Who profits when this problem is not solved, and how is that visible in public filings?',
    evidenceNeeded: ['public-record', 'document'], uncertainty: 'I do not know the ownership structure yet.',
    suggestedLines: ['r', 'g'], nextLineChoice: 'r' },
  { ...base, id: 'sc_sample03', stage: 'question', systemSignal: 'feed',
    suspicion: 'My feed narrows to one emotion the longer I scroll.',
    question: 'What evidence would show that engagement ranking amplifies one emotion over time?',
    evidenceNeeded: ['platform-output', 'observation'], uncertainty: 'I cannot separate my own behavior from the ranking.',
    suggestedLines: ['b', 'g'], nextLineChoice: 'b' },
  { ...base, id: 'sc_sample04', stage: 'case-file', systemSignal: 'future',
    suspicion: 'A local water level shifts every year but no one names it.',
    question: 'How has this measurable trend changed over the last decade in public datasets?',
    evidenceNeeded: ['dataset', 'public-record'], uncertainty: 'I do not know if the gauge method changed.',
    suggestedLines: ['v', 'g'], nextLineChoice: 'v',
    actor: 'Regional water authority', sourceLead: 'Open environmental data portal', publicRelevance: 'Affects everyone living downstream.' },
  { ...base, id: 'sc_sample05', stage: 'question', systemSignal: 'tracking',
    suspicion: 'A news site loads many third parties before I click anything.',
    question: 'Which third-party domains receive a request before consent on this page?',
    evidenceNeeded: ['technical-signal'], uncertainty: 'I cannot yet identify who owns each domain.',
    suggestedLines: ['k', 'g'], nextLineChoice: 'k' },
  { ...base, id: 'sc_sample06', stage: 'question', systemSignal: 'unsure',
    suspicion: 'Something about an everyday app feels off, but I cannot name it.',
    question: 'What is the single most testable thing about this discomfort?',
    evidenceNeeded: ['unknown'], uncertainty: 'I do not yet know what I am actually looking for.',
    suggestedLines: ['g', 'k', 'r', 'b'], nextLineChoice: 'g' },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/archive/sample-signal-cards.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/archive/sample-signal-cards.ts src/data/archive/sample-signal-cards.test.ts
git commit -m "feat(archive): curated sample Signal Cards"
```

---

### Task 11: Signal Archive grid + page

**Files:**
- Create: `src/components/archive/SignalArchiveGrid.svelte`
- Create: `src/pages/archive.astro`

**Interfaces:**
- Consumes: `SAMPLE_SIGNAL_CARDS` from `../../data/archive/sample-signal-cards`; `loadCards` from `../../lib/signal-cards/storage`; `STAGE_LEGEND`, `LineId` from `../../lib/signal-cards/types`; `SignalCard.svelte`; `Base.astro`.
- Produces: `/archive` page — intro + stage legend + your local cards + curated samples + line/stage filters + disclaimer + cross-link to `/underground`.

- [ ] **Step 1: Write the grid island**

```svelte
<!-- src/components/archive/SignalArchiveGrid.svelte -->
<script>
  import { loadCards } from '../../lib/signal-cards/storage'
  import SignalCard from '../signal-card/SignalCard.svelte'

  let { samples = [] } = $props()

  let mine = $state([])
  let line = $state('all')
  let stage = $state('all')

  let loaded = false
  $effect(() => { if (loaded) return; loaded = true; mine = loadCards() })

  const all = $derived([...mine, ...samples])
  const shown = $derived(all.filter((c) =>
    (line === 'all' || c.nextLineChoice === line) && (stage === 'all' || c.stage === stage)))
</script>

<div class="filters">
  <select bind:value={line} aria-label="Filter by line">
    <option value="all">All lines</option>
    <option value="g">G</option><option value="k">K</option><option value="r">R</option><option value="b">B</option><option value="v">V</option>
  </select>
  <select bind:value={stage} aria-label="Filter by stage">
    <option value="all">All stages</option>
    <option value="question">Question</option><option value="case-file">Case File</option>
  </select>
  <span class="count">{shown.length} signal{shown.length === 1 ? '' : 's'}</span>
</div>

{#if mine.length}<p class="mine-note">The first {mine.length} are yours, saved on this device.</p>{/if}

{#if shown.length}
  <div class="grid">
    {#each shown as c (c.id)}<SignalCard card={c} />{/each}
  </div>
{:else}
  <p class="empty">No signals match this filter yet.</p>
{/if}

<style>
  .filters { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-bottom: 18px; }
  select { background: var(--color-bg); border: 1px solid var(--color-edge-2); color: var(--color-ink); font-family: var(--font-mono); font-size: 12px; padding: 8px 10px; }
  .count { font-family: var(--font-mono); font-size: 11px; color: var(--color-ink-4); }
  .mine-note { font-size: 12px; color: var(--color-line-g); margin: 0 0 14px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; align-items: start; }
  .empty { color: var(--color-ink-4); font-size: 14px; }
</style>
```

- [ ] **Step 2: Write the page**

```astro
---
// src/pages/archive.astro — The Signal Archive: a collective, honest map of
// questions about hidden systems. Curated samples + your own local cards. No
// public posting in this phase; nothing here is a proven claim.
import Base from '../layouts/Base.astro'
import SignalArchiveGrid from '../components/archive/SignalArchiveGrid.svelte'
import { SAMPLE_SIGNAL_CARDS } from '../data/archive/sample-signal-cards'
import { STAGE_LEGEND } from '../lib/signal-cards/types'
---
<Base title="The Signal Archive — DATAVISM" description="A collective map of questions about hidden systems. Not proof — investigation.">
  <main class="ar">
    <section class="hero">
      <div class="crumb">DATAVISM <span class="sep">/</span> <span class="sig">SIGNAL ARCHIVE</span></div>
      <h1 class="font-display title">THE SIGNAL ARCHIVE</h1>
      <p class="intro">A collective, evolving map of questions about hidden systems. Entries sit at different stages — a Signal Card is not automatically a proven claim. DATAVISM marks uncertainty instead of hiding it.</p>
      <ol class="legend">
        {STAGE_LEGEND.map((s, i) => (<li><span class="n">{i + 1}</span>{s.label}</li>))}
      </ol>
    </section>

    <section class="body">
      <SignalArchiveGrid client:visible samples={SAMPLE_SIGNAL_CARDS} />
    </section>

    <p class="disclaimer">Archive entries may represent questions, signals or evidence depending on their stage. A Signal Card is not automatically a proven claim. Published Case Files live in <a href="/underground">the Underground</a>.</p>
  </main>
</Base>

<style>
  .ar { max-width: 1160px; margin: 0 auto; padding: 0 28px; }
  .hero { padding: 40px 0 28px; border-bottom: 1px solid var(--color-edge); }
  .crumb { font-size: 11px; letter-spacing: 0.14em; color: var(--color-ink-4); margin-bottom: 22px; }
  .sep { color: var(--color-ink-5); } .sig { color: var(--color-signal); }
  .title { font-weight: 800; font-size: clamp(34px, 6vw, 68px); line-height: 0.96; letter-spacing: -0.04em; margin: 0; }
  .intro { max-width: 64ch; font-size: 15px; line-height: 1.65; color: var(--color-ink-3); margin: 18px 0 0; }
  .legend { display: flex; flex-wrap: wrap; gap: 10px 18px; list-style: none; padding: 0; margin: 22px 0 0; font-family: var(--font-mono); font-size: 11px; color: var(--color-ink-3); }
  .legend li { display: flex; align-items: center; gap: 7px; }
  .legend .n { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border: 1px solid var(--color-edge-2); color: var(--color-ink-4); font-size: 10px; }
  .body { padding: 30px 0 36px; }
  .disclaimer { font-size: 12px; line-height: 1.6; color: var(--color-ink-5); border-top: 1px solid var(--color-edge); padding: 18px 0 56px; margin: 0; }
  .disclaimer a { color: var(--color-signal); }
</style>
```

- [ ] **Step 3: Verify**

Run: `npm run check && npm run build`
Expected: check 0/0/0; build green; `/archive/index.html` builds.

Playwright (preview `:4330`): navigate `/archive/`, assert ≥6 cards render and the stage legend shows 5 items.

- [ ] **Step 4: Commit**

```bash
git add src/components/archive/SignalArchiveGrid.svelte src/pages/archive.astro
git commit -m "feat(archive): Signal Archive grid + /archive page"
```

---

### Task 12: Cookieless analytics (production-gated, swappable)

**Files:**
- Create: `src/components/site/Analytics.astro`
- Modify: `src/layouts/Base.astro` (include in `<head>`)
- Modify: `.env.example` (document the two public vars)

**Interfaces:**
- Produces: a head-only component that renders the analytics script **only** when `import.meta.env.PROD` AND both `PUBLIC_UMAMI_SRC` + `PUBLIC_UMAMI_WEBSITE_ID` are set. No cookies, no PII, no consent banner. Swapping providers = editing this one file.

- [ ] **Step 1: Write the component**

```astro
---
// src/components/site/Analytics.astro — cookieless, no-PII web analytics.
// Renders ONLY in production and ONLY when the provider env vars are set, so dev
// and previews stay clean. No cookies / no device storage → no consent banner.
// Swap providers (Umami ⇄ Plausible) by editing the <script> tag below only.
const src = import.meta.env.PUBLIC_UMAMI_SRC
const websiteId = import.meta.env.PUBLIC_UMAMI_WEBSITE_ID
const enabled = import.meta.env.PROD && src && websiteId
---
{enabled && <script defer src={src} data-website-id={websiteId} data-cache="true"></script>}
```

- [ ] **Step 2: Include it in Base** — in `src/layouts/Base.astro`, add the import near the other component imports:

```astro
import Analytics from '../components/site/Analytics.astro'
```

and render it inside the `<head>` (place it just before the closing `</head>`):

```astro
<Analytics />
```

- [ ] **Step 3: Document the env vars** — append to `.env.example`:

```bash

# Cookieless analytics (no cookies, no PII, no consent banner). Provider-swappable.
# Umami (default): PUBLIC_UMAMI_SRC = your script URL, PUBLIC_UMAMI_WEBSITE_ID = site id.
PUBLIC_UMAMI_SRC=
PUBLIC_UMAMI_WEBSITE_ID=
```

- [ ] **Step 4: Verify gating**

Run: `npm run build`
Expected: build green. Then confirm no analytics script leaked into the dev/no-env build:

Run: `grep -r "data-website-id" dist || echo "absent (expected without env)"`
Expected: `absent (expected without env)` (the script only appears in a prod build with the env vars set).

- [ ] **Step 5: Commit**

```bash
git add src/components/site/Analytics.astro src/layouts/Base.astro .env.example
git commit -m "feat(analytics): cookieless, prod-gated, provider-swappable"
```

---

### Task 13: Full verification + PR

**Files:** none (verification + PR only)

- [ ] **Step 1: Full check + build + tests**

Run: `npm run check && npm run build && npm test`
Expected: check 0/0/0; build green (emits `/line-g/the-folder/`, `/archive/`); all vitest suites pass (types, route-suggestions, storage, export, sample cards, plus the existing curriculum tests).

- [ ] **Step 2: Playwright end-to-end walkthrough**

Preview on `:4330` and walk the whole loop with animations frozen (`*{animation:none!important;transition:none!important}`):
- `/line-g/the-folder/` → flow renders; complete all 7 steps (signal → suspicion → question → evidence → uncertainty → route → generate) → a Signal Card appears with the chosen line and the "NOT EVIDENCE YET" stamp.
- Click **Download .md** / **.json** / **.png** → assert no console errors.
- Expand **Make it a full Case File** → fill 3 fields → Save → card stamp flips to "Case File #1".
- Reload the page → the saved draft/card persists.
- `/archive/` → your card shows in "yours", ≥6 curated samples render, filters work.
- `/line-g/command/` → still shows the rail SelfCheck (non-regression).

- [ ] **Step 3: Push + open PR (do NOT merge)**

```bash
git push -u origin feat/g1-initiation
gh pr create --base main --head feat/g1-initiation \
  --title "G1 Interactive Initiation + Signal Archive (Phase 1)" \
  --body "Phase 1 of the G1 initiation work (design: docs/product/g1-initiation-design.md). Interactive G1 flow → shareable Signal Card that extends into a Case File, /archive, cookieless analytics. Anonymous, localStorage, no AI/accounts (Phases 2/3). Stacked on feat/line-k (PR #22) — merge order line-k → this."
```

Report the PR URL; leave merge to the user.

---

## Self-Review

**Spec coverage** (against `g1-initiation-design.md` + owner spec):
- Initiation loop (intro→…→card) → Tasks 6–8. ✓
- Signal Card extends into Case File (5 fields + 3 upgrade, stage flip) → Tasks 1, 6, 8. ✓
- Route suggestions (deterministic, advisory) → Task 2; consumed in Task 6. ✓
- localStorage drafts + cards, account-ready shapes → Task 3. ✓
- Export copy/MD/JSON/PNG → Tasks 4, 7. ✓
- Minimal Signal Archive (samples + your cards + stages + disclaimer + /underground link) → Tasks 10, 11. ✓
- Cookieless analytics, no banner, swappable → Task 12. ✓
- Honesty rules (disclaimer, required uncertainty, PII warning, no posting, no AI) → Tasks 1, 6, 8. ✓
- G1-only integration; G2–G5 untouched → Task 9 (frontmatter gate + non-regression check). ✓

**Placeholder scan:** every code step shows complete code; no TBD/TODO/"handle edge cases". ✓

**Type consistency:** `SignalCard` fields and helper names (`deriveStage`, `suggestLines`, `loadDraft/saveDraft/clearDraft/loadCards/saveCard/removeCard/newCardId`, `toMarkdown/toJson/stageLabel/downloadFile/copyText`, `SAMPLE_SIGNAL_CARDS`) are defined once and reused with identical signatures across Tasks 1–12. The `SignalCard.svelte` `card` prop and `G1InitiationFlow` draft shape both align with the `SignalCard` type. ✓

**Out of Phase-1 scope (by design):** Firebase identity/`/connect`, progress sync, live GHOST AI — Phases 2/3.
