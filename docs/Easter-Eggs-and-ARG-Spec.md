# Easter Eggs & ARG — Real-World / Transmedia-Spec

> Wie DATAVISM in den öffentlichen Raum reicht — und wie versteckte Ebenen
> diegetisch, ehrlich und kanon-konform bleiben. Konsolidiert verstreute Ideen
> aus [`STORY.md`](STORY.md) §7, [`VISION.md`](VISION.md),
> [`INTERACTIVE-EDUTAINMENT-VISION.md`](INTERACTIVE-EDUTAINMENT-VISION.md) und
> [`Art-and-Research-Integration.md`](Art-and-Research-Integration.md).
> **Kanon-Quelle bleibt `STORY.md`** — diese Spec spezifiziert, sie widerspricht nicht.

## 0. Geltung

- **Was hier steht:** Prinzipien, ein Layer-Modell (digital → physisch) und
  erste, heute schippbare Easter Eggs.
- **Was hier nicht steht:** die physische Logistik der Stationszeichen-Kampagne
  (Q4 2026). Die Detail-Channel-Spec ist laut `STORY.md` §12 im
  **data-snack-Repo** verortet. Dieses Dokument ist der **datavism.org-seitige**
  Anker — die digitalen Türen, auf die das Physische später zeigt.

## 1. Prinzipien (verbindlich)

1. **Echt oder gar nicht.** (Ehrlichkeits-Regel, `STORY.md` §8.) Ein Easter Egg,
   das „etwas Verstecktes in der realen Welt" verspricht, muss auf etwas
   **Echtes** zeigen. Eine Koordinate ist ein Versprechen — entweder sie löst
   real ein, oder sie ist erkennbar Bühnenbild, nie Fake-Geheimnis.
2. **Kein Tracking — auch nicht ironisch.** Das Footer-Versprechen
   („no tracking on this page. not even ironically.") ist Canon. Easter Eggs
   erheben **keine** Telemetrie, setzen keine Cookies, „messen" keine Finder.
   Die Belohnung ist das Erlebnis, nicht ein Lead.
3. **Diegetisch, nie Marketing.** Stimme = GHOST / Underground. „Artefakte,
   keine Werbung" (`STORY.md` §7). Understatement schlägt Pathos.
4. **Legalität ist Canon.** Öffentliche Daten, legale Methoden; öffentlicher
   Raum nur, wo erlaubt (`STORY.md` §11, `VISION.md` §9).
5. **Belohnung, nie Hürde.** Kein Inhalt, den Nutzer *brauchen*, wird hinter ein
   Egg versteckt. Progressive Enhancement gilt auch hier: wer nichts sucht,
   verliert nichts.
6. **Progressiv & billig zuerst.** Digital vor physisch, Brotkrumen vor
   Schatzkarte. Jede Ebene funktioniert allein und deutet die nächste an.

## 2. Kanon-Stand (aus `STORY.md` §7 „Brücken & Real World")

- **Stationszeichen (Real World):** QR-Sticker-Aktionen, Q4 2026, 3 Städte →
  „Data-Underground-Stationszeichen im Stadtbild — Artefakte, keine Werbung.
  ARG-Einstiege ins Underground."
- **Data-Jams:** synchronisierte Community-Wochenenden (alle untersuchen
  gleichzeitig denselben Datensatz) — Launch-Spektakel.
- **Identity-Bridge / Bridge-Cards:** ein Codename über datavism.org ↔
  data-snack (`crew/{emailHash}`, CROSSWALK).
- **Status:** Mechanik-Detail bewusst offen (`STORY.md` §12).

## 3. Ideen-Fundus (aspirational — kuratiert, Legacy entkernt)

Aus den Vision-Docs als Steinbruch nutzbar, **nicht** als Kanon:

- Geolocation-Missionen („Find a manipulation in your city"), QR-unlock-
  Challenges (`INTERACTIVE-EDUTAINMENT-VISION.md` §5 / Phase 3).
- AR-Street-Art, „hidden messages in real ads", Koordinaten-Drops,
  Real-World-Puzzle-Hunts (`Art-and-Research-Integration.md` Part III).
- ⚠️ **Nicht übernehmen:** der Legacy-Cast (Maya Chen, Handler, AEGIS,
  8-Level) — von `STORY.md` ausgemustert.

## 4. Layer-Modell (leicht → schwer)

Eine Leiter: jede Stufe ist für sich sinnvoll und kann die nächste anteasern.

**L0 — Digital, Null-Infrastruktur** (heute, ohne Backend)
- Konsolen-Gruß von GHOST (DevTools) mit erstem Brotkrumen.
- `view-source`-Fragmente (Manifest-Zeile, Koordinate, ASCII-GHOST).
- Versteckte statische Route (`/underground/…`) als „Tür".
- Tastatur-/Klick-Trigger (z. B. Logo-Sequenz) → der `decode`-Effekt aus
  `src/scripts/fx.ts` ist schon da.
- *Ehrlich:* zeigt auf echten (internen) Inhalt, kein Tracking.

**L1 — Diegetische digitale Tiefe**
- GHOST-Fragment-Kette: jede gefundene Seite gibt das nächste Hinweis-Token.
- „Decode"-Mini-Puzzle (Caesar / Base32 einer echten Botschaft).
- *Ehrlich:* lösbar; Lösung führt zu realem Inhalt (Case File, Manifest-Teil).

**L2 — Brücke digital ↔ real**
- **Ticker-Koordinate echt machen** → versteckte Seite / Stationszeichen-
  Standort (siehe §6).
- Cross-Link zu data-snack (Identity-Bridge).

**L3 — Physisch** (Kanon, Q4 2026)
- Stationszeichen-Sticker (QR → diegetische Einstiegsseite aus L0/L1).
- Data-Jams als öffentliche Events.

**L4 — Voll-ARG**
- Koordinierte Multi-Channel-Hunts (Web + Print + Event), zeitlich getaktet.

## 5. Erste Umsetzung (Vorschlag, heute schippbar)

Drei kleine L0/L1-Eggs, je mit Akzeptanzkriterium — alle tracking-frei,
diegetisch, reduced-motion-/SSR-sicher:

1. **GHOST-Konsolen-Gruß.** Beim Laden eine stille GHOST-Zeile in der Konsole +
   ein einzelner Brotkrumen (Pfad oder Koordinate). Kein Netzwerk-Call, kein
   Logging. *Akzeptanz:* erscheint einmal, bricht nichts, kein Tracking.
2. **Ticker-Koordinate auflösen** (§6): zeigt nicht mehr ins Leere.
3. **Versteckte „Tür"** (z. B. `/underground/ghost`): statische, nicht
   verlinkte Seite in GHOST-Voice, `noindex`, deutet L1/L3 an — der Einstieg,
   auf den später die physischen Stationszeichen zeigen. *Akzeptanz:* existiert,
   nicht indexiert, bricht nichts.

## 6. Fall: Die Ticker-Koordinate

- **Status quo:** `37.7749°N 122.4194°W` (San Francisco) in
  `src/components/site/Ticker.astro` → zeigt auf nichts. Reines Deko-Flavor
  ⇒ verstößt gegen Prinzip 1.
- **Optionen:**
  - **(a) Echt machen** — Koordinate = realer (geplanter) Stationszeichen-
    Standort *oder* symbolischer Ort mit digitaler Tür dahinter, auffindbar.
  - **(b) Bewusst-symbolisch** — als erkennbares Bühnenbild belassen, aber im
    Code-Kommentar als solches markiert (kein „Geheimnis"-Versprechen).
  - **(c) Entfernen** — wenn keiner der beiden Wege getragen wird.
- **Empfehlung:** (a), sobald der erste Stadt-Standort steht; bis dahin (b)
  ehrlich kennzeichnen.

## 7. Offene Fäden / zu entscheiden

- Welche 3 Städte (Stationszeichen Q4 2026)? Koordinaten-Kanon daran knüpfen.
- Lebt die ARG-Detail-Mechanik hier oder im data-snack-Repo? (`STORY.md` §12
  sagt data-snack → dann ist *diese* Spec der datavism-seitige Anker.)
- Belohnungs-Ökonomie: bleibt jedes Egg rein narrativ, oder schaltet es echte
  Inhalte frei (Case File / Vault-Unlock)?
- Naming der versteckten Routen — konsistent zur U-Bahn-/Stations-Metapher.

---

*v1 · 2026-06-20 · Frank Bültge + Claude · konsolidiert `STORY.md` §7/§8,
`VISION.md`, `INTERACTIVE-EDUTAINMENT-VISION.md`,
`Art-and-Research-Integration.md` · Kanon-Quelle bleibt `STORY.md`.*
