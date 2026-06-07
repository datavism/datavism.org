// src/lib/signals.ts
// Pure counting logic for the honest signal counter (no listeners here —
// the Svelte island wires real DOM events). Concept salvaged from the old
// site's live counter; honesty rule: we COUNT what could be tracked,
// we COLLECT nothing (docs/STORY.md §8).

export type SignalType = 'move' | 'click' | 'scroll' | 'key' | 'tick'

export class SignalCounter {
  total = 0
  byType: Partial<Record<SignalType, number>> = {}
  #lastAt: Partial<Record<SignalType, number>> = {}

  record(type: SignalType): void {
    this.total += 1
    this.byType[type] = (this.byType[type] ?? 0) + 1
  }

  /** Counts at most one signal of `type` per `windowMs`. Returns true if counted. */
  recordThrottled(type: SignalType, windowMs: number, now: number): boolean {
    const last = this.#lastAt[type]
    if (last !== undefined && now - last < windowMs) return false
    this.#lastAt[type] = now
    this.record(type)
    return true
  }
}
