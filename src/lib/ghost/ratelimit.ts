// Rate limit for the public /api/ghost endpoint — protects the Gemini budget so
// nobody can use GHOST as a free, unlimited AI tool. Two fixed windows via Upstash
// Redis REST (no SDK dependency): a per-IP/minute burst guard, and a HARD global
// daily cap that bounds worst-case spend regardless of how many attackers show up.
// fetch-injectable so the logic is unit-tested without the network.
export type RlConfig = { url?: string; token?: string }
export type Fetch = typeof fetch

export const RL_LIMITS = { perIpPerMin: 12, globalPerDay: 500 }

export function rateLimitConfigured(cfg: RlConfig): boolean {
  return Boolean(cfg.url && cfg.token)
}

// INCR a counter, set its TTL only on first touch (EXPIRE … NX) → fixed window.
async function incr(cfg: RlConfig, key: string, ttl: number, fetchImpl: Fetch): Promise<number> {
  const res = await fetchImpl(`${cfg.url}/pipeline`, {
    method: 'POST',
    headers: { authorization: `Bearer ${cfg.token}`, 'content-type': 'application/json' },
    body: JSON.stringify([
      ['INCR', key],
      ['EXPIRE', key, ttl, 'NX'],
    ]),
  })
  if (!res.ok) throw new Error(`upstash ${res.status}`)
  const data: any = await res.json()
  return Number(data?.[0]?.result ?? 0)
}

export async function checkRateLimit(
  ip: string,
  cfg: RlConfig,
  opts: { fetchImpl?: Fetch; limits?: typeof RL_LIMITS } = {},
): Promise<{ allowed: boolean; reason?: 'ip' | 'global' }> {
  const fetchImpl = opts.fetchImpl ?? fetch
  const limits = opts.limits ?? RL_LIMITS

  const ipCount = await incr(cfg, `ghost:rl:ip:${ip}`, 60, fetchImpl)
  if (ipCount > limits.perIpPerMin) return { allowed: false, reason: 'ip' }

  const globalCount = await incr(cfg, 'ghost:rl:global', 86400, fetchImpl)
  if (globalCount > limits.globalPerDay) return { allowed: false, reason: 'global' }

  return { allowed: true }
}
