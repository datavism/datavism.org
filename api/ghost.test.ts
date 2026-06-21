import { describe, it, expect, afterEach } from 'vitest'
import handler from './ghost'

function mockRes() {
  const r: { code: number; body: unknown; status: (c: number) => typeof r; json: (b: unknown) => typeof r } = {
    code: 0,
    body: null,
    status(c) {
      this.code = c
      return this
    },
    json(b) {
      this.body = b
      return this
    },
  }
  return r
}

describe('api/ghost handler (no-network paths)', () => {
  const origKey = process.env.GEMINI_API_KEY
  const origUrl = process.env.UPSTASH_REDIS_REST_URL
  const origTok = process.env.UPSTASH_REDIS_REST_TOKEN
  const restore = (k: string, v: string | undefined) => (v === undefined ? delete process.env[k] : (process.env[k] = v))
  afterEach(() => {
    restore('GEMINI_API_KEY', origKey)
    restore('UPSTASH_REDIS_REST_URL', origUrl)
    restore('UPSTASH_REDIS_REST_TOKEN', origTok)
  })

  it('405 on a non-POST method', async () => {
    const res = mockRes()
    await handler({ method: 'GET' }, res)
    expect(res.code).toBe(405)
  })

  it('503 when GEMINI_API_KEY is unset', async () => {
    delete process.env.GEMINI_API_KEY
    const res = mockRes()
    await handler({ method: 'POST', body: { messages: [{ role: 'user', content: 'hi' }] } }, res)
    expect(res.code).toBe(503)
    expect(res.body).toEqual({ error: 'not-configured' })
  })

  it('400 when messages is not an array (validation precedes the limiter)', async () => {
    process.env.GEMINI_API_KEY = 'k'
    const res = mockRes()
    await handler({ method: 'POST', body: { messages: 'nope' } }, res)
    expect(res.code).toBe(400)
  })

  it('503 fails closed when the key is set but no rate limiter is configured', async () => {
    process.env.GEMINI_API_KEY = 'k'
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
    const res = mockRes()
    await handler({ method: 'POST', body: { messages: [{ role: 'user', content: 'hi' }] } }, res)
    expect(res.code).toBe(503)
    expect(res.body).toEqual({ error: 'ratelimit-not-configured' })
  })
})
