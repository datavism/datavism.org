# Data Underground Site Rebuild — Phase 1 (Foundation & Landing) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Astro-5-Scaffold auf Branch `rebuild` mit Landing Page (Slogans, Manifest, ehrlicher Signal-Counter, Netzplan-Teaser) — preview-deploybar, `main` behält die Holding-Page.

**Architecture:** Astro 5 statisch-first mit Svelte-5-Islands (nur der Signal-Counter ist interaktiv), Tailwind 4 via Vite-Plugin, Copy zentral in einem EN-Strings-Modul (i18n-ready). Kein Backend, kein Tracking, kein Firebase in dieser Phase.

**Tech Stack:** Astro 5 · Svelte 5 · Tailwind 4 · Vitest (ADR 001)

---

## Phasen-Roadmap (Master)

| Phase | Plan-File | Liefert | Status |
|---|---|---|---|
| **1 — Foundation & Landing** | dieses File | Scaffold, Landing, Manifest-Page, Counter, Netzplan-Teaser | **dieser Plan** |
| 2 — Netzplan & Line G | `2026-MM-DD-phase-2-netzplan-line-g.md` (schreiben wenn Ph. 1 fertig) | Content-Collections für Stationen, interaktive Map, erste 3–5 Line-G-Stationen | future |
| 3 — GHOST-Terminal | nach `../ghost-brain.md` v0 | Station-Terminal-UI + Streaming-API → Vertex AI, Fair-Use-Limit | future |
| 4 — Identity & Launch | eigenes Plan-File | Firebase Magic-Link, `crew/*`-Bridge, Consent-Banner, Legal, Merge `rebuild`→`main` | future |

**Launch-Gate (Phase 4, BLOCKER):** Impressum/Privacy brauchen echte Betreiber-Daten vom User; Vercel-Framework-Preset muss beim Merge Next.js→Astro umgestellt werden. *(Offener Hinweis: auch die aktuelle Holding-Page auf `main` hat kein Impressum — User-Entscheidung, ob das vorgezogen wird.)*

---

## File-Struktur (Phase 1, Ziel-Zustand auf Branch `rebuild`)

```
astro.config.mjs            Astro + Svelte + Tailwind-Vite-Plugin
package.json                neu (ersetzt Holding-package.json auf diesem Branch)
src/styles/global.css       Tailwind 4 @theme — Underground-Tokens
src/lib/copy/en.ts          ALLE Site-Strings (EN), i18n-ready
src/lib/signals.ts          SignalCounter-Logik (pure, getestet)
src/lib/signals.test.ts     Vitest
src/layouts/Base.astro      <html>-Shell, Meta/OG, Fonts, Footer
src/components/TrackCounter.svelte   Island: ehrlicher Signal-Counter
src/components/NetworkMapTeaser.astro  statisches SVG, 5 Linien
src/pages/index.astro       Landing
src/pages/manifesto.astro   Manifest (Copy aus docs/MANIFESTO.md)
```

Quellen für Copy/Design: `docs/STORY.md` §8 (Slogans), `docs/MANIFESTO.md`,
Holding-Page-Farbwelt (`#050805` bg · `#9ef0a8` green · `#4f7a55` dim ·
`#d9ffe0` bright · `#ffd23f` warm).

---

### Task 1: Branch + Astro-Scaffold

**Files:**
- Create: `astro.config.mjs`, `package.json` (neu), `tsconfig.json`, `src/pages/index.astro` (Platzhalter aus Scaffold, wird in Task 5 ersetzt)
- Delete (nur auf `rebuild`): `app/` (Holding-Next-App)

- [ ] **Step 1: Branch anlegen, Holding-App auf dem Branch entfernen**

```bash
cd /Users/frankbultge/Documents/GitHub/datavism.org
git checkout -b rebuild
git rm -r app package.json package-lock.json
rm -rf node_modules .next
```

- [ ] **Step 2: Astro-Scaffold ins bestehende Verzeichnis**

```bash
npm create astro@latest . -- --template minimal --no-install --no-git --yes
npx astro add svelte --yes
npx astro add tailwind --yes
npm install
npm install -D vitest
```

Hinweis: `--template minimal` legt `src/pages/index.astro` + `astro.config.mjs`
an; die `add`-Kommandos patchen Config + Dependencies. `docs/`, `program.md`,
`README.md`, `.gitignore` bleiben unberührt liegen.

- [ ] **Step 3: astro.config.mjs prüfen/vereinheitlichen**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://datavism.org',
  integrations: [svelte()],
  vite: { plugins: [tailwindcss()] },
})
```

- [ ] **Step 4: Scripts in package.json ergänzen**

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "check": "astro check",
  "test": "vitest run"
}
```

- [ ] **Step 5: Build-Smoke-Test**

Run: `npm run build`
Expected: `Complete!` / `built in …` ohne Fehler, Output in `dist/`

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(rebuild): astro 5 scaffold (svelte + tailwind 4 + vitest) on rebuild branch"
```

---

### Task 2: Design-Tokens + Copy-Modul

**Files:**
- Create: `src/styles/global.css`
- Create: `src/lib/copy/en.ts`

- [ ] **Step 1: global.css mit Underground-Tokens**

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-ink: #050805;        /* page background */
  --color-phosphor: #9ef0a8;   /* primary terminal green */
  --color-phosphor-dim: #4f7a55;
  --color-phosphor-hi: #d9ffe0;
  --color-signal: #ffd23f;     /* warm accent (links, line G) */
  --color-line-k: #46c8ff;     /* Key cyan */
  --color-line-r: #c0c8d8;     /* Rook steel */
  --color-line-b: #ff4fd2;     /* Bite magenta */
  --color-line-v: #b48cff;     /* Vesper violet */
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

html { background: var(--color-ink); color: var(--color-phosphor); }
body { font-family: var(--font-mono); margin: 0; }
```

- [ ] **Step 2: Copy-Modul (alle Strings, EN)**

```ts
// src/lib/copy/en.ts
// Single source for site copy. DE wird später als de.ts ergänzt (VISION §2).
// Slogans: docs/STORY.md §8 · Manifest: docs/MANIFESTO.md

export const COPY = {
  meta: {
    title: 'DATAVISM — The Data Underground',
    description:
      'The school of the Data Underground. You won’t learn to code — ' +
      'you’ll learn to command: AI, data, and the right questions. ' +
      'The revolution will be computed.',
  },
  hero: {
    kicker: 'DATAVISM',
    title: 'DATA UNDERGROUND',
    hook: 'They track you. Learn to track back.',
    sub:
      'You won’t learn to code here. You’ll learn to command — ' +
      'AI, data, and the right questions.',
    slogan: 'The revolution will be computed.',
    ctaManifesto: 'Read the manifesto',
    ctaUpstairs: 'meanwhile, upstairs: data-snack.com',
  },
  counter: {
    lead: 'trackable signals emitted on this page so far:',
    collectedNote: 'collected by us: 0. not even ironically.',
    hint: 'moves, clicks, scrolls, seconds — everything a tracker would eat.',
  },
  map: {
    heading: 'THE NETWORK',
    sub: 'Five lines. Every line ends at an adversary.',
    openingFirst: 'LINE G — opening first',
    lines: {
      g: { name: 'LINE G · FOUNDATION', topic: 'Vibe coding & AI orchestration', boss: 'feeds all lines' },
      k: { name: 'LINE K', topic: 'Tracking forensics · OSINT', boss: 'terminus: PANOPTICON' },
      r: { name: 'LINE R', topic: 'Economics · source-stacking', boss: 'terminus: MAMMON' },
      b: { name: 'LINE B', topic: 'Feeds · streams · retention', boss: 'terminus: THE FEED' },
      v: { name: 'LINE V', topic: 'Climate · demographics · archive', boss: 'terminus: CUMULUS REX' },
    },
  },
  footer: {
    org: 'datavism.org · a non-profit digital art project',
    tracking: 'no tracking on this page. not even ironically.',
  },
} as const
```

- [ ] **Step 3: Build prüfen**

Run: `npm run build`
Expected: ohne Fehler

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css src/lib/copy/en.ts
git commit -m "feat(rebuild): design tokens + EN copy module"
```

---

### Task 3: SignalCounter-Logik (TDD)

**Files:**
- Test: `src/lib/signals.test.ts`
- Create: `src/lib/signals.ts`

- [ ] **Step 1: Failing Test schreiben**

```ts
// src/lib/signals.test.ts
import { describe, it, expect } from 'vitest'
import { SignalCounter } from './signals'

describe('SignalCounter', () => {
  it('starts at zero', () => {
    const c = new SignalCounter()
    expect(c.total).toBe(0)
  })

  it('counts recorded signals by type', () => {
    const c = new SignalCounter()
    c.record('move')
    c.record('move')
    c.record('click')
    expect(c.total).toBe(3)
    expect(c.byType.move).toBe(2)
    expect(c.byType.click).toBe(1)
  })

  it('throttles a signal type to one per window', () => {
    const c = new SignalCounter()
    expect(c.recordThrottled('move', 1000, 0)).toBe(true)    // t=0ms → zählt
    expect(c.recordThrottled('move', 1000, 500)).toBe(false) // t=500ms → gedrosselt
    expect(c.recordThrottled('move', 1000, 1001)).toBe(true) // t=1001ms → zählt
    expect(c.total).toBe(2)
  })
})
```

- [ ] **Step 2: Test laufen lassen — muss fehlschlagen**

Run: `npm test`
Expected: FAIL — `Cannot find module './signals'`

- [ ] **Step 3: Minimal-Implementierung**

```ts
// src/lib/signals.ts
// Pure counting logic for the honest signal counter (no listeners here —
// the Svelte island wires real DOM events). Concept salvaged from the old
// site's live counter; honesty rule: we COUNT what could be tracked,
// we COLLECT nothing (docs/STORY.md §8).

export type SignalType = 'move' | 'click' | 'scroll' | 'key' | 'tick'

export class SignalCounter {
  total = 0
  byType: Partial<Record<SignalType, number>> = {}
  #lastAt: Partial<Record<SignalType, number>> = {}

  record(type: SignalType): void {
    this.total += 1
    this.byType[type] = (this.byType[type] ?? 0) + 1
  }

  /** Counts at most one signal of `type` per `windowMs`. Returns true if counted. */
  recordThrottled(type: SignalType, windowMs: number, now: number): boolean {
    const last = this.#lastAt[type]
    if (last !== undefined && now - last < windowMs) return false
    this.#lastAt[type] = now
    this.record(type)
    return true
  }
}
```

- [ ] **Step 4: Tests grün**

Run: `npm test`
Expected: `3 passed`

- [ ] **Step 5: Commit**

```bash
git add src/lib/signals.ts src/lib/signals.test.ts
git commit -m "feat(rebuild): SignalCounter logic with throttling (TDD)"
```

---

### Task 4: TrackCounter-Island (Svelte 5)

**Files:**
- Create: `src/components/TrackCounter.svelte`

- [ ] **Step 1: Island implementieren**

```svelte
<script>
  // Honest signal counter: counts trackable browser events client-side,
  // sends NOTHING anywhere. Pauses when tab hidden (perf rule).
  import { onMount } from 'svelte'
  import { SignalCounter } from '../lib/signals'
  import { COPY } from '../lib/copy/en'

  let total = $state(0)
  const counter = new SignalCounter()

  function bump(type, windowMs = 0) {
    if (document.hidden) return
    if (windowMs > 0) counter.recordThrottled(type, windowMs, performance.now())
    else counter.record(type)
    total = counter.total
  }

  onMount(() => {
    const onMove = () => bump('move', 400)
    const onScroll = () => bump('scroll', 600)
    const onClick = () => bump('click')
    const onKey = () => bump('key', 400)
    const tick = setInterval(() => bump('tick', 0), 1000) // 1 dwell-second = 1 signal

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('click', onClick)
    window.addEventListener('keydown', onKey)

    return () => {
      clearInterval(tick)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('click', onClick)
      window.removeEventListener('keydown', onKey)
    }
  })
</script>

<p class="text-phosphor-dim text-sm">
  {COPY.counter.lead}
  <span class="text-signal tabular-nums font-bold">{total}</span>
</p>
<p class="text-phosphor-dim text-xs">{COPY.counter.hint}</p>
<p class="text-phosphor-hi text-xs">{COPY.counter.collectedNote}</p>
```

- [ ] **Step 2: Build prüfen (Island kompiliert)**

Run: `npm run build`
Expected: ohne Fehler

- [ ] **Step 3: Commit**

```bash
git add src/components/TrackCounter.svelte
git commit -m "feat(rebuild): honest TrackCounter island (counts locally, collects nothing)"
```

---

### Task 5: Base-Layout + Landing Page

**Files:**
- Create: `src/layouts/Base.astro`
- Modify: `src/pages/index.astro` (Scaffold-Platzhalter ersetzen)

- [ ] **Step 1: Base.astro**

```astro
---
// src/layouts/Base.astro
import '../styles/global.css'
import { COPY } from '../lib/copy/en'
const { title = COPY.meta.title, description = COPY.meta.description } = Astro.props
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:site_name" content="DATAVISM" />
  </head>
  <body class="min-h-screen flex flex-col">
    <main class="flex-1 w-full max-w-2xl mx-auto px-5 py-12">
      <slot />
    </main>
    <footer class="w-full max-w-2xl mx-auto px-5 pb-10 text-xs text-phosphor-dim leading-relaxed">
      <p>{COPY.footer.org}<br />{COPY.footer.tracking}</p>
    </footer>
  </body>
</html>
```

- [ ] **Step 2: index.astro (Landing)**

```astro
---
// src/pages/index.astro
import Base from '../layouts/Base.astro'
import TrackCounter from '../components/TrackCounter.svelte'
import NetworkMapTeaser from '../components/NetworkMapTeaser.astro'
import { COPY } from '../lib/copy/en'
---
<Base>
  <p class="text-phosphor-dim tracking-[0.35em] text-xs">{COPY.hero.kicker}</p>
  <h1 class="text-phosphor-hi text-4xl font-bold mt-2">{COPY.hero.title}</h1>

  <p class="text-phosphor-hi text-lg mt-8">{COPY.hero.hook}</p>
  <p class="mt-3 leading-relaxed">{COPY.hero.sub}</p>
  <p class="text-signal mt-3">&gt; {COPY.hero.slogan}<span class="cursor" aria-hidden="true"></span></p>

  <div class="mt-10 border border-phosphor-dim/40 rounded p-4">
    <TrackCounter client:load />
  </div>

  <NetworkMapTeaser />

  <nav class="mt-12 text-sm space-y-2">
    <p><a class="text-signal underline decoration-dashed underline-offset-4" href="/manifesto">{COPY.hero.ctaManifesto}</a></p>
    <p class="text-phosphor-dim">
      {COPY.hero.ctaUpstairs.split(':')[0]}:
      <a class="text-signal" href="https://data-snack.com">data-snack.com</a>
    </p>
  </nav>
</Base>

<style>
  .cursor { display:inline-block; width:.6em; height:1.1em; background: var(--color-phosphor);
    vertical-align:text-bottom; animation: blink 1.1s steps(1) infinite; }
  @keyframes blink { 50% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .cursor { animation: none; } }
</style>
```

- [ ] **Step 3: Build prüfen**

Run: `npm run build`
Expected: Fehler nur, weil `NetworkMapTeaser.astro` noch fehlt → Task 6 zuerst
bauen ODER Import/Verwendung kurz auskommentieren. Sauberer Weg: Task 6 direkt
anschließen und erst dann bauen.

- [ ] **Step 4: Commit (zusammen mit Task 6)** — siehe Task 6 Step 4.

---

### Task 6: Netzplan-Teaser (statisches SVG)

**Files:**
- Create: `src/components/NetworkMapTeaser.astro`

- [ ] **Step 1: Komponente**

```astro
---
// src/components/NetworkMapTeaser.astro — static teaser; the interactive
// map is Phase 2. Five horizontal lines, line G highlighted.
import { COPY } from '../lib/copy/en'
const L = COPY.map.lines
const rows = [
  { key: 'g', color: 'var(--color-signal)',  ...L.g },
  { key: 'k', color: 'var(--color-line-k)',  ...L.k },
  { key: 'r', color: 'var(--color-line-r)',  ...L.r },
  { key: 'b', color: 'var(--color-line-b)',  ...L.b },
  { key: 'v', color: 'var(--color-line-v)',  ...L.v },
]
---
<section class="mt-12" aria-label="Curriculum network map (teaser)">
  <h2 class="text-phosphor-hi text-xl font-bold">{COPY.map.heading}</h2>
  <p class="text-phosphor-dim text-sm mt-1">{COPY.map.sub}</p>

  <div class="mt-6 space-y-5">
    {rows.map((r) => (
      <div>
        <svg viewBox="0 0 320 12" class="w-full h-3" role="img" aria-label={r.name}>
          <line x1="4" y1="6" x2="300" y2="6" stroke={r.color} stroke-width="2" />
          {[40, 105, 170, 235].map((x) => (
            <circle cx={x} cy="6" r="4" fill="var(--color-ink)" stroke={r.color} stroke-width="2" />
          ))}
          <circle cx="300" cy="6" r="6" fill={r.color} />
        </svg>
        <p class="text-xs mt-1">
          <span style={`color:${r.color}`}>{r.name}</span>
          <span class="text-phosphor-dim"> · {r.topic} · {r.boss}</span>
        </p>
      </div>
    ))}
  </div>

  <p class="text-signal text-xs mt-4">▸ {COPY.map.openingFirst}</p>
</section>
```

- [ ] **Step 2: Build prüfen**

Run: `npm run build`
Expected: ohne Fehler (jetzt mit Task 5 zusammen)

- [ ] **Step 3: Dev-Smoke-Test im Browser**

Run: `npm run dev` → http://localhost:4321
Expected: Landing rendert; Counter zählt bei Mausbewegung hoch; 5 Linien sichtbar; reduced-motion stoppt Cursor-Blinken.

- [ ] **Step 4: Commit (Tasks 5+6)**

```bash
git add src/layouts/Base.astro src/pages/index.astro src/components/NetworkMapTeaser.astro
git commit -m "feat(rebuild): landing page with hero, honest counter, network-map teaser"
```

---

### Task 7: Manifest-Page

**Files:**
- Create: `src/pages/manifesto.astro`

Copy-Quelle: `docs/MANIFESTO.md` (v2) — Inhalt wird hier in Page-Form gesetzt,
Wortlaut 1:1 übernehmen (nicht paraphrasieren).

- [ ] **Step 1: Page anlegen**

```astro
---
// src/pages/manifesto.astro — copy source of truth: docs/MANIFESTO.md (v2)
import Base from '../layouts/Base.astro'
---
<Base title="The Datavism Manifesto — Data Underground">
  <p class="text-phosphor-dim tracking-[0.35em] text-xs">DATAVISM</p>
  <h1 class="text-phosphor-hi text-3xl font-bold mt-2">THE MANIFESTO</h1>

  <section class="mt-10 space-y-4 leading-relaxed">
    <h2 class="text-signal font-bold">THE PROBLEM</h2>
    <p>Algorithms decide more of your life than you know. What you see, what you pay, what you’re offered, what you believe — computed for someone else’s profit.</p>
    <p class="text-phosphor-hi font-bold">You are not the customer. You are the product being optimized.</p>
    <p>And now the machines that profile you write poetry. AI didn’t level the field — it tilted it further. The corporations that track you run frontier models on your data. You get a chat window and a subscription.</p>
    <p>Meanwhile you’re told to “trust the algorithm” — while the algorithm is a trade secret, the data is locked away, and the manipulation is deniable by design.</p>
  </section>

  <section class="mt-10 space-y-4 leading-relaxed">
    <h2 class="text-signal font-bold">THE SOLUTION</h2>
    <p><strong class="text-phosphor-hi">Datavism</strong> — the practice of turning data into evidence, and evidence into change.</p>
    <p>We don’t teach you to code. The machines code now.<br/>
       We teach you to <strong class="text-phosphor-hi">command</strong>: to orchestrate AI, to ask the questions that break a cover story, to build pipelines with a co-pilot instead of a keyboard-decade, to check the machine’s work — because the machine lies confidently.</p>
    <p>You learn by doing what the Underground does: real investigations on real data against real systems of manipulation. Your homework makes the digital world more transparent. Your capstone is not a certificate — it’s a case file in the Vault.</p>
    <p class="text-phosphor-hi font-bold">The same tools they use on you. Pointed back.</p>
  </section>

  <section class="mt-10 space-y-4 leading-relaxed">
    <h2 class="text-signal font-bold">THE MISSION</h2>
    <p>Train a generation of <strong class="text-phosphor-hi">Datavists</strong> — people who can make any algorithm explain itself.</p>
    <p>Build the infrastructure of algorithmic accountability: a network of trained eyes, a growing archive of case files, an AI mentor — GHOST — that gets sharper with every graduate.</p>
    <p>Keep the school open: free to learn, sliding-scale to join a cohort, funded by the mission — never by selling you.</p>
    <p class="text-phosphor-hi font-bold">When every citizen can analyze data, evil has nowhere to hide.</p>
  </section>

  <blockquote class="mt-12 border-l-2 border-signal pl-4 text-phosphor-hi leading-relaxed">
    <p>They track you. Learn to track back.</p>
    <p>The revolution will be computed.</p>
    <p class="text-signal mt-2">— The Data Underground</p>
  </blockquote>

  <p class="mt-10 text-sm"><a class="text-signal underline decoration-dashed underline-offset-4" href="/">← back to the entrance</a></p>
</Base>
```

- [ ] **Step 2: Build + Check**

Run: `npm run build && npm run check`
Expected: beide ohne Fehler

- [ ] **Step 3: Commit**

```bash
git add src/pages/manifesto.astro
git commit -m "feat(rebuild): manifesto page (copy from docs/MANIFESTO.md v2)"
```

---

### Task 8: Push + Vercel-Preview verifizieren

- [ ] **Step 1: Branch pushen**

```bash
git push -u origin rebuild
```

- [ ] **Step 2: Preview-Deployment prüfen**

Vercel baut Branch-Pushes als Preview. ABER: Projekt-Preset steht auf Next.js
→ der Preview-Build des Astro-Branches wird **fehlschlagen**. Das ist für
Phase 1 akzeptiert (lokal verifiziert); Preset-Umstellung ist Launch-Gate in
Phase 4. Alternativ sofort testbar via CLI ohne Preset-Änderung:

```bash
npx vercel build && npx vercel deploy --prebuilt
```

Expected: Preview-URL rendert Landing + /manifesto.

- [ ] **Step 3: Abschluss-Verifikation (Definition of Done Phase 1)**

- `npm test` → alle grün
- `npm run build && npm run check` → ohne Fehler
- Landing: Counter zählt, sammelt nichts (Network-Tab leer), reduced-motion respektiert
- `/manifesto` wortgleich mit `docs/MANIFESTO.md`
- `main` unverändert (Holding-Page live)

---

## Self-Review-Notizen (beim Schreiben geprüft)

- Spec-Abdeckung: Landing (STORY §8 Slogans ✓, ehrlicher Counter ✓,
  Ehrlichkeits-Regel ✓), Manifest (MANIFESTO.md ✓), Netzplan-Vorschau
  (STORY §6 ✓), EN-first (VISION §2 ✓), kein Tracking/Firebase in Ph. 1 ✓.
- Typ-Konsistenz: `SignalCounter.recordThrottled(type, windowMs, now)` wird in
  Task 4 exakt so verwendet wie in Task 3 definiert ✓.
- Bewusst NICHT in Phase 1: Consent-Banner (kein Tracking → nicht nötig),
  Firebase, GHOST, Legal-Pages (Phase 4, braucht User-Daten).
