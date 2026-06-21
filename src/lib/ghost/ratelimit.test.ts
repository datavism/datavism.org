import { describe, it, expect } from 'vitest'
import { rateLimitConfigured, checkRateLimit } from './ratelimit'

// Upstash /pipeline returns one [{result}] entry per command; we read the INCR count.
function mockUpstash(...counts: number[]) {
  const queue = [...counts]
  const calls: { url: string; init: any }[] = []
  const fn = async (url: string, init: any) => {
    calls.push({ url, init })
    const n = queue.shift() ?? 1
    return { ok: true, status: 200, json: async () => [{ result: n }, { result: 1 }] } as any
  }
  return Object.assign(fn, { calls })
}

const cfg = { url: 'https://x.upstash.io', token: 't' }
const limits = { perIpPerMin: 5, globalPerDay: 10 }

describe('GHOST rate limit', () => {
  it('reports configured only when url + token are both present', () => {
    expect(rateLimitConfigured(cfg)).toBe(true)
    expect(rateLimitConfigured({ url: 'x' })).toBe(false)
    expect(rateLimitConfigured({})).toBe(false)
  })

  it('allows a request under both limits', async () => {
    const f = mockUpstash(1, 1) // ip=1, global=1
    expect(await checkRateLimit('1.2.3.4', cfg, { fetchImpl: f as any, limits })).toEqual({ allowed: true })
  })

  it('blocks when the per-IP/min limit is exceeded (and does not touch the global counter)', async () => {
    const f = mockUpstash(6) // ip=6 > 5
    expect(await checkRateLimit('1.2.3.4', cfg, { fetchImpl: f as any, limits })).toEqual({ allowed: false, reason: 'ip' })
    expect(f.calls).toHaveLength(1) // global counter not incremented
  })

  it('blocks when the global daily cap is exceeded', async () => {
    const f = mockUpstash(1, 11) // ip ok, global=11 > 10
    expect(await checkRateLimit('1.2.3.4', cfg, { fetchImpl: f as any, limits })).toEqual({ allowed: false, reason: 'global' })
  })

  it('sends INCR + EXPIRE NX for the per-IP key', async () => {
    const f = mockUpstash(1, 1)
    await checkRateLimit('9.9.9.9', cfg, { fetchImpl: f as any, limits })
    const body = JSON.parse(f.calls[0].init.body)
    expect(body[0]).toEqual(['INCR', 'ghost:rl:ip:9.9.9.9'])
    expect(body[1]).toEqual(['EXPIRE', 'ghost:rl:ip:9.9.9.9', 60, 'NX'])
    expect(f.calls[0].init.headers.authorization).toBe('Bearer t')
  })

  it('throws when the limiter backend errors (caller fails closed)', async () => {
    const f = async () => ({ ok: false, status: 500, json: async () => ({}) }) as any
    await expect(checkRateLimit('1.2.3.4', cfg, { fetchImpl: f as any, limits })).rejects.toBeTruthy()
  })
})
