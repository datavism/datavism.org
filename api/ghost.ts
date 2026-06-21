// Vercel serverless function (root /api — deployed natively alongside the static
// Astro build, no SSR adapter). Holds GEMINI_API_KEY server-side and proxies the
// GHOST agent. Config-gated: 503 when the key is unset, so /ghost shows "offline".
import { askGhost, GhostError, type GhostMessage } from '../src/lib/ghost/gemini'

type Req = { method?: string; body?: unknown }
type Res = { status: (code: number) => Res; json: (body: unknown) => void }

const ERROR_STATUS: Record<string, number> = {
  'too-long': 400,
  'bad-request': 400,
  'safety-blocked': 422,
}

// TODO v0.2: this is an unauthenticated public endpoint. Per-request caps bound
// cost per call, but NOT call volume — add per-IP rate limiting (Vercel Edge
// Config or Upstash Redis) before any high-traffic launch.
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
