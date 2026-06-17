# 01 — Technical Audit (datavism.org)

**Stand:** 2026-06-14 · **Methode:** statische Repo-Analyse (ohne `node_modules`,
`.git`, `dist`, `.astro`, `.vercel`). **Keine Secrets** in dieser Datei.

## 1. Stack (FAKT)

| Bereich | Wert | Evidenz |
|---|---|---|
| Framework | Astro **5.18.2** (statisch) | `package.json`, `astro.config.mjs` |
| UI-Islands | Svelte **5.56** (Runes) | `package.json`, `astro.config.mjs` (`integrations:[svelte()]`) |
| Styling | Tailwind **v4** (CSS-`@theme`, kein `tailwind.config`) | `@tailwindcss/vite`, `src/styles/global.css` |
| Sprache | TypeScript 5.9, `astro/tsconfigs/strict` | `tsconfig.json` |
| Tests | Vitest 4 (`npm run test`) | `package.json`, `src/lib/*.test.ts` |
| Anim/3D | `three@0.184`, `gsap@3.15` (nur Station) | `package.json`, `src/components/TheFolderStory.svelte` |
| Deploy | Vercel (`framework: astro`) | `vercel.json`, `.vercel/` |
| Serverless | 1 Node-Function `api/subscribe.ts` | `api/` (Root, Vercel-Convention) |

**Scripts** (`package.json`): `dev` (astro dev), `build`, `preview`, `check`
(astro check), `test` (vitest run).

## 2. Projektstruktur (kommentierter Tree, gekürzt)

```
datavism.org/
├─ api/subscribe.ts        # Vercel-Function: Waitlist-Proxy (einzige Server-Logik)
├─ astro.config.mjs        # svelte() + tailwindcss(); site: https://datavism.org
├─ vercel.json             # { framework: astro }
├─ .env.example            # ⚠ VERALTET (Next.js-Legacy-Vars; NICHT vom Astro-Code genutzt)
├─ program.md, README.md   # Steuer-/Einstiegs-Doku
├─ public/
│  ├─ brand/svg/…          # 6 Neon-Ghost-Logo-Varianten
│  ├─ favicon.{svg,ico}
│  └─ og/{datavism,line-g-the-folder}.png  # generierte Social-Cards
├─ src/
│  ├─ pages/
│  │  ├─ index.astro        # Landing (Hero, Counter, Netz-Hero, Waitlist)
│  │  ├─ manifesto.astro    # Manifest (Copy aus docs/MANIFESTO.md)
│  │  ├─ legal.astro        # Impressum + Datenschutz
│  │  ├─ 404.astro          # eigene 404 (GHOST-Stimme)
│  │  ├─ network.astro      # /network — volle Netz-Karte (SSR-SVG)
│  │  ├─ ticket.astro       # /ticket — Fortschritts-Receipt
│  │  └─ line-g/{index,[station]}.astro  # Linien-Seite + Stations-Template
│  ├─ components/
│  │  ├─ GhostLogo.astro          # SVG-Logo (Eye-Blink, reduced-motion)
│  │  ├─ NetworkMap.astro         # SSR-SVG-Netzkarte (Wortmarke aus Strecken)
│  │  ├─ TrackCounter.svelte      # ehrlicher Signal-Counter (sendet nichts)
│  │  ├─ SubscribeForm.svelte     # Waitlist-Form (POST /api/subscribe)
│  │  ├─ TheFolderStory.svelte    # G1-Story-Kern (WebGL/GSAP/WebAudio)
│  │  ├─ StationSelfCheck.svelte  # Self-Check → Ticket-Stempel
│  │  └─ TicketView.svelte        # Ticket-Anzeige (localStorage)
│  ├─ content.config.ts     # Content-Collection `stations` (Zod-Schema)
│  ├─ content/stations/*.md # 5 Stationen (G1–G5); nur G1 „open"
│  ├─ layouts/Base.astro    # HTML-Hülle, Meta/OG, Footer
│  ├─ lib/
│  │  ├─ copy/en.ts         # ZENTRALE Site-Copy (EN)
│  │  ├─ signals.ts(+test)  # Counter-Logik
│  │  ├─ ticket.ts(+test)   # Ticket-Logik (pure)
│  │  ├─ ticket-storage.ts  # localStorage-Adapter
│  │  └─ network/geometry.ts(+test)  # Netz-Geometrie (Wortmarken-Daten)
│  └─ styles/global.css     # Tailwind v4 @theme: Farben, Font
└─ docs/                    # Strategie/Story/Pläne/Research/Archiv (s. 05_REPO_EVIDENCE_MAP)
```

## 3. Was funktioniert (FAKT)

- **Statische Site baut** (8 Seiten), `astro check` 0 Fehler, 14 Vitest-Tests grün.
- **Landing** mit ehrlichem Counter, Manifest, Legal, Netz-Hero, Waitlist.
- **Waitlist live** (env-gated): Form → `/api/subscribe` → geteilte Cloud-Function.
- **LINE G / G1** vollständig spielbar: Story-Kern (WebGL), Mission, Self-Check →
  Ticket; `/ticket` zeigt Stempel.
- **Netz-Karte** (`/network` + Landing-Hero) als SSR-SVG (Look noch in Klärung).

## 4. Wahrscheinlich unfertig / in Arbeit (FAKT/ANNAHME)

- Nur **Line G** befüllt; K/R/B/V sind Konzept (Daten-Stubs fehlen ganz).
- Stationen **G2–G5** = nur Frontmatter (status announced/locked), keine Inhalte.
- **Netz-Karten-Look** vom Founder verworfen (WebGL + SVG-Versuch) → offen.
- **GHOST-Fragmente 2/5–5/5** nicht geschrieben (nur G1 authored).
- **Auth/Accounts/DB** bewusst nicht vorhanden (Phase 4).
- Branch-Lage: Arbeit liegt auf `feat/line-g-g1` und `feat/network-map` (unmerged).

## 5. Datenflüsse / Form-Flows

**Waitlist** (FAKT, `SubscribeForm.svelte` + `api/subscribe.ts`):
```
User → SubscribeForm (client) → POST /api/subscribe {email, phone(honeypot)}
     → (Honeypot gefüllt? → 200, nichts weiterleiten)
     → Email-Regex + Längen-Check (sonst 400)
     → kein SUBSCRIBE_ENDPOINT? → 503 ("not_wired")
     → fetch(SUBSCRIBE_ENDPOINT) {email, brand:'datavism', source:'datavism-waitlist'}
     → 2xx → 200 {ok, pending}; 400 → 400; sonst → 502
→ Double-Opt-In-Mail kommt von der geteilten data-snack-Function; Tagging in Segment 'underground-waitlist'
```
Kein Secret im Repo; nur `SUBSCRIBE_ENDPOINT` (Vercel-Projekt-Env).

**Counter** (FAKT, `TrackCounter.svelte` + `signals.ts`): zählt pointermove/scroll/
click/keydown/Tick client-seitig (throttled), **sendet/speichert nichts**. Pausiert
bei `document.hidden`.

**Ticket** (FAKT, `ticket.ts` + `ticket-storage.ts`): Self-Check hakt → `stampAndSave`
schreibt `localStorage['datavism.ticket.v1']` = `{version, completedStations[],
stamps{stationId:ISO}}` (CROSSWALK-kompatibel). `/ticket` liest lokal. Kein Server.

## 6. API-Routen / Integrationen

| Route/Integration | Typ | Evidenz | Hinweis |
|---|---|---|---|
| `POST /api/subscribe` | Vercel Node-Function | `api/subscribe.ts` | Proxy zu geteilter data-snack-Resend-Function |
| Resend (E-Mail) | indirekt | (data-snack-Backend) | datavism hält **keinen** Resend-Key |
| Analytics | **keine** | — | bewusst (Ehrlichkeits-Regel) |
| Payment | **keine** | — | Cohort-Verkauf via data-snack geplant |
| DB/Auth | **keine** | — | Phase 4 (Firestore Identity-Bridge geplant, VISION §4) |

## 7. Content-/Datenmodell

`src/content.config.ts` — Collection **`stations`** (Astro Content Layer, glob über
`src/content/stations/*.md`). Zod-Schema (FAKT): `line` (g/k/r/b/v), `index`,
`title`, `skill`, `status` (open/announced/locked), `dropDate?`, `teaser?`,
`sources[]` ({label,url,accessed}), `ogImage?`, `missionMinutes?`, `ghostFragment[]`,
`mission?` ({goal, steps[]}), `selfChecks?` (1–5), `artifactName?`, `nextTeaser?`.
Nur „open"-Stationen tragen die spielbaren Beats. Einträge: `the-folder` (open),
`command`, `intake`, `the-confident-lie`, `maschinenraum` (announced/locked).

`src/lib/network/geometry.ts` — pure Daten: `VIEW` (1600×600), `LINES` (5,
je `strokes: Pt[][]` = Buchstaben-Striche der Wortmarke), `NODES` (G1–G5 auf der
Stammlinie, referenzieren Station-IDs), `LANDMARKS` (Eingang/Maschinenraum/Vault).
Invarianten getestet (`geometry.test.ts`).

## 8. Build/Deploy & lokale Entwicklung (FAKT/ABLEITUNG)

```bash
npm install
npm run dev      # Astro Dev (Port 4321; README nennt 3000 — veraltet aus Next.js-Ära)
npm run build    # statischer Build (dist/)
npm run preview  # baut-vorschau
npm run check    # astro check (Typen + Content)
npm run test     # vitest run
```
Deploy: Vercel (`vercel.json: framework astro`); Env `SUBSCRIBE_ENDPOINT` im
Vercel-Projekt setzen, damit die Waitlist live geht (sonst 503).

## 9. Technische Schulden (FAKT/ANNAHME)

1. **`.env.example` veraltet** — listet Next.js-Legacy-Vars (SUPABASE, NVIDIA_NIM,
   POSTHOG, INVIDEO), die der Astro-Code nicht nutzt. Irreführend; sollte auf
   `SUBSCRIBE_ENDPOINT` (+ optional MAIL_FROM_DATAVISM) reduziert werden.
2. **README-Status veraltet** (Stand 2026-06-07, „holding page", Port 3000) — passt
   nicht mehr zum gebauten Stand.
3. **Schwere Deps** `three`+`gsap` für eine einzige Station — Bundle-/Perf-Budget
   beachten (die WebGL-Netz-Karte wurde wegen Performance verworfen).
4. **Kein State-Sync** — Fortschritt nur in localStorage (Verlust bei Browser-Wechsel
   bis Auth/Phase 4).
5. **Unmerged Branches** — `feat/line-g-g1`, `feat/network-map`; Merge-Strategie offen.

## 10. Technische Empfehlungen (EMPFEHLUNG)

- `.env.example` + README aktualisieren (Hygiene, Onboarding-Klarheit).
- WebGL nur dort, wo es trägt; ein Perf-Budget pro Insel definieren (Pause bei
  hidden, DPR-Cap, on-demand-Render).
- Vor „LINE G OPENS": G2 bauen, Branches mergen, Waitlist-Env in Vercel verifizieren.
- Content-getriebenes Wachstum nutzen: neue Station/Linie = Markdown + Status-Flip,
  kein neuer Code (Architektur unterstützt das bereits).
