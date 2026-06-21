---
line: "k"
index: 1
title: "FOOTPRINTS"
skill: "Trace literacy and footprint mapping."
status: "open"
teaser: "An ordinary day. Weather, messenger, a symptom search, one purchase. How many traces did it leave?"
missionMinutes: "60–90 min"
artifactName: "Footprint Map"
ogImage: /og/datavism.png
sources: []
outcome: "After this station you can take an ordinary day online and map the traces it produced — what kind, where, who might receive them, and how sensitive they are. It is the first move of every tracking investigation."
signal:
  lead: "You open the weather. A messenger. A news article. You search a symptom, buy one thing, scroll a feed. A normal morning."
  body: "Every one of those actions left a trace — a request, an identifier, a timestamp, a quiet guess. You saw almost none of them. Before you can trace the watchers, you have to see what they collect: footprints."
method:
  intro: "Trace inventory. You reconstruct a slice of your own digital day and turn each action into a described trace — voluntary, behavioral, technical or inferred — instead of a vague sense of being watched."
  steps:
    - "Reconstruct one real hour or day: list the actions — open app, search, buy, sign up, scroll."
    - "For each action, name the trace it likely produced, and what kind it is."
    - "Mark where the trace is produced and who might receive it: first party, third party, broker, platform."
    - "Rate how sensitive it is — and whether you could even see the trace at all."
tooling:
  intro: "Nothing invasive. You observe your own footprint and describe it precisely."
  items: ["Your own browser / app history", "A spreadsheet or table", "App privacy labels / permissions", "Any AI assistant (to classify trace types)"]
mission:
  goal: "Build the first Footprint Map for your own digital day — and name which traces are sensitive and which stay invisible."
  steps:
    - "Pick one real hour or day and list at least eight actions."
    - "Turn each into a trace row: type, context, possible receiver, sensitivity, visibility."
    - "Mark every row as observed or assumed — do not guess silently."
    - "Name your single most sensitive trace, and write one question it opens for K2."
verification:
  intro: "Your Footprint Map holds when:"
  checks:
    - "Each row says whether the trace is observed or only assumed."
    - "You can name a plausible receiver — not just 'someone'."
    - "You can point to the most sensitive trace and say why it matters."
ghostFragment:
  - "You think you left no trace. You left dozens before breakfast — a request, an identifier, a quiet guess about who you are."
  - "None of it screams. That is the design. The trace is quiet; the profile built from it is loud."
  - "Do not chase people. Trace the machine that watches them — and start with what it already collected: you."
bridge: "A footprint is not yet proof. Next — K2 SIGNALS: open the dev tools and catch the trackers in the act, before you even click. LINE K rule: we trace systems, not private individuals."
artifactDesc: "A structured map of one digital day: each action as a described trace, with receiver, sensitivity, and what you can and cannot actually see."
artifactTemplate: |
  # Footprint Map — [Your Digital Day]

  ## Trace Table
  | Action | Trace Type | Context | Possible Receiver | Sensitivity | Visibility | Evidence | Open Question |
  |--------|-----------|---------|-------------------|-------------|------------|----------|---------------|
  |        |           |         |                   |             |            |          |               |

  - **Trace Type:** voluntary / behavioral / technical / inferred
  - **Context:** browser, app, platform, payment, location, search …
  - **Possible Receiver:** first party / third party / broker / analytics / platform
  - **Sensitivity:** low / medium / high · **Visibility:** can you see it? (yes / partial / no)

  ## Most Sensitive Trace
  Which one, and why.

  ## Question for K2
  The tracking signal you most want to catch in the act.
stationSentence: "Before you can trace the watchers, you need to understand the traces."
selfChecks:
  - "I can explain the difference between an action and a trace."
  - "I can list at least five trace types."
  - "I can identify possible receivers of a trace."
  - "I can mark which claims are observed and which are assumptions."
  - "I can formulate one follow-up question for K2."
nextTeaser: "K2 — SIGNALS: tracking is not invisible. It leaves signals you can capture."
---

K1 FOOTPRINTS — LINE K station 1, the orientation door into KEY / Tracking &
OSINT. Playable beats live in the frontmatter (rendered by [line]/[station].astro).
Method station: the learner maps their OWN digital footprint — no third-party
data, no surveillance of others. LINE K ethical boundary: we trace systems, not
private individuals.
