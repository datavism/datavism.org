---
line: g
index: 2
title: COMMAND
skill: Orchestrate AI instead of chatting with it (prompts as specs, iteration)
status: open
teaser: "Vague orders made me confident. Confident and wrong."
missionMinutes: "45–90 min"
artifactName: "Command Log"
ogImage: /og/datavism.png
outcome: "After this station you can turn a vague AI request into a controlled command — a reusable spec that makes the machine work for your investigation instead of inventing it."
signal:
  lead: "The machine answers anything, instantly, fluently. That is exactly the trap — it will finish your sentence before you have finished thinking."
  body: "Chatting gets you a confident wall of text. Commanding gets you usable work. The difference is not better vibes — it is better instructions."
method:
  intro: "A command is a contract: a role, the context, one task, hard constraints, what evidence it may use, the output format, and how to mark what it does not know."
  steps:
    - "Role — tell the AI what to act as: an investigator, not a hype-man."
    - "Context + Task — what it needs to know, and the single thing it should do."
    - "Constraints — what it must not do; force it to separate facts, assumptions and unknowns."
    - "Output + Verification — the exact format, and where to flag uncertainty or missing evidence."
tooling:
  intro: "Any capable AI assistant works. You command it; you do not believe it."
  items: ["Any AI assistant", "Your G1 question", "A plain doc for the log"]
mission:
  goal: "Take your question from G1 and turn it into three controlled commands — then prove you improved them."
  steps:
    - "Write an Exploration command: map possible actors, data sources and angles — facts vs assumptions vs unknowns, explicitly."
    - "Write a Structuring command: turn messy notes into a table or outline."
    - "Write a Verification command: flag weak claims and missing evidence."
    - "Run them, then log what changed between your first prompt and the final usable one."
verification:
  intro: "A command is good enough to keep when:"
  checks:
    - "It separates facts, assumptions and unknowns — not one confident blur."
    - "It names what the AI may and may not use as evidence."
    - "Its output is structured enough to reuse next time."
ghostFragment:
  - "The machine wants to complete the pattern. It does not know when the pattern becomes a lie."
  - "Your job is not to admire fluency. Your job is to command the work."
  - "The prompt is not a spell. It is a contract."
bridge: "A command is only as good as what you feed it. Next — INTAKE: the raw material worth commanding the machine with."
artifactDesc: "Your three commands, the problems you caught, and the final reusable prompt — proof you can direct the machine, not just ask it."
artifactTemplate: |
  # Command Log — [Investigation Title]

  ## 1. Starting Question
  The question from G1.

  ## 2. Command v1
  Your first prompt — and the output it produced.

  ## 3. Output Problems
  What was vague, false, generic or unhelpful?

  ## 4. Command v2 / v3
  The improved prompt(s): role, constraints, evidence rules, output format.

  ## 5. Useful Output
  What the AI actually helped clarify.

  ## 6. Risks
  Where the AI could still be wrong.

  ## 7. Reusable Command
  The final prompt template, ready to reuse.
selfChecks:
  - "I can explain the difference between asking and commanding."
  - "I can write constraints for an AI task."
  - "I can force the AI to separate facts, assumptions and unknowns."
  - "I can document how my prompt evolved."
  - "I can name at least one risk in the AI's output."
nextTeaser: "G3 — INTAKE: a pile of links is not evidence. Build the source trail."
---

G2 COMMAND — LINE G station 2. Playable beats live in the frontmatter (rendered
by line-g/[station].astro). Method station: the learner commands AI on their own
G1 investigation — no external data sources to cite here.
