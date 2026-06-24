// Pure state model for "The Descent". No DOM, no AI. Accumulates a Partial<SignalCard>
// draft that the view persists (storage.ts) and finalizes (SignalCard).
import type { SignalCard, SystemSignal } from '../signal-cards/types'
import { getCase } from './cases'

export type OpeningStep = 'descent' | 'prompt' | 'launchpad' | 'suspicion' | 'sharpen' | 'open-file' | 'first-move' | 'card'
export type Path = 'launchpad' | 'own' | null

export type OpeningState = {
  step: OpeningStep
  path: Path
  launchpadId: string | null
  draft: Partial<SignalCard>
}

export function initialState(): OpeningState {
  return { step: 'descent', path: null, launchpadId: null, draft: { line: 'g', station: 'g1-the-folder', stage: 'question' } }
}

export function choosePath(s: OpeningState, path: Exclude<Path, null>): OpeningState {
  return { ...s, path, step: path === 'own' ? 'suspicion' : 'launchpad' }
}

export function pickLaunchpad(s: OpeningState, id: string): OpeningState {
  const c = getCase(id)
  if (!c) return s // unknown id: do not advance
  return {
    ...s,
    launchpadId: id,
    step: 'suspicion',
    draft: { ...s.draft, systemSignal: c.systemSignal as SystemSignal, suspicion: c.hook, question: c.starterQuestion },
  }
}

export function setSuspicion(s: OpeningState, suspicion: string): OpeningState {
  return { ...s, step: 'sharpen', draft: { ...s.draft, suspicion } }
}

// The seam: a concrete question opens the file. No screen-break in the view — this
// is the gear-shift the whole experience hinges on.
export function setQuestion(s: OpeningState, question: string): OpeningState {
  return { ...s, step: 'open-file', draft: { ...s.draft, question } }
}

export function isSeam(s: OpeningState): boolean {
  return s.step === 'open-file'
}

export function back(s: OpeningState): OpeningState {
  const order: OpeningStep[] = ['descent', 'prompt', 'launchpad', 'suspicion', 'sharpen', 'open-file', 'first-move', 'card']
  const i = order.indexOf(s.step)
  return i > 0 ? { ...s, step: order[i - 1] } : s
}
