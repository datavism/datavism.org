# DATAVISM — The Data Underground

> *The revolution will be computed.*

**datavism.org** is the school of the **Data Underground** — the AI-era data
skills bootcamp of the [data-snack.com](https://data-snack.com) universe.
You won't learn to code here. You'll learn to **command**: AI, data, and the
right questions.

## Status (2026-06-07)

The old site is offline. `main` currently serves a minimal **holding page**
(in-universe teaser). The full rebuild is planned — stack decision pending
(ADR), see the docs below.

- The previous Next.js app (incl. its last uncommitted refactor state) is
  preserved on branch [`legacy-2026`](../../tree/legacy-2026).

## Read this first

| Doc | What |
|---|---|
| [`docs/VISION.md`](docs/VISION.md) | Lead document — positioning, transit-map curriculum, funding, roadmap |
| [`docs/STORY.md`](docs/STORY.md) | Storyworld bible — Data Underground, GHOST, lines & stations, slogans |
| [`docs/MANIFESTO.md`](docs/MANIFESTO.md) | The manifesto (v2, EN, site-ready) |
| [`program.md`](program.md) | Steering doc for dev sessions (quality bar, anti-patterns, ethics) |
| [`docs/README.md`](docs/README.md) | Full docs index (incl. research + archive) |

Platform-role canon (sister repo `data-snack.com`): ADR 006, CROSSWALK.

## Holding page (this branch)

```bash
npm install
npm run dev    # localhost:3000
npm run build  # static
```

Deployed via Vercel git integration (push to `main` → production).

---

*A Non-Profit Digital Art Project.*
