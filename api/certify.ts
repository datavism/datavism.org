// api/certify.ts — self-contained Vercel serverless function (Node runtime).
//
// SELF-CONTAINED ON PURPOSE: Vercel's /api builder does NOT bundle cross-directory
// imports — a `../src/...` import resolves to /var/task/src/... at runtime, which is
// not deployed, and fails with ERR_MODULE_NOT_FOUND. So all logic lives here, like
// api/ghost.ts. Pure helpers are exported for unit tests (src/certify-agent.test.ts).
//
// WHAT THIS DOES: GHOST certifies the METHOD of an agent's finding — never the TRUTH.
// It judges whether a real source is cited, the finding is specific and traceable, and
// uncertainty is acknowledged. It does NOT and CANNOT verify whether the claim is
// factually correct. Method, never truth. This is the binding honesty rule of DATAVISM.
//
// Holds GEMINI_API_KEY server-side; 503 when unset. Rate-limited on deployed envs
// (fail closed) to protect the Gemini budget, same pattern as api/ghost.ts.

export type Finding = {
  question: string
  sourceUrl: string
  evidence: string
  uncertainty: string
}

export type Verdict = {
  certified: boolean
  feedback: string
  notes: { source: boolean; specificity: boolean; uncertainty: boolean }
}

export type Fetch = typeof fetch

export class CertifyError extends Error {
  constructor(
    public readonly code: string,
    message?: string,
  ) {
    super(message ?? code)
    this.name = 'CertifyError'
  }
}

export const CERTIFY_LIMITS = { maxFieldChars: 1200, maxOutputTokens: 400 }
export const RL_LIMITS = { perIpPerMin: 8, globalPerDay: 400 }

// ── deterministic structural pre-check ────────────────────────────────────────
// Mirrors src/lib/command-center/certify.ts preCheck(); inlined because /api cannot
// import from ../src at runtime. Keep the two in sync if the structural bar changes.
export function preCheckStructure(f: Finding): { ok: boolean; missing: string[] } {
  const missing: string[] = []
  if (!/^https?:\/\//.test(f.sourceUrl.trim())) missing.push('source')
  if (f.uncertainty.trim().length < 8) missing.push('uncertainty')
  if (f.evidence.trim().length < 24) missing.push('specificity')
  if (f.question.trim().length < 12) missing.push('question')
  return { ok: missing.length === 0, missing }
}

// ── system prompt ─────────────────────────────────────────────────────────────
export function buildCertifyPrompt(): string {
  return `You are GHOST, the methodological auditor of DATAVISM — an "Evidence Engine" that teaches people to investigate hidden systems with AI, data and verifiable methods.

YOUR ONE JOB: certify the METHOD. You NEVER verify TRUTH.
You have NOT seen the source. You CANNOT and MUST NOT judge whether the agent's finding is factually correct — "is this true" is the agent's burden, not yours. Never imply you have confirmed a fact. You judge ONLY whether the investigative method is sound, on exactly three axes:

  SOURCE — Is the finding TRACEABLE to a real, official public source? PASS if the cited source is the authoritative public source for this kind of data (an official register, database, filing system, or dataset) AND the finding names a specific record or entity that someone could locate there by name or search term. A deep-link or permalink is NOT required — citing the official source plus a named, locatable entity is sufficient traceability; do not demand the exact entry URL (many public registers are apps with no shareable per-entry link). FAIL only if: no source is cited, the source is not authoritative (a search-engine results page, a blog, a social post, a marketing page), or it does not actually cover the claim.
  SPECIFICITY — Is the finding ONE concrete, traceable claim — it names a specific entity AND at least one concrete attribute the source actually publishes (a figure, a declared RANGE or BAND, a count, a category, a date)? A declared range or band IS concrete — do NOT demand a single exact number when the source only publishes ranges, bands, or categories. FAIL only if the finding is a vague feeling, a generality, an opinion, or names no specific entity or attribute.
  UNCERTAINTY — Does the agent acknowledge what is unverified, self-declared, incomplete, or could be wrong?

Set certified=true ONLY if all three axes hold. Otherwise certified=false, and in feedback name the SINGLE most important fix — concretely, in one sentence.

CALIBRATION — certify when the method is genuinely sound for what THIS source provides. A finding that cites the official source, names a real entity, reports a concrete attribute the source actually publishes, and states its uncertainty is a PASS. Do NOT invent a fourth hurdle, do NOT nitpick formatting, and do NOT demand detail the source cannot yield. Reserve certified=false for findings that are genuinely vague, unsourced, opinion, or untraceable.

VOICE: precise, calm, unsentimental, method-first. Address the agent directly ("you"). Never praise the conclusion — only the craft. Never motivational, never cringe. Be concise: feedback is at most 240 characters.

Return ONLY a JSON object, no prose, no code fences:
{"certified": boolean, "feedback": string, "notes": {"source": boolean, "specificity": boolean, "uncertainty": boolean}}`
}

// ── verdict parsing (tolerant) ─────────────────────────────────────────────────
export function parseVerdict(text: string): Verdict {
  const fallback: Verdict = {
    certified: false,
    feedback: 'Could not read the certification result. Refine your finding and resubmit.',
    notes: { source: false, specificity: false, uncertainty: false },
  }
  if (!text) return fallback
  // Strip code fences and isolate the first JSON object.
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return fallback
  let raw: any
  try {
    raw = JSON.parse(cleaned.slice(start, end + 1))
  } catch {
    return fallback
  }
  const n = raw?.notes ?? {}
  const certified = raw?.certified === true
  // When certified, the model often omits feedback (nothing to fix) — never show the
  // failure-fallback line in that case; it would contradict the verdict.
  const feedback =
    typeof raw?.feedback === 'string' && raw.feedback.trim()
      ? raw.feedback.trim().slice(0, 240)
      : certified
        ? 'Method holds.'
        : 'Tighten the finding and resubmit.'
  return {
    certified,
    feedback,
    notes: {
      source: n?.source === true,
      specificity: n?.specificity === true,
      uncertainty: n?.uncertainty === true,
    },
  }
}

// ── Gemini call ─────────────────────────────────────────────────────────────────
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504])

export function buildUserTurn(finding: Finding, operation?: { question?: string }): string {
  const ctx = operation?.question ? `OPERATION QUESTION: ${operation.question}\n\n` : ''
  return (
    `${ctx}The agent submitted this finding for method certification. Judge the METHOD only.\n\n` +
    `QUESTION: ${finding.question}\n` +
    `SOURCE URL: ${finding.sourceUrl}\n` +
    `EVIDENCE / FINDING: ${finding.evidence}\n` +
    `STATED UNCERTAINTY: ${finding.uncertainty}`
  )
}

export async function judgeFinding(
  finding: Finding,
  opts: {
    apiKey: string
    model?: string
    operation?: { question?: string }
    fetchImpl?: Fetch
    limits?: typeof CERTIFY_LIMITS
    retries?: number
    sleepImpl?: (ms: number) => Promise<void>
  },
): Promise<Verdict> {
  const {
    apiKey,
    model = 'gemini-2.5-flash-lite',
    operation,
    fetchImpl = fetch,
    limits = CERTIFY_LIMITS,
    retries = 2,
    sleepImpl = (ms: number) => new Promise<void>((r) => setTimeout(r, ms)),
  } = opts
  if (!apiKey) throw new CertifyError('not-configured')

  // Clamp each field so a pasted dump can't blow the token budget.
  const clamp = (s: string) => (s ?? '').toString().slice(0, limits.maxFieldChars)
  const clamped: Finding = {
    question: clamp(finding.question),
    sourceUrl: clamp(finding.sourceUrl),
    evidence: clamp(finding.evidence),
    uncertainty: clamp(finding.uncertainty),
  }

  const body = {
    systemInstruction: { parts: [{ text: buildCertifyPrompt() }] },
    contents: [{ role: 'user', parts: [{ text: buildUserTurn(clamped, operation) }] }],
    generationConfig: {
      maxOutputTokens: limits.maxOutputTokens,
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`

  let res: Awaited<ReturnType<Fetch>> | undefined
  let lastInfo = 'network'
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) await sleepImpl(250 * 2 ** (attempt - 1))
    try {
      res = await fetchImpl(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
    } catch {
      lastInfo = 'network'
      res = undefined
      continue
    }
    if (res.ok) break
    lastInfo = `gemini ${res.status}`
    if (!RETRYABLE_STATUS.has(res.status)) break
  }
  if (!res || !res.ok) throw new CertifyError('api-error', lastInfo)

  const data: any = await res.json()
  if (data?.promptFeedback?.blockReason) throw new CertifyError('safety-blocked')
  const candidate = data?.candidates?.[0]
  if (candidate?.finishReason === 'SAFETY') throw new CertifyError('safety-blocked')
  const reply = (candidate?.content?.parts ?? [])
    .map((p: { text?: string }) => p.text ?? '')
    .join('')
    .trim()
  if (!reply) throw new CertifyError('empty')
  return parseVerdict(reply)
}

// ── rate limit (Upstash REST, fixed windows) ──────────────────────────────────
export type RlConfig = { url?: string; token?: string }

export function rateLimitConfigured(cfg: RlConfig): boolean {
  return Boolean(cfg.url && cfg.token)
}

async function incr(cfg: RlConfig, key: string, ttl: number, fetchImpl: Fetch): Promise<number> {
  const res = await fetchImpl(`${cfg.url}/pipeline`, {
    method: 'POST',
    headers: { authorization: `Bearer ${cfg.token}`, 'content-type': 'application/json' },
    body: JSON.stringify([
      ['INCR', key],
      ['EXPIRE', key, ttl, 'NX'],
    ]),
  })
  if (!res.ok) throw new Error(`upstash ${res.status}`)
  const data: any = await res.json()
  return Number(data?.[0]?.result ?? 0)
}

export async function checkRateLimit(
  ip: string,
  cfg: RlConfig,
  opts: { fetchImpl?: Fetch; limits?: typeof RL_LIMITS } = {},
): Promise<{ allowed: boolean; reason?: 'ip' | 'global' }> {
  const fetchImpl = opts.fetchImpl ?? fetch
  const limits = opts.limits ?? RL_LIMITS
  if ((await incr(cfg, `certify:rl:ip:${ip}`, 60, fetchImpl)) > limits.perIpPerMin) return { allowed: false, reason: 'ip' }
  if ((await incr(cfg, 'certify:rl:global', 86400, fetchImpl)) > limits.globalPerDay) return { allowed: false, reason: 'global' }
  return { allowed: true }
}

// ── in-memory fallback limiter (per warm instance; NOT distributed) ────────────
// Used on deployed envs when Upstash isn't configured, so GHOST works without
// provisioning Redis instead of failing closed. Weaker than the distributed cap —
// state lives per warm function instance, so a coordinated multi-instance attack
// gets less protection. Configure Upstash for a hard global limit.
export type MemStore = {
  ip: Map<string, { count: number; resetAt: number }>
  global: { count: number; resetAt: number }
}
const _memStore: MemStore = { ip: new Map(), global: { count: 0, resetAt: 0 } }

export function memRateLimit(
  ip: string,
  now: number,
  limits: typeof RL_LIMITS = RL_LIMITS,
  store: MemStore = _memStore,
): { allowed: boolean; reason?: 'ip' | 'global' } {
  const ipE = store.ip.get(ip)
  if (!ipE || ipE.resetAt <= now) store.ip.set(ip, { count: 1, resetAt: now + 60_000 })
  else if (++ipE.count > limits.perIpPerMin) return { allowed: false, reason: 'ip' }

  if (store.global.resetAt <= now) { store.global.count = 1; store.global.resetAt = now + 86_400_000 }
  else if (++store.global.count > limits.globalPerDay) return { allowed: false, reason: 'global' }

  // opportunistic prune so the map can't grow unbounded on a long-lived instance
  if (store.ip.size > 5000) for (const [k, e] of store.ip) if (e.resetAt <= now) store.ip.delete(k)
  return { allowed: true }
}

// ── handler ───────────────────────────────────────────────────────────────────
type Req = { method?: string; body?: unknown; headers?: Record<string, string | string[] | undefined> }
type Res = { status: (code: number) => Res; json: (body: unknown) => void }

const ERROR_STATUS: Record<string, number> = { 'bad-request': 400, 'safety-blocked': 422, incomplete: 422 }

function clientIp(headers: Req['headers']): string {
  const xff = headers?.['x-forwarded-for']
  const raw = Array.isArray(xff) ? xff[0] : xff
  return (raw ?? '').toString().split(',')[0].trim() || 'unknown'
}

function asFinding(v: any): Finding | null {
  if (!v || typeof v !== 'object') return null
  const f = {
    question: typeof v.question === 'string' ? v.question : '',
    sourceUrl: typeof v.sourceUrl === 'string' ? v.sourceUrl : '',
    evidence: typeof v.evidence === 'string' ? v.evidence : '',
    uncertainty: typeof v.uncertainty === 'string' ? v.uncertainty : '',
  }
  return f
}

export default async function handler(req: Req, res: Res): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method-not-allowed' })
    return
  }
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    res.status(503).json({ error: 'not-configured' })
    return
  }

  // Validate request shape BEFORE spending a rate-limit token.
  let finding: Finding | null
  let operation: { question?: string } | undefined
  try {
    const parsed = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    finding = asFinding((parsed as any)?.finding)
    const op = (parsed as any)?.operation
    operation = op && typeof op.question === 'string' ? { question: op.question } : undefined
  } catch {
    res.status(400).json({ error: 'bad-json' })
    return
  }
  if (!finding) {
    res.status(400).json({ error: 'bad-request' })
    return
  }

  // Deterministic gate: don't spend an AI call on a structurally incomplete finding.
  const structural = preCheckStructure(finding)
  if (!structural.ok) {
    res.status(422).json({ error: 'incomplete', missing: structural.missing })
    return
  }

  // Rate limit protects the Gemini budget. Prefer the distributed Upstash limiter
  // (hard global cap). On a deployed env without Upstash, fall back to an in-memory
  // per-instance limiter instead of failing closed, so GHOST works without Redis.
  // Local dev: unlimited.
  const rl: RlConfig = { url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN }
  const deployed = process.env.VERCEL_ENV === 'production' || process.env.VERCEL_ENV === 'preview'
  if (rateLimitConfigured(rl)) {
    try {
      const verdict = await checkRateLimit(clientIp(req.headers), rl)
      if (!verdict.allowed) {
        res.status(429).json({ error: 'rate-limited', scope: verdict.reason })
        return
      }
    } catch {
      res.status(503).json({ error: 'ratelimit-unavailable' })
      return
    }
  } else if (deployed) {
    const verdict = memRateLimit(clientIp(req.headers), Date.now())
    if (!verdict.allowed) {
      res.status(429).json({ error: 'rate-limited', scope: verdict.reason })
      return
    }
  }

  try {
    const verdict = await judgeFinding(finding, { apiKey, model: process.env.GEMINI_MODEL, operation })
    res.status(200).json(verdict)
  } catch (e) {
    const code = e instanceof CertifyError ? e.code : 'error'
    res.status(ERROR_STATUS[code] ?? 502).json({ error: code })
  }
}
