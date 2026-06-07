// api/subscribe.ts — Vercel serverless function (Node runtime).
// Adds a contact to the Resend audience "underground-waitlist".
//
// Env (Vercel project settings):
//   RESEND_API_KEY      — required to go live; without it we answer 503
//   RESEND_AUDIENCE_ID  — optional; if unset we look up / create the
//                         audience by AUDIENCE_NAME below
//
// Decision basis: VISION.md §5 (one shared Resend audience model, tagged
// segments → Resend-native: one audience per segment). Honesty rule: this
// endpoint stores exactly one field (the email) at exactly one processor.

const AUDIENCE_NAME = 'underground-waitlist'
const RESEND_API = 'https://api.resend.com'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

async function resend(path: string, key: string, init?: RequestInit) {
  const res = await fetch(`${RESEND_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      'content-type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  const body = await res.json().catch(() => ({}))
  return { status: res.status, body: body as any }
}

async function resolveAudienceId(key: string): Promise<string | null> {
  const envId = process.env.RESEND_AUDIENCE_ID
  if (envId) return envId
  const list = await resend('/audiences', key)
  const found = list.body?.data?.find?.((a: any) => a.name === AUDIENCE_NAME)
  if (found?.id) return found.id
  const created = await resend('/audiences', key, {
    method: 'POST',
    body: JSON.stringify({ name: AUDIENCE_NAME }),
  })
  return created.body?.id ?? null
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }

  const { email, phone } = (req.body ?? {}) as { email?: string; phone?: string }

  // Honeypot filled → pretend success, store nothing.
  if (phone) {
    res.status(200).json({ ok: true })
    return
  }

  const addr = String(email ?? '').trim().toLowerCase()
  if (!EMAIL_RE.test(addr) || addr.length > 254) {
    res.status(400).json({ error: 'invalid_email' })
    return
  }

  const key = process.env.RESEND_API_KEY
  if (!key) {
    res.status(503).json({ error: 'not_wired' })
    return
  }

  try {
    const audienceId = await resolveAudienceId(key)
    if (!audienceId) {
      res.status(502).json({ error: 'upstream' })
      return
    }
    const add = await resend(`/audiences/${audienceId}/contacts`, key, {
      method: 'POST',
      body: JSON.stringify({ email: addr, unsubscribed: false }),
    })
    // 2xx = created; Resend answers 409/422 for existing contacts — both
    // mean "this address is on the list", which is success for the user.
    if (add.status < 300 || add.status === 409 || add.status === 422) {
      res.status(200).json({ ok: true })
    } else {
      res.status(502).json({ error: 'upstream' })
    }
  } catch {
    res.status(502).json({ error: 'upstream' })
  }
}
