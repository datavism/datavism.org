# The Command Center — MVP — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A standalone vertical slice — the Command Center boots up (world map of real cases), routes a new user into one guided operation, GHOST guides them to a real source and **certifies the method** of their structured finding, the operation closes and enters a light history.

**Architecture:** A pure, unit-tested **operation state model** + a self-contained **`/api/certify` method-check** (live AI returning a structured verdict) drive a **diegetic command-center Svelte experience**. Reuses the verified cases, the Signal Card artifact, and the auth/rate-limit infra. Visual feel and the first operation's content are owner-gated and de-risked first.

**Tech Stack:** Astro 6 static · Svelte 5 runes · TypeScript · Vitest · Gemini via a self-contained `/api` function · existing `/api/ghost` auth (jose) + rate-limit (Upstash) infra · existing Signal Card + cases.

## Global Constraints

- Register = Manifesto's: serious, political, empowering; the user is the investigator. Knall = immersion + dramaturgy, NOT effects.
- **Honesty (load-bearing):** "certified" = **method certified, NEVER fact-verified** — UI/history must say so; sources visible, uncertainty marked. Real sources only. AI judge is a method-gate, not an oracle — state it.
- `/api/*` functions MUST be self-contained (no `../src` imports; npm deps OK). Tests live outside `/api`.
- The method-check is **live AI behind connect** (login wall sits right before certification). Free taste = boot-up → claim → briefing → pull source → draft finding. Connect = GHOST certifies + enter history.
- Reuse: `src/lib/line-g-opening/cases.ts`, `src/lib/signal-cards/*`, the `/api/ghost` auth (`verifyFirebaseIdToken`) + rate-limit (`checkRateLimit`) pattern, the identity/connect bridge. No GSAP. Sound optional/off by default.
- First guided case (owner-confirmed): **`lobby-register-de`** (German Lobbyregister).
- Branch: `feat/command-center`. Commit per task. Nothing deploys/merges without explicit owner go-ahead.

> **DEPENDENCY (flag to owner):** the auth verify + rate-limit helpers this plan reuses live on `feat/ghost-auth` (built + reviewed, not yet merged). Cleanest sequencing: **land `feat/ghost-auth` + `fix/ghost-reliability` on `main` first** (owner-gated), then this branch rebases onto them. Otherwise Task 4 must bring those self-contained helpers into this branch. Resolve before Task 4.

---

## File Structure
- **Create** `src/lib/command-center/operations.ts` — the first operation's content (briefing + method-bar criteria) for `lobby-register-de`. Owner-gated content.
- **Create** `src/lib/command-center/certify.ts` — pure deterministic pre-checks for a finding (source present, uncertainty present, specificity). No AI, fully testable.
- **Create** `api/certify.ts` — self-contained `/api/certify` function: auth + rate-limit + the AI method-judgment, returns a structured `Verdict`. Pure helpers exported for tests.
- **Create** `src/lib/command-center/flow.ts` — pure operation state model (claim → briefing → source → draft → certify → closed).
- **Create** `src/lib/command-center/history.ts` — light persistence of closed/certified operations (reuse Signal Card storage shapes).
- **Create** `src/components/command-center/CommandCenter.svelte` — boot-up + world map island.
- **Create** `src/components/command-center/Operation.svelte` — the operation flow (briefing → source → finding form → certify → close → history).
- **Create** `src/pages/command.astro` — the standalone route mounting the Command Center.
- **Reuse:** `src/lib/line-g-opening/cases.ts`, `src/lib/signal-cards/*`, the `/api/ghost` auth+ratelimit helpers.

---

## Phase 0 — De-risk (owner-gated; not vitest-tested)

### Task 1: Visual lock — boot-up + map + operation surface
**Deliverable:** an agreed look-and-feel (clean-futuristic / subtle cyberpunk, datavism palette) for (a) the command-center **boot-up** (map assembles, cases ignite, GHOST voice), (b) the **world map** with real case points, (c) the **operation surface** (briefing → finding → certified). Mockups via the brainstorming visual companion.
- [ ] **Step 1:** Produce 1–2 visual directions for boot-up + map + operation surface.
- [ ] **Step 2: Owner sign-off (GATE).** Lock one direction; record the decision so the build (Tasks 6–7) has an unambiguous target.

### Task 2: Author the first operation content (`lobby-register-de`)
**Files:** Create `src/lib/command-center/operations.ts`.
**Deliverable:** the Lobbyregister operation: a **briefing** (the system, why it matters), the **real source** (already in `cases.ts`), the **investigative question**, and the **method-bar criteria** a valid finding must meet (what source it should cite, what makes a finding specific here, what uncertainty looks like). Honesty-gated.
- [ ] **Step 1:** Write `operations.ts` with the typed shape below + the Lobbyregister entry, EN-first, real source only.
```ts
import type { SystemSignal } from '../signal-cards/types'
export type Operation = {
  caseId: string                 // matches a LAUNCHPAD_CASES id, e.g. 'lobby-register-de'
  signal: SystemSignal
  briefing: string               // the stakes, in GHOST's register
  question: string               // the investigative question for this operation
  source: { title: string; url: string; howTo: string } // real source + how to pull it
  methodBar: { wantsSourceCited: boolean; wantsSpecificFinding: boolean; wantsUncertainty: boolean }
}
export const FIRST_OPERATION: Operation = { /* lobby-register-de, owner-approved */ }
```
- [ ] **Step 2: Owner sign-off (GATE).** Confirm the briefing + criteria. Commit: `git add src/lib/command-center/operations.ts && git commit -m "content(command-center): first guided operation — Lobbyregister"`

---

## Phase 1 — Engine (TDD, code-complete)

### Task 3: Deterministic finding pre-checks
**Files:** Create `src/lib/command-center/certify.ts`; Test `src/lib/command-center/certify.test.ts`.
**Interfaces:** Produces `type Finding = { question: string; sourceUrl: string; evidence: string; uncertainty: string }`; `preCheck(f: Finding): { ok: boolean; missing: string[] }` — the cheap method-bar gate (no AI).

- [ ] **Step 1: Write the failing test**
```ts
import { describe, it, expect } from 'vitest'
import { preCheck } from './certify'
describe('preCheck (method-bar, no AI)', () => {
  const good = { question: 'Who spent the most lobbying the Bundestag in 2024?', sourceUrl: 'https://www.lobbyregister.bundestag.de/startseite', evidence: 'Org X reported the highest expenditure band, ~€8.4M, in the 2024 register entry.', uncertainty: 'Bands are self-declared ranges, not exact figures.' }
  it('passes a complete finding', () => { expect(preCheck(good)).toEqual({ ok: true, missing: [] }) })
  it('flags a missing source', () => { expect(preCheck({ ...good, sourceUrl: '' }).missing).toContain('source') })
  it('flags missing uncertainty', () => { expect(preCheck({ ...good, uncertainty: '' }).missing).toContain('uncertainty') })
  it('flags a vague/too-short finding', () => { expect(preCheck({ ...good, evidence: 'it is bad' }).missing).toContain('specificity') })
  it('requires an http source url', () => { expect(preCheck({ ...good, sourceUrl: 'lobbyregister' }).missing).toContain('source') })
})
```
- [ ] **Step 2: Run → fail** — `npx vitest run src/lib/command-center/certify.test.ts`
- [ ] **Step 3: Implement**
```ts
// src/lib/command-center/certify.ts
// The cheap, deterministic half of the method-bar. The AI (api/certify.ts) judges
// "does the claim follow from that kind of source"; this catches structural gaps
// without an AI call. Method, never truth.
export type Finding = { question: string; sourceUrl: string; evidence: string; uncertainty: string }

export function preCheck(f: Finding): { ok: boolean; missing: string[] } {
  const missing: string[] = []
  if (!/^https?:\/\//.test(f.sourceUrl.trim())) missing.push('source')
  if (f.uncertainty.trim().length < 8) missing.push('uncertainty')
  if (f.evidence.trim().length < 24) missing.push('specificity')
  if (f.question.trim().length < 12) missing.push('question')
  return { ok: missing.length === 0, missing }
}
```
- [ ] **Step 4: Run → pass.** Then `npx vitest run` once → no regressions.
- [ ] **Step 5: Commit** — `git commit -am "feat(command-center): deterministic finding pre-checks (method-bar)"`

### Task 4: `/api/certify` — the GHOST method-check (self-contained)
**Files:** Create `api/certify.ts`; Test `src/command-center-certify.test.ts`.
**Interfaces:** Produces `type Verdict = { certified: boolean; feedback: string; missing: string[] }`; `judgeFinding(finding, operation, opts): Promise<Verdict>` (pure, AI injectable); a default handler that auth-gates + rate-limits + calls it.
**Consumes:** `preCheck` (Task 3); the `verifyFirebaseIdToken` + `checkRateLimit` pattern from `api/ghost.ts` (see DEPENDENCY note — reuse the reviewed helpers).

- [ ] **Step 1: Write the failing test** (AI mocked, like the `askGhost` tests)
```ts
// src/command-center-certify.test.ts
import { describe, it, expect } from 'vitest'
import { judgeFinding } from '../api/certify'
const op = { caseId: 'lobby-register-de', question: 'q', source: { url: 'https://www.lobbyregister.bundestag.de/startseite' } } as any
const finding = { question: 'Who spent the most lobbying the Bundestag in 2024?', sourceUrl: 'https://www.lobbyregister.bundestag.de/startseite', evidence: 'Org X, highest expenditure band ~€8.4M in its 2024 register entry.', uncertainty: 'Bands are self-declared ranges.' }
const ai = (verdict: any) => async () => ({ ok: true, status: 200, json: async () => ({ candidates: [{ content: { parts: [{ text: JSON.stringify(verdict) }] } }] }) }) as any

describe('judgeFinding', () => {
  it('fails fast on a deterministic gap WITHOUT calling the AI', async () => {
    let called = false
    const v = await judgeFinding({ ...finding, sourceUrl: '' }, op, { apiKey: 'k', fetchImpl: (async () => { called = true; return {} as any }) as any })
    expect(v.certified).toBe(false); expect(v.missing).toContain('source'); expect(called).toBe(false)
  })
  it('certifies when pre-check passes and the AI returns certified', async () => {
    const v = await judgeFinding(finding, op, { apiKey: 'k', fetchImpl: ai({ certified: true, feedback: 'Method holds.', missing: [] }) })
    expect(v.certified).toBe(true)
  })
  it('returns the AI feedback when the AI declines', async () => {
    const v = await judgeFinding(finding, op, { apiKey: 'k', fetchImpl: ai({ certified: false, feedback: 'The claim does not follow from that register field.', missing: ['claim-follows'] }) })
    expect(v.certified).toBe(false); expect(v.feedback).toMatch(/does not follow/)
  })
})
```
- [ ] **Step 2: Run → fail** — `npx vitest run src/command-center-certify.test.ts`
- [ ] **Step 3: Implement `api/certify.ts`** — self-contained. `judgeFinding`: run `preCheck` first (copy the small `preCheck` logic inline OR re-declare it here so `/api` stays self-contained — do NOT import from `../src`); if it fails, return `{ certified:false, missing, feedback: <in-character line for the first gap> }` without any AI call. Else build a Gemini request with a **method-eval system prompt** (judge METHOD not truth: does the claim follow from that kind of source? specific? source legitimate for this case?) + a **structured-output instruction** (return JSON `{certified, feedback, missing}`), call Gemini, parse + validate the JSON, return the `Verdict`. The default `handler(req,res)` mirrors `api/ghost.ts`: 405 / 503-no-key / **401 auth (reuse `verifyFirebaseIdToken`)** / rate-limit per uid (reuse `checkRateLimit`) / then `judgeFinding`. The method-eval system prompt MUST state it certifies method, never truth.
- [ ] **Step 4: Run → pass.** Then `npx vitest run` once.
- [ ] **Step 5: Commit** — `git add api/certify.ts src/command-center-certify.test.ts && git commit -m "feat(command-center): /api/certify — GHOST method-check (method, not truth)"`

### Task 5: Operation state model + light history
**Files:** Create `src/lib/command-center/flow.ts`, `flow.test.ts`, `history.ts`, `history.test.ts`.
**Interfaces:** Produces `OperationStep = 'briefing'|'source'|'draft'|'certifying'|'closed'`; `initialOp(caseId)`, `advance(...)`, draft accumulation toward a `Finding`; `recordClosed(op)` / `loadHistory()` (reuse `src/lib/signal-cards/storage.ts` patterns).

- [ ] **Step 1: Write failing tests** for: the step order; that a certified verdict moves the op to `closed`; that `recordClosed` persists a `{ caseId, finding, certifiedAt, codename }` record and `loadHistory` returns it. (Use a memory-storage shim like `storage.test.ts`.)
- [ ] **Step 2: Run → fail.**
- [ ] **Step 3: Implement** `flow.ts` (pure state machine, mirrors `src/lib/line-g-opening/flow.ts` style) + `history.ts` (a `datavism:command-center:history` key, versioned envelope like `storage.ts`).
- [ ] **Step 4: Run → pass.** Then `npx vitest run` once.
- [ ] **Step 5: Commit** — `git commit -am "feat(command-center): operation state model + light history"`

---

## Phase 2 — The experience (build + verify-by-eye against the Task 1 lock)

### Task 6: Command Center boot-up + world map
**Files:** Create `src/components/command-center/CommandCenter.svelte`; `src/pages/command.astro`.
Build the **boot-up** (map assembles, cases ignite from `LAUNCHPAD_CASES`, GHOST voice) → the **world map** → it routes a new user into the first operation (no free selection). To the locked visual. `npm run check` + `npm run build` succeed; walk it. Owner walkthrough (GATE). Commit.

### Task 7: The Operation flow
**Files:** Create `src/components/command-center/Operation.svelte`.
Mounts `flow.ts` + `operations.ts` + the Signal Card finding form (reuse) + `history.ts`. Flow: briefing → source (the real link) → draft finding → **connect wall** (link to `/connect`; the certify call needs auth) → `POST /api/certify` → verdict (certified → close + enter history; not-yet → show GHOST's feedback, let them revise). Honesty: label "method certified, not verified". `npm run check` + `npm run build`. Owner walkthrough (GATE). Commit.

### Task 8: Wire the route + end-to-end walk
Mount `CommandCenter` in `command.astro`, confirm `/command` boots → routes to the operation → reaches a (certified) close + history entry. `npm run build`. Owner walkthrough. Commit.

---

## Self-Review
- **Spec coverage:** boot-up/map → T1/T6; first guided operation → T2/T7; the loop → T5/T7/T8; GHOST certifies method → T3/T4; honesty labels → T4/T7; history-light → T5/T7; standalone route → T6/T8; reuse (cases, Signal Card, auth) → T2/T4/T7. ✅
- **Scope:** free case selection, seasons, other lines, peer review, full artwork, BYO-question are OUT. ✅
- **Placeholders:** `FIRST_OPERATION = {…}` and `Verdict` content are filled by their own owner-gated/TDD tasks; engine code is complete. The method-eval *prompt* is iterative craft (flagged), with a TDD-tested contract around it.
- **Type consistency:** `Finding`, `Verdict`, `Operation`, `OperationStep` reused across tasks; `SystemSignal`/`SignalCard` from `signal-cards/types`. ✅
- **DEPENDENCY:** Task 4 reuses auth+ratelimit from `feat/ghost-auth` — resolve the branch sequencing (recommend: land it on main first) before Task 4.
