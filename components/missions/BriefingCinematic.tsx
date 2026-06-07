'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { typing as typingSound, impact, whoosh } from '@/lib/audio/procedural'
import type { Mission } from '@/lib/data/missions'

interface BriefingCinematicProps {
  mission: Mission
  onAccept: () => void
  onClose: () => void
}

type Phase = 'fade' | 'classified' | 'title' | 'briefing' | 'objectives' | 'sources' | 'ready'

const CHAR_SPEED = 30 // ms per character for briefing text
const TITLE_CHAR_SPEED = 50 // ms per character for title

export function BriefingCinematic({ mission, onAccept, onClose }: BriefingCinematicProps) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('fade')
  const [titleChars, setTitleChars] = useState(0)
  const [briefingChars, setBriefingChars] = useState(0)
  const [visibleObjectives, setVisibleObjectives] = useState(0)
  const [visibleSources, setVisibleSources] = useState(0)
  const [skipped, setSkipped] = useState(false)
  const typingIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearTimeout(typingIntervalRef.current)
      }
    }
  }, [])

  // Phase sequencing
  useEffect(() => {
    if (skipped) return

    switch (phase) {
      case 'fade':
        const fadeTimer = setTimeout(() => setPhase('classified'), 800)
        return () => clearTimeout(fadeTimer)

      case 'classified':
        impact()
        const classifiedTimer = setTimeout(() => setPhase('title'), 1800)
        return () => clearTimeout(classifiedTimer)

      case 'title':
        // Title types character by character
        if (titleChars < mission.title.length) {
          const timer = setTimeout(() => {
            typingSound()
            setTitleChars(c => c + 1)
          }, TITLE_CHAR_SPEED)
          return () => clearTimeout(timer)
        } else {
          const timer = setTimeout(() => setPhase('briefing'), 600)
          return () => clearTimeout(timer)
        }
        break

      case 'briefing':
        // Briefing text types character by character
        if (briefingChars < mission.briefing.length) {
          const timer = setTimeout(() => {
            // Only play sound every 3rd character to avoid audio overload
            if (briefingChars % 3 === 0) typingSound()
            setBriefingChars(c => c + 1)
          }, CHAR_SPEED)
          return () => clearTimeout(timer)
        } else {
          const timer = setTimeout(() => setPhase('objectives'), 500)
          return () => clearTimeout(timer)
        }
        break

      case 'objectives':
        if (visibleObjectives < mission.objectives.length) {
          const timer = setTimeout(() => {
            typingSound()
            setVisibleObjectives(v => v + 1)
          }, 400)
          return () => clearTimeout(timer)
        } else {
          const timer = setTimeout(() => setPhase('sources'), 400)
          return () => clearTimeout(timer)
        }
        break

      case 'sources':
        if (visibleSources < mission.dataSources.length) {
          const timer = setTimeout(() => {
            typingSound()
            setVisibleSources(v => v + 1)
          }, 300)
          return () => clearTimeout(timer)
        } else {
          const timer = setTimeout(() => setPhase('ready'), 500)
          return () => clearTimeout(timer)
        }
        break
    }
  }, [phase, titleChars, briefingChars, visibleObjectives, visibleSources, skipped, mission])

  const handleSkip = useCallback(() => {
    setSkipped(true)
    setTitleChars(mission.title.length)
    setBriefingChars(mission.briefing.length)
    setVisibleObjectives(mission.objectives.length)
    setVisibleSources(mission.dataSources.length)
    setPhase('ready')
  }, [mission])

  const handleAccept = useCallback(() => {
    whoosh()
    onAccept()
    router.push(`/ops/investigate/${mission.slug}`)
  }, [onAccept, router, mission.slug])

  const handleDecline = useCallback(() => {
    onClose()
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-black font-mono overflow-y-auto"
    >
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[101]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.015) 2px, rgba(0,255,65,0.015) 4px)',
        }}
      />

      {/* Skip button */}
      {phase !== 'ready' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={handleSkip}
          className="fixed top-20 right-6 z-[102] text-green-400/30 text-[0.65rem] tracking-[0.2em] hover:text-green-400/60 transition-colors border border-green-400/10 px-3 py-1 hover:border-green-400/30"
        >
          SKIP [ESC]
        </motion.button>
      )}

      {/* Main content area */}
      <div className="relative z-[101] flex flex-col items-center justify-start min-h-screen px-6 py-20 md:py-28">
        <div className="max-w-2xl w-full">

          {/* CLASSIFIED stamp */}
          <AnimatePresence>
            {(phase === 'classified' || phase === 'title' || phase === 'briefing' || phase === 'objectives' || phase === 'sources' || phase === 'ready') && (
              <motion.div
                initial={{ opacity: 0, scale: 2, rotate: -12 }}
                animate={{ opacity: 1, scale: 1, rotate: -3 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                className="mb-10 relative"
              >
                <div className="inline-block border-4 border-red-500/60 px-6 py-2">
                  <span className="text-red-500 text-3xl md:text-4xl font-bold tracking-[0.3em]">
                    CLASSIFIED
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mission title — typewriter */}
          {(phase === 'title' || phase === 'briefing' || phase === 'objectives' || phase === 'sources' || phase === 'ready') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <div className="text-green-400/30 text-[0.65rem] tracking-[0.3em] mb-2">
                MISSION DESIGNATION
              </div>
              <h2 className="text-green-300 text-2xl md:text-3xl font-bold tracking-wider">
                {mission.title.slice(0, titleChars)}
                {titleChars < mission.title.length && (
                  <span className="inline-block w-3 h-6 bg-green-400 ml-0.5 animate-blink align-text-bottom" />
                )}
              </h2>
            </motion.div>
          )}

          {/* Briefing text — typewriter */}
          {(phase === 'briefing' || phase === 'objectives' || phase === 'sources' || phase === 'ready') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <div className="text-green-400/30 text-[0.65rem] tracking-[0.3em] mb-3">
                OPERATIONAL BRIEFING
              </div>
              <div className="border-l-2 border-green-500/20 pl-4">
                <pre className="text-green-400/70 text-xs whitespace-pre-wrap leading-relaxed font-mono">
                  {mission.briefing.slice(0, briefingChars)}
                  {briefingChars < mission.briefing.length && (
                    <span className="inline-block w-2 h-4 bg-green-400 ml-0.5 animate-blink align-text-bottom" />
                  )}
                </pre>
              </div>
            </motion.div>
          )}

          {/* Objectives — appear one by one */}
          {(phase === 'objectives' || phase === 'sources' || phase === 'ready') && visibleObjectives > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <div className="text-green-400/30 text-[0.65rem] tracking-[0.3em] mb-3">
                MISSION OBJECTIVES
              </div>
              <div className="space-y-2">
                {mission.objectives.slice(0, visibleObjectives).map((obj, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <span className="text-green-400/30 text-xs mt-0.5">&#9744;</span>
                    <span className="text-green-400/60 text-xs leading-relaxed">{obj}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Data sources */}
          {(phase === 'sources' || phase === 'ready') && visibleSources > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-10"
            >
              <div className="text-green-400/30 text-[0.65rem] tracking-[0.3em] mb-3">
                INTEL SOURCES
              </div>
              <div className="space-y-1.5">
                {mission.dataSources.slice(0, visibleSources).map((src, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-cyan-400/40 text-[0.6rem]">&#9656;</span>
                    <span className="text-cyan-400/50 text-xs">{src}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Mission metadata bar */}
          {phase === 'ready' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-10 flex items-center gap-6 border-t border-b border-green-500/10 py-3"
            >
              <div>
                <span className="text-green-400/30 text-[0.6rem] tracking-wider">DIFFICULTY</span>
                <div className={`text-xs font-bold tracking-wider mt-0.5 ${
                  mission.difficulty === 'recruit' ? 'text-green-400' :
                  mission.difficulty === 'operative' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {mission.difficulty.toUpperCase()}
                </div>
              </div>
              <div>
                <span className="text-green-400/30 text-[0.6rem] tracking-wider">EST. TIME</span>
                <div className="text-green-400/60 text-xs mt-0.5">{mission.estimatedTime}</div>
              </div>
              <div>
                <span className="text-green-400/30 text-[0.6rem] tracking-wider">REWARD</span>
                <div className="text-green-300 text-xs font-bold mt-0.5">+{mission.influenceReward} INFLUENCE</div>
              </div>
            </motion.div>
          )}

          {/* Action buttons */}
          {phase === 'ready' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAccept}
                className="relative px-10 py-4 border-2 border-green-400 text-green-400 font-bold text-sm tracking-[0.2em] hover:bg-green-400/10 transition-all group"
              >
                <span className="relative z-10">ACCEPT MISSION</span>
                {/* Glow pulse */}
                <div className="absolute inset-0 bg-green-400/5 group-hover:bg-green-400/10 transition-colors" />
                <motion.div
                  className="absolute inset-0 border border-green-400/30"
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>

              <button
                onClick={handleDecline}
                className="px-6 py-4 text-green-400/30 text-xs tracking-[0.15em] hover:text-green-400/60 transition-colors"
              >
                DECLINE
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Keyboard listener for ESC to skip/close */}
      <EscapeListener onEscape={phase === 'ready' ? handleDecline : handleSkip} />
    </motion.div>
  )
}

/** Small helper to listen for ESC key */
function EscapeListener({ onEscape }: { onEscape: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onEscape])

  return null
}
