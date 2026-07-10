// The Atlas — committed snapshot of the lab's reference map of the data-art
// field: 214+ works by other artists/collectives, each verified against a real
// source, mapped to the seven FIELD.md clusters and the investigation↔spectacle
// axis. Curated at frankbueltge.de/atlas; refreshed via scripts/update-atlas.mjs.
// ADR 002 Zug 3: stations/lines reference atlas works whose decisive move
// embodies the skill being taught — learners meet the field's canon in passing.
import worksJson from '../data/atlas/werke.json'
import type { LineId } from './signal-cards/types'

export type AtlasWork = {
  title: string
  artist: string
  year: string
  venue_prize?: string
  clusters: number[]
  axis_pole: 'investigation' | 'spectacle' | 'mixed'
  form?: string
  medium_class?: string
  lab_renderable?: boolean
  decisive_move?: string
  source_url?: string
  verify_status: 'verified' | 'toVerify'
  curator_note?: string
}

export const ATLAS: AtlasWork[] = worksJson as AtlasWork[]

export const ATLAS_URL = 'https://frankbueltge.de/atlas'

// The seven live clusters of the field map (field-research/FIELD.md).
export const CLUSTER_LABELS: Record<number, string> = {
  1: 'Material / planetary AI cost',
  2: 'AI in war / algorithmic targeting',
  3: 'Counter-forensics / OSINT',
  4: 'Provenance & authenticity',
  5: 'Decolonial / more-than-human',
  6: 'Data justice / missing data',
  7: 'AI self-consumption / reflexive instruments',
}

// Curatorial mapping line → clusters (v1, ADR 002 §Zug 3). Only G and K have
// built pages today; r/b/v are provisional until their lines open. Cluster 4
// sits with G until the proposed Line P exists ("what is real" is a method
// question before it is a line).
export const LINE_CLUSTERS: Record<LineId, number[]> = {
  g: [7, 4],
  k: [3, 2],
  r: [1, 6],
  b: [6, 7],
  v: [1, 5],
}

// Deterministic pick: verified works whose decisive move is documented, from the
// line's clusters, investigation pole first, newest first. No randomness — same
// build, same references (reproducible builds; the lab's register ethic).
export function fieldRefsForLine(line: LineId, n = 3): AtlasWork[] {
  const clusters = LINE_CLUSTERS[line] ?? []
  const poleRank = { investigation: 0, mixed: 1, spectacle: 2 } as const
  return ATLAS.filter(
    (w) =>
      w.verify_status === 'verified' &&
      !!w.decisive_move &&
      w.clusters.some((c) => clusters.includes(c)),
  )
    .sort(
      (a, b) =>
        poleRank[a.axis_pole] - poleRank[b.axis_pole] ||
        b.year.localeCompare(a.year) ||
        a.title.localeCompare(b.title),
    )
    .slice(0, n)
}
