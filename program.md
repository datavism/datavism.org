# DATAVISM — program.md

> Das Steuerungsdokument fuer alle Entwicklungs-Sessions.
> KI-Agents lesen dieses File zuerst und arbeiten autonom dagegen.
> Frank reviewed und passt an. Iteration.
>
> **⚠️ Leit-Dokument ist `docs/VISION.md`** (Repositionierung 2026-06-07).
> Dieses program.md ist auf die neue Vision ausgerichtet. Die alte
> „Reality-Wars"-Ära liegt unter `docs/archive/`.

---

## 1. WAS IST DATAVISM?

Das **AI-Era Data Skills Bootcamp** — hands-on, projektgetrieben, mit GHOST als
KI-Mentor. Es vermittelt **echte Skills** (KI-Orchestrierung, Vibe Coding,
AI-gestuetztes Data Work) ueber Themen mit realem Bezug: Ueberwachung,
Manipulation, Datenhandel, algorithmische Diskriminierung. Ein Game-Layer traegt
das Erlebnis — als Vehikel, nicht als Selbstzweck.

**Elevator Pitch:** "Lerne, mit KI als Superkraft aus Daten Erkenntnisse und
echten Impact zu gewinnen — du baust ab Tag 1 echte Investigationen, statt
Lektionen abzusitzen."

**Lernziel:** nicht „Python coden", sondern *„AI orchestrieren, die richtigen
Fragen stellen, Pipelines mit Co-Pilot bauen, Ergebnisse kritisch pruefen"*.

**Was es NICHT ist:** Kein passiver Video-Kurs (kein Coursera). Kein Dashboard.
Kein Chat-Wrapper. Kein SaaS. **Schwester-Saeule** von `data-snack.com`: Snacks
ziehen rein (Top-of-Funnel), das Bootcamp haelt drin (Deep-Engagement).

---

## 2. EXPERIENCE PILLARS

1. **Immersiv** — Jede Sekunde fuehlt sich an wie ein Game, nicht wie eine Website. Kein Element darf "webby" wirken.
2. **Suechtig machend** — Progression, Streaks, Cliffhanger, Share-Momente. Wie Duolingo trifft Black Mirror.
3. **Skill-Building** — Jede Mission vermittelt einen konkreten Skill (Prompting, Datenanalyse, kritisches Denken), aber das Erlebnis steht vorne.
4. **Echt** — Echte Daten, echte Probleme, echte KI. Kein Fake. Die Grenze zwischen Game und Realitaet verschwimmt absichtlich.
5. **Viral** — Jedes Element hat eine Share-Komponente. Liberation Codes, Findings, Score-Screens. Designed fuer mobile Sharing.

---

## 3. ZIELGRUPPE

**Primaer:** Gen Z + Millennials die spueren dass Social Media sie manipuliert und etwas dagegen tun wollen — aber keine Programmierer sind.

**Sekundaer:** Tech-Affine, Journalisten, Aktivisten, Educator.

**Design-Prinzip:** Ueber Rollen/Schwierigkeitslevel alle abholen. Kein Gatekeeping. Modularer Aufbau fuer spaetere Erweiterung.

---

## 4. REFERENZEN & VIBE

| Referenz | Was wir uebernehmen |
|----------|---------------------|
| **Mr. Robot / Watch Dogs** | Hacker-Aesthetik, Untergrund-Widerstand, subversive Energie, Terminal-Screens |
| **Duolingo** | Sucht-Mechanik, Streaks, taegliche Gewohnheit, Progression die sich gut anfuehlt |
| **Papers Please / Orwell** | Moralische Dilemmata, politisches Storytelling durch Gameplay, Entscheidungen mit Konsequenzen |
| **TikTok / Reels** | Snackable Moments, viral-optimiert, mobile-first, instant Dopamin, Sharing als Kern |
| **Black Mirror** | Unbehagliche Naehe zur Realitaet, "holy shit das ist echt", gesellschaftliche Implikation |
| **Cyberpunk 2077** | Visuelles Design, Neon-auf-Dunkel Aesthetik, immersive UI-Elemente |

---

## 5. ANTI-PATTERNS — DAS DARF NIEMALS PASSIEREN

> Recherche-Beleg (DataCamp/YouGov 2026): bestehende AI-Trainings scheitern an
> *passivem Video, fehlenden Hands-on-Projekten, fehlenden strukturierten Pfaden*.
> Das ist unser Anti-Pattern-Katalog — wir machen konsequent das Gegenteil.

- [ ] Sich wie ein passiver Kurs anfuehlen (Video-Waende, "Lektion 3 von 12" als Selbstzweck) — strukturierte Pfade ja, passive Lektionen nein
- [ ] Theorie vor Praxis (kein Projekt ab Tag 1)
- [ ] Generischer SaaS/Dashboard-Look (weisse Karten, blaue Buttons, Card-Grids)
- [ ] Technisch einschuechternd (Code-Editor als Haupt-Interface, Fachjargon ohne Kontext)
- [ ] Langsam und langweilig (Text-Waende, keine Interaktion, passive Consumption)
- [ ] Verstoesse gegen Urheberrecht, geltendes Recht, illegale Handlungen
- [ ] Diskreditierung/Diffamierung von Marken, Personen oder Unternehmen
- [ ] Chat-Interface als Haupterlebnis (KI ist Werkzeug, nicht Buehne)
- [ ] Cringe Sound-Design (permanente Drone-Sounds, Typing-Spam, uebertriebene Effekte)
- [ ] Desktop-Only Design (alles muss mobile-first funktionieren)

---

## 6. SESSION-DESIGN

**Kurze Sessions (5-15 Min):** Viral Experience, Quick Challenges, Daily Missions, Share-Momente
**Lange Sessions (30-60 Min):** Story-Missionen, Deep Investigations, AutoInvestigate-Laeufe

Beide Modi muessen gleichwertig funktionieren. Modularer Aufbau.

---

## 7. PLATFORM & TECH

**Platform:** Mobile-First Web (PWA). Spaeter: Native via Capacitor (iOS/Android) + Desktop.
**Stack:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Zustand, Supabase
**KI:** Open-Source Modelle via NVIDIA NIM API (aktuell Llama 3.3 70B). Claude = Dev-Tool only.
**Erweiterbar durch:** Capacitor fuer native APIs (Haptics, Push, Kamera, Share Sheet)

**Tech-Prinzip:** Fuer jedes neue Feature wird recherchiert was 2026 state-of-the-art ist. Nicht das Erstbeste nehmen, sondern das Optimale.

---

## 8. AGENT-ROLLEN

Jede Rolle hat klare Verantwortlichkeiten. Agents arbeiten autonom in ihrem Bereich.

| Rolle | Verantwortung |
|-------|---------------|
| **Game Designer** | Gameplay-Mechaniken, Progression, Balancing, Mission-Design, Suchtfaktor, Pacing |
| **UX/UI Designer** | Mobile-First Interfaces, Touch-Interaktionen, Accessibility, visuelles Design, Micro-Interactions |
| **Tech Lead / Researcher** | Optimaler Tech-Stack, Library-Recherche, Performance, Build-Pipeline, Best Practices 2026 |
| **Data Science Expert** | Echte Datenanalyse-Challenges, realistische Datensaetze, KI-Prompt-Engineering fuer Investigations |
| **Investigativer Journalist** | Recherche realer Faelle, Faktencheck, Quellen, ethische Leitplanken, Story-Recherche |
| **Dramaturg** | Story Arc, Kapitelstruktur, Dialoge, emotionale Beats, Cliffhanger, Charakter-Entwicklung |
| **Instructional Designer** | Skill-Vermittlung, Lernziele pro Mission, Difficulty Curve, versteckte Didaktik |

---

## 9. QUALITAETSKRITERIEN

Ein Feature ist "fertig" wenn:
- [ ] Es auf Mobile (iPhone SE bis iPhone 15 Pro Max) einwandfrei funktioniert
- [ ] Es in unter 3 Sekunden laedt
- [ ] Es ohne Erklaerung verstaendlich ist (kein Tutorial noetig)
- [ ] Es einen Share-Moment hat (Screenshot-worthy oder teilbar)
- [ ] Es einen Skill vermittelt (auch wenn der User es nicht merkt)
- [ ] Es sich wie ein Game anfuehlt, nicht wie eine Website
- [ ] Der Sound (wenn vorhanden) subtil und atmosphaerisch ist, nicht nervig
- [ ] prefers-reduced-motion respektiert wird

---

## 10. PRIORITAETEN (Reihenfolge)

1. **program.md fertig** ← DU BIST HIER
2. **Mobile UX komplett neu** — Das Interface Mobile-First neu denken und bauen
3. **Virales Onboarding perfektionieren** — Die ersten 60 Sekunden muessen auf Mobile KNALLEN
4. **Eine perfekte Mission** — Eine Mission die 10/10 ist statt 13 die 5/10 sind

---

## 11. AKTUELLER STAND (Juni 2026 — Repositionierung)

**2026-06-07:** Strategische Repositionierung zum *AI-Era Data Skills Bootcamp*
(siehe `docs/VISION.md`). Narrative ans data-snack-Universum angeglichen: GHOST
alleiniger Mentor, Pantheon-Antagonisten (Cumulus Rex, Panopticon, Mammon, The
Feed) als gemeinsame Gegner. Reality-Wars-Ära (Maya Chen, Algorithmic
Consortium, Fake Brands) → `docs/archive/`. **Der Code-Umbau steht noch aus.**

**Was existiert (Code, Stand Maerz 2026):**
- Viral Experience (Fingerprint-Reveal, 6 Phasen) — funktioniert aber nicht mobile-optimiert
- Onboarding (Drive/Role/Codename/Agent Boot) — funktioniert
- Operations Center — UX schlecht, auf Mobile unbrauchbar
- 6 interaktive Mission-Typen — funktionieren aber UX/Mobile-Probleme
- 13 Missionen in 5 Kapiteln mit Story Arc
- GHOST KI-Agent (Llama 3.3 70B via NVIDIA NIM)
- AutoInvestigate (autoresearch-Pattern)
- Evidence Board, Gallery, Profile
- Chapter System mit GHOST Evolution
- Sound Engine (braucht komplette Ueberarbeitung — aktuell cringe)

**Was kaputt/schlecht ist:**
- Mobile UX komplett unbrauchbar
- Ops Center ist verwirrend und performance-hungrig
- Sound Design ist nervig statt atmosphaerisch
- Kein klarer Einstieg nach dem Onboarding ("was mache ich jetzt?")
- Keine Supabase Auth-Integration (alles localStorage)
- Kein Deployment

---

## 12. ZIEL (6 Monate) — siehe Roadmap in `docs/VISION.md` §8

1. **Repositionierung umgesetzt** — Site spiegelt das Bootcamp-Framing (Q3 2026)
2. **Beta-Cohort** — 10–20 Personen, erste Data-Jam (Q4 2026)
3. **Viraler Hebel** — Ship-to-earn-Loop + Data-Jam-Event, Bridge-Cards von data-snack
4. **Loyale Community** — begeisterte Datavist-Basis, oeffentliche Contributor-Wuerdigung
5. **Finanzierung angestossen** — Prototype-Fund/EU-Antrag, Sliding-Scale-Cohort-Modell

**Geldmodell:** Hybrid, missionsgetragen (non-profit-Basis + Sliding-Scale-Cohorts
+ Grants + gesponserte Challenges + optionales Insiders-Tier). Details:
`docs/VISION.md` §7. Der alte VC-Investor-Track ist verworfen (`docs/archive/`).

---

## 13. ETHISCHE LEITPLANKEN

- Keine illegalen Handlungen foerdern oder ermoeglichen
- Keine Marken, Personen oder Unternehmen diffamieren oder diskreditieren
- Keine echten personenbezogenen Daten sammeln oder missbrauchen
- Alle Datenquellen in Missionen muessen oeffentlich zugaenglich sein
- Die Fingerprint-Demo im Onboarding erklaert, wie Tracking funktioniert — sie BETREIBT keins
- Open Source: Transparenz ueber eigene Methoden

---

*Letzte Aktualisierung: 2026-06-07 (Repositionierung — siehe `docs/VISION.md`)*
*Autor: Frank Bultge + Claude (Lead Developer)*
