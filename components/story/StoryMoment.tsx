'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { StoryMoment as StoryMomentType } from '@/lib/data/story-moments'
import { typing, impact, whoosh } from '@/lib/audio/procedural'

// ─── Styling Maps ────────────────────────────────────────────────────

const SPEAKER_COLORS: Record<StoryMomentType['speaker'], string> = {
  ghost: '#00ff41',
  system: '#00e5ff',
  unknown: '#ff3333',
}

const SPEAKER_LABELS: Record<StoryMomentType['speaker'], string> = {
  ghost: 'GHOST',
  system: 'SYSTEM',
  unknown: '???',
}

const MOOD_CONFIGS: Record<StoryMomentType['mood'], {
  bgOverlay: string
  pulseSpeed: number
  glowColor: string
}> = {
  neutral: {
    bgOverlay: 'rgba(0, 0, 0, 0)',
    pulseSpeed: 4,
    glowColor: 'rgba(0, 255, 65, 0.05)',
  },
  urgent: {
    bgOverlay: 'rgba(0, 0, 0, 0)',
    pulseSpeed: 1.5,
    glowColor: 'rgba(0, 229, 255, 0.08)',
  },
  warning: {
    bgOverlay: 'rgba(60, 0, 0, 0.3)',
    pulseSpeed: 2,
    glowColor: 'rgba(255, 51, 51, 0.1)',
  },
  triumphant: {
    bgOverlay: 'rgba(0, 30, 0, 0.3)',
    pulseSpeed: 3,
    glowColor: 'rgba(0, 255, 65, 0.12)',
  },
}

// ─── Typewriter Line Component ───────────────────────────────────────

function TypewriterLine({
  text,
  color,
  onComplete,
  startDelay = 0,
}: {
  text: string
  color: string
  onComplete: () => void
  startDelay?: number
}) {
  const [displayedChars, setDisplayedChars] = useState(0)
  const [started, setStarted] = useState(false)
  const completedRef = useRef(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), startDelay)
    return () => clearTimeout(timer)
  }, [startDelay])

  useEffect(() => {
    if (!started) return

    // Empty lines complete immediately
    if (text.trim() === '') {
      if (!completedRef.current) {
        completedRef.current = true
        onComplete()
      }
      return
    }

    if (displayedChars < text.length) {
      const speed = 25 + Math.random() * 20
      const timer = setTimeout(() => {
        setDisplayedChars(prev => prev + 1)
        try { typing() } catch {}
      }, speed)
      return () => clearTimeout(timer)
    } else if (!completedRef.current) {
      completedRef.current = true
      onComplete()
    }
  }, [started, displayedChars, text, onComplete])

  if (!started) return null

  // Empty lines render as spacers
  if (text.trim() === '') {
    return <div className="h-4" />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-mono text-sm sm:text-base leading-relaxed"
      style={{ color }}
    >
      {text.slice(0, displayedChars)}
      {displayedChars < text.length && (
        <span className="animate-pulse" style={{ color }}>_</span>
      )}
    </motion.div>
  )
}

// ─── Main StoryMoment Component ──────────────────────────────────────

interface StoryMomentProps {
  moment: StoryMomentType
  onComplete: () => void
}

export default function StoryMoment({ moment, onComplete }: StoryMomentProps) {
  const [currentLine, setCurrentLine] = useState(0)
  const [completedLines, setCompletedLines] = useState<number[]>([])
  const [allDone, setAllDone] = useState(false)

  const color = SPEAKER_COLORS[moment.speaker]
  const label = SPEAKER_LABELS[moment.speaker]
  const mood = MOOD_CONFIGS[moment.mood]

  // Play impact on mount
  useEffect(() => {
    try { impact() } catch {}
  }, [])

  const handleLineComplete = useCallback(() => {
    setCompletedLines(prev => {
      const next = [...prev, currentLine]
      return next
    })

    if (currentLine < moment.text.length - 1) {
      setCurrentLine(prev => prev + 1)
    } else {
      setAllDone(true)
    }
  }, [currentLine, moment.text.length])

  const handleContinue = useCallback(() => {
    try { whoosh() } catch {}
    onComplete()
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: '#000' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Mood overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: mood.bgOverlay }}
      />

      {/* Ambient pulse */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          boxShadow: [
            `inset 0 0 100px ${mood.glowColor}`,
            `inset 0 0 200px ${mood.glowColor}`,
            `inset 0 0 100px ${mood.glowColor}`,
          ],
        }}
        transition={{
          duration: mood.pulseSpeed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 sm:px-8">
        {/* Speaker label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 font-mono text-xs tracking-[0.3em] uppercase"
          style={{ color, opacity: 0.6 }}
        >
          {'// '}{label}
        </motion.div>

        {/* Lines container */}
        <div className="space-y-3 min-h-[200px]">
          <AnimatePresence mode="sync">
            {moment.text.slice(0, currentLine + 1).map((line, index) => (
              <motion.div
                key={`${moment.id}-line-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TypewriterLine
                  text={line}
                  color={completedLines.includes(index) ? `${color}99` : color}
                  onComplete={index === currentLine ? handleLineComplete : () => {}}
                  startDelay={index === 0 ? 600 : 200}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Continue button */}
        <AnimatePresence>
          {allDone && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-10 flex justify-center"
            >
              <button
                onClick={handleContinue}
                className="group relative font-mono text-sm tracking-[0.2em] uppercase px-8 py-3 border transition-all duration-300 hover:bg-white/5"
                style={{
                  color,
                  borderColor: `${color}44`,
                }}
                onMouseEnter={() => { try { typing() } catch {} }}
              >
                <span className="relative z-10">CONTINUE</span>
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    boxShadow: `0 0 20px ${color}22, inset 0 0 20px ${color}11`,
                  }}
                />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress indicator */}
        <div className="mt-8 flex justify-center gap-1.5">
          {moment.text.filter(t => t.trim() !== '').map((_, index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: completedLines.includes(index)
                  ? color
                  : `${color}22`,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
