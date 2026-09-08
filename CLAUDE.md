# CLAUDE.md — datavism.org

Data-Aktivismus-Lab für das KI-Zeitalter („Data Underground") mit dem KI-Agenten **GHOST**.
Souveräne Praxis der Forschungsökologie — Identität, epistemische Zusagen und das ehrliche
Autonomie-Statement (GHOST ist eine Agenten-Persona auf menschlichen Schienen) stehen im
Governance-Statement v1 (`docs/`, 2026-07-17). **Nicht filmisch inszenieren** (Frank,
2026-07-16, Wortlaut privat).

## Stack — was hier wirklich läuft

**Astro 6, statisch** (`src/pages/`), **Svelte 5** als Inseln (`src/components/`),
**Tailwind v4** über das Vite-Plugin, TypeScript, **Vitest**. Deploy auf **Vercel**
(`vercel.json`); die Serverless-Funktionen liegen in `api/` (Node-Runtime).

```bash
npm install
npm run dev       # localhost:4321
npm run build
npm run check     # astro check
npm run test      # vitest
```

**Falle in `api/`:** Die Funktionen sind absichtlich self-contained — Vercels `/api`-Builder
bündelt keine Imports aus `../src/`, ein solcher Pfad läuft zur Laufzeit in
`ERR_MODULE_NOT_FOUND`. Logik also in der Funktionsdatei halten, auch wenn es doppelt aussieht;
die Dateiköpfe erklären es je Endpunkt.

Env: `GEMINI_API_KEY` · `GEMINI_MODEL` (GHOST, Guide, Certify) · `UPSTASH_REDIS_REST_URL` /
`UPSTASH_REDIS_REST_TOKEN` (Rate-Limit der Funktionen) · `SUBSCRIBE_ENDPOINT` (Proxy auf den
geteilten data-snack-Drop-Notifier — datavism hält keinen eigenen Mail-Stack) ·
`PUBLIC_UMAMI_SRC` / `PUBLIC_UMAMI_WEBSITE_ID` (cookieless Umami; der Build koppelt Analytics
an `/legal`). Identität/Auth läuft über Firebase (`src/lib/identity/`).

## Orientierung

Flächen: `/` (Map) · `/command` (Command Center) · `/[line]/[station]` (Linien G, K) ·
`/underground` · `/manifesto` · `/ghost` · `/archive`. Fachlogik in `src/lib/`
(`command-center/`, `line-g-opening/`, `atlas.ts`, `identity/`).

Doku: `docs/README.md` ist der Index (ADR 001–003, Pläne, Governance-Statement);
`program.md` steuert Entwicklungs-Sessions (Anti-Patterns, Qualitätskriterien, Ethik).

**`/field` gibt es nicht mehr** (2026-09-08): Der Spiegel von Meridians Werken ist entfernt,
`/field` und `/field/<slug>` leiten dauerhaft auf `frankbueltge.de/field`. Meridian bleibt
Quelle, aber nur noch zitiert — `derivedFrom` in `src/lib/command-center/operations.ts`
(ADR 003 Phase 1) und der Atlas-Snapshot (Phase 3). Kein neuer Spiegel ohne ausdrückliche
Ansage.

## Abgrenzung und Freigaben

GHOST gehört zu datavism — **nicht** zu data-snack.com. Nicht vermischen.

Ethik-Linie (geteilt mit dem frankbueltge.de-Lab): „no AI output without verification,
no claim without evidence".

**Dieses Repo fällt NICHT unter die Merge-Vollmacht des Ökologie-Hauses.** Ein Merge auf
`main` deployt direkt nach Produktion: PR aufmachen, prüfen, und auf Franks Go warten.
