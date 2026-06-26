# GHOST Guidance Layer — Design

**Goal:** Lower the onboarding steepness of the operation loop without lowering GHOST's
method rigor. Beginners who lack a clear finding — or don't know what "unverified" means —
currently bounce because GHOST hard-blocks and gives no early win. We add a guidance layer
that scaffolds the *process* while holding the binding honesty line: **GHOST orients, it
never investigates; method-certified is never fact-verified; the finding stays the user's.**

## Validated technical premise

Live grounded recon works with this exact recipe (tested 2026-06-27 against the prod key):
- Model `gemini-2.5-flash` (NOT flash-lite — flash carries the search tool reliably)
- `tools: [{ google_search: {} }]`
- `generationConfig.thinkingConfig.thinkingBudget: 0` (else thinking eats the output budget → thin replies)
- `maxOutputTokens: ~450`, `temperature: 0.3`
- Strict 3-line structured system prompt → clean `DOES / SHOWS / ANGLES`, no named answer.

## Three touch points

### 1 · RECON on the DATA step (source orientation)
On entering step 2 (source), the UI auto-loads a GHOST recon card:
- Always shows the curated per-case `source.howTo` as a reliable base (instant, free).
- Layers a live grounded orientation on top: `DOES / SHOWS / ANGLES`.
- Visible label: "GHOST orients — the finding is yours."
- Honesty guard (in the prompt AND verified by shape): never name a specific entity/figure
  as the answer. Orientation only.
- Fallback: if the call fails/times out/returns empty, the curated `howTo` stands alone —
  the card is **never** empty or broken.
- Cached per case on the client (one call, reused while the overlay is open).

### 2 · COACH + TEMPLATE on the EVIDENCE step
- The blank form gains a fill-in-the-blank template scaffold (usable or ignorable).
- Short inline definitions for "finding" and especially "uncertainty", each with a worked
  example **from a different case** (teaches without solving this one).
- "Stuck? Ask GHOST" → a coach that reacts to the user's *partial draft* and names the gap
  ("your finding names no specific entity yet") without filling it.

### 3 · Softer failure = progress, not rejection
When GHOST blocks, reframe the verdict as "2 of 3 method axes solid" with the single
remaining fix highlighted + a concrete next action. The bar does not move; the feeling
shifts from "no" to "one step away." (Reuses the existing 3-axis `notes`.)

## API

New self-contained endpoint `api/guide.ts` (modeled on `api/ghost.ts` / `api/certify.ts`):
- `POST { mode: 'orient' | 'coach', ... }`
- `orient`: `{ source: {title,url}, question }` → `{ does, shows, angles }` (grounded flash).
- `coach`: `{ draft: Partial<Finding>, question }` → `{ nudge: string }` (flash-lite, no grounding;
  reacts to the gap, never supplies the finding).
- Same rate-limit shape as the other endpoints (Upstash preferred, in-memory fallback,
  local dev unlimited). Pure helpers (prompt builders, parsers) exported for unit tests.

## Honesty — binding, tested in code
- `orient` output must not assert a specific named entity/figure as *the answer*; the prompt
  forbids it and the parser keeps only DOES/SHOWS/ANGLES structure.
- `coach` points at the missing axis; it must not author the finding.
- Every guidance surface carries the "orient, don't investigate" framing in the UI copy.
- Nothing here weakens certification: GHOST still judges the method strictly at SUBMIT.

## Out of scope
- No change to the certification bar or the 3-axis method test.
- No server-side scraping of source pages (SPAs return empty shells); we use search grounding
  + curated content instead.
