// The cheap, deterministic half of the method-bar. The AI (api/certify.ts) judges
// "does the claim follow from that kind of source"; this catches structural gaps
// without an AI call. Method, never truth.
export type Finding = { question: string; sourceUrl: string; evidence: string; uncertainty: string }

export function preCheck(f: Finding): { ok: boolean; missing: string[] } {
  const missing: string[] = []
  if (!/^https?:\/\//.test(f.sourceUrl.trim())) missing.push('source')
  if (f.uncertainty.trim().length < 8) missing.push('uncertainty')
  if (f.evidence.trim().length < 24) missing.push('specificity')
  if (f.question.trim().length < 12) missing.push('question')
  return { ok: missing.length === 0, missing }
}
