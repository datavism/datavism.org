'use client'

import { SoundEngine } from './SoundEngine'

/**
 * Procedural sound generators for DATAVISM cinematic experience.
 * All sounds are generated in real-time via Web Audio API — no audio files needed.
 */

const engine = () => SoundEngine.getInstance()

/** Try to resume AudioContext if it's suspended (iOS Safari workaround) */
async function tryResume(): Promise<void> {
  const e = engine()
  if (e.context?.state === 'suspended') {
    try { await e.context.resume() } catch { /* ignore */ }
  }
}

/** Quick beep — foundation for many sounds */
function beep(frequency: number, duration: number, volume = 0.3, type: OscillatorType = 'sine'): void {
  const e = engine()
  if (!e.enabled || !e.context || !e.output) return

  // Auto-resume if suspended (can happen on iOS after tab switch)
  if (e.context.state === 'suspended') {
    tryResume()
    return // skip this sound, next one will work
  }

  const ctx = e.context
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.value = frequency
  osc.connect(gain)
  gain.connect(e.output)

  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

// ─── Individual Sound Types ────────────────────────────────────────

/** Mechanical keyboard click — slight pitch variation each call */
export function typing(): void {
  beep(800 + Math.random() * 400, 0.025, 0.08, 'square')
}

/** Glitch burst — chaotic rapid frequency changes */
export function glitch(): void {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      beep(100 + Math.random() * 1200, 0.015, 0.06, Math.random() > 0.5 ? 'sawtooth' : 'square')
    }, i * 15)
  }
}

/** Impact — bass hit for dramatic reveals */
export function impact(): void {
  const e = engine()
  if (!e.enabled || !e.context || !e.output) return

  const ctx = e.context
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(150, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.5)
  osc.connect(gain)
  gain.connect(e.output)

  gain.gain.setValueAtTime(0.4, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.5)
}

/** Whoosh — sweep sound for transitions */
export function whoosh(): void {
  const e = engine()
  if (!e.enabled || !e.context || !e.output) return

  const ctx = e.context
  // Use filtered noise simulation via rapid oscillator sweep
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(200, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(4000, ctx.currentTime + 0.15)
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3)
  osc.connect(gain)
  gain.connect(e.output)

  gain.gain.setValueAtTime(0.001, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.35)
}

/** Heartbeat — double-thud that can be called at varying intervals */
export function heartbeat(): void {
  beep(60, 0.12, 0.3, 'sine')
  setTimeout(() => beep(50, 0.15, 0.25, 'sine'), 120)
}

/** Static burst — white noise crackle */
export function staticBurst(durationMs = 200): void {
  const e = engine()
  if (!e.enabled || !e.context || !e.output) return

  const ctx = e.context
  const bufferSize = ctx.sampleRate * (durationMs / 1000)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3
  }

  const source = ctx.createBufferSource()
  const gain = ctx.createGain()
  source.buffer = buffer
  source.connect(gain)
  gain.connect(e.output)

  gain.gain.setValueAtTime(0.1, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000)

  source.start(ctx.currentTime)
}

/** Drone — sustained low-frequency tone. Returns a stop function. */
export function drone(frequency = 55, volume = 0.08): (() => void) | null {
  const e = engine()
  if (!e.enabled || !e.context || !e.output) return null

  // Auto-resume suspended context
  if (e.context.state === 'suspended') {
    tryResume()
    return null
  }

  const ctx = e.context
  const osc = ctx.createOscillator()
  const osc2 = ctx.createOscillator()
  const gain = ctx.createGain()

  // Two detuned oscillators for thickness
  osc.type = 'sine'
  osc.frequency.value = frequency
  osc2.type = 'sine'
  osc2.frequency.value = frequency * 1.005 // slight detune

  osc.connect(gain)
  osc2.connect(gain)
  gain.connect(e.output)

  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1) // fade in

  osc.start(ctx.currentTime)
  osc2.start(ctx.currentTime)

  return () => {
    const now = ctx.currentTime
    gain.gain.linearRampToValueAtTime(0, now + 0.5) // fade out
    osc.stop(now + 0.6)
    osc2.stop(now + 0.6)
  }
}

/** Success — triumphant ascending chord */
export function success(): void {
  beep(523.25, 0.15, 0.2)       // C
  setTimeout(() => beep(659.25, 0.15, 0.2), 100) // E
  setTimeout(() => beep(783.99, 0.2, 0.25), 200) // G
  setTimeout(() => beep(1046.5, 0.3, 0.2), 350)  // C (octave)
}

/** Alert — urgent rising tone */
export function alert(): void {
  const e = engine()
  if (!e.enabled || !e.context || !e.output) return

  const ctx = e.context
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'square'
  osc.frequency.setValueAtTime(400, ctx.currentTime)
  osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.4)
  osc.connect(gain)
  gain.connect(e.output)

  gain.gain.setValueAtTime(0.1, ctx.currentTime)
  gain.gain.setValueAtTime(0.1, ctx.currentTime + 0.35)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.45)
}

/** Scan — descending sweep used in data reveal phases */
export function scan(): void {
  const e = engine()
  if (!e.enabled || !e.context || !e.output) return

  const ctx = e.context
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(2000, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.6)
  osc.connect(gain)
  gain.connect(e.output)

  gain.gain.setValueAtTime(0.06, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.65)
}

/** Bass drop — deep, resonant thud for dramatic fingerprint reveal */
export function bassDrop(): void {
  const e = engine()
  if (!e.enabled || !e.context || !e.output) return

  const ctx = e.context
  const osc = ctx.createOscillator()
  const sub = ctx.createOscillator()
  const gain = ctx.createGain()

  // Main oscillator — deep sine starting at 80Hz, drops to 20Hz
  osc.type = 'sine'
  osc.frequency.setValueAtTime(80, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.5)
  osc.connect(gain)

  // Sub-harmonic layer for extra weight
  sub.type = 'sine'
  sub.frequency.setValueAtTime(40, ctx.currentTime)
  sub.frequency.exponentialRampToValueAtTime(15, ctx.currentTime + 0.5)
  sub.connect(gain)

  gain.connect(e.output)

  gain.gain.setValueAtTime(0.5, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.55)
  sub.start(ctx.currentTime)
  sub.stop(ctx.currentTime + 0.55)
}

/** Corporate muzak — cheesy elevator music simulation */
export function corporateMuzak(): (() => void) | null {
  const e = engine()
  if (!e.enabled || !e.context || !e.output) return null

  // Auto-resume suspended context
  if (e.context.state === 'suspended') {
    tryResume()
    return null
  }

  const ctx = e.context
  const gain = ctx.createGain()
  gain.gain.value = 0.04
  gain.connect(e.output)

  const notes = [
    { freq: 440, dur: 0.5 },   // A
    { freq: 494, dur: 0.5 },   // B
    { freq: 523, dur: 0.5 },   // C
    { freq: 494, dur: 0.5 },   // B
    { freq: 440, dur: 0.5 },   // A
    { freq: 392, dur: 0.5 },   // G
    { freq: 440, dur: 1.0 },   // A (held)
  ]

  let stopped = false
  const oscillators: OscillatorNode[] = []

  const playLoop = () => {
    if (stopped) return
    let time = ctx.currentTime

    for (const note of notes) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = note.freq
      osc.connect(gain)
      osc.start(time)
      osc.stop(time + note.dur * 0.9)
      oscillators.push(osc)
      time += note.dur
    }

    // Schedule next loop
    setTimeout(() => playLoop(), notes.reduce((a, n) => a + n.dur, 0) * 1000)
  }

  playLoop()

  return () => {
    stopped = true
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    oscillators.forEach(o => { try { o.stop() } catch {} })
  }
}

/** Distort the muzak — increase frequency wobble and noise */
export function distortMuzak(gain: GainNode | null): void {
  // This is called to make the muzak sound broken/corrupted
  // Handled by adding noise overlay
  staticBurst(100)
  setTimeout(() => staticBurst(50), 150)
}
