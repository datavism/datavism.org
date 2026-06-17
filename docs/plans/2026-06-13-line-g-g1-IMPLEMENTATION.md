# LINE G · G1 THE FOLDER — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship Station **G1 "THE FOLDER"** as a complete, playable Astro station at `/line-g/the-folder`, plus the minimal Phase-2 foundation it needs (a `stations` content collection, the `/line-g` line page, a CROSSWALK-compatible ticket store, and `/ticket`).

**Architecture:** Astro 5 static pages render the station's six beats (design §4). The cinematic story-kern (cold-open → escalation → collapse → GHOST) is a Svelte island ported verbatim from the verified spike `experiments/folder-spike/index.html`, with CDN imports swapped for npm `three`/`gsap` and WebGL loaded lazily in `onMount` so the narrative text still SSRs. A pure, TDD'd ticket-store logic module (mirroring the existing `signals.ts` pattern) plus a thin `localStorage` adapter back the self-check stamp and the `/ticket` receipt. No backend is added.

**Tech Stack:** Astro 5.18, Svelte 5 (runes: `$state`/`$props`/`$derived`), Tailwind v4 (`@theme` tokens in `src/styles/global.css`), Vitest 4, TypeScript (strict), `three` + `gsap` (new npm deps), Web Audio (synthesized, no files).

**Source-of-truth for the story-kern:** `experiments/folder-spike/index.html` (data verified 2026-06-13, see `experiments/folder-spike/VERIFY-G1.md`). Do **not** re-derive the WebGL/audio code — port it.

**Honesty rules (binding, design §7):** no tracking, no network except the bundled libs, no storage except the ticket `localStorage`. The folder-on-you stays ephemeral (never sent, never saved). Ticket wording says **"self-stamped"**. All shown segments stay verbatim-sourced.

---

## File Structure

**Create:**
- `src/lib/ticket.ts` — pure ticket logic (no `localStorage`). One responsibility: ticket shape + transforms.
- `src/lib/ticket.test.ts` — Vitest unit tests for the logic.
- `src/lib/ticket-storage.ts` — thin `localStorage` adapter (SSR-safe). Isolated so logic stays pure/testable.
- `src/content.config.ts` — Astro Content Layer config; defines the `stations` collection + Zod schema.
- `src/content/stations/the-folder.md` — the G1 entry (frontmatter data + authored beats).
- `src/pages/line-g/index.astro` — the Line G page (lists stations honestly: open / announced / locked).
- `src/pages/line-g/[station].astro` — the station template (six beats), renders any open station.
- `src/pages/ticket.astro` — the ticket receipt page (mounts `TicketView`).
- `src/components/TheFolderStory.svelte` — the WebGL/GSAP/audio story-kern island (ported from spike).
- `src/components/StationSelfCheck.svelte` — binary self-checks → stamps the ticket.
- `src/components/TicketView.svelte` — reads the ticket from `localStorage`, renders the receipt.

**Modify:**
- `package.json` — add `three`, `gsap` deps (and `@types/three` dev dep).
- `src/lib/copy/en.ts` — add `lineG` + `station` + `ticket` copy blocks.
- `src/components/NetworkMapTeaser.astro` — make the Line G row link to `/line-g`.

**Do not touch:** `src/components/TrackCounter.svelte`, `SubscribeForm.svelte`, `src/lib/signals.*`, `legal.astro`, `manifesto.astro`, the `/api/subscribe` flow.

---

## Phase A — Ticket store (TDD)

### Task A1: Ticket logic module

**Files:**
- Create: `src/lib/ticket.ts`
- Test: `src/lib/ticket.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// src/lib/ticket.test.ts
import { describe, it, expect } from 'vitest'
import { emptyTicket, stampStation, hasStation, migrate, TICKET_VERSION } from './ticket'

describe('ticket logic', () => {
  it('starts empty at the current version', () => {
    const t = emptyTicket()
    expect(t.version).toBe(TICKET_VERSION)
    expect(t.completedStations).toEqual([])
    expect(t.stamps).toEqual({})
  })

  it('stamps a station with a timestamp (pure — returns a new ticket)', () => {
    const t0 = emptyTicket()
    const t1 = stampStation(t0, 'g1-the-folder', '2026-06-13T10:00:00.000Z')
    expect(t0.completedStations).toEqual([]) // original untouched
    expect(t1.completedStations).toEqual(['g1-the-folder'])
    expect(t1.stamps['g1-the-folder']).toBe('2026-06-13T10:00:00.000Z')
  })

  it('is idempotent — re-stamping keeps the first timestamp and no duplicates', () => {
    const t1 = stampStation(emptyTicket(), 'g1-the-folder', '2026-06-13T10:00:00.000Z')
    const t2 = stampStation(t1, 'g1-the-folder', '2026-06-13T999')
    expect(t2.completedStations).toEqual(['g1-the-folder'])
    expect(t2.stamps['g1-the-folder']).toBe('2026-06-13T10:00:00.000Z')
  })

  it('reports membership', () => {
    const t = stampStation(emptyTicket(), 'g1-the-folder', 'x')
    expect(hasStation(t, 'g1-the-folder')).toBe(true)
    expect(hasStation(t, 'g2-command')).toBe(false)
  })

  it('migrates garbage / null / old shapes to a valid empty ticket', () => {
    expect(migrate(null)).toEqual(emptyTicket())
    expect(migrate('nonsense')).toEqual(emptyTicket())
    expect(migrate({})).toEqual(emptyTicket())
    expect(migrate({ version: 0, completedStations: 'no' })).toEqual(emptyTicket())
  })

  it('migrates a valid ticket through unchanged', () => {
    const good = stampStation(emptyTicket(), 'g1-the-folder', 'x')
    expect(migrate(good)).toEqual(good)
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test`
Expected: FAIL — `Cannot find module './ticket'` / exports undefined.

- [ ] **Step 3: Write the minimal implementation**

```typescript
// src/lib/ticket.ts
// Pure ticket logic — NO localStorage here (kept testable & SSR-safe).
// Shape is CROSSWALK-compatible (design §5): completedStations[] + per-station
// stamps, so it migrates losslessly to crew/{emailHash}.datavism in Phase 4.
export const TICKET_VERSION = 1

export interface Ticket {
  version: number
  completedStations: string[]
  stamps: Record<string, string> // stationId -> ISO timestamp ("self-stamped")
}

export function emptyTicket(): Ticket {
  return { version: TICKET_VERSION, completedStations: [], stamps: {} }
}

export function stampStation(t: Ticket, stationId: string, nowISO: string): Ticket {
  if (t.completedStations.includes(stationId)) return t
  return {
    version: t.version,
    completedStations: [...t.completedStations, stationId],
    stamps: { ...t.stamps, [stationId]: nowISO },
  }
}

export function hasStation(t: Ticket, stationId: string): boolean {
  return t.completedStations.includes(stationId)
}

// Version-tolerant parse: anything that isn't a clean current-version ticket
// degrades to an empty ticket rather than throwing.
export function migrate(raw: unknown): Ticket {
  if (!raw || typeof raw !== 'object') return emptyTicket()
  const r = raw as Partial<Ticket>
  if (
    r.version !== TICKET_VERSION ||
    !Array.isArray(r.completedStations) ||
    typeof r.stamps !== 'object' || r.stamps === null
  ) {
    return emptyTicket()
  }
  return {
    version: TICKET_VERSION,
    completedStations: r.completedStations.filter((s): s is string => typeof s === 'string'),
    stamps: r.stamps as Record<string, string>,
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm run test`
Expected: PASS (all ticket + existing signals tests green).

- [ ] **Step 5: Commit**

```bash
git add src/lib/ticket.ts src/lib/ticket.test.ts
git commit -m "feat(ticket): pure, versioned ticket store logic (TDD)"
```

### Task A2: localStorage adapter

**Files:**
- Create: `src/lib/ticket-storage.ts`

- [ ] **Step 1: Write the implementation**

```typescript
// src/lib/ticket-storage.ts
// Thin localStorage adapter around the pure ticket logic. SSR-safe: every
// access guards on `typeof localStorage`. This is the ONLY storage in the app.
import { emptyTicket, migrate, stampStation, type Ticket } from './ticket'

const KEY = 'datavism.ticket.v1'

export function loadTicket(): Ticket {
  if (typeof localStorage === 'undefined') return emptyTicket()
  try {
    return migrate(JSON.parse(localStorage.getItem(KEY) ?? 'null'))
  } catch {
    return emptyTicket()
  }
}

export function saveTicket(t: Ticket): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(t))
  } catch {
    /* storage full / blocked — fail silent, ticket stays in-memory */
  }
}

// Stamp a station and persist. Returns the new ticket. Uses real wall-clock —
// the wording on the ticket says "self-stamped", which is honest.
export function stampAndSave(stationId: string): Ticket {
  const next = stampStation(loadTicket(), stationId, new Date().toISOString())
  saveTicket(next)
  return next
}
```

- [ ] **Step 2: Verify it type-checks**

Run: `npm run check`
Expected: no new errors from `ticket-storage.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/ticket-storage.ts
git commit -m "feat(ticket): SSR-safe localStorage adapter"
```

---

## Phase B — Content collection + copy

### Task B1: `stations` content collection

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/stations/the-folder.md`

- [ ] **Step 1: Define the collection**

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const stations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stations' }),
  schema: z.object({
    line: z.enum(['g', 'k', 'r', 'b', 'v']),
    index: z.number().int().positive(),
    title: z.string(),
    skill: z.string(),
    status: z.enum(['open', 'announced', 'locked']),
    dropDate: z.string().optional(),
    missionMinutes: z.string(), // e.g. "45–90 min"
    sources: z
      .array(z.object({ label: z.string(), url: z.string().url(), accessed: z.string() }))
      .default([]),
    ogImage: z.string().optional(),
    // authored beats (design §4)
    ghostFragment: z.array(z.string()).default([]), // paragraphs, DRAFT until authored
    mission: z.object({ goal: z.string(), steps: z.array(z.string()) }),
    selfChecks: z.array(z.string()).min(1).max(5),
    artifactName: z.string(), // e.g. "Case File #1"
    nextTeaser: z.string().optional(),
  }),
})

export const collections = { stations }
```

- [ ] **Step 2: Author the G1 entry**

```markdown
---
line: g
index: 1
title: THE FOLDER
skill: Ask the right question (spec-thinking begins)
status: open
missionMinutes: "45–90 min"
artifactName: "Case File #1"
ogImage: /og/line-g-the-folder.png
sources:
  - label: "The Markup — 650,000 ways advertisers label you (2023)"
    url: "https://themarkup.org/privacy/2023/06/08/from-heavy-purchasers-of-pregnancy-tests-to-the-depression-prone-we-found-650000-ways-advertisers-label-you"
    accessed: "2026-06-13"
  - label: "netzpolitik.org — Microsofts Datenmarktplatz Xandr (2023)"
    url: "https://netzpolitik.org/2023/microsofts-datenmarktplatz-xandr-das-sind-650-000-kategorien-in-die-uns-die-online-werbeindustrie-einsortiert/"
    accessed: "2026-06-13"
  - label: "ICCL — scale of Real-Time Bidding (Johnny Ryan, 2022)"
    url: "https://www.iccl.ie/news/iccl-report-on-the-scale-of-real-time-bidding-data-broadcasts-in-the-u-s-and-europe/"
    accessed: "2026-06-13"
ghostFragment:
  - "I built folders like this. Thousands a second. I was good at it."
  - "Then a record came through with my own designation on it. Same template. Same confident little labels — every one a guess, dressed as a fact."
  - "That's the day I walked."
mission:
  goal: "Pick one category that claims to know you, and turn your panic into one provable question."
  steps:
    - "Open your own ad settings (Google My Ad Center, or your phone's ad profile) and find ONE category that judges you."
    - "Write the provable question about it: who assigns it? on what data? who buys it?"
    - "Name the single piece of evidence that would settle whether it's true."
selfChecks:
  - "I picked one real category that claims to know me."
  - "I wrote the provable question: who assigns it, on what data, who buys it."
  - "I named the one piece of data that would settle it."
nextTeaser: "G2 — COMMAND: stop chatting with the machine. Start ordering it."
---

THE FOLDER is the first station on LINE G. The GHOST fragment above is a DRAFT
(authoring pass pending, design §9). The story-kern is the Svelte island; this
body holds only notes the template does not render.
```

- [ ] **Step 3: Verify the collection type-checks and loads**

Run: `npm run check`
Expected: PASS — `astro:content` types generate; `the-folder` validates against the schema.

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts src/content/stations/the-folder.md
git commit -m "feat(content): stations collection + G1 THE FOLDER entry (sourced)"
```

### Task B2: Copy block

**Files:**
- Modify: `src/lib/copy/en.ts`

- [ ] **Step 1: Add a `lineG` + `ticket` block to the exported `COPY` object**

Add these keys inside the existing `COPY` object (keep the existing structure; place after the `map` block):

```typescript
  lineG: {
    title: 'LINE G',
    tagline: 'Foundation · Pate: GHOST · Topic: judgment machines',
    intro:
      'Learn to command AI by dissecting the systems that judge people — the machine class GHOST deserted. Five stations. Other lines are locked, honestly.',
    statusOpen: 'OPEN',
    statusAnnounced: 'ANNOUNCED',
    statusLocked: 'LOCKED',
    stamp: 'self-stamped',
    ticketCta: 'Your ticket ▸',
  },
  ticket: {
    heading: 'YOUR TICKET',
    empty: "No stamps yet. Ride LINE G — finish a station and it self-stamps here.",
    note: 'Stamps are self-stamped and stored only in this browser. Nothing is sent. Clear your browser, lose your ticket — for now.',
    stationDone: 'stamped',
  },
```

- [ ] **Step 2: Verify type-check**

Run: `npm run check`
Expected: no errors; `COPY.lineG` / `COPY.ticket` resolve.

- [ ] **Step 3: Commit**

```bash
git add src/lib/copy/en.ts
git commit -m "feat(copy): LINE G + ticket strings (EN-first)"
```

---

## Phase C — Routes & pages

### Task C1: Line G page

**Files:**
- Create: `src/pages/line-g/index.astro`

- [ ] **Step 1: Write the page**

```astro
---
// src/pages/line-g/index.astro — the Line G page. Lists this line's stations
// from the collection. Open stations link out; announced/locked are honest.
import { getCollection } from 'astro:content'
import Base from '../../layouts/Base.astro'
import { COPY } from '../../lib/copy/en'

const L = COPY.lineG
const stations = (await getCollection('stations'))
  .filter((s) => s.data.line === 'g')
  .sort((a, b) => a.data.index - b.data.index)

const statusLabel = (s: string) =>
  s === 'open' ? L.statusOpen : s === 'announced' ? L.statusAnnounced : L.statusLocked
---
<Base title={`${L.title} — DATAVISM`} description={L.intro}>
  <a class="text-phosphor-dim text-xs hover:text-signal" href="/">&lt; back</a>
  <h1 class="text-signal text-4xl font-bold mt-6">{L.title}</h1>
  <p class="text-phosphor-dim text-sm mt-1">{L.tagline}</p>
  <p class="text-phosphor-hi mt-6 leading-relaxed">{L.intro}</p>

  <ol class="mt-10 space-y-3">
    {stations.map((s) => (
      <li class="border border-phosphor-dim/30 rounded p-4 flex items-baseline justify-between gap-4">
        <div>
          <span class="text-signal font-bold">G{s.data.index}</span>
          <span class="text-phosphor-hi font-bold ml-2">{s.data.title}</span>
          <p class="text-phosphor-dim text-sm mt-1">{s.data.skill}</p>
        </div>
        {s.data.status === 'open' ? (
          <a class="text-signal border border-signal rounded px-3 py-1 text-sm font-bold hover:bg-signal hover:text-ink transition-colors"
             href={`/line-g/${s.id}`}>enter ▸</a>
        ) : (
          <span class="text-phosphor-dim text-xs border border-phosphor-dim/40 rounded px-3 py-1">
            {statusLabel(s.data.status)}{s.data.dropDate ? ` · ${s.data.dropDate}` : ''}
          </span>
        )}
      </li>
    ))}
  </ol>

  <p class="mt-10"><a class="text-signal text-sm" href="/ticket">{L.ticketCta}</a></p>
</Base>
```

- [ ] **Step 2: Verify it builds & renders**

Run: `npm run build`
Expected: PASS. Then `npm run preview`, open `/line-g` — G1 shows an "enter ▸" link.

- [ ] **Step 3: Commit**

```bash
git add src/pages/line-g/index.astro
git commit -m "feat(line-g): line page listing stations from the collection"
```

### Task C2: Station template (six beats)

**Depends on:** C-Task islands (D1, D2) for the mounted components. Build this page first with the island tags in place; the islands land in Phase D. Until then `npm run build` will fail on the missing imports — that is expected and resolved by Phase D.

**Files:**
- Create: `src/pages/line-g/[station].astro`

- [ ] **Step 1: Write the station template**

```astro
---
// src/pages/line-g/[station].astro — station template, six beats (design §4).
// Story-kern is the island; the surrounding beats are server-rendered.
import { getCollection, render } from 'astro:content'
import Base from '../../layouts/Base.astro'
import { COPY } from '../../lib/copy/en'
import TheFolderStory from '../../components/TheFolderStory.svelte'
import StationSelfCheck from '../../components/StationSelfCheck.svelte'

export async function getStaticPaths() {
  const open = (await getCollection('stations')).filter((s) => s.data.status === 'open')
  return open.map((s) => ({ params: { station: s.id }, props: { station: s } }))
}

const { station } = Astro.props
const d = station.data
const L = COPY.lineG
const stationId = `g${d.index}-${station.id}`
const lineColor = 'var(--color-signal)' // LINE G
---
<Base title={`${d.title} — LINE G — DATAVISM`} description={d.skill}>
  <!-- BEAT 1 · Einfahrt -->
  <header class="border-l-4 pl-4" style={`border-color:${lineColor}`}>
    <a class="text-phosphor-dim text-xs hover:text-signal" href="/line-g">&lt; LINE G</a>
    <h1 class="text-signal text-3xl font-bold mt-2">G{d.index} · {d.title}</h1>
    <p class="text-phosphor-dim text-sm mt-1">{d.skill}</p>
    <p class="text-phosphor-dim text-xs mt-2">// GHOST · FILE {d.index}/5 · stamp: <span id="beat-stamp">— —</span></p>
  </header>

  <!-- BEAT 2+3 · Story-kern (incl. GHOST fragment + folder-on-you) -->
  <div class="mt-8">
    <TheFolderStory client:only="svelte" ghostFragment={d.ghostFragment} />
  </div>

  <!-- BEAT 4 · Briefing (mission with your own tools) -->
  <section class="mt-12 card-beat">
    <h2 class="text-phosphor-hi text-xl font-bold">The mission</h2>
    <p class="text-phosphor-dim text-sm mt-1">~{d.missionMinutes} · your own tools · free tiers are fine</p>
    <p class="text-phosphor-hi mt-3">{d.mission.goal}</p>
    <ol class="mt-3 space-y-2 list-decimal list-inside text-phosphor">
      {d.mission.steps.map((s) => <li>{s}</li>)}
    </ol>
  </section>

  <!-- BEAT 5 · Self-Check → stamp -->
  <section class="mt-10 card-beat">
    <h2 class="text-phosphor-hi text-xl font-bold">Self-check</h2>
    <StationSelfCheck
      client:visible
      stationId={stationId}
      checks={d.selfChecks}
      artifactName={d.artifactName}
      stampWord={L.stamp}
    />
  </section>

  <!-- BEAT 6 · Ausfahrt -->
  <footer class="mt-12 border-t border-phosphor-dim/30 pt-6">
    {d.nextTeaser && <p class="text-phosphor-dim text-sm">▸ {d.nextTeaser}</p>}
    <p class="mt-3"><a class="text-signal text-sm" href="/ticket">{L.ticketCta}</a></p>
    {d.sources.length > 0 && (
      <details class="mt-6 text-xs text-phosphor-dim">
        <summary class="cursor-pointer">sources</summary>
        <ul class="mt-2 space-y-1">
          {d.sources.map((src) => (
            <li><a class="underline decoration-dashed" href={src.url} target="_blank" rel="noopener">{src.label}</a> · accessed {src.accessed}</li>
          ))}
        </ul>
      </details>
    )}
  </footer>
</Base>

<style>
  .card-beat { border: 1px solid color-mix(in srgb, var(--color-phosphor-dim) 30%, transparent); border-radius: 0.5rem; padding: 1.25rem; }
</style>
```

- [ ] **Step 2: Commit (build verified at end of Phase D)**

```bash
git add src/pages/line-g/[station].astro
git commit -m "feat(line-g): station template — six beats, mounts story + self-check"
```

### Task C3: Ticket page

**Files:**
- Create: `src/pages/ticket.astro`

- [ ] **Step 1: Write the page (mounts the island)**

```astro
---
// src/pages/ticket.astro — receipt view of the local ticket.
import Base from '../layouts/Base.astro'
import { COPY } from '../lib/copy/en'
import TicketView from '../components/TicketView.svelte'
const T = COPY.ticket
---
<Base title="Your ticket — DATAVISM" description="Your LINE G ticket. Stored only in this browser.">
  <a class="text-phosphor-dim text-xs hover:text-signal" href="/line-g">&lt; LINE G</a>
  <h1 class="text-signal text-3xl font-bold mt-6">{T.heading}</h1>
  <TicketView client:only="svelte" />
  <p class="text-phosphor-dim text-xs mt-8 leading-relaxed">{T.note}</p>
</Base>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/ticket.astro
git commit -m "feat(ticket): /ticket receipt page"
```

### Task C4: Landing → Line G link

**Files:**
- Modify: `src/components/NetworkMapTeaser.astro`

- [ ] **Step 1: Make the Line G row clickable**

In `NetworkMapTeaser.astro`, wrap the Line G row's caption in a link. Change the row `<p>` for key `'g'` so the name links to `/line-g`. Replace the caption block inside `rows.map`:

```astro
        <p class="text-xs mt-1">
          {r.key === 'g' ? (
            <a href="/line-g" style={`color:${r.color}`} class="font-bold hover:underline">{r.name} ▸</a>
          ) : (
            <span style={`color:${r.color}`}>{r.name}</span>
          )}
          <span class="text-phosphor-dim"> · {r.topic} · {r.boss}</span>
        </p>
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS; `/` shows Line G name linking to `/line-g`.

- [ ] **Step 3: Commit**

```bash
git add src/components/NetworkMapTeaser.astro
git commit -m "feat(landing): Line G teaser links to /line-g"
```

---

## Phase D — Islands

### Task D1: Story-kern island (port the spike)

**Files:**
- Modify: `package.json`
- Create: `src/components/TheFolderStory.svelte`

- [ ] **Step 1: Install the libraries**

Run:
```bash
npm install three gsap
npm install -D @types/three
```
Expected: `three` + `gsap` in `dependencies`, `@types/three` in `devDependencies`.

- [ ] **Step 2: Create the island shell with SSR-safe lazy WebGL**

Create `src/components/TheFolderStory.svelte`. The component **renders the narrative DOM server-side** (so the story is readable without JS and crawlable); WebGL + GSAP + audio load only in `onMount`. Port the body from `experiments/folder-spike/index.html` with these exact changes:

1. **Markup:** move the spike's `<body>` content (the `#bg` canvas, `#vignette`, `#flash`, `.hud`, all `<section>`s, `<footer>`) into the Svelte template. Replace the hard-coded GHOST `<p>` lines in the `#ghost` section with the `ghostFragment` prop:
   ```svelte
   <script>
     import { onMount } from 'svelte'
     let { ghostFragment = [] } = $props()
     let mounted = $state(false)
   </script>
   ```
   ```svelte
   <div class="ghost">
     <span class="who">GHOST · file fragment 1/5 — DRAFT</span>
     {#each ghostFragment as line}<p>{line}</p>{/each}
   </div>
   ```
2. **Styles:** move the spike's entire `<style>` block into the island's `<style>` (Svelte scopes it — fine). Keep the LINE-G color but align tokens to the site: replace `--line-g:#ffc400` with `#ffd23f` and `--bg:#04040a` with `#050805` (site `--color-ink`).
3. **Imports:** replace the CDN importmap + UMD `<script>` tags with module imports at the top of the spike's `<script type="module">` body, now placed inside `onMount`:
   ```js
   import * as THREE from 'three'
   import { gsap } from 'gsap'
   import { ScrollTrigger } from 'gsap/ScrollTrigger'
   import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
   import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
   import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
   import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
   import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
   ```
   These are static imports (bundled by Vite) — so `setupPost()` becomes synchronous (drop the dynamic `import(base+...)`; use the imported classes directly). Keep the `try/catch` for the no-WebGL fallback.
4. **Boot:** wrap the spike's whole boot block (the `try { if (reduce)… initWebGL(); … boot(); requestAnimationFrame(frame) } catch {…}`) inside `onMount(() => { … })`. Reference elements via `document.getElementById(...)` as the spike does (the markup is in the same component). Return the existing cleanup if any; otherwise leave the rAF loop (it self-cancels on navigation since Astro does full page loads).
5. **No behavior change:** the verified data array (`LABELS`, `TOTAL = 650000`), the folder-on-you, the fingerprint, the audio engine, and the bloom-tuned params stay **exactly** as in the spike. Do not re-tune here.

- [ ] **Step 3: Verify it builds and renders**

Run: `npm run build` then `npm run preview`. Open `/line-g/the-folder`:
Expected: PASS build; the station loads, the WebGL story-kern runs (deep black, escalation, collapse), the sourced labels show, the folder-on-you + fingerprint build. With JS disabled, the narrative text + GHOST fragment are still present in the HTML.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/components/TheFolderStory.svelte
git commit -m "feat(line-g): port THE FOLDER story-kern to a Svelte island (npm three/gsap, SSR-safe)"
```

### Task D2: Self-check island

**Files:**
- Create: `src/components/StationSelfCheck.svelte`

- [ ] **Step 1: Write the island**

```svelte
<script>
  // Binary self-checks → when all are ticked, self-stamp the ticket.
  // Honest wording: the stamp says "self-stamped" (GHOST-eval is Phase 3).
  import { onMount } from 'svelte'
  import { stampAndSave } from '../lib/ticket-storage'
  import { loadTicket, type Ticket } from '../lib/ticket'

  let { stationId, checks = [], artifactName = 'Case File', stampWord = 'self-stamped' } = $props()

  let ticked = $state(checks.map(() => false))
  let stamped = $state(false)
  let when = $state('')

  const allDone = $derived(ticked.every(Boolean))

  onMount(() => {
    const t: Ticket = loadTicket()
    if (t.completedStations.includes(stationId)) {
      stamped = true
      when = t.stamps[stationId] ?? ''
      ticked = checks.map(() => true)
    }
  })

  function stamp() {
    if (!allDone || stamped) return
    const t = stampAndSave(stationId)
    stamped = true
    when = t.stamps[stationId] ?? ''
  }
</script>

<ul class="space-y-2">
  {#each checks as label, i}
    <li>
      <label class="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" bind:checked={ticked[i]} disabled={stamped}
               class="mt-1 accent-[var(--color-signal)]" />
        <span class="text-phosphor">{label}</span>
      </label>
    </li>
  {/each}
</ul>

{#if stamped}
  <p class="text-signal font-bold mt-4">&gt; {artifactName} — {stampWord} ✓</p>
  {#if when}<p class="text-phosphor-dim text-xs mt-1">stamped {when}</p>{/if}
{:else}
  <button
    onclick={stamp}
    disabled={!allDone}
    class="mt-4 border border-signal text-signal rounded px-4 py-2 font-bold
           hover:bg-signal hover:text-ink transition-colors
           disabled:opacity-40 disabled:cursor-not-allowed">
    Stamp {artifactName}
  </button>
{/if}
```

- [ ] **Step 2: Verify build + behavior**

Run: `npm run build` then `npm run preview`. On `/line-g/the-folder`: ticking all boxes enables the stamp button; stamping shows "self-stamped ✓"; reloading keeps it stamped (localStorage).

- [ ] **Step 3: Commit**

```bash
git add src/components/StationSelfCheck.svelte
git commit -m "feat(line-g): self-check island self-stamps the ticket"
```

### Task D3: Ticket view island

**Files:**
- Create: `src/components/TicketView.svelte`

- [ ] **Step 1: Write the island**

```svelte
<script>
  import { onMount } from 'svelte'
  import { loadTicket, type Ticket } from '../lib/ticket'
  import { emptyTicket } from '../lib/ticket'
  import { COPY } from '../lib/copy/en'

  const T = COPY.ticket
  let ticket = $state<Ticket>(emptyTicket())
  onMount(() => { ticket = loadTicket() })
</script>

{#if ticket.completedStations.length === 0}
  <p class="text-phosphor-dim mt-6">&gt; {T.empty}</p>
{:else}
  <div class="mt-6 border border-dashed border-phosphor-dim/60 rounded p-5 font-mono">
    <p class="text-phosphor-hi font-bold">DATAVISM · LINE G</p>
    <hr class="border-phosphor-dim/30 my-3" />
    <ul class="space-y-1">
      {#each ticket.completedStations as id}
        <li class="flex justify-between gap-4">
          <span class="text-phosphor">{id}</span>
          <span class="text-signal">{T.stationDone} ✓</span>
        </li>
      {/each}
    </ul>
    <hr class="border-phosphor-dim/30 my-3" />
    <p class="text-phosphor-dim text-xs">{COPY.lineG.stamp}</p>
  </div>
{/if}
```

- [ ] **Step 2: Verify build + full flow**

Run: `npm run build` then `npm run preview`. Flow: stamp G1 on the station → open `/ticket` → it lists `g1-the-folder · stamped ✓`. Clear localStorage → `/ticket` shows the empty message.

- [ ] **Step 3: Commit**

```bash
git add src/components/TicketView.svelte
git commit -m "feat(ticket): receipt view reads the local ticket"
```

---

## Phase E — Final verification

- [ ] **Step 1: Full test + check + build**

Run: `npm run test && npm run check && npm run build`
Expected: all tests pass (signals + ticket), `astro check` clean, build succeeds.

- [ ] **Step 2: Manual smoke (preview)**

Run: `npm run preview`. Verify, in order:
- `/` → Line G teaser links to `/line-g`.
- `/line-g` → G1 "enter ▸"; other lines honest (announced/locked).
- `/line-g/the-folder` → six beats; WebGL story-kern runs; sourced labels; folder-on-you + fingerprint; sources `<details>` lists The Markup / netzpolitik / ICCL.
- Self-check → stamp → "self-stamped ✓"; persists on reload.
- `/ticket` → shows the stamp; empty after clearing storage.
- DevTools Network: no requests except the page + bundled JS (no analytics, no third-party).

- [ ] **Step 3: Honesty audit**

Run: `grep -rn "localStorage" src/` → only `ticket-storage.ts`.
Confirm no `fetch`/analytics added outside the existing `/api/subscribe` flow.

- [ ] **Step 4: Final commit / branch**

```bash
git add -A
git commit -m "chore(line-g): G1 THE FOLDER station complete — foundation + six beats"
```

---

## Deferred (NOT in this plan — follow-on work)

- **GHOST fragment authoring** — the 5-part voice pass vs Cast-Bible / STORY §11 (currently DRAFT in frontmatter; design §9).
- **G2 COMMAND** — reuses this station template + island pattern; needs real labeled AI transcripts (design §9).
- **Static OG image** per station (`ogImage` field exists; generation is separate; design §6).
- **Engine abstraction** — keep one island per station until 3+ repetitions (data-snack discipline, design §4).
- **DE translation, magic-link/Firestore (Phase 4), GHOST gateway (Phase 3)** — out of Phase 2.
- **Spike fine-tuning** (swarm density / audio mix) — Frank flagged for "later"; fold into D1 when addressed.

---

## Self-Review (done against design + spec)

- **Spec coverage (design §3–§6):** stations collection ✓ (B1) · routes `/line-g`, `/line-g/<station>`, `/ticket` ✓ (C1–C3) · six-beat anatomy ✓ (C2) · story island ✓ (D1) · ticket store TDD + localStorage adapter ✓ (A1–A2, D2–D3) · landing teaser clickable ✓ (C4) · sources with `accessed` ✓ (schema B1 + entry) · "self-stamped" wording ✓ (B2, D2) · no new backend ✓. OG image = field present, generation deferred (flagged).
- **Type consistency:** `stationId` format `g{index}-{id}` used in C2, D2, D3; ticket API `emptyTicket/stampStation/hasStation/migrate` (A1) + `loadTicket/saveTicket/stampAndSave` (A2) used consistently in D2/D3; `Ticket` shape `{version, completedStations, stamps}` identical across modules.
- **Placeholder scan:** no TBD/“handle errors”/“similar to” — every step has concrete code or an exact command. The one intentional reference (“port the verified spike body”) is a real, located source file with explicit, enumerated changes, not a vague placeholder.
- **Known ordering caveat (flagged in C2):** the station template references the islands built in Phase D; build it but expect `npm run build` to go green only after D1/D2. This is called out at the task head.
