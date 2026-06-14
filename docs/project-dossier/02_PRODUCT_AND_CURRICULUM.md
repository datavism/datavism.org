# 02 — Produkt & Curriculum (datavism.org)

**Stand:** 2026-06-15. **Legende:** `[FAKT]` (Repo-belegt) · `[ANNAHME]` ·
`[EMPFEHLUNG]`. Quellen v.a. `docs/VISION.md`, `docs/STORY.md`,
`docs/MANIFESTO.md`, `docs/plans/2026-06-13-phase-2-line-g-design.md`,
`src/content/stations/*`.

> **Framing-Update (`docs/adr/002`):** Die Produktform ist bewusst offen
> (**Case-first Data-Activism Lab**). Das Curriculum unten ist die ausgearbeitete
> *Methoden-Substanz*; die jetzige **Verpackung** ist aber nicht „Bootcamp-Kurs",
> sondern: **Case #001 = THE FOLDER** (öffentliche Untersuchung) und **LINE G =
> die Methode/Initiation, um mitzumachen** (*„the initiation track for anyone who
> wants to investigate with us"*) — nicht „Foundation-Kurs". Cohort/Preis/Zertifikat
> sind spätere Optionen nach dem 90-Tage-Trigger, nicht der nächste Schritt.

## 1. Produktvision

`[FAKT, VISION §0–§1]` DATAVISM ist das Bootcamp des „Data Underground": ein
AI-Era-Data-Skills-Bootcamp, das Menschen befähigt, **mit KI als Superkraft** aus
Daten Erkenntnisse, Beweise und Impact zu gewinnen — Praxis statt Syntax,
Investigationen statt isolierter Notebooks. Mission: Datenmündigkeit + Daten-
Aktivismus. Selbstbeschreibung: „A Non-Profit Digital Art Project."

`[FAKT, MANIFESTO]` Leitsatz: „We don't teach you to code. The machines code now.
We teach you to **command**." Die drei Manifest-Säulen: Problem (algorithmische
Manipulation, „you are the product being optimized"), Lösung (dieselben Werkzeuge
zurückrichten, durch reale Investigationen), Mission (eine Generation **Datavists**
ausbilden; „when every citizen can analyze data, evil has nowhere to hide").

## 2. Zielgruppen (Kurzform — Details in `00_CHATGPT_TRANSFER.md` §3)

`[FAKT, VISION §2]` Primär: Gen Z/Millennials ohne Code-Hintergrund. Sekundär:
Journalist:innen/NGOs/Aktivist:innen; Educators/Institutionen. `[ANNAHME]`
Potenziell: berufstätige Quereinsteiger:innen (im Repo nicht explizit adressiert —
strategische Lücke, s. `04_OPEN_QUESTIONS`).

## 3. Lernziele (FAKT-Anker, EMPFEHLUNG-Formulierung)

Nach dem Foundation-Track kann eine Teilnehmer:in:
1. eine **prüfbare Frage** an ein reales Urteils-/Datensystem formulieren;
2. eine **KI orchestrieren** (Prompts als Specs, iterieren) statt nur zu chatten;
3. mit Co-Pilot **Daten beschaffen & strukturieren** (erste Pipeline);
4. **KI-Output prüfen** (Halluzination, Quellen-Check, adversariales Gegenlesen);
5. das Ergebnis als **Beweis/Story/Artefakt** ausspielen und teilen.

## 4. Kompetenzmodell (Foundation → Practitioner → Builder → Operator)

Siehe `00_CHATGPT_TRANSFER.md` §4 (identische Matrix). Kernidee: **echte
Fähigkeiten** (Frage-Design, Datenmodellierung, Pipelines, Datenqualität, APIs,
Automatisierung, Analytics Engineering, BI, KI-gestützte Analyse, AI-assisted
Coding/Prompting/Debugging, Datenbanken, Deployment-/Produktverständnis,
Governance/Responsible AI) statt Tool-Listen. Querschnitte: Critical-AI-Literacy +
Eval und Artistic Research.

## 5. Curriculum-Module (Netzplan)

`[FAKT, STORY §6, VISION §3.2]` Linien = Tracks, Stationen = Hands-on-Projekte mit
Artefakt, Endstation = Capstone gegen den Pantheon-Gegner. **Line G = Foundation**
(speist alle Linien).

### Line G — Foundation (Pate GHOST) — die einzige aktuell ausgearbeitete Linie

Stationen-Spine (Skill-Folge): **Frage → Befehl → Fütterung → Prüfung → Eval.**

**G1 — THE FOLDER** `[FAKT, gebaut]`
- Lernziel: die richtige, prüfbare Frage stellen (Spec-Denken beginnt).
- 2026-Relevanz: in der KI-Ära ist die Frage der Hebel, nicht die Syntax.
- Skills: Frage-Design, Quellen-/Datenkompetenz-Grundlagen.
- Story-Kern: scrollbare reale Ad-Targeting-Taxonomie (verifiziert: 650.000
  Segmente, Xandr-Leak; RTB-Frequenz 376×/Tag EU, ICCL). Persönlicher Turn:
  die Seite baut live einen „Ordner über dich".
- Mission (45–90 min, eigene Tools): eine Kategorie wählen; prüfbare Frage
  schreiben (wer vergibt sie? Datenbasis? wer kauft sie?); benennen, welche Daten
  es entscheiden würden.
- Artefakt: **Case File #1**. Bewertung (Self-Check): 3 binäre Checks → „self-stamped".
- Voraussetzungen: keine.

**G2 — COMMAND** `[FAKT, announced]`
- Lernziel: AI orchestrieren statt chatten (Prompts als Specs, Iteration).
- Skills: Spec-Disziplin, Prompt-Evolution, Delta-Dokumentation.
- Mögl. Übung: dieselbe Aufgabe vage vs. spezifiziert; dokumentieren, was die
  Maschine jeweils erfindet. `[FAKT, design §3]` braucht **echte, gelabelte
  AI-Transkripte**.
- Artefakt: **Command Log** (Prompt-Evolution + Delta).

**G3 — INTAKE** `[FAKT, locked]`
- Lernziel: Daten beschaffen & strukturieren mit Co-Pilot (erste Pipeline).
- Mögl. Datenbasis `[FAKT, design §3]`: EU DSA Transparency Database (echte
  öffentliche Moderationsentscheidungen).
- Artefakt: **erste Pipeline** (Mini-Tabelle/Chart + „was ich der Maschine befahl").

**G4 — THE CONFIDENT LIE** `[FAKT, locked]`
- Lernziel: AI-Output prüfen (Halluzination, Quellen-Check, adversariales Gegenlesen).
- Mögl. Übung: 5 AI-Aussagen über den G3-Datensatz, manche subtil falsch — finde
  die Lüge; zweite AI greift die erste an; gegen die Quelle prüfen.
- Artefakt: **Verification Protocol** (was hielt, was starb).

**G5 — MASCHINENRAUM (Endstation)** `[FAKT, locked]`
- Lernziel: Eval — alles zusammen.
- Story: GHOST übergibt sein eigenes Eval-Protokoll („They never checked my work.
  You will."). Strukturiertes Eval auf GHOST (sobald Phase 3 live) oder auf einer
  AI der Wahl (Fallback).
- Artefakt: **Eval Report** = erstes eigenes Case File → Ticket komplett.

**Stations-Anatomie (6 Beats)** `[FAKT, design §4]`: Einfahrt → Story-Kern → Akte
(GHOST-Fragment) → Briefing (Mission, eigene Tools, Gratis-Tiers, kein Gatekeeping)
→ Self-Check (3–5 binäre Checks → Stempel) → Ausfahrt (Share + Drop-Teaser).

### Linien K / R / B / V `[FAKT (Existenz/Domäne) + ANNAHME (Inhalt offen)]`

| Linie | Domäne | Capstone-Gegner | Beispiel-Snack-Bridge (data-snack) |
|---|---|---|---|
| K (Key) | Tracking-Forensik, OSINT, Crawling + Entity Resolution mit LLM | PANOPTICON | Pegasus Tracker · Data-Broker Anatomy |
| R (Rook) | Ökonomie: Source-Stacking, Joins, Financial Time Series | MAMMON | Wealth Transfer · De-Dollarization |
| B (Bite) | Feeds & Streams: Crawler, Real-Time, Retention-Autopsie | THE FEED | TikTok Autopsy · Sports Betting Boom |
| V (Vesper) | Klima/Demografie: AI-Wrangling, Langzeit, Archiv | CUMULUS REX | AMOC Collapse · Quiet Collapse Korea |

→ Diese Linien sind die **nächste große Curriculum-Arbeit** (Stationen, Daten,
Missionen, Artefakte je Linie). Aktuell nur als Struktur/Pate/Gegner definiert.

## 6. Capstone-Projekte `[FAKT-Anker STORY §3.4/§6, EMPFEHLUNG-Beispiele]`

Capstone = echte Investigation gegen den Linien-Gegner, mit echtem Daten-Partner
(Tier 1) oder offenem Datensatz (Tier 0). Graduierung = **Vault-Schlüssel + Case
File deponieren** (statt Zertifikat). Beispiele `[EMPFEHLUNG]`: K → eine konkrete
Tracking-Kette offenlegen; R → einen Geldfluss/Markt sezieren; B → eine Feed-/
Retention-Mechanik nachweisen; V → einen Langzeit-Klima-/Demografie-Befund
visualisieren/sonifizieren.

## 7. Beispiel-Projektpfade je Persona `[EMPFEHLUNG]`

- **Aktivist:in (Einsteiger):** G (Foundation) → K (Tracking-Forensik) → Capstone
  „eine Tracking-Kette entlarven".
- **Journalist:in:** G → R (Ökonomie/Quellen) → Capstone „einen Geldfluss belegen".
- **Educator/Pro:** G → V (Klima/Archiv) → Capstone als publizierbares Daten-Stück.

## 8. Didaktische Prinzipien `[FAKT, VISION §3.1]`

Projekt ab Tag 1 · strukturierte Pfade mit sichtbarem Fortschritt (Ticket) · GHOST
als KI-Mentor *im Werkzeug* · Hands-on > passiv · Ship-to-earn (Output → Anerkennung
+ teilbarer Beweis) · versteckte Didaktik. **Anti-blindes-KI-Kopieren:** eigene
Skill-Stufe „KI prüfen" (G4) + Eval (G5); GHOST selbst ist Eval-Übungsobjekt.

## 9. Rolle von KI & Vibe Coding `[FAKT, VISION §3.1, MANIFESTO]`

KI = Co-Pilot beim Tun, nicht Chat-Selbstzweck. Vibe Coding = beschleunigter, aber
**kontrollierter** Entwicklungsprozess: man orchestriert + prüft, statt blind zu
übernehmen. Transparenz (GHOST zeigt Tool-Use, macht Fehler sichtbar) erzieht
Urteilskraft.

## 10. Tool-Landschaft `[ANNAHME/EMPFEHLUNG]`

Im Repo bewusst **tool-agnostisch** gehalten (Missionen „funktionieren mit
Gratis-Tiers, kein Gatekeeping", design §4). Plausible Kategorien: ein LLM-Chat/
Co-Pilot (frei), ein Notebook/Sheets-Äquivalent, ein einfacher DB-/CSV-Workflow,
öffentliche Datenquellen (DSA-DB, Eurostat etc.). `[FAKT, docs/ghost-brain.md]`
GHOST selbst soll auf GCP (Vertex AI/Gemini + ML, Firestore, BigQuery) entstehen.

## 11. Zertifikat-/Portfolio-Logik `[FAKT, VISION §3.2, STORY §3.4]`

**Ticket statt Zertifikat:** stempelbarer Fahrschein (Receipt-Ästhetik, teilbar) —
heute lokal/„self-stamped" (`src/lib/ticket.ts`), echte GHOST-Eval = Phase 3.
Graduierung = Vault-Schlüssel + eigenes Case File (Portfolio-Beweis).

## 12. Differenzierung `[ANNAHME/EMPFEHLUNG]`

„command AI, not code" + Investigation-first mit echtem Artefakt + Mission/
Storyworld + gelebte Ehrlichkeit (kein Tracking/keine Fake-Stats) + non-profit/
Sliding-Scale. Risiko: zu breite Domäne (Engineering+Analytics+Science+Kunst+
Aktivismus) → Versprechen schärfen (s. `04_OPEN_QUESTIONS`).
