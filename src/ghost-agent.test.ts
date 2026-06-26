import { describe, it, expect, afterEach } from 'vitest'
import handler, {
  buildSystemPrompt,
  askGhost,
  GhostError,
  GHOST_LIMITS,
  rateLimitConfigured,
  checkRateLimit,
} from '../api/ghost'

const user = (content: string) => ({ role: 'user' as const, content })

function mockFetch(status: number, body: unknown) {
  const calls: { url: string; init: any }[] = []
  const fn = async (url: string, init: any) => {
    calls.push({ url, init })
    return { ok: status >= 200 && status < 300, status, json: async () => body } as any
  }
  return Object.assign(fn, { calls })
}

describe('GHOST system prompt', () => {
  const p = buildSystemPrompt()
  it('establishes persona, method, and all five lines', () => {
    expect(p).toMatch(/GHOST/)
    expect(p).toMatch(/Verification/)
    for (const name of ['GHOST / Foundation', 'KEY / Tracking & OSINT', 'ROOK / Economy & Power', 'BITE / Feeds & Behavior', 'VESPER / Climate & Future'])
      expect(p).toContain(name)
  })
  it('encodes the honesty + safety rules', () => {
    const low = p.toLowerCase()
    expect(low).toMatch(/uncertain/)
    expect(low).toMatch(/not fabricate/)
    expect(low).toMatch(/judg/)
    expect(low).toMatch(/refuse|off-topic|scope/)
  })
})

describe('askGhost', () => {
  const opts = (f: any) => ({ apiKey: 'k', model: 'gemini-2.5-flash-lite', fetchImpl: f, sleepImpl: async () => {} })

  it('returns the reply and sends a system instruction + the key as ?key=', async () => {
    const f = mockFetch(200, { candidates: [{ content: { parts: [{ text: 'Ask a sharper question.' }] } }] })
    const r = await askGhost([user('help')], opts(f))
    expect(r.reply).toBe('Ask a sharper question.')
    const sent = JSON.parse(f.calls[0].init.body)
    expect(sent.systemInstruction.parts[0].text).toMatch(/GHOST/)
    expect(sent.contents.at(-1)).toEqual({ role: 'user', parts: [{ text: 'help' }] })
    expect(f.calls[0].url).toContain('?key=')
  })
  it('maps assistant turns to the model role', async () => {
    const f = mockFetch(200, { candidates: [{ content: { parts: [{ text: 'ok' }] } }] })
    await askGhost([user('a'), { role: 'assistant', content: 'b' }, user('c')], opts(f))
    expect(JSON.parse(f.calls[0].init.body).contents.map((c: any) => c.role)).toEqual(['user', 'model', 'user'])
  })
  it('throws not-configured / too-long / bad-request', async () => {
    await expect(askGhost([user('hi')], { apiKey: '' } as any)).rejects.toMatchObject({ code: 'not-configured' })
    await expect(askGhost([user('x'.repeat(GHOST_LIMITS.maxInputChars + 1))], opts(mockFetch(200, {})))).rejects.toMatchObject({ code: 'too-long' })
    await expect(askGhost([user('a'), { role: 'assistant', content: 'b' }], opts(mockFetch(200, {})))).rejects.toMatchObject({ code: 'bad-request' })
  })
  it('surfaces input- and output-side safety blocks', async () => {
    await expect(askGhost([user('x')], opts(mockFetch(200, { promptFeedback: { blockReason: 'SAFETY' } })))).rejects.toMatchObject({ code: 'safety-blocked' })
    await expect(askGhost([user('x')], opts(mockFetch(200, { candidates: [{ finishReason: 'SAFETY', content: { parts: [] } }] })))).rejects.toMatchObject({ code: 'safety-blocked' })
  })
  it('throws api-error / empty', async () => {
    await expect(askGhost([user('hi')], opts(mockFetch(429, {})))).rejects.toBeInstanceOf(GhostError)
    await expect(askGhost([user('hi')], opts(mockFetch(200, { candidates: [] })))).rejects.toMatchObject({ code: 'empty' })
  })
  it('retries a transient upstream error, then succeeds', async () => {
    const seq = [
      { ok: false, status: 503, json: async () => ({ error: { code: 503 } }) },
      { ok: true, status: 200, json: async () => ({ candidates: [{ content: { parts: [{ text: 'recovered' }] } }] }) },
    ]
    const calls: number[] = []
    const f = Object.assign(async () => { calls.push(1); return seq[calls.length - 1] as any }, { calls })
    const r = await askGhost([user('hi')], { apiKey: 'k', fetchImpl: f as any, sleepImpl: async () => {} })
    expect(r.reply).toBe('recovered')
    expect(calls.length).toBe(2)
  })
  it('does not retry a non-retryable upstream status (fails fast)', async () => {
    const f = mockFetch(400, { error: { code: 400 } })
    await expect(askGhost([user('hi')], opts(f))).rejects.toMatchObject({ code: 'api-error' })
    expect(f.calls.length).toBe(1)
  })
  it('gives up with api-error after exhausting retries on a persistent error', async () => {
    const f = mockFetch(503, { error: { code: 503 } })
    await expect(askGhost([user('hi')], opts(f))).rejects.toMatchObject({ code: 'api-error' })
    expect(f.calls.length).toBe(3) // 1 initial + 2 retries
  })
  it('trims the oldest turns to fit the budget instead of rejecting a long conversation', async () => {
    const f = mockFetch(200, { candidates: [{ content: { parts: [{ text: 'ok' }] } }] })
    const limits = { maxInputChars: 100, maxTurns: 12, maxOutputTokens: 600 }
    const convo = [
      { role: 'user' as const, content: 'a'.repeat(60) },
      { role: 'assistant' as const, content: 'b'.repeat(60) },
      { role: 'user' as const, content: 'c'.repeat(60) },
    ]
    const r = await askGhost(convo, { apiKey: 'k', fetchImpl: f as any, limits })
    expect(r.reply).toBe('ok')
    const sent = JSON.parse(f.calls[0].init.body)
    expect(sent.contents.length).toBe(1) // only the final user turn fits (60 ≤ 100; +any prior = 120 > 100)
    expect(sent.contents[0].parts[0].text).toBe('c'.repeat(60))
  })
  it('still rejects a single message that alone overflows the budget', async () => {
    const limits = { maxInputChars: 100, maxTurns: 12, maxOutputTokens: 600 }
    await expect(
      askGhost([user('x'.repeat(101))], { apiKey: 'k', fetchImpl: mockFetch(200, {}) as any, limits }),
    ).rejects.toMatchObject({ code: 'too-long' })
  })
})

describe('rate limit', () => {
  const cfg = { url: 'https://x.upstash.io', token: 't' }
  const limits = { perIpPerMin: 5, globalPerDay: 10 }
  function mockUpstash(...counts: number[]) {
    const queue = [...counts]
    const calls: any[] = []
    const fn = async (url: string, init: any) => {
      calls.push({ url, init })
      return { ok: true, status: 200, json: async () => [{ result: queue.shift() ?? 1 }, { result: 1 }] } as any
    }
    return Object.assign(fn, { calls })
  }
  it('reports configured only with url + token', () => {
    expect(rateLimitConfigured(cfg)).toBe(true)
    expect(rateLimitConfigured({ url: 'x' })).toBe(false)
  })
  it('allows under limits; blocks on ip then global', async () => {
    expect(await checkRateLimit('1.2.3.4', cfg, { fetchImpl: mockUpstash(1, 1) as any, limits })).toEqual({ allowed: true })
    expect(await checkRateLimit('1.2.3.4', cfg, { fetchImpl: mockUpstash(6) as any, limits })).toEqual({ allowed: false, reason: 'ip' })
    expect(await checkRateLimit('1.2.3.4', cfg, { fetchImpl: mockUpstash(1, 11) as any, limits })).toEqual({ allowed: false, reason: 'global' })
  })
  it('throws when the backend errors (caller fails closed)', async () => {
    const f = async () => ({ ok: false, status: 500, json: async () => ({}) }) as any
    await expect(checkRateLimit('1.2.3.4', cfg, { fetchImpl: f as any, limits })).rejects.toBeTruthy()
  })
})

describe('handler (no-network paths)', () => {
  const keys = ['GEMINI_API_KEY', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'VERCEL_ENV'] as const
  const orig = Object.fromEntries(keys.map((k) => [k, process.env[k]]))
  afterEach(() => keys.forEach((k) => (orig[k] === undefined ? delete process.env[k] : (process.env[k] = orig[k]!))))

  function mockRes() {
    const r: { code: number; body: unknown; status: (c: number) => typeof r; json: (b: unknown) => typeof r } = {
      code: 0, body: null, status(c) { this.code = c; return this }, json(b) { this.body = b; return this },
    }
    return r
  }

  it('405 on non-POST', async () => {
    const res = mockRes()
    await handler({ method: 'GET' }, res)
    expect(res.code).toBe(405)
  })
  it('503 when the key is unset', async () => {
    delete process.env.GEMINI_API_KEY
    const res = mockRes()
    await handler({ method: 'POST', body: { messages: [user('hi')] } }, res)
    expect(res.body).toEqual({ error: 'not-configured' })
  })
  it('400 when messages is not an array (before the limiter)', async () => {
    process.env.GEMINI_API_KEY = 'k'
    const res = mockRes()
    await handler({ method: 'POST', body: { messages: 'nope' } }, res)
    expect(res.code).toBe(400)
  })
  it('503 fails closed on a deployed env with no limiter configured', async () => {
    process.env.GEMINI_API_KEY = 'k'
    process.env.VERCEL_ENV = 'production'
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
    const res = mockRes()
    await handler({ method: 'POST', body: { messages: [user('hi')] } }, res)
    expect(res.body).toEqual({ error: 'ratelimit-not-configured' })
  })
})
