# The Command Center — MVP — Design Spec

**Date:** 2026-06-25
**Status:** Design direction approved (owner); pending written-spec review.
**Project:** datavism.org
**Reframes:** the G1 "Descent" opening (its atmosphere, the verified cases, and the engine are reused). Tentatively the new product spine; the existing transit map / station pages are left **untouched alongside** this MVP.

---

## The bar (unchanged, restated)
- It must **knallen** — immersion + strong dramaturgy (indie-game craft), not effects/gimmicks.
- Register = the Manifesto's: serious, political, empowering. The user is the investigator.
- Honesty is load-bearing: real sources or none; we certify **method, never truth**.

## Why this is a crystallization of the DNA
Manifesto, verbatim: *"We build maps. Not maps of cities, but maps of systems."* The Command Center **is** that map. *"No outrage without an artifact."* An operation only closes on a real, method-certified finding. *"A Non-Profit Digital Art Project."* The growing record of closed operations is the collaborative artwork.

## The core loop
**Discover** (the map) → **Claim** an operation → **Investigate** (real public data) → **Submit a structured finding** → **GHOST certifies the METHOD (not the truth)** → **Operation closes** → **enter the DATAVISM history.**

## The keystone: "Done" = method, not truth
GHOST checks the submission against the **method bar**, not correctness:
- Is a **real, relevant public source** cited?
- Does the **claim plausibly follow** from that *kind* of data (not "is it true")?
- Is it **specific** (a concrete record/number/finding), not a vague mood?
- Is **uncertainty marked**?

→ **certified** (in-character confirmation) or **not-yet** (specific, in-character feedback on exactly what's missing). This is the **guided GHOST** the owner has wanted — it guides *and* certifies in one. "Certified" means *investigated properly*, never *true*.

---

## MVP scope — the smallest gripping vertical slice

**In:**
1. **The Command Center boots up (no door).** A standalone route. The world map assembles, the real cases ignite across the globe, GHOST's voice frames the stakes **during** the boot. The map carries the wow — no separate skippable cutscene.
2. **One guided first operation (Line G tutorial).** The map routes a new user to a single, maximally-scaffolded operation (no free selection yet — instructional design, gradual release). **Proposed first case:** a DACH-legible one with a concrete, pullable finding — the **German Lobbyregister** (`lobby-register-de`). (Owner confirms.)
3. **The operation loop, end to end:** Briefing → **GHOST guides** you to pull the real public source → you submit a **structured finding** (reuse the Signal Card model: question + source + evidence + uncertainty) → **GHOST method-check** → **close** → **enter the history** (codename, transparent).
4. **GHOST is live here** (certification + guidance) via the existing auth-gated, reliability-hardened `/api/ghost`. Rate-limited free taste; connect to go deeper.

**Out (next iterations):** free case selection from the map; the other ~27 cases as playable operations; seasons / new-cases-appear; the other four lines; peer review; the full collaborative-artwork history rendering; bringing your own question.

**Standalone:** the MVP lives on its **own route**; the existing transit map and station pages are untouched. If the Command Center proves itself, it becomes the spine and supersedes them later — a separate, owner-gated decision.

---

## Components / architecture
- **Boot-up + map** (Svelte island): CSS/JS-driven assembly (no GSAP), cases as points sourced from `src/lib/line-g-opening/cases.ts`, GHOST's voice from an authored copy module. Restraint over spectacle.
- **Operation flow** (Svelte): briefing → source step (the case's real source) → structured-finding form (reuse the Signal Card data/model + `src/lib/signal-cards/storage.ts`) → method-check result → close/history.
- **GHOST method-check (NEW — the core new piece):** a method-eval capability. A new mode on `/api/ghost` (or a sibling endpoint) that takes `{ case context, the user's structured submission }` and returns a **structured verdict** `{ certified: boolean, feedback: string, missing: string[] }`. Live AI (Gemini), auth-gated + rate-limited (reuse the built infra). The logic is mostly **prompt design + a structured-output contract** + a thin handler.
- **History (MVP-light):** a record of the closed/certified operation with the codename, persisted (reuse Signal Card storage + a `certified`/`closed` flag). The full shared/collaborative history is later.

## The GHOST method-check — contract (the new core)
**Input:** the operation (`caseId`, the investigative question, the expected real source) + the user's structured submission (finding/claim, cited source, the specific evidence/data point, stated uncertainty).
**GHOST evaluates** against the method bar above (real source / claim-follows-from-data / specific / uncertainty-marked).
**Output (structured):** `certified: true` + short in-character confirmation, OR `certified: false` + specific in-character feedback (e.g. *"A claim without a source is a wish."* / *"That's a mood — what record supports it?"*).
The prompt must be a **fair, hard-to-game method-gate** that does not reject legitimate findings — getting this right is the make-or-break; budget iteration on the prompt.

## Honesty (load-bearing)
- **"Certified" = method certified, NEVER "fact verified."** The UI and the history must say so; sources stay visible, uncertainty stays marked.
- The AI judge is imperfect — certification is a **method-gate, not an oracle.** A peer layer (later) strengthens it. State this honestly in the product.
- Real sources only (the verified set; the "needs browser check" cases stay out until verified).
- No fake history / social proof — the record shows real, method-certified investigations only.

## Visual direction (flag a mockup round)
Command-center, clean-futuristic / subtle cyberpunk, datavism palette (`--color-bg`, `--color-ghost`, `--color-line-*`, `--font-mono`). The world-map boot-up and the operation surface are visual — **worth a mockup round** (the brainstorming visual companion) before the shell is built.

## Reuses
`src/lib/line-g-opening/cases.ts` (28 verified cases), the Signal Card (`src/lib/signal-cards/*`), the flow-engine bits, `/api/ghost` (auth + retry + context-trim), the identity/connect bridge, the verified-case research (`.git/sdd/approved-cases.md`).

## Open questions
1. The first guided case (proposed `lobby-register-de`; owner confirms).
2. Visual fidelity / map style (mockup round).
3. The structured-finding form — how much it reuses the Signal Card steps vs a leaner operation-specific submission.
4. Where the connect/login wall sits within the loop (free taste → connect when).

## Hard parts (honest)
- **The GHOST method-check quality** — prompt design so it is a fair, non-gameable method-gate that does not reject legitimate work. The make-or-break.
- **The boot-up actually gripping** — craft, verified by eye + mockups, not a gimmick.
