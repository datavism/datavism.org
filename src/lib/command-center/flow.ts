// Pure state model for Command Center operations. No DOM, no AI. Accumulates a
// Partial<Finding> draft that the view persists and finalizes (history.ts).
import type { Finding } from './certify'

export type OperationStep = 'briefing' | 'source' | 'draft' | 'certifying' | 'closed'

export type OperationState = {
  step: OperationStep
  caseId: string
  finding: Partial<Finding>
}

const ORDER: OperationStep[] = ['briefing', 'source', 'draft', 'certifying', 'closed']

export function initialOp(caseId: string): OperationState {
  return { step: 'briefing', caseId, finding: {} }
}

export function toSource(s: OperationState): OperationState {
  return s.step === 'briefing' ? { ...s, step: 'source' } : s
}

export function toDraft(s: OperationState): OperationState {
  return s.step === 'source' ? { ...s, step: 'draft' } : s
}

export function setFinding(s: OperationState, f: Partial<Finding>): OperationState {
  return { ...s, finding: { ...s.finding, ...f } }
}

export function submit(s: OperationState): OperationState {
  return s.step === 'draft' ? { ...s, step: 'certifying' } : s
}

export function applyVerdict(s: OperationState, certified: boolean): OperationState {
  if (s.step !== 'certifying') return s
  return { ...s, step: certified ? 'closed' : 'draft' }
}

export function back(s: OperationState): OperationState {
  const i = ORDER.indexOf(s.step)
  return i > 0 ? { ...s, step: ORDER[i - 1] } : s
}
