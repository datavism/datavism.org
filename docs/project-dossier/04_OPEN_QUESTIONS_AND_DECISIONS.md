# 04 — Offene Fragen & Entscheidungen (datavism.org)

**Stand:** 2026-06-15. **Legende:** `[FAKT]` · `[ANNAHME]` · `[EMPFEHLUNG]` ·
`[ENTSCHIEDEN]`.

## 0. Getroffene Leit-Entscheidung (`docs/adr/002`)

`[ENTSCHIEDEN, 2026-06-15]` **Positionierung = Case-first Data-Activism Lab.**
Produktform (Bootcamp / Bewegung / Lab / Academy) **bewusst offen**; entschieden
wird aus Verhalten an **Case #001 + LINE G**, nicht aus Debatte. Leitformel:
*„DATAVISM is a data-activism lab where people learn to investigate digital power
with AI, open data and verifiable methods."* **Trigger:** Review ~90 Tage /
~100 LINE-G-Teilnehmende; Signal A→Bildung, B→Bewegung, C→data-snack-Funnel.

→ **Folge für die Liste unten:** Die Entscheidungen werden nicht aufgelöst, indem
man sie *jetzt* trifft, sondern indem das Artefakt sie *zeigt*. Prinzipien:
**Identität mehrdeutig, Handlung eindeutig (ein CTA)** · **Mission durch Case
beweisen, nicht behaupten** · **keine überversprochene Mitmach-Logik** (v1-Tür =
LINE G).

## 1. Offene strategische Entscheidungen (priorisiert)

P1 = jetzt entscheiden (blockiert anderes) · P2 = vor Pre-Launch · P3 = vor Cohort #1.

| P | Entscheidung | Optionen | Empfehlung | Risiko bei Nicht-Entscheidung |
|---|---|---|---|---|
| P1 | **Primäre Zielgruppe** | Aktivist:innen / Career-Switcher / Pros | eine primäre + eine sekundäre spitzen | diffuses Messaging |
| P1 | **Kern-Outcome/Versprechen** | Aktivismus / Skill-Career / Hybrid | Maker/Impact-Hybrid | Verkaufsbarkeit unklar |
| P1 | **Scope nächste Bau-Schritte** | breit (alle Linien) / spitz (G1+G2) | spitz: G1+G2 → „LINE G OPENS" | Verzettelung |
| P2 | **Code-Anteil & Ehrlichkeit** | null / minimal / sichtbar | minimal & ehrlich kommuniziert | Erwartungsbruch |
| P2 | **Live-Anteil** | async / live / hybrid | hybrid (Tier 0 async, Tier 1 live) | Aufwand falsch dimensioniert |
| P2 | **Waitlist-Angebot** | nur Mail / + konkreter Nutzen | konkreten Pre-Launch-Wert geben | schwache Liste |
| P2 | **Netz-Karte: Rolle & Look** | Teaser / zentrales Nav-Element; WebGL / SVG / generiertes Bild | Look neu (Founder-Idee: generiertes Bild + Animation); leichtgewichtig | Zeit-/Performance-Verlust |
| P3 | **Preis** | Sliding 290/590/990 + 25 % Stip. | wie VISION, früh testen | Revenue unvalidiert |
| P3 | **Zertifikat vs. Portfolio** | Ticket+Portfolio / Cert | Ticket+Portfolio (VISION) | wahrgenommen „wertlos" |
| P3 | **B2C vs. B2B** | B2C / B2B / beide | B2C-first, B2B später | Fokusverlust |
| P3 | **Tool-Stack** | fix / tool-agnostisch | tool-agnostisch, Gratis-Tiers | veraltet/Gatekeeping |
| P3 | **GHOST-LLM-Timing** | vor / nach Cohort #1 | nach G1+G2; Stationen ohne GHOST lauffähig halten | Über-Engineering |
| P3 | **Sprache** | EN / DE / beide | EN-first (VISION), DE Welle 2 | Markt-Mismatch |

## 2. Offene Fragen (Auswahl — vollständige Liste in `00_CHATGPT_TRANSFER.md` §14)

- Welche Linie nach G zuerst (K/R/B/V) und warum?
- Wie sieht ein „bestandenes" Artefakt aus (Rubric pro Station)?
- Beta-Cohort: Größe/Dauer/Live-Anteil/Preis?
- Was definiert „LINE G OPENS" genau (reicht G1+G2)?
- Founder-Market-Fit: unfair advantage, verfügbare Zeit/Team, Mission vs. Revenue?

## 3. Annahmen (klar markiert)

1. `[ANNAHME]` K/R/B/V sind nur als Struktur/Pate/Gegner definiert — Inhalte fehlen.
2. `[ANNAHME]` Team ist klein/Solo → Scope-Realismus kritisch.
3. `[ANNAHME]` Berufstätige Quereinsteiger sind eine reale, aber bisher nicht
   adressierte Chance.
4. `[ANNAHME]` `docs/FAQ.md` ist teils Legacy (Game-/Level-Ära) — nicht 1:1 als
   aktuelle Produkt-Wahrheit nehmen.
5. `[ANNAHME]` Die großen Vision-Docs (Gaming-Mechanics, Community-2.0,
   Edutainment-Vision) sind Aspirations-/Archiv-Ebene, nicht der schlanke Ist-Plan.

## 4. Risiken & Gegenmaßnahmen (Kurz; Details `00_CHATGPT_TRANSFER.md` §12)

| Risiko | Gegenmaßnahme |
|---|---|
| Zu breite Positionierung | eine primäre Zielgruppe + ein Kern-Outcome spitzen |
| Aktivismus-Ton vs. Career-Nutzen | zweite, nüchterne Outcome-Spur im Messaging |
| KI-Hype-Wahrnehmung | echte Artefakte + sichtbarer Eval-Querschnitt |
| Glaubwürdigkeit ohne Social Proof | echte Case Files/Graduates aufbauen |
| „kein Code = keine Skills"-Lesart | Urteilskraft/Verifikation als harten Skill framen |
| Solo-Kapazität vs. Scope | eng schneiden (G1+G2 zuerst) |
| Tech-Schuld (.env, schwere Deps, kein Sync) | bereinigen/budgetieren/Phase-4-Auth |

## 5. Abhängigkeiten (Dependencies)

- „LINE G OPENS" ⟵ G2 gebaut ⟵ echte AI-Transkripte (G2) ⟵ Curriculum-Detail G2.
- Cohort #1 ⟵ Tier-1-Format + Rubric + Preis-Test ⟵ Zielgruppen-Entscheidung (P1).
- Account-getragener Fortschritt ⟵ Auth/Identity-Bridge (Phase 4) ⟵ data-snack
  Firestore-CROSSWALK.
- GHOST-Eval (G5 echt) ⟵ GHOST-LLM-Dienst (Phase 3, GCP).
- Waitlist-Conversion ⟵ stärkeres Waitlist-Angebot (P2).

## 6. Entscheidungsvorlagen (Decision Templates) `[EMPFEHLUNG]`

**E1 — Primäre Zielgruppe**
- Kontext: Messaging/Curriculum/Preis hängen daran.
- Optionen: (a) Aktivist:innen, (b) Career-Switcher, (c) Pros.
- Kriterien: Zahlungsbereitschaft, Mission-Fit, Reichweite (data-snack-Funnel), Founder-Fit.
- Empfehlung: (a) primär + (b) sekundär, Messaging zweispurig.
- Reversibilität: mittel (Copy/Curriculum-Akzente).

**E2 — „LINE G OPENS"-Definition**
- Kontext: löst die Waitlist-Mail ein (das Kernversprechen).
- Optionen: G1 allein / G1+G2 / ganze Linie.
- Empfehlung: G1+G2 (genug Substanz, schnell erreichbar).
- Reversibilität: hoch.

**E3 — Netz-Karten-Look**
- Kontext: Marken-/Hero-Wirkung; bisher WebGL (Lag) + SVG (Founder unzufrieden).
- Optionen: leichtes SVG verfeinern / in ChatGPT generiertes Bild + Animation /
  vorerst nur /line-g-Liste.
- Empfehlung: Founder-Idee testen (generiertes Bild → leicht animieren), Performance
  als hartes Kriterium.
- Reversibilität: hoch (isolierter Branch).

## 7. Priorisierung (Top-Entscheidungen zuerst)

1. **Primäre Zielgruppe + Kern-Outcome** (P1) — alles andere folgt daraus.
2. **Scope: G1+G2 → „LINE G OPENS"** (P1) — Fokus statt Breite.
3. **Netz-Karten-Look** (P2) — blockiert Landing-Finalisierung.
4. **Waitlist-Angebot stärken** (P2) — Conversion vor Launch.
5. **Beta-Cohort-Format/Preis-Test** (P3) — Revenue-Validierung.
