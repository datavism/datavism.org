# datavism.org — Projekt-Dossier für Konzeptarbeit

> **Zweck dieser Datei:** kompaktes, gehaltvolles Briefing zum Einfügen in ChatGPT,
> um an Konzept, Positioning, Curriculum, Produktdesign und Go-to-Market
> weiterzuarbeiten. **Stand:** 2026-06-15. **Quelle:** lokale Codebase + `docs/`.
> **Legende:** `[FAKT]` = direkt im Repo belegt (Pfad genannt) · `[ANNAHME]` =
> plausibel abgeleitet · `[EMPFEHLUNG]` = strategischer Vorschlag, nicht im Repo.

---

## 0. AKTUELLES FRAMING (Founder-Entscheidung 2026-06-15 — `docs/adr/002`)

`[ENTSCHEIDUNG]` **DATAVISM wird vorläufig als „Data-Activism Lab" gerahmt und
Case-first (nicht Course-first) aufgebaut. Die Produktform (Bootcamp / Bewegung /
Lab / Academy) bleibt bewusst offen** und wird aus *Verhalten an einem konkreten
Artefakt* entschieden, nicht aus Debatte.

**Leitformel:** *DATAVISM is a data-activism lab where people learn to investigate
digital power with AI, open data and verifiable methods.*

- **Nächster Meilenstein ist nicht „Bootcamp launchen", sondern „Case #001 — THE
  FOLDER veröffentlichen" + LINE G als *Methode* daran koppeln.** (Nukleus: G1 mit
  verifizierten Daten existiert.)
- **Mission sofort sichtbar, durch einen Case bewiesen** — nicht durch Org-Rhetorik.
- **Identität mehrdeutig, Handlung eindeutig:** genau ein primärer CTA
  (Case öffnen → LINE G starten).
- **Entscheidungs-Trigger ~90 Tage / ~100 LINE-G-Teilnehmende:** Signal A (wollen
  lernen) → Bildungsprodukt · B (wollen beitragen) → Bewegung · C (wollen
  konsumieren) → data-snack-Funnel.
- **Bewusst noch NICHT:** Pricing finalisieren, Cohort verkaufen, B2B/Zertifikat,
  viele Linien, große Community.

> **Lesehinweis:** Die folgenden Abschnitte 1–14 beschreiben das volle Bild
> (auch die „Bootcamp-Lesart" aus VISION/STORY — weiterhin gültig als *eine*
> mögliche Endform). Das **führende strategische Framing der jetzigen Phase** ist
> jedoch dieses Kapitel 0 (Case-first Lab). Wo „Bootcamp/Cohort/Preis" als nahe
> Schritte erscheinen, gilt: das ist die spätere Option, nicht der nächste Schritt.

---

## 1. Executive Summary

`[FAKT, docs/VISION.md §0]` datavism.org war ein „Serious Game über Daten-
Aktivismus mit Python-Lektionen" und wird **neu positioniert als das Bootcamp des
„Data Underground"** — ein AI-Era Data-Skills-Bootcamp. `[FAKT, README.md,
docs/VISION.md §1]` Lernziel ist *nicht* „Python lernen / coden lernen", sondern:
**KI orchestrieren, die richtigen Fragen stellen, Pipelines mit Co-Pilot bauen,
Ergebnisse kritisch prüfen, als Story/Beweis ausspielen.** Output: ausgebildete
**Datavists**, die mit KI eigene Daten-Investigationen durchführen.

`[FAKT, docs/VISION.md §2]` Primäre Zielgruppe sind Gen Z + Millennials ohne
Programmier-Hintergrund, die Manipulation spüren und „mit KI Konzerne entlarven"
wollen; sekundär Journalist:innen/NGOs und Educators/Institutionen. `[FAKT,
docs/MANIFESTO.md, src/pages/manifesto.astro]` Das adressierte Problem ist
algorithmische Intransparenz/Manipulation („You are not the customer. You are the
product being optimized.") — die Lösung: dieselben Werkzeuge zurückrichten.

`[FAKT, docs/STORY.md, docs/VISION.md §3.2]` Der besondere Ansatz: das Curriculum
ist als **U-Bahn-Netzplan** erzählt (Linien = Tracks, Stationen = Hands-on-
Projekte, Endstationen = Capstone-Investigationen gegen „Pantheon"-Gegner), mit
einem KI-Mentor namens **GHOST** und einer **Ehrlichkeits-Regel** (keine
Fake-Stats, kein Tracking — auch nicht ironisch).

`[FAKT, Codebase]` Was existiert: eine statische **Astro-5-Site** (Landing mit
ehrlichem Signal-Counter, Manifest, Legal, Waitlist via geteiltem Mail-Backend),
ein **Ticket-Fortschritts-Store**, und die erste konkrete Station **LINE G / G1
„THE FOLDER"** (cinematische WebGL-Story + Self-Check), plus eine in Arbeit
befindliche **Netz-Karte** (Wortmarke aus Strecken). `[FAKT]` Noch offen: das
restliche Curriculum (G2–G5, Linien K/R/B/V), echte Cohorts, Preis/Checkout, der
GHOST-LLM-Dienst, Auth/Accounts.

`[FAKT, docs/VISION.md §1]` Relevanz 2026: belegter AI-Skills-Gap (59 % der
Organisationen melden eine Lücke, nur 35 % ein reifes Programm — DataCamp/YouGov
2026, zitiert in VISION); im Alltag zählen **angewandte, urteilsbasierte** Skills
mehr als tiefes ML-Engineering. Positionierung deshalb: „AI-augmented Data Work
für Impact", nicht „werde ML-Engineer".

---

## 2. Produktidee in Klartext

- **Name / Marke** `[FAKT, docs/STORY.md §2]`: Projekt heißt **DATAVISM**
  (Neon-Ghost-Logo, `public/brand/svg/`). „The Data Underground" ist **Subline +
  Storyworld-Name**, nicht die Marke. Schwester-Projekt: *Data Snack* (oben,
  serviert) ↔ *DATAVISM* (unten, bildet aus).
- **One-Liner** `[FAKT, README.md, docs/MANIFESTO.md]`: „You won't learn to code.
  You'll learn to **command** — AI, data, and the right questions."
- **Kurzbeschreibung** `[FAKT, VISION §1]`: Bootcamp für AI-gestütztes Data Work
  mit Mission Datenmündigkeit/Daten-Aktivismus; Praxis = Vibe Coding + AI
  Engineering für Data Engineering, Analytics, Data Science.
- **Primäres Nutzenversprechen** `[FAKT/ANNAHME]`: In Wochen vom „Algorithmen-
  Ausgeliefertsein" zur Fähigkeit, mit KI reale Datenfragen selbst zu beantworten
  und als Beweis auszuspielen.
- **Sekundäre Nutzenversprechen** `[FAKT, VISION §1, §5]`: ein teilbares
  Beweis-Artefakt pro Station (Ship-to-earn), eine Community/Bewegung, ein
  KI-Mentor, ein Portfolio statt PDF-Zertifikat („Ticket statt Zertifikat").
- **Positionierung im Markt** `[FAKT, VISION §1]`: bewusstes Gegenteil zu
  Coursera/Standard-Analytics (Anti-Pattern: passives Video, keine Hands-on-
  Projekte, keine strukturierten Pfade).
- **Abgrenzung zu Python-/DS-/Coding-Bootcamps** `[FAKT, MANIFESTO]`: „Die
  Maschinen coden jetzt." Fokus auf Urteilskraft, Frage-Design, Orchestrierung,
  Verifikation — nicht Syntax.
- **Rolle von KI/Vibe Coding** `[FAKT, VISION §3.1]`: KI ist **Co-Pilot beim Tun**,
  kein Chat-Selbstzweck; GHOST erklärt, fordert, prüft mit; Critical-AI-Literacy
  (Halluzinationen/Bias prüfen) ist Querschnitt — GHOST ist sogar selbst
  Übungsobjekt.

---

## 3. Zielgruppen und Personas

`[FAKT, VISION §2]` liefert die Gruppen; die Personas darunter sind `[ANNAHME]`,
abgeleitet aus VISION + MANIFESTO-Ansprache + Didaktik.

**Primär — „Der/die Erwachte ohne Code-Hintergrund"** (Gen Z/Millennial)
- Ausgangslage: spürt Manipulation (Feeds, Preise, Werbung), kann aber „nichts tun".
- Schmerz: ausgeliefert, technisch eingeschüchtert, „Python lernen" wirkt zu hoch.
- Transformation: von ohnmächtig → kann mit KI eine reale Datenfrage beantworten.
- Kann danach: eine Investigation planen, Daten ziehen/strukturieren (Co-Pilot),
  KI-Output prüfen, Ergebnis als Story/Beweis teilen.
- Will NICHT: ein klassischer DS-Kurs mit Mathe/Theorie-Vorlauf, „Hello World".
- Einwand: „Ich kann nicht programmieren" / „Ist das nur KI-Hype?"

**Sekundär — „Journalist:in / NGO / Aktivist:in"**
- Ausgangslage: braucht Daten-Skills für reale Recherchen, wenig Zeit.
- Transformation: schneller von Datensatz zu belastbarer Aussage.
- Will NICHT: Spielerei ohne Substanz; unklare Quellen.
- Einwand: „Hält das einer Faktenprüfung stand?"

**Sekundär — „Educator / Institution"**
- Sucht wirksame AI-Literacy-Programme; B2B/Lizenz/OSS-Curriculum.
- Einwand: „Ist das didaktisch fundiert und seriös?"

**Sekundär/`[ANNAHME]` — „Berufstätige Quereinsteiger:innen"** (Analyst:innen,
Marketer, Operator, Gründer): wollen AI-augmented Data-Skills für den Job.
Im Repo nicht explizit adressiert → Positionierungs-Entscheidung offen (§11).

**Nicht geeignet** `[ANNAHME]`: wer ML-Engineer/Forscher werden will (tiefes
Modellbauen); wer ein anerkanntes Universitäts-Diplom braucht; wer reine
Theorie/Zertifikat-Sammlung sucht.

---

## 4. Kompetenzmodell 2026

`[FAKT-Anker: VISION §3.2 (Domänen je Linie), §3.1 (Didaktik); EMPFEHLUNG für die
Level-Struktur]`

| Level | Leitfrage | Kern-Kompetenzen |
|---|---|---|
| **Foundation** | „Die richtige Frage stellen" | Spec-Denken; Prompts als Specs; KI orchestrieren statt chatten; Quellen-/Datenkompetenz-Grundlagen; technisches Grundverständnis (was ist eine API, eine Tabelle, eine Pipeline) |
| **Practitioner** | „Daten zum Sprechen bringen" | Daten beschaffen & strukturieren mit Co-Pilot (erste Pipeline); Datenqualität beurteilen; einfache Analytics/BI; KI-gestützte Analyse; KI-Output prüfen (Halluzination, Quellen-Check, adversariales Gegenlesen) |
| **Builder** | „Ein Datenprodukt bauen" | Pipelines/Automatisierung; APIs nutzen; Datenbanken; Analytics Engineering; Visualisierung/Dashboards/Sonifikation; Vibe Coding als kontrollierter Entwicklungsprozess; Deployment-/Produktverständnis |
| **Operator** | „Verantworten & ausspielen" | Eval/Critical-AI-Literacy (auch GHOST evaluieren); Governance/Responsible AI; Datenschutz; eine Investigation als Beweis/Story/Kunstwerk veröffentlichen; Capstone gegen einen realen „Gegner" |

`[FAKT, VISION §3.2]` Querschnitte auf allen Levels: **Critical-AI-Literacy + Eval**
und **Artistic Research** (Visualisierung/Sonifikation/narrative Formen — „eine
Capstone darf ein Kunstwerk sein").

---

## 5. Curriculum-Rekonstruktion

`[FAKT, docs/STORY.md §6, VISION §3.2]` Struktur = **Netzplan**: 5 Linien
(G/K/R/B/V), Stationen = Hands-on-Projekte (nie passives Video), Endstation =
Capstone gegen den Pantheon-Gegner. Line G ist die Foundation und „speist alle
Linien". `[FAKT, src/content/stations/*]` Für **Line G** sind 5 Stationen bereits
als Daten angelegt; G1 ist gebaut.

**Die fünf Linien** `[FAKT, VISION §3.2 Tabelle, STORY §6]`:

| Linie | Pate | Domäne (AI-gestützt) | Capstone-Gegner |
|---|---|---|---|
| **G — Foundation** | GHOST | Vibe Coding & AI-Orchestrierung, „die richtige Frage" | — (speist alle) |
| **K** | Key | Tracking-Forensik, OSINT, Crawling + Entity Resolution mit LLM | PANOPTICON |
| **R** | Rook | Ökonomie: Source-Stacking, Joins, Financial Time Series mit Co-Pilot | MAMMON |
| **B** | Bite | Feeds & Streams: Crawler, Real-Time, Retention-Autopsie | THE FEED |
| **V** | Vesper | Klima/Demografie: AI-Wrangling, Langzeit, Archiv | CUMULUS REX |

**Line G — Stationen** `[FAKT, src/content/stations/*.md, docs/plans/2026-06-13-phase-2-line-g-design.md]`:

| # | Titel | Skill | Status | Artefakt |
|---|---|---|---|---|
| G1 | THE FOLDER | Die richtige Frage stellen (Spec-Denken) | **open (gebaut)** | Case File #1 |
| G2 | COMMAND | AI orchestrieren statt chatten (Prompts als Specs) | announced | Command Log |
| G3 | INTAKE | Daten beschaffen & strukturieren mit Co-Pilot | locked | erste Pipeline |
| G4 | THE CONFIDENT LIE | AI-Output prüfen (Halluzination, Quellen-Check) | locked | Verification Protocol |
| G5 | MASCHINENRAUM | Eval — alles zusammen | locked | Eval Report |

**Stations-Anatomie (6 Beats)** `[FAKT, design §4]`: Einfahrt (Header) → Story-Kern
(interaktives In-Browser-Stück mit echten Daten) → „Die Akte" (GHOST-Origin-
Fragment) → Briefing (Mission mit eigenen AI-Tools) → Self-Check (binäre Checks →
Stempel) → Ausfahrt (Share + nächste Station). Pro Station ein **Artefakt**.

**Beispiel G1 „THE FOLDER"** `[FAKT, src/content/stations/the-folder.md,
src/components/TheFolderStory.svelte]`: Story-Kern = scrollbare, echte Ad-Targeting-
Taxonomie (verifiziert: 650.000 Segmente aus dem Xandr/Microsoft-Leak via The
Markup + netzpolitik; RTB-Frequenz 376×/Tag EU via ICCL), persönlicher Turn (die
Seite baut live einen „Ordner über dich"), Skill = die prüfbare Frage formulieren.
Mission (45–90 min, eigene Tools): eine Kategorie wählen, die prüfbare Frage
schreiben (wer vergibt sie? auf welcher Datenbasis? wer kauft sie?). Self-Check →
„self-stamped" Ticket.

`[EMPFEHLUNG]` Module-Bewertungskriterien fehlen im Repo (nur Self-Check-Logik):
für Cohorts (Tier 1) ein Peer-Review-Rubric je Artefakt definieren.

`[ANNAHME]` Die Linien K/R/B/V sind als Konzept/Daten-Stubs vorhanden, aber inhaltlich
noch nicht ausgearbeitet — sie sind die nächste große Curriculum-Arbeit.

---

## 6. Didaktisches Konzept

`[FAKT, VISION §3.1, MANIFESTO]`
- **Lernphilosophie:** Projekt ab Tag 1, „versteckte Didaktik" (Skill im Erlebnis,
  nicht „Lektion 3/12"), Hands-on > passiv, reale öffentliche Datenquellen.
- **Theorie/Praxis/Projekt/Mentoring:** Praxis + Projekte dominieren; GHOST als
  Mentor *im Werkzeug*, nicht auf der Bühne; Theorie nur so viel wie nötig.
- **Warum nicht „erst Python von Grund auf":** `[FAKT, MANIFESTO]` „Die Maschinen
  coden jetzt." Wertschöpfung = Urteilskraft + Orchestrierung, nicht Syntax.
- **KI sinnvoll eingebunden:** als Co-Pilot beim Bauen/Analysieren; transparent
  (GHOST zeigt Tool-Use, macht eigene Fehler sichtbar).
- **Gegen blindes KI-Kopieren:** eine ganze Skill-Stufe/Querschnitt = **KI prüfen**
  (G4 „The Confident Lie", Critical-AI-Literacy, Eval). GHOST selbst wird evaluiert.
- **Urteilskraft aufbauen:** Frage-Design (G1), Spec-Disziplin (G2), Quellen-/
  Verifikations-Praxis (G4), Eval (G5).
- **Portfolio-Projekte:** jede Station liefert ein Artefakt; Capstone = echtes
  Case File im „Vault" (statt Zertifikat).
- **Fortschrittsmessung** `[FAKT, src/lib/ticket.ts]`: stempelbares **Ticket**
  (lokal, ehrlich „self-stamped"); echte Evaluierung durch GHOST ist Phase 3.

---

## 7. Produktformat

| Aspekt | Stand | Beleg / Einordnung |
|---|---|---|
| Tier-Modell | Tier 0 frei · Cohort Sliding-Scale **290/590/990 €** (selbst gewählt) · **25 % Stipendien** | `[FAKT, VISION §3.3 / ADR 006]` |
| Dauer (Cohort) | 8 Wochen, live | `[FAKT, VISION §3.3]` |
| Live vs. async | Tier 0 self-paced; Tier 1 Live-Cohort + Peer-Review + Capstone mit Daten-Partner | `[FAKT, VISION §3.3]` |
| Mentoring | GHOST (KI) primär; Gast-Sessions der data-snack-Crew pro Linie | `[FAKT, STORY §5]` |
| Community | „Datavist-Wall", Anerkennung statt Bezahlung, Data-Jams | `[FAKT, VISION §5, §6]` |
| Credential | **Ticket** (Receipt-Ästhetik, teilbar), Graduierung = Vault-Schlüssel + Case File | `[FAKT, VISION §3.2, STORY §3.4]` |
| Capstone | echte Investigation gegen den Linien-Gegner | `[FAKT, STORY §6]` |
| Preislogik | non-profit, missionsgetragen; **niemals Curriculum-Paywall** | `[FAKT, VISION §7]` |
| Verkauf | Premium-Cohort-Verkauf über data-snack.com, Erfüllung auf datavism.org | `[FAKT, VISION §3.3]` |
| Waitlist | live: „One email when LINE G opens", Double-Opt-In über geteiltes Resend-Backend | `[FAKT, src/components/SubscribeForm.svelte, api/subscribe.ts, VISION §5]` |
| Sprache | EN-first, DE zweite Welle | `[FAKT, VISION §2, STORY §10]` |
| Launch-Trigger | „LINE G OPENS" = G1+G2 live → löst die Waitlist-Mail ein | `[FAKT, design §1/§8]` |

`[FAKT, VISION §8 Roadmap]`: Q3 2026 Reposition/Audit · Q4 2026 Beta-Cohort
(closed, 10–20) + erste Data-Jam · Q1 2027 Public Open (Cohort #1) · Q2 2027+
Cohort #2 + Curriculum v1.0.

---

## 8. Aktueller technischer Stand

`[FAKT, package.json, astro.config.mjs, vercel.json, tsconfig.json]` Stack: **Astro
5.18** (statisch) · **Svelte 5** Islands · **Tailwind v4** (CSS-`@theme` in
`src/styles/global.css`) · **TypeScript strict** · **Vitest 4** · Deploy **Vercel**
(`vercel.json: framework astro`). Zusatz-Deps `three` + `gsap` (nur für die
WebGL-Station `TheFolderStory.svelte`).

| Bereich | Status | Evidenz/Pfade | Einschätzung | Offene Punkte |
|---|---|---|---|---|
| Routing/Pages | vorhanden | `src/pages/{index,manifesto,legal,404,network,ticket}.astro`, `src/pages/line-g/{index,[station]}.astro` | sauber, file-based, statisch | restliche Linien/Stationen fehlen |
| Layout/Brand | vorhanden | `src/layouts/Base.astro`, `src/styles/global.css`, `src/components/GhostLogo.astro`, `public/brand/svg/` | Tokens: signal `#ffd23f`, ink `#050805`, JetBrains Mono | — |
| Content-Modell | vorhanden | `src/content.config.ts`, `src/content/stations/*.md` | Zod-Schema `stations` (line/index/title/skill/status/mission/selfChecks/sources…) | nur Line G befüllt |
| Waitlist | live (env-gated) | `src/components/SubscribeForm.svelte`, `api/subscribe.ts` | Proxy zu geteilter data-snack-Cloud-Function; Double-Opt-In; Honeypot | eigener Absender (`MAIL_FROM_DATAVISM`) offen |
| Ehrlicher Counter | vorhanden | `src/components/TrackCounter.svelte`, `src/lib/signals.ts` (+ Test) | zählt Browser-Events client-seitig, **sendet nichts** | — |
| Ticket/Fortschritt | vorhanden | `src/lib/ticket.ts`+`ticket-storage.ts` (+ Test), `src/components/{StationSelfCheck,TicketView}.svelte` | localStorage, versioniert, CROSSWALK-kompatibel; „self-stamped" | echte Eval (GHOST) = Phase 3; kein Server-Sync |
| Station-Erlebnis | G1 gebaut | `src/components/TheFolderStory.svelte`, `src/pages/line-g/[station].astro` | WebGL/GSAP/WebAudio cinematic; Daten verifiziert | nur G1; three/gsap = schwere Deps |
| Netz-Karte | in Arbeit (Branch) | `src/components/NetworkMap.astro`, `src/lib/network/geometry.ts` (+ Test) | SSR-SVG-Wortmarke „DATAVISM" aus Strecken; Look noch nicht final abgenommen | Look-Iteration offen (Founder unzufrieden); Branch `feat/network-map` |
| Auth/Accounts | **nicht vorhanden** | — | bewusst Phase 4 (Magic-Link/Firestore, VISION §4 Migrations-Hinweis) | — |
| Datenbank | **nicht vorhanden** (in Astro-Site) | — | State = localStorage; Identity-Bridge zu data-snack Firestore geplant | — |
| Analytics/Tracking | **keins** (bewusst) | Footer-Claim, kein Analytics-Code in `src/` | Ehrlichkeits-Regel; nur lokaler Counter | — |
| Payment/Checkout | **nicht vorhanden** | — | Cohort-Verkauf via data-snack geplant | — |
| Env Vars | nur `SUBSCRIBE_ENDPOINT` real | `api/subscribe.ts` | **`/.env.example` ist VERALTET** (Next.js-Legacy: SUPABASE/NVIDIA_NIM/POSTHOG/INVIDEO) → irreführend | bereinigen |
| Tests | vorhanden | `src/lib/{signals,ticket,network/geometry}.test.ts` (Vitest, 14 grün) | Logik-Kerne getestet; keine E2E | — |
| Doku | sehr reich | `docs/` (VISION, STORY, MANIFESTO, ADR, research, plans, archive) | Strategie gut dokumentiert | viele große Vision-Docs sind teils Archiv-/Aspirations-Ebene |

**Technische Risiken** `[FAKT/ANNAHME]`: (a) `.env.example` suggeriert einen Stack,
den die Site nicht nutzt — Verwirrungs-/Sicherheits-Hygiene-Risiko; (b) `three`+`gsap`
als schwere Deps für eine einzige Station — Performance/Bundle-Budget beachten
(die WebGL-Netz-Karte wurde genau deswegen verworfen, siehe Branch-Historie);
(c) Fortschritt nur in localStorage → Verlust bei Browser-Wechsel bis Auth (Phase 4)
existiert.

---

## 9. Landingpage / Copy / Messaging

`[FAKT, src/lib/copy/en.ts, src/pages/index.astro, manifesto.astro]` Alle Site-Texte
liegen zentral in `src/lib/copy/en.ts` (EN). Vorhandene Bausteine:

- **Headline/Hook:** „They track you. Learn to track back."
- **Sub:** „You won't learn to code here. You'll learn to command — AI, data, and the right questions."
- **Slogan:** „The revolution will be computed."
- **Status:** „pre-launch — the bootcamp is being built."
- **Counter:** „trackable signals emitted on this page so far: N … collected by us: 0. not even ironically."
- **Waitlist:** „JOIN THE WAITLIST — One email when LINE G opens. Nothing else. No drip, no funnel." + Double-Opt-In-Datenschutzzeile.
- **Netz:** „THE NETWORK — Five lines. Only open stations run."
- **Manifest (`manifesto.astro`):** „You are not the customer. You are the product being optimized." / „The same tools they use on you. Pointed back." / „When every citizen can analyze data, evil has nowhere to hide."
- **Tonalität:** beißend, knapp, Understatement, Terminal-Ästhetik, kein LinkedIn-Ton (`docs/STORY.md §11`).

**Messaging-Diagnose** `[EMPFEHLUNG]`:
- Stark: das „track back"-Framing, „command, not code", der ehrliche Counter als
  Live-Beweis, „Ticket statt Zertifikat".
- Schwach/Lücke: das *konkrete berufliche/praktische* Nutzenversprechen
  (Job/Skill/Outcome) tritt hinter die Aktivismus-Narrative zurück; die Aktivismus-
  Erzählung könnte berufstätige Quereinsteiger abschrecken. Kein Social Proof
  (bewusst — Ehrlichkeits-Regel; aber Glaubwürdigkeit muss anders entstehen).

**3 mögliche Positionierungen** `[EMPFEHLUNG]`:
1. **Aktivismus-first** (heutiger Stand): „Lerne, Algorithmen zur Rechenschaft zu zwingen."
2. **Skill/Career-first:** „Die Daten-Skills, die 2026 zählen — mit KI, ohne Coden-von-Null."
3. **Maker/Impact-Hybrid:** „Bau echte Datenprodukte gegen echte Systeme — KI als deine Superkraft."

**5 Hero-Headlines** `[EMPFEHLUNG]`:
1. „They track you. Learn to track back." (vorhanden, stark)
2. „Stop trusting the algorithm. Start interrogating it."
3. „The data skills that matter in 2026 — command AI, not syntax."
4. „You don't need to code. You need to ask better questions."
5. „Turn data into evidence. Evidence into change."

**5 Subheadlines** `[EMPFEHLUNG]`:
1. „A hands-on bootcamp where AI is your co-pilot and every project is a real investigation."
2. „No passive videos. No Hello World. Real data, real systems, a real artifact every week."
3. „Learn to orchestrate AI, build pipelines with a co-pilot, and check the machine's work."
4. „Free to learn. Sliding-scale to join a cohort. Funded by the mission, never by selling you."
5. „From overwhelmed to operator — in weeks, not a CS degree."

**5 Waitlist-CTAs** `[EMPFEHLUNG]`:
1. „One email when LINE G opens." (vorhanden)
2. „Get the first ticket."
3. „Join the Underground."
4. „Reserve your seat in Cohort #1."
5. „Notify me when the doors open."

**Stärkster Winkel** `[EMPFEHLUNG]`: „command AI, not code" + „real investigation,
real artifact" — verbindet die Aktivismus-Identität mit einem konkreten,
verkaufbaren Skill-Outcome, ohne die Marke zu verwässern.

---

## 10. Wettbewerbs- und Differenzierungslogik

`[ANNAHME/EMPFEHLUNG, abgeleitet aus VISION §1]`

- **Konkurrenten:** Coding-Bootcamps (Le Wagon, Spiced); Data-Science-Kurse
  (DataCamp, Coursera, Udacity); No-Code/AI-Kurse; Corporate-Weiterbildung;
  YouTube/Self-Learning; uninahe Zertifikate.
- **Warum anders:** (1) „command AI, not code" statt Syntax-Drill; (2) Projekt-/
  Investigation-first mit echtem Artefakt; (3) Mission/Aktivismus-Identität +
  Storyworld (GHOST, Netzplan) = emotionale Differenzierung; (4) Ehrlichkeits-Regel
  (kein Tracking/keine Fake-Stats) als gelebter Beweis; (5) non-profit/Sliding-Scale.
- **Starke Behauptungen:** „du brauchst kein CS-Studium"; „jede Aufgabe macht die
  digitale Welt transparenter".
- **Noch zu belegen:** Lern-Outcome/Employability; dass „command, not code"
  tatsächlich tragfähige Skills erzeugt; GHOST-Mentor-Qualität.
- **Verwässerungs-Gefahr:** zu breit („Engineering + Analytics + Science + Kunst +
  Aktivismus") → Versprechen unscharf; Aktivismus-Ton vs. Career-Nutzen-Ton.

---

## 11. Offene strategische Entscheidungen

> **Leit-Entscheidung bereits getroffen (`docs/adr/002`):** Positionierung =
> **Case-first Data-Activism Lab**, Produktform bewusst offen, Trigger nach
> ~90 Tagen. → Viele Zeilen unten (Zielgruppe, Kern-Outcome, Live-Anteil, Preis,
> Cohort) werden deshalb **nicht jetzt durch Debatte**, sondern durch beobachtetes
> Verhalten an Case #001 + LINE G entschieden. Die Tabelle bleibt als Landkarte
> der Hebel — die Sequenz ist „Artefakt zuerst".

| Entscheidung | Warum wichtig | Optionen | Empfehlung | Risiko bei Nichtentscheidung |
|---|---|---|---|---|
| Primäre Zielgruppe | bestimmt Copy, Curriculum, Preis | Aktivist:innen / Career-Switcher / Pros | spitzer auf eine *primäre* + eine sekundäre fokussieren | diffuses Messaging, niemand fühlt sich gemeint |
| Anspruchsniveau | Foundation-Breite vs. Builder-Tiefe | Einsteiger / gemischt / Pro | Einsteiger-first, mit Builder-Pfad | Über-/Unterforderung, Abbruch |
| Dauer | Erwartung/Preis | 8 Wo Cohort / self-paced / beides | beides (VISION) bestätigen | Planungsunschärfe |
| Preis | Finanzierung/Fairness | Sliding 290–990 + Stipendien | wie VISION, früh testen | kein Revenue-Modell validiert |
| Live-Anteil | Aufwand/Skalierung | async / live / hybrid | hybrid (Tier 0 async, Tier 1 live) | Über-/Unter-Investment |
| KI-Anteil | Kern der Marke | KI-zentral / ergänzend | KI-zentral + Eval-Querschnitt | Hype ohne Substanz |
| Code-Anteil | Versprechen „kein Coden" | null / minimal / sichtbar | minimal & on-demand, ehrlich kommunizieren | Erwartungsbruch |
| Tool-Stack | Lehrbarkeit/Aktualität | fix / tool-agnostisch | tool-agnostisch, Gratis-Tiers | veraltet/Gatekeeping |
| Zertifikat vs. Portfolio | Glaubwürdigkeit | Ticket/Portfolio / Cert | Portfolio + Ticket (VISION) | wahrgenommen „wertlos" |
| B2C vs. B2B | Revenue-Pfad | B2C / B2B / beides | B2C-first, B2B-Lizenz später | Fokusverlust |
| Sprache | Reichweite | EN / DE / beide | EN-first (VISION), DE Welle 2 | Markt-/Zielgruppen-Mismatch |
| Marke/Naming | DATAVISM vs. Underground | wie heute | beibehalten (klar geregelt) | Verwirrung |
| Waitlist-Angebot | Conversion | nur Mail / + Bonus | konkreten Pre-Launch-Nutzen geben | schwache Liste |
| Erster Cohort-Launch | Momentum | Q4'26 Beta | an „LINE G OPENS" koppeln | Launch verschleppt |

---

## 12. Risiken und blinde Flecken

`[FAKT/ANNAHME]`

- **Zu breite Positionierung** (Engineering+Analytics+Science+Kunst+Aktivismus):
  Versprechen unscharf. → Gegenmaßnahme: eine primäre Zielgruppe + ein
  Kern-Outcome spitzen.
- **Aktivismus-Ton vs. Career-Nutzen:** kann zahlende Quereinsteiger abschrecken.
  → Gegenmaßnahme: zweite Messaging-Spur mit klarem Skill-Outcome.
- **KI-Hype-Risiko:** „command AI" klingt nach Buzzword. → Gegenmaßnahme: echte
  Artefakte/Investigationen als Beweis; Eval-Querschnitt sichtbar machen.
- **Glaubwürdigkeit ohne Social Proof** (bewusst keine Fake-Stats): → echte
  Case-Files/Graduates aufbauen, transparent.
- **Didaktik-Risiko:** „kein Python" könnte als „keine echten Skills" gelesen
  werden. → Gegenmaßnahme: Urteilskraft/Verifikation als harten Skill framen.
- **Solo-/Kapazitäts-Risiko** `[ANNAHME]`: sehr ambitionierter Scope (5 Linien,
  GHOST-LLM, Cohorts) für offenbar kleines Team. → eng schneiden: G1+G2 zuerst.
- **Tech-Schuld/Hygiene:** veraltete `.env.example`; schwere WebGL-Deps; kein
  Account-Sync. → bereinigen/budgetieren.
- **GHOST-Abhängigkeit:** der KI-Mentor ist zentral, aber als Dienst (Phase 3)
  noch nicht da. → Stationen müssen ohne ihn funktionieren (tun sie aktuell).

---

## 13. Empfohlene nächste Schritte

`[EMPFEHLUNG]`

**Sofort (7 Tage) — Case-first-Framing umsetzen (ADR 002)**
- **G1 → Case #001 „THE FOLDER"** als öffentliche Akte rahmen (Claim · Quellen · Methode · Unsicherheiten · offene Fragen · Lernpfad · Artefakt · Mitmach-Tür = LINE G). *Output:* veröffentlichbare Case-Seite. *Nukleus existiert (verifiziert).*
- **Landing/Waitlist reframen:** „Lab + Case" statt „Bootcamp"; Waitlist „one email when LINE G opens" → **„join the first investigation"**. *Output:* konsistentes Case-first-Messaging, ein primärer CTA.
- Repo-Hygiene: `.env.example` bereinigen + README aktualisieren; G1-Review + Merge.

**Kurzfristig (30 Tage)**
- **LINE G als Methode/Initiation** finalisieren (G1+G2); G2 braucht echte, gelabelte AI-Transkripte. *Output:* begehbare Eintrittsmethode.
- **Signale A/B/C instrumentieren** (ADR 002) + Review-Termin (~90 Tage) setzen. *Output:* Entscheidung aus Verhalten statt Debatte.
- Netz-Karten-Look klären (generiertes Bild / claude.ai-Design + leichte Animation). *Output:* abgenommener Hero, kein Perf-Loop.

**Pre-Launch**
- „LINE G OPENS": G1+G2 live, G3–G5 mit Drop-Daten — *Output:* Launch-Seite + Waitlist-Mail.
- Beta-Cohort-Format + Rubric definieren (Tier 1) — *Entscheidung:* Live-Anteil, Preis-Test.

**Launch**
- Data-Jam als Top-of-Funnel-Spektakel (VISION §5) — *Output:* öffentliches Event.
- Cohort #1 Verkauf via data-snack-Bridge.

**Nach Cohort #1**
- Case Files in den „Vault"; Datavist-Wall; OSS-/Funding-Re-Eval (ADR 006).

---

## 14. Fragen an mich (Founder)

**Zielgruppe**
1. Wer ist die *eine* primäre Zielgruppe für Cohort #1 — Aktivist:innen, Career-Switcher oder Pros?
2. Sollen Berufstätige/Quereinsteiger explizit adressiert werden (Job-Outcome)?
3. Wie technisch dürfen Teilnehmende beim Start sein (echte Null-Vorkenntnis)?

**Curriculum**
4. Welche Linie nach G zuerst — K/R/B/V — und warum?
5. Wie viel sichtbarer Code ist akzeptabel, ohne „command, not code" zu brechen?
6. Welcher konkrete Tool-Stack wird gelehrt (oder strikt tool-agnostisch)?
7. Wie sieht ein bestandenes Artefakt aus (Rubric pro Station)?
8. Ist „eine Capstone darf ein Kunstwerk sein" Kern oder Nische?

**Format**
9. Beta-Cohort: Größe, Dauer, Live-Anteil, Preis (oder gratis)?
10. Self-paced Tier 0 wie tief — vollständiges Curriculum gratis?
11. Welche Rolle spielt Community/Data-Jam beim ersten Launch?

**Preis**
12. Bleibt Sliding-Scale 290/590/990 + 25 % Stipendien fix?
13. Gibt es ein optionales „Insiders"-Tier?

**Marke**
14. Bleibt der Aktivismus-Ton führend, oder kommt eine Career-Spur dazu?
15. EN-first bestätigt — wann DE?
16. Wie stark soll die data-snack-Verbindung sichtbar sein?

**Tech/Product**
17. Wann kommt Auth/Account-Sync (Ticket-Verlust-Risiko)?
18. Soll GHOST als LLM-Dienst vor oder nach dem ersten Cohort live sein?
19. Wird die Netz-Karte ein zentrales Navigations-/Marken-Element oder ein Teaser?
20. WebGL-Aufwand pro Station — Budget/Standard festlegen?

**Launch**
21. Was genau definiert „LINE G OPENS" (G1+G2 reicht)?
22. Welcher Kanal trägt den Launch (Social, Data-Jam, data-snack-Bridge)?
23. Welche Erfolgsmetrik für Cohort #1 (Anmeldungen, Completion, Case Files)?

**Founder-Market-Fit / Motivation**
24. Was ist dein persönlicher „unfair advantage" für genau dieses Bootcamp?
25. Wie viel Zeit/Team steht real zur Verfügung (Scope-Realismus)?
26. Ist das primär Mission (non-profit) oder soll es dich tragen (Revenue)?
27. Woran würdest du in 6 Monaten erkennen, dass es funktioniert?
