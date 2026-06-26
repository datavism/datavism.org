// api/guide.ts — self-contained Vercel serverless function (Node runtime).
//
// GHOST's GUIDANCE layer: lowers the onboarding hurdle of the operation loop without
// lowering the method bar. Two modes, both bound by the honesty line "orient, never
// investigate — the finding stays the user's":
//   orient — recon a public source (what it lets you do / what fields it shows / angles).
//            Uses gemini-2.5-flash with google_search grounding for real, current context.
//   coach  — react to a partial finding draft and NAME THE GAP, never fill it.
//
// SELF-CONTAINED: Vercel's /api builder doesn't bundle ../src imports. Pure helpers are
// exported for unit tests (src/guide-agent.test.ts). Same rate-limit shape as api/ghost.ts.

export type Fetch = typeof fetch

export class GuideError extends Error {
  constructor(public readonly code: string, message?: string) {
    super(message ?? code)
    this.name = 'GuideError'
  }
}

export const GUIDE_LIMITS = { orientTokens: 450, coachTokens: 220, maxFieldChars: 1200 }
export const RL_LIMITS = { perIpPerMin: 10, globalPerDay: 500 }

const ORIENT_MODEL = 'gemini-2.5-flash'      // carries the google_search grounding tool
const COACH_MODEL = 'gemini-2.5-flash-lite'  // cheap; no grounding needed

// ── prompts ─────────────────────────────────────────────────────────────────
export function buildOrientPrompt(): string {
  return `You are GHOST, orienting an investigator who is about to open a public data source. Your ONLY job is to orient — you NEVER investigate, and you NEVER state a specific named organisation, person, or figure as "the answer". The finding stays the user's; you only point at where to look.

Output EXACTLY three labelled lines and nothing else:
DOES: <what the source lets the user do — search / sort / filter>
SHOWS: <the 2-3 fields each record exposes — the raw material of a finding>
ANGLES: <two directions phrased as questions the user could pursue>

Stay concrete and short. If you are tempted to name the most likely answer, stop — name the field that would contain it instead.`
}

export function buildCoachPrompt(): string {
  return `You are GHOST, coaching an investigator who is stuck drafting a finding. They have a question, a source, and a partial draft. Your job is to NAME THE GAP — the single most important thing missing or weak — and point at how to close it. You NEVER write the finding for them, NEVER supply a specific organisation/figure, and NEVER lower the bar. One or two sentences, direct, calm. Teach the move, not the answer.`
}

// ── parsing ─────────────────────────────────────────────────────────────────
export function parseOrient(text: string): { does: string; shows: string; angles: string } {
  const pick = (label: string): string => {
    const m = (text ?? '').match(new RegExp(`^\\s*${label}\\s*:\\s*(.+)$`, 'im'))
    return m ? m[1].trim() : ''
  }
  return { does: pick('DOES'), shows: pick('SHOWS'), angles: pick('ANGLES') }
}

// ── Gemini call ───────────────────────────────────────────────────────────────
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504])

async function callGemini(
  model: string,
  body: unknown,
  apiKey: string,
  fetchImpl: Fetch,
  retries: number,
  sleepImpl: (ms: number) => Promise<void>,
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`
  let res: Awaited<ReturnType<Fetch>> | undefined
  let lastInfo = 'network'
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) await sleepImpl(250 * 2 ** (attempt - 1))
    try {
      res = await fetchImpl(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
    } catch {
      lastInfo = 'network'; res = undefined; continue
    }
    if (res.ok) break
    lastInfo = `gemini ${res.status}`
    if (!RETRYABLE_STATUS.has(res.status)) break
  }
  if (!res || !res.ok) throw new GuideError('api-error', lastInfo)
  const data: any = await res.json()
  if (data?.promptFeedback?.blockReason) throw new GuideError('safety-blocked')
  const candidate = data?.candidates?.[0]
  if (candidate?.finishReason === 'SAFETY') throw new GuideError('safety-blocked')
  return (candidate?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? '').join('').trim()
}

export async function orient(
  input: { source: { title: string; url: string }; question: string },
  opts: { apiKey: string; fetchImpl?: Fetch; retries?: number; sleepImpl?: (ms: number) => Promise<void> },
): Promise<{ does: string; shows: string; angles: string; grounded: boolean }> {
  const { apiKey, fetchImpl = fetch, retries = 1, sleepImpl = (ms) => new Promise<void>((r) => setTimeout(r, ms)) } = opts
  if (!apiKey) throw new GuideError('not-configured')
  const clamp = (s: string) => (s ?? '').toString().slice(0, GUIDE_LIMITS.maxFieldChars)
  const body = {
    tools: [{ google_search: {} }],
    systemInstruction: { parts: [{ text: buildOrientPrompt() }] },
    contents: [{ role: 'user', parts: [{ text: `Source: ${clamp(input.source.title)} (${clamp(input.source.url)}). Operation question: ${clamp(input.question)}. Orient me — do not answer it.` }] }],
    generationConfig: { maxOutputTokens: GUIDE_LIMITS.orientTokens, temperature: 0.3, thinkingConfig: { thinkingBudget: 0 } },
  }
  const text = await callGemini(ORIENT_MODEL, body, apiKey, fetchImpl, retries, sleepImpl)
  const parsed = parseOrient(text)
  const grounded = Boolean(parsed.does || parsed.shows || parsed.angles)
  return { ...parsed, grounded }
}

export async function coach(
  input: { draft: { question?: string; evidence?: string; sourceUrl?: string; uncertainty?: string }; question: string },
  opts: { apiKey: string; fetchImpl?: Fetch; retries?: number; sleepImpl?: (ms: number) => Promise<void> },
): Promise<{ nudge: string }> {
  const { apiKey, fetchImpl = fetch, retries = 1, sleepImpl = (ms) => new Promise<void>((r) => setTimeout(r, ms)) } = opts
  if (!apiKey) throw new GuideError('not-configured')
  const clamp = (s?: string) => (s ?? '').toString().slice(0, GUIDE_LIMITS.maxFieldChars)
  const d = input.draft
  const turn =
    `Operation question: ${clamp(input.question)}\n\nThe investigator's draft so far —\n` +
    `QUESTION: ${clamp(d.question)}\nSOURCE URL: ${clamp(d.sourceUrl)}\n` +
    `FINDING: ${clamp(d.evidence) || '(empty)'}\nUNCERTAINTY: ${clamp(d.uncertainty) || '(empty)'}\n\n` +
    `Name the single most important gap and how to close it. Do not write the finding.`
  const body = {
    systemInstruction: { parts: [{ text: buildCoachPrompt() }] },
    contents: [{ role: 'user', parts: [{ text: turn }] }],
    generationConfig: { maxOutputTokens: GUIDE_LIMITS.coachTokens, temperature: 0.4, thinkingConfig: { thinkingBudget: 0 } },
  }
  const text = await callGemini(COACH_MODEL, body, apiKey, fetchImpl, retries, sleepImpl)
  if (!text) throw new GuideError('empty')
  return { nudge: text }
}

// ── rate limit (Upstash REST + in-memory fallback) ────────────────────────────
export type RlConfig = { url?: string; token?: string }
export function rateLimitConfigured(cfg: RlConfig): boolean {
  return Boolean(cfg.url && cfg.token)
}
async function incr(cfg: RlConfig, key: string, ttl: number, fetchImpl: Fetch): Promise<number> {
  const res = await fetchImpl(`${cfg.url}/pipeline`, {
    method: 'POST',
    headers: { authorization: `Bearer ${cfg.token}`, 'content-type': 'application/json' },
    body: JSON.stringify([['INCR', key], ['EXPIRE', key, ttl, 'NX']]),
  })
  if (!res.ok) throw new Error(`upstash ${res.status}`)
  const data: any = await res.json()
  return Number(data?.[0]?.result ?? 0)
}
export async function checkRateLimit(
  ip: string, cfg: RlConfig, opts: { fetchImpl?: Fetch; limits?: typeof RL_LIMITS } = {},
): Promise<{ allowed: boolean; reason?: 'ip' | 'global' }> {
  const fetchImpl = opts.fetchImpl ?? fetch
  const limits = opts.limits ?? RL_LIMITS
  if ((await incr(cfg, `guide:rl:ip:${ip}`, 60, fetchImpl)) > limits.perIpPerMin) return { allowed: false, reason: 'ip' }
  if ((await incr(cfg, 'guide:rl:global', 86400, fetchImpl)) > limits.globalPerDay) return { allowed: false, reason: 'global' }
  return { allowed: true }
}

export type MemStore = { ip: Map<string, { count: number; resetAt: number }>; global: { count: number; resetAt: number } }
const _memStore: MemStore = { ip: new Map(), global: { count: 0, resetAt: 0 } }
export function memRateLimit(
  ip: string, now: number, limits: typeof RL_LIMITS = RL_LIMITS, store: MemStore = _memStore,
): { allowed: boolean; reason?: 'ip' | 'global' } {
  const ipE = store.ip.get(ip)
  if (!ipE || ipE.resetAt <= now) store.ip.set(ip, { count: 1, resetAt: now + 60_000 })
  else if (++ipE.count > limits.perIpPerMin) return { allowed: false, reason: 'ip' }
  if (store.global.resetAt <= now) { store.global.count = 1; store.global.resetAt = now + 86_400_000 }
  else if (++store.global.count > limits.globalPerDay) return { allowed: false, reason: 'global' }
  if (store.ip.size > 5000) for (const [k, e] of store.ip) if (e.resetAt <= now) store.ip.delete(k)
  return { allowed: true }
}

// ── handler ───────────────────────────────────────────────────────────────────
type Req = { method?: string; body?: unknown; headers?: Record<string, string | string[] | undefined> }
type Res = { status: (code: number) => Res; json: (body: unknown) => void }
const ERROR_STATUS: Record<string, number> = { 'bad-request': 400, 'safety-blocked': 422 }

function clientIp(headers: Req['headers']): string {
  const xff = headers?.['x-forwarded-for']
  const raw = Array.isArray(xff) ? xff[0] : xff
  return (raw ?? '').toString().split(',')[0].trim() || 'unknown'
}

export default async function handler(req: Req, res: Res): Promise<void> {
  if (req.method !== 'POST') { res.status(405).json({ error: 'method-not-allowed' }); return }
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) { res.status(503).json({ error: 'not-configured' }); return }

  let parsed: any
  try {
    parsed = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  } catch {
    res.status(400).json({ error: 'bad-json' }); return
  }
  const mode = parsed?.mode
  if (mode !== 'orient' && mode !== 'coach') { res.status(400).json({ error: 'bad-request' }); return }

  // Rate limit: Upstash preferred (hard global cap); else in-memory fallback on a
  // deployed env; local dev unlimited. Mirrors api/ghost.ts.
  const rl: RlConfig = { url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN }
  const deployed = process.env.VERCEL_ENV === 'production' || process.env.VERCEL_ENV === 'preview'
  if (rateLimitConfigured(rl)) {
    try {
      const v = await checkRateLimit(clientIp(req.headers), rl)
      if (!v.allowed) { res.status(429).json({ error: 'rate-limited', scope: v.reason }); return }
    } catch {
      res.status(503).json({ error: 'ratelimit-unavailable' }); return
    }
  } else if (deployed) {
    const v = memRateLimit(clientIp(req.headers), Date.now())
    if (!v.allowed) { res.status(429).json({ error: 'rate-limited', scope: v.reason }); return }
  }

  try {
    if (mode === 'orient') {
      const source = parsed?.source
      const question = parsed?.question
      if (!source?.url || typeof question !== 'string') { res.status(400).json({ error: 'bad-request' }); return }
      res.status(200).json(await orient({ source: { title: String(source.title ?? ''), url: String(source.url) }, question }, { apiKey }))
    } else {
      const draft = parsed?.draft
      const question = parsed?.question
      if (!draft || typeof question !== 'string') { res.status(400).json({ error: 'bad-request' }); return }
      res.status(200).json(await coach({ draft, question }, { apiKey }))
    }
  } catch (e) {
    const code = e instanceof GuideError ? e.code : 'error'
    res.status(ERROR_STATUS[code] ?? 502).json({ error: code })
  }
}
