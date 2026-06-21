---
line: g
index: 4
title: THE CONFIDENT LIE
skill: Check AI output — hallucination, source-check, adversarial reading
status: open
teaser: "Five statements about your data. Some are subtly false. Find the lie."
missionMinutes: "45–90 min"
artifactName: "Verification Protocol"
ogImage: /og/datavism.png
outcome: "After this station you can take fluent, confident machine output and tell, claim by claim, which parts survive contact with the source — and which were invented."
signal:
  lead: "The most dangerous machine output is not obviously false. It is plausible, smooth, confident — the kind of thing a smart person might say. And it may be wrong."
  body: "The skill is not to admire the writing. It is to attack it: line by line, claim by claim, against what the source actually says."
method:
  intro: "You extract each claim, find its source, and compare what the source says to what the machine said. Then you grade it."
  steps:
    - "Pull the individual claims out of the fluent text."
    - "For each claim, locate the actual source."
    - "Compare: what the source says vs what the AI said."
    - "Grade it — verified, unsupported, misleading, contradicted, or unclear — and rewrite it accurately."
tooling:
  intro: "Your G3 sources, a table, and a second AI used as an adversary — not an authority."
  items: ["Your Intake Sheet (G3)", "Any AI assistant", "A claim-by-claim table"]
mission:
  goal: "Take an AI summary of your topic and break it — then leave only what holds."
  steps:
    - "Take an AI-generated summary from G2/G3 and extract 10 claims."
    - "For each: locate the source, compare wording, assign a status, rewrite it accurately."
    - "Have a second AI attack the first AI's output — then verify the attack too."
    - "Write a corrected summary that says only what can be supported."
verification:
  intro: "Your verification holds when:"
  checks:
    - "Every claim has a status and a source, or is marked unverified."
    - "You can show one claim that was true-sounding but unsupported."
    - "Your corrected summary makes no claim the sources cannot carry."
ghostFragment:
  - "The lie did not arrive screaming. It arrived formatted. It arrived helpful. It arrived with bullet points."
  - "That is why you check."
  - "Not because you distrust intelligence. Because you respect evidence."
bridge: "You can now verify the machine. Next — MASCHINENRAUM: step back and inspect the whole workflow you have built."
artifactDesc: "A claim-by-claim audit of fluent AI output: what survived, what broke, and a corrected summary that only says what holds."
artifactTemplate: |
  # Verification Protocol — [Investigation Title]

  ## AI Output Under Review
  Paste or summarize the output being checked.

  ## Claim Table
  | Claim ID | Claim | Source Given | Source Checked | Evidence | Status | Correction | Uncertainty | Risk |
  |----------|-------|--------------|----------------|----------|--------|------------|-------------|------|
  | C1 |       |              |                |          |        |            |             |      |

  Status: Supported / Partly supported / Unsupported / False / Unclear

  ## Corrected Summary
  A version that says only what the sources can carry.

  ## Remaining Unknowns
  What still needs checking.
stationSentence: "The most dangerous lie is the one that sounds like work already done."
selfChecks:
  - "I can extract claims from fluent text."
  - "I can verify a claim against a source."
  - "I can identify unsupported AI output."
  - "I can mark uncertainty without weakening the work."
  - "I can produce a corrected summary."
nextTeaser: "G5 — MASCHINENRAUM: enter the machine room. Inspect the method itself."
---

G4 THE CONFIDENT LIE — LINE G station 4. Beats in frontmatter. Method station:
the learner audits AI output on their own investigation — any AI transcripts they
produce are their own, real and labelled.
