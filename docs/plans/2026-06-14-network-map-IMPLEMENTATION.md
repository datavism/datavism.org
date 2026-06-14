# THE NETWORK — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build THE NETWORK — a cinematic, interactive transit map of the bootcamp (landing hero + `/network` page) that is data-driven from the `stations` collection and composes into the DATAVISM wordmark as lines launch.

**Architecture:** A pure, TDD'd geometry module defines the network's coordinate space, line paths, station nodes and landmarks (referencing the `stations` collection by id). A framework-agnostic three.js engine renders it — glowing line geometry (solid=live / dashed=planned), neon nodes, data-pulses, bloom (same postprocessing DNA as `TheFolderStory.svelte`), orthographic GSAP pan/zoom. A Svelte island (`NetworkMap.svelte`) SSR-renders an accessible station list, mounts the engine on the client, and overlays a transform-synced DOM hotspot layer for crisp, keyboard-/SEO-friendly navigation. Two surfaces (`hero`, `full`) share the same engine.

**Tech Stack:** Astro 5.18 · Svelte 5 (runes) · three.js (+ examples postprocessing, already a dep) · GSAP · Tailwind v4 · Vitest.

**Spec:** [`2026-06-14-network-map-design.md`](2026-06-14-network-map-design.md). **Builds on** the `feat/line-g-g1` foundation (stations collection, ticket store). **Reuse, don't re-derive:** the bloom + FinalShader + onMount lazy-WebGL pattern in `src/components/TheFolderStory.svelte` (verified) — mirror its params (`UnrealBloomPass(res, 0.55, 0.45, 0.30)`, grain `0.03`, signal `#ffd23f`, ink `#050805`).

**Binding rules:** honesty (live=solid, planned=dashed, no fake lines/stations), no tracking/network beyond bundle, ticket only via `localStorage`; a11y (DOM text labels, keyboard, AA, reduced-motion + no-WebGL → SSR list fallback); 2019 perf floor.

**Branch:** create `feat/network-map` off `feat/line-g-g1`.

---

## File Structure

**Create:**
- `src/lib/network/geometry.ts` — pure data: coordinate space, `LINES`, `NODES`, `LANDMARKS`, types. One responsibility: the authored network layout.
- `src/lib/network/geometry.test.ts` — Vitest invariants (collection↔geometry consistency).
- `src/lib/network/engine.ts` — framework-agnostic three.js engine: `createNetwork(canvas, {geometry, statuses, variant})` → `{ setView, resize, destroy }`.
- `src/components/NetworkMap.svelte` — island: SSR list + client engine + DOM hotspot layer + interactivity; prop `variant: 'hero' | 'full'`.
- `src/pages/network.astro` — the `/network` page (full map).
- `src/lib/network/preview.html` is NOT created — use a temporary Astro page for screenshot iteration (Task 2), removed after.

**Modify:**
- `src/lib/copy/en.ts` — add `COPY.network` (legend, labels, a11y strings).
- `src/pages/index.astro` — replace `<NetworkMapTeaser />` with `<NetworkMap variant="hero" client:visible />`.
- `src/content.config.ts` — (only if needed) add optional `enemy` field to stations for termini labels. (Termini live in geometry; skip unless required.)

**Retire:** `src/components/NetworkMapTeaser.astro` — its semantic markup is recycled as `NetworkMap.svelte`'s SSR fallback, then the file is deleted.

---

## Phase 1 — Geometry (data + invariants, TDD)

### Task 1: Geometry data model + seed

**Files:**
- Create: `src/lib/network/geometry.ts`
- Test: `src/lib/network/geometry.test.ts`

- [ ] **Step 1: Write the failing tests** (invariants, not exact coords)

```typescript
// src/lib/network/geometry.test.ts
import { describe, it, expect } from 'vitest'
import { getCollection } from 'astro:content'
import { LINES, NODES, LANDMARKS, VIEW, lineIds } from './geometry'

describe('network geometry', () => {
  it('defines the five patron lines g/k/r/b/v', () => {
    expect(lineIds()).toEqual(['g', 'k', 'r', 'b', 'v'])
    for (const l of LINES) expect(l.path.length).toBeGreaterThanOrEqual(2)
  })

  it('keeps every point inside the coordinate space', () => {
    const pts = [...LINES.flatMap((l) => l.path), ...NODES.map((n) => n.at), ...LANDMARKS.map((m) => m.at)]
    for (const p of pts) {
      expect(p.x).toBeGreaterThanOrEqual(0); expect(p.x).toBeLessThanOrEqual(VIEW.w)
      expect(p.y).toBeGreaterThanOrEqual(0); expect(p.y).toBeLessThanOrEqual(VIEW.h)
    }
  })

  it('every node references a real station id in the collection', async () => {
    const ids = new Set((await getCollection('stations')).map((s) => s.id))
    for (const n of NODES) expect(ids.has(n.stationId), `node ${n.stationId}`).toBe(true)
  })

  it('every node sits on a defined line', () => {
    const ls = new Set(lineIds())
    for (const n of NODES) expect(ls.has(n.line)).toBe(true)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm run test -- network/geometry`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement the seed geometry**

Author Line G as the horizontal trunk (the word's baseline) with its real station nodes; stub K/R/B/V paths (refined visually in Task 2). Coordinate space 1600×600.

```typescript
// src/lib/network/geometry.ts
// Authored network layout. Pure data — no rendering. Coordinates form the
// DATAVISM wordmark; Line G is the horizontal trunk (baseline), K/R/B/V are
// letter strokes. Exact coords are tuned visually (see plan Task 2); the shape
// invariants are tested. Nodes reference stations-collection ids.
export type LineId = 'g' | 'k' | 'r' | 'b' | 'v'
export interface Pt { x: number; y: number }
export interface NetLine { id: LineId; colorVar: string; patron: string; terminus?: string; path: Pt[] }
export interface NetNode { stationId: string; line: LineId; at: Pt }
export interface NetLandmark { key: 'entrance' | 'maschinenraum' | 'vault'; label: string; at: Pt }

export const VIEW = { w: 1600, h: 600 } as const
export const lineIds = (): LineId[] => LINES.map((l) => l.id)

// Line G trunk: left→right baseline through the word. Five G-stations evenly placed.
export const LINES: NetLine[] = [
  { id: 'g', colorVar: 'var(--color-signal)', patron: 'GHOST', path: [
    { x: 120, y: 300 }, { x: 1480, y: 300 },
  ] },
  { id: 'k', colorVar: 'var(--color-line-k)', patron: 'Key',    terminus: 'PANOPTICON',  path: [ { x: 300, y: 300 }, { x: 300, y: 140 } ] },
  { id: 'r', colorVar: 'var(--color-line-r)', patron: 'Rook',   terminus: 'MAMMON',      path: [ { x: 620, y: 300 }, { x: 620, y: 460 } ] },
  { id: 'b', colorVar: 'var(--color-line-b)', patron: 'Bite',   terminus: 'THE FEED',    path: [ { x: 940, y: 300 }, { x: 940, y: 140 } ] },
  { id: 'v', colorVar: 'var(--color-line-v)', patron: 'Vesper', terminus: 'CUMULUS REX', path: [ { x: 1260, y: 300 }, { x: 1260, y: 460 } ] },
]

// G1..G5 nodes along the trunk (ids must match src/content/stations/*.md).
export const NODES: NetNode[] = [
  { stationId: 'the-folder',        line: 'g', at: { x: 300,  y: 300 } },
  { stationId: 'command',           line: 'g', at: { x: 540,  y: 300 } },
  { stationId: 'intake',            line: 'g', at: { x: 780,  y: 300 } },
  { stationId: 'the-confident-lie', line: 'g', at: { x: 1020, y: 300 } },
  { stationId: 'maschinenraum',     line: 'g', at: { x: 1260, y: 300 } },
]

export const LANDMARKS: NetLandmark[] = [
  { key: 'entrance',     label: '↓ from data-snack', at: { x: 120,  y: 300 } },
  { key: 'maschinenraum', label: 'MASCHINENRAUM',    at: { x: 1260, y: 300 } },
  { key: 'vault',        label: 'THE VAULT',         at: { x: 1480, y: 300 } },
]
```

- [ ] **Step 4: Run to verify pass**

Run: `npm run test -- network/geometry`
Expected: PASS (4 tests). If "node references real station" fails, the station ids in `NODES` must match the markdown filenames in `src/content/stations/`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/network/geometry.ts src/lib/network/geometry.test.ts
git commit -m "feat(network): geometry data model + invariants (TDD)"
```

### Task 2: Wordmark geometry — visual iteration harness

**Files:**
- Create (temporary): `src/pages/_netpreview.astro`
- Modify: `src/lib/network/geometry.ts` (tune coords)

- [ ] **Step 1: Build a plain SVG preview of the geometry** (no FX — just paths + nodes)

```astro
---
// src/pages/_netpreview.astro — TEMP. Screenshot harness to tune the wordmark.
import { LINES, NODES, LANDMARKS, VIEW } from '../lib/network/geometry'
---
<html><body style="margin:0;background:#050805">
  <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} width="1600" height="600" xmlns="http://www.w3.org/2000/svg">
    {LINES.map((l) => (
      <polyline points={l.path.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none" stroke={l.colorVar.replace('var(--color-signal)','#ffd23f').replace('var(--color-line-k)','#46c8ff').replace('var(--color-line-r)','#c0c8d8').replace('var(--color-line-b)','#ff4fd2').replace('var(--color-line-v)','#b48cff')}
        stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
    ))}
    {NODES.map((n) => <circle cx={n.at.x} cy={n.at.y} r="9" fill="#050805" stroke="#ffd23f" stroke-width="4" />)}
  </svg>
</body></html>
```

- [ ] **Step 2: Iterate the coordinates until "DATAVISM" reads**

Run `npm run dev`, open `/_netpreview`, screenshot at 1600×600 (Playwright). Tune `LINES[].path` and `NODES[].at` in `geometry.ts` so the union of the five polylines reads as **DATAVISM**: Line G is the horizontal baseline; K/R/B/V form letter strokes; use octolinear angles (0/45/90°) and rounded joins (transit convention). Re-screenshot after each change.
**Acceptance:** a fresh viewer reads both "DATAVISM" and "a transit map" without explanation. Keep Task 1 tests green after each edit.

- [ ] **Step 3: Remove the temp harness, commit the tuned geometry**

```bash
rm src/pages/_netpreview.astro
npm run test -- network/geometry && npm run check
git add src/lib/network/geometry.ts
git commit -m "feat(network): tune wordmark geometry — the union of lines reads DATAVISM"
```

---

## Phase 2 — Engine (rendering)

### Task 3: three.js engine — lines (solid/dashed by status) + nodes + bloom

**Files:**
- Create: `src/lib/network/engine.ts`

- [ ] **Step 1: Define the engine API + build lines/nodes**

`createNetwork` takes the geometry + a `statuses` map (stationId→'open'|'announced'|'locked') derived from the collection, and a `variant`. A line renders **solid** if any of its stations is open, else **dashed** (planned). Reuse the bloom/FinalShader setup from `TheFolderStory.svelte` verbatim (same params).

```typescript
// src/lib/network/engine.ts
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { LINES, NODES, VIEW, type LineId } from './geometry'

type Status = 'open' | 'announced' | 'locked'
export interface NetworkOpts { statuses: Record<string, Status>; variant: 'hero' | 'full' }

const COLOR: Record<LineId, number> = { g: 0xffd23f, k: 0x46c8ff, r: 0xc0c8d8, b: 0xff4fd2, v: 0xb48cff }

export function createNetwork(canvas: HTMLCanvasElement, opts: NetworkOpts) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setClearColor(0x050805, 1)
  const scene = new THREE.Scene()
  // Orthographic camera over the VIEW box (y-down → flip)
  const cam = new THREE.OrthographicCamera(0, VIEW.w, 0, VIEW.h, -100, 100)
  cam.position.z = 10

  // A line is "live" if any of its stations is open.
  const liveLine = (id: LineId) =>
    NODES.some((n) => n.line === id && opts.statuses[n.stationId] === 'open')

  for (const l of LINES) {
    const pts = l.path.map((p) => new THREE.Vector3(p.x, p.y, 0))
    const geo = new THREE.BufferGeometry().setFromPoints(pts)
    const live = liveLine(l.id)
    const mat = new THREE.LineBasicMaterial({ color: COLOR[l.id], transparent: true, opacity: live ? 1 : 0.28 })
    const line = live ? new THREE.Line(geo, mat) : dashed(geo, COLOR[l.id])
    scene.add(line)
  }
  for (const n of NODES) {
    const live = opts.statuses[n.stationId] === 'open'
    scene.add(nodeMesh(n.at.x, n.at.y, COLOR[n.line], live))
  }

  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, cam))
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.45, 0.30))
  composer.addPass(new OutputPass())

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight
    renderer.setSize(w, h, false); composer.setSize(w, h)
  }
  resize()
  let raf = 0
  const loop = () => { composer.render(); raf = requestAnimationFrame(loop) }
  raf = requestAnimationFrame(loop)

  return { resize, setView(_v: 'hero' | 'full') {}, destroy() { cancelAnimationFrame(raf); renderer.dispose() } }
}

function dashed(geo: THREE.BufferGeometry, color: number) {
  const m = new THREE.LineDashedMaterial({ color, dashSize: 14, gapSize: 12, transparent: true, opacity: 0.35 })
  const line = new THREE.Line(geo, m); line.computeLineDistances(); return line
}
function nodeMesh(x: number, y: number, color: number, live: boolean) {
  const g = new THREE.CircleGeometry(live ? 11 : 8, 24)
  const m = new THREE.MeshBasicMaterial({ color: live ? color : 0x223022 })
  const mesh = new THREE.Mesh(g, m); mesh.position.set(x, y, 1); return mesh
}
```

- [ ] **Step 2: Verify it type-checks**

Run: `npm run check`
Expected: 0 errors. (Engine is not rendered yet; visual verification in Task 6.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/network/engine.ts
git commit -m "feat(network): three.js engine — lines (solid/dashed by status), nodes, bloom"
```

### Task 4: Data-pulses + camera pan/zoom

**Files:**
- Modify: `src/lib/network/engine.ts`

- [ ] **Step 1: Add data-pulses along live line paths**

For each live line, add a small set of glowing sprites that travel its polyline (param `t` 0→1, wrap). Advance in the loop by `delta`. Skip entirely if `prefers-reduced-motion`.

```typescript
// inside createNetwork, after lines are built:
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const pulses: { line: THREE.Vector3[]; mesh: THREE.Mesh; t: number; speed: number }[] = []
if (!reduce) for (const l of LINES) if (liveLine(l.id)) {
  const path = l.path.map((p) => new THREE.Vector3(p.x, p.y, 2))
  for (let i = 0; i < 3; i++) {
    const m = new THREE.Mesh(new THREE.CircleGeometry(5, 16), new THREE.MeshBasicMaterial({ color: COLOR[l.id] }))
    scene.add(m); pulses.push({ line: path, mesh: m, t: i / 3, speed: 0.06 + i * 0.01 })
  }
}
// in loop(): advance pulses
function advance(dt: number) {
  for (const p of pulses) {
    p.t = (p.t + p.speed * dt) % 1
    const pos = pointAlong(p.line, p.t); p.mesh.position.set(pos.x, pos.y, 2)
  }
}
```

Add `pointAlong(path, t)` (linear interpolation across cumulative segment lengths) as a module helper. Drive `dt` from a clamped clock in `loop()`.

- [ ] **Step 2: Add pan/zoom (full variant) via GSAP-free pointer math**

`variant: 'full'` enables drag-to-pan + wheel/pinch-zoom by adjusting the ortho camera bounds (clamp to VIEW + margin). `variant: 'hero'` keeps a fixed framed view with gentle ambient drift. Implement `setView` to (re)frame.

- [ ] **Step 3: Verify type-check + commit**

Run: `npm run check`
```bash
git add src/lib/network/engine.ts
git commit -m "feat(network): data-pulses along live lines + pan/zoom (full)"
```

---

## Phase 3 — Island, surfaces, interactivity

### Task 5: NetworkMap.svelte — SSR list + engine mount + DOM hotspot layer

**Files:**
- Create: `src/components/NetworkMap.svelte`
- Modify: `src/lib/copy/en.ts`

- [ ] **Step 1: Add copy**

Add to `COPY` (after `lineG`):
```typescript
  network: {
    heading: 'THE NETWORK',
    legend: { live: 'open', planned: 'planned', terminus: 'capstone', interchange: 'transfer' },
    a11yMap: 'Bootcamp network map. Five lines; only open stations are interactive.',
    listFallback: 'Network map (text view)',
  },
```

- [ ] **Step 2: Build the island**

SSR-renders an accessible `<ul>` of lines→stations with status + links (this is the no-JS / reduced-motion / no-WebGL truth, recycled from `NetworkMapTeaser.astro`). On mount: import the engine, build `statuses` from the `stations` prop, mount on a `<canvas>`, and lay an absolutely-positioned DOM hotspot (`<a>`/`<button>` with `aria-label`) over each node, positioned by projecting geometry coords → canvas px (same VIEW→client scale the engine uses). Open nodes link to `/line-g/<id>`; the G line links to `/line-g`.

```svelte
<script lang="ts">
  import { onMount } from 'svelte'
  import { NODES, LINES, VIEW } from '../lib/network/geometry'
  import { COPY } from '../lib/copy/en'
  let { variant = 'full', stations = [] }: {
    variant?: 'hero' | 'full'
    stations?: { id: string; status: string; title: string; line: string; index: number }[]
  } = $props()
  let canvas: HTMLCanvasElement
  let host: HTMLDivElement
  const statusOf = (id: string) => stations.find((s) => s.id === id)?.status ?? 'locked'
  onMount(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let net: { destroy(): void; resize(): void } | null = null
    ;(async () => {
      try {
        const { createNetwork } = await import('../lib/network/engine')
        const map: Record<string, 'open'|'announced'|'locked'> = {}
        for (const s of stations) map[s.id] = (s.status as any)
        net = createNetwork(canvas, { statuses: map, variant })
        if (reduce) { /* engine self-skips pulses; one frame is fine */ }
        const ro = new ResizeObserver(() => net?.resize()); ro.observe(host)
      } catch (e) { host.classList.add('no-webgl') } // CSS shows the SSR list
    })()
    return () => net?.destroy()
  })
</script>

<div class="netmap" class:hero={variant==='hero'} bind:this={host}>
  <canvas bind:this={canvas} aria-hidden="true"></canvas>
  <!-- DOM hotspot layer: positioned by VIEW→% so it tracks the canvas -->
  <div class="hotspots" role="group" aria-label={COPY.network.a11yMap}>
    {#each NODES as n}
      {@const st = statusOf(n.stationId)}
      <a class="hot {st}" style={`left:${(n.at.x/VIEW.w)*100}%; top:${(n.at.y/VIEW.h)*100}%`}
         href={st==='open' ? `/line-g/${n.stationId}` : '/line-g'}
         aria-label={`G station ${n.stationId} — ${st}`}></a>
    {/each}
  </div>
  <!-- SSR / no-JS / reduced-motion truth -->
  <ul class="fallback">
    {#each LINES as l}<li>{l.id.toUpperCase()} — {l.patron}{l.terminus ? ` → ${l.terminus}` : ''}</li>{/each}
  </ul>
</div>
```
CSS: `.netmap{position:relative}`, `canvas{width:100%;display:block}`, `.hotspots{position:absolute;inset:0}`, `.hot{position:absolute;transform:translate(-50%,-50%);width:28px;height:28px;border-radius:50%}`, `.hot.open{cursor:pointer}`, focus ring on `.hot:focus-visible`. `.fallback` is visually hidden unless `.no-webgl`/no-JS. Hero variant constrains height.

- [ ] **Step 3: Verify build + a11y (keyboard tab reaches open nodes)**

Run: `npm run build && npm run check`
Then `npm run preview`, mount on a temp page or proceed to Task 6 wiring; verify Tab focuses open station hotspots.

- [ ] **Step 4: Commit**

```bash
git add src/components/NetworkMap.svelte src/lib/copy/en.ts
git commit -m "feat(network): NetworkMap island — SSR list, engine mount, DOM hotspots"
```

### Task 6: `/network` page + landing hero swap + visual verification

**Files:**
- Create: `src/pages/network.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `/network`**

```astro
---
import { getCollection } from 'astro:content'
import Base from '../layouts/Base.astro'
import { COPY } from '../lib/copy/en'
import NetworkMap from '../components/NetworkMap.svelte'
const stations = (await getCollection('stations')).map((s) => ({
  id: s.id, status: s.data.status, title: s.data.title, line: s.data.line, index: s.data.index,
}))
---
<Base title="THE NETWORK — DATAVISM" description="The map of the Data Underground bootcamp.">
  <h1 class="text-signal text-3xl font-bold">{COPY.network.heading}</h1>
  <NetworkMap variant="full" stations={stations} client:only="svelte" />
</Base>
```

- [ ] **Step 2: Swap the landing hero**

In `src/pages/index.astro`, replace the `NetworkMapTeaser` import + `<NetworkMapTeaser />` with a `stations`-fed `<NetworkMap variant="hero" stations={stations} client:visible />` (compute `stations` the same way as `/network`). Keep the surrounding section heading/sub.

- [ ] **Step 3: Visual verification (Playwright, dev server)**

Open `/network` and `/`: confirm the network renders, Line G is solid + glowing with pulses, K/R/B/V dashed, nodes correct, the wordmark reads DATAVISM, open G-stations are clickable → correct routes, no console errors. Screenshot both. Verify `prefers-reduced-motion` (no pulses, static) and a forced no-WebGL path shows the fallback list.

- [ ] **Step 4: Retire the teaser + commit**

```bash
rm src/components/NetworkMapTeaser.astro
npm run check && npm run build
git add -A
git commit -m "feat(network): /network page + landing hero (retire NetworkMapTeaser)"
```

---

## Phase 4 — Richness & growth

### Task 7: Landmarks (Ghost @ Maschinenraum, Vault, entrance) + termini rings + ticket overlay

**Files:**
- Modify: `src/lib/network/engine.ts`, `src/components/NetworkMap.svelte`

- [ ] **Step 1: Termini rings + landmarks**

In the engine, render terminus nodes (the K/R/B/V end points) as double-rings labelled by `terminus`; render `LANDMARKS` (entrance, maschinenraum, vault) as distinct markers. The neon-ghost appears at the maschinenraum: add an `<img src="/favicon.svg">` (or inline ghost) in the DOM hotspot layer positioned at the maschinenraum coord (DOM, not WebGL — crisp).

- [ ] **Step 2: Ticket overlay**

Read the ticket via `loadTicket()` (from `src/lib/ticket-storage`) in `NetworkMap.svelte` `onMount`; mark stamped stations on the map (a ring/checkmark on their hotspot). Honest: reads only `localStorage`.

- [ ] **Step 3: Verify + commit**

Run: `npm run check && npm run build`; visually confirm landmarks + ghost + stamped-station marks.
```bash
git add -A
git commit -m "feat(network): landmarks (ghost@maschinenraum, vault), termini rings, ticket overlay"
```

### Task 8: Growth mechanic verification (data-driven, no code change)

**Files:** none (verification + a test)

- [ ] **Step 1: Add a test proving status drives liveness**

```typescript
// append to src/lib/network/geometry.test.ts
import { NODES as N } from './geometry'
it('the trunk has all five G stations in order', () => {
  const g = N.filter((n) => n.line === 'g')
  expect(g.length).toBe(5)
})
```
Run: `npm run test -- network/geometry` → PASS.

- [ ] **Step 2: Manually verify the growth path**

Temporarily flip `command.md` `status: announced` → `open` (a station file), `npm run build`, open `/network`: Line G/G2 should render solid/clickable purely from the data change. Revert the file (G2 isn't really open yet — honesty). Document in commit that flipping status is the only step to "launch" a line.

- [ ] **Step 3: Commit the test**

```bash
git checkout src/content/stations/command.md
git add src/lib/network/geometry.test.ts
git commit -m "test(network): growth is data-driven — status flips drive line liveness"
```

---

## Phase 5 — Final verification

- [ ] **Step 1:** `npm run test && npm run check && npm run build` — all green.
- [ ] **Step 2: Playwright smoke** — `/` (hero links to /line-g), `/network` (pan/zoom, click open station → station page, dashed planned lines, landmarks, ghost@maschinenraum), reduced-motion (static + list), no console errors except benign favicon.
- [ ] **Step 3: Honesty audit** — `grep -rn "localStorage" src/` only ticket-storage; no analytics/network added; only open stations interactive/solid.
- [ ] **Step 4: Final commit.**

---

## Deferred (NOT in this plan)

- Real geographic coordinates / map engine (deck.gl/MapLibre) — explicitly out.
- DE translation of network copy.
- Per-line launch as a celebratory animated event (arrives with each line's own build).
- OG image of the full network (reuse the Playwright-render pipeline from the OG cards).
- Authoring K/R/B/V station content + capstones (separate per-line work).

## Self-Review (against the spec)

- **Spec coverage:** roles/abgrenzung ✓ (Task 6 keeps ghost logo; network=map) · build-up dashed/solid ✓ (T3) · 5 patron lines + G trunk ✓ (T1/T3) · legend/semantics ✓ (T1 landmarks, T7 termini/ghost/vault, ticket overlay) · two surfaces ✓ (T6) · three.js engine + pulses + bloom ✓ (T3/T4) · DOM hotspot layer + SSR fallback + a11y ✓ (T5) · honesty/reduced-motion/no-WebGL ✓ (T5, Phase 5) · geometry craft as iteration ✓ (T2) · growth data-driven ✓ (T8) · success criteria ✓ (Phase 5).
- **Placeholder scan:** geometry coords in T1 are a real seed, refined in T2 (a visual-craft loop with an explicit acceptance test) — not a TODO. Engine reuse points to a real verified file (`TheFolderStory.svelte`), enumerated params. No "handle errors"/"similar to" placeholders.
- **Type consistency:** `LineId`, `Pt`, `NetLine/NetNode/NetLandmark`, `VIEW`, `createNetwork(canvas,{statuses,variant})`, status union `'open'|'announced'|'locked'`, station shape `{id,status,title,line,index}` used identically across T1/T3/T5/T6.
- **Known caveat (flagged):** T2 geometry is iterative; the wordmark legibility is validated by screenshot, not a unit test (a unit test can't judge "reads as DATAVISM").
