import { describe, it, expect } from 'vitest'
import {
  buildOrientPrompt,
  buildCoachPrompt,
  parseOrient,
  orient,
  coach,
  GuideError,
} from '../api/guide'

function mockFetch(status: number, body: unknown) {
  const calls: { url: string; init: any }[] = []
  const fn = async (url: string, init: any) => {
    calls.push({ url, init })
    return { ok: status >= 200 && status < 300, status, json: async () => body } as any
  }
  return Object.assign(fn, { calls })
}
const reply = (text: string) => ({ candidates: [{ content: { parts: [{ text }] } }, ] })

describe('orient prompt', () => {
  const p = buildOrientPrompt()
  it('binds the orient-not-investigate honesty line', () => {
    expect(p).toMatch(/orient/i)
    expect(p).toMatch(/never/i)
    // must forbid naming a specific entity/figure as THE answer
    expect(p).toMatch(/specific|named|figure|answer/i)
  })
  it('demands the three labelled lines', () => {
    expect(p).toMatch(/DOES/)
    expect(p).toMatch(/SHOWS/)
    expect(p).toMatch(/ANGLES/)
  })
})

describe('coach prompt', () => {
  const p = buildCoachPrompt()
  it('names the gap without supplying the finding', () => {
    expect(p).toMatch(/gap|missing/i)
    expect(p).toMatch(/never|not/i)
    expect(p).toMatch(/finding/i)
  })
})

describe('parseOrient', () => {
  it('parses the three labelled lines', () => {
    const v = parseOrient('DOES: search and sort entries.\nSHOWS: name, spend band, topic.\nANGLES: which sector spends most? how does spend map to laws?')
    expect(v.does).toMatch(/search and sort/)
    expect(v.shows).toMatch(/spend band/)
    expect(v.angles).toMatch(/which sector/)
  })
  it('is case-insensitive and tolerant of bullets/space', () => {
    const v = parseOrient('  does :  a thing\n shows: x, y\nAngles: q1? q2?')
    expect(v.does).toBe('a thing')
    expect(v.shows).toBe('x, y')
    expect(v.angles).toBe('q1? q2?')
  })
  it('returns empties when the structure is absent (caller falls back to curated)', () => {
    expect(parseOrient('the model rambled')).toEqual({ does: '', shows: '', angles: '' })
  })
})

describe('orient()', () => {
  it('returns parsed orientation from a grounded reply', async () => {
    const f = mockFetch(200, reply('DOES: x.\nSHOWS: a, b.\nANGLES: q1? q2?'))
    const v = await orient({ source: { title: 'Reg', url: 'https://r.de' }, question: 'who spent most?' }, { apiKey: 'k', fetchImpl: f as any })
    expect(v.does).toBe('x.')
    expect(v.shows).toBe('a, b.')
  })
  it('uses flash with the search tool and thinking disabled', async () => {
    const f = mockFetch(200, reply('DOES: x\nSHOWS: y\nANGLES: z'))
    await orient({ source: { title: 'Reg', url: 'https://r.de' }, question: 'q' }, { apiKey: 'k', fetchImpl: f as any })
    expect(f.calls[0].url).toMatch(/gemini-2\.5-flash:/)               // flash, not flash-lite
    const body = JSON.parse(f.calls[0].init.body)
    expect(body.tools).toEqual([{ google_search: {} }])
    expect(body.generationConfig.thinkingConfig.thinkingBudget).toBe(0)
  })
  it('throws not-configured without a key', async () => {
    await expect(orient({ source: { title: 't', url: 'u' }, question: 'q' }, { apiKey: '' })).rejects.toBeInstanceOf(GuideError)
  })
})

describe('coach()', () => {
  it('returns a nudge string', async () => {
    const f = mockFetch(200, reply('Your finding names no specific organisation yet — pick one entry.'))
    const v = await coach({ draft: { question: 'q', evidence: 'they spend a lot', sourceUrl: 'https://r.de', uncertainty: '' }, question: 'q' }, { apiKey: 'k', fetchImpl: f as any })
    expect(v.nudge).toMatch(/specific organisation/)
  })
  it('uses flash-lite without the search tool', async () => {
    const f = mockFetch(200, reply('nudge'))
    await coach({ draft: { question: 'q', evidence: 'e', sourceUrl: 'u', uncertainty: 'x' }, question: 'q' }, { apiKey: 'k', fetchImpl: f as any })
    expect(f.calls[0].url).toMatch(/gemini-2\.5-flash-lite:/)
    const body = JSON.parse(f.calls[0].init.body)
    expect(body.tools).toBeUndefined()
  })
})
