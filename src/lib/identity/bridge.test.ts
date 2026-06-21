import { describe, it, expect } from 'vitest'
import { requestMagicLink, redeemMagicLink, setDatavismProfile, BridgeError } from './bridge'

function mockFetch(status: number, body: unknown) {
  const calls: { url: string; init: any }[] = []
  const fn = async (url: string, init: any) => {
    calls.push({ url, init })
    return { status, json: async () => body } as any
  }
  return Object.assign(fn, { calls })
}

describe('identity bridge', () => {
  it('requestMagicLink posts app:datavism and returns the 202 body', async () => {
    const f = mockFetch(202, { ok: true, mail: 'sent' })
    const r = await requestMagicLink('a@b.com', {}, f as any)
    expect(r).toEqual({ ok: true, mail: 'sent' })
    expect(f.calls[0].url).toContain('/requestMagicLink')
    expect(JSON.parse(f.calls[0].init.body)).toEqual({ email: 'a@b.com', app: 'datavism' })
  })

  it('requestMagicLink throws BridgeError(400, invalid-email)', async () => {
    const f = mockFetch(400, { error: 'invalid-email' })
    await expect(requestMagicLink('bad', {}, f as any)).rejects.toMatchObject({ status: 400, code: 'invalid-email' })
  })

  it('redeemMagicLink returns the custom token on 200', async () => {
    const f = mockFetch(200, { customToken: 'ct', uid: 'u1', email: 'a@b.com' })
    const r = await redeemMagicLink('tok', f as any)
    expect(r).toEqual({ customToken: 'ct', uid: 'u1', email: 'a@b.com' })
    expect(JSON.parse(f.calls[0].init.body)).toEqual({ token: 'tok' })
  })

  it('redeemMagicLink throws on 409 already-redeemed', async () => {
    const f = mockFetch(409, { error: 'already-redeemed' })
    await expect(redeemMagicLink('tok', f as any)).rejects.toBeInstanceOf(BridgeError)
  })

  it('setDatavismProfile sends Bearer auth + the full profile and returns ok', async () => {
    const f = mockFetch(200, { ok: true })
    const profile = { line: 'G', enrolledLines: ['G'], completedStations: ['g1'], cohortIds: [] }
    const r = await setDatavismProfile('idtok', profile, f as any)
    expect(r).toEqual({ ok: true })
    expect(f.calls[0].init.headers.authorization).toBe('Bearer idtok')
    expect(JSON.parse(f.calls[0].init.body)).toEqual(profile)
  })

  it('setDatavismProfile throws BridgeError(409, not-crew)', async () => {
    const f = mockFetch(409, { error: 'not-crew' })
    await expect(
      setDatavismProfile('idtok', { line: 'G', enrolledLines: ['G'], completedStations: [], cohortIds: [] }, f as any),
    ).rejects.toMatchObject({ status: 409, code: 'not-crew' })
  })
})
