'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { impact, drone, success, alert } from '@/lib/audio/procedural'

interface TheChoiceProps {
  onWakeUp: () => void
  onSleep: () => void
  hasInteracted: boolean
}

// ─── Ember Particle Component ──────────────────────────────────────
function EmberParticle({ index, originX, originY }: { index: number; originX: number; originY: number }) {
  const size = useMemo(() => 2 + Math.random() * 4, [])
  const xDrift = useMemo(() => (Math.random() - 0.5) * 120, [])
  const delay = useMemo(() => Math.random() * 2, [])
  const duration = useMemo(() => 2 + Math.random() * 2, [])
  const startX = useMemo(() => originX + (Math.random() - 0.5) * 160, [originX])

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: startX,
        top: originY,
        background: `radial-gradient(circle, rgba(0,255,100,0.9) 0%, rgba(0,255,0,0.4) 60%, transparent 100%)`,
        boxShadow: `0 0 ${size * 2}px rgba(0,255,0,0.6)`,
      }}
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 0.8, 0.6, 0],
        y: [0, -80, -180, -280],
        x: [0, xDrift * 0.3, xDrift * 0.7, xDrift],
        scale: [0.5, 1, 0.8, 0.2],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  )
}

// ─── Background Grid Particle ──────────────────────────────────────
function GridParticle({ index }: { index: number }) {
  const startX = useMemo(() => Math.random() * 100, [])
  const startY = useMemo(() => Math.random() * 100, [])
  const duration = useMemo(() => 15 + Math.random() * 20, [])
  const size = useMemo(() => 1 + Math.random() * 2, [])
  const delay = useMemo(() => Math.random() * 10, [])

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${startX}%`,
        top: `${startY}%`,
        background: 'rgba(0,255,0,0.15)',
        boxShadow: '0 0 4px rgba(0,255,0,0.1)',
      }}
      animate={{
        y: [0, -30, 10, -20, 0],
        x: [0, 15, -10, 20, 0],
        opacity: [0.1, 0.4, 0.2, 0.5, 0.1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
}

// ─── Moving Grid Lines ─────────────────────────────────────────────
function MovingGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Horizontal moving lines */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute left-0 right-0"
          style={{
            height: '1px',
            top: `${15 + i * 18}%`,
            background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,0,0.04) 20%, rgba(0,255,0,0.06) 50%, rgba(0,255,0,0.04) 80%, transparent 100%)',
          }}
          animate={{
            y: [0, 20, -10, 0],
            opacity: [0.3, 0.6, 0.4, 0.3],
          }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* Vertical moving lines */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute top-0 bottom-0"
          style={{
            width: '1px',
            left: `${20 + i * 20}%`,
            background: 'linear-gradient(180deg, transparent 0%, rgba(0,255,0,0.03) 30%, rgba(0,255,0,0.05) 50%, rgba(0,255,0,0.03) 70%, transparent 100%)',
          }}
          animate={{
            x: [0, 15, -8, 0],
            opacity: [0.2, 0.5, 0.3, 0.2],
          }}
          transition={{
            duration: 18 + i * 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────
export function TheChoice({ onWakeUp, onSleep, hasInteracted }: TheChoiceProps) {
  const [showButtons, setShowButtons] = useState(false)
  const [hoveredButton, setHoveredButton] = useState<'wake' | 'sleep' | null>(null)
  const [countdown, setCountdown] = useState(60)
  const [countdownActive, setCountdownActive] = useState(false)
  const stopDroneRef = useRef<(() => void) | null>(null)
  const wakeButtonRef = useRef<HTMLDivElement>(null)
  const hasPlayedImpact = useRef(false)
  const hoverSoundPlayed = useRef(false)

  // Start ambient drone on mount
  useEffect(() => {
    if (hasInteracted) {
      const stop = drone(42, 0.06)
      stopDroneRef.current = stop
    }
    return () => {
      stopDroneRef.current?.()
    }
  }, [hasInteracted])

  // Show buttons after intro text
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true)
      setCountdownActive(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  // Play impact sound when buttons appear
  useEffect(() => {
    if (showButtons && !hasPlayedImpact.current && hasInteracted) {
      hasPlayedImpact.current = true
      impact()
    }
  }, [showButtons, hasInteracted])

  // Self-destruct countdown
  useEffect(() => {
    if (!countdownActive || countdown <= 0) return

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          // Auto-advance to WAKE UP when timer hits zero
          onWakeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [countdownActive, countdown, onWakeUp])

  // Handle WAKE UP hover with rising tone
  const handleWakeHover = useCallback(() => {
    setHoveredButton('wake')
    if (!hoverSoundPlayed.current && hasInteracted) {
      hoverSoundPlayed.current = true
      alert()
    }
  }, [hasInteracted])

  const handleWakeLeave = useCallback(() => {
    setHoveredButton(null)
    hoverSoundPlayed.current = false
  }, [])

  // Handle WAKE UP click
  const handleWakeUp = useCallback(() => {
    if (hasInteracted) {
      success()
    }
    // Brief delay to let the sound play
    setTimeout(onWakeUp, 300)
  }, [onWakeUp, hasInteracted])

  // Handle sleep click
  const handleSleep = useCallback(() => {
    onSleep()
  }, [onSleep])

  // Get button center position for embers
  const emberOriginX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500
  const emberOriginY = typeof window !== 'undefined' ? window.innerHeight / 2 + 40 : 400

  // Format countdown
  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex flex-col items-center justify-center px-4"
    >
      {/* Deep background pulse */}
      <motion.div
        className="fixed inset-0"
        animate={{
          background: [
            'radial-gradient(ellipse at center, rgba(0,80,0,0.12) 0%, rgba(0,30,0,0.05) 30%, black 60%)',
            'radial-gradient(ellipse at center, rgba(0,50,0,0.18) 0%, rgba(0,20,0,0.08) 30%, black 60%)',
            'radial-gradient(ellipse at center, rgba(0,80,0,0.12) 0%, rgba(0,30,0,0.05) 30%, black 60%)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Moving grid lines */}
      <MovingGrid />

      {/* Background floating particles — reduced on mobile */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(typeof window !== 'undefined' && window.innerWidth < 640 ? 12 : 30)].map((_, i) => (
          <GridParticle key={`grid-${i}`} index={i} />
        ))}
      </div>

      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,255,0,0.015) 0px, transparent 1px, transparent 3px)',
        }}
      />

      {/* Ember particles rising from WAKE UP button area */}
      {showButtons && (
        <div className="fixed inset-0 pointer-events-none z-30">
          {[...Array(20)].map((_, i) => (
            <EmberParticle
              key={`ember-${i}`}
              index={i}
              originX={emberOriginX}
              originY={emberOriginY}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-20 text-center max-w-2xl">
        {/* Intro text sequence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-4"
        >
          <span className="font-mono text-green-400 text-lg md:text-xl lg:text-2xl">
            But you&apos;re still here.
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mb-12"
        >
          <span className="font-mono text-green-300 text-xl md:text-2xl lg:text-3xl">
            That means you&apos;re{' '}
            <motion.span
              className="text-yellow-400 font-bold"
              animate={{
                textShadow: [
                  '0 0 10px rgba(255,200,0,0.3)',
                  '0 0 20px rgba(255,200,0,0.6)',
                  '0 0 10px rgba(255,200,0,0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ready
            </motion.span>
            .
          </span>
        </motion.div>

        {/* The Choice buttons */}
        <AnimatePresence>
          {showButtons && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 150, damping: 15 }}
              className="flex flex-col sm:flex-row gap-8 justify-center items-center"
            >
              {/* WAKE UP button */}
              <motion.button
                onClick={handleWakeUp}
                onMouseEnter={handleWakeHover}
                onMouseLeave={handleWakeLeave}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="relative group cursor-pointer"
              >
                {/* Outer pulse ring */}
                <motion.div
                  className="absolute -inset-3 rounded-sm pointer-events-none"
                  style={{
                    border: '1px solid rgba(0,255,0,0.2)',
                  }}
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Second outer pulse ring — offset timing */}
                <motion.div
                  className="absolute -inset-6 rounded-sm pointer-events-none"
                  style={{
                    border: '1px solid rgba(0,255,0,0.1)',
                  }}
                  animate={{
                    opacity: [0.1, 0.4, 0.1],
                    scale: [1, 1.03, 1],
                  }}
                  transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                />

                <div
                  ref={wakeButtonRef}
                  className={`
                    relative px-10 sm:px-14 py-5 sm:py-7 font-mono text-lg md:text-2xl font-bold tracking-[0.2em]
                    border-2 transition-colors duration-300 w-full sm:w-auto min-h-[56px]
                    ${hoveredButton === 'wake'
                      ? 'bg-green-500 text-black border-green-300'
                      : 'bg-green-500/10 text-green-400 border-green-500'
                    }
                  `}
                  style={{
                    boxShadow: hoveredButton === 'wake'
                      ? '0 0 60px rgba(0,255,0,0.6), 0 0 120px rgba(0,255,0,0.3), inset 0 0 30px rgba(0,255,0,0.2)'
                      : '0 0 20px rgba(0,255,0,0.3), 0 0 40px rgba(0,255,0,0.1)',
                  }}
                >
                  {/* Breathing glow behind text */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(0,255,0,0.15) 0%, transparent 70%)',
                    }}
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  <span className="relative z-10">WAKE UP</span>
                </div>

                {/* Glitch layers on hover */}
                {hoveredButton === 'wake' && (
                  <>
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: 'rgba(0,255,0,0.15)' }}
                      animate={{ x: [-3, 3, -2, 2, 0], opacity: [0.5, 0.2, 0.4, 0.3, 0] }}
                      transition={{ duration: 0.15, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: 'rgba(0,255,200,0.1)' }}
                      animate={{ x: [3, -3, 1, -1, 0], opacity: [0.3, 0.5, 0.2, 0.4, 0] }}
                      transition={{ duration: 0.15, repeat: Infinity }}
                    />
                  </>
                )}

                {/* Persistent pulsing glow animation */}
                <motion.div
                  className="absolute -inset-1 pointer-events-none"
                  animate={{
                    boxShadow: [
                      '0 0 15px rgba(0,255,0,0.2)',
                      '0 0 30px rgba(0,255,0,0.4)',
                      '0 0 15px rgba(0,255,0,0.2)',
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.button>

              {/* Separator */}
              <motion.span
                className="font-mono text-gray-700 text-sm"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                or
              </motion.span>

              {/* GO BACK TO SLEEP button — deliberately boring and dead */}
              <motion.button
                onClick={handleSleep}
                onMouseEnter={() => setHoveredButton('sleep')}
                onMouseLeave={() => setHoveredButton(null)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`
                  px-6 py-3 font-mono text-xs tracking-wide
                  border transition-all duration-500 cursor-pointer w-full sm:w-auto min-h-[56px]
                  ${hoveredButton === 'sleep'
                    ? 'bg-gray-900 text-gray-500 border-gray-600'
                    : 'bg-transparent text-gray-700 border-gray-800'
                  }
                `}
                style={{
                  opacity: hoveredButton === 'sleep' ? 0.7 : 0.4,
                }}
              >
                go back to sleep
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover hints */}
        {showButtons && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-10 font-mono text-xs h-6"
          >
            <AnimatePresence mode="wait">
              {hoveredButton === 'sleep' && (
                <motion.span
                  key="sleep-hint"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-red-400/60"
                >
                  Really? After everything you&apos;ve seen?
                </motion.span>
              )}
              {hoveredButton === 'wake' && (
                <motion.span
                  key="wake-hint"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 0.6, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-green-400/70"
                >
                  The resistance needs you.
                </motion.span>
              )}
              {!hoveredButton && (
                <motion.span
                  key="default-hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  className="text-gray-600"
                >
                  Choose wisely.
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Self-destruct countdown timer */}
        {showButtons && countdownActive && countdown > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-8"
          >
            <motion.div
              className="font-mono text-xs"
              animate={{
                color: countdown <= 10
                  ? ['rgba(255,80,80,0.6)', 'rgba(255,80,80,0.9)', 'rgba(255,80,80,0.6)']
                  : 'rgba(0,255,0,0.3)',
              }}
              transition={countdown <= 10 ? { duration: 0.8, repeat: Infinity } : {}}
            >
              <span className="text-gray-600">This signal will expire in </span>
              <motion.span
                className="tabular-nums"
                style={{
                  color: countdown <= 10 ? 'rgba(255,80,80,0.8)' : 'rgba(0,255,0,0.5)',
                  textShadow: countdown <= 10 ? '0 0 8px rgba(255,0,0,0.3)' : 'none',
                }}
              >
                {formatCountdown(countdown)}
              </motion.span>
            </motion.div>

            {/* Countdown progress bar */}
            <div className="mt-2 mx-auto w-48 h-px bg-gray-800 overflow-hidden">
              <motion.div
                className="h-full"
                style={{
                  background: countdown <= 10
                    ? 'rgba(255,80,80,0.5)'
                    : 'rgba(0,255,0,0.3)',
                  width: `${(countdown / 60) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Corner decorations — hidden on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="hidden md:block fixed top-8 left-8 font-mono text-green-500/20 text-xs"
      >
        <motion.span
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          ┌─ DECISION POINT ─┐
        </motion.span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="hidden md:block fixed bottom-8 right-8 font-mono text-green-500/20 text-xs"
      >
        <motion.span
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        >
          └─── GHOST ────────┘
        </motion.span>
      </motion.div>

      {/* Phase indicator — top right, hidden on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 1 }}
        className="hidden md:block fixed top-8 right-8 font-mono text-green-500 text-xs"
      >
        PHASE 5/6
      </motion.div>
    </motion.div>
  )
}
