# ADR 002 — Positionierung: Case-First Data-Activism Lab (Ambivalenz als Designprinzip)

**Status:** Accepted
**Datum:** 2026-06-15
**Kontext:** Offene Grundsatzfrage „Ist DATAVISM primär eine *Mission mit
Bildungsprodukt* oder ein *Bildungsprodukt mit Mission*?" (Founder-Strategie-
Session 2026-06-14/15). Die DNA im Repo ist eindeutig **Mission-first**
(`docs/MANIFESTO.md`, „A non-profit digital art project", Ehrlichkeits-Regel,
Tier 0 gratis, Funding über Grants statt VC, Storyworld als Produktlogik —
`docs/STORY.md`, `docs/VISION.md`). Gleichzeitig ist die finale **Produktform**
(Bootcamp / Bewegung / Kollektiv / Lab / Academy) heute weder entscheidbar noch
nötig. Eine zu frühe Festlegung auf „Kursprodukt" oder „Bewegung" zieht das
Projekt in eine jeweils verengende Logik.

## Entscheidung

**DATAVISM wird vorläufig als öffentliches „Data-Activism Lab" gerahmt und
Case-first (nicht Course-first) aufgebaut. Die Produktform bleibt bewusst offen
und wird aus beobachtetem Verhalten an einem konkreten Artefakt entschieden —
nicht aus Debatte.**

**Leitformel (vorläufige Selbstbeschreibung):**
> *DATAVISM is a data-activism lab where people learn to investigate digital power
> with AI, open data and verifiable methods.*

Begründung der Wortwahl: „Lab" ist ein echtes Oberbegriff (forschen / ausbilden /
veröffentlichen / hosten / später Programme verkaufen) → hält Bewegung **und**
Bildung **und** Kunst/Forschung offen. „people learn" hält das Bildungsprodukt
drin, „investigate digital power" die Mission, „AI, open data, verifiable methods"
macht es konkret und grenzt es vom „nächsten Python-Kurs" wie von reiner
Symbolpolitik ab.

**Konkrete Form:**
- **Case-first:** Der nächste öffentliche Schritt ist **Case #001 — THE FOLDER**
  (eine veröffentlichte Untersuchung), nicht eine finalisierte Bootcamp-Landing.
  Nukleus existiert belegt: G1 mit verifizierten Daten (650k Xandr-Segmente,
  RTB 376×/Tag; `experiments/folder-spike/VERIFY-G1.md`,
  `src/content/stations/the-folder.md`).
- **LINE G = Methode/Initiation**, nicht „Foundation-Kurs unseres Bootcamps".
  Framing: *the initiation track for anyone who wants to investigate with us.*
- **Ein Artefakt löst die Blocker, nicht Debatte:** die offenen Entscheidungen
  (Zielgruppe, Kern-Outcome, Scope, Preis, Cohort) werden durch Verhalten an
  Case #001 + LINE G beantwortet.

**Designprinzipien dieser Phase:**
1. **Mission sofort sichtbar — bewiesen durch einen Case, nicht durch Org-Rhetorik.**
   Nicht „Wir sind eine Bewegung", sondern „Hier ist die erste Akte. Lern die
   Methode, um mitzumachen."
2. **Ambivalenz als Real-Option:** Identität bewusst mehrdeutig halten — aber:
3. **Identität mehrdeutig, Handlung eindeutig.** Genau **ein** primärer CTA pro
   Seite (Case öffnen → LINE G starten). Kein konkurrierender Course-/Movement-CTA.
4. **Keine überversprochene Mitmach-Logik:** echte offene Mitarbeit (Desks/Cells,
   Quellen-Einreichung, Review) ist Aspiration, nicht v1. v1-Tür = **LINE G**
   (sofort begehbar). Nichts versprechen, was nicht gehostet werden kann.

## Entscheidungs-Trigger (gegen Drift)

Optionalität ist eine Entscheidung **mit Verfallsdatum**, kein Dauerzustand.
**Review-Checkpoint: ~90 Tage nach Veröffentlichung von Case #001** (oder bei
N≈100 LINE-G-Teilnehmenden, je nachdem was zuerst eintritt). Vorab-Regel:

| Signal | Beobachtung (Metriken) | Richtung |
|---|---|---|
| **A — wollen lernen** | LINE G abgeschlossen, Nachfrage nach Cohorts/Mentoring/Review, Zahlungsbereitschaft | stärker **Bildungsprodukt** |
| **B — wollen beitragen** | Quellen/Recherche geliefert, Case Files geteilt, Nachfrage nach Desks/Cells/Teams | stärker **Bewegung/Kollektiv** |
| **C — wollen konsumieren** | Traffic via data-snack, Bridge-Karten ziehen, Snack→Track-Klicks | stärker **data-snack als Entry** |

Wenn nach dem Checkpoint A ≫ B → Richtung Academy schärfen; B ≫ A → Richtung
Bewegung/Kollektiv; C dominant → data-snack-Funnel priorisieren. Entscheidung
**aus Verhalten, nicht aus Bauchgefühl**.

## Konsequenzen

**Ändert sich:**
- Messaging/Landing: führt mit **Lab + Case**, nicht „Bootcamp". Waitlist von „one
  email when LINE G opens" → **Participation** („join the first investigation" /
  „get access when Case #001 opens").
- Netz-Karte/Hero: gerahmt als *the lab's network — Case #001 open, the rest is the
  method*, nicht als „Bootcamp-Map".
- G1 → **Case #001** ausbauen (Claim · Quellen · Methode · Unsicherheiten · offene
  Fragen · Lernpfad · Artefakt · Mitmach-Tür = LINE G).
- Dossier `docs/project-dossier/*` wird auf dieses Framing nachgezogen.

**Bewusst (noch) NICHT:**
Pricing finalisieren · Cohort #1 verkaufen · B2B/Zertifikatslogik · viele Linien
ausbauen · große Community/Discord/Slack eröffnen · „Bewegung" behaupten, bevor es
einen Case gibt.

**Unverändert gültig:** Ehrlichkeits-Regel, Tier-0-frei, Non-Profit-/Art-Identität,
Storyworld (GHOST/Linien/Ticket/Vault/Pantheon), EN-first (alles aus VISION/STORY).
ADR 001 (Stack) bleibt; diese ADR betrifft Positionierung/Sequenz, nicht Technik.

**Reversibel:** ja — „Lab" ist genau der Zustand, aus dem heraus jede der drei
Richtungen ohne Bruch entstehen kann. Das ist der Zweck der Entscheidung.
