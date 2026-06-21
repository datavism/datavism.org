// src/lib/signal-cards/export.ts
// Render a Signal Card to shareable formats. Pure string builders are unit-
// tested; download/copy touch the DOM and are exercised in the UI walkthrough.
import type { SignalCard } from './types'
import { EVIDENCE_TYPES } from './types'
import { getLineById } from '../curriculum/lines'

export function stageLabel(c: { stage?: SignalCard['stage'] }): string {
  return c.stage === 'case-file' ? 'Case File #1' : 'Suspicion → Question'
}

function evidenceLabels(c: SignalCard): string[] {
  return c.evidenceNeeded.map((id) => EVIDENCE_TYPES.find((e) => e.id === id)?.label ?? id)
}

export function toMarkdown(c: SignalCard): string {
  const next = getLineById(c.nextLineChoice)
  const lines = [
    '# DATAVISM Signal Card',
    '',
    `**Stage:** ${stageLabel(c)}  `,
    '**Line:** GHOST / Foundation  ',
    '**Station:** G1 — THE FOLDER  ',
    '**Status:** Not evidence yet. Investigation opened.',
    '',
    '## Suspicion', '', c.suspicion, '',
    '## Question', '', c.question, '',
    '## Evidence Needed', '', ...evidenceLabels(c).map((l) => `- ${l}`),
    ...(c.customEvidenceNote ? ['', c.customEvidenceNote] : []), '',
    '## Uncertainty', '', c.uncertainty, '',
    '## Next Route', '', `${next.code} — ${next.name}`,
  ]
  if (c.stage === 'case-file') {
    lines.push('', '## Actor', '', c.actor ?? '', '', '## Source Lead', '', c.sourceLead ?? '', '', '## Public Relevance', '', c.publicRelevance ?? '')
  }
  lines.push('', '---', '', 'Created with DATAVISM — The Evidence Engine.')
  return lines.join('\n')
}

export function toJson(c: SignalCard): string {
  return JSON.stringify(c, null, 2)
}

export function downloadFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function copyText(text: string): Promise<boolean> {
  try { await navigator.clipboard.writeText(text); return true } catch { return false }
}
