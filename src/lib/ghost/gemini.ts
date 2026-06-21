// Server-side Gemini call for GHOST. fetch-injectable + pure (no Node-only deps)
// so it unit-tests without the network and bundles cleanly into the Vercel
// function. The API key is supplied by the caller (api/ghost.ts reads it from
// the server env) — never imported here, never shipped to the browser.
import { buildSystemPrompt } from './prompt'

export type GhostMessage = { role: 'user' | 'assistant'; content: string }
export type Fetch = typeof fetch

export class GhostError extends Error {
  constructor(public readonly code: string, message?: string) {
    super(message ?? code)
    this.name = 'GhostError'
  }
}

export const GHOST_LIMITS = { maxInputChars: 4000, maxTurns: 12, maxOutputTokens: 600 }

type AskOpts = {
  apiKey: string
  model?: string
  fetchImpl?: Fetch
  limits?: typeof GHOST_LIMITS
}

export async function askGhost(messages: GhostMessage[], opts: AskOpts): Promise<{ reply: string }> {
  const { apiKey, model = 'gemini-2.5-flash-lite', fetchImpl = fetch, limits = GHOST_LIMITS } = opts
  if (!apiKey) throw new GhostError('not-configured')

  const turns = messages.slice(-limits.maxTurns)
  if (!turns.length || turns[turns.length - 1].role !== 'user') throw new GhostError('bad-request')
  if (turns.reduce((n, m) => n + m.content.length, 0) > limits.maxInputChars) throw new GhostError('too-long')

  const body = {
    systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
    contents: turns.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
    generationConfig: { maxOutputTokens: limits.maxOutputTokens, temperature: 0.7 },
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`
  const res = await fetchImpl(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new GhostError('api-error', `gemini ${res.status}`)

  const data: any = await res.json()
  if (data?.promptFeedback?.blockReason) throw new GhostError('safety-blocked')
  const reply = (data?.candidates?.[0]?.content?.parts ?? [])
    .map((p: { text?: string }) => p.text ?? '')
    .join('')
    .trim()
  if (!reply) throw new GhostError('empty')
  return { reply }
}
