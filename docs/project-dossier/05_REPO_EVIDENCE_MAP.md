# 05 — Repo Evidence Map (datavism.org)

**Stand:** 2026-06-15. **Sicherheit:** Hoch = direkt im Code/Text belegt · Mittel =
aus mehreren Hinweisen plausibel · Niedrig = Annahme/Interpretation.

## 1. Aussage → Evidenz

| Aussage / Erkenntnis | Evidenz-Dateien | Sicherheit | Kommentar |
|---|---|---|---|
| Stack = Astro 5 + Svelte 5 + Tailwind v4 + TS + Vitest | `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/styles/global.css` | Hoch | — |
| Deploy = Vercel (Astro), 1 Serverless-Function | `vercel.json`, `api/subscribe.ts`, `.vercel/` | Hoch | — |
| Positionierung = AI-Era Data-Skills-Bootcamp, „command, not code" | `docs/VISION.md §0–§1`, `README.md`, `docs/MANIFESTO.md` | Hoch | Lead-Doku + Manifest |
| **Führendes Phasen-Framing = Case-first Data-Activism Lab** (Form offen, 90-Tage-Trigger) | `docs/adr/002-positioning-case-first-lab.md` | Hoch | **ENTSCHEIDUNG 2026-06-15** — überlagert die „Bootcamp"-Lesart als aktueller Aufbau-Modus |
| Zielgruppen (Gen Z/Millennials; Journos/NGOs; Educators) | `docs/VISION.md §2` | Hoch | Quereinsteiger nicht explizit → Lücke |
| Curriculum = U-Bahn-Netzplan (5 Linien, Stationen, Capstones) | `docs/STORY.md §6`, `docs/VISION.md §3.2` | Hoch | — |
| 5 Linien G/K/R/B/V mit Paten + Pantheon-Gegnern | `docs/VISION.md §3.2`, `docs/STORY.md §5/§6` | Hoch | Paten = data-snack-Cast |
| Nur Line G ausgearbeitet; G1 gebaut, G2–G5 stubs | `src/content/stations/*.md`, `docs/plans/2026-06-13-phase-2-line-g-design.md` | Hoch | K/R/B/V ohne Inhalt |
| G1 „THE FOLDER": Daten verifiziert (650k Xandr, 376/Tag ICCL) | `src/content/stations/the-folder.md`, `experiments/folder-spike/VERIFY-G1.md`, `src/components/TheFolderStory.svelte` | Hoch | Quellen mit Zugriffsdatum |
| Tier-Modell: Tier 0 frei / Cohort 290–990 € / 25 % Stipendien | `docs/VISION.md §3.3` | Hoch | „aus ADR 006 verbindlich" |
| Ehrlichkeits-Regel (keine Fake-Stats, kein Tracking) | `docs/STORY.md §8`, `docs/VISION.md §4`, `src/components/TrackCounter.svelte`, Footer in `copy/en.ts` | Hoch | gelebt im Counter-Code |
| Waitlist live: Proxy zu geteilter data-snack-Function, kein lokaler Key | `api/subscribe.ts`, `src/components/SubscribeForm.svelte`, `docs/VISION.md §5` | Hoch | Env nur `SUBSCRIBE_ENDPOINT` |
| Counter sendet/speichert nichts | `src/lib/signals.ts`, `src/components/TrackCounter.svelte` | Hoch | client-only |
| Ticket = lokal, „self-stamped", CROSSWALK-kompatibel | `src/lib/ticket.ts`+`ticket-storage.ts`, `src/components/{StationSelfCheck,TicketView}.svelte` | Hoch | echte Eval = Phase 3 |
| Kein Auth/DB/Payment/Analytics in der Astro-Site | (Abwesenheit in `src/`, `api/`) | Hoch | bewusst, Phasen 3/4 |
| `.env.example` veraltet (Next.js-Legacy-Vars) | `.env.example` vs. `api/subscribe.ts` | Hoch | Tech-Schuld/irreführend |
| Netz-Karte = SSR-SVG-Wortmarke „DATAVISM" aus Strecken | `src/components/NetworkMap.astro`, `src/lib/network/geometry.ts`, `docs/plans/2026-06-14-network-map-design.md` | Hoch | Look vom Founder verworfen → offen |
| Roadmap Q3'26–Q2'27 (Beta-Cohort Q4'26, Public Q1'27) | `docs/VISION.md §8` | Hoch | — |
| Marke = DATAVISM (Ghost), „Data Underground" = Subline | `docs/STORY.md §2`, `public/brand/svg/`, `src/components/GhostLogo.astro` | Hoch | — |
| GHOST = KI-Mentor, geplant auf GCP (Vertex/Firestore/BigQuery) | `docs/STORY.md §4`, `docs/ghost-brain.md` | Hoch | als Dienst noch nicht live |
| Funding hybrid/non-profit (Prototype Fund, EU-Grants, Cohorts) | `docs/VISION.md §7` | Hoch | „niemals Curriculum-Paywall" |
| Berufstätige Quereinsteiger = ungenutzte Chance | (Abwesenheit in VISION §2) | Mittel | Interpretation |
| Positionierung evtl. zu breit (Engineering+Analytics+Science+Kunst+Aktivismus) | `docs/VISION.md §1/§3.2` | Mittel | strategische Wertung |
| FAQ.md teils Legacy (Game/Level-Ära) | `docs/FAQ.md` vs. `docs/VISION.md` | Mittel | nicht 1:1 aktuell |
| Team klein/Solo, Scope ambitioniert | (kein TEAM-Beleg fürs aktuelle Projekt; `docs/TEAM-STRUCTURE.md` ist Plan/Aspiration) | Niedrig | Annahme |
| Messaging-Outcome-Lücke (Career-Nutzen) | `src/lib/copy/en.ts`, `manifesto.astro` | Mittel | Diagnose |
| Empfohlene Level Foundation/Practitioner/Builder/Operator | (abgeleitet aus VISION §3.1/§3.2) | Niedrig | Empfehlung, nicht im Repo |

## 2. Wichtigste Dateien für Produktverständnis

- `docs/VISION.md` — **Leit-Dokument** (Positionierung, Curriculum-Netzplan,
  Tier-Modell, Funding, Roadmap). *Zuerst lesen.*
- `docs/STORY.md` — Storyworld-Bible (Data Underground, GHOST, Linien/Stationen,
  Slogans, Ton-Regeln).
- `docs/MANIFESTO.md` / `src/pages/manifesto.astro` — Mission/Problem/Lösung, Ton.
- `docs/plans/2026-06-13-phase-2-line-g-design.md` — konkretes Stations-Design (G1–G5).
- `src/content/stations/*.md` — die tatsächlich angelegten Stationen (Produkt-Wahrheit).
- `src/lib/copy/en.ts` — gesamte Site-Copy.

## 3. Rein technische Dateien

`src/lib/signals.ts(+test)`, `src/lib/ticket*.ts(+test)`,
`src/lib/network/geometry.ts(+test)`, `src/components/*.svelte`,
`src/components/NetworkMap.astro`, `src/layouts/Base.astro`,
`src/content.config.ts`, `api/subscribe.ts`, `astro.config.mjs`, `tsconfig.json`,
`vercel.json`.

## 4. Copy / Content / Strategie

- **Copy:** `src/lib/copy/en.ts`, `src/pages/{index,manifesto,legal,404}.astro`.
- **Content:** `src/content/stations/*.md`.
- **Strategie:** `docs/VISION.md`, `docs/STORY.md`, `docs/MANIFESTO.md`,
  `docs/adr/001-rebuild-stack.md`, **`docs/adr/002-positioning-case-first-lab.md`
  (führende Positionierungs-Entscheidung 2026-06-15)**,
  `docs/research/2026-06-07-repositioning-research.md`,
  `docs/research/2026-06-07-legacy-site-copy.md`, `program.md`,
  `docs/project-dossier/*` (dieses Dossier).

## 5. Hinweise auf geplante Features

- `docs/ghost-brain.md` — GHOST-LLM-Dienst (GCP) = Phase 3.
- `docs/VISION.md §4` (Migrations-Hinweis) — Auth/Magic-Link/Firestore Identity-Bridge = Phase 4.
- `docs/plans/2026-06-14-network-map-*.md` — Netz-Karte (in Arbeit, Look offen).
- `src/content/stations/{command,intake,the-confident-lie,maschinenraum}.md`
  (status announced/locked) — G2–G5 geplant.
- `docs/plans/2026-06-07-site-rebuild-phase-1.md` — Phasen-Roadmap des Rebuilds.

## 6. Archiv / nicht-aktuelle Ebene (Vorsicht)

`docs/archive/*` (Reality-Wars-Ära, Maya Chen, Investor-Pitch, 8-Level-Curriculum) —
**ausgemustert** (per `docs/VISION.md`/`README.md`). Große Vision-Docs in `docs/`
(`Innovative-Gaming-Mechanics.md`, `Community-Features-2.0-Specification.md`,
`INTERACTIVE-EDUTAINMENT-VISION.md`, `Art-and-Research-Integration.md`,
`Real-World-Data-Integration-Strategy.md`, `TEAM-STRUCTURE.md`,
`TECHNOLOGY-STACK-ARCHITECTURE.md`, `USER-STORIES-AND-ROADMAP.md`,
`FAQ.md`) sind **Aspirations-/Planungs-Ebene**, teils aus der Game-Ära — als
Ideenfundus nutzbar, aber nicht als Ist-Stand. Maßgeblich sind VISION + STORY +
die `plans/2026-06-*` + der tatsächliche `src/`-Code.
