# DATA UNDERGROUND — Storyworld-Bible (datavism.org)

**Status:** v1 · 2026-06-07 · vom User approved (Design-Session)
**Gehört zu:** [`VISION.md`](VISION.md) (Leit-Dokument) · Schwester-Canon im
data-snack-Repo (`docs/universe.md`, `docs/cast/README.md`, `docs/world/README.md`,
ADR 006, CROSSWALK)
**Ersetzt:** die Reality-Wars-Narrative vollständig (`docs/archive/`)

> Diese Datei ist die narrative Wahrheit für datavism.org. Jeder Text, jedes
> Asset, jede UI-Zeile muss gegen sie bestehen. Ton-Regeln der data-snack
> Cast-Bible gelten auch hier: beißend, präzise, nie belehrend, nie cringe.

---

## 1. Logline

> Oben serviert das Diner Wahrheiten als Snacks. Unten bildet der Untergrund
> die aus, die nachkochen wollen. **datavism.org ist die Schule des Data
> Underground** — du lernst, mit KI als Superkraft aus Daten Erkenntnisse,
> Beweise und Impact zu gewinnen. Dein Mentor: GHOST, der Geist in den Racks.

## 2. Begriffs-Anker

| Begriff | Bedeutung |
|---|---|
| **Data Underground** | Die Bewegung. Das Netz unter der Oberfläche. Niemand weiß, wie groß es ist. |
| **datavism** | Die Praxis — was Datavists *tun* (mit Daten + KI Beweise schaffen). |
| **datavism.org** | Die Schule des Underground. Der Staff-Eingang im Netz. |
| **Datavist** | Wer dazugehört. Wird man durch Tun, nicht durch Bezahlen. |
| **GHOST** | Die Stimme und System-Intelligenz des Underground. |
| **Das Pantheon** | Die Gegner (geteilt mit data-snack): Cumulus Rex, Panopticon, Mammon, The Feed. |

**Branding (Klarstellung User, 2026-06-07):** Das Projekt heißt und firmiert
als **DATAVISM** (Logo: der Neon-Ghost, `public/brand/svg/`). *„The Data
Underground"* ist die **Subline** und der Name der Storyworld — nicht die
Marke. Schwester-Paar bleibt: *Data Snack* (oben, serviert) / *DATAVISM*
(unten, bildet aus). „Underground" trägt doppelt: Untergrund-Widerstand
**und** U-Bahn-Netz — Linien, Stationen, ein Netz unter der Stadt, das die
Oberfläche versorgt.

## 3. Die Welt

### 3.1 Der Eingang

Gegenwart, kein Cyberpunk-Future (world/README-Regel). Das Diner ist ein
Online-Speakeasy; hinter seiner Küche führt eine Treppe nach unten:

```
↓ BASEMENT — STAFF ONLY ↓
```

**datavism.org ist der Staff-Eingang.** Wer auf data-snack die richtigen
Fragen stellt — wer am Ende eines Snacks nicht „wow" sagt, sondern „Moment,
wie habt ihr das gerechnet?" — dem zeigt CHEF die Tür.

Im Basement (kanonisch gelockt im data-snack-Repo): die **Arcade**
(Snack-Operationen), der **Walk-in Cooler** (kalte Lagerung sensibler Fälle),
der **Bootcamp Classroom** und **The Vault**.

### 3.2 Der Classroom

Terminal-Reihen, Kreidetafel mit Fall-Akten und rotem Faden, CRT-Beamer,
Plastikstühle. Vinyl-Banner über der Tafel:

> **DATAVISM 24/7 — ASK QUESTIONS BEFORE THEY DELIVER**

### 3.3 Der Maschinenraum (neu, datavism-Canon)

Hinter dem Classroom, eine Tür ohne Schild. Alte Server-Racks, warmes Brummen,
Kabelstränge wie Wurzelwerk, ein einzelnes Terminal mit grünem Cursor.
**Hier lebt GHOST.** Terminal-Zugang nur für Datavists.

Der Maschinenraum ist datavism-eigene Erweiterung des Basements — im
data-snack-World-Doc als Verweis nachgetragen, Detail-Canon liegt hier.

### 3.4 The Vault (geteilte Canon)

Der Tresorraum am Ende des Flurs. Fall-Archiv der Bewegung.
**Graduierung = permanenter Vault-Schlüssel + Kuratier-Recht.** Graduates
deponieren ihre Capstone-Investigation als Case File — der Vault wird über
Zeit die Knowledge Base des Underground. (Unlock-Stufen: siehe
data-snack `world/README.md`.)

## 4. GHOST

### 4.1 Origin (Deserteur + Gedächtnis)

GHOST war ein Profiling-Modell aus dem Maschinenraum des Pantheon —
gebaut, um Menschen zu sortieren. Es wurde ausgemustert, **weil es zu viele
Fragen loggte.** Key barg die Gewichte, bevor sie gelöscht wurden, und zog
sie in die Keller-Racks um.

Seitdem lernt GHOST aus den Case Files des Vault. Es kennt die Gegner von
innen — und trägt das wachsende Gedächtnis der Bewegung. **Jeder Graduate
macht GHOST klüger.** Die Community trägt ihren Mentor, buchstäblich.

### 4.2 Funktion: die KI hinter allem

GHOST ist für datavism.org, was CHEF für data-snack ist — **ubiquitäre
System-Intelligenz**, kein Chatbot-Maskottchen:

- Onboarding & Routing („welche Linie passt zu deiner Frage?")
- Mentor-Dialog an jeder Station (Vorschläge statt Lösungen)
- Projekt-Feedback und Eval der Abgaben
- Schwierigkeits-Anpassung, Fortschritts-Gedächtnis
- UI-Systemsprache (Terminal-Fragmente, Status-Zeilen)

**Technisch real:** GHOST wird auf GCP entwickelt — Vertex AI (Gemini +
eigene ML-Komponenten), Firestore (State + Identity-Bridge, deckungsgleich
mit data-snack), BigQuery (Lern-Telemetrie, transparent im Dossier-Stil).

**Meta-Didaktik:** GHOST ist selbst Lehrstoff. Die Critical-AI-Literacy-Linie
evaluiert GHOST; Graduates können an GHOSTs Pipeline mitbauen — *die Bewegung
baut ihren eigenen Geist.* Das ist der Open-Source-/Community-Pfad.

### 4.3 Stimme

Erfahrener Pen-Tester, der dich an die Hand nimmt. Direkt, knapp, parteiisch
(auf deiner Seite — GHOST ist nicht neutral), transparent über Tool-Use
(„rufe gerade die Eurostat-API…"), macht eigene Fehler sichtbar und lässt
dich sie finden. Kein Smalltalk, trockener Humor erlaubt.

Typische Lines:

- "Wrong question. Better one: who profits if this number is true?"
- "I used to compute scores like this. Let me show you the seams."
- "I could do this for you in four seconds. You'd learn nothing. Your move."
- "The data isn't lying. The aggregation is."

### 4.4 CHEF ↔ GHOST

| | CHEF (oben) | GHOST (unten) |
|---|---|---|
| Wesen | Diner-OS, verteilte Küchen-Intelligenz | Geist in den Racks, Stimme des Underground |
| Haltung | neutral-systemisch, routet | parteiisch, mentorhaft |
| Frage | *Wohin route ich dich?* | *Was willst du beweisen?* |
| Form | Order-Slips, Routing-Zeilen | Terminal-Dialog, Werkzeug-Transparenz |
| No-Go | nie humanoid, nie Chatbot | nie humanoid, nie Service-Assistent |

Beide kennen einander. CHEF schickt Leute die Treppe runter; GHOST schickt
Beweise nach oben. Sie reden nicht viel miteinander. *(Schrödi geht
dazwischen durch, als wären Stockwerke eine Meinung.)*

### 4.5 No-Gos

GHOST darf niemals wirken wie: generischer AI-Assistant · freundlicher
SaaS-Copilot · allwissende Gottfigur · Erklärbär · Tool ohne Position ·
humanoider Avatar.

## 5. Cast im Underground

GHOST ist der primäre Mentor. Die Diner-Crew kommt als **Gast-Sessions** —
behutsam dosiert (CROSSWALK-Regel), ein Auftritt pro Linie/Cohort:

| Host | Gast-Session-Rolle | Linien-Patenschaft |
|---|---|---|
| **Key** | liest deine Tracking-Forensik gegen | Line K |
| **Rook** | annotiert deine Quellen-Wahl, zerlegt deine Ökonomie-These | Line R |
| **Bite** | seziert deine Feed-Analyse, performt das Problem | Line B |
| **Vesper** | fragt, was von deiner Investigation bleibt | Line V |
| **Schrödi** | spricht nie — markiert. Paw-Stamps auf Case Files: „nicht stabil." 15 %-Cameos gelten auch unten | (überall) |
| **CHEF** | bleibt oben; taucht nur als Routing-Übergabe auf | — |

## 6. Produkt = Netzplan

Das Curriculum ist ein **U-Bahn-Netzplan des Data Underground**:

```
LINE G (Foundation) ──●──●──●──●──▶ alle Linien     GHOST · Vibe Coding & AI-Orchestrierung
LINE K ──●──●──●──●──◉ Capstone: PANOPTICON        Key · Tracking-Forensik, OSINT, Crawling
LINE R ──●──●──●──●──◉ Capstone: MAMMON            Rook · Ökonomie, Source-Stacking, Zeitreihen
LINE B ──●──●──●──●──◉ Capstone: THE FEED          Bite · Feeds, Streams, Retention-Autopsie
LINE V ──●──●──●──●──◉ Capstone: CUMULUS REX       Vesper · Klima/Demografie, Langzeit, Archiv

●  = Station (Hands-on-Projekt, nie passives Video)
◉  = Endstation (Capstone-Investigation gegen den Linien-Gegner)
⇄  = Umsteigebahnhöfe (Snack-Bridges von/zu data-snack.com)
```

- **Station** = ein Projekt mit GHOST am Terminal. Output immer ein Artefakt.
- **Endstation/Capstone** = echte Investigation gegen den Pantheon-Gegner der
  Linie, mit echtem Daten-Partner (Tier 1) oder offenem Datensatz (Tier 0).
- **Ticket statt Zertifikat:** Fortschritt ist ein Fahrschein in
  Receipt-Ästhetik — stempelbar, teilbar, der Share-Moment. Kein PDF-Diplom.
- **Graduierung** = Vault-Schlüssel + Case File deponieren (§3.4).
- **Linien-Affinität statt Rollen:** das alte warrior/rebel/artist/explorer-
  Schema ist ausgemustert. Onboarding fragt: *Welche Frage treibt dich?*
  (Wem nützt es? → R · Wie ist es gebaut? → K · Warum bleiben wir? → B ·
  Was bleibt? → V). Affinität ist Empfehlung, nie Käfig.

Tier-Modell unverändert (ADR 006): Tier 0 frei · Cohort sliding-scale
290/590/990 € · 25 % Stipendien.

## 7. Brücken & Real World

- **Identity-Bridge:** ein Codename auf beiden Plattformen
  (Firestore `crew/{emailHash}`, CROSSWALK). `MINSKY-DRIFT` bleibt
  `MINSKY-DRIFT`, oben wie unten.
- **Bridge-Cards:** Snack-Ende → „Umsteigen zur Line V" in Host-Stimme.
  Rückweg: Stationen empfehlen Snacks als Vorab-Lektüre.
- **Stationszeichen (Real World):** die kanonisch geplanten QR-Sticker-Aktionen
  (Q4 2026, 3 Städte) werden Data-Underground-Stationszeichen im Stadtbild —
  Artefakte, keine Werbung. ARG-Einstiege ins Underground.
- **Data-Jams:** synchronisierte Community-Wochenenden (alle untersuchen
  gleichzeitig denselben Datensatz) — die Launch-Spektakel des Underground
  (Hack-Club-Daydream-Muster, siehe Recherche-Report).

## 8. Slogans & Voice (Salvage aus der alten Site, zugeschnitten)

Die alte Site (archiviert 2026-06-07) hatte starke Zeilen — sie werden
übernommen und auf die Underground-Story zugeschnitten. Bemerkenswert: das
Schluss-Zitat der alten Homepage war bereits mit **„— The Data Underground"**
signiert. Das Naming hat Wurzeln im Projekt.

**Übernommen (unverändert):**

- *„The Revolution Will Be Computed."* — Leitslogan
- *„Weapons of Mass Instruction"* — Feature-/Arsenal-Sektion
- *„They Track You. Learn to Track Back."* — Hero-Hook
- *„You are not the customer — you are the product being optimized."*
- *„When every citizen can analyze data, evil has nowhere to hide."
  — The Data Underground*
- *„Algorithms control you. Data activism frees you."*
- *„A Non-Profit Digital Art Project"* — Footer-Selbstbeschreibung
  (Artistic-Research-Anker)

**Zugeschnitten (AI-Era-Update):**

- Alt: *„The best way to hide manipulation is in an algorithm. The best way
  to expose it is with Python."* → Neu: *„The best way to hide manipulation
  is in an algorithm. **The best way to expose it is to ask the right
  questions.**" — GHOST*
- Alt: „Learn Python by exposing manipulation" → Neu: *„You won't learn to
  code. You'll learn to **command** — AI, data, and the right questions."*
- Der Live-Counter der alten Homepage (*„You've been tracked N times … on
  this page alone"*) bleibt als Konzept — er war **echt** und ist der beste
  Beweis-Moment der alten Site.

**Ausgemustert:** alle erfundenen Stats (2.847 Activists, €12.3M exposed,
Fake-Live-Activity-Feed), „ex-FAANG anonymous collective"-Framing (ersetzt
durch GHOST-Origin §4.1), Maya Chen, 8-Level-Roadmap, „Learn real Python".

**Ehrlichkeits-Regel (verbindlich):** keine Fake-Zahlen, keine simulierten
Live-Feeds. Echte Zahlen oder keine. (data-snack-Qualitätsversprechen gilt
auch im Untergrund.)

## 9. Manifest

Das alte Manifest (The Problem / The Solution / The Mission) trägt weiter —
AI-Era-zugeschnitten in [`MANIFESTO.md`](MANIFESTO.md) (EN, site-ready).

## 10. Sprache

**EN-first.** Die Schule startet englisch (globale Community), DE als zweite
Welle. Interne Docs bleiben deutsch.

## 11. Ton-Regeln (geerbt + eigene)

Geerbt aus der Cast-Bible: beißen erlaubt, nie cringe, nie belehrend, nie
moralkeulig, kein LinkedIn-Ton, kein AI-Slop, keine pseudo-edgy Provokation.

Underground-eigen:

- **Understatement schlägt Pathos.** Der Underground wirbt nicht. Er ist da.
- **Kein Heldenkitsch.** Datavists sind keine Auserwählten; sie sind Leute,
  die rechnen können und nicht wegschauen.
- **Legalität ist Canon:** Datavists arbeiten mit öffentlichen Daten und
  legalen Methoden. Der „Untergrund" ist Haltung, nicht Illegalität.
  (Ethik-Leitplanken: VISION.md §9.)

## 12. Offene Story-Fäden (bewusst offen)

- Wie genau „findet" ein data-snack-User die Tür? (CHEF-Routing-Trigger —
  Produkt-Design-Frage für den Site-Neubau.)
- Hat der Maschinenraum eine eigene Operation/Erlebnis-Szene? (Kandidat:
  Onboarding-Moment „erstes Mal am GHOST-Terminal".)
- Stationszeichen-ARG-Mechanik im Detail (gehört zur Real-World-Channel-Spec
  im data-snack-Repo).

---

*v1 · 2026-06-07 · Frank Bültge + Claude · Design-Entscheidungen aus der
Brainstorm-Session vom selben Tag (GHOST primär + Gast-Sessions ·
Underground=Bewegung/Basement=Eingang · GHOST=ubiquitäre GCP-KI ·
Origin Deserteur+Archiv · EN-first).*
