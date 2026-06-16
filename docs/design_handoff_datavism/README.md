# Handoff: DATAVISM — Website & Product Surfaces

## Overview
DATAVISM ("the data underground") is a **case-first data-activism lab for the AI era**. The product is framed as an **Evidence Engine**: a transit-map "network" of **5 lines × 5 stations = 25 stations**, all converging at a central **GHOST interchange**. Learners ("Datavists") ride a line, complete stations, and produce **Case Files** (public evidence artifacts).

This bundle contains design references for the full first-pass site + product surfaces:
Landing, Onboarding, Progress Map (dashboard), a reusable Network Map component, a Line overview, a Station/Mission page, a Case File page, a public Case File index ("The Underground"), and the Manifesto.

The product is **pre-launch** (waitlist open, only Line G / station G1 is "live"; everything else is "planned/locked").

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes that show the intended look, copy, and behavior. They are **not production code to copy directly**.

They are authored as "Design Components" (`*.dc.html`) — single self-contained HTML files that open in any browser. Each file embeds its markup (inline styles only), a small logic class, and pulls fonts from Google Fonts. Treat the rendered result and this README as the source of truth.

**The task is to recreate these designs in the target codebase.** The canonical DATAVISM repo is **Astro 5 + Svelte 5 + Tailwind 4** (see the brand/design-system project) — recreate the screens there using its established patterns, tokens, and content collections. The curriculum data already exists in the repo at `src/lib/curriculum/lines.ts` and `src/content/stations/*` — wire the UI to that, don't hardcode.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, copy, and interactions are intended as shown. Recreate pixel-closely using the codebase's libraries. The only deliberately "example" content is the curriculum/case-file *copy* (illustrative), and the waitlist submit (currently localStorage only — wire to the real endpoint).

---

## Design Tokens

### Color — surfaces & ink
| Token | Hex | Use |
|---|---|---|
| bg | `#060608` | Page background (near-pure black, slight cool tint) |
| panel | `#0e0f14` | Cards / panels |
| panel-2 | `#0b0c10` | Insets, map board, alt panels |
| line | `#20222b` | Default 1px border (low contrast) |
| line-2 | `#2c2f3a` | Hairline / input borders |
| line-3 | `#343843` | Slightly stronger border |
| ink | `#f2f1ea` | Primary text (warm off-white) |
| ink-2 | `#cfd2c9` | Body text |
| ink-3 | `#a7ada3` | Secondary text |
| ink-4 | `#6b7280` | Muted / mono captions |
| ink-5 | `#565c66` | Disabled / separators |
| eyebrow-green | `#6f8f76` | Dim green mono eyebrows |

### Color — brand accents (canonical)
| Token | Hex | Role |
|---|---|---|
| signal-yellow | `#ffd23f` | **Primary UI accent** — buttons, links, highlights, hero wordmark |
| ghost-green | `#39ff14` | Neon ghost, "live / online / terminal" signals, `>` prompts |
| magenta | `#ff2a6d` | Secondary pop / the logo's drop-shadow |

### Color — the five lines (canonical, do not change meaning)
| Line | Name | Hex |
|---|---|---|
| G | GHOST / Foundation | `#3df07a` |
| K | KEY / Tracking & OSINT | `#f5b700` |
| R | ROOK / Economy & Power | `#ff4d4d` |
| B | BITE / Feeds & Behavior | `#4d8dff` |
| V | VESPER / Climate & Future | `#b48cff` |

> Note: signal-yellow `#ffd23f` (UI accent) is intentionally decoupled from line-K gold `#f5b700` and from line-G green.

### Typography
- **Display / wordmark / big headings:** `Martian Mono`, weights 700–800, `letter-spacing: -0.04em` (wordmark) to `-0.05em` (huge). Uppercase for headings.
- **Body / labels / UI / everything else:** `Spline Sans Mono`, weights 400–700.
- Both via Google Fonts. The brand is intentionally **all-monospace** (the logo wordmark is mono).
- Mono eyebrows: `// LABEL`, uppercase, `letter-spacing: 0.14em–0.22em`, color ink-4 or an accent.
- Separator glyph: middle dot `·`. Prompt glyph: `>`. Blinking cursor: `▋` (1.1s step blink).

### Spacing / shape
- Loose 4-based scale; common section padding `40–60px` vertical, container side padding `28–30px`.
- Container max-widths: marketing/landing `1560px`; dashboard `1640px`; reading pages (Station/Case File/Manifesto) `760–1120px`.
- **Sharp corners** — `border-radius: 0` for cards, buttons, chips, inputs, panels. The only round elements are status dots, station nodes (circles), and the ghost roundel.
- Panels often get a **2–3px colored top/left border** in the relevant line/accent color.
- No drop shadows; "elevation" is a colored neon glow or a hover `translateY(-3px/-4px)`.

### Motion
- `prefers-reduced-motion: reduce` disables all of the below.
- Map line **draw-on**: `stroke-dashoffset var(--len)→0`, 1.7s `cubic-bezier(.65,0,.2,1)`, staggered per line.
- Map **data packets** (live lines only): dashed overlay path animating `stroke-dashoffset 0→-480`, 7s linear infinite.
- Ghost interchange: pulse ring (`scale + fade`, ~2.8s) + slow rotating dashed ring (22s).
- Scroll reveals & subtle parallax on the landing use **GSAP + ScrollTrigger** (CDN). Pattern: `gsap.from(...)` with ScrollTrigger so that if GSAP fails to load, content stays fully visible (never pre-hidden in CSS).
- Hover: cards `translateY(-3/-4px)`; links fade ink-3→accent; nav underline grows from 0.

---

## The Signature Asset: Network Map

**`NetworkMap.dc.html` is the single reusable map component** — recreate it ONCE and reuse it across Landing, Progress Map, Line overview, Onboarding, and for marketing/poster/OG exports. This is the brand's key visual ("one system, many expressions, but one data-truth").

- An **octolinear transit diagram** (45°/horizontal/vertical segments, rounded corners r=26) on a faint 40px grid, `viewBox 0 0 1440 760`, scales to container width.
- 5 lines route from a terminus, bend once, and converge at the **GHOST interchange** (center `720,470`): a neon-green outlined ghost (magenta drop-shadow) inside a dark roundel with pulse + rotating dashed ring, labeled `THE GHOST / CONVERGENCE · ALL LINES`.
- Each line = a casing (dark, 16px) + colored stroke (7–9px) + optional bright packet overlay on "live" lines.
- 25 station nodes with labels (code + title). Node geometry is fixed (see the `GEO` table in the component source).

**Props (recreate as component props):**
| Prop | Type | Default | Effect |
|---|---|---|---|
| `statuses` | object `{stationId: status}` | `{}` (falls back to per-station default) | Per-node marker style |
| `selected` | string (station id) | null | Highlights node with an accent ring |
| `onSelect` | fn(id) | — | Click handler per node |
| `liveLine` | string (`g`/`k`/…) | `g` | Which line shows flowing packets |
| `dimInactive` | boolean | `true` | If true, non-live/non-selected lines drop to 0.32 opacity (landing). Set `false` on the dashboard so all lines stay visible. |
| `labels` | boolean | `true` | Show station code+title labels (set `false` for posters) |
| `accent` | color | `#ffd23f` | Selected-ring color |

**Node marker styles by status:** `completed` = green ring + check; `current` = line-color filled ring + glow + pulse; `unlocked` = blue (`#4d8dff`) ring + dot; `open` = line-color ring + filled dot; `announced` = line-color hollow ring; `locked` = line-color dashed ring at 0.55 opacity. `selected` adds an accent outer ring.

Default station statuses (pre-launch): `g1: open`, `g2: announced`, all others `locked`.

---

## Screens / Views

### 1. Landing — `DATAVISM.dc.html` (width 1560)
- **Chrome:** top utility ticker (28px, scrolling mono fragments incl. `◆ STILL COOKING`, line letters, `WEAPONS OF MASS INSTRUCTION`, `> THE REVOLUTION WILL BE COMPUTED`); header (ghost roundel + `DATAVISM` Martian + `THE DATA UNDERGROUND` sub; nav: Network/Lines/Method/Manifesto + yellow **Join waitlist →** button); fixed corner crop-marks; faint green radial top-glow.
- **Hero (2-col):** eyebrow `THE DATA UNDERGROUND`; H1 `DATAVISM` Martian 800 in **signal-yellow** with a magenta `text-shadow: 0.045em 0.045em 0 #ff2a6d`; tagline `They track you. Learn to track back.`; green terminal line `> The revolution will be computed.▋`; paragraph `You won't learn to code here. You'll learn to command — AI, data, and the right questions — and turn what's hidden into public evidence.`; **waitlist form** (email input + `Join the waitlist →`, validation, success state, localStorage); secondary links. Right column: a terminal "SYSTEM STATUS" panel (`◆ STILL COOKING`, network booting, 5 planned, waitlist open, `you: awake ▋`).
- **The Network:** section 01; the `NetworkMap` (selected/onSelect wired to local state) on a board with a faint giant `DATAVISM` backdrop wordmark (parallax); right rail = selected-station detail panel (line, status badge, code+title, core question, learns, skill, artifact) + Network Key + legend.
- **Five Lines:** section 02; 5 cards, each = line badge + name + motto + core question + system + final artifact + a mini route strip of its 5 stations (clickable → updates the map panel).
- **Method:** section 03 (kicker `// Weapons of Mass Instruction`); "Story is the interface. Skill is the substance."; struck-through old way (Python/SQL/Statistics/ML/Dashboard) vs new way (Question→Data→AI→Verification→Evidence→Intervention); "three questions every station answers".
- **Manifesto teaser, Waitlist band** (`Join the underground` + form), **Footer**.

### 2. Onboarding — `Onboarding.dc.html`
4-step intake with a top stepper (4 dots + `STEP n / 4`). Centered column.
- **Step 0 Welcome:** `YOU ARE THE NODE.` + intro + `Begin intake →`.
- **Step 1 Question:** `What system bothers you?` + textarea (controlled) + 4 example chips that prefill it.
- **Step 2 Choose a line:** K/R/B/V cards (radio-like; selected = colored border + bg + `●`); right side shows the `NetworkMap` with `liveLine`/`selected` = chosen line. Next disabled until a line is picked.
- **Step 3 Ready:** `YOUR FIRST STOP: G1` + summary cards (your question; path `G · Foundation → <chosen line>`) + CTAs `Enter G1 · The Folder →` / `See my map`.
- **State:** `{ step, question, line }`. Back/Next clamp; picking required at step 2.

### 3. Progress Map / Dashboard — `Progress Map.dc.html` (width 1640)
3-column shell (296 / 1fr / 320), stacks < 1180px.
- **Left rail:** Profile (ghost avatar, `GHOST ANALYST`, `LEVEL 12`, XP bar 2,450/4,000); Line Progress (5 bars: G 80 / K 60 / R 40 / B 33 / V 20 %); Case File Progress ring (5/25 = 20%, green arc); Current Mission (`K2 SIGNALS`, view button); Legend.
- **Center:** title `DATAVISM PROGRESS MAP` + the `NetworkMap` in **progress mode** (`dimInactive=false`, `liveLine="k"`, `statuses` = each station's progress) + an inline legend. Clicking a node updates "You are here".
- **Right rail:** "You are here" card (focused station, line color, blurb, mini bar chart); "Recent Case Files" list (CF-07…CF-03 with status).
- **Bottom strip:** `FIVE LINES. ONE NETWORK.` + 3 feature cells.
- Example progress: G1–G4 completed, G5 unlocked; K1 completed, K2 current, K3 unlocked, K4–5 locked; R1/B1 completed, R2/B2 unlocked, rest locked; V all locked.

### 4. Line overview — `Line G - Ghost Foundation.dc.html` (width 1160)
Hero (G badge + `GHOST / FOUNDATION` + motto + core question + meta). Body: 5 station rows (badge, title, status chip, role, artifact; G1 links to its Station page, others locked) + `Start the line · G1 →`. Right rail: the `NetworkMap` (small, `selected=g1`, `liveLine=g`) + "why start here".

### 5. Station / Mission — `Station - G1 The Folder.dc.html` (width 1200)
Hero: breadcrumb, G/G1 badges, `OPEN · LIVE NOW`, `THE FOLDER` (Martian), core question (yellow), learner outcome, a 5-node line strip (G1 active). Body (2-col, rail sticky): canonical station sections `// SIGNAL`, `// METHOD` (4 numbered steps), `// TOOLING` (chips), `// VERIFICATION` (3 checks), `// BRIDGE`. Rail: "Your Artifact" (Case File #1), **interactive Self-Check** (4 checkboxes, progress bar, localStorage; CTA flips to `Open Case File #1 →` at 4/4), Sources. Footer: next stop G2 (locked).

### 6. Case File — `Case File - Border Signal Leak.dc.html` (width 1120)
Published-evidence layout. Hero: classification bar, `CF-07 · KEY / TRACKING & OSINT · PANOPTICON FILE · PUBLISHED`, `BORDER SIGNAL LEAK` (Martian), dek, hook stat `42` + sub-stats. Body (article + sticky rail) follows the **10-part Case File canon**: 01 Question, 02 Context, 03 Sources, 04 Method, 05 AI Use (callout), 06 Verification (table with VERIFIED/PARTIAL/UNVERIFIED), 07 Findings (horizontal bar chart of trackers), 08 Limits, 09 Public Output (download chips), 10 Next Questions. Rail: "At a glance" (curator, severity meter, artifact, sources/read) + **Copy citation** button (→ `Copied ✓`). Footer: prev/next case file. Marked as illustrative example.

### 7. The Underground (Case File index) — `The Underground - Case Files.dc.html` (width 1320)
Hero `THE UNDERGROUND` + "5 of 25 published". Filter chips `ALL / G / K / R / B / V` (interactive, filter state). Responsive card grid (`auto-fill, minmax(290px,1fr)`): each card = line badge + CF id + status chip + title + one-line finding + curator + severity dots; top border in line color; locked cards dimmed. CF-07 links to the Case File page.

### 8. Manifesto — `Manifesto.dc.html` (reading width 780)
Long-form v0.2. Hero `THEY TRACK YOU.` + the signal litany → "the machine only needs to measure you." Sections: The Problem, The Old Literacy, We Are Not Here to Teach Coding, DATAVISM Is an Evidence Engine (with Case File definition block), The Lines (5), GHOST, Our Rules (No-rules list), What We Build (Maps/Methods/Artifacts 3-col → Datavists), What We Are Not / Why This Matters, The Invitation, closing "The Signal" (paired lines) → `Turn hidden systems into public evidence.` + waitlist CTA.

---

## Interactions & Behavior
- **Waitlist** (landing hero + closing band + header button): email regex validation (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), red inline error, success state `◆ You're on the list…`, persisted to `localStorage['dv_waitlist_email']`. **Wire submit to the real endpoint.**
- **Network map:** click node → select (drives the detail panel / "you are here"); hover highlights; line cards / key buttons also select.
- **Onboarding:** step machine; example chips prefill the textarea; line selection gates "next".
- **Station self-check:** 4 toggles persisted to `localStorage['dv_g1_checks']`; progress bar + CTA label react to completion.
- **Case File:** copy-citation to clipboard with 2s "Copied ✓" feedback.
- **Underground:** line filter chips re-filter the card grid.
- **Responsive:** every multi-column layout collapses to single column at the breakpoints noted per file (820–1180px).

## State Management
- Landing: `{ selected (station id), hovered, subscribed, error }`.
- Onboarding: `{ step, question, line }`.
- Progress Map: `{ focused (station id) }` + derived `progressStatuses`.
- Station: `{ checks: bool[4] }`.
- Case File: `{ copied }`.
- Underground: `{ filter }`.
- All "live" data (progress %, statuses, case files, station content) is **example data** — replace with the repo's curriculum collections + user progress.

## Assets
- **Logo / ghost:** inline SVG in every file (neon-green `#39ff14` outlined ghost, magenta `#ff2a6d` 3px drop-shadow, two green eyes). Canonical source SVGs live in the DATAVISM repo at `public/brand/svg/g3-neon-ghost-*` (icon + wordmark, light/dark). Use those.
- **Fonts:** Martian Mono + Spline Sans Mono (Google Fonts).
- **Icons:** all hand-drawn inline SVG (checks, locks, lock/eye, bars). No icon library.
- No raster images are required by the layouts (the OG/poster images are separate brand assets).

## Files
All in this folder (open any in a browser to view):
- `DATAVISM.dc.html` — Landing
- `Onboarding.dc.html` — Onboarding flow
- `Progress Map.dc.html` — Dashboard
- `NetworkMap.dc.html` — **shared map component** (recreate once, reuse)
- `Line G - Ghost Foundation.dc.html` — Line overview
- `Station - G1 The Folder.dc.html` — Station / mission
- `Case File - Border Signal Leak.dc.html` — Case File
- `The Underground - Case Files.dc.html` — Case File index
- `Manifesto.dc.html` — Manifesto

### Screenshots
`screenshots/` contains a reference capture of each screen (01–09, matching the files above) so a developer can see the intended result without opening the HTML.

> The `.dc.html` files share an inline runtime (`support.js` is auto-included when opened). You don't need that runtime in the target app — read the markup + logic as a spec and rebuild with your framework. The map's exact node coordinates live in `NetworkMap.dc.html` (`GEO` and `ROUTEPTS`).
