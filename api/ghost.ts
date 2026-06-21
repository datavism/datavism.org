// Vercel serverless function (root /api — deployed natively alongside the static
// Astro build, no SSR adapter). Holds GEMINI_API_KEY server-side and proxies the
// GHOST agent. Config-gated: 503 when the key is unset, so /ghost shows "offline".
// FAILS CLOSED on rate limiting: when the Gemini key is set, the endpoint refuses
// to run unless a rate limiter is configured — so the public AI proxy can never be
// left uncapped and run up the bill.
import { askGhost, GhostError, type GhostMessage } from '../src/lib/ghost/gemini'
import { rateLimitConfigured, checkRateLimit } from '../src/lib/ghost/ratelimit'

type Req = { method?: string; body?: unknown; headers?: Record<string, string | string[] | undefined> }
type Res = { status: (code: number) => Res; json: (body: unknown) => void }

const ERROR_STATUS: Record<string, number> = {
  'too-long': 400,
  'bad-request': 400,
  'safety-blocked': 422,
}

function clientIp(headers: Req['headers']): string {
  const xff = headers?.['x-forwarded-for']
  const raw = Array.isArray(xff) ? xff[0] : xff
  return (raw ?? '').toString().split(',')[0].trim() || 'unknown'
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

  // Validate the request shape BEFORE spending a rate-limit token.
  let messages: unknown
  try {
    const parsed = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    messages = (parsed as { messages?: unknown } | null | undefined)?.messages
  } catch {
    res.status(400).json({ error: 'bad-json' })
    return
  }
  if (!Array.isArray(messages)) {
    res.status(400).json({ error: 'bad-request' })
    return
  }

  // Rate limit is REQUIRED when the agent is live — protects the Gemini budget.
  const rl = { url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN }
  if (!rateLimitConfigured(rl)) {
    res.status(503).json({ error: 'ratelimit-not-configured' })
    return
  }
  try {
    const verdict = await checkRateLimit(clientIp(req.headers), rl)
    if (!verdict.allowed) {
      res.status(429).json({ error: 'rate-limited', scope: verdict.reason })
      return
    }
  } catch {
    res.status(503).json({ error: 'ratelimit-unavailable' }) // backend down → fail closed
    return
  }

  try {
    const { reply } = await askGhost(messages as GhostMessage[], {
      apiKey,
      model: process.env.GEMINI_MODEL,
    })
    res.status(200).json({ reply })
  } catch (e) {
    const code = e instanceof GhostError ? e.code : 'error'
    res.status(ERROR_STATUS[code] ?? 502).json({ error: code })
  }
}
