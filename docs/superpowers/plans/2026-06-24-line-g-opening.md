# Line G Opening — "The Descent" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the G1 form-wizard with "The Descent" — a continuous, diegetic, GHOST-conducted opening that flows seamlessly from a vague feeling to a concrete testable question and a real first investigative move, ending in the existing Signal Card.

**Architecture:** A pure, unit-tested **flow engine** (TypeScript state model + curated-case content) drives a **diegetic Svelte experience** that reuses the existing Signal Card artifact (`src/lib/signal-cards/*`). The craft (atmosphere, copy, visual feel) and the real curated cases are **owner-gated deliverables**, not auto-tested — they are de-risked first, then the engine is TDD'd, then the shell is built against the locked feel.

**Tech Stack:** Astro 6 static · Svelte 5 runes · TypeScript · Vitest · existing `/api/ghost` (auth-gated, retry+trim-hardened) · existing identity/connect bridge.

## Global Constraints

- Register = the Manifesto's: serious, political, empowering. The user is the investigator, **never the mark**. No "trick played on the user".
- "Knall" = **immersion + strong dramaturgy** (indie-game craft), NOT flashing effects / animation-as-spectacle / gamified gimmicks. Effects only when deliberate.
- **Seamless flow is the feature:** the moment a concrete question crystallizes, the experience continues with NO screen-break / NO "Lesson N of M" chrome.
- **Honesty (load-bearing):** real sources or none. The build must NEVER invent a source/dataset/stat to fill a gap. Curated cases use vetted, publicly-accessible sources only.
- **Free vs connect:** the whole opening through the Signal Card is scripted, deterministic, login-free, and never calls the live AI. Live GHOST (the auth-gated `/api/ghost`) is the **connect reward** and is OUT of this slice (fast-follow).
- Reuse the existing Signal Card model/persistence/export (`src/lib/signal-cards/*`) — do not reinvent the artifact.
- No GSAP (CSS + IntersectionObserver). Sound optional, off by default, one cue, never autoplay.
- Tests: `npm run test` (= `vitest run`). Single file: `npx vitest run <file>`.
- Branch: `feat/line-g-opening`. Commit after every task. Nothing deploys/merges without explicit owner go-ahead.

---

## File Structure

- **Create** `src/lib/line-g-opening/cases.ts` — the curated launchpad cases (typed; real vetted sources) + the own-question "terrain" data. Pure data + small selectors.
- **Create** `src/lib/line-g-opening/flow.ts` — the pure flow state model (the Descent arc): steps, transitions, draft accumulation toward a `SignalCard`. No DOM, no AI.
- **Create** `src/lib/line-g-opening/flow.test.ts`, `cases.test.ts` — unit tests.
- **Create** `src/components/line-g-opening/Descent.svelte` — the diegetic experience (mounts the engine, GHOST-conducted dialogue, the seam, reuses `SignalCard`).
- **Create** `src/components/line-g-opening/ghost-script.ts` — GHOST's authored dialogue/copy (separated from the view so copy is iterable and the view stays thin).
- **Reuse (unchanged):** `src/lib/signal-cards/{types,storage,export,route-suggestions}.ts`, `src/components/signal-card/SignalCard.svelte`, the identity bridge.
- **Modify** `src/pages/[line]/[station].astro:61-66` — mount `Descent` instead of `G1InitiationFlow` for `interactive === 'g1-initiation'`.
- **Retire** `src/components/initiation/G1InitiationFlow.svelte` — removed once `Descent` replaces it (kept in git history).

> The owner-gated content lives in `cases.ts`; the owner-gated visual feel is locked in Task 2 and realized in `Descent.svelte`.

---

## Phase 0 — De-risk (owner-gated; not vitest-tested)

### Task 1: Research & vet the real launch cases

**Files:** Create `src/lib/line-g-opening/cases.ts` (data only, this task fills the launchpad set).

**Deliverable:** 3–5 curated launchpad cases, each a **real system-that-bothers-people** with a **vetted, publicly-accessible source** (a register, dataset, archive, or official document — URL that resolves and is genuinely public). Each case carries: a short "what bothers people" hook, the implied `SystemSignal` (`tracking|money|feed|future`), a sharpened starter question, and the real source (title + URL + one line on what it contains).

- [ ] **Step 1: Draft candidates.** Research real public sources (e.g. lobbying/transparency registers, official spending datasets, public ad-library/transparency tools, regulator filings). For each candidate, verify the URL resolves and the data is public. Capture title, URL, and what it contains.
- [ ] **Step 2: Write `cases.ts`** with the typed shape below and the vetted candidates. Do NOT include any source you could not open and confirm is public.

```ts
// src/lib/line-g-opening/cases.ts
import type { SystemSignal } from '../signal-cards/types'

export type LaunchpadCase = {
  id: string                 // stable slug, e.g. 'lobby-energy'
  hook: string               // the "this bothers people" line GHOST offers
  systemSignal: SystemSignal // tracking | money | feed | future
  starterQuestion: string    // a sharpened, testable question seed
  source: { title: string; url: string; contains: string } // REAL, public, verified
}

export const LAUNCHPAD_CASES: LaunchpadCase[] = [
  // filled by this task with 3–5 vetted real cases — no inventions
]

export function getCase(id: string): LaunchpadCase | undefined {
  return LAUNCHPAD_CASES.find((c) => c.id === id)
}
```

- [ ] **Step 3: Owner sign-off (GATE).** Present the 3–5 cases + sources to the owner. Proceed only on approval; honesty depends on it. Do not fabricate to unblock.
- [ ] **Step 4: Commit** `git add src/lib/line-g-opening/cases.ts && git commit -m "content(line-g): vetted real launchpad cases for The Descent"`

### Task 2: Lock the diegetic feel (visual/atmosphere)

**Files:** none committed necessarily (a spike or mockups); the outcome is an approved direction the shell (Task 6) is built to.

**Deliverable:** an agreed look-and-feel for the Descent — the "terminal / opening case-file" diegesis, typography, the dark machine-room atmosphere, the seam moment (file opening), and the restraint level (motion/sound). Mockups (offer the brainstorming visual companion here) or a throwaway HTML spike.

- [ ] **Step 1:** Produce 1–2 concrete visual directions for: (a) the descent/atmosphere, (b) the GHOST-dialogue surface, (c) the case-file-opening seam, (d) the filling-file progress.
- [ ] **Step 2: Owner sign-off (GATE).** Lock one direction. Record the decision (a short note in the spec or an ADR) so Task 6 has an unambiguous target.

---

## Phase 1 — The flow engine (TDD, code-complete)

### Task 3: The Descent flow state model

**Files:** Create `src/lib/line-g-opening/flow.ts`; Test `src/lib/line-g-opening/flow.test.ts`.

**Interfaces:**
- Consumes: `SignalCard`, `SystemSignal` from `../signal-cards/types`; `LaunchpadCase`, `getCase` from `./cases`.
- Produces: `OpeningStep`, `OpeningState`, `initialState()`, `choosePath()`, `pickLaunchpad()`, `setSuspicion()`, `setQuestion()`, `back()`, `isSeam()`.

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/line-g-opening/flow.test.ts
import { describe, it, expect } from 'vitest'
import { initialState, choosePath, pickLaunchpad, setSuspicion, setQuestion, isSeam } from './flow'

describe('Descent flow', () => {
  it('starts in descent and opens to the prompt', () => {
    const s = initialState()
    expect(s.step).toBe('descent')
    expect(choosePath(s, 'own').step).toBe('suspicion')
  })
  it('own path: suspicion → sharpen → the seam opens the file on a concrete question', () => {
    let s = choosePath(initialState(), 'own')
    s = setSuspicion(s, 'A site knew my search before I logged in.')
    expect(s.step).toBe('sharpen')
    expect(isSeam(s)).toBe(false)
    s = setQuestion(s, 'What evidence shows cross-site tracking before consent?')
    expect(s.step).toBe('open-file')
    expect(isSeam(s)).toBe(true) // the seamless gear-shift
    expect(s.draft.question).toContain('cross-site tracking')
  })
  it('launchpad path seeds the draft from a vetted case', () => {
    let s = choosePath(initialState(), 'launchpad')
    expect(s.step).toBe('launchpad')
    s = pickLaunchpad(s, 'lobby-energy') // an id present in LAUNCHPAD_CASES
    expect(s.step).toBe('suspicion')
    expect(s.launchpadId).toBe('lobby-energy')
    expect(s.draft.systemSignal).toBeDefined()
  })
  it('rejects an unknown launchpad id without advancing', () => {
    const s = choosePath(initialState(), 'launchpad')
    expect(pickLaunchpad(s, 'nope').step).toBe('launchpad')
  })
})
```

- [ ] **Step 2: Run to verify it fails** — `npx vitest run src/lib/line-g-opening/flow.test.ts` → FAIL (module not found).

- [ ] **Step 3: Implement `flow.ts`**

```ts
// src/lib/line-g-opening/flow.ts
// Pure state model for "The Descent". No DOM, no AI. Accumulates a Partial<SignalCard>
// draft that the view persists (storage.ts) and finalizes (SignalCard).
import type { SignalCard, SystemSignal } from '../signal-cards/types'
import { getCase } from './cases'

export type OpeningStep = 'descent' | 'prompt' | 'launchpad' | 'suspicion' | 'sharpen' | 'open-file' | 'first-move' | 'card'
export type Path = 'launchpad' | 'own' | null

export type OpeningState = {
  step: OpeningStep
  path: Path
  launchpadId: string | null
  draft: Partial<SignalCard>
}

export function initialState(): OpeningState {
  return { step: 'descent', path: null, launchpadId: null, draft: { line: 'g', station: 'g1-the-folder', stage: 'question' } }
}

export function choosePath(s: OpeningState, path: Exclude<Path, null>): OpeningState {
  return { ...s, path, step: path === 'own' ? 'suspicion' : 'launchpad' }
}

export function pickLaunchpad(s: OpeningState, id: string): OpeningState {
  const c = getCase(id)
  if (!c) return s // unknown id: do not advance
  return {
    ...s,
    launchpadId: id,
    step: 'suspicion',
    draft: { ...s.draft, systemSignal: c.systemSignal as SystemSignal, suspicion: c.hook, question: c.starterQuestion },
  }
}

export function setSuspicion(s: OpeningState, suspicion: string): OpeningState {
  return { ...s, step: 'sharpen', draft: { ...s.draft, suspicion } }
}

// The seam: a concrete question opens the file. No screen-break in the view — this
// is the gear-shift the whole experience hinges on.
export function setQuestion(s: OpeningState, question: string): OpeningState {
  return { ...s, step: 'open-file', draft: { ...s.draft, question } }
}

export function isSeam(s: OpeningState): boolean {
  return s.step === 'open-file'
}

export function back(s: OpeningState): OpeningState {
  const order: OpeningStep[] = ['descent', 'prompt', 'launchpad', 'suspicion', 'sharpen', 'open-file', 'first-move', 'card']
  const i = order.indexOf(s.step)
  return i > 0 ? { ...s, step: order[i - 1] } : s
}
```

- [ ] **Step 4: Run to verify it passes** — `npx vitest run src/lib/line-g-opening/flow.test.ts` → PASS. (Note: the launchpad test needs an `id` that exists in `LAUNCHPAD_CASES` from Task 1 — use a real id from the approved set.)

- [ ] **Step 5: Commit** — `git add src/lib/line-g-opening/flow.* && git commit -m "feat(line-g): pure Descent flow state model"`

### Task 4: First-real-move content (terrain map for own questions)

**Files:** Modify `src/lib/line-g-opening/cases.ts` (add the "terrain"); Test `src/lib/line-g-opening/cases.test.ts`.

**Interfaces:**
- Produces: `terrainFor(signal: SystemSignal): Terrain` — for an own-question path, where real public evidence for that *kind* of question lives (real example source types per signal). Reuses the line mapping idea from `route-suggestions.ts`.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/line-g-opening/cases.test.ts
import { describe, it, expect } from 'vitest'
import { terrainFor } from './cases'

describe('terrainFor', () => {
  it('hands a non-empty list of real evidence terrains for each signal', () => {
    for (const sig of ['tracking', 'money', 'feed', 'future'] as const) {
      const t = terrainFor(sig)
      expect(t.places.length).toBeGreaterThan(0)
      for (const p of t.places) expect(p.url.startsWith('http')).toBe(true)
    }
  })
})
```

- [ ] **Step 2: Run to verify it fails** — `npx vitest run src/lib/line-g-opening/cases.test.ts` → FAIL.

- [ ] **Step 3: Implement `terrainFor`** in `cases.ts` (append):

```ts
export type Terrain = { places: { kind: string; example: string; url: string }[] }

const TERRAIN: Record<string, Terrain> = {
  // Each entry: real, public source TYPES for that kind of question, with one real
  // example URL each. Filled with vetted entries during this task (no inventions).
  tracking: { places: [] },
  money: { places: [] },
  feed: { places: [] },
  future: { places: [] },
}

export function terrainFor(signal: string): Terrain {
  return TERRAIN[signal] ?? { places: [] }
}
```

  Fill each `places: []` with vetted real entries (verify URLs resolve, like Task 1). **Owner sign-off applies to these sources too** (same honesty gate).

- [ ] **Step 4: Run to verify it passes** — `npx vitest run src/lib/line-g-opening/cases.test.ts` → PASS.

- [ ] **Step 5: Commit** — `git add src/lib/line-g-opening/cases.* && git commit -m "feat(line-g): real evidence-terrain map for own-question path"`

---

## Phase 2 — The diegetic experience (build + verify-by-eye against the Task 2 feel)

### Task 5: GHOST's authored script (copy module)

**Files:** Create `src/components/line-g-opening/ghost-script.ts`.

**Interfaces:** Produces `GHOST_LINES` — the authored dialogue keyed by step/situation (descent intro, the "suggest something" resistant-then-generative beats, the sharpen prompts, the seam line "A question without a source is a wish", the first-move framing, the card hand-off, the connect-reward CTA). Pure strings; no logic.

- [ ] **Step 1:** Write `ghost-script.ts` exporting a typed `GHOST_LINES` object (string/array fields per the steps in `flow.ts`). Copy in GHOST's voice (precise, calm, unsentimental, slightly resistant-then-generative). Keep ownership-returning phrasing ("you choose, then you pull").
- [ ] **Step 2: Verify** — `npm run check` passes (typecheck only; copy is reviewed by the owner in Task 6 walkthrough).
- [ ] **Step 3: Commit** — `git add src/components/line-g-opening/ghost-script.ts && git commit -m "content(line-g): GHOST authored script for The Descent"`

### Task 6: The Descent experience (Svelte)

**Files:** Create `src/components/line-g-opening/Descent.svelte`.

**Interfaces:** Consumes `flow.ts` (state model), `cases.ts` (`LAUNCHPAD_CASES`, `terrainFor`), `ghost-script.ts`, and reuses `src/lib/signal-cards/{storage,export}.ts` + `src/components/signal-card/SignalCard.svelte`. Mounts with `client:load` and a `stationId` prop (as the current flow does).

This task is **build + verify-by-eye against the Task 2 locked feel**, not vitest (no component-test harness in this repo; the engine is already unit-tested).

- [ ] **Step 1:** Build the continuous experience: descent → GHOST prompt → (launchpad picker from `LAUNCHPAD_CASES` OR own suspicion) → sharpen to question → **the seam** (question crystallizes → the case-file opens with NO screen-break, per the locked feel) → first move (curated: show the case's real source; own: `terrainFor(signal)`) → reuse `SignalCard` for the artifact (persist via `storage.ts`, export via `export.ts`). No "Next/Lesson" chrome.
- [ ] **Step 2:** Wire the **connect hand-off point** at/after the seam: a CTA that live GHOST can react to the user's own question — links to `/connect`. (The live thread-pull itself is the fast-follow, out of scope; this is just the doorway.)
- [ ] **Step 3: Verify** — `npm run check` and `npm run build` succeed. Then run the app and walk it: blank path (launchpad) and own path both reach a Signal Card; the seam has no screen-break; persistence + export work.
- [ ] **Step 4: Owner walkthrough (GATE)** — the owner experiences it and confirms it clears the bar (immersion + dramaturgy + seamless flow, manifesto register). Iterate copy/feel here.
- [ ] **Step 5: Commit** — `git add src/components/line-g-opening/Descent.svelte && git commit -m "feat(line-g): The Descent — diegetic GHOST-conducted opening"`

### Task 7: Mount it & retire the wizard

**Files:** Modify `src/pages/[line]/[station].astro:61-66`; remove `src/components/initiation/G1InitiationFlow.svelte`.

- [ ] **Step 1:** In `[station].astro`, replace the `G1InitiationFlow` import + mount with `Descent` (same `client:load` + `stationId={station.id}` contract).
- [ ] **Step 2:** Delete `src/components/initiation/G1InitiationFlow.svelte` (git history keeps it). Confirm nothing else imports it (`grep -rn G1InitiationFlow src`).
- [ ] **Step 3: Verify** — `npm run build` succeeds; `/line-g/the-folder` renders the Descent, not the wizard.
- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat(line-g): mount The Descent at G1, retire the form wizard"`

---

## Self-Review

- **Spec coverage:** descent/dramaturgy → T6; GHOST-as-character + resistant-then-generative → T5/T6; option-3 (own + curated launchpads) → T1/T3/T6; first real move (curated source / own terrain) → T1/T4/T6; the seam → T3 (`isSeam`)/T6; diegetic file-fill progress + Signal Card reuse → T6; free-vs-connect (connect hand-off, live pull out) → T6 Step 2; honesty (real sources, owner gates) → T1/T2/T4 gates; retire wizard → T7. ✅
- **Scope:** connected live thread-pull is explicitly OUT (fast-follow); G2–G5 untouched. ✅
- **Placeholders:** the empty `LAUNCHPAD_CASES`/`TERRAIN` arrays are **content slots filled by their own tasks under an owner honesty-gate** — intentionally not pre-invented (fabricating sources would violate the core constraint). Engine code is complete.
- **Type consistency:** `OpeningState`/`OpeningStep`/`LaunchpadCase`/`Terrain`, `SystemSignal`/`SignalCard` reused from `signal-cards/types`; storage/export APIs used as they exist. ✅

## Notes for the executor

- Phase 0 GATES are real: do not skip to coding the shell before the cases are vetted (T1) and the feel is locked (T2). Building a cinematic shell against an un-locked feel wastes the most expensive work.
- The engine (T3/T4) is fully TDD-able now and independent of the gates — it can proceed in parallel with Phase 0 research.
- Craft tasks (T5/T6) are verified by the owner's eye + the running app, not vitest — that is correct for an immersion-led experience, not a shortcut.
