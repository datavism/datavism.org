// Signal Card data model for G1 — THE FOLDER. A Signal Card is a Stage-2
// (Suspicion → Question) artifact; filling the three deeper fields upgrades it
// to a full Case File #1 (Stage 5 lives in /underground). No PII, no backend.

export type LineId = 'g' | 'k' | 'r' | 'b' | 'v'
export type SystemSignal = 'tracking' | 'money' | 'feed' | 'future' | 'unsure'
export type EvidenceType =
  | 'technical-signal' | 'public-record' | 'platform-output'
  | 'dataset' | 'document' | 'observation' | 'unknown'
export type SignalStage = 'question' | 'case-file'

export type SignalCard = {
  id: string
  version: 1
  createdAt: string
  updatedAt?: string
  line: 'g'
  station: 'g1-the-folder'
  stage: SignalStage
  // Signal Card (Stage-2) fields
  systemSignal: SystemSignal
  suspicion: string
  question: string
  evidenceNeeded: EvidenceType[]
  customEvidenceNote?: string
  uncertainty: string
  // routing
  suggestedLines: LineId[]
  nextLineChoice: LineId
  // Case File extension (optional → upgrades stage to 'case-file')
  actor?: string
  sourceLead?: string
  publicRelevance?: string
  // meta
  tags: string[]
  visibility: 'private' | 'public-anonymous' | 'exported'
  disclaimer: string
}

export const SIGNAL_CARD_DISCLAIMER =
  'This is not evidence yet. This is an investigation question created in DATAVISM G1 — THE FOLDER.'

export const SYSTEM_SIGNALS: { id: SystemSignal; label: string; line: LineId }[] = [
  { id: 'tracking', label: 'I feel watched or profiled.', line: 'k' },
  { id: 'money', label: 'I want to know who benefits.', line: 'r' },
  { id: 'feed', label: 'I keep seeing patterns in feeds or recommendations.', line: 'b' },
  { id: 'future', label: 'I notice a slow change that people ignore.', line: 'v' },
  { id: 'unsure', label: 'I only have a vague feeling.', line: 'g' },
]

export const EVIDENCE_TYPES: { id: EvidenceType; label: string; hint: string }[] = [
  { id: 'technical-signal', label: 'Technical signal', hint: 'request, cookie, pixel, SDK, tag, metadata' },
  { id: 'public-record', label: 'Public record', hint: 'register, policy, procurement, filing, transparency database' },
  { id: 'platform-output', label: 'Platform output', hint: 'feed result, recommendation, category, ranking, ad' },
  { id: 'dataset', label: 'Dataset', hint: 'CSV, API, archive, official data' },
  { id: 'document', label: 'Document', hint: 'PDF, report, article, policy, leaked taxonomy' },
  { id: 'observation', label: 'Observation', hint: 'screenshot, diary, repeated pattern, manual sample' },
  { id: 'unknown', label: 'I do not know yet', hint: '' },
]

export const STAGE_LEGEND: { id: string; label: string }[] = [
  { id: 'suspicion', label: 'Suspicion' },
  { id: 'question', label: 'Question' },
  { id: 'signal', label: 'Signal' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'case-file', label: 'Case File' },
]

const filled = (s?: string) => !!s && s.trim().length > 0

export function deriveStage(c: { actor?: string; sourceLead?: string; publicRelevance?: string }): SignalStage {
  return filled(c.actor) && filled(c.sourceLead) && filled(c.publicRelevance) ? 'case-file' : 'question'
}
