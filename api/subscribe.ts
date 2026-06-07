// api/subscribe.ts — Vercel serverless function (Node runtime).
//
// Thin server-side proxy to the SHARED data-snack drop-notifier Cloud Function
// (double-opt-in, shared Resend pool, per-brand segments). datavism does NOT
// run its own email stack or hold a Resend key — it posts brand:'datavism' to
// the same endpoint, which tags confirmed contacts into the
// `underground-waitlist` segment. See data-snack functions/subscribe/.
//
// Why proxy server-side instead of the browser calling the Cloud Function
// directly: keeps the form same-origin (no CORS on the shared backend), and
// no secret ever lives here — the endpoint URL is the only config.
//
// Env (Vercel project settings):
//   SUBSCRIBE_ENDPOINT — required to go live; the deployed Cloud Function
//                        `subscribe` URL (e.g. https://subscribe-…-ey.a.run.app)
//                        Without it we answer 503 and the form says so.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }

  const { email, phone } = (req.body ?? {}) as { email?: string; phone?: string }

  // Honeypot filled → pretend success, forward nothing.
  if (phone) {
    res.status(200).json({ ok: true })
    return
  }

  const addr = String(email ?? '').trim().toLowerCase()
  if (!EMAIL_RE.test(addr) || addr.length > 254) {
    res.status(400).json({ error: 'invalid_email' })
    return
  }

  const endpoint = process.env.SUBSCRIBE_ENDPOINT
  if (!endpoint) {
    res.status(503).json({ error: 'not_wired' })
    return
  }

  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: addr,
        brand: 'datavism',
        source: 'datavism-waitlist',
      }),
    })
    // The Cloud Function returns 202 on "confirmation-sent" / "queued", 200 on
    // "already-confirmed". Anything 2xx means "we've got them" from the user's
    // point of view — the next step is the confirm email (double-opt-in).
    if (upstream.status >= 200 && upstream.status < 300) {
      res.status(200).json({ ok: true, pending: upstream.status === 202 })
    } else if (upstream.status === 400) {
      res.status(400).json({ error: 'invalid_email' })
    } else {
      res.status(502).json({ error: 'upstream' })
    }
  } catch {
    res.status(502).json({ error: 'upstream' })
  }
}
