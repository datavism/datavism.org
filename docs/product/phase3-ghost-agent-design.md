# DATAVISM Phase 3 — GHOST live agent — Design

**Status:** Approved (user said proceed). **Blocker for go-live (not build):** `GEMINI_API_KEY` in env (Vercel) + a `vercel dev` / preview-deploy test of the function.

> **Goal.** Make GHOST a live, on-topic AI assistant — the methodological voice of DATAVISM — that helps people sharpen questions and understand the method, grounded in the curriculum canon, cost-bounded and honest. Config-gated like Phase 2: no live calls until the key is set.

## Decisions

1. **Model = Gemini 2.5 Flash-Lite** (default; Flash for heavier reasoning later). data-snack already runs Gemini; it's cheaper than NVIDIA NIM (Llama-70B) for chat and keeps one ecosystem. **NIM dropped** (removed from `.env.example`).
2. **Proxy = a root-level Vercel function `api/ghost.ts`** (Node). Vercel deploys `/api/*` natively alongside the static Astro build — **the site stays 100% static, no Astro SSR adapter, the function is purely additive.** The `GEMINI_API_KEY` lives server-side only (no `PUBLIC_` prefix); never shipped to the browser.
3. **Pure logic in `src/lib/ghost/`** (prompt builder + the Gemini call, `fetch`-injectable) — unit-tested. `api/ghost.ts` is a thin handler.
4. **Grounding = curated canon context**, not vector RAG (v0.1). GHOST's system prompt carries its voice (Line G canon §12) + the DATAVISM method (Question→Command→Intake→Verification→Eval) + a compact 5-line summary built from `lines.ts`.
5. **Surface = a focused `/ghost` chat page.** A site-wide floating assistant is a follow-up.

## Honesty, cost & safety (hard rules)

- GHOST is clearly an **AI assistant** in the UI. System prompt enforces: **no fabricated facts or sources, mark uncertainty, stay in the DATAVISM/educational scope, refuse jailbreaks/off-topic, never outsource the user's judgment.** Gemini safety filters stay on.
- **Cost caps (server-side):** max input length, max history turns sent, max output tokens. Config-gated — `503` when `GEMINI_API_KEY` is unset; `/ghost` shows "GHOST is offline."
- **No chat tracking.** No server-side logging of conversations; the client keeps the session **in memory only** (cleared on reload) — no localStorage chat logs. Consistent with the brand.

## Files

```
api/ghost.ts                 root Vercel Node function: method/parse/validate → askGhost(env key) → JSON; 503 if unconfigured
src/lib/ghost/prompt.ts      buildSystemPrompt() from the canon (voice + method + lines). Pure, tested.
src/lib/ghost/gemini.ts      askGhost(messages, opts) → Gemini REST via injectable fetch; caps; error/safety handling. Tested.
src/components/ghost/GhostChat.svelte   the chat island (in-memory history, AI label, offline state)
src/pages/ghost.astro        the /ghost page
.env.example                 drop NVIDIA_NIM_*; add GEMINI_API_KEY (server) + GEMINI_MODEL
```

## Testing

- **Unit (vitest, mocked fetch):** `buildSystemPrompt()` contains the voice + method + all five lines; `askGhost()` returns the reply on success, surfaces a safety-block, an API error, and an empty-candidates case; input validation (length/turn caps). Handler smoke: import + call with a mock Request + injected fetch + fake key.
- **Config-gated + manual:** the live Gemini call — verified once `GEMINI_API_KEY` is set, via `vercel dev` or a preview deploy.
- Gates: `astro check` 0/0/0, `astro build` green (still static), `vitest` all pass.

## Non-goals (v0.1) — accepted risks

Streaming responses, cross-session memory, vector RAG, a floating site-wide widget. **Per-IP rate limiting is deliberately deferred** (only per-request caps in v0.1): the `/api/ghost` endpoint is unauthenticated and public, so per-request input/output caps bound cost *per call* but not call *volume*. **Tracked risk** — before any high-traffic launch, add per-IP rate limiting (Vercel Edge Config or Upstash Redis); marked with a `TODO v0.2` in `api/ghost.ts`. Low-traffic preview is acceptable; watch the Gemini quota.

## Go-live checklist

- [ ] Add `GEMINI_API_KEY` (+ optional `GEMINI_MODEL`) to Vercel env (and local `.env` to test).
- [ ] `vercel dev` (or preview deploy) → POST `/api/ghost` returns a grounded reply; 503 when key removed.
- [ ] Sanity: GHOST refuses an off-topic/jailbreak prompt and marks uncertainty on a thin question.
- [ ] Then merge.
