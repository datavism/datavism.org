// Deterministic next-line suggestions for G1. Advisory only — the user always
// chooses. No AI. Keyword hits (most specific) rank above the base mapping.
import type { LineId, SystemSignal } from './types'

const SYSTEM_SIGNAL_TO_LINES: Record<SystemSignal, LineId[]> = {
  tracking: ['k', 'g'],
  money: ['r', 'g'],
  feed: ['b', 'g'],
  future: ['v', 'g'],
  unsure: ['g', 'k', 'r', 'b', 'v'],
}

const KEYWORDS: { pattern: RegExp; line: LineId }[] = [
  { pattern: /track|cookie|pixel|profil|broker|surveill|\bads?\b/i, line: 'k' },
  { pattern: /money|profit|company|benefit|funding|owner|contract|pric(e|ing)/i, line: 'r' },
  { pattern: /feed|scroll|recommend|algorithm|viral|engagement|rank/i, line: 'b' },
  { pattern: /climate|future|long.?term|archive|trend|over time|warming|emission/i, line: 'v' },
]

export function suggestLines(systemSignal: SystemSignal, questionText = ''): LineId[] {
  const base = SYSTEM_SIGNAL_TO_LINES[systemSignal] ?? ['g']
  const hits = KEYWORDS.filter((k) => k.pattern.test(questionText)).map((k) => k.line)
  const ordered: LineId[] = [...hits, ...base, 'g']
  return [...new Set(ordered)].slice(0, 4)
}
