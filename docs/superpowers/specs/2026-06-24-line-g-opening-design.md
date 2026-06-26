# Line G Opening — "The Descent" — Design Spec (flagship slice)

**Date:** 2026-06-24
**Status:** Design direction approved in brainstorming; pending written-spec review.
**Project:** datavism.org
**Scope:** ONE flagship vertical slice — the reimagined opening of Line G ("THE FOLDER", G1). It proves the experience bar before the pattern is templated across G2–G5 and the other lines.

---

## Why this exists / the bar

Today Line G is five static text-and-checklist pages; only G1 has interactivity, and that is an 8-step **form wizard** ending in a Signal Card. That reads like *"a Python bootcamp with darker colours"* — exactly what the Manifesto forbids. The bar, set by the owner and the Manifesto:

- It must **knallen** — or no one comes on board. This is a conversion requirement, not polish.
- "Knall" is **immersion + strong dramaturgy** — the way low-budget indie games (Papers Please, Her Story, Obra Dinn, Disco Elysium) hit hard through atmosphere, voice, pacing and mechanics — **not** flashing effects, animation-as-spectacle, or gamified gimmicks. Effects are allowed only when deliberate, never as decoration.
- Register is the **Manifesto's**: serious, political, empowering. The user is not an audience to entertain; they are someone being equipped to *track back*. *"Most people feel the system. Few can inspect it. That is the imbalance." / "They track you. Learn to track back." / "No outrage without an artifact."*

**Anti-patterns, explicitly ruled out in this brainstorm:** browser-fingerprint "we-see-you" reveals; true/false wager quizzes; any "trick played *on* the user". The user is the investigator, never the mark.

## The one-line goal

Take one person, in ~2–3 minutes, from **feeling** a system to **inspecting** it — conducted by GHOST, ending with a real artifact (the seed of a Case File) that carries their codename. They leave having done real work, *not because the interface glowed*.

---

## The core shift

Today: a multi-step **form wizard** — discrete screens, "Next" buttons, lesson chrome. That break *is* the Coursera tell.

The slice replaces it with **one continuous, diegetic, dramaturgically-paced experience**. The owner's central requirement: **the moment the user has a concrete question, it must flow seamlessly onward into investigating** — no screen-break, no "Lesson 2 of 5". *The seamless flow is the feature.* Effects are not.

## The experience — dramatic arc

1. **The Descent.** You do not land on a homepage; you go *down* into the machine room / the Underground. The surface **is** the world — a terminal, an opening file — not LMS chrome. Atmosphere by reduction: dark, GHOST's cadence, a low hum, a keystroke. Not a fairground.
2. **GHOST engages you as a character, not a form.** A dialogue with weight. It asks what brought you here. Your input shapes the file — it matters.
3. **The blank-slate path is the MAIN path.** Most people draw a blank at first. GHOST pushes back one beat (keeps them out of pure passivity — owner-confirmed this is *good*), then lays down concrete, **real** threads to pull. It never dead-ends.
4. **The crystallization seam.** As you and GHOST sharpen it, the vague feeling becomes a concrete, **testable question** — and at that instant the experience shifts gear with no screen-break: the question lands at the head of a **case file that opens in front of you.** The file opening *is* the transition. Dramaturgically: "now the work begins."
5. **The first real move flows from it.** GHOST: *"A question without a source is a wish."* The file wants its first source. It continues — no cut, no button — into identifying the first real, public evidence trail.
6. **The artifact is the diegetic progress.** No points, no badges. The case file **fills visibly as you work**. At the end you hold something real with your codename — the first entry in the public protocol.

## GHOST as character

- **Voice** (existing system prompt): precise, calm, slightly uncanny, unsentimental, method-first. The Disco-Elysium lesson — **the voice carries the experience**, text + cadence over visuals.
- **Manner: slightly resistant, then generative.** On "suggest something", GHOST resists one beat, then offers concrete, real threads. It never refuses into a dead-end. (Today's prompt over-refuses; **left as-is for now per owner** — the brief resistance is functional; finetune later.)
- **Boundary** (Manifesto): GHOST guides and suggests but **returns ownership** — *"three threads worth pulling; which one bothers* you*? You choose, then* you *pull."* Assists, never absolves.

## The case mechanic — how "real" stays real

Owner choice: **own question AND curated real launchpads** ("Option 3").

- **Curated launchpads (main path).** A small, honestly-curated set of real systems-that-bother-people, each pre-researched with a **vetted, real, publicly-accessible source/dataset**. GHOST offers these as its "suggestions". Real source guaranteed, free, fully scripted. *(Content dependency — see below.)*
- **Own question (for those who arrive with one).** Free-text suspicion → GHOST sharpens it to a testable question → GHOST shows the **real terrain** for that kind of question (registries, datasets, archives, with real examples).
- **The real thread on YOUR specific question is the connect reward.** The scripted opening is free for everyone (no login, no cost, never fails). **Connecting unlocks live GHOST** pulling the first real thread on the user's *own* question. This honours *"Bring the question"* and turns the auth-gate (already shipped) into a *reason*, not a wall.

## Free vs connected (honours the shipped auth)

- **Free, scripted, for all:** the whole opening through to the Signal Card. Deterministic, instant, reliable, identical-quality every run — it can never 503 or cost money. This is the conversion surface; it must reach un-logged-in first-time visitors.
- **Connected = the reward:** live GHOST (the already-built, auth-gated, retry-hardened `/api/ghost`) reacts to *your* question and pulls the first real thread. Requires the owner's pending dedicated Gemini key + spend cap before any production key lands.

## Diegetic progress & the artifact

- **No points, badges or streaks** (Manifesto: *"No fake social proof"*; vision: *ship-to-earn, not login-streaks*).
- The **case file fills as you work** — receipt/stamp aesthetic (the storyworld's ticket/receipt motif). It *is* the progress indicator, diegetically.
- **Output = the existing Signal Card, reframed as the seed of a Case File:** *"This is what I asked. This is how I'd check it. This is what's uncertain. This is the next step."* — with the user's **codename**. Reuse the existing Signal Card data model, `localStorage` persistence and export (md/json/png); rebuild the **flow and shell** around them, not the artifact.

## Craft principles (the indie-game knall, named — so a reviewer can hold the build to them)

- **Diegesis** — the world is the interface (terminal / machine room / case file), not LMS chrome.
- **Voice & pacing** — GHOST's writing and rhythm carry it; each beat earns the next; no filler.
- **Method = mechanic** — asking, sharpening, sourcing *are* the interactions (as stamping is the mechanic in Papers Please).
- **Consequence** — the user's inputs persist into the file; choices matter.
- **Restraint** — silence, space, type, one well-placed sound. Effects deliberate, never decorative.
- **Seamless flow** — the question's crystallization opens the file with no screen-break. The owner's central requirement.

## What's reused vs rebuilt

- **Reuse:** `SignalCard` component, `storage.ts`, export helpers, the `/api/ghost` proxy (auth-gated, retry-hardened, context-trim-fixed), the identity/connect bridge.
- **Rebuild:** `G1InitiationFlow` → a continuous diegetic experience ("The Descent"); a new diegetic shell/atmosphere layer. Drop the wizard "Next"-button framing and lesson chrome **for this slice**.
- **Do not touch:** G2–G5 (templated later), the other lines, the magic-link bridge, the Manifesto/legal pages.

## Tech constraints

- Astro 6 static + Svelte 5 islands; **no GSAP** (CSS + IntersectionObserver, per the existing perf decision). Motion via CSS/JS, restrained.
- **Sound:** optional, **off by default**, one tasteful cue, user-toggle; never autoplay noise.
- **/api/ghost** is auth-gated (per-uid) + reliable (retry + context-trim). Live GHOST in the opening = connected users only.
- **Honesty:** real sources or none; world-claims cited; no fake stats/feeds; any client-side data is never stored or sent.

## Scope boundary of THIS slice

**In:** the free scripted opening end-to-end — Descent → GHOST conducts (curated launchpads + own-question, blank-slate first-class) → question crystallizes (the seam) → first real move (curated case hands a real source; own-question shows real terrain) → Signal Card (seed of Case File) → the connect hand-off point.

**Out (next iterations):** the live-GHOST connected thread-pull itself (fast follow); G2–G5; full sound design; the curated-case library beyond a small launch set.

## Content dependency (flagged, not hand-waved)

The curated launchpads require **real, vetted, publicly-accessible sources** — authoring/research work, not code, and **load-bearing for honesty**. The slice needs a small launch set (≈3–5 real cases, each with a checked source). Authoring these to the honesty standard is a content task to schedule alongside the build; the build must not invent sources to fill gaps.

## Out of scope / future

- Templating the pattern across G2–G5 and the other lines.
- The depth of the connected live-GHOST investigation.
- Full sound/score design; ARG layers; the parked "personal confrontation" engine as its own later station.

---

## Open questions (to resolve before or during planning)

1. **The launch-set cases** — which 3–5 real systems + vetted sources seed the curated launchpads (content, owner/researcher input).
2. **Visual/diegetic shell fidelity** — how far the "terminal / opening file" aesthetic goes in this first slice vs a later art pass (a visual-mockup round may be worth it here).
3. **The connected thread-pull** — included in this slice or the immediate fast-follow.
