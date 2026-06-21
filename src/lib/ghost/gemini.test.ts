import { describe, it, expect } from 'vitest'
import { askGhost, GhostError, GHOST_LIMITS } from './gemini'

function mockFetch(status: number, body: unknown) {
  const calls: { url: string; init: any }[] = []
  const fn = async (url: string, init: any) => {
    calls.push({ url, init })
    return { ok: status >= 200 && status < 300, status, json: async () => body } as any
  }
  return Object.assign(fn, { calls })
}

const user = (content: string) => ({ role: 'user' as const, content })

describe('askGhost', () => {
  const opts = (f: any) => ({ apiKey: 'k', model: 'gemini-2.5-flash-lite', fetchImpl: f })

  it('returns the reply text and sends a system instruction + user turn', async () => {
    const f = mockFetch(200, { candidates: [{ content: { parts: [{ text: 'Ask a sharper question.' }] } }] })
    const r = await askGhost([user('help')], opts(f))
    expect(r.reply).toBe('Ask a sharper question.')
    const sent = JSON.parse(f.calls[0].init.body)
    expect(sent.systemInstruction.parts[0].text).toMatch(/GHOST/)
    expect(sent.contents.at(-1)).toEqual({ role: 'user', parts: [{ text: 'help' }] })
    expect(f.calls[0].url).toContain('gemini-2.5-flash-lite')
    expect(f.calls[0].url).toContain('?key=') // key is the '?key=' query param (Gemini API contract), not an HTTP header
  })

  it('maps assistant turns to the model role', async () => {
    const f = mockFetch(200, { candidates: [{ content: { parts: [{ text: 'ok' }] } }] })
    await askGhost([user('a'), { role: 'assistant', content: 'b' }, user('c')], opts(f))
    expect(JSON.parse(f.calls[0].init.body).contents.map((c: any) => c.role)).toEqual(['user', 'model', 'user'])
  })

  it('throws not-configured without an api key', async () => {
    await expect(askGhost([user('hi')], { apiKey: '' } as any)).rejects.toMatchObject({ code: 'not-configured' })
  })

  it('throws too-long past the input cap', async () => {
    const big = user('x'.repeat(GHOST_LIMITS.maxInputChars + 1))
    await expect(askGhost([big], opts(mockFetch(200, {})))).rejects.toMatchObject({ code: 'too-long' })
  })

  it('throws bad-request when the last turn is not the user', async () => {
    await expect(
      askGhost([user('a'), { role: 'assistant', content: 'b' }], opts(mockFetch(200, {}))),
    ).rejects.toMatchObject({ code: 'bad-request' })
  })

  it('throws safety-blocked when Gemini blocks the prompt (input-side)', async () => {
    const f = mockFetch(200, { promptFeedback: { blockReason: 'SAFETY' } })
    await expect(askGhost([user('bad')], opts(f))).rejects.toMatchObject({ code: 'safety-blocked' })
  })

  it('throws safety-blocked when the candidate finishReason is SAFETY (output-side)', async () => {
    const f = mockFetch(200, { candidates: [{ finishReason: 'SAFETY', content: { parts: [] } }] })
    await expect(askGhost([user('bad')], opts(f))).rejects.toMatchObject({ code: 'safety-blocked' })
  })

  it('throws api-error on a non-2xx response', async () => {
    await expect(askGhost([user('hi')], opts(mockFetch(429, { error: 'rate' })))).rejects.toBeInstanceOf(GhostError)
  })

  it('throws empty when there is no candidate text', async () => {
    await expect(askGhost([user('hi')], opts(mockFetch(200, { candidates: [] })))).rejects.toMatchObject({ code: 'empty' })
  })
})
