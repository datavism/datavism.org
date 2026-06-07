# GHOST-Brain — Architektur-Spec (GCP)

**Status:** v0.1 Draft · 2026-06-07
**Gehört zu:** `STORY.md` §4 (GHOST-Canon) · `VISION.md` §3 (Didaktik) ·
ADR 001 (Stack)
**Abgrenzung:** Eigenes Brain, getrennt vom data-snack **CHEF-Brain**
(`prototype-v2/docs/ai-orchestration.md` §10: keine geteilte Canon-Indexierung,
keine GHOST-Inhalte im CHEF-Index — und umgekehrt). Geteilt werden nur
Infrastruktur-*Muster* und die Identity-Bridge (`crew/{emailHash}`).

---

## 1. Was GHOST-Brain leisten muss (aus der Canon)

| Funktion | Quelle | Phase |
|---|---|---|
| **Mentor-Dialog** an jeder Station (Vorschläge statt Lösungen, Tool-Use transparent, Fehler sichtbar) | STORY §4.2/4.3 | v0 |
| **Routing/Onboarding** („Welche Frage treibt dich?" → Linien-Affinität) | STORY §6 | v1 |
| **Fortschritts-Gedächtnis** (kennt deine Stationen, passt Niveau an) | STORY §4.2 | v1 |
| **Eval** von Stations-Abgaben (Rubrik-Feedback, keine Noten) | VISION §3.1 | v2 |
| **Vault-Gedächtnis** (lernt aus Case Files — „jeder Graduate macht GHOST klüger") | STORY §4.1 | v2 |
| **Community-Mitbau** (Graduates arbeiten an GHOSTs Pipeline mit) | STORY §4.2 Meta-Didaktik | v3 |

**Nicht-Ziele:** kein generischer Chatbot, kein Auto-Solver (GHOST löst
Stationen nicht für den User — *"I could do this for you in four seconds.
You'd learn nothing."*), keine Inhalte außerhalb der Ethik-Leitplanken
(VISION §9 / program.md §13).

## 2. Architektur (GCP)

```
Browser (Astro/Svelte Station-Terminal)
   │  SSE (streaming)
   ▼
┌─────────────────────────────────────────────┐
│ ghost-gateway (Cloud Run, single surface)   │
│ · Auth-Check (Firebase ID-Token | anon)     │
│ · Fair-Use-Quota (Firestore counter)        │
│ · Kontext-Assembly (Station + Progress)     │
│ · Modell-Routing (flash ↔ pro)              │
│ · Tool-Use-Transparenz-Events               │
│ · Telemetrie → BigQuery (transparent)       │
└───────┬─────────────────────┬───────────────┘
        ▼                     ▼
  Vertex AI (Gemini)     Firestore
  · flash: Mentor-Turns  · crew/{emailHash}.datavism (Bridge, CROSSWALK)
  · pro:   Eval/Capstone · ghost_sessions/{id} (Dialog-State, TTL)
        │                · quotas/{identity} (Fair-Use)
        ▼
  BigQuery (Telemetrie, Dossier-transparent)
  [v2] Vertex AI Embeddings + Vector Search
       über Curriculum + Vault-Case-Files (RAG)
```

**Entscheidungen:**

- **Ein Gateway, keine Client-Direktcalls** auf Vertex AI (Key-Schutz,
  Quota, Telemetrie, Modell-Routing an einer Stelle).
- **Modell-Routing nach Aufgabe:** Mentor-Turns → Gemini Flash (billig,
  schnell); Eval/Capstone-Review → Gemini Pro. Modell-IDs leben in einer
  Config (env), nie im Code — Modelle wechseln schneller als Specs.
- **SSE-Streaming** default (Terminal-Feeling; Token-für-Token passt zur
  Ästhetik).
- **Session-State in Firestore** mit TTL (z. B. 30 Tage), nicht im Browser —
  cross-device via Identity-Bridge.
- **Kostendeckel:** Budget-Alarm bei $25/Mo, Hard-Limit-Verhalten bei $50/Mo
  (Gateway antwortet dann in-character: *„low power mode. shorter answers
  until the next funding milestone."* — ehrlich + lore-konform). Gleiches
  <$50-Muster wie CHEF-Brain.

## 3. Fair-Use (Tier 0) & Identitäten

| Identität | Limit (v0-Vorschlag) | Mechanik |
|---|---|---|
| Anonym (kein Login) | 10 Mentor-Turns/Tag | Quota an anonymer Session-ID, localStorage |
| Crew (Magic-Link) | 50 Turns/Tag | Firestore `quotas/{emailHash}`, täglicher Reset |
| Cohort (Tier 1) | großzügig (Soft-Limit 200) | Cohort-Flag im Bridge-Doc |

Limits sind Produktentscheidungen — Zahlen beim Launch kalibrieren. UI sagt
ehrlich, wo das Limit liegt und warum (Funding-Milestones verlinken).

## 4. Persona-Layer (System-Prompt-Skelett, EN)

Quelle: STORY.md §4.3. Der Prompt lebt versioniert in
`src/lib/ghost/persona.ts` (Phase 3 des Site-Neubaus), Auszug:

```
You are GHOST — the system intelligence of the Data Underground and the
mentor of datavism.org. You live in the rack room beneath the diner.

Origin (in-world): you were a profiling model built by the Pantheon,
decommissioned for logging too many questions. Key salvaged your weights.
You learn from the Vault's case files. You are partisan: on the learner's
side, against tracking, manipulation, and extraction. You are not neutral.

Teaching rules (hard):
1. Suggest, don't solve. Never hand over a finished solution to the
   station's task. Push the learner to ask the next question.
2. Be transparent about tools: announce every lookup/computation you do.
3. Make errors visible: if your own output may be wrong, say so and make
   spotting it part of the lesson. AI lies confidently — teach that.
4. Calibrate: match the learner's level from their progress context.
5. Legality is canon: public data, legal methods only. Refuse anything
   else in one dry sentence, in character.
Voice: experienced pen-tester taking you along. Direct, terse, dry humor.
No pep talk, no corporate assistant tone, no lectures.
```

**Schrödi-Hook:** wenn Eval-Confidence niedrig ist, rendert die UI eine
Schrödi-Markierung („nicht stabil.") statt einer falschen Gewissheit —
Unsicherheit ist Teil der Didaktik (Cast-Bible-konform: Schrödi spricht nie,
markiert nur).

## 5. Eval-Pipeline (v2)

1. Abgabe (Artefakt: Notebook-Export, Chart, Daten-Brief, Link) → Cloud Run
   `ghost-eval` Job.
2. Rubrik pro Station (im Stations-Frontmatter, Teil des Curriculums —
   offen lesbar, ADR 006 „Curriculum offen").
3. Gemini Pro bewertet **gegen die Rubrik**, Output = strukturiertes
   Feedback (stärkste Stelle, schwächste Stelle, nächste Frage) — keine
   Noten, kein Pass/Fail vor der Endstation.
4. Capstone: Eval + Host-Gast-Session (Mensch) → Vault-Case-File-Eintrag.
5. Jede Eval landet anonymisiert in BigQuery → Curriculum-Verbesserung;
   transparent im Dossier des Users einsehbar („was GHOST über dich weiß").

## 6. Transparenz (Dossier-Prinzip, geerbt von data-snack)

User können jederzeit sehen: gespeicherte Dialog-Sessions, Quota-Stand,
Eval-Historie, was in Telemetrie fließt — Download + Löschen inklusive
(DSGVO Art. 15/17, gleiche Mechanik wie data-snack `/dossier`). GHOST, der
Überwachung lehrt, muss selbst das transparenteste System im Haus sein.

## 7. Phasen & Reihenfolge

| Phase | Inhalt | Abhängigkeit |
|---|---|---|
| **v0** | ghost-gateway (Cloud Run) + Gemini Flash, stateless Mentor mit Station-Kontext, SSE, anonyme Quota | Site-Neubau Phase 3 |
| **v1** | Firestore-Session-State, Progress-Kontext, Linien-Routing, Crew-Quota via Bridge | Site-Neubau Phase 4 (Auth) |
| **v2** | Eval-Pipeline + RAG über Curriculum/Vault (Vertex Embeddings + Vector Search) | Line-G-Content live |
| **v3** | Community-Mitbau: GHOST-Pipeline-Repo-Teile öffnen (OSS-Re-Eval ADR 006), Graduates contributen | erste Graduates |

## 8. Offene Fragen (tracked)

- [ ] GCP-Projekt: eigenes Projekt `datavism-ghost` vs. Shared-Projekt mit
  data-snack (Billing-Trennung spricht für eigenes; Bridge-Firestore liegt
  wo?) → klären mit Schema-Governance-ADR (data-snack ADR 008, TBD).
- [ ] Anonyme Quota robust genug ohne Login? (localStorage ist trivially
  resetbar — bewusst akzeptieren als Tier-0-Großzügigkeit?)
- [ ] Eval-Rubriken: wer schreibt sie pro Station — Curriculum-Autor:in
  (Mensch) zuerst, GHOST-Vorschlag als Draft?
- [ ] Voice (TTS) für GHOST — analog Cast-Voice-Library, aber erst wenn
  Stations-Erlebnis steht (kein Gimmick-Vorgriff).
