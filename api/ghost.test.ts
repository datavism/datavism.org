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
  const orig = process.env.GEMINI_API_KEY
  afterEach(() => {
    if (orig === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = orig
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

  it('400 when messages is not an array', async () => {
    process.env.GEMINI_API_KEY = 'k'
    const res = mockRes()
    await handler({ method: 'POST', body: { messages: 'nope' } }, res)
    expect(res.code).toBe(400)
  })
})
