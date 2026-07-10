# ADR 003 — Field-Pipeline: Wie Meridian-Werke zu Operationen werden

**Status:** Angenommen — Phase 1 umgesetzt 2026-07-11 (drei Replikations-Operationen);
Phase 2 umgesetzt 2026-07-11 (`scripts/field-sync.mjs`, `/field`-Seiten,
`.github/workflows/field-sync.yml`); Phase 3 umgesetzt 2026-07-11
(Atlas-Snapshot `src/data/atlas/werke.json`, `scripts/update-atlas.mjs`,
`src/lib/atlas.ts`, „FROM THE FIELD" auf den Linien-Seiten)
**Datum:** 2026-07-11
**Baut auf:** [ADR 002](002-field-integration.md) (Field-Integration, Zug 1)
**Betrifft:** `src/lib/command-center/operations.ts` · `src/lib/line-g-opening/cases.ts` ·
`src/lib/command-center/geo.ts` · Command-Center-Komponenten

---

## 1. Kontext

ADR 002 Zug 1: Meridian-Werke werden auf datavism zu **replizierbaren
Operationen**. Die Frage dieses ADRs: über welchen Mechanismus, in welchem
Datenmodell, mit welcher Attribution — und was automatisiert wird vs. was
Handwerk bleibt.

Befund aus dem Code: `Investigation.svelte` kann bereits jeden Launchpad-Case
als Operation fahren (Fallback `operationFor()`); nur die kuratierte,
gescriptete Operation ist als Einzelkonstante `FIRST_OPERATION` verdrahtet.
Der Weg von 1 → n Operationen ist ein kleiner Refactor, kein Umbau.

## 2. Entscheidung

### Phase 1 (jetzt): Handübersetzte Replikations-Operationen

**Die Übersetzung Werk → Operation ist Handwerk und bleibt es.** Meridians
Werke sind dicht; die didaktische Übersetzung (Briefing in GHOSTs Register,
Quellen-Auswahl fürs neue Ziel, Method-Bar) ist genau die Design-Arbeit, die
ADR 002 als Risiko 1 benennt. Nicht automatisieren.

Datenmodell — `Operation` wird erweitert:

```ts
export type Operation = {
  caseId: string          // matcht einen LAUNCHPAD_CASES-Eintrag
  signal: SystemSignal
  briefing: string
  question: string
  source: { title: string; url: string; howTo: string }
  methodBar: { wantsSourceCited: boolean; wantsSpecificFinding: boolean; wantsUncertainty: boolean }
  // NEU (ADR 002/003): Attribution + Ehrlichkeits-Gepäck für abgeleitete Operationen
  derivedFrom?: {
    work: string        // z. B. 'The Two Meters'
    author: 'Meridian'
    shipped: string     // ISO-Datum des Original-Ships
    workUrl: string     // Original im field-research-Repo oder Lab-Render
    anchor: string      // Schlüsselergebnis des Originals als Vergleichsanker
    caveats: string[]   // Limitations des Originals — wandern MIT der Ableitung
  }
}
export const OPERATIONS: Operation[] = [ /* lobby-register-de, + Replikationen */ ]
export function getOperation(caseId: string): Operation | undefined
```

Regeln (aus ADR 002, hier verbindlich gemacht):

1. **Attribution sichtbar im UI:** Jede abgeleitete Operation zeigt im
   Briefing-Schritt „DERIVED FROM *\<work\>* — Meridian, \<date\>" mit Link
   aufs Original. Nie als eigene Forschung ausgeben.
2. **Caveats reisen mit:** Die Ehrlichkeits-Einschränkungen des Originals
   (z. B. „not AI-specific", Pilot-Banner, Trailing-Zero-Mechanik) werden in
   der Operation angezeigt — eine Ableitung darf nie sauberer wirken als ihr
   Original.
3. **Anker statt Lösung:** Das Originalergebnis wird als Vergleichsanker
   genannt (was fand Meridian?), aber die Operation verlangt ein **neues
   Ziel** — die Antwort ist nicht abschreibbar.
4. **Quellen-Disziplin:** Jede URL in Case/Operation stammt aus den
   `SOURCES.md`/`README.md` der Werke oder ist gegen die Quelle geprüft.
   Keine ungeprüften URLs (Ehrlichkeitsregel).
5. Jede Replikations-Operation bekommt einen **eigenen Launchpad-Case**
   (+ Geo-Eintrag) — sie erscheint damit auf der Weltkarte und in allen
   ehrlichen Zählern automatisch.

### Phase 2 (nächster Schritt): Werke-Spiegel via GitHub Action

Analog zu `field-integrate.yml` auf frankbueltge.de: ein Workflow
`field-sync.yml` klont `field-research`, kopiert `works/*/{meta.json,README.md}`
(Path-Boundary, nichts anderes) in eine Astro-Content-Collection
`src/content/field-works/`. Rendering: „FIELD"-Tab im Command Center
(heute schon als disabled-Tab vorhanden) — Werke als lesbare Dossiers,
unverändert, Meridian-signiert, mit Link zur Replikations-Operation, wo eine
existiert. **Nicht in Phase 1:** erst bauen, wenn die ersten Operationen
gelaufen sind und sich das Rendering-Bedürfnis konkretisiert.

### Phase 3 (abhängig): Atlas-Konsum

`werke.json` (214 Werke) wird von frankbueltge.de als versionierter Datensatz
bezogen (Raw-URL aus dem Repo `frankbueltge/frankbueltge.de`,
`docs/feld-archiv/werke.json` — bereits öffentlich) und als Stations-
Referenzen gerendert (ADR 002 Zug 3). Eigene Entscheidung bei Umsetzung:
Build-Time-Fetch vs. committeter Snapshot (Empfehlung: **committeter
Snapshot** mit Update-Script — reproduzierbare Builds, keine Build-Abhängigkeit
von einem fremden Repo).

## 3. Die ersten drei Replikations-Operationen (Phase 1, dieses Repo)

| Operation (caseId) | Aus Werk | Neues Ziel | Signal/Linie |
|---|---|---|---|
| `scope2-twin-invoice` | 012 *The Two Meters* (2026-07-06) | Twin-Invoice-Register für einen weiteren Konzern (z. B. Amazon/Meta/Apple) aus dessen öffentlichem Nachhaltigkeitsbericht | `future` (V) |
| `worldbank-digit-docket` | 009 *The Standing Docket* (2026-07-02) | Ziffern-Tests auf einem anderen World-Bank-Indikator via API-Snapshot | `money` (R) |
| `detector-calibration` | 001 *Calibration Certificate* (2026-07-01) | Kalibrierungs-Check eines KI-Text-Detektors gegen Texte mit bekannter Herkunft | `tracking` (K) — bis Line P existiert |

Die inhaltliche Füllung (Briefings, Quellen, Anker, Caveats) wird aus den
Werken selbst extrahiert und gegen deren `SOURCES.md` geprüft.

## 4. Was sich NICHT ändert

- `Investigation.svelte`-Flow, `flow.ts`-State-Machine, `history.ts` — die
  Operation-Mechanik bleibt; nur die Auflösung `caseId → Operation` wird
  eine Liste statt einer Konstante.
- Der Fallback (jeder Launchpad-Case ist als ungescriptete Operation
  fahrbar) bleibt bestehen.
- Ehrlichkeits-Zähler im Dashboard rechnen weiter aus echten Datenstrukturen
  (`OPERATIONS.length` statt hartem `1`).

## 5. Konsequenzen

- Command Center springt von 1 auf 4 kuratierte Operationen; Muster
  „Werk → Mission" ist etabliert und wiederholbar.
- Der `derivedFrom`-Block ist der Vertrag mit Meridians Verfassung
  (unverändert · attribuiert · Caveats sichtbar) — maschinenlesbar, damit
  Phase 2 ihn rendern kann.
- Neue Fälle auf der Karte machen sichtbar, dass Operationen aus dem
  Forschungsflügel kommen — der narrative Claim (§3.5 STORY.md) bekommt
  UI-Realität.

---

*Erstellt: 2026-07-11 · Frank Bültge + Claude · Phase 1 umgesetzt im selben
Branch (`feat/field-integration`).*
