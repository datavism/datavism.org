'use client'

/**
 * SoundEngine — Singleton Web Audio context manager for DATAVISM
 *
 * All procedural audio runs through this engine.
 * Handles AudioContext lifecycle, autoplay policy, and master volume.
 */

let instance: SoundEngine | null = null

export class SoundEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private _enabled = true
  private _volume = 0.5
  private _initialized = false

  static getInstance(): SoundEngine {
    if (!instance) {
      instance = new SoundEngine()
    }
    return instance
  }

  private constructor() {}

  /** Initialize or resume AudioContext (must be called after user interaction) */
  async init(): Promise<void> {
    if (this._initialized && this.ctx?.state === 'running') return

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = this._volume
      this.masterGain.connect(this.ctx.destination)
    }

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume()
    }

    this._initialized = true
  }

  get context(): AudioContext | null {
    return this.ctx
  }

  get output(): GainNode | null {
    return this.masterGain
  }

  get enabled(): boolean {
    return this._enabled
  }

  get volume(): number {
    return this._volume
  }

  get initialized(): boolean {
    return this._initialized
  }

  setVolume(v: number): void {
    this._volume = Math.max(0, Math.min(1, v))
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this._volume, this.ctx!.currentTime)
    }
  }

  toggle(): void {
    this._enabled = !this._enabled
  }

  setEnabled(enabled: boolean): void {
    this._enabled = enabled
  }

  /** Create an oscillator connected to master output */
  createOscillator(type: OscillatorType = 'sine'): OscillatorNode | null {
    if (!this.ctx || !this.masterGain) return null
    const osc = this.ctx.createOscillator()
    osc.type = type
    return osc
  }

  /** Create a gain node connected to master output */
  createGain(value = 1): GainNode | null {
    if (!this.ctx || !this.masterGain) return null
    const gain = this.ctx.createGain()
    gain.gain.value = value
    gain.connect(this.masterGain)
    return gain
  }

  /** Get current time from audio context */
  get now(): number {
    return this.ctx?.currentTime ?? 0
  }

  dispose(): void {
    this.ctx?.close()
    this.ctx = null
    this.masterGain = null
    this._initialized = false
    instance = null
  }
}
