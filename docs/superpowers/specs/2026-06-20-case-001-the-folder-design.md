# Case #001 — THE FOLDER (design spec)

**Date:** 2026-06-20 · **Status:** approved (brainstorm), implementation pending
**Drives:** ADR 002 (case-first; next public step = Case #001 — THE FOLDER; one CTA → LINE G)
**Source data:** `experiments/folder-spike/VERIFY-G1.md` (verified), `src/content/stations/the-folder.md`
**Reference renderer:** `src/pages/underground/[slug].astro` + `src/lib/caseFiles.ts`

## Goal

Publish `CF-01 "The Folder"` as a full, public investigation page at
`/underground/the-first-folder`. It's the documented-system **exposé** that proves
the method and funnels the reader into LINE G (where they pull *their own* file).
Currently `CF-01` exists only as an index card with no detail page.

## Decisions (from brainstorm)

1. **Framing = system exposé**, not first-party capture. We did NOT run a fresh
   capture; we synthesised public primary sources (the leaked Xandr marketplace
   file, ICCL RTB report, IAB taxonomy). The first-party part is the reader's own
   G1 mission. The page must say this plainly (honesty rule).
2. **Verbatim sensitive segment names shown**, grouped, with a GDPR Art. 9 frame
   ("special category — illegal to process without consent — traded anyway; noyb
   complaint 2024"). All names are publicly documented (The Markup / netzpolitik).
3. **Structure = approach B:** extend the `CaseDetail` type with exposé-specific
   blocks; render them conditionally. CF-07 (capture) keeps working untouched.
4. **One CTA** (ADR): the case's primary action is **→ start LINE G** (`/line-g/the-folder`).

## Scope

In: the CF-01 detail page (content + type extension + conditional rendering), the
index card update, the funnel CTA. **Out:** deepening LINE G (G2–G5) — a separate
later spec.

## Content model (`src/lib/caseFiles.ts`)

Make capture-only fields optional; add exposé fields. CF-07 sets the first group;
THE FOLDER sets the second.

```ts
// becomes optional (CF-07 / capture cases):
hookStat?: { value: string; label: string }
subStats?: { n: string; label: string }[]
findings?: { name: string; tag: string; tagColor: string; count: string; w: string }[]
prev?: { id: string; title: string }

// new (exposé cases):
scale?: {
  official:  { n: string; label: string }   // "~1,500"  · IAB Audience Taxonomy 1.1
  actual:    { n: string; label: string }   // "650,000" · one leaked marketplace (Xandr, 2023)
  frequency: { n: string; label: string }   // "376×/day" · per person, EU (ICCL 2022)
}
segments?: { group: string; gdpr9?: boolean; items: { name: string; src: string }[] }[]
suppliers?: { total: string; named: { name: string; note?: string }[] }
legalNote?: string
cta?: { label: string; href: string }
```

## CF-01 content (all from VERIFY-G1.md)

- **id** `CF-01` · **slug** `the-first-folder` · **line** `g` · **artifact** `GHOST File`
  · **published** `20 JUN 2026` · **severity** `4` · **titleLines** `['THE','FOLDER']`
  · **sourcesRead** `5 sources · ~5 min`
- **dek:** "650,000 ways to label you — health, politics, addiction — bought and
  sold as categories. One leaked marketplace. The file isn't hypothetical. It's a product."
- **scale:** official `~1,500` / "IAB Audience Taxonomy — the official catalog";
  actual `650,000` / "one leaked marketplace · Microsoft Xandr, 2023";
  frequency `376×/day` / "your profile broadcast per person · EU, ICCL 2022".
- **question:** "How many ways can the ad-data market label a person — and is it even allowed to?"
- **context:** the ad-profiling system; official IAB ~1,500 vs the 650,000 in one
  leaked real marketplace; includes health/political/addiction labels illegal to trade.
- **sources:** The Markup (650k); netzpolitik (Xandr 650.000); ICCL/Ryan (RTB scale);
  IAB Audience Taxonomy 1.1; noyb Xandr complaint (2024). (numbered 01–05)
- **method (honest):** "No fresh capture. This is the documented system, read from
  primary sources: the leaked Xandr file (2023, The Markup + netzpolitik), the ICCL
  RTB report, the IAB taxonomy. Every number cross-checked against a primary source."
- **aiUse:** "AI clustered and de-duplicated the 650,000-row segment list and drafted
  supplier hypotheses. Every name and number shown was re-checked by hand against the
  source. AI was a co-pilot, never the witness."
- **verify:** 650k VERIFIED (Xandr leak) · 376×/day VERIFIED (ICCL) · health & political
  segments traded VERIFIED (The Markup/netzpolitik) · Art. 9 illegal-yet-traded VERIFIED
  (GDPR Art. 9 / noyb 2024) · "any specific named person was sold" **UNVERIFIED** (— · that's your own file → LINE G).
- **segments** (verbatim; ⚠ = Art. 9):
  - Health ⚠: "Heavy Purchasers of Pregnancy Test Kits", "Depression Medications",
    "Propensity for Depression / Stroke", "Infertility / IVF",
    "HealthRankings › Diabetes Type II", "Opiate Addiction" (The Markup / netzpolitik)
  - Political ⚠: "'Hardcore' Republicans", "'Persuadable' Democrats" (netzpolitik)
  - Vulnerability / addiction ⚠: "Gambling Addiction", "Fragile Seniors",
    "Easily Deflated" (netzpolitik / The Markup)
  - Ordinary (so you trust the rest): "Affluent Millennials", "Dunkin' Donuts Visitors",
    "Past Purchases › Subaru", "Frequent Flyer" (The Markup / IAB)
- **suppliers:** total "93 data suppliers in the file"; named: Oracle (">⅓ of all segments"),
  Acxiom, Foursquare, LiveRamp, Eyeota, Mastercard.
- **legalNote:** "Many of these are 'special category' data under GDPR Art. 9 —
  processing forbidden without explicit consent. Traded anyway. noyb filed a formal
  complaint against Xandr in 2024."
- **limits:** "This proves the categories exist, are real, and are traded — not that
  any one named person was bought or sold. The market is documented; your specific
  file is not public. That's exactly what LINE G teaches you to pull for yourself."
- **publicOutput (honest = source links, not a fake dataset):** "The Markup ↗",
  "netzpolitik ↗", "ICCL — RTB scale ↗", "noyb — Xandr complaint ↗".
- **next:** "This is the file on everyone. The file on *you* only opens if you pull
  it yourself. That's LINE G — start with THE FOLDER."
- **cta:** `{ label: 'Start LINE G → THE FOLDER', href: '/line-g/the-folder' }`
- **nextFile:** CF-07 (border-signal-leak) · **prev:** omitted (it's #001).
- **citation:** "DATAVISM (2026). Case File CF-01 — The Folder. The Data Underground. datavism.org/underground/the-first-folder"

Also: update `CASE_INDEX` CF-01 → add `slug: 'the-first-folder'`, `severity: 4`.

## Rendering (`src/pages/underground/[slug].astro`)

Conditional, additive — CF-07 path unchanged:

- **Hero:** `cf.hookStat ?` existing hook/substats `: cf.scale ?` a scale-contrast
  block (official → actual, big; frequency as a sub).
- **Part 07:** `cf.findings ?` existing host bars `: cf.segments ?` grouped segment
  list (group label + ⚠ Art. 9 chip + verbatim names with source). Below it, the
  `suppliers` line; then the `legalNote` as a red/warning callout.
- **CTA:** `cf.cta ?` a prominent single CTA button (line colour) before the footer.
- **Footer:** `cf.prev &&` guard so #001 (no prev) renders cleanly.

Honest microcopy: the part-09 intro ("plus the raw request log and a one-page
poster…") is capture-specific — gate it so exposé cases show a neutral
"Sources are public and linked" line instead.

## Out of scope / open

- LINE G G2–G5 authoring (separate spec).
- Real downloadable poster/dataset (we link public sources instead — honest).
- Frank review of showing verbatim health/political names: **approved in this brainstorm.**

## Verification

`astro check` 0/0/0 · build green · `/underground/the-first-folder` renders ·
`/underground/border-signal-leak` (CF-07) unchanged · 0 console errors · CTA → LINE G works.
Ship as PR + Vercel preview; **production merge gated on user review** (flagship public page w/ sensitive data).
