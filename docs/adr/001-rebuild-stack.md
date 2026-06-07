# ADR 001 — Rebuild-Stack: data-snack-Engine für datavism.org

**Status:** Accepted
**Datum:** 2026-06-07
**Kontext:** Data-Underground-Neubau (siehe `../VISION.md`, `../STORY.md`).
Der alte Next.js-15/Supabase/NVIDIA-NIM-Stack liegt auf Branch `legacy-2026`;
`main` serviert die Holding-Page. Für den Neubau braucht es eine
Stack-Entscheidung. Schwester-Canon: data-snack `engine-vs-content.md`
(Engine explizit für zweiten Consumer vorbereitet), ADR 006, CROSSWALK.

## Entscheidung

**datavism.org wird auf der data-snack-Engine gebaut:**

| Layer | Wahl | Begründung |
|---|---|---|
| Framework | **Astro 5 + Svelte 5 Islands** | Engine-Reuse; Curriculum = Content (MDX-Collections passen exakt auf Stationen); statisch-first = schnell + billig |
| Game-/Cinematic-Layer | **Pixi 8 + Howler** (on demand) | Aus der Engine; nur wo ein Erlebnis es braucht (Netzplan-Map v1 startet als SVG/Svelte, Pixi später für cinematics) |
| Styling | **Tailwind 4** | Engine-Konsistenz |
| Identity/State | **Firebase 12** (Auth Magic-Link + Firestore `crew/{emailHash}`) | Identity-Bridge ist *dasselbe Dokument* wie bei data-snack (CROSSWALK) — kein zweites Auth-System |
| GHOST-Backend | **GCP**: Vertex AI (Gemini) + Cloud Run/Functions + BigQuery | STORY.md §4.2 (User-Entscheidung: GHOST wird real auf GCP entwickelt); Details: `../ghost-brain.md` |
| Hosting (Site) | **Vercel** (bestehendes Projekt, Git-Integration) für v1 | Bereits verdrahtet, kostenlos, Astro-Support erstklassig. Re-Eval Richtung Cloud Run (data-snack-Parität) beim Cohort-Launch |
| Sprache | **EN-first**, i18n-Struktur ab Tag 1 | VISION §2; DE als zweite Welle ohne Refactor |

### Engine-Konsum: Copy-Fork jetzt, Paket später

Die Engine ist in `prototype-v2` nicht als Paket extrahiert. Vorgehen:

1. **Jetzt:** benötigte Engine-Teile **kopieren** (`passport.ts`, `receipt.ts`,
   `dossier.ts`, `tracking.ts`, Consent-Banner-Pattern, Terminal-Component-
   Pattern → GHOST-Variante). Herkunft je Datei im Header vermerken.
2. **Später (Trigger):** sobald ein Engine-Teil zum **dritten** Mal divergiert
   gefixt wird ODER data-snack die Engine selbst paketiert → gemeinsames
   Package (`@data-snack/engine`), beide Repos konsumieren.

Kein Monorepo: CROSSWALK verlangt unabhängige Deploybarkeit beider Plattformen.

## Geprüfte Alternativen

| Option | Warum nicht |
|---|---|
| **Next.js weiterbauen** (legacy-2026 reaktivieren) | Alte Vision in jeder Komponente eingebacken (Maya-Chen-Flows, 4-Rollen-Onboarding, Missions-Schema); Mobile-UX dort „komplett unbrauchbar"; Supabase-Auth nie integriert; Stack-Divergenz zur Schwester-Plattform; Identity-Bridge müsste gegen Firestore *zusätzlich* gebaut werden |
| **Frisches SvelteKit/Nuxt/…** | Kein Engine-Reuse, dritter Stack im Haus, alle Shared-Komponenten doppelt |
| **Monorepo mit prototype-v2** | Bricht unabhängige Deploybarkeit (CROSSWALK-Konsequenz); Worktree-/Tooling-Komplexität ohne aktuellen Nutzen |
| **Supabase behalten** | Identity-Bridge ist Firestore-kanonisch (ADR 004/006 + CROSSWALK); zwei Datenbanken für eine Identität ist der Bug, nicht das Feature |

## Konsequenzen

- Neues Astro-Scaffold entsteht auf Branch `rebuild` (Vercel-Preview-Deploys);
  `main` behält die Holding-Page bis zum Launch-Merge.
- Vercel-Projekt-Settings: Framework-Preset muss beim Merge von Next.js auf
  Astro umgestellt werden.
- `.env`-Wechsel: Supabase-Keys raus, Firebase-Config + GCP-Service-Endpoints
  rein (Secrets nie ins Repo).
- Firestore-Security-Rules für `crew/*` werden plattformübergreifend relevant
  → Schema-Governance-ADR im data-snack-Repo (dort ADR 008, TBD) abwarten
  bzw. anstoßen, bevor datavism schreibend zugreift.
- Migration alter `useDatavist`-Profile: localStorage-Mapping per Magic-Link
  (CROSSWALK §Migrationspfad), role→line-Heuristik (CROSSWALK-Update 2026-06-07).
- Performance-Floor-Regeln aus prototype-v2 (2019-Intel-Mac als Budget,
  reduced-motion-Gates, Tab-Hidden-Pausen) gelten 1:1 auch hier.
