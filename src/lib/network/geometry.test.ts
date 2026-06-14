import { describe, it, expect } from 'vitest'
import { readdirSync } from 'node:fs'
import { LINES, NODES, LANDMARKS, VIEW, lineIds } from './geometry'

// Station ids = the markdown filenames (no Astro runtime needed in Vitest).
const stationIds = new Set(
  readdirSync('src/content/stations')
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, '')),
)

describe('network geometry', () => {
  it('defines the five patron lines g/k/r/b/v', () => {
    expect(lineIds()).toEqual(['g', 'k', 'r', 'b', 'v'])
    for (const l of LINES) expect(l.path.length).toBeGreaterThanOrEqual(2)
  })

  it('keeps every point inside the coordinate space', () => {
    const pts = [
      ...LINES.flatMap((l) => l.path),
      ...NODES.map((n) => n.at),
      ...LANDMARKS.map((m) => m.at),
    ]
    for (const p of pts) {
      expect(p.x).toBeGreaterThanOrEqual(0); expect(p.x).toBeLessThanOrEqual(VIEW.w)
      expect(p.y).toBeGreaterThanOrEqual(0); expect(p.y).toBeLessThanOrEqual(VIEW.h)
    }
  })

  it('every node references a real station id', () => {
    for (const n of NODES) expect(stationIds.has(n.stationId), `node ${n.stationId}`).toBe(true)
  })

  it('every node sits on a defined line', () => {
    const ls = new Set(lineIds())
    for (const n of NODES) expect(ls.has(n.line)).toBe(true)
  })

  it('the trunk has all five G stations', () => {
    expect(NODES.filter((n) => n.line === 'g').length).toBe(5)
  })
})
