// Authored network layout. Pure data — no rendering. The union of all lines'
// strokes forms the DATAVISM wordmark; Line G is the horizontal trunk (baseline,
// "feeds all lines"), K/R/B/V each draw a pair of letters in octolinear transit
// strokes. Nodes reference stations-collection ids (filenames). Shape invariants
// are tested; exact look is screenshot-iterated.
export type LineId = 'g' | 'k' | 'r' | 'b' | 'v'
export interface Pt { x: number; y: number }
export interface NetLine { id: LineId; colorVar: string; patron: string; terminus?: string; strokes: Pt[][] }
export interface NetNode { stationId: string; line: LineId; at: Pt }
export interface NetLandmark { key: 'entrance' | 'maschinenraum' | 'vault'; label: string; at: Pt }

export const VIEW = { w: 1600, h: 600 } as const
export const lineIds = (): LineId[] => LINES.map((l) => l.id)

// ── Octolinear stroke-font (normalised x:0..1 left→right, y:0..1 top→bottom) ──
type NStroke = [number, number][]
const FONT: Record<string, NStroke[]> = {
  D: [[[0, 0], [0, 1]], [[0, 0], [0.62, 0], [1, 0.35], [1, 0.65], [0.62, 1], [0, 1]]],
  A: [[[0, 1], [0.5, 0], [1, 1]], [[0.22, 0.56], [0.78, 0.56]]],
  T: [[[0, 0], [1, 0]], [[0.5, 0], [0.5, 1]]],
  V: [[[0, 0], [0.5, 1], [1, 0]]],
  I: [[[0.5, 0], [0.5, 1]], [[0.2, 0], [0.8, 0]], [[0.2, 1], [0.8, 1]]],
  S: [[[1, 0.12], [0, 0.12], [0, 0.5], [1, 0.5], [1, 0.9], [0, 0.9]]],
  M: [[[0, 1], [0, 0], [0.5, 0.55], [1, 0], [1, 1]]],
}
const WORD = ['D', 'A', 'T', 'A', 'V', 'I', 'S', 'M'] as const
const OWNER: LineId[] = ['k', 'k', 'r', 'r', 'v', 'b', 'b', 'v'] // which line draws each letter

// ── Layout ───────────────────────────────────────────────────────────────────
const Lw = 130, Gp = 55, x0 = 70, yTop = 130, H = 300
const trunkY = 470
const gX0 = x0
const gX1 = x0 + 7 * (Lw + Gp) + Lw

function placeLetter(i: number, ch: string): Pt[][] {
  return FONT[ch].map((stroke) =>
    stroke.map(([nx, ny]) => ({ x: x0 + i * (Lw + Gp) + nx * Lw, y: yTop + ny * H })),
  )
}

const byLine: Record<LineId, Pt[][]> = { g: [], k: [], r: [], b: [], v: [] }
WORD.forEach((ch, i) => { byLine[OWNER[i]].push(...placeLetter(i, ch)) })
byLine.g = [[{ x: gX0, y: trunkY }, { x: gX1, y: trunkY }]] // G = the trunk baseline

export const LINES: NetLine[] = [
  { id: 'g', colorVar: 'var(--color-signal)', patron: 'GHOST', strokes: byLine.g },
  { id: 'k', colorVar: 'var(--color-line-k)', patron: 'Key', terminus: 'PANOPTICON', strokes: byLine.k },
  { id: 'r', colorVar: 'var(--color-line-r)', patron: 'Rook', terminus: 'MAMMON', strokes: byLine.r },
  { id: 'b', colorVar: 'var(--color-line-b)', patron: 'Bite', terminus: 'THE FEED', strokes: byLine.b },
  { id: 'v', colorVar: 'var(--color-line-v)', patron: 'Vesper', terminus: 'CUMULUS REX', strokes: byLine.v },
]

// G1..G5 nodes along the trunk (ids must match src/content/stations/*.md).
const stationX = (k: number) => gX0 + 60 + k * ((gX1 - gX0 - 120) / 4)
export const NODES: NetNode[] = [
  { stationId: 'the-folder', line: 'g', at: { x: stationX(0), y: trunkY } },
  { stationId: 'command', line: 'g', at: { x: stationX(1), y: trunkY } },
  { stationId: 'intake', line: 'g', at: { x: stationX(2), y: trunkY } },
  { stationId: 'the-confident-lie', line: 'g', at: { x: stationX(3), y: trunkY } },
  { stationId: 'maschinenraum', line: 'g', at: { x: stationX(4), y: trunkY } },
]

export const LANDMARKS: NetLandmark[] = [
  { key: 'entrance', label: '↓ from data-snack', at: { x: gX0, y: trunkY } },
  { key: 'maschinenraum', label: 'MASCHINENRAUM', at: { x: stationX(4), y: trunkY } },
  { key: 'vault', label: 'THE VAULT', at: { x: gX1, y: trunkY } },
]
