# Concept — The Command Center: a world map of real-case "operations"

**Date:** 2026-06-25 · **Status:** Captured vision, EVERYTHING OPEN. Not decided, not built. A strong direction to evaluate when there's bandwidth.

> Captured from a half-distracted but high-signal owner brainstorm. The point of this file is to not lose it.

## Where we actually are (so nothing is misremembered)
- Last build prepared **only the opening of G1 / THE FOLDER** — not the line, not the other stations.
- Exists: a tested flow engine, **~28 fetch-verified real cases** (+ a "needs browser check" list), a Signal Card artifact (reused), and a first shell cut that we BOTH rejected as "a form with a terminal skin".
- All on branch `feat/line-g-opening`. **Nothing live, nothing merged.** Cases + engine are reusable; the rest is sketch.

## The vision (owner's words, sharpened)
A **command center**: a **world map of real cases**. Clean-futuristic / subtle cyberpunk, command-center feel. Each of the 28+ verified cases is a real point on the map.

**The core loop:**
1. **Discover** — the map shows live, real cases (themed per line).
2. **Claim** — you take an **operation** (investigation / intervention) with a clear briefing + a real public data source.
3. **Investigate** — you do the real work against real open data.
4. **Validate & close** — only a **valid result** closes the operation. Then you **enter DATAVISM history**, the case is "closed", credited to you.
5. **Gesamtkunstwerk** — closed cases become part of a growing, collective, living artwork / artistic-research record. New cases surface → "season 2", etc.

## Why this is a crystallization of the DNA, not a departure
- Manifesto, verbatim: *"We build maps. Not maps of cities, but maps of systems."* This IS that map.
- *"No outrage without an artifact."* The operation only closes on a real result.
- *"A Non-Profit Digital Art Project."* The collective, evolving case-history IS the collaborative artwork / artistic research.

## What it solves (the things that kept failing)
- **Knall without cringe:** a command-center world map of real operations grips through clarity, not effects.
- **Gamification that isn't embarrassing:** claim → complete → enter history, bound to **real evidence**, not points/badges. The method IS the mechanic.
- **Instructional design:** Line G becomes the **guided tutorial** — at first the user brings *no* own question; they're walked through scaffolded operations and gradually released into autonomy (claim harder cases → eventually bring their own). Each line = its own theme + cases.
- **Cases become the heart**, not a side-list.

## Reframes this forces (all on the table, owner explicitly opened them)
- The current **transit/network map may be replaced** by the case world-map.
- Station pages → **scaffolded operations** (instructional design), not text walls.
- "Bring your own question" → **deferred**; earned, not the start.
- The "Descent" opening → possibly just a **cinematic door into the command center**, not its own thing.

## The hard problems to crack (be honest — these are the real risk)
1. **Completion validation.** How does an "operation" close on a *valid* result, for a real open-data investigation, **without** a human grader and **without** a fakeable check? This is THE crux (same family as the "how does GHOST actually guide" problem). Options to explore: structured submissions (a finding + a source citation + a checkable claim) judged by GHOST/AI + light human/peer review; tiered difficulty where early (tutorial) operations have deterministic checkpoints and later ones are peer/AI-reviewed; "closed" = peer-validated, not auto-graded.
2. **Scaffolding vs autonomy curve.** What does the first guided operation look like (handheld) vs a season-2 open one?
3. **Scope / MVP.** The full living-artwork-with-seasons is large. What is the smallest version that already grips — e.g. the map + claim + ONE fully-worked guided operation that closes?
4. **GHOST's role.** Guide inside operations (live, the thing the owner keeps asking for) vs scripted scaffolding for tutorial steps.

## Reusable from current work
`src/lib/line-g-opening/cases.ts` (cases), the flow engine, the Signal Card (`src/lib/signal-cards/*`), the verified-case research pipeline (`/.git/sdd/approved-cases.md`).

## Status of decision
Nothing decided. No final curriculum yet — everything open, but strong ideas. Next step when there's bandwidth: decide whether the command center is the new spine, then brainstorm the MVP (map + claim + one closing operation) properly.
