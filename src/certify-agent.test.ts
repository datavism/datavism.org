import { describe, it, expect } from 'vitest'
import {
  buildCertifyPrompt,
  buildUserTurn,
  parseVerdict,
  preCheckStructure,
  judgeFinding,
  memRateLimit,
  CertifyError,
  type Finding,
  type MemStore,
} from '../api/certify'

const good: Finding = {
  question: 'Which organisation declared the highest lobbying spend on the Bundestag last year?',
  sourceUrl: 'https://www.lobbyregister.bundestag.de/startseite',
  evidence: 'Acme Verband declared the 4.5–5.0M EUR spending band, 18 staff, targeting energy policy.',
  uncertainty: 'The figure is a self-declared band, not audited, and may be out of date.',
}

function mockFetch(status: number, body: unknown) {
  const calls: { url: string; init: any }[] = []
  const fn = async (url: string, init: any) => {
    calls.push({ url, init })
    return { ok: status >= 200 && status < 300, status, json: async () => body } as any
  }
  return Object.assign(fn, { calls })
}

function geminiReply(text: string) {
  return { candidates: [{ content: { parts: [{ text }] } }] }
}

describe('certify system prompt', () => {
  const p = buildCertifyPrompt()
  it('binds method-not-truth as the core rule', () => {
    expect(p).toMatch(/certify the METHOD/i)
    expect(p).toMatch(/NEVER verify TRUTH/i)
    expect(p).toMatch(/have NOT seen the source/i)
  })
  it('names exactly the three method axes', () => {
    expect(p).toMatch(/SOURCE/)
    expect(p).toMatch(/SPECIFICITY/)
    expect(p).toMatch(/UNCERTAINTY/)
  })
  it('demands JSON-only output', () => {
    expect(p).toMatch(/Return ONLY a JSON object/i)
    expect(p).toMatch(/"certified"/)
  })
  it('accepts an official source + locatable entity — no deep-link required', () => {
    expect(p).toMatch(/traceable/i)
    expect(p).toMatch(/deep-link|permalink/i)
    expect(p).toMatch(/not required/i)
  })
})

describe('preCheckStructure', () => {
  it('passes a complete finding', () => {
    expect(preCheckStructure(good)).toEqual({ ok: true, missing: [] })
  })
  it('flags a non-http source', () => {
    expect(preCheckStructure({ ...good, sourceUrl: 'lobbyregister' }).missing).toContain('source')
  })
  it('flags missing uncertainty', () => {
    expect(preCheckStructure({ ...good, uncertainty: 'no' }).missing).toContain('uncertainty')
  })
  it('flags a vague (too-short) finding as lacking specificity', () => {
    expect(preCheckStructure({ ...good, evidence: 'they spend a lot' }).missing).toContain('specificity')
  })
})

describe('parseVerdict', () => {
  it('parses a clean verdict', () => {
    const v = parseVerdict('{"certified":true,"feedback":"Source cited, claim specific, uncertainty named.","notes":{"source":true,"specificity":true,"uncertainty":true}}')
    expect(v.certified).toBe(true)
    expect(v.notes).toEqual({ source: true, specificity: true, uncertainty: true })
  })
  it('strips code fences', () => {
    const v = parseVerdict('```json\n{"certified":false,"feedback":"Cite the exact register entry, not the homepage.","notes":{"source":false,"specificity":true,"uncertainty":true}}\n```')
    expect(v.certified).toBe(false)
    expect(v.notes.source).toBe(false)
  })
  it('falls back safely on garbage', () => {
    const v = parseVerdict('the model rambled with no json')
    expect(v.certified).toBe(false)
    expect(v.notes).toEqual({ source: false, specificity: false, uncertainty: false })
  })
  it('clamps overlong feedback to 240 chars', () => {
    const long = 'x'.repeat(500)
    const v = parseVerdict(`{"certified":true,"feedback":"${long}","notes":{"source":true,"specificity":true,"uncertainty":true}}`)
    expect(v.feedback.length).toBe(240)
  })
  it('coerces non-boolean certified to false', () => {
    const v = parseVerdict('{"certified":"yes","feedback":"hi","notes":{}}')
    expect(v.certified).toBe(false)
  })
  it('never shows the failure fallback when certified but feedback is omitted', () => {
    const v = parseVerdict('{"certified":true,"notes":{"source":true,"specificity":true,"uncertainty":true}}')
    expect(v.certified).toBe(true)
    expect(v.feedback).toBe('Method holds.')
    expect(v.feedback).not.toMatch(/could not read|resubmit/i)
  })
})

describe('buildUserTurn', () => {
  it('includes all four finding fields', () => {
    const t = buildUserTurn(good)
    expect(t).toContain(good.sourceUrl)
    expect(t).toContain(good.evidence)
    expect(t).toContain(good.uncertainty)
    expect(t).toMatch(/QUESTION:/)
  })
  it('prefixes operation context when provided', () => {
    const t = buildUserTurn(good, { question: 'Who pays to be in the room?' })
    expect(t).toMatch(/OPERATION QUESTION: Who pays to be in the room\?/)
  })
})

describe('memRateLimit (in-memory fallback)', () => {
  const fresh = (): MemStore => ({ ip: new Map(), global: { count: 0, resetAt: 0 } })

  it('allows up to the per-IP limit, then blocks within the window', () => {
    const store = fresh()
    const lim = { perIpPerMin: 3, globalPerDay: 1000 }
    expect(memRateLimit('1.1.1.1', 1000, lim, store).allowed).toBe(true)
    expect(memRateLimit('1.1.1.1', 1000, lim, store).allowed).toBe(true)
    expect(memRateLimit('1.1.1.1', 1000, lim, store).allowed).toBe(true)
    const blocked = memRateLimit('1.1.1.1', 1000, lim, store)
    expect(blocked.allowed).toBe(false)
    expect(blocked.reason).toBe('ip')
  })

  it('resets the per-IP window after 60s', () => {
    const store = fresh()
    const lim = { perIpPerMin: 1, globalPerDay: 1000 }
    expect(memRateLimit('a', 0, lim, store).allowed).toBe(true)
    expect(memRateLimit('a', 0, lim, store).allowed).toBe(false)
    expect(memRateLimit('a', 61_000, lim, store).allowed).toBe(true)
  })

  it('enforces the global cap across IPs', () => {
    const store = fresh()
    const lim = { perIpPerMin: 100, globalPerDay: 3 }
    expect(memRateLimit('a', 0, lim, store).allowed).toBe(true)
    expect(memRateLimit('b', 0, lim, store).allowed).toBe(true)
    expect(memRateLimit('c', 0, lim, store).allowed).toBe(true)
    const g = memRateLimit('d', 0, lim, store)
    expect(g.allowed).toBe(false)
    expect(g.reason).toBe('global')
  })

  it('tracks IPs independently', () => {
    const store = fresh()
    const lim = { perIpPerMin: 1, globalPerDay: 1000 }
    expect(memRateLimit('x', 0, lim, store).allowed).toBe(true)
    expect(memRateLimit('y', 0, lim, store).allowed).toBe(true)
    expect(memRateLimit('x', 0, lim, store).allowed).toBe(false)
  })
})

describe('judgeFinding', () => {
  it('returns a parsed verdict from a Gemini reply', async () => {
    const fetchImpl = mockFetch(200, geminiReply('{"certified":true,"feedback":"Clean.","notes":{"source":true,"specificity":true,"uncertainty":true}}'))
    const v = await judgeFinding(good, { apiKey: 'k', fetchImpl: fetchImpl as any })
    expect(v.certified).toBe(true)
    expect(fetchImpl.calls).toHaveLength(1)
  })
  it('requests JSON output and low temperature', async () => {
    const fetchImpl = mockFetch(200, geminiReply('{"certified":false,"feedback":"Name the entry.","notes":{"source":false,"specificity":true,"uncertainty":true}}'))
    await judgeFinding(good, { apiKey: 'k', fetchImpl: fetchImpl as any })
    const body = JSON.parse(fetchImpl.calls[0].init.body)
    expect(body.generationConfig.responseMimeType).toBe('application/json')
    expect(body.generationConfig.temperature).toBeLessThan(0.5)
  })
  it('throws not-configured without an api key', async () => {
    await expect(judgeFinding(good, { apiKey: '' })).rejects.toBeInstanceOf(CertifyError)
  })
  it('retries on a transient 503 then surfaces api-error', async () => {
    const fetchImpl = mockFetch(503, {})
    const sleeps: number[] = []
    await expect(
      judgeFinding(good, { apiKey: 'k', fetchImpl: fetchImpl as any, sleepImpl: async (ms) => { sleeps.push(ms) } }),
    ).rejects.toMatchObject({ code: 'api-error' })
    expect(fetchImpl.calls.length).toBeGreaterThan(1) // retried
  })
})
