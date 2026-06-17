# THE NETWORK — Map & Visual Canon

**Status:** v2 · 2026-06-16 · Map/Visual-Canon. **Curriculum/Stationen sind
ausgelagert.**
**Gehört zu:** `docs/adr/002-positioning-case-first-lab.md` (Case-first Lab) ·
`docs/VISION.md §3.2` (Curriculum=Netzplan) · `docs/STORY.md §6` (Netzplan) ·
`src/content/stations/*` (Implementierung).

> ⚠️ **Curriculum-Kanon (Single Source of Truth):**
> `docs/curriculum/evidence-engine-v0.1.md` + `docs/curriculum/station-index-v0.1.md`
> + `src/lib/curriculum/lines.ts`. Diese Datei beschreibt nur noch **Map & Visual**
> (Palette, GHOST-Interchange, Karten-Varianten, Build-Vorgaben). Bei Konflikt über
> Linien-/Stationsnamen/Skills/Artefakte gilt **immer** der Curriculum-Kanon.

> **Zweck:** der **eine** verbindliche Bezugspunkt für das Streckennetz — Linien,
> Farben, GHOST-Interchange, die 25 Stationen, Karten-Varianten und ihre
> Einsatzorte. Alle Map-Ausprägungen (Web-Komponente, Hero, Poster, OG, Merch)
> teilen **dieselben Module + Stationen**. Quelle der 25 Stationen: ChatGPT-Entwurf
> „The Curriculum Map" (Entwurf 1), abgeglichen mit dem Repo-Canon.

---

## 1. Prinzip

**Ein System, mehrere Ausprägungen — aber EINE Datenwahrheit.**
Die animierbare Web-Karte und jedes Poster zeigen dasselbe Netz: 5 Linien, je 5
Stationen, eine zentrale GHOST-Interchange. Was sich unterscheidet, ist nur der
*Look/Einsatz*, nie die Module/Stationen.

Konsistent mit ADR 002: Die Map **zeigt** das ganze Netz (meist „geplant"), aber
**live ist nur Line G** (Case-first). Stationen *benennen* ≠ Linien *launchen*.

## 2. Die fünf Linien (kanonisch — Bedeutung NICHT ändern)

| ID | Name | Bedeutung (Domäne) | Pate | Pantheon-Endgegner | Linienfarbe (Vorschlag) |
|---|---|---|---|---|---|
| **G** | GHOST / Foundation | Methode/Initiation: Frage, AI-Orchestrierung, Verifikation | GHOST | — (speist alle) | Grün `#3df07a` |
| **K** | KEY / Tracking & OSINT | Tracking-Forensik, OSINT, Identity Graphs, Monitoring | KEY | PANOPTICON | Gold/Gelb `#f5b700` |
| **R** | ROOK / Economy & Power | Geldflüsse, Eigentümer, Akteure, Leverage | ROOK | MAMMON | Rot `#ff4d4d` |
| **B** | BITE / Feeds & Behavior | Feeds, Streams, Capture, Detection, Retention | BITE | THE FEED | Blau `#4d8dff` |
| **V** | VESPER / Climate & Future | Archiv, Langzeit-Muster, Szenarien, Impact | VESPER | CUMULUS REX | Violett `#b48cff` |

> **NICHT übernehmen:** die in Entwurf 4 erfundene Umbenennung
> (GROUND/KNOWLEDGE/REASON/BUILD/VISION). Sie bricht Paten + Pantheon-Canon.

**Farb-Entscheidung (Founder-approved):** klareres 5-Hue-Schema der Entwürfe wird
übernommen; **Signal-Gelb `#ffd23f` bleibt der UI-/Marken-Akzent** (Buttons, Links,
Hervorhebungen) — entkoppelt von der G-Linie (= grün). Hex-Werte oben sind der
Startpunkt, im Build feinjustierbar. (Grün knüpft an den Neon-Ghost `#39FF14` an.)

> **Offen / abzustimmen:** `src/lib/curriculum/lines.ts` führt abweichende Hex-Werte
> (g `#9cff6e`, k `#ffd23f`, r `#ff4d5a`, b `#3aa7ff`, v `#9b5cff`) — insbesondere
> **K = `#ffd23f` kollidiert mit dem Signal-Akzent**. **Rendering-SoT bleibt
> `src/styles/global.css`** (Palette oben). lines.ts-Farben sind bis zur Abstimmung
> informativ; vor dem Map-Bau angleichen (eine Richtung wählen).

## 3. GHOST-Interchange

Alle Entwürfe zentrieren **GHOST als Umsteige-/Konvergenzpunkt**, an dem die Linien
zusammenlaufen („The Ghost Interchange" / „The Convergence"). **Kanonisch
übernommen:** die Endstation von Line G, **G5 MASCHINENRAUM**, IST die
GHOST-Interchange — der Ort, wo GHOST lebt (`STORY §3.3`) und alle Linien
zusammentreffen. Visuell: zentraler Ghost-Knoten mit Glow/Puls.

## 4. Die 25 Stationen

**Kanon ausgelagert:** Linien, Stationen, Skills, Artefakte, Core Questions →
`docs/curriculum/station-index-v0.1.md` (Übersicht) ·
`docs/curriculum/evidence-engine-v0.1.md` §6–10 (Substanz) ·
`src/lib/curriculum/lines.ts` (Daten) · `src/content/stations/*.md` (Inhalt).

Gemeinsame Stations-Grammatik je Linie: **Orientation → Access → Structure →
Analysis/Verification → Case File.** Line G ist die Methode in Reinform; jede
Spezial-Line endet im „[Gegner] FILE". Aktuelle Stationsnamen (Slugs unprefixed,
z. B. `footprints`, `mammon-file`):

- **G** GHOST/Foundation *(live: G1; G2 announced)* — THE FOLDER · COMMAND · INTAKE · THE CONFIDENT LIE · MASCHINENRAUM
- **K** KEY/Tracking & OSINT *(geplant)* — FOOTPRINTS · SIGNALS · IDENTITY GRAPH · WATCHTOWER · PANOPTICON FILE
- **R** ROOK/Economy & Power *(geplant)* — LEDGER · ACTORS · FLOWS · LEVERAGE · MAMMON FILE
- **B** BITE/Feeds & Behavior *(geplant)* — SOURCE · CAPTURE · NORMALIZE · DETECT · FEED AUTOPSY
- **V** VESPER/Climate & Future *(geplant)* — ARCHIVE · PATTERNS · SCENARIOS · IMPACT · CUMULUS FILE

## 5. Karten-Varianten (ein System, vier Ausprägungen)

| Variante | Basis-Entwurf | Einsatz |
|---|---|---|
| **The Curriculum Map** (interaktiv, Code) | Entwurf 1 | `/network`, Curriculum-Navigation, animierbare Web-Komponente, exportierbares Poster |
| **Underground Hero/Poster** (cinematic) | Entwurf 2 | Landing-Hero, Launch, Social, Manifesto |
| **Brand Key Visual** (Wortmarke aus Strecken) | Entwurf 3 | OG-Bild, Merch, Newsletter-Header, Event-Slide |
| **Explainer** (Sales/Grant) | Entwurf 4 | Deck/Erklärseite — **nur mit korrigierter Taxonomie (Abschnitt 2)** |

Die **animierbare Web-Karte** ist die einzige Code-Variante; die anderen sind
Bild-Assets (generiert). Web-Karte rendert exakt diesen Canon.

## 6. Slogans / Brand-Sätze (aus den Entwürfen übernommen)

Übernehmen (reine Marken-Sätze, **keine** Curriculum-Module):
„DATAVISM is a system. Not a course." · „The map is the mission." ·
„No exit without action." · „You are the node." · „Mind the signal." ·
„Data is infrastructure. Awareness is power." · „Trace more. See clearer. Act wisely."
→ alle kompatibel mit dem Case-first-Lab.

## 7. Build-Vorgaben für die Web-Karte (verbindlich)

- **Datengetrieben** aus der `stations`-Collection + `geometry.ts` — nie hardcoded.
- **Leichtgewichtig:** SSR-SVG / leichtes Canvas. **Kein dauerlaufender WebGL/Three.js-
  Render-Loop** (frühere Lag-Lektion). Animation per CSS/leichtem rAF, **pausiert wenn
  unsichtbar**, respektiert `prefers-reduced-motion`.
- **Animierbar:** Linien zeichnen sich (draw-on), Stationen leuchten **nach Status**
  (nur G live, Rest geplant/gedimmt), GHOST-Interchange pulsiert, Daten-Pulse fließen
  auf Live-Linien.
- **Konsistente Module/Stationen** über alle Zustände (dieser Canon).
- **Stations-Links nativ** (SVG-`<a>`, tastatur-/aria-fest), SSR-Fallback-Liste.
- **Erzählerischer Zustand (optional, später):** Startzustand nur G offen → nach
  Stationen leuchten Knoten → später K/R/B/V sichtbar. „Du bist nicht im Kurs. Du bist
  im Netz."

## 8. Offen / Nächste Schritte

1. `src/content/stations/` um K/R/B/V-Stubs erweitern (status `locked`) → Daten-Canon.
2. Linien-Palette (Abschnitt 2) in `src/styles/global.css` + Komponenten anwenden —
   **beim Map-Bau**, nicht vorher (G entkoppeln: `--color-line-g` grün, `--color-signal`
   bleibt Akzent).
3. `geometry.ts` an den Canon angleichen (25 Knoten) + animierbare Web-Karte aus
   Entwurf 1 bauen.
4. Generierte Bilder als Hero/Poster/OG-Assets ablegen (`public/brand/` bzw. `public/og/`).
