# DATAVISM — G1 Initiation + Platform Roadmap — Design Decisions

**Status:** Approved design (2026-06-21). Precedes implementation plan.
**Owner spec (input):** `docs/product/g1-interactive-initiation-v0.1.md` (authored by FB)
**Identity contract:** `docs/INTEGRATION-data-snack.md` (binding)
**Curriculum canon:** `docs/curriculum/line-g.md`, `src/lib/curriculum/lines.ts`

> **Why this matters.** G1 is the front door. It decides whether DATAVISM attracts,
> holds, and brings people back. This design turns G1 from a lesson page into an
> *initiation that produces a shareable artifact*, instruments the funnel so we can
> see where people drop off, and is built account-ready so progress and identity
> layer on without rework.

---

## 0. Decomposition — this is a platform, built in 3 phases

Each phase is its own spec → plan → build. This doc fully specs **Phase 1** and
records the architecture commitments that keep Phases 2–3 cheap.

| Phase | Subsystem | Runtime | Status |
|---|---|---|---|
| **1** | **G1 Interactive Initiation + privacy analytics** | static + localStorage | **this doc** |
| 2 | Identity bridge to data-snack (accounts + progress sync) | Firebase client SDK (no datavism server) | outlined below |
| 3 | GHOST as a live, learning AI agent | needs a secure AI proxy | own design cycle |

Sequencing (decided): **ship Phase 1 first** (anonymous, fast, measurable), then Phase 2, then Phase 3.

---

## 1. Decisions (the forks)

1. **Artifact model — Signal Card *extends into* Case File.** The guided flow collects
   5 of the 8 canon Case File fields and produces a shareable **Signal Card**
   (`stage: 'question'`). An optional **upgrade** adds the 3 deeper fields
   (Actor / Source Lead / Public Relevance) → full **Case File #1** (`stage: 'case-file'`).
   One method, two depths — no redundant second artifact.
2. **Phase 1 scope = flow + minimal Signal Archive.** The stepper + card + export,
   **and** a minimal `/archive` (curated samples + the user's own local cards + a stage
   legend). No public posting.
3. **Card export = copy / Markdown / JSON / PNG.** PNG via **`modern-screenshot`**
   (maintained html-to-image successor; better web-font handling). One small dep,
   explicitly sanctioned.
4. **Analytics = cookieless, no consent banner.** **Umami** (default; free, self-host
   or free cloud tier, funnels) with **Plausible** as a swap-in. No cookies, no PII,
   no device storage, transparent public note. *PostHog rejected:* cross-session funnels
   need a persistent visitor ID = device storage = consent banner — off-brand for a
   surveillance-activism site. Provider wired as a single swappable snippet.
5. **No AI in Phase 1.** Question "sharpen" uses **deterministic templates only** — no
   API, no fake intelligence. Real GHOST AI is Phase 3.
6. **Identity deferred to Phase 2**, but the Phase 1 data model is **account-ready**:
   stable card IDs, fully serializable, a `visibility`/owner slot, and line/station codes
   that map straight onto the bridge's `datavism` object — so local progress syncs later
   with zero rework.

---

## 2. The flow (5–10 min, one decision per screen)

```
intro → system-signal → suspicion → question → evidence → uncertainty → route → CARD
        → (optional) upgrade-to-Case-File → (optional) archive-contribution
```

- Progress shows the **7 core steps** (Signal · Suspicion · Question · Evidence · Uncertainty · Route · Card).
- Autosaves a draft to `localStorage` after each step; back-navigation always available.
- GHOST microcopy per step (precise, calm, uncanny — never motivational). Source: owner spec §14.
- **Uncertainty is required** to complete a card. **Sensitive-PII warning** on the suspicion field.

### Field mapping — Signal Card ⇄ Case File ⇄ identity bridge

| Flow step | Collects | → Case File field | → bridge `crew/{uid}.datavism` |
|---|---|---|---|
| system-signal | tracking/money/feed/future/unsure | **System** | informs `line` |
| suspicion | free text | **Suspicion** | — |
| question | free text (+ sharpen) | **Question** | — |
| evidence | multi-select | **Evidence Need** | — |
| uncertainty | free text (required) | **Assumptions** | — |
| route | chosen next line | — | `line` (UPPERCASE `G`..`V`), `enrolledLines` |
| upgrade | Actor / Source Lead / Public Relevance | **+3 deeper fields** | — |
| complete G1 | — | — | `completedStations += 'g1'` |

> Note the casing boundary: our `lines.ts` uses lowercase ids (`'g'`); the bridge `line`
> is UPPERCASE (`'G'`). Map at the boundary only. `completedStations`/`enrolledLines`
> are **our** vocabulary (station ids like `g1`), stored opaquely by data-snack.

---

## 3. Architecture (Phase 1 files)

```
src/lib/signal-cards/
  types.ts              SignalCard (+ optional Case File extension fields), stage, visibility
  route-suggestions.ts  deterministic systemSignal→line + keyword hints (pure, tested)
  storage.ts            localStorage: datavism:g1:draft, datavism:signal-cards (versioned)
  export.ts             markdown / json / copy  (PNG lives in the card component)
src/components/initiation/
  G1InitiationFlow.svelte   orchestrator: $state machine, progress, nav, autosave, step UIs
src/components/signal-card/
  SignalCard.svelte         the designed evidence-object (preview + PNG target + archive cell)
src/components/archive/
  SignalArchiveGrid.svelte  grid + line/stage filters, reuses SignalCard
src/pages/[line]/[station].astro
  G1 opts into the flow via a new optional frontmatter flag `interactive: 'g1-initiation'`;
  the generic renderer and G2–G5 are untouched. For G1 the flow replaces the standalone
  SelfCheck island (the flow has its own checks).
src/pages/archive.astro       "The Signal Archive": curated samples + your local cards + stage legend
src/data/archive/sample-signal-cards.ts   ~6–8 authored, clearly-labeled example cards
src/layouts/Base.astro        + cookieless analytics snippet, production-gated, provider-swappable
```

**Component count:** 3 Svelte islands + 4 lib files — matches existing island conventions
(SelfCheck, NetworkMap), not the 12-file split in the owner spec.

---

## 4. Honesty & ethics (hard rules)

- Every card stamped **"Not evidence yet. Investigation opened."**
- Uncertainty required; sensitive-PII warning before submission.
- Archive samples **labeled curated**; archive disclaimer about stages.
- Contribution is **opt-in, local/manual only** — *Keep private* (default) / *Export* /
  *Contribute anonymously* (generates an anonymized payload to **copy**; no backend, no
  email exposure, no auto-publish).
- **Zero network calls** beyond the cookieless analytics beacon and explicit user exports.
- **No fake AI, no fake live data, no telemetry/tracking of individuals.** localStorage stays
  on-device until the user exports or (Phase 2) connects an account.

---

## 5. Testing & acceptance

- **vitest:** route-suggestions mapping + keyword hints; export markdown/json shape;
  storage round-trip + versioning; stage-upgrade logic (`'question'`→`'case-file'`).
- `astro check` 0/0/0 · `npm run build` green · Playwright walkthrough of the full flow
  (intro → card → export → archive) with animations frozen.
- **Acceptance** = owner spec §17, adapted: a user can complete G1 and produce/export a
  Signal Card in 5–10 min; choose any next line; see the archive and understand stages;
  no card is publishable without moderation; nothing claims proof.

---

## 6. Branching / merge order

Phase 1 work needs the generalized `[line]/[station].astro` renderer from **`feat/line-k`
(PR #22)**. This branch (`feat/g1-initiation`) is **stacked on `feat/line-k`**.
Merge order: **line-k → g1-initiation** (or merge #22 first, then rebase).

---

## 7. Phase 2 outline — identity bridge (for continuity, not built yet)

Per `docs/INTEGRATION-data-snack.md` (binding):

- Transport **Option A** — Firebase client SDK against project `data-snack`, **no datavism server**.
- `/connect`: email → `requestMagicLink({app:'datavism'})` → on `?token` →
  `redeemMagicLink` → `signInWithCustomToken` → read `crew/{uid}` → **import & keep
  `passport.codename`** (never regenerate). Handle returning-connected-user.
- Onboarding/progress → `setDatavismProfile` (Bearer Firebase ID token) with the full
  `{ line, enrolledLines, completedStations, cohortIds }` (replaces the whole object).
- On connect, **migrate** local Signal Cards / completedStations into the account.
- **External blocker:** paste `PUBLIC_FIREBASE_*` (from data-snack's `.env`) into datavism's `.env`.
- Keep `docs/INTEGRATION-data-snack.md` in sync with the data-snack mirror on any contract change.

## 8. Phase 3 outline — GHOST live agent (own design cycle)

- Needs a **secure proxy** for the NVIDIA NIM key (browser can't hold it). Proxy-location
  decision deferred: Vercel function vs data-snack Cloud Function vs Supabase Edge Function.
- "Learning" = conversation memory + retrieval over curriculum/case canon; scoped, cost-
  bounded, safety-reviewed. Designed separately when we reach it.
