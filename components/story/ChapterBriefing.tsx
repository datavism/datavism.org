'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { typing as typingSound, impact, whoosh } from '@/lib/audio/procedural'
import { getMissionsBySlugs } from '@/lib/data/missions'
import type { Chapter } from '@/lib/data/chapters'

interface ChapterBriefingProps {
  chapter: Chapter
  onClose: () => void
}

type Phase =
  | 'fade'
  | 'chapter-number'
  | 'codename'
  | 'briefing'
  | 'missions'
  | 'ready'

const CHAR_SPEED = 20 // ms per character for briefing
const CODENAME_CHAR_SPEED = 60 // ms per character for codename

export function ChapterBriefing({ chapter, onClose }: ChapterBriefingProps) {
  const [phase, setPhase] = useState<Phase>('fade')
  const [codenameChars, setCodenameChars] = useState(0)
  const [briefingChars, setBriefingChars] = useState(0)
  const [visibleMissions, setVisibleMissions] = useState(0)
  const [skipped, setSkipped] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const chapterMissions = getMissionsBySlugs(chapter.missionSlugs)

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  // Phase sequencing
  useEffect(() => {
    if (skipped) return

    switch (phase) {
      case 'fade': {
        const timer = setTimeout(() => setPhase('chapter-number'), 600)
        return () => clearTimeout(timer)
      }

      case 'chapter-number': {
        impact()
        const timer = setTimeout(() => setPhase('codename'), 1600)
        return () => clearTimeout(timer)
      }

      case 'codename': {
        if (codenameChars < chapter.codename.length) {
          const timer = setTimeout(() => {
            typingSound()
            setCodenameChars(c => c + 1)
          }, CODENAME_CHAR_SPEED)
          return () => clearTimeout(timer)
        } else {
          const timer = setTimeout(() => setPhase('briefing'), 800)
          return () => clearTimeout(timer)
        }
        break
      }

      case 'briefing': {
        if (briefingChars < chapter.briefing.length) {
          const timer = setTimeout(() => {
            if (briefingChars % 3 === 0) typingSound()
            setBriefingChars(c => c + 1)
          }, CHAR_SPEED)
          return () => clearTimeout(timer)
        } else {
          const timer = setTimeout(() => setPhase('missions'), 600)
          return () => clearTimeout(timer)
        }
        break
      }

      case 'missions': {
        if (visibleMissions < chapterMissions.length) {
          const timer = setTimeout(() => {
            typingSound()
            setVisibleMissions(v => v + 1)
          }, 400)
          return () => clearTimeout(timer)
        } else {
          const timer = setTimeout(() => setPhase('ready'), 500)
          return () => clearTimeout(timer)
        }
        break
      }
    }
  }, [phase, codenameChars, briefingChars, visibleMissions, skipped, chapter, chapterMissions.length])

  const handleSkip = useCallback(() => {
    setSkipped(true)
    setCodenameChars(chapter.codename.length)
    setBriefingChars(chapter.briefing.length)
    setVisibleMissions(chapterMissions.length)
    setPhase('ready')
  }, [chapter, chapterMissions.length])

  const handleProceed = useCallback(() => {
    whoosh()
    onClose()
  }, [onClose])

  // ESC key listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (phase === 'ready') {
          handleProceed()
        } else {
          handleSkip()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase, handleProceed, handleSkip])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[200] bg-black font-mono overflow-y-auto"
    >
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[201]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.012) 2px, rgba(0,255,65,0.012) 4px)',
        }}
      />

      {/* Skip button */}
      {phase !== 'ready' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={handleSkip}
          className="fixed top-6 right-6 z-[202] text-green-400/30 text-[0.65rem] tracking-[0.2em] hover:text-green-400/60 transition-colors border border-green-400/10 px-3 py-1 hover:border-green-400/30"
        >
          SKIP [ESC]
        </motion.button>
      )}

      {/* Main content */}
      <div className="relative z-[201] flex flex-col items-center justify-start min-h-screen px-6 py-20 md:py-28">
        <div className="max-w-2xl w-full">

          {/* ── CHAPTER NUMBER ── */}
          <AnimatePresence>
            {phase !== 'fade' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 150 }}
                className="mb-6 text-center"
              >
                <div className="text-green-400/20 text-[0.6rem] tracking-[0.5em] mb-3">
                  // INTELLIGENCE BRIEFING
                </div>
                <motion.div
                  initial={{ letterSpacing: '0.8em' }}
                  animate={{ letterSpacing: '0.3em' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="text-green-400 text-5xl md:text-7xl font-bold"
                >
                  CHAPTER {chapter.number}
                </motion.div>

                {/* Decorative horizontal line */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent mx-auto mt-6"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── CODENAME ── */}
          {(phase === 'codename' || phase === 'briefing' || phase === 'missions' || phase === 'ready') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-10 text-center"
            >
              <div className="text-green-400/30 text-[0.55rem] tracking-[0.3em] mb-2">
                CODENAME
              </div>
              <h2 className="text-green-300 text-2xl md:text-4xl font-bold tracking-[0.2em]">
                {chapter.codename.slice(0, codenameChars)}
                {codenameChars < chapter.codename.length && (
                  <span className="inline-block w-3 h-7 bg-green-400 ml-0.5 animate-blink align-text-bottom" />
                )}
              </h2>
              <div className="text-green-400/15 text-[0.5rem] tracking-[0.3em] mt-2">
                {chapter.estimatedDays.toUpperCase()} // {chapter.missionSlugs.length} MISSIONS
              </div>
            </motion.div>
          )}

          {/* ── BRIEFING TEXT ── */}
          {(phase === 'briefing' || phase === 'missions' || phase === 'ready') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-10"
            >
              <div className="text-green-400/30 text-[0.55rem] tracking-[0.3em] mb-4">
                SITUATION BRIEFING
              </div>
              <div className="border-l-2 border-green-500/20 pl-4">
                <div className="text-green-400/65 text-xs whitespace-pre-wrap leading-[1.8] font-mono">
                  {chapter.briefing.slice(0, briefingChars)}
                  {briefingChars < chapter.briefing.length && (
                    <span className="inline-block w-2 h-4 bg-green-400 ml-0.5 animate-blink align-text-bottom" />
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── INCOMING MISSIONS ── */}
          {(phase === 'missions' || phase === 'ready') && visibleMissions > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-10"
            >
              <div className="text-green-400/30 text-[0.55rem] tracking-[0.3em] mb-4 flex items-center gap-3">
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-green-400 text-[0.6rem]"
                >
                  &#9656;
                </motion.span>
                INCOMING MISSIONS
              </div>
              <div className="space-y-3">
                {chapterMissions.slice(0, visibleMissions).map((mission, i) => (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="border border-green-500/15 bg-green-400/[0.02] px-4 py-3 rounded-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-green-300 text-xs font-bold tracking-wider">
                        {mission.title}
                      </span>
                      <span
                        className={`
                          text-[0.55rem] tracking-wider font-bold
                          ${mission.difficulty === 'recruit'
                            ? 'text-green-400'
                            : mission.difficulty === 'operative'
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }
                        `}
                      >
                        {mission.difficulty.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-green-400/35 text-[0.6rem] leading-relaxed line-clamp-2">
                      {mission.description}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-green-400/20 text-[0.5rem] tracking-wider">
                        {mission.estimatedTime}
                      </span>
                      <span className="text-green-300/30 text-[0.5rem] font-bold tracking-wider">
                        +{mission.influenceReward} INFLUENCE
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── PROCEED BUTTON ── */}
          {phase === 'ready' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleProceed}
                className="relative px-12 py-4 border-2 border-green-400 text-green-400 font-bold text-sm tracking-[0.3em] hover:bg-green-400/10 transition-all group"
              >
                <span className="relative z-10">PROCEED</span>
                <div className="absolute inset-0 bg-green-400/5 group-hover:bg-green-400/10 transition-colors" />
                <motion.div
                  className="absolute inset-0 border border-green-400/30"
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>

              <span className="text-green-400/15 text-[0.5rem] tracking-[0.2em]">
                PRESS ESC TO CLOSE
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
