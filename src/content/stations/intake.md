---
line: g
index: 3
title: INTAKE
skill: Source & structure data with a co-pilot (your first pipeline)
status: open
teaser: "Pull a real slice of the machine's records — and make it talk."
missionMinutes: "45–90 min"
artifactName: "Intake Sheet"
ogImage: /og/datavism.png
outcome: "After this station you can turn a messy pile of links, files and notes into a structured source trail an investigation can actually run on."
signal:
  lead: "You have a question and a way to command the machine. Now you need material — and material arrives as a mess: links, screenshots, exports, half-remembered claims."
  body: "Most weak investigations die right here — jumping from question to conclusion with no source trail. Intake is the discipline that stops that."
method:
  intro: "Raw material is not evidence until it is described. Every source gets metadata: what it is, who published it, when you got it, and what it does — and does not — contain."
  steps:
    - "List every source with an ID, type, owner and access date."
    - "For each: what it contains, what it does NOT contain, how far you trust it."
    - "Separate sources from interpretations from noise."
    - "If it is data-like, sketch a field map: field, meaning, example, caveat."
tooling:
  intro: "A table is enough. AI can help classify and extract — you decide what counts."
  items: ["A spreadsheet or table", "Any AI assistant", "Your G1 question + G2 commands"]
mission:
  goal: "Build the smallest real source trail for your investigation — and know its weak point."
  steps:
    - "Collect at least 5 pieces of source material for your G1 question."
    - "Classify each: document, dataset, page, export, screenshot, observation."
    - "Put them in an intake table with reliability + caveats."
    - "Name your strongest and weakest source, and the smallest evidence set you actually need next."
verification:
  intro: "Your intake holds when:"
  checks:
    - "Every entry says what it cannot prove, not just what it shows."
    - "You can tell a source from an interpretation from noise."
    - "You can point at the single weakest link in the trail."
ghostFragment:
  - "A pile of links is not evidence. A folder of screenshots is not evidence. A table is not evidence."
  - "Evidence begins when material is placed in relation to a question."
  - "Intake is where the investigation becomes real."
bridge: "Now you have material and structure. Next — THE CONFIDENT LIE: how easily a fluent machine distorts the trail you just built."
artifactDesc: "A described, classified source inventory — with reliability, caveats, and the weakest link named."
artifactTemplate: |
  # Intake Sheet — [Investigation Title]

  ## Investigation Question
  From G1.

  ## Source Table
  Rule: keep the raw material. Do not replace a source with an AI summary.

  | ID | Source Type | Title / Label | URL / Location | Accessed At | Actor | Relevant Claim | Raw Material | Extracted Fields | Transformation | AI Use | Confidence | Notes |
  |----|-------------|---------------|----------------|-------------|-------|----------------|--------------|------------------|----------------|--------|------------|-------|
  | S1 |             |               |                |             |       |                |              |                  |                |        |            |       |

  ## Strongest / Weakest Source
  Which to lean on; which to distrust.

  ## Smallest Evidence Set
  The minimum needed for the next step.
stationSentence: "Evidence starts as messy intake."
selfChecks:
  - "I can distinguish a source from a claim from an interpretation."
  - "I can create a source inventory with metadata."
  - "I can describe each source's reliability."
  - "I can explain what each source cannot prove."
  - "I can define the smallest evidence set I need."
nextTeaser: "G4 — THE CONFIDENT LIE: the most dangerous output is the one that sounds right."
---

G3 INTAKE — LINE G station 3. Playable beats live in the frontmatter. Method
station: the learner structures their own sources for their G1 investigation —
no DATAVISM-provided dataset, no fabricated sources.
