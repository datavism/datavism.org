import { describe, it, expect } from 'vitest'
import { initialState, choosePath, pickLaunchpad, setSuspicion, setQuestion, isSeam } from './flow'

describe('Descent flow', () => {
  it('starts in descent and opens to the prompt', () => {
    const s = initialState()
    expect(s.step).toBe('descent')
    expect(choosePath(s, 'own').step).toBe('suspicion')
  })
  it('own path: suspicion → sharpen → the seam opens the file on a concrete question', () => {
    let s = choosePath(initialState(), 'own')
    s = setSuspicion(s, 'A site knew my search before I logged in.')
    expect(s.step).toBe('sharpen')
    expect(isSeam(s)).toBe(false)
    s = setQuestion(s, 'What evidence shows cross-site tracking before consent?')
    expect(s.step).toBe('open-file')
    expect(isSeam(s)).toBe(true) // the seamless gear-shift
    expect(s.draft.question).toContain('cross-site tracking')
  })
  it('launchpad path seeds the draft from a vetted case', () => {
    let s = choosePath(initialState(), 'launchpad')
    expect(s.step).toBe('launchpad')
    s = pickLaunchpad(s, 'lobby-register-de') // a real id from LAUNCHPAD_CASES
    expect(s.step).toBe('suspicion')
    expect(s.launchpadId).toBe('lobby-register-de')
    expect(s.draft.systemSignal).toBeDefined()
  })
  it('rejects an unknown launchpad id without advancing', () => {
    const s = choosePath(initialState(), 'launchpad')
    expect(pickLaunchpad(s, 'nope').step).toBe('launchpad')
  })
})
