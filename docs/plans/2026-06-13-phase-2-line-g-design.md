# Phase 2 — LINE G Design: „Anatomy of a Judgment"

**Status:** Design v1 · 2026-06-13 · von Frank approved (Brainstorm-Session,
abschnittsweise) — nächster Schritt: Implementation-Plan (writing-plans)
**Gehört zu:** [`VISION.md`](../VISION.md) §3 (Bootcamp) · [`STORY.md`](../STORY.md)
§4 (GHOST) + §6 (Netzplan) · Phase-Master-Roadmap in
[`2026-06-07-site-rebuild-phase-1.md`](2026-06-07-site-rebuild-phase-1.md)
**Schwester-Canon (data-snack `prototype-v2/`):** ADR 006 · CROSSWALK ·
`docs/CANON.md` (Pantheon-Trilogie-Eintrag 2026-06-12) ·
`experiments/strecke-spike/NOTES.md` (Messlatte + Methode)

---

## 0. Die neue Messlatte (Kontext, der NACH der VISION kam)

Franks Produktrichtung vom 2026-06-12/13 (data-snack, gilt explizit als
Qualitätsmaßstab für alles Weitere):

> **„Stories erzählen mit Daten, keine Gimmick-Spielchen — award-winning.
> Cookie Roulette kann vielfach überboten werden."** Und zum STRECKE-Spike:
> **„so und noch viel besser machen wir das für ALLE Snacks."**

Konsequenz für datavism: **Eine Line-G-Station, die sich wie ein Tutorial
anfühlt, ist superseded, bevor sie gebaut ist.** Jede Station ist selbst eine
Daten-Story, die knallt — die Didaktik ist versteckt (VISION §3.1.6), die
Story trägt. Bewährte STRECKE-Werkzeuge: Maßstab-als-Dramaturgie,
Unruhe-Zähler, persönlicher Turn, Bon/Receipt als Share-Artefakt,
Quellen-Stamps an jedem Beat.

## 1. Entschieden (Brainstorm 2026-06-13, je einzeln approved)

| Frage | Entscheidung |
|---|---|
| Station-Modell | **Hybrid:** In-Browser-Story-Kern (STRECKE-Klasse) → echte Mission mit eigenen AI-Tools → Artefakt. Phase 2 ist NICHT auf das GHOST-Gateway (Phase 3) blockiert. |
| Dramaturgie der Linie | **GHOST als roter Faden:** eigenständige Real-Daten-Stories pro Station, GHOSTs Origin-Akte (desertiertes Profiling-Modell, STORY §4.1) öffnet sich Fragment für Fragment. Line Gs Gegner: die Maschine, die selbstbewusst lügt. Endstation: „Eval your mentor". |
| Artefakt-Eval v1 | **Self-Check + Stempel:** harte, ehrliche Checkliste in GHOST-Stimme; Ticket in localStorage; auf dem Ticket steht ehrlich „self-stamped". GHOST-Eval kommt mit Phase 3. |
| Launch-Form | **Eröffnung + Drops:** Launch mit G1+G2 (löst die Waitlist-Mail ein), danach G3/G4/G5 als Station-Drops alle 2–4 Wochen mit eigener Mail. |
| Content-Achse | **„Anatomy of a Judgment":** reale Urteilssysteme als Material (Ad-Targeting, Moderation, Scoring), persönlicher Turn wo möglich, Bridge-Beat am Ende (sobald andere Linien existieren). |

**Vorab-Annahme (offengelegt, unwidersprochen):** Erfolgskriterium von
Line G v1 = die Waitlist-Zusage „One email when LINE G opens" einlösen +
Material für die Q4-2026-Beta-Cohort sein (data-snack `vision.md` §9).

## 2. Die Linie

**LINE G — Foundation. Pate: GHOST. Thema: Urteilsmaschinen.**

Der Lernende lernt AI zu kommandieren, indem er Systeme seziert, die Menschen
beurteilen — die Maschinenklasse, aus der GHOST desertiert ist. Mit jeder
Station öffnet GHOST ein Stück seiner eigenen Akte. Die Linie endet kanonisch
im **Maschinenraum** (STORY §3.3): dort, wo GHOST lebt.

Skill-Spine (VISION §3.2, als Story-Folge): Frage → Befehl → Fütterung →
Prüfung → Eval.

## 3. Die fünf Stationen

| # | Station (Arbeitstitel EN) | Skill | Story-Kern (Browser) | Mission (eigene AI-Tools) | Artefakt |
|---|---|---|---|---|---|
| G1 | **THE FOLDER** | Die richtige Frage stellen (Spec-Denken beginnt) | „Die Maschine hat einen Ordner über dich": Scroll durch die reale Ad-Targeting-Taxonomie (IAB-Kategorien; Datenbasis: Op-004 AdTech Empire Map, drüben verifiziert). Persönlicher Turn: eigenes Google My Ad Center öffnen | Wähl eine Kategorie, die *dich* beurteilt. Formulier die prüfbare Frage: Wer vergibt sie? Auf welcher Datenbasis? Wer kauft sie? | **Case File #1:** Frage + Hypothese + „welche Daten würden es entscheiden" |
| G2 | **COMMAND** | AI orchestrieren statt chatten (Prompts als Specs, Iteration) | „Vague orders made me confident. Confident and wrong." — reale, dokumentierte AI-Transkripte (gelabelt): derselbe Auftrag vage vs. spezifiziert, und was die Maschine jeweils erfand | Nimm deine G1-Frage. Lass eine AI den Recherche-Plan bauen — 3 Iterationen mit Spec-Disziplin; dokumentier das Delta Entwurf 1 → 3 | **Command Log:** Prompt-Evolution + Delta |
| G3 | **INTAKE** | Daten beschaffen & strukturieren mit Co-Pilot (erste Pipeline) | Maßstabs-Dramaturgie (STRECKE-Stil) über die EU **DSA Transparency Database** (echte öffentliche Moderationsentscheidungen — echte Aggregate oder keine) | Zieh mit AI-Hilfe einen Slice der DSA-Daten (CSV), strukturier ihn, beantworte eine Frage daraus | **Erste Pipeline:** Mini-Tabelle/Chart + „was ich der Maschine befohlen habe" |
| G4 | **THE CONFIDENT LIE** | AI-Output prüfen (Halluzination, Quellen-Check, adversariales Gegenlesen) | In-Browser-Beat: 5 AI-generierte Aussagen über den G3-Datensatz, manche subtil falsch (echt vorab generiert, ehrlich gelabelt). Finde die Lüge | Lass eine zweite AI die Arbeit deiner ersten angreifen; prüf gegen die Quelle; protokollier, was überlebt | **Verification Protocol:** was hielt, was starb |
| G5 | **MASCHINENRAUM** *(Endstation)* | Eval — alles zusammen | Die Tür ohne Schild. GHOST übergibt sein eigenes Eval-Protokoll: „They never checked my work. You will." | Strukturiertes Eval — auf GHOST (wenn Phase 3 live) oder auf der AI deiner Wahl mit demselben Protokoll (Fallback eingebaut) | **Eval Report** = erstes eigenes Case File → Ticket komplett |

**Timing-Logik:** G5 landet ~2–3 Monate nach Launch — das Fenster, in dem
GHOST v0 (Phase 3, `ghost-brain.md`) live gehen kann. Linien-Finale und
Geburt des echten GHOST-Terminals fallen zusammen.

**Plattform-Synergie:** G1 nutzt die verifizierte Op-004-Datenbasis — Atlas
oben zeigt die Infrastruktur, Station unten macht sie zur eigenen
Investigation (Atlas↔Operation-Paarung aus data-snack `vision.md` §1.2,
plattformübergreifend).

## 4. Station-Anatomie (sechs Beats, jede Station gleich)

1. **Einfahrt** — Header in Transit-Ästhetik: Linienfarbe (Signal-Gelb),
   Stationsname, leeres Stempelfeld, GHOST-Statuszeile.
2. **Story-Kern** — interaktives In-Browser-Stück. **Ein Svelte-Island pro
   Station, stations-spezifisch** — keine Engine-Abstraktion vor 3+
   Wiederholungen (data-snack-Disziplin). Echte Daten, Quellenzeile mit
   Zugriffsdatum an jedem Beat (`// GHOST · FILE n/5`-Stamps).
3. **Die Akte** — ein authored GHOST-Origin-Fragment pro Station.
   Geskriptete Erzählstimme, als solche erkennbar — **kein simulierter
   Live-Chat.** (Mentor-Dialog = Phase 3.)
4. **Briefing** — Mission mit eigenen Tools: Ziel, ehrliche Zeitangabe
   (z. B. „45–90 min"), tool-agnostisch, funktioniert mit Gratis-Tiers
   (kein Gatekeeping), Vorschläge statt Lösungen (STORY §4.2).
5. **Self-Check** — 3–5 binäre, selbst überprüfbare Checks in GHOST-Stimme.
   Alle Checks → Stempel. Ticket-Wortlaut ehrlich: **„self-stamped"**.
6. **Ausfahrt** — Share-Moment (Stations-OG-Bild + Share-Strip), Teaser/
   Drop-Datum der nächsten Station, später Bridge-Card-Slot.

## 5. Ticket-Mechanik

- localStorage-Store, versioniertes Schema, **CROSSWALK-kompatibel** gebaut
  (`completedStations: string[]` + Timestamps) → wandert beim Magic-Link
  (Phase 4) verlustfrei nach `crew/{emailHash}.datavism`.
- Ticket-Ansicht `/ticket` in Receipt-Ästhetik, teilbar.
- **Keine Fake-Zähler.** Echte Community-Aggregate erst mit anonymem
  Increment-Pfad (STRECKE-Op-Muster, Phase 4).

## 6. Technik-Scope Phase 2

Stack bleibt ADR 001: Astro 5 statisch + Svelte 5 Islands + Tailwind 4 +
Vitest. **Kein Backend-Zuwachs.**

**Neu:**
- Content-Collection `stations` — Zod-Schema: `line`, `index`, `title`,
  `skill`, `status` (`open | announced | locked`), `dropDate`,
  `missionMinutes`, `sources[]` (mit `accessed`-Pflichtfeld), `ogImage`.
- Routen: `/line-g` (Linien-Seite; andere Linien sichtbar aber ehrlich
  „locked") · `/line-g/<station>` (Stations-Template, 6 Beats) · `/ticket`.
- Story-Islands (1/Station), Canvas 2D wo nötig (STRECKE-Learnings:
  Culling, keine Filter, 2019er-Performance-Floor).
- Ticket-Store: pures, TDD-getestetes Logik-Modul + dünner
  localStorage-Adapter.
- Landing-Update: Netzplan-Teaser wird klickbar → `/line-g`; Waitlist-Block
  bleibt und bedient die Drop-Mails (Segment `underground-waitlist`).
- Statische OG-Bilder pro Station.

**Bewusst NICHT in Phase 2:** GHOST-Gateway/LLM-Calls (Ph. 3) ·
Auth/Magic-Link/Firestore (Ph. 4) · vollinteraktive Netzplan-Map ·
DE-Fassung · Receipt-PNG-Generator (Share erst via OG-Links) ·
Consent-Banner (weiterhin null Tracking; Counter bleibt collect-nothing).

## 7. Qualität & Ehrlichkeit

- Vitest für Ticket-/Check-Logik · `build` + `check` grün.
- Review verifiziert die Ehrlichkeits-Regel im Build: keine Netzwerk-/
  Storage-APIs außer dem Ticket-localStorage.
- **Daten-Verifikations-Pass pro Station Pflicht vor jedem Drop**
  (STRECKE-Regel). Alle gezeigten AI-Transkripte sind echt und gelabelt.
- Mobile-first, AA-Kontrast, reduced-motion — wie Phase 1.
- Sprache: **EN-first** (Canon §10), interne Docs deutsch. Ton: Cast-Bible +
  STORY §11; GHOSTs trockener Humor als Gegengewicht zum dunklen Material.

## 8. Vorgehen: Spike zuerst, dann Drops

1. **Spike `experiments/folder-spike/`** (datavism-Repo): G1-Story-Kern als
   Ein-Datei-Spike, null Dependencies, `python3 -m http.server`. Frank
   testet → eskalieren („höher zielen") → erst dann Astro-Bau.
   Voraussetzung: Verifikations-Pass der gezeigten Kategorien gegen die
   Op-004-Datenbasis.
2. **Launch „LINE G OPENS":** G1+G2 live, G3–G5 mit Drop-Daten angekündigt,
   Waitlist-Mail raus.
3. **Drops:** +2–4 Wochen je Station (Kadenz nach Bau-Erfahrung G1/G2
   fixieren), je mit Drop-Mail.

## 9. Bewusst offen (spätere Arbeitsschritte)

- Verifikations-Pass G1 (exakte Taxonomie-Kategorien + Quellen) und G3
  (welcher DSA-Slice).
- Authoring der 5 GHOST-Akten-Fragmente (eigene Schreib-Session, Ton gegen
  Cast-Bible).
- G2-Transkripte: echte AI-Läufe erzeugen, dokumentieren, labeln.
- Stationsnamen final (EN); „MASCHINENRAUM" bleibt ggf. als kanonischer
  Eigenname in der EN-Fassung.
- Exakte Drop-Kadenz.
- Nachtrag der Award-Messlatte in `VISION.md` (kleiner Canon-Sync, separat).

---

*Design v1 · 2026-06-13 · Frank Bültge + Claude · Brainstorm-Session,
alle Abschnitte einzeln approved. Nächster Schritt: Implementation-Plan.*
