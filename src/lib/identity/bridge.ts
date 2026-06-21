// Typed wrappers for the three live data-snack Cloud Functions
// (region europe-west3, project data-snack). API shapes are the final contract
// in docs/INTEGRATION-data-snack.md §"API contract". `fetch` is injectable so
// the request/response shaping is unit-testable without the network.
import type { DatavismProfile } from './profile'

const BASE = 'https://europe-west3-data-snack.cloudfunctions.net'

export type Fetch = typeof fetch
export type RequestMagicLinkResult = { ok: true; mail?: 'sent' | 'queued'; deduplicated?: boolean }
export type RedeemResult = { customToken: string; uid: string; email: string }

export class BridgeError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
  ) {
    super(`bridge ${status} ${code}`)
    this.name = 'BridgeError'
  }
}

async function postJson(
  path: string,
  body: unknown,
  fetchImpl: Fetch,
  extraHeaders: Record<string, string> = {},
): Promise<{ status: number; data: any }> {
  const res = await fetchImpl(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...extraHeaders },
    body: JSON.stringify(body),
  })
  let data: any = {}
  try {
    data = await res.json()
  } catch {}
  return { status: res.status, data }
}

export async function requestMagicLink(
  email: string,
  opts: { recoveryCode?: string; codename?: string } = {},
  fetchImpl: Fetch = fetch,
): Promise<RequestMagicLinkResult> {
  const { status, data } = await postJson('/requestMagicLink', { email, app: 'datavism', ...opts }, fetchImpl)
  if (status === 202 && data?.ok) return data
  throw new BridgeError(status, data?.error ?? 'request-failed')
}

export async function redeemMagicLink(token: string, fetchImpl: Fetch = fetch): Promise<RedeemResult> {
  const { status, data } = await postJson('/redeemMagicLink', { token }, fetchImpl)
  if (status === 200 && data?.customToken) return data
  throw new BridgeError(status, data?.error ?? 'redeem-failed')
}

export async function setDatavismProfile(
  idToken: string,
  profile: DatavismProfile,
  fetchImpl: Fetch = fetch,
): Promise<{ ok: true }> {
  const { status, data } = await postJson('/setDatavismProfile', profile, fetchImpl, {
    authorization: `Bearer ${idToken}`,
  })
  if (status === 200 && data?.ok) return data
  throw new BridgeError(status, data?.error ?? 'profile-failed')
}
