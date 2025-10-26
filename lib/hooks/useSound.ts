'use client'

import { useEffect, useRef, useState } from 'react'

export type SoundType = 'typing' | 'success' | 'error' | 'glitch' | 'notification' | 'ambient'

interface SoundConfig {
  enabled: boolean
  volume: number
}

// Generate simple beep sounds using Web Audio API
function createBeep(context: AudioContext, frequency: number, duration: number, volume: number = 0.3) {
  const oscillator = context.createOscillator()
  const gainNode = context.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(context.destination)

  oscillator.frequency.value = frequency
  oscillator.type = 'sine'

  gainNode.gain.setValueAtTime(volume, context.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration)

  oscillator.start(context.currentTime)
  oscillator.stop(context.currentTime + duration)
}

function createTypingSound(context: AudioContext, volume: number = 0.15) {
  // Mechanical keyboard sound simulation
  const frequency = 800 + Math.random() * 200  // Vary pitch slightly
  createBeep(context, frequency, 0.03, volume)
}

function createSuccessSound(context: AudioContext, volume: number = 0.3) {
  // Ascending chord
  createBeep(context, 523.25, 0.1, volume)  // C
  setTimeout(() => createBeep(context, 659.25, 0.1, volume), 100)  // E
  setTimeout(() => createBeep(context, 783.99, 0.2, volume), 200)  // G
}

function createErrorSound(context: AudioContext, volume: number = 0.3) {
  // Descending dissonant sound
  createBeep(context, 400, 0.15, volume)
  setTimeout(() => createBeep(context, 300, 0.2, volume), 100)
}

function createGlitchSound(context: AudioContext, volume: number = 0.2) {
  // Random frequency burst
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const freq = 200 + Math.random() * 800
      createBeep(context, freq, 0.02, volume * 0.5)
    }, i * 20)
  }
}

function createNotificationSound(context: AudioContext, volume: number = 0.3) {
  // Double beep
  createBeep(context, 800, 0.1, volume)
  setTimeout(() => createBeep(context, 800, 0.1, volume), 150)
}

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const [config, setConfig] = useState<SoundConfig>({
    enabled: true,
    volume: 0.5
  })

  useEffect(() => {
    // Initialize AudioContext on first user interaction
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    return () => {
      audioContextRef.current?.close()
    }
  }, [])

  const playSound = (type: SoundType) => {
    if (!config.enabled || !audioContextRef.current) return

    const context = audioContextRef.current
    const volume = config.volume

    switch (type) {
      case 'typing':
        createTypingSound(context, volume * 0.3)
        break
      case 'success':
        createSuccessSound(context, volume)
        break
      case 'error':
        createErrorSound(context, volume)
        break
      case 'glitch':
        createGlitchSound(context, volume * 0.4)
        break
      case 'notification':
        createNotificationSound(context, volume)
        break
      // ambient handled differently
    }
  }

  const toggleSound = () => {
    setConfig(prev => ({ ...prev, enabled: !prev.enabled }))
  }

  const setVolume = (volume: number) => {
    setConfig(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }))
  }

  return {
    playSound,
    toggleSound,
    setVolume,
    isEnabled: config.enabled,
    volume: config.volume
  }
}
