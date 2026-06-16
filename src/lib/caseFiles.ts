// Case File data (illustrative example content, per the handoff). The index
// lists 10 example files across the five lines; only CF-07 ("Border Signal
// Leak") is published with a full detail page. Line colour + curator name are
// resolved from the curriculum (lines.ts), so the palette stays canonical.
import type { LineId } from './curriculum/lines'

export type CaseStatus = 'published' | 'progress' | 'locked'

export type CaseCard = {
  id: string
  line: LineId
  title: string
  finding: string
  status: CaseStatus
  severity: number // 0–5 dots
  slug?: string // present only when a detail page exists
}

export const CASE_STATUS: Record<CaseStatus, { label: string; color: string }> = {
  published: { label: 'PUBLISHED', color: '#39ff14' },
  progress: { label: 'IN PROGRESS', color: '#f5b700' },
  locked: { label: 'LOCKED', color: '#6b7280' },
}

// Index order mirrors the handoff (The Underground - Case Files.dc.html).
export const CASE_INDEX: CaseCard[] = [
  { id: 'CF-07', line: 'k', title: 'Border Signal Leak', finding: '42 trackers fire before you tap accept.', status: 'published', severity: 4, slug: 'border-signal-leak' },
  { id: 'CF-06', line: 'r', title: 'Shell Network Map', finding: 'One owner hiding behind nine shells.', status: 'published', severity: 3 },
  { id: 'CF-02', line: 'k', title: 'Consent Theater', finding: "You didn't agree. You just kept clicking.", status: 'published', severity: 3 },
  { id: 'CF-01', line: 'g', title: 'The First Folder', finding: 'How a 2am suspicion became evidence.', status: 'published', severity: 2 },
  { id: 'CF-10', line: 'r', title: 'Subsidy Trail', finding: 'Public money, private moat.', status: 'published', severity: 3 },
  { id: 'CF-05', line: 'r', title: 'Influence Pipeline', finding: 'Ad spend to policy, step by step.', status: 'progress', severity: 4 },
  { id: 'CF-08', line: 'b', title: 'Retention Loop', finding: 'Why 2am keeps scrolling.', status: 'progress', severity: 3 },
  { id: 'CF-04', line: 'b', title: 'Ad-Tech Autopsy', finding: 'The feed that never lets go.', status: 'locked', severity: 0 },
  { id: 'CF-03', line: 'v', title: 'Data Pollution Trail', finding: 'A decade of quiet drift.', status: 'locked', severity: 0 },
  { id: 'CF-09', line: 'v', title: 'Cumulus Watch', finding: 'The slow system nobody is timing.', status: 'locked', severity: 0 },
]

export type CaseDetail = {
  id: string
  slug: string
  line: LineId
  artifact: string
  published: string
  titleLines: string[]
  dek: string
  hookStat: { value: string; label: string }
  subStats: { n: string; label: string }[]
  question: string
  context: string
  sources: { n: string; t: string }[]
  method: string
  aiUse: string
  verify: { claim: string; src: string; status: string; color: string }[]
  findings: { name: string; tag: string; tagColor: string; count: string; w: string }[]
  limits: string
  publicOutput: string[]
  next: string // "next questions" prose
  severity: number
  sourcesRead: string
  citation: string
  prev: { id: string; title: string }
  nextFile: { id: string; title: string }
}

export const CASE_DETAIL: Record<string, CaseDetail> = {
  'border-signal-leak': {
    id: 'CF-07',
    slug: 'border-signal-leak',
    line: 'k',
    artifact: 'Panopticon Case File',
    published: '17 JUN 2026',
    titleLines: ['BORDER', 'SIGNAL LEAK'],
    dek: 'A travel-checkpoint app fires dozens of third-party trackers — and leaks location — before anyone taps "Accept".',
    hookStat: { value: '42', label: 'third parties pinged before consent' },
    subStats: [
      { n: '7', label: 'REQUESTS WITH LOCATION' },
      { n: '0', label: 'CONSENT GIVEN YET' },
      { n: '11', label: 'SOURCES ON RECORD' },
    ],
    question: 'Does the app transmit location and device identifiers to third parties before the user agrees to anything?',
    context: 'Travel and border apps sit at a uniquely sensitive checkpoint: identity, location, and movement, all at once. Consent banners promise control. This file tests whether the control is real — or theater that fires after the data has already left.',
    sources: [
      { n: '01', t: 'Network capture (HAR) — clean device, app v8.2, pre-consent session' },
      { n: '02', t: 'App store privacy manifest & declared SDKs' },
      { n: '03', t: 'Company & ownership registries (owner resolution)' },
      { n: '04', t: 'DSA transparency database — declared ad partners' },
    ],
    method: "Captured the app's network traffic on a clean device, decoded every outbound request before any tap on the consent banner, and resolved each destination to an owner using public registries and SDK fingerprints.",
    aiUse: 'AI clustered 1,200+ raw requests by destination, cleaned the host list, and drafted owner hypotheses. Every claim below was re-checked by hand against a primary source. AI was a co-pilot, never the witness.',
    verify: [
      { claim: '42 distinct third parties contacted before consent', src: 'HAR capture', status: 'VERIFIED', color: '#39ff14' },
      { claim: 'Coarse location present in 7 pre-consent payloads', src: 'decoded requests', status: 'VERIFIED', color: '#39ff14' },
      { claim: 'Top destination owned by a major ad network', src: 'registry', status: 'PARTIAL', color: '#f5b700' },
      { claim: 'Data resold to downstream brokers', src: '—', status: 'UNVERIFIED', color: '#6b7280' },
    ],
    findings: [
      { name: 'adnet-edge.io', tag: '· location', tagColor: '#ff4d4d', count: '14 req', w: '100%' },
      { name: 'trackr-sdk.net', tag: '· location', tagColor: '#ff4d4d', count: '11 req', w: '78%' },
      { name: 'geo-ping.co', tag: '· location', tagColor: '#ff4d4d', count: '9 req', w: '64%' },
      { name: 'metrics-hub.com', tag: '', tagColor: '#6b7280', count: '8 req', w: '57%' },
    ],
    limits: 'One device, one session, one app version. This proves the requests happened — not that anyone intended harm, nor that the data was later sold. The leak is reproducible; the motive is not in scope.',
    publicOutput: ['Dataset (HAR) ↓', 'Poster ↓', 'Method notes ↓'],
    next: 'Where does the signal go after it leaves? ROOK follows the money to the broker. VESPER asks what a year of these leaks builds. Every answer is another file.',
    severity: 4,
    sourcesRead: '11 sources · 6 min',
    citation: 'DATAVISM (2026). Case File CF-07 — Border Signal Leak. The Data Underground. datavism.org/underground/border-signal-leak',
    prev: { id: 'CF-06', title: 'Shell Network Map' },
    nextFile: { id: 'CF-04', title: 'Ad-Tech Autopsy' },
  },
}

export function severityDots(n: number): { filled: number; empty: number } {
  return { filled: Math.max(0, Math.min(5, n)), empty: 5 - Math.max(0, Math.min(5, n)) }
}
