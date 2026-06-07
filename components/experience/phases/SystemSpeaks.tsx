'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { drone, impact, whoosh } from '@/lib/audio/procedural'

interface SystemSpeaksProps {
  onComplete: () => void
  hasInteracted: boolean
}

type StatementType = 'statement' | 'response' | 'conclusion' | 'defiance' | 'pause'

interface Statement {
  text: string
  type: StatementType
  delay: number
  duration: number
  flash?: boolean
  conclusionColor?: 'green' | 'red'
}

const statements: Statement[] = [
  { text: 'Every click.', type: 'statement', delay: 0, duration: 1600 },
  { text: 'Recorded.', type: 'response', delay: 250, duration: 1300 },
  { text: 'Every scroll.', type: 'statement', delay: 0, duration: 1600 },
  { text: 'Analyzed.', type: 'response', delay: 250, duration: 1300 },
  { text: 'Every hesitation.', type: 'statement', delay: 0, duration: 1600 },
  { text: 'Monetized.', type: 'response', delay: 250, duration: 1300, flash: true },
  { text: '', type: 'pause', delay: 0, duration: 800 },
  { text: 'They profit.', type: 'conclusion', delay: 0, duration: 2000, conclusionColor: 'green' },
  { text: 'You pay.', type: 'conclusion', delay: 400, duration: 2200, conclusionColor: 'red' },
  { text: '', type: 'pause', delay: 0, duration: 1200 },
  { text: 'Unless you fight back.', type: 'defiance', delay: 0, duration: 2800 },
]

export function SystemSpeaks({ onComplete, hasInteracted }: SystemSpeaksProps) {
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [showStatement, setShowStatement] = useState(false)
  const [screenFlash, setScreenFlash] = useState(false)
  const stopDroneRef = useRef<(() => void) | null>(null)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])
  const hasStartedRef = useRef(false)

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }, [])

  const addTimeout = useCallback((fn: () => void, ms: number): NodeJS.Timeout => {
    const id = setTimeout(fn, ms)
    timeoutsRef.current.push(id)
    return id
  }, [])

  useEffect(() => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true

    // Start the ambient drone — low, ominous, builds presence
    if (hasInteracted) {
      stopDroneRef.current = drone(45, 0.06) ?? null
    }

    const showNext = (index: number) => {
      if (index >= statements.length) {
        // Sequence complete — brief hold then advance
        addTimeout(() => {
          onComplete()
        }, 1000)
        return
      }

      const statement = statements[index]

      addTimeout(() => {
        setCurrentIndex(index)

        if (statement.type === 'pause') {
          // Silent beat — just wait then continue
          addTimeout(() => {
            showNext(index + 1)
          }, statement.duration)
          return
        }

        setShowStatement(true)

        // Fire sound effects
        if (hasInteracted) {
          if (statement.type === 'response') {
            impact()
          }
          if (statement.type === 'conclusion') {
            impact()
          }
          if (statement.type === 'defiance') {
            whoosh()
            // Fire a delayed impact for extra weight
            addTimeout(() => impact(), 200)
          }
        }

        // Screen flash on "Monetized."
        if (statement.flash) {
          setScreenFlash(true)
          addTimeout(() => setScreenFlash(false), 120)
        }

        // Hide after duration
        addTimeout(() => {
          setShowStatement(false)

          // Brief gap before next
          addTimeout(() => {
            showNext(index + 1)
          }, 350)
        }, statement.duration)
      }, statement.delay)
    }

    // Initial delay before the assault begins
    addTimeout(() => showNext(0), 600)

    return () => {
      clearAllTimeouts()
      hasStartedRef.current = false // Allow re-run on StrictMode remount
      if (stopDroneRef.current) {
        stopDroneRef.current()
        stopDroneRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Stop drone when component unmounts (safety)
  useEffect(() => {
    return () => {
      if (stopDroneRef.current) {
        stopDroneRef.current()
        stopDroneRef.current = null
      }
    }
  }, [])

  const current = currentIndex >= 0 ? statements[currentIndex] : null
  const type = current?.type ?? 'statement'

  // Background tint based on statement type
  const getBgGradient = () => {
    switch (type) {
      case 'statement':
        return 'radial-gradient(ellipse at center, rgba(0,40,0,0.25) 0%, rgba(0,0,0,1) 65%)'
      case 'response':
        return 'radial-gradient(ellipse at center, rgba(60,0,0,0.3) 0%, rgba(0,0,0,1) 65%)'
      case 'conclusion':
        return current?.conclusionColor === 'red'
          ? 'radial-gradient(ellipse at center, rgba(80,0,0,0.4) 0%, rgba(0,0,0,1) 60%)'
          : 'radial-gradient(ellipse at center, rgba(0,60,0,0.35) 0%, rgba(0,0,0,1) 60%)'
      case 'defiance':
        return 'radial-gradient(ellipse at center, rgba(0,80,20,0.35) 0%, rgba(0,0,0,1) 55%)'
      default:
        return 'radial-gradient(ellipse at center, rgba(0,20,0,0.15) 0%, rgba(0,0,0,1) 70%)'
    }
  }

  // Text color
  const getTextColor = () => {
    switch (type) {
      case 'statement':
        return '#22ff44'
      case 'response':
        return '#ff2222'
      case 'conclusion':
        return current?.conclusionColor === 'red' ? '#ff0000' : '#00ff00'
      case 'defiance':
        return '#00ff66'
      default:
        return '#22ff44'
    }
  }

  // Text shadow
  const getTextShadow = () => {
    const color = getTextColor()
    switch (type) {
      case 'conclusion':
        return `0 0 40px ${color}, 0 0 80px ${color}88, 0 0 120px ${color}44, 0 0 200px ${color}22`
      case 'defiance':
        return `0 0 30px ${color}, 0 0 60px ${color}aa, 0 0 100px ${color}55, 0 0 160px ${color}33`
      case 'response':
        return `0 0 25px ${color}cc, 0 0 50px ${color}66`
      default:
        return `0 0 20px ${color}88, 0 0 40px ${color}44`
    }
  }

  // Text size classes
  const getTextSizeClass = () => {
    switch (type) {
      case 'conclusion':
        return 'text-2xl md:text-4xl lg:text-7xl'
      case 'defiance':
        return 'text-2xl md:text-4xl lg:text-7xl'
      case 'response':
        return 'text-lg md:text-2xl lg:text-3xl'
      case 'statement':
        return 'text-2xl md:text-4xl lg:text-7xl'
      default:
        return 'text-2xl md:text-4xl lg:text-7xl'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Shifting background tint */}
      <motion.div
        className="fixed inset-0"
        animate={{ background: getBgGradient() }}
        transition={{ duration: 0.5 }}
      />

      {/* Slow pulsing underglow */}
      <motion.div
        className="fixed inset-0"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,255,0,0.03) 0%, transparent 60%)',
        }}
      />

      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background:
            'repeating-linear-gradient(0deg, rgba(0,255,0,0.015) 0px, rgba(0,255,0,0.015) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* Screen flash overlay */}
      <AnimatePresence>
        {screenFlash && (
          <motion.div
            key="flash"
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="fixed inset-0 z-50 bg-white"
          />
        )}
      </AnimatePresence>

      {/* Statement display */}
      <AnimatePresence mode="wait">
        {showStatement && current && current.text && (
          <motion.div
            key={currentIndex}
            initial={{
              opacity: 0,
              scale: type === 'conclusion' ? 0.7 : 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
            }}
            transition={{
              duration: type === 'conclusion' ? 0.35 : 0.25,
              ease: [0.16, 1, 0.3, 1], // spring-like ease
            }}
            className="text-center z-20 px-4 md:px-8 select-none"
          >
            <motion.span
              className={`font-mono tracking-wider font-bold block ${getTextSizeClass()}`}
              style={{
                color: getTextColor(),
                textShadow: getTextShadow(),
                lineHeight: 1.1,
              }}
              // Defiance gets a pulsing glow
              animate={
                type === 'defiance'
                  ? {
                      textShadow: [
                        getTextShadow(),
                        `0 0 50px #00ff6688, 0 0 100px #00ff66aa, 0 0 160px #00ff6666, 0 0 240px #00ff6644`,
                        getTextShadow(),
                      ],
                    }
                  : {}
              }
              transition={
                type === 'defiance'
                  ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                  : {}
              }
            >
              {current.text}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glitch overlay on response words */}
      <AnimatePresence>
        {showStatement && type === 'response' && (
          <motion.div
            key={`glitch-${currentIndex}`}
            className="fixed inset-0 z-15 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.08, 0, 0.04, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, repeat: 2 }}
          >
            <div className="absolute inset-0 bg-red-500/20" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heavy glitch overlay on conclusions */}
      <AnimatePresence>
        {showStatement && type === 'conclusion' && (
          <motion.div
            key={`conclusion-glitch-${currentIndex}`}
            className="fixed inset-0 z-15 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.12, 0, 0.06, 0, 0.1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, repeat: 2 }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  current?.conclusionColor === 'red'
                    ? 'rgba(255,0,0,0.15)'
                    : 'rgba(0,255,0,0.1)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ghost signature */}
      <motion.div
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 font-mono text-green-500/30 text-xs z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 2 }}
      >
        // GHOST
      </motion.div>

      {/* Corner decorations — hidden on mobile */}
      <div className="hidden md:block fixed top-4 left-4 font-mono text-green-500/20 text-xs z-20">
        ┌─ TRANSMISSION ─┐
      </div>
      <div className="hidden md:block fixed bottom-4 left-4 font-mono text-green-500/20 text-xs z-20">
        └─────────────────┘
      </div>
      <div className="hidden md:block fixed top-4 right-4 font-mono text-green-500/20 text-xs z-20">
        ┌─ ENCRYPTED ────┐
      </div>
      <div className="hidden md:block fixed bottom-4 right-4 font-mono text-green-500/20 text-xs z-20">
        └─────────────────┘
      </div>
    </motion.div>
  )
}
