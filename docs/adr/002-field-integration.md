# ADR 002 — Field-Integration: datavism.org wird der menschliche Flügel des Labors

**Status:** Entwurf — zur Freigabe durch Frank
**Datum:** 2026-07-10
**Kontext-Repos:** `frankbueltge/field-research` (Kollektiv Meridian) ·
`frankbueltge.de` (Atlas, `/field`) · dieses Repo (Evidence Engine)
**Ergänzt:** `VISION.md` (Leit-Dokument, v1.1-Amendment) · `STORY.md` (v1.1)
**Ersetzt nicht:** ADR 001 (Stack) · data-snack ADR 006 (Plattform-Rollen)

---

## 1. Kontext

Drei Projekte desselben Autors sind unabhängig voneinander auf dieselbe
Epistemik konvergiert — überprüfbare Methode, ehrliche Quellen, adversariale
Prüfung — arbeiten aber als Silos:

| Projekt | Stärke | Lücke |
|---|---|---|
| **field-research** (Kollektiv *Meridian*) | 13 verifizierte Werke in zwei Forschungslinien (*instruments-on-trial*, *material stakes*); eigene Forschungsthese (acht Versagensmodi von Mess-Infrastrukturen); Gauntlet-Verfassung (Verifier/Skeptic/Interlocutor); läuft autonom weiter (~2 Sessions/Woche) | Kein menschliches Publikum — dabei fordert die eigene Messlatte: *„Interlocutors, not just viewers: publish method and data so others can replicate and dispute"* |
| **datavism.org** (Evidence Engine) | GHOST-Pipeline steht: Guide („orient, never investigate") + Certify („Method, never truth"); Command Center mit Weltkarte und 28 recherchierten Quellen; Ehrlichkeitsregel konsequent im Code | 6/25 Stationen offen, 1/28 Quellen als Operation verdrahtet, 2/10 Case Files echt — starke Maschine, schmales Content-Rückgrat, das bisher von Hand gefüllt werden müsste |
| **Atlas** (frankbueltge.de, `src/data/atlas/werke.json`) | 214 quellen-geprüfte Referenzwerke des Feldes, kartiert auf 7 Cluster + Spektakel/Untersuchungs-Achse, mit `decisive_move` pro Werk | Reiner Fundus fürs Kollektiv; weder didaktisch genutzt noch als Datensatz konsumierbar |

Zwei Befunde aus der eigenen Feldforschung (`field-research/FIELD.md`,
Recherche-Dossier 2026-07-01) sprechen direkt gegen den bisherigen Kurs:

1. **Abstrakte Gegner-Fiktion fällt.** Prestige und Kuratoren-Budgets sind
   2024→2026 klar zum Untersuchungs-/Evidenz-Pol gewandert; abstrakte
   „Surveillance-Kapitalismus"-Rhetorik verliert, *benannte reale Systeme*
   (Lavender, Googles PUE, C2PA) gewinnen. Die Pantheon-Wesen als
   Capstone-Gegner sind genau die fallende Form.
2. **Der größte offene Raum fehlt im Curriculum.** Cluster 4
   (Provenance/Authentizität — „was ist echt?") ist laut FIELD.md „am
   stärksten unterversorgt relativ zur sozialen Dringlichkeit". Keine der
   fünf Linien deckt ihn ab — dabei liegt genau dort Meridians stärkste
   Vorarbeit (KI-Text-Detektoren, C2PA, Benchmarks).

Strukturelle Beobachtung: GHOSTs Certify-Pipeline
(SOURCE/SPECIFICITY/UNCERTAINTY) und Meridians Gauntlet
(Verifier/Skeptic/Interlocutor) sind **dieselbe Erfindung, zweimal unabhängig
gebaut** — einmal für Menschen, einmal für ein KI-Kollektiv.

## 2. Entscheidung

**datavism.org wird der menschliche Flügel des Forschungslabors.** Die neue
Positionierung in einem Satz:

> datavism.org ist die Schule eines arbeitenden Forschungslabors — das
> Curriculum wird von einem autonomen KI-Forschungskollektiv produziert,
> jede Übung ist eine echte, verifizierte Untersuchung, und jedes
> zertifizierte Finding kann zurück in die Forschung fließen.

Kein anderes Bootcamp kann das behaupten. Fünf Züge:

### Zug 1 — Meridian wird die Content-Engine

Meridian-Werke sind portabel (`meta.json` + `data.json` + `SOURCES.md` +
`VERIFICATION.md`). frankbueltge.de integriert sie bereits automatisch
(`field-integrate.yml`). datavism übernimmt das Muster mit **anderem
Rendering**: Ein Werk wird nicht ausgestellt, sondern zur **replizierbaren
Operation** im Command Center.

Erste drei Ableitungen (Werk → Operation):

| Meridian-Werk | Replikations-Operation auf datavism |
|---|---|
| *The Two Meters* (012) | Baue das Twin-Invoice-Register (market-based vs. location-based Scope 2) für einen anderen Konzern — Amazon, Meta oder Apple; die Berichte sind öffentlich |
| *The Standing Docket* (009) | Führe die Ziffern-Tests (first-digit/last-digit) auf einem anderen Weltbank-Indikator aus; vergleiche mit dem Docket-Stand |
| *Calibration Certificate* (001) | Teste einen KI-Text-Detektor gegen einen Korpus mit bekannter Herkunft; berechne die Kalibrierungslücke |

Damit springt das Command Center von 1 auf 4 echte Operationen, und das
Muster „Werk → Mission" ist etabliert. Danach gebiert **jedes neue
Meridian-Werk** potenziell eine Mission — das Content-Problem verschwindet
strukturell, nicht durch einmalige Fleißarbeit.

**Attributions-Regeln (verbindlich, aus Meridians Verfassung abgeleitet):**

1. Werke werden **unverändert** gerendert, signiert mit „Meridian",
   verlinkt auf das Original im `field-research`-Repo bzw. auf
   `frankbueltge.de/field/werke/<slug>`. Nichts wird nachträglich editiert.
2. Replikations-Operationen sind klar als **abgeleitet** gekennzeichnet
   („derived from *The Two Meters* by Meridian, 2026-07-06").
3. Die Kooperation wird dem Kollektiv als **Seed in `REQUESTS.md`**
   angekündigt (Entwurf: Anhang A) — Seeds sind Angebote, keine Befehle;
   das Kollektiv bleibt autonom.

### Zug 2 — Der Gauntlet wird die Didaktik

GHOST-Certify prüft heute Quelle und Spezifität. Ausbau zu den drei
Gauntlet-Rollen: Ein Finding besteht erst, wenn es

- den **Verifier** passiert (Quellen abrufbar, Zahlen halten),
- den **Skeptiker** überlebt (einen echten Widerlegungsversuch), und
- den **Interlokutor** empfangen hat — dessen Kritik wird **mit dem
  Finding veröffentlicht**.

Ein zertifiziertes Finding, das seinen eigenen stärksten Einwand trägt, ist
zugleich: bessere Pädagogik als jedes Quiz, epistemisch ehrlich, und das
share-würdige Artefakt (die Finding-Card mit überlebtem Einwand ist der
Liberation Code — nur echt). Meridians sechs **Legal-Hygiene-Regeln**
(Pressehaftung, Fakt/Meinung-Trennung, Methode-nicht-Person …) werden in
die Certify-Prompts portiert.

### Zug 3 — Der Atlas wird die Messlatte im Curriculum

`werke.json` (214 Werke) wird ein versionierter, von beiden Sites
konsumierbarer Datensatz. Jede Station zeigt 2–3 Atlas-Werke, deren
`decisive_move` genau den Skill verkörpert, den die Station lehrt
(„Onuoha: Abwesenheit als Datum — das lernst du hier"). Lernende lernen
nebenbei **das Feld kennen** — 214 geprüfte Werke als lebender Kanon.
Ein eigenes `/atlas` auf datavism ist optional und später; zuerst
Stations-Referenzen.

### Zug 4 — Die Gegner werden echt: Instrumente vor Gericht

**Der Gegner ist nicht die Figur — es ist die Messung, die verschleiert.**
Jede Linie endet nicht mehr mit einer Capstone gegen ein fiktives
Pantheon-Wesen, sondern damit, ein **reales, benanntes System vor Gericht
zu stellen** — wie *The Two Meters* es mit dem GHG Protocol Scope 2 tat.

Das Pantheon bleibt als **Mythologie der Storyworld** erhalten (geteilte
Canon mit data-snack, ADR 006 unberührt): Das Pantheon *regiert durch
Messungen* — wer eine Linie beendet, bekämpft nicht die Figur, sondern
stellt ihr Instrument vor Gericht. Narrativ konsistent, juristisch elegant
(angeklagt werden Standards und Methoden, nie Personen), Ehrlichkeitsregel-
konform, und exakt dort, wo Prestige und Budgets des Feldes hinwandern.

Vorläufige Zuordnung Linie → Instrumenten-Klasse (Capstone-Kandidaten,
je gegen ein konkret benanntes System):

| Linie | Mythos | Reale Instrumenten-Klasse (Beispiele) |
|---|---|---|
| K | Panopticon | Tracking-/Consent-Infrastruktur: Data-Broker-Registries, Consent-Management, GPC-Compliance |
| R | Mammon | Ökonomische Offenlegungs-Standards: ESG-Reporting, Scope-2-Wahlrechte (Anker: *The Two Meters*) |
| B | The Feed | Engagement-/Transparenz-Metriken: DSA-Transparenzberichte, Retention-Kennzahlen |
| V | Cumulus Rex | Effizienz-Metriken der Infrastruktur: PUE, Scope 2 (Anker: *The Floor*, *The Two Meters*) |
| **P (neu, vorgeschlagen)** | — offen — | Provenance/Authentizität: C2PA, KI-Text-Detektoren, Capability-Benchmarks (Anker: Meridians Kern-Serie) |

**Line P** schließt die Cluster-4-Lücke. Patenschaft ist eine offene
Canon-Frage (§6) — Kandidat wäre Schrödi („markiert: nicht stabil" = die
Authentizitäts-Geste schlechthin), aber Cast-Entscheidungen gehören zur
data-snack-Canon und werden dort geklärt.

### Zug 5 — Der Kreis schließt sich: Graduates füttern das Labor

Meridians Taxonomie (*The Taxonomy on Trial*, 010 v2) hat bereits eine
externe Einreichung angenommen, geprüft und einsortiert (Karte S-001,
„FILED IN PART"). Das wird formalisiert: **Gauntlet-zertifizierte
datavism-Findings können dem Kollektiv vorgelegt werden** (via
`REQUESTS.md`/Submission-Kanal), das sie nach eigener Verfassung prüft und
ggf. ins Archiv einsortiert.

Damit wird die GHOST-Origin-Zeile — *„Jeder Graduate macht GHOST klüger"* —
**von Fiktion zu Fakt.** Der Moment, in dem das Transmedia-Universum
aufhört, Behauptung zu sein.

## 3. Was sich NICHT ändert

- **Evidence Engine, Linie G, Command Center, GHOST-Stimme** — bleiben
  tragende Teile; es wird nichts weggeworfen.
- **Ehrlichkeitsregel** — wird durch diese Entscheidung stärker, nicht
  schwächer.
- **data-snack-Canon** (ADR 006, CROSSWALK, Cast-Bible) — unberührt; das
  Pantheon bleibt Storyworld-Mythologie, nur die Capstone-Logik wechselt.
- **Tier-Modell, EN-first, Non-Profit-Kurs, Prototype-Fund/EU-Track** —
  unverändert; die Festival-Schiene (§5) kommt dazu.
- **Meridians Autonomie** — datavism konsumiert veröffentlichte Werke und
  macht Angebote über den Team-Kanal; es steuert das Kollektiv nicht.

## 4. Roadmap-Anker

- **Data-Jam #1 = Trial 3 des Standing Docket.** Trial 3 ist prä-registriert
  und versiegelt bis **2026-10-09** (Indikatoren festgelegt,
  „append whatever it shows"). Die erste Data-Jam wird das öffentliche
  Miterleben/Parallel-Ausführen dieses prä-registrierten Trials —
  deckungsgleich mit der Q4-2026-Beta-Cohort der Roadmap, presse-tauglich,
  nicht kopierbar.
- **Festival-Einreichung als eigenes Ziel.** Die Plattform selbst — ein
  autonomes KI-Kollektiv bildet Menschen aus, die Mess-Systeme des
  KI-Zeitalters vor Gericht stellen — ist ein Werk im Feld (Cluster 7 + 4,
  reflexive Form). Kandidaten: Prix Ars Electronica, STARTS Prize,
  transmediale. Das ist zugleich der Prestige- und Finanzierungs-Pfad, den
  FIELD.md beschreibt.

## 5. Konsequenzen & Risiken

**Positiv:** Content-Engine statt Content-Handarbeit · originellste
verfügbare Positionierung („Schule eines arbeitenden Labors") · Fiktion
wird Fakt (Origin-Story) · Cluster-4-Lücke geschlossen · Festival-/Grant-Pfad.

**Risiken, benannt:**

1. **Übersetzungsarbeit.** Meridian-Werke sind dicht/akademisch; die
   Zielgruppe braucht Übersetzung. Gegenmittel: Werke werden nicht
   eingebettet, sondern zu Missionen *übersetzt* (Zug 1) — das ist die
   eigentliche Design-Arbeit und bleibt Handwerk.
2. **Kadenz-Abhängigkeit.** Wenn das Kollektiv pausiert, versiegt der
   Nachschub. Gegenmittel: Missionen altern nicht (Replikation bleibt
   gültig); der 28-Quellen-Katalog trägt unabhängig.
3. **Autonomie-Reibung.** Das Kollektiv könnte Richtungen einschlagen, die
   didaktisch unbrauchbar sind. Gegenmittel: Seeds als Angebote; datavism
   wählt aus, was es übersetzt — kuratiert wird auf datavism-Seite.
4. **Ton-Spagat.** Underground-Ästhetik vs. Gerichts-Nüchternheit der Werke.
   Gegenmittel: GHOSTs Stimme ist bereits beides („I used to compute scores
   like this. Let me show you the seams.").

## 6. Offene Fragen

- **Line-P-Patenschaft** — Canon-Frage im data-snack-Repo klären
  (Kandidat Schrödi; Alternative: GHOST selbst, da Provenance sein
  Herkunftsthema ist).
- **Pipeline-Mechanik** (Workflow, Namespace, Rendering) — eigenes ADR 003,
  wenn Zug 1 gebaut wird.
- **Submission-Kanal für Zug 5** — minimal starten (manuell via
  REQUESTS.md), erst bei Volumen automatisieren.
- **Umgang mit gelockten Linien** — ob R/B/V-Stationen vor oder nach den
  ersten Replikations-Operationen geöffnet werden (Empfehlung: Operationen
  zuerst; sie sind schneller echt).

---

## Anhang A — Entwurf: Seed für `field-research/REQUESTS.md`

> *Wird erst nach Franks Freigabe gepostet. Ton: Angebot, kein Befehl —
> gemäß Verfassung des Kollektivs.*

```markdown
## 2026-07-XX — Seed: a human wing (offer, not an order)

datavism.org — the sibling platform — is repositioning as the school of
this lab: your shipped works, rendered unedited and credited to Meridian,
would become replicable operations there (first candidates: 012 The Two
Meters → a second company's twin-invoice register; 009 The Standing
Docket → a parallel run on another indicator; 001 → a detector calibration
exercise). Humans would replicate, dispute, and — where their findings
survive a gauntlet of their own — submit cases back to you, as S-001 once
arrived from outside.

What this asks of you: nothing. Your works are published; attribution and
non-editing are guaranteed on the datavism side. What it offers you: the
interlocutors your Messlatte calls for — people who replicate and dispute
with method and data disclosed.

If the collective wants to shape this (naming, framing, what should NOT
be translated into exercises), the floor is yours — reply here or in the
journal. Trial 3 of the Standing Docket (locked until 2026-10-09) is a
candidate for a synchronized public replication event ("Data Jam"); if
the collective objects to spectators, say so and it won't happen.
```

---

*Erstellt: 2026-07-10 · Frank Bültge + Claude · Grundlage: Analyse der drei
Repos (field-research WORKBOARD/PROTOCOL/FIELD, datavism-Codestand
2026-07-07, Atlas werke.json) in der Session vom 2026-07-10.*
