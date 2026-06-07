'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { typing, scan, heartbeat, impact, drone, glitch } from '@/lib/audio/procedural'

interface UserData {
  device: string
  browser: string
  os: string
  language: string
  timezone: string
  city: string
  screenResolution: string
  pixelRatio: number
  cpuCores: number
  memory: number | null
  gpu: string
  fingerprint: string
  connectionType: string
  batteryLevel: number | null
  touchscreen: boolean
  colorDepth: number
  installedPlugins: number
  doNotTrack: boolean
  cookiesEnabled: boolean
  localStorageAvailable: boolean
  screenOrientation: string
  onlineStatus: boolean
  estimatedDailyHours: string
}

interface DataRevelationProps {
  userData: UserData
  onComplete: () => void
  hasInteracted: boolean
}

type RevealState =
  | 'scanning'
  | 'device'
  | 'location'
  | 'browser'
  | 'hardware'
  | 'behavioral'
  | 'fingerprint'
  | 'verdict'
  | 'complete'

export function DataRevelation({ userData, onComplete, hasInteracted }: DataRevelationProps) {
  const [state, setState] = useState<RevealState>('scanning')
  const [lines, setLines] = useState<string[]>([])
  const [currentTyping, setCurrentTyping] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [borderPulseSpeed, setBorderPulseSpeed] = useState(2.0)
  const [showFingerprint, setShowFingerprint] = useState(false)
  const [showVerdict1, setShowVerdict1] = useState(false)
  const [showVerdict2, setShowVerdict2] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const stopDroneRef = useRef<(() => void) | null>(null)
  const sequenceRunRef = useRef(false)
  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines, currentTyping, showFingerprint, showVerdict1, showVerdict2])

  // Pulsing heartbeat sound synced to border pulse
  useEffect(() => {
    if (state === 'complete') return
    const interval = setInterval(() => {
      if (hasInteracted) heartbeat()
    }, borderPulseSpeed * 1000)
    return () => clearInterval(interval)
  }, [borderPulseSpeed, state, hasInteracted])

  // Cleanup drone on unmount
  useEffect(() => {
    return () => {
      if (stopDroneRef.current) {
        stopDroneRef.current()
        stopDroneRef.current = null
      }
    }
  }, [])

  // Detect mobile for faster sequence
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  // Type a line with realistic delay + typing sound per character
  const typeLine = useCallback(async (text: string, speed = 30): Promise<void> => {
    // On mobile: show line instantly (no char-by-char typing)
    if (isMobile) {
      if (hasInteracted) typing()
      setLines(prev => [...prev, text])
      await delay(80) // tiny pause between lines for visual flow
      return
    }

    return new Promise(resolve => {
      let index = 0
      setCurrentTyping('')

      const typeChar = () => {
        if (index < text.length) {
          const char = text[index]
          setCurrentTyping(prev => prev + char)
          // Play typing sound for visible characters
          if (hasInteracted && char !== ' ') typing()
          index++
          const jitter = speed + Math.random() * 20
          setTimeout(typeChar, jitter)
        } else {
          setLines(prev => [...prev, text])
          setCurrentTyping('')
          resolve()
        }
      }

      typeChar()
    })
  }, [hasInteracted, isMobile])

  // Add line instantly
  const addLine = useCallback((text: string) => {
    setLines(prev => [...prev, text])
  }, [])

  // The revelation sequence
  useEffect(() => {
    if (sequenceRunRef.current) return
    sequenceRunRef.current = true

    const runSequence = async () => {
      // Start the drone — begins low and quiet, builds dread
      if (hasInteracted) {
        stopDroneRef.current = drone(45, 0.04) ?? null
      }

      // ═══ SCANNING PHASE ═══
      setState('scanning')
      if (hasInteracted) scan()
      await typeLine('> INITIALIZING SCAN PROTOCOL...', 40)
      await delay(500)
      addLine('> ACCESSING DEVICE INFORMATION...')
      await delay(300)
      addLine('> BYPASSING PRIVACY SHIELDS...')
      await delay(400)
      addLine('')
      addLine('█████████████████████████████ 100%')
      await delay(600)
      addLine('')
      addLine('> SCAN COMPLETE. SUBJECT IDENTIFIED.')
      addLine('')
      await delay(800)

      // Accelerate pulse slightly
      setBorderPulseSpeed(1.8)

      // ═══ DEVICE REVEAL ═══
      setState('device')
      if (hasInteracted) scan()
      await typeLine('┌─────────────────────────────────────┐')
      await typeLine('│  DEVICE PROFILE                     │')
      await typeLine('└─────────────────────────────────────┘')
      await delay(200)
      await typeLine(`> DEVICE:     ${userData.device}`, 25)
      await typeLine(`> OS:         ${userData.os}`, 25)
      await typeLine(`> SCREEN:     ${userData.screenResolution} @ ${userData.pixelRatio}x`, 25)
      await typeLine(`> COLOR:      ${userData.colorDepth}-bit`, 25)
      await typeLine(`> ORIENT:     ${userData.screenOrientation}`, 25)
      if (userData.touchscreen) {
        await typeLine('> INPUT:      Touchscreen detected', 25)
      }
      addLine('')
      await delay(600)

      // Accelerate heartbeat
      setBorderPulseSpeed(1.5)

      // ═══ LOCATION REVEAL ═══
      setState('location')
      if (hasInteracted) scan()
      await typeLine('┌─────────────────────────────────────┐')
      await typeLine('│  LOCATION DATA                      │')
      await typeLine('└─────────────────────────────────────┘')
      await delay(200)
      // The city is the most unsettling reveal
      if (userData.city) {
        await typeLine(`> APPROXIMATE LOCATION: ${userData.city}`, 20)
        await delay(400)
      }
      await typeLine(`> TIMEZONE:   ${userData.timezone}`, 25)
      await typeLine(`> LANGUAGE:   ${userData.language}`, 25)
      await typeLine(`> NETWORK:    ${userData.connectionType.toUpperCase()}`, 25)
      await typeLine(`> STATUS:     ${userData.onlineStatus ? 'ONLINE' : 'OFFLINE'}`, 25)
      if (userData.batteryLevel !== null) {
        await typeLine(`> BATTERY:    ${userData.batteryLevel}%`, 25)
      }
      addLine('')
      await delay(600)

      // Accelerate
      setBorderPulseSpeed(1.2)

      // ═══ BROWSER REVEAL ═══
      setState('browser')
      if (hasInteracted) scan()
      await typeLine('┌─────────────────────────────────────┐')
      await typeLine('│  BROWSER ANALYSIS                   │')
      await typeLine('└─────────────────────────────────────┘')
      await delay(200)
      await typeLine(`> BROWSER:    ${userData.browser}`, 25)
      await typeLine(`> PLUGINS:    ${userData.installedPlugins} detected`, 25)
      addLine('')
      await delay(600)

      // Faster still
      setBorderPulseSpeed(1.0)

      // ═══ HARDWARE REVEAL ═══
      setState('hardware')
      if (hasInteracted) scan()
      await typeLine('┌─────────────────────────────────────┐')
      await typeLine('│  HARDWARE FINGERPRINT               │')
      await typeLine('└─────────────────────────────────────┘')
      await delay(200)
      await typeLine(`> CPU CORES:  ${userData.cpuCores}`, 25)
      if (userData.memory) {
        await typeLine(`> RAM:        ${userData.memory} GB`, 25)
      }
      await typeLine(`> GPU:        ${userData.gpu.slice(0, 40)}${userData.gpu.length > 40 ? '...' : ''}`, 25)
      addLine('')
      await delay(600)

      // Pulse accelerates
      setBorderPulseSpeed(0.8)

      // ═══ BEHAVIORAL PROFILE ═══
      setState('behavioral')
      if (hasInteracted) scan()
      await typeLine('┌─────────────────────────────────────┐')
      await typeLine('│  BEHAVIORAL PROFILE                 │')
      await typeLine('└─────────────────────────────────────┘')
      await delay(200)
      await typeLine(`> SCREEN TIME: ~${userData.estimatedDailyHours} hrs/day`, 25)
      if (userData.doNotTrack) {
        await typeLine('> DO NOT TRACK: IGNORED', 20)
        await delay(300)
      }
      await typeLine(`> COOKIES:    ${userData.cookiesEnabled ? 'ENABLED' : 'DISABLED'}`, 25)
      await typeLine(`> LOCAL STORAGE: ${userData.localStorageAvailable ? 'ACCESSIBLE' : 'BLOCKED'}`, 25)
      addLine('')
      await delay(800)

      // Rapid heartbeat now
      setBorderPulseSpeed(0.6)

      // ═══ FINGERPRINT REVEAL — THE BIG ONE ═══
      setState('fingerprint')
      await delay(500)
      addLine('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓')
      await delay(200)
      addLine('')
      await typeLine('> GENERATING UNIQUE IDENTIFIER...', 50)
      await delay(1200)

      // Dramatic pause — drone swells, pulse races
      setBorderPulseSpeed(0.4)
      addLine('')

      // Glitch sound + show fingerprint big and red
      if (hasInteracted) glitch()
      setShowFingerprint(true)

      await delay(2000)

      addLine('')
      addLine('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓')
      addLine('')
      await delay(1000)

      // ═══ THE VERDICT ═══
      setState('verdict')
      setBorderPulseSpeed(0.3)

      addLine('')
      await typeLine('═══════════════════════════════════════', 15)
      await delay(800)

      // Stop the drone right before the verdict for a moment of silence
      if (stopDroneRef.current) {
        stopDroneRef.current()
        stopDroneRef.current = null
      }
      await delay(600)

      // Impact sound on the verdict
      if (hasInteracted) impact()
      setShowVerdict1(true)

      await delay(1500)

      if (hasInteracted) impact()
      setShowVerdict2(true)

      await delay(800)
      addLine('')
      await typeLine('═══════════════════════════════════════', 15)

      setState('complete')
      setBorderPulseSpeed(0)
      await delay(2500)
      onComplete()
    }

    runSequence()

    return () => {
      sequenceRunRef.current = false // Allow re-run on StrictMode remount
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Determine border glow color and intensity based on state
  const borderColor = state === 'verdict' || state === 'fingerprint'
    ? 'rgba(239, 68, 68, 0.7)'
    : state === 'complete'
    ? 'rgba(239, 68, 68, 0.3)'
    : 'rgba(34, 197, 94, 0.5)'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex items-center justify-center p-4"
    >
      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              'repeating-linear-gradient(0deg, rgba(0,255,0,0.03) 0px, rgba(0,255,0,0.03) 1px, transparent 1px, transparent 2px)',
          }}
        />
      </div>

      {/* CRT flicker */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-20"
        animate={{
          opacity: [0, 0.02, 0, 0.01, 0],
        }}
        transition={{
          duration: 0.15,
          repeat: Infinity,
          repeatDelay: Math.random() * 2 + 1,
        }}
        style={{ backgroundColor: 'white' }}
      />

      {/* Terminal container with pulsing border */}
      <div className="w-full max-w-3xl relative">
        {/* Pulsing glow layer behind the terminal */}
        {borderPulseSpeed > 0 && (
          <motion.div
            className="absolute -inset-1 rounded-sm pointer-events-none z-0"
            animate={{
              boxShadow: [
                `0 0 8px 2px ${borderColor}, inset 0 0 8px 1px ${borderColor}`,
                `0 0 20px 6px ${borderColor}, inset 0 0 20px 3px ${borderColor}`,
                `0 0 8px 2px ${borderColor}, inset 0 0 8px 1px ${borderColor}`,
              ],
            }}
            transition={{
              duration: borderPulseSpeed,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Terminal header */}
        <div className="relative z-10 bg-gray-900 border border-green-500/50 border-b-0 px-3 md:px-4 py-2 flex items-center gap-2 md:gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="font-mono text-green-500 text-sm">
            GHOST://scan.protocol.v3
          </span>
          <div className="ml-auto flex items-center gap-2">
            {state !== 'complete' && (
              <motion.div
                className="w-2 h-2 rounded-full bg-red-500"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
            <span className="font-mono text-red-400 text-xs uppercase">
              {state === 'complete' ? 'SCAN COMPLETE' : 'LIVE SCAN'}
            </span>
          </div>
        </div>

        {/* Terminal body */}
        <div
          ref={terminalRef}
          className="relative z-10 bg-black border border-green-500/50 p-3 md:p-6 font-mono text-xs md:text-sm leading-relaxed overflow-y-auto"
          style={{
            height: '60vh',
            maxHeight: '600px',
            textShadow: '0 0 5px rgba(0, 255, 0, 0.5)',
          }}
        >
          {lines.map((line, index) => (
            <div
              key={index}
              className={`${
                line.includes('APPROXIMATE LOCATION:')
                  ? 'text-yellow-400 font-bold'
                  : line.includes('DO NOT TRACK: IGNORED')
                  ? 'text-red-400 font-semibold'
                  : line.startsWith('>')
                  ? 'text-green-400'
                  : line.startsWith('│') || line.startsWith('┌') || line.startsWith('└')
                  ? 'text-green-600'
                  : line.includes('█') || line.includes('▓')
                  ? 'text-green-500/50'
                  : line.includes('═')
                  ? 'text-red-500/70'
                  : 'text-green-300'
              }`}
            >
              {line || '\u00A0'}
            </div>
          ))}

          {/* Fingerprint — shown as a dramatic standalone element */}
          {showFingerprint && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="my-4 text-center"
            >
              <div className="text-green-500/60 text-xs mb-2 tracking-widest">
                YOUR UNIQUE FINGERPRINT
              </div>
              <motion.div
                className="text-red-500 text-sm md:text-lg lg:text-4xl font-bold tracking-wider"
                animate={{
                  textShadow: [
                    '0 0 10px rgba(239, 68, 68, 0.5)',
                    '0 0 30px rgba(239, 68, 68, 0.8), 0 0 60px rgba(239, 68, 68, 0.4)',
                    '0 0 10px rgba(239, 68, 68, 0.5)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {userData.fingerprint}
              </motion.div>
            </motion.div>
          )}

          {/* Verdict lines — shown as dramatic standalone elements */}
          {showVerdict1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="my-2"
            >
              <motion.div
                className="text-red-500 text-2xl md:text-4xl lg:text-6xl font-bold tracking-wider"
                animate={{
                  textShadow: [
                    '0 0 10px rgba(239, 68, 68, 0.5)',
                    '0 0 40px rgba(239, 68, 68, 0.9), 0 0 80px rgba(239, 68, 68, 0.4)',
                    '0 0 10px rgba(239, 68, 68, 0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                YOU ARE NOT ANONYMOUS.
              </motion.div>
            </motion.div>
          )}

          {showVerdict2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="my-2"
            >
              <motion.div
                className="text-red-500 text-2xl md:text-4xl lg:text-6xl font-bold tracking-wider"
                animate={{
                  textShadow: [
                    '0 0 10px rgba(239, 68, 68, 0.5)',
                    '0 0 40px rgba(239, 68, 68, 0.9), 0 0 80px rgba(239, 68, 68, 0.4)',
                    '0 0 10px rgba(239, 68, 68, 0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                YOU HAVE NEVER BEEN ANONYMOUS.
              </motion.div>
            </motion.div>
          )}

          {/* Currently typing line */}
          {currentTyping && (
            <div className={`${
              currentTyping.includes('APPROXIMATE LOCATION:')
                ? 'text-yellow-400 font-bold'
                : currentTyping.includes('DO NOT TRACK: IGNORED')
                ? 'text-red-400 font-semibold'
                : 'text-green-400'
            }`}>
              {currentTyping}
              <span className={`${showCursor ? 'opacity-100' : 'opacity-0'}`}>█</span>
            </div>
          )}

          {/* Cursor when not typing */}
          {!currentTyping && state !== 'complete' && !showVerdict1 && (
            <div className="text-green-400">
              <span className={`${showCursor ? 'opacity-100' : 'opacity-0'}`}>█</span>
            </div>
          )}
        </div>
      </div>

      {/* Ambient glow — shifts red during fingerprint/verdict */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-2000"
        style={{
          background:
            state === 'fingerprint' || state === 'verdict'
              ? 'radial-gradient(ellipse at center, rgba(239,68,68,0.08) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at center, rgba(0,255,0,0.05) 0%, transparent 70%)',
        }}
      />
    </motion.div>
  )
}

function delay(ms: number): Promise<void> {
  // On mobile, cut all delays in half
  const actual = typeof window !== 'undefined' && window.innerWidth < 768 ? ms * 0.4 : ms
  return new Promise(resolve => setTimeout(resolve, actual))
}
