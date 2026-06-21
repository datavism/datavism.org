// Builds the `crew/{uid}.datavism` object from local DATAVISM progress.
// The bridge stores these verbatim and never interprets them (see
// docs/INTEGRATION-data-snack.md). The lowercase→UPPERCASE line casing
// boundary lives here and nowhere else.
import { STATIONS } from '../curriculum/lines'
import { loadCards } from '../signal-cards/storage'
import type { SignalCard, LineId } from '../signal-cards/types'

export type DatavismProfile = {
  line: string // affinity, UPPERCASE ('G'|'K'|'R'|'B'|'V')
  enrolledLines: string[] // UPPERCASE, canon order
  completedStations: string[] // our station ids, lowercase ('g1', 'k1', …)
  cohortIds: string[]
}

const LINE_ORDER: LineId[] = ['g', 'k', 'r', 'b', 'v']

export function toBridgeLine(id: string): string {
  return id.toUpperCase()
}

/** Pure: affinity = most recent route choice; enrolled = {G} ∪ choices, canon order. */
export function buildProfile(cards: SignalCard[], completedStations: string[]): DatavismProfile {
  const choices = cards.map((c) => c.nextLineChoice).filter(Boolean) as LineId[]
  const affinity = choices[0] ?? 'g' // storage is newest-first
  const enrolled = new Set<LineId>(['g', ...choices])
  return {
    line: toBridgeLine(affinity),
    enrolledLines: LINE_ORDER.filter((l) => enrolled.has(l)).map(toBridgeLine),
    completedStations,
    cohortIds: [],
  }
}

/** Pure (read-injectable): a saved Signal Card means G1 is done; other stations
 *  count when their SelfCheck is fully ticked. */
export function deriveCompletedStations(read: (key: string) => string | null): string[] {
  const done: string[] = []
  try {
    const env = JSON.parse(read('datavism:signal-cards') ?? 'null')
    if (Array.isArray(env?.cards) && env.cards.length > 0) done.push('g1')
  } catch {}
  for (const st of STATIONS) {
    if (st.id === 'g1') continue
    try {
      const arr = JSON.parse(read(`dv_${st.slug}_checks`) ?? 'null')
      if (Array.isArray(arr) && arr.length > 0 && arr.every(Boolean)) done.push(st.id)
    } catch {}
  }
  return [...new Set(done)]
}

/** Wires the pure builders to real localStorage. */
export function readLocalProfile(): DatavismProfile {
  const read = (k: string): string | null => {
    try {
      return globalThis.localStorage?.getItem(k) ?? null
    } catch {
      return null
    }
  }
  return buildProfile(loadCards(), deriveCompletedStations(read))
}
