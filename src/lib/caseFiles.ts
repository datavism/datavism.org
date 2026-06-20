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
  { id: 'CF-01', line: 'g', title: 'The First Folder', finding: '650,000 ways to label you — bought and sold.', status: 'published', severity: 4, slug: 'the-first-folder' },
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
  hookStat?: { value: string; label: string }
  subStats?: { n: string; label: string }[]
  question: string
  context: string
  sources: { n: string; t: string }[]
  method: string
  aiUse: string
  verify: { claim: string; src: string; status: string; color: string }[]
  findings?: { name: string; tag: string; tagColor: string; count: string; w: string }[]
  limits: string
  publicOutput: string[]
  next: string // "next questions" prose
  severity: number
  sourcesRead: string
  citation: string
  prev?: { id: string; title: string }
  nextFile: { id: string; title: string }
  // Exposé cases (e.g. CF-01) set these instead of hookStat / subStats / findings.
  scale?: {
    official: { n: string; label: string }
    actual: { n: string; label: string }
    frequency: { n: string; label: string }
  }
  segments?: { group: string; gdpr9?: boolean; items: { name: string; src: string }[] }[]
  suppliers?: { total: string; named: { name: string; note?: string }[] }
  legalNote?: string
  cta?: { label: string; href: string }
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
  'the-first-folder': {
    id: 'CF-01',
    slug: 'the-first-folder',
    line: 'g',
    artifact: 'GHOST File',
    published: '20 JUN 2026',
    titleLines: ['THE', 'FOLDER'],
    dek: "650,000 ways to label you — health, politics, addiction — bought and sold as categories. One leaked marketplace. The file isn't hypothetical. It's a product.",
    scale: {
      official: { n: '~1,500', label: 'IAB Audience Taxonomy — the official catalog' },
      actual: { n: '650,000', label: 'one leaked marketplace · Microsoft Xandr, 2023' },
      frequency: { n: '376×/day', label: 'your profile broadcast, per person · EU, ICCL 2022' },
    },
    question: 'How many ways can the ad-data market label a person — and is it even allowed to?',
    context: "Every person online is sorted into categories that are bought and sold on data marketplaces. The official industry catalog (IAB) lists about 1,500. When one real marketplace — Microsoft's Xandr — leaked in 2023, it held 650,000 — including health, political and addiction labels that are illegal to trade without consent. This file is the documented system: what the categories are, who supplies them, how often you're broadcast.",
    sources: [
      { n: '01', t: 'The Markup — "From Heavy Purchasers of Pregnancy Tests to the Depression-Prone: 650,000 ways advertisers label you" (2023)' },
      { n: '02', t: 'netzpolitik.org — Microsofts Datenmarktplatz Xandr: 650.000 Kategorien (2023)' },
      { n: '03', t: 'ICCL / Johnny Ryan — The scale of Real-Time Bidding data broadcasts (2022)' },
      { n: '04', t: 'IAB Tech Lab — Audience Taxonomy 1.1 (the official ~1,500-segment catalog)' },
      { n: '05', t: 'noyb — formal complaint against Xandr (2024)' },
    ],
    method: 'No fresh capture here — this is the documented system, read from primary sources: the leaked Xandr marketplace file (published 2023 by The Markup and netzpolitik), the ICCL real-time-bidding report, and the IAB taxonomy. Every number below is cross-checked against a primary source.',
    aiUse: 'AI clustered and de-duplicated the 650,000-row segment list and drafted supplier hypotheses. Every category name and number shown was re-checked by hand against the published source. AI was a co-pilot, never the witness.',
    verify: [
      { claim: '650,000 segments in one marketplace', src: 'Xandr leak', status: 'VERIFIED', color: '#39ff14' },
      { claim: 'Profile broadcast 376×/day per person (EU)', src: 'ICCL 2022', status: 'VERIFIED', color: '#39ff14' },
      { claim: 'Health & political segments traded as categories', src: 'The Markup · netzpolitik', status: 'VERIFIED', color: '#39ff14' },
      { claim: 'These are Art. 9 data — illegal to process without consent', src: 'GDPR · noyb 2024', status: 'VERIFIED', color: '#39ff14' },
      { claim: 'Any specific named person was bought or sold', src: '—', status: 'UNVERIFIED', color: '#6b7280' },
    ],
    segments: [
      { group: 'Health', gdpr9: true, items: [
        { name: 'Heavy Purchasers of Pregnancy Test Kits', src: 'The Markup' },
        { name: 'Depression Medications', src: 'The Markup' },
        { name: 'Propensity for Depression / Stroke', src: 'The Markup' },
        { name: 'Infertility / IVF', src: 'The Markup' },
        { name: 'HealthRankings › Diabetes Type II', src: 'netzpolitik' },
        { name: 'Opiate Addiction', src: 'netzpolitik' },
      ] },
      { group: 'Political stance', gdpr9: true, items: [
        { name: "'Hardcore' Republicans", src: 'netzpolitik' },
        { name: "'Persuadable' Democrats", src: 'netzpolitik' },
      ] },
      { group: 'Vulnerability / addiction', gdpr9: true, items: [
        { name: 'Gambling Addiction', src: 'netzpolitik' },
        { name: 'Fragile Seniors', src: 'netzpolitik' },
        { name: 'Easily Deflated', src: 'The Markup' },
      ] },
      { group: 'Ordinary (so you trust the rest)', items: [
        { name: 'Affluent Millennials', src: 'The Markup' },
        { name: "Dunkin' Donuts Visitors", src: 'The Markup' },
        { name: 'Past Purchases › Subaru', src: 'The Markup' },
        { name: 'Frequent Flyer', src: 'IAB' },
      ] },
    ],
    suppliers: {
      total: '93 data suppliers named in the file',
      named: [
        { name: 'Oracle', note: '> ⅓ of all segments' },
        { name: 'Acxiom' },
        { name: 'Foursquare' },
        { name: 'LiveRamp' },
        { name: 'Eyeota' },
        { name: 'Mastercard' },
      ],
    },
    legalNote: 'Many of these are "special category" data under GDPR Article 9 — processing forbidden without explicit consent. Traded anyway. noyb filed a formal complaint against Xandr in 2024.',
    limits: 'This proves the categories exist, are real, and are traded — not that any one named person was bought or sold. The market is documented; your specific file is not. That is exactly what LINE G teaches you to pull for yourself.',
    publicOutput: ['The Markup ↗', 'netzpolitik ↗', 'ICCL — RTB scale ↗', 'noyb — Xandr complaint ↗'],
    next: 'This is the file on everyone. The file on you only opens if you pull it yourself. That is LINE G — start with THE FOLDER.',
    cta: { label: 'Start LINE G → THE FOLDER', href: '/line-g/the-folder' },
    severity: 4,
    sourcesRead: '5 sources · ~5 min',
    citation: 'DATAVISM (2026). Case File CF-01 — The Folder. The Data Underground. datavism.org/underground/the-first-folder',
    nextFile: { id: 'CF-07', title: 'Border Signal Leak' },
  },
}

export function severityDots(n: number): { filled: number; empty: number } {
  return { filled: Math.max(0, Math.min(5, n)), empty: 5 - Math.max(0, Math.min(5, n)) }
}
