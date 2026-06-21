# DATAVISM Product Spec v0.1 — G1 Interactive Initiation + Signal Archive

**Status:** Draft v0.1  
**Purpose:** Implementation-ready concept for Claude Code.  
**Primary Goal:** Build the first complete DATAVISM product loop: a user enters through G1, creates a personal research artifact, and can optionally contribute it to a collective living archive.  
**Working Title:** G1 — THE FOLDER: Interactive Initiation  
**Related Canon Docs:**

- `docs/curriculum/evidence-engine-v0.1.md`
- `docs/curriculum/line-g-ghost-foundation-v0.1.md`
- `docs/curriculum/line-k-key-tracking-osint-v0.1.md`
- `src/lib/curriculum/lines.ts`

---

# 0. Product Decision

Do **not** prioritize completing the full 25-station curriculum first.

Prioritize a **complete vertical slice**:

> A user can enter DATAVISM, complete G1, create a Signal Card, understand the Evidence Engine, and choose their own next line.

This is the first real proof that DATAVISM works as:

- educational experience,
- artistic research system,
- public evidence practice,
- and living collective archive.

The goal is not to make G1 “a lesson page”.

The goal is to make G1 feel like an initiation into a method.

---

# 1. Core Principle

DATAVISM begins when a private suspicion becomes a public question.

G1 should turn:

```text
I feel watched / manipulated / confused / affected
```

into:

```text
I have a question that can be investigated.
```

The output is not a certificate.

The output is an artifact.

---

# 2. The Initiation Loop

The first product loop should be:

```text
Enter DATAVISM
→ Meet GHOST
→ Choose a discomfort / system signal
→ Build a question
→ Define evidence needed
→ Mark uncertainty
→ Generate Signal Card
→ Save / export / share
→ Optionally contribute anonymously to the Archive
→ Choose next line freely
```

This loop should be achievable in 5–10 minutes.

The user should not feel like they have entered a heavy course.

They should feel:

> I built something.  
> I understand the method.  
> I want to continue.

---

# 3. Modular Line Philosophy

G is the Foundation, but DATAVISM should not force users into a single fixed route.

After G1, users should be able to choose their next direction.

The system may suggest routes, but the user chooses.

## Important Rule

> The map recommends. The user decides.

DATAVISM should support several paths:

```text
G1 → G2
G1 → K1
G1 → R1
G1 → B1
G1 → V1
```

Eventually:

```text
G1 → any unlocked line
G2 → any line
Any line → any other line via interchanges
```

## Suggested Product Model

G is not a gate that blocks everything.

G is a methodological home base.

Users can:

- preview all lines,
- choose a line based on their question,
- return to G when they need method support,
- build Case Files from multiple lines,
- and move through the network non-linearly.

## Suggested Language

Do not say:

> You must now continue with LINE K.

Say:

> Your question points toward LINE K.  
> You can follow that route, continue with GHOST, or choose another line.

---

# 4. User Experience Goals

G1 must be:

- clear,
- guided,
- emotionally engaging,
- low-friction,
- non-overwhelming,
- aesthetically strong,
- methodologically honest,
- and artifact-producing.

## Avoid

- long walls of text,
- early jargon,
- overexplaining the full curriculum,
- five heavy forms in a row,
- asking users for sensitive personal data,
- making unverifiable claims,
- making the user feel stupid,
- forcing them into K after G1,
- introducing game mechanics before the core loop works.

## Use

- one decision per screen,
- short GHOST prompts,
- progressive disclosure,
- strong defaults and examples,
- preview of the artifact as it is being built,
- clear uncertainty labels,
- strong visual reward at the end,
- and a route-choice moment.

---

# 5. UX Flow Detail

## Step 0 — Entry

Possible route:

```text
/g/the-folder
```

or:

```text
/initiation
```

Recommended: keep the existing G1 station route, but embed the interactive experience inside it.

Page title:

> G1 — THE FOLDER

Subline:

> Turn a vague suspicion into your first DATAVISM Signal Card.

Primary CTA:

> Enter the Folder

Secondary CTA:

> View the Map

---

## Step 1 — GHOST Intro

Purpose:

- establish mood,
- explain the premise,
- avoid overwhelming.

Suggested copy:

```text
GHOST:
A feeling is not evidence.
But it can become the beginning of a question.

This station helps you turn a vague suspicion into something investigable.
You will not prove everything today.
You will build the first artifact: a Signal Card.
```

User action:

```text
Start
```

---

## Step 2 — Choose a System Signal

The user chooses what kind of system bothers or interests them.

This is not final categorization.

It is a starting signal.

Options:

| Option | Label | Suggested Line |
|---|---|---|
| tracking | “I feel watched or profiled.” | K |
| money | “I want to know who benefits.” | R |
| feed | “I keep seeing patterns in feeds or recommendations.” | B |
| future | “I notice a slow change that people ignore.” | V |
| unsure | “I only have a vague feeling.” | G |

Important:

- These suggestions should not force the next line.
- The user can override later.

Suggested UI:

Cards with short text and line color accent.

---

## Step 3 — Name the Suspicion

Purpose:

Turn the feeling into a rough statement.

Prompt:

```text
What feels strange, hidden or worth investigating?
```

Examples:

```text
A website seems to know what I was looking for elsewhere.
My feed keeps pushing the same kind of content.
A company benefits from a problem it claims to solve.
A climate trend appears in local data but nobody discusses it.
```

Input:

```ts
suspicion: string
```

Validation:

- minimum 10 characters,
- maximum 280 characters,
- no sensitive personal data warning.

GHOST helper:

```text
Do not try to prove it yet.
Just name what you noticed.
```

---

## Step 4 — Sharpen the Question

Purpose:

Transform suspicion into an investigable question.

Prompt:

```text
Now turn the suspicion into a question.
```

GHOST guidance:

A good DATAVISM question is:

- specific,
- answerable,
- sourceable,
- not already a conclusion,
- and honest about uncertainty.

Question templates:

```text
What evidence would show that [system] does [behavior]?
Which actors are involved in [system]?
What signals suggest that [tracking / ranking / pricing / profiling] is happening?
Who benefits from [observed pattern]?
How has [long-term signal] changed over time?
```

Input:

```ts
question: string
```

Optional helper button:

```text
Help me sharpen this
```

Implementation note:

- v0.1 can use deterministic template suggestions.
- Do not require an AI API in the first implementation.
- Later, this can become a serverless GHOST assist endpoint.

---

## Step 5 — Define Evidence Needed

Purpose:

Teach that a question needs evidence.

Prompt:

```text
What would count as evidence?
```

The user selects or enters evidence types.

Options:

| Evidence Type | Description |
|---|---|
| technical signal | request, cookie, pixel, SDK, tag, metadata |
| public record | register, policy, procurement, filing, transparency database |
| platform output | feed result, recommendation, category, ranking, ad |
| dataset | CSV, API, archive, official data |
| document | PDF, report, article, policy, leaked taxonomy |
| observation | screenshot, diary, repeated pattern, manual sample |
| unknown | I do not know yet |

Input:

```ts
evidenceNeeded: string[]
customEvidenceNote?: string
```

GHOST helper:

```text
Evidence is not what you believe.
Evidence is what would let someone else inspect the claim.
```

---

## Step 6 — Mark Uncertainty

Purpose:

Prevent overclaiming.

Prompt:

```text
What do you not know yet?
```

Examples:

```text
I do not know who receives the data.
I do not know whether this happens before or after consent.
I do not know whether this pattern is personalized.
I do not know which company benefits.
I do not know whether the source is reliable.
```

Input:

```ts
uncertainty: string
```

Required.

This is essential.

A Signal Card without uncertainty should not be considered complete.

GHOST helper:

```text
Uncertainty is not weakness.
It is where the investigation stays honest.
```

---

## Step 7 — Choose Next Route

Purpose:

Make the curriculum modular.

The system suggests one or more lines based on the chosen system signal and question text.

But the user chooses.

Suggested UI:

```text
Your question could continue through:
```

Cards:

```text
K — KEY / Tracking & OSINT
Trace the watchers.

R — ROOK / Economy & Power
Follow the value.

B — BITE / Feeds & Behavior
Decode the feed.

V — VESPER / Climate & Future
Read the long signal.

G — GHOST / Foundation
Continue sharpening the method.
```

Input:

```ts
nextLineChoice: 'g' | 'k' | 'r' | 'b' | 'v'
nextLineSuggestions: LineId[]
```

Rule:

- suggestions are optional,
- user choice wins.

Copy:

```text
The map can suggest a route.
Only you choose the path.
```

---

## Step 8 — Generate Signal Card

Purpose:

Create the first artifact.

The Signal Card is both:

```text
social object + research object
```

It must look good enough to share, but also be structured enough to become data.

Signal Card should include:

```text
DATAVISM SIGNAL CARD

Stage:
Suspicion → Question

Line:
GHOST / Foundation

Station:
G1 THE FOLDER

Question:
[user question]

System Signal:
[selected signal / system type]

Evidence Needed:
[selected evidence types]

Uncertainty:
[user uncertainty]

Next Route:
[user chosen line]

Status:
Not evidence yet. Investigation opened.
```

Visual design:

- dark background,
- DATAVISM wordmark,
- ghost mark,
- line color accent,
- station code,
- QR or URL placeholder optional,
- “Not evidence yet” marker,
- generated card ID.

Export options:

- PNG / image export,
- Markdown export,
- JSON export,
- copy text,
- save locally.

v0.1 may implement:

- DOM-to-image export if feasible,
- or visually styled card with copy/export as markdown first.

Do not block launch on perfect social image export.

---

## Step 9 — Save Locally

Purpose:

Allow user progress without account system.

v0.1 storage:

```text
localStorage
```

Store:

```ts
datavism.signalCards[]
datavism.currentTicket?
datavism.completedStations[]
```

No account required.

No server required.

The card should remain visible if the user returns.

---

## Step 10 — Optional Archive Contribution

Purpose:

Connect individual artifact to collective work.

This should be opt-in.

Never auto-publish.

Copy:

```text
You can keep this private,
or contribute an anonymized version to the Signal Archive.
```

Options:

```text
Keep private
Export only
Contribute anonymously
```

Important v0.1 implementation decision:

If there is no moderation/backend yet, do **not** implement open public posting directly.

Instead implement one of these safe approaches:

## Option A — Local Only

User can export the card.

Archive page uses curated sample entries.

## Option B — Manual Submission

User clicks:

```text
Contribute anonymously
```

The app generates a markdown/json payload and opens email or copy-to-clipboard.

Human moderation happens before adding to archive.

## Option C — Backend Later

Submission endpoint with moderation queue.

Do not publish immediately.

Recommended v0.1:

> Implement A + B. Avoid unmoderated public posting.

---

# 6. The Signal Archive

Working title:

```text
The Signal Archive
```

Alternative names:

```text
The Folder Archive
The Evidence Atlas
The Public Signal Archive
The Map of Questions
```

Recommended for now:

> **The Signal Archive**

Reason:

- broad enough for all lines,
- does not imply every entry is proven evidence,
- works with Stage system,
- can grow into a living data artwork.

## Archive Concept

The Signal Archive is a collective, evolving map of questions about hidden systems.

It contains artifacts at different stages:

```text
Stage 1 — Suspicion
Stage 2 — Question
Stage 3 — Signal
Stage 4 — Evidence
Stage 5 — Case File
```

G1 creates Stage 2 artifacts:

```text
Suspicion → Question
```

This keeps the method honest.

## Archive Entry Rules

Every public archive entry must show its stage clearly.

A G1 Signal Card must say:

```text
This is not evidence yet.
This is an investigation question.
```

## Archive Views

v0.1 archive can be simple:

```text
/archive
```

Sections:

- intro,
- stage filter,
- line filter,
- cards grid,
- empty state,
- explanation of stages.

Later:

- network visualization,
- map clustering,
- timeline,
- line-specific atlas,
- Case File relationships.

## Archive Entry Fields

```ts
export type SignalArchiveEntry = {
  id: string;
  createdAt: string;
  stage: 'suspicion' | 'question' | 'signal' | 'evidence' | 'case-file';
  line: 'g' | 'k' | 'r' | 'b' | 'v';
  station: string;
  title?: string;
  question: string;
  systemSignal: 'tracking' | 'money' | 'feed' | 'future' | 'unsure' | 'other';
  evidenceNeeded: string[];
  uncertainty: string;
  nextLineChoice?: 'g' | 'k' | 'r' | 'b' | 'v';
  tags: string[];
  visibility: 'private' | 'public-anonymous' | 'curated';
  disclaimer: string;
};
```

## Public Disclaimer

Every archive page should include:

```text
Archive entries may represent questions, signals or evidence depending on their stage.
A Signal Card is not automatically a proven claim.
DATAVISM marks uncertainty instead of hiding it.
```

---

# 7. Data Model

Recommended file:

```text
src/lib/signal-cards/types.ts
```

## Types

```ts
export type LineId = 'g' | 'k' | 'r' | 'b' | 'v';

export type SystemSignal =
  | 'tracking'
  | 'money'
  | 'feed'
  | 'future'
  | 'unsure'
  | 'other';

export type EvidenceType =
  | 'technical-signal'
  | 'public-record'
  | 'platform-output'
  | 'dataset'
  | 'document'
  | 'observation'
  | 'unknown'
  | 'other';

export type SignalStage =
  | 'suspicion'
  | 'question'
  | 'signal'
  | 'evidence'
  | 'case-file';

export type SignalCard = {
  id: string;
  version: '0.1';
  createdAt: string;
  updatedAt?: string;

  line: LineId;
  station: 'g1-the-folder';
  stage: SignalStage;

  suspicion: string;
  question: string;
  systemSignal: SystemSignal;
  evidenceNeeded: EvidenceType[];
  customEvidenceNote?: string;
  uncertainty: string;

  suggestedLines: LineId[];
  nextLineChoice: LineId;

  tags: string[];

  visibility: 'private' | 'public-anonymous' | 'exported';
  disclaimer: string;
};
```

## Defaults

```ts
export const SIGNAL_CARD_DISCLAIMER =
  'This is not evidence yet. This is an investigation question created in DATAVISM G1 — THE FOLDER.';
```

---

# 8. Route Suggestion Logic

Recommended file:

```text
src/lib/signal-cards/route-suggestions.ts
```

v0.1 can be deterministic.

No AI required.

## Basic Mapping

```ts
const SYSTEM_SIGNAL_TO_LINES: Record<SystemSignal, LineId[]> = {
  tracking: ['k', 'g'],
  money: ['r', 'g'],
  feed: ['b', 'g'],
  future: ['v', 'g'],
  unsure: ['g', 'k', 'r', 'b', 'v'],
  other: ['g', 'k', 'r', 'b', 'v'],
};
```

## Keyword Hints

Optional:

```ts
const KEYWORDS: Array<{ pattern: RegExp; lines: LineId[] }> = [
  { pattern: /track|cookie|pixel|profile|ad|broker|surveillance/i, lines: ['k'] },
  { pattern: /money|profit|company|benefit|funding|ownership|contract/i, lines: ['r'] },
  { pattern: /feed|scroll|recommend|algorithm|viral|engagement/i, lines: ['b'] },
  { pattern: /climate|future|trend|long-term|archive|risk|change over time/i, lines: ['v'] },
];
```

Rule:

```text
Suggestions are advisory only.
User choice overrides suggestions.
```

---

# 9. Component Architecture

Recommended components:

```text
src/components/initiation/
  G1InitiationFlow.svelte
  GhostIntro.svelte
  SystemSignalPicker.svelte
  SuspicionInput.svelte
  QuestionBuilder.svelte
  EvidenceNeedPicker.svelte
  UncertaintyInput.svelte
  RouteChooser.svelte
  SignalCardPreview.svelte
  SignalCardActions.svelte
  ArchiveContributionPrompt.svelte
```

Possible helper components:

```text
src/components/signal-card/
  SignalCard.svelte
  SignalCardCompact.svelte
  SignalCardExportButton.svelte
```

Archive components:

```text
src/components/archive/
  SignalArchiveGrid.svelte
  SignalArchiveFilters.svelte
  SignalArchiveStageBadge.svelte
```

---

# 10. Page Architecture

Recommended routes:

```text
src/pages/g/the-folder.astro
src/pages/archive.astro
src/pages/map.astro or src/pages/network.astro
```

Optional later:

```text
src/pages/signal/[id].astro
```

For now, if there is no backend/public submission, do not implement dynamic public signal pages.

---

# 11. G1 Flow State

Inside `G1InitiationFlow.svelte`:

```ts
type G1FlowStep =
  | 'intro'
  | 'system-signal'
  | 'suspicion'
  | 'question'
  | 'evidence'
  | 'uncertainty'
  | 'route'
  | 'card'
  | 'archive';

type G1FlowState = {
  step: G1FlowStep;
  cardDraft: Partial<SignalCard>;
};
```

Autosave draft to localStorage after each step.

Suggested localStorage keys:

```ts
const DRAFT_KEY = 'datavism:g1:draft';
const CARDS_KEY = 'datavism:signal-cards';
```

---

# 12. Signal Card Export

v0.1 minimum:

- copy card as Markdown,
- download card as `.md`,
- download card as `.json`.

v0.1 nice-to-have:

- export card as PNG.

Recommended not to block launch on PNG export.

## Markdown Export Template

```md
# DATAVISM Signal Card

**Stage:** Suspicion → Question  
**Line:** GHOST / Foundation  
**Station:** G1 — THE FOLDER  
**Status:** Not evidence yet. Investigation opened.

## Suspicion

...

## Question

...

## Evidence Needed

...

## Uncertainty

...

## Next Route

...

---

Created with DATAVISM — The Evidence Engine.
```

---

# 13. Archive Implementation Phases

## Phase 1 — Static + Local

- User creates Signal Card locally.
- User can export it.
- Archive page shows curated sample cards from static data.
- No public submission.

Recommended files:

```text
src/data/archive/sample-signal-cards.ts
```

## Phase 2 — Manual Contribution

- User can generate an anonymized markdown/json payload.
- User copies it or sends by email.
- Maintainer reviews and adds to static archive data.

## Phase 3 — Moderated Backend

- Submission endpoint.
- Moderation queue.
- Public archive only shows approved cards.
- Optional passport/account integration later.

Do not implement Phase 3 unless backend and moderation are intentionally planned.

---

# 14. Content Requirements

## Microcopy Tone

GHOST should be:

- precise,
- calm,
- slightly uncanny,
- not cute,
- not motivational,
- not over-explanatory.

Good GHOST lines:

```text
A feeling is not evidence. But it can become a question.

Do not prove it yet. Name it.

The machine can help you think. It cannot be responsible for your claim.

Uncertainty is not weakness. It is where the investigation stays honest.

The map can suggest a route. Only you choose the path.
```

Avoid:

```text
Great job!
Awesome work!
You are now a data detective!
Let's hack the system!
```

---

# 15. UX Anti-Overwhelm Rules

Each step should have:

- one main prompt,
- one short GHOST note,
- one user action,
- visible progress,
- and a way to go back.

Recommended progress labels:

```text
1 Signal
2 Suspicion
3 Question
4 Evidence
5 Uncertainty
6 Route
7 Card
```

Do not show all 25 stations in the G1 flow.

Do not explain all lines in detail during the flow.

Only show enough to help the route decision.

---

# 16. Visual Direction

The experience should visually connect to the DATAVISM map.

Use:

- near-black background,
- ghost mark,
- line accents,
- station code,
- transit-card / evidence-file aesthetic,
- subtle terminal / folder / archive motifs,
- clear typography.

Do not make it look like:

- a generic form,
- a normal LMS quiz,
- a dashboard,
- a productivity app,
- a game with cheap XP badges.

The artifact should feel like:

> a small evidence object from a larger underground network.

---

# 17. Acceptance Criteria

## G1 Interactive Initiation

A user can:

- start the G1 flow,
- choose a system signal,
- write a suspicion,
- transform it into a question,
- select evidence needed,
- mark uncertainty,
- choose any next line,
- generate a Signal Card,
- save it locally,
- export it as markdown or JSON.

## Modular Lines

A user can:

- receive line suggestions,
- ignore them,
- choose K/R/B/V/G freely,
- see that the choice updates the Signal Card.

## Signal Archive

A user can:

- understand what the archive is,
- see sample/curated cards,
- understand the difference between question, signal, evidence and Case File,
- choose not to publish anything.

## Ethics

The flow must:

- warn against sensitive personal data,
- mark Signal Cards as not evidence yet,
- require uncertainty,
- avoid public posting without moderation,
- avoid implying that DATAVISM has proven a claim.

---

# 18. Non-Goals for This Sprint

Do not build:

- full user accounts,
- full gamification,
- all 25 station experiences,
- unmoderated public submissions,
- AI backend dependency,
- complex visualization archive,
- full Case File publishing system,
- social network features,
- comments,
- likes,
- public profiles.

---

# 19. Suggested Implementation Plan for Claude Code

## Step 1 — Add Types and Utilities

Create:

```text
src/lib/signal-cards/types.ts
src/lib/signal-cards/route-suggestions.ts
src/lib/signal-cards/storage.ts
src/lib/signal-cards/export.ts
```

## Step 2 — Build G1 Flow Components

Create:

```text
src/components/initiation/G1InitiationFlow.svelte
src/components/initiation/SystemSignalPicker.svelte
src/components/initiation/SuspicionInput.svelte
src/components/initiation/QuestionBuilder.svelte
src/components/initiation/EvidenceNeedPicker.svelte
src/components/initiation/UncertaintyInput.svelte
src/components/initiation/RouteChooser.svelte
src/components/initiation/SignalCardPreview.svelte
src/components/initiation/SignalCardActions.svelte
```

## Step 3 — Integrate Into G1 Page

Update:

```text
src/pages/g/the-folder.astro
```

or current G1 route.

Do not remove existing story content.

Add the interactive flow as the primary mission experience.

## Step 4 — Add Archive Page

Create or update:

```text
src/pages/archive.astro
src/data/archive/sample-signal-cards.ts
src/components/archive/SignalArchiveGrid.svelte
```

## Step 5 — Connect to Network Map

If `src/lib/curriculum/lines.ts` exists, use it for:

- line labels,
- colors,
- station metadata,
- route chooser.

Do not duplicate line definitions manually.

## Step 6 — Export Functionality

Minimum:

- copy markdown,
- download markdown,
- download JSON.

Nice-to-have:

- PNG export.

---

# 20. Claude Code Prompt

Use this prompt after placing this document in the repo.

```text
You are working in the DATAVISM repo.

Goal:
Implement the first vertical slice of DATAVISM as an interactive G1 initiation experience.

Source documents:
- docs/curriculum/evidence-engine-v0.1.md
- docs/curriculum/line-g-ghost-foundation-v0.1.md
- docs/curriculum/line-k-key-tracking-osint-v0.1.md
- docs/product/g1-interactive-initiation-v0.1.md
- src/lib/curriculum/lines.ts if present

Product principle:
G1 must turn a vague suspicion into a Signal Card. The Signal Card is both a user-owned artifact and a potential anonymized contribution to a future collective archive.

Important curriculum rule:
After G1, users are NOT forced into LINE K. Lines are modular. The app may suggest K/R/B/V/G based on the user's question, but the user chooses their next route freely.

Implementation requirements:
1. Add a SignalCard type system and utilities.
2. Build a Svelte G1InitiationFlow component with progressive steps:
   intro → system signal → suspicion → question → evidence → uncertainty → route → card → archive prompt.
3. Store drafts and completed cards in localStorage.
4. Generate a visual Signal Card preview.
5. Support export as Markdown and JSON.
6. Add an archive page with curated/sample Signal Cards and clear stage labels.
7. Do not implement unmoderated public posting.
8. Use existing DATAVISM visual language: dark background, ghost, line colors, evidence-file / transit-map aesthetic.
9. Keep the UX low-overwhelm: one decision per step, short GHOST copy, visible progress.
10. Keep all claims honest: a G1 Signal Card is not evidence yet; it is an investigation question.

Acceptance criteria:
- A user can complete G1 and create a Signal Card in 5–10 minutes.
- The user can choose any next line after G1.
- The card can be exported.
- The archive page exists and explains stages.
- No backend is required for v0.1.
- Existing G1 story content is preserved or carefully merged, not deleted blindly.

Before coding:
Audit the current repo structure and identify the existing G1 route, station content schema, curriculum data files and styling conventions.

After coding:
Summarize changed files, key decisions, and any follow-up tasks.
```

---

# 21. One-Sentence Product Canon

> **G1 turns private suspicion into a Signal Card; the Signal Archive turns many Signal Cards into a collective map of hidden systems.**
