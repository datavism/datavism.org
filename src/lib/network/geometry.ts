// Authored network layout. Pure data — no rendering. Coordinates form the
// DATAVISM wordmark; Line G is the horizontal trunk (baseline), K/R/B/V are
// letter strokes. Exact coords are tuned visually (see plan Task 2); the shape
// invariants are tested. Nodes reference stations-collection ids (filenames).
export type LineId = 'g' | 'k' | 'r' | 'b' | 'v'
export interface Pt { x: number; y: number }
export interface NetLine { id: LineId; colorVar: string; patron: string; terminus?: string; path: Pt[] }
export interface NetNode { stationId: string; line: LineId; at: Pt }
export interface NetLandmark { key: 'entrance' | 'maschinenraum' | 'vault'; label: string; at: Pt }

export const VIEW = { w: 1600, h: 600 } as const
export const lineIds = (): LineId[] => LINES.map((l) => l.id)

// Line G trunk: left→right baseline through the word. K/R/B/V branch off it.
// (Seed geometry — tuned to read "DATAVISM" in plan Task 2.)
export const LINES: NetLine[] = [
  { id: 'g', colorVar: 'var(--color-signal)', patron: 'GHOST', path: [
    { x: 120, y: 300 }, { x: 1480, y: 300 },
  ] },
  { id: 'k', colorVar: 'var(--color-line-k)', patron: 'Key',    terminus: 'PANOPTICON',  path: [ { x: 300, y: 300 }, { x: 300, y: 140 } ] },
  { id: 'r', colorVar: 'var(--color-line-r)', patron: 'Rook',   terminus: 'MAMMON',      path: [ { x: 620, y: 300 }, { x: 620, y: 460 } ] },
  { id: 'b', colorVar: 'var(--color-line-b)', patron: 'Bite',   terminus: 'THE FEED',    path: [ { x: 940, y: 300 }, { x: 940, y: 140 } ] },
  { id: 'v', colorVar: 'var(--color-line-v)', patron: 'Vesper', terminus: 'CUMULUS REX', path: [ { x: 1260, y: 300 }, { x: 1260, y: 460 } ] },
]

// G1..G5 nodes along the trunk (ids must match src/content/stations/*.md).
export const NODES: NetNode[] = [
  { stationId: 'the-folder',        line: 'g', at: { x: 300,  y: 300 } },
  { stationId: 'command',           line: 'g', at: { x: 540,  y: 300 } },
  { stationId: 'intake',            line: 'g', at: { x: 780,  y: 300 } },
  { stationId: 'the-confident-lie', line: 'g', at: { x: 1020, y: 300 } },
  { stationId: 'maschinenraum',     line: 'g', at: { x: 1260, y: 300 } },
]

export const LANDMARKS: NetLandmark[] = [
  { key: 'entrance',      label: '↓ from data-snack', at: { x: 120,  y: 300 } },
  { key: 'maschinenraum', label: 'MASCHINENRAUM',     at: { x: 1260, y: 300 } },
  { key: 'vault',         label: 'THE VAULT',         at: { x: 1480, y: 300 } },
]
