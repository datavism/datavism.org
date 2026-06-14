# THE NETWORK — Map & Curriculum Canon

**Status:** v1 · 2026-06-15 · Founder-approved (Map-Entwürfe + Stations-Satz).
**Gehört zu:** `docs/adr/002-positioning-case-first-lab.md` (Case-first Lab) ·
`docs/VISION.md §3.2` (Curriculum=Netzplan) · `docs/STORY.md §6` (Netzplan) ·
`src/content/stations/*` + `src/lib/network/geometry.ts` (Implementierung).

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
| **G** | FOUNDATION / GHOST | Vibe Coding & AI-Orchestrierung, „die richtige Frage" | GHOST | — (speist alle) | Grün `#3df07a` |
| **K** | TRACKING / OSINT | Tracking-Forensik, OSINT, Crawling + Entity Resolution | Key | PANOPTICON | Gold/Gelb `#f5b700` |
| **R** | ECONOMY / MONEY | Ökonomie, Source-Stacking, Geldflüsse, Macht | Rook | MAMMON | Rot `#ff4d4d` |
| **B** | FEEDS / STREAMS | Feeds, Crawler, Real-Time, Retention-Autopsie | Bite | THE FEED | Blau `#4d8dff` |
| **V** | CLIMATE / FUTURE | Klima/Demografie, Langzeit, Modellierung, Archiv | Vesper | CUMULUS REX | Violett `#b48cff` |

> **NICHT übernehmen:** die in Entwurf 4 erfundene Umbenennung
> (GROUND/KNOWLEDGE/REASON/BUILD/VISION). Sie bricht Paten + Pantheon-Canon.

**Farb-Entscheidung (Founder-approved):** klareres 5-Hue-Schema der Entwürfe wird
übernommen; **Signal-Gelb `#ffd23f` bleibt der UI-/Marken-Akzent** (Buttons, Links,
Hervorhebungen) — entkoppelt von der G-Linie (= grün). Hex-Werte oben sind der
Startpunkt, im Build feinjustierbar. (Grün knüpft an den Neon-Ghost `#39FF14` an.)

## 3. GHOST-Interchange

Alle Entwürfe zentrieren **GHOST als Umsteige-/Konvergenzpunkt**, an dem die Linien
zusammenlaufen („The Ghost Interchange" / „The Convergence"). **Kanonisch
übernommen:** die Endstation von Line G, **G5 MASCHINENRAUM**, IST die
GHOST-Interchange — der Ort, wo GHOST lebt (`STORY §3.3`) und alle Linien
zusammentreffen. Visuell: zentraler Ghost-Knoten mit Glow/Puls.

## 4. Die 25 Stationen (kanonisch)

Skill-Spine Line G: **Frage → Befehl → Fütterung → Prüfung → Eval.**

### G — FOUNDATION / GHOST  *(live: G1; Rest gebaut-baubar — Repo-Canon, unverändert)*
| # | Station | Skill |
|---|---|---|
| G1 | THE FOLDER | Die richtige, prüfbare Frage stellen (Spec-Denken) |
| G2 | COMMAND | AI orchestrieren statt chatten (Prompts als Specs) |
| G3 | INTAKE | Daten beschaffen & strukturieren mit Co-Pilot |
| G4 | THE CONFIDENT LIE | AI-Output prüfen (Halluzination, Quellen, adversarial) |
| G5 | MASCHINENRAUM | Eval — alles zusammen (= GHOST-Interchange) |

### K — TRACKING / OSINT  *(geplant)*
| # | Station | Skill |
|---|---|---|
| K1 | FOOTPRINTS | Die Spuren finden, die ein Ziel im offenen Netz hinterlässt |
| K2 | IDENTITY GRAPHS | Accounts, Aliase, Entitäten zu einem Bild verknüpfen |
| K3 | SOCIAL LATTICE | Beziehungen & Netzwerke um ein Ziel kartieren |
| K4 | GEOLOCATE | Ereignisse/Personen aus offenen Daten räumlich verorten |
| K5 | HUMAN SIGNALS | Verhalten & Muster lesen — ethisch, im legalen Rahmen |

### R — ECONOMY / MONEY  *(geplant)*
| # | Station | Skill |
|---|---|---|
| R1 | VALUE FLOWS | Nachverfolgen, wohin Geld & Wert wirklich fließen |
| R2 | ENTITIES & SHELLS | Eigentümer entwirren (Firmen, Shells, Begünstigte) |
| R3 | PAYMENT RAILS | Transaktionen über die Systeme verfolgen, die sie tragen |
| R4 | OFFSHORE SHADOWS | Finden, was in Verschleierungs-Jurisdiktionen versteckt ist |
| R5 | CAPITAL MACHINES | Sehen, wie Kapital Macht im großen Maßstab verdichtet |

### B — FEEDS / STREAMS  *(geplant)*
| # | Station | Skill |
|---|---|---|
| B1 | SOURCES | Die richtigen Live-Feeds wählen & anbinden |
| B2 | SCRAPERS & PIPES | Pipelines bauen, die mit Co-Pilot im Maßstab sammeln |
| B3 | NORMALIZE | Chaotische Streams in saubere, vergleichbare Daten überführen |
| B4 | ENRICH | Rohstreams joinen, labeln, kontextualisieren |
| B5 | STREAM CONTROL | Echtzeit-Daten überwachen, alerten, beherrschen |

### V — CLIMATE / FUTURE  *(geplant)*
| # | Station | Skill |
|---|---|---|
| V1 | SIGNALS | Schwache Signale früh in Langzeitdaten erkennen |
| V2 | PATTERNS | Struktur & Trends über die Zeit finden |
| V3 | SCENARIOS | Plausible Zukünfte mit KI-Hilfe modellieren |
| V4 | STRESS POINTS | Finden, wo Systeme unter Druck brechen |
| V5 | FUTURE LEVERAGE | Vorausschau in Handlung mit Wirkung übersetzen |

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
