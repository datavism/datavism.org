# THE NETWORK — Design Spec: the DATAVISM transit map

**Status:** Design v1 · 2026-06-14 · Brainstorm mit Frank, abschnittsweise approved
("Zieh durch" → Spec + Plan). **Gehört zu:** [`VISION.md`](../VISION.md) §3.2
(Curriculum = Netzplan) · [`STORY.md`](../STORY.md) §6 (Produkt = Netzplan) ·
Phase-2-Arbeit auf `feat/line-g-g1` (stations-Collection, Ticket-Store, G1).

> **Eine Zeile:** Das Curriculum-Netz wird eine **kinoreife, interaktive Karte des
> Bootcamps**, die sich — Strecke für Strecke ausgebaut — zur **ikonischen
> Wortmarke DATAVISM** fügt. Gleiche WebGL-Banger-DNA wie die G1-Station.

---

## 0. Rollen & Abgrenzung

- **Der Neon-Ghost bleibt das Logo** (Header, Favicon, klein). Wird NICHT ersetzt.
- **THE NETWORK = die Karte** — zwei Oberflächen: Landing-**Hero** (ersetzt den
  aktuellen `NetworkMapTeaser`) und eine eigene interaktive **`/network`-Seite**.
- Voll ausgebaut fügt sich das Netz zum **DATAVISM-Bild** (Hero/OG/Poster-tauglich) —
  ein emergentes starkes Bild, kein header-tauglicher Wortmarken-Ersatz.
- **Name:** „THE NETWORK" (Canon: `COPY.map.heading`). Route: `/network`.

## 1. Das Bild & sein Aufbau

- **Grundebene — das „geplante Netz":** Das volle „DATAVISM" liegt immer als
  **blasses, gestricheltes** Netz da. → Das Wort ist ab Tag 1 lesbar (das Ziel)
  und ehrlich als „noch nicht gebaut" markiert (Transit-Konvention: dashed = im Bau).
- **Aktivebene — die 5 Paten-Linien** (G/K/R/B/V) weben durch dieses Skelett.
  **Line G = Rückgrat/Stammlinie** (Canon: „speist alle Linien") — die horizontale
  Grundlinie des Wortes; **K/R/B/V** zweigen in die Buchstabenformen ab.
- **Wachstum:** Jede live gehende Linie **leuchtet solide + farbig auf** (animiertes
  Draw-on). Mit jeder Strecke vervollständigt sich das Wort. **Heute:** Line G solide,
  K/R/B/V gestrichelt-geplant.
- **Datengetrieben:** solide vs. gestrichelt folgt dem `status` der Stationen aus der
  `stations`-Collection. Eine neue Linie live zu schalten = Daten, kein neuer Code.

## 2. Legende — was die Karte darstellt

| Element | Bedeutung |
|---|---|
| **Linie** (farbiger Strang) | Curriculum-Track (G/K/R/B/V), Paten-Farbe aus `@theme` |
| **Station** (Knoten) | Hands-on-Projekt; Zustand offen/announced/locked |
| **Endstation** (Ring/Doppelring) | Capstone gegen den **Pantheon-Gegner** der Linie |
| **Umsteige** (Interchange) | Snack-Bridge zu/von data-snack.com (CROSSWALK) |
| **Oberflächen-Eingang** (oben) | Das Diner / der Staff-Eingang (`↓ BASEMENT`) |
| **MASCHINENRAUM** (Landmark, an G5) | GHOSTs Zuhause — hier erscheint der **Neon-Ghost als Landmark** |
| **The Vault** (Landmark) | Graduierung / Case-File-Archiv |
| **Dein Ticket** | gestempelte Stationen liegen markiert auf der Karte (aus dem Ticket-Store) |

Landmarks erscheinen auf der **großen** Karte (`/network`); der Hero ist schlanker.

## 3. Zwei Oberflächen

- **Landing-Hero** (ersetzt `NetworkMapTeaser.astro`): das Netz als starkes Bild,
  ambient lebendig (Daten-Pulse fließen), Line G live & klickbar → `/line-g`, Rest
  gestrichelt. Kompakter Ausschnitt, kein freies Pan/Zoom nötig.
- **`/network`** (volle Karte): Pan/Zoom, Hover/Klick auf Stationen (→
  `/line-g/<station>`) und Linien (→ `/line-g`), Landmarks, Legende, Ticket-Overlay.
  Mobil: schwenkbar; Pinch-Zoom; reduced-motion-fest.

## 4. Technik-Architektur

**Stack:** Astro 5 statisch + **three.js** (schon als Dep via G1) + GSAP + Tailwind v4.
Dieselbe Postprocessing-DNA wie `TheFolderStory.svelte` (Bloom, Grain, Vignette,
Signal-Gelb), damit Station und Karte **eine Welt** sind.

### 4.1 Schichten (Compositing)
1. **WebGL-Canvas (three.js)** — das Spektakel:
   - **Linien** als glühende Geometrie (Tube/Instanced-Segmente). Solide (live) vs.
     gestrichelt (geplant) via Shader/`dashSize`. Octolinear (0/45/90°, gerundete Ecken)
     = liest sich als Transit UND als Buchstaben.
   - **Knoten** (Stationen): Neon-Punkte; Varianten offen (gefüllt+glow) / announced
     (Ring) / locked (gedimmt) / terminus (Doppelring).
   - **Daten-Pulse / „Züge":** Partikel/Glints fließen entlang der Linienpfade
     (Shader-Animation über Pfad-Parameter `t`) — macht das Netz lebendig.
   - **Postprocessing:** UnrealBloom + Final-Shader (Aberration/Vignette/Grain),
     wiederverwendet aus der Station.
   - **Kamera:** Orthographic; GSAP-getriebenes Pan/Zoom; sanftes Ambient-Drift im Hero.
2. **DOM/SVG-Interaktionsebene** (über dem Canvas, transform-synchron zur Kamera):
   - Scharfe, **klickbare/fokussierbare** Hotspots pro Station & Linie
     (`<a>`/`<button>` mit `aria-label`), Tooltips/Labels (Text gehört ins DOM, nie
     in WebGL → scharf + a11y + SEO).
3. **SSR-Fallback** (Astro, ohne JS): eine **semantische Liste** der Linien + Stationen
   + Status (im Kern die heutige `/line-g`-Information) → crawlbar, no-JS-lesbar,
   reduced-motion-Basis.

### 4.2 Datenmodell
- **`src/lib/network/geometry.ts`** — die **authored Geometrie** (reine Daten):
  Koordinatenraum, pro Linie der Pfad (geordnete Punkte/Knoten im DATAVISM-Layout),
  Knoten-Positionen (referenzieren Station-`id`), Landmark-Positionen, Interchange-Knoten.
  Pure, testbare Daten — kein Rendering.
- **`stations`-Collection** bleibt Single Source of Truth für Stations-Meta
  (`status`, `title`, `skill`). Die Geometrie **positioniert** sie; der Status **färbt** sie.
- **Linien-Definitionen:** `id` (g/k/r/b/v), Farb-Token, Pate, Terminus-Gegner, Pfad-Ref.

### 4.3 Engine-Trennung
- **`src/lib/network/engine.ts`** — framework-agnostische three.js-Engine: nimmt
  Geometrie + Status-Daten, baut Szene/Linien/Knoten/Pulse/Postprocessing/Kamera,
  exponiert `mount(canvas, opts)`, `setView()`, `destroy()`. Kein Svelte-Bezug.
- **`src/components/NetworkMap.svelte`** — Insel: rendert SSR-Fallback-Liste, mountet
  in `onMount` die Engine (dynamischer/normaler Import three), legt die DOM-Hotspot-Ebene
  an, verdrahtet Klick/Tastatur/Hover, hört auf reduced-motion / no-WebGL → Fallback.
  Prop `variant: 'hero' | 'full'`.

### 4.4 Dateien (Überblick)
- Create: `src/lib/network/geometry.ts` (+ `geometry.test.ts`), `src/lib/network/engine.ts`,
  `src/components/NetworkMap.svelte`, `src/pages/network.astro`.
- Modify: `src/pages/index.astro` (Hero: `NetworkMap variant="hero"` statt Teaser),
  `src/lib/copy/en.ts` (Network-Legende/Strings). `NetworkMapTeaser.astro` wird abgelöst
  (entfernt oder als SSR-Fallback-Markup recycelt).

## 5. Honesty, a11y, Performance (verbindlich)

- **Zeigt nur, was existiert:** live = solide, geplant = gestrichelt. Keine Fake-Linien,
  keine erfundenen Stationen.
- **Kein Tracking, kein Netzwerk** außer Bundle. Ticket-State nur aus `localStorage`.
- **a11y:** DOM-Hotspots tastatur-fokussierbar, `aria-label`, sichtbarer Fokus; Labels
  als echter Text; AA-Kontrast; die SSR-Liste ist die zugängliche Wahrheit.
- **reduced-motion:** keine Pulse/keine Kamera-Animation → statisches Bild + Liste.
- **no-WebGL / Low-End:** Fallback auf die SSR-Liste (wie heutiges `/line-g`).
- **Perf:** Instancing, gekappte Partikel, Pause bei `document.hidden`, 2019er-Floor
  (STRECKE-Regel). Pixel-Ratio gedeckelt.

## 6. Der ehrliche Knackpunkt: die Geometrie

Die eigentliche Handwerks-Hürde: **5 Linienpfade so legen, dass ihre Vereinigung
„DATAVISM" ergibt** — gleichzeitig **lesbar**, **wie eine echte (octolineare) Transit-
Karte** und **ikonisch**. Vorgehen (da kein Visual-Companion):
1. Geometrie in `geometry.ts` als Koordinaten setzen (Line G = horizontales Rückgrat
   = Wort-Grundlinie; K/R/B/V als Auf-/Abstriche der Buchstaben; Interchanges an
   Buchstaben-Kreuzungen).
2. **Screenshot-Iteration** (Playwright, 1200×630) bis das Wort sitzt — erst grob als
   Pfad-Vorschau, dann mit Glow.
3. Erst danach Pulse/Postprocessing/Politur.
Akzeptanz: ein Laie erkennt „DATAVISM" UND „U-Bahn-Karte" ohne Erklärung.

## 7. Scope & Phasen

Frank: **Hero + `/network` zusammen.** Reihenfolge im Implementation-Plan:
1. **Geometrie/Identität** (`geometry.ts`) als statisches Pfad-Bild validieren (Screenshot-Iteration).
2. **Engine** (Linien/Knoten/Status, solide vs. gestrichelt) + Bloom.
3. **Daten-Pulse** + Kamera-Pan/Zoom + DOM-Hotspot-Ebene (Interaktivität).
4. **Hero** in die Landing einsetzen (Teaser ablösen) + **`/network`-Seite**.
5. **Ticket-Overlay** + Landmarks (Maschinenraum/Ghost, Vault, Eingang).
6. **Wachstums-Mechanik** verifizieren (Status-Flip → Linie leuchtet auf; rein datengetrieben).

**Bewusst NICHT jetzt:** echte Geo-Koordinaten/Map-Engine · DE-Fassung · Animationen
für künftige Linien-Launches als Event (kommt mit dem jeweiligen Linien-Bau).

## 8. Erfolgskriterien

- Sieht aus wie eine **echte, ikonische Verkehrskarte** (kein steriler Glyph).
- Liest sich unzweideutig als **DATAVISM**.
- **Ehrlich:** zeigt nur Existierendes (G live, Rest geplant).
- **Navigierbar:** Station/Linie klick- & tastaturbar → richtige Route.
- **Wächst sichtbar** mit jeder Strecke (datengetrieben).
- **Mobil + zugänglich + reduced-motion-fest**, `build`+`check`+`test` grün.
- Fühlt sich an wie **dieselbe Welt** wie die G1-Station (DNA-Kohärenz).

## 9. Offen (später / im Plan zu klären)

- Exakte Geometrie-Koordinaten (Phase 1, iterativ).
- Branch-Strategie: baut auf `feat/line-g-g1` (stations/ticket) — eigener Branch
  `feat/network-map` davon abzweigen oder integriert.
- Landmark-Visuals (Ghost-am-Maschinenraum) — Detail in Phase 5.
- OG-Bild des vollen Netzes (kann die bestehende Playwright-Render-Pipeline nutzen).

---

*Design v1 · 2026-06-14 · Frank Bültge + Claude · Brainstorm, abschnittsweise approved.
Nächster Schritt: Implementation-Plan (writing-plans).*
