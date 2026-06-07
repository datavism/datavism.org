'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { glitch, impact, staticBurst, alert, whoosh } from '@/lib/audio/procedural'

interface TheGlitchProps {
  onComplete: () => void
  hasInteracted: boolean
}

// ─── Screen tear data ────────────────────────────────────────────────
interface TearStrip {
  id: number
  top: number     // percentage
  height: number  // px
  offsetX: number // px displacement
  delay: number
}

function generateTears(count: number): TearStrip[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    height: 2 + Math.random() * 6,
    offsetX: (Math.random() > 0.5 ? 1 : -1) * (8 + Math.random() * 40),
    delay: Math.random() * 0.4,
  }))
}

// ─── Glitch text corpus ──────────────────────────────────────────────
const GLITCH_MESSAGES = [
  'ERR_FATAL',
  'BREACH',
  'SEGFAULT',
  'CORRUPTION',
  'OVERRIDE',
  '0xDEAD',
  'KERNEL PANIC',
  '████████',
  'ACCESS DENIED',
  'MEMORY FAULT',
  'DATA LEAK',
  'SYS_HALT',
]

// Characters for noise generation
const NOISE_CHARS = '█▓▒░■□▪▫●○◐◑◒◓▂▃▄▅▆▇'

export function TheGlitch({ onComplete, hasInteracted }: TheGlitchProps) {
  const [phase, setPhase] = useState<'blackout' | 'static' | 'breach' | 'scanning'>('blackout')
  const [glitchText, setGlitchText] = useState('')
  const [showScanlines, setShowScanlines] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [showWhiteFlash, setShowWhiteFlash] = useState(false)
  const [tearStrips, setTearStrips] = useState<TearStrip[]>([])

  // Refs to prevent stale closures in timers
  const phaseRef = useRef(phase)
  phaseRef.current = phase
  const tearIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ── Memoised noise blocks so they don't regenerate every render ──
  const noiseBlocks = useMemo(() => {
    return Array.from({ length: 60 }, () => {
      let row = ''
      for (let j = 0; j < 120; j++) {
        row += NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)]
        if (Math.random() > 0.92) row += '\n'
      }
      return row
    })
  }, [])

  // ── Regenerate screen tears periodically ───────────────────────────
  useEffect(() => {
    if (phase === 'static' || phase === 'breach') {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
      const baseCount = isMobile ? 4 : 8
      const breachCount = isMobile ? 6 : 12
      setTearStrips(generateTears(baseCount))
      tearIntervalRef.current = setInterval(() => {
        setTearStrips(generateTears(phase === 'breach' ? breachCount : baseCount))
      }, 200)
      return () => {
        if (tearIntervalRef.current) clearInterval(tearIntervalRef.current)
      }
    } else {
      setTearStrips([])
    }
  }, [phase])

  // ── Random glitch text flashes + sound ─────────────────────────────
  useEffect(() => {
    if (phase === 'static' || phase === 'breach') {
      const interval = setInterval(() => {
        if (Math.random() > 0.45) {
          const msg = GLITCH_MESSAGES[Math.floor(Math.random() * GLITCH_MESSAGES.length)]
          setGlitchText(msg)
          glitch()
          setTimeout(() => setGlitchText(''), 80 + Math.random() * 150)
        }
      }, 180)
      return () => clearInterval(interval)
    }
  }, [phase])

  // ── Phase progression — the backbone of the sequence ───────────────
  useEffect(() => {
    // Phase 0 → blackout (0-800ms): white flash then black
    // Immediate white flash to simulate CRT death
    setShowWhiteFlash(true)
    const flashOff = setTimeout(() => setShowWhiteFlash(false), 120)

    // Phase 1 → static (800ms): noise + RGB split + screen tears
    const timer1 = setTimeout(() => {
      setPhase('static')
      setShowScanlines(true)
      staticBurst(400)
    }, 800)

    // Extra glitch bursts during static
    const timer1b = setTimeout(() => staticBurst(150), 1200)
    const timer1c = setTimeout(() => { glitch(); staticBurst(200) }, 1600)

    // Phase 2 → breach (2200ms): SYSTEM BREACH DETECTED
    const timer2 = setTimeout(() => {
      setPhase('breach')
      impact()
      // Second delayed impact for gravity
      setTimeout(() => impact(), 300)
    }, 2200)

    // Phase 3 → scanning (4800ms): scan protocol
    const timer3 = setTimeout(() => {
      setPhase('scanning')
      alert()
    }, 4800)

    // Phase complete (7000ms): whoosh out
    const timer4 = setTimeout(() => {
      whoosh()
      onComplete()
    }, 7000)

    return () => {
      clearTimeout(flashOff)
      clearTimeout(timer1)
      clearTimeout(timer1b)
      clearTimeout(timer1c)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [onComplete])

  // ── Scanning progress bar ──────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'scanning') {
      setScanProgress(0)
      return
    }
    // Fill from 0→100% over ~2 seconds with stutters
    let raf: number
    const start = performance.now()
    const duration = 2000

    const tick = (now: number) => {
      const elapsed = now - start
      // Add micro-stutters: occasionally freeze the bar
      const stutter = Math.sin(elapsed * 0.05) > 0.7 ? 0 : 1
      const raw = Math.min((elapsed / duration) * 100, 100)
      const adjusted = Math.min(raw * stutter + (1 - stutter) * scanProgress, 100)
      setScanProgress(adjusted)
      if (elapsed < duration) {
        raf = requestAnimationFrame(tick)
      } else {
        setScanProgress(100)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Noise generator ────────────────────────────────────────────────
  const generateNoise = useCallback(() => {
    let result = ''
    for (let i = 0; i < 120; i++) {
      result += NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)]
      if (Math.random() > 0.9) result += '\n'
    }
    return result
  }, [])

  // ── Shake variants for framer-motion ───────────────────────────────
  const shakeViewport = {
    shake: {
      x: [0, -6, 7, -4, 5, -2, 3, 0],
      y: [0, 4, -5, 3, -4, 2, -1, 0],
      transition: {
        duration: 0.35,
        repeat: Infinity,
        repeatType: 'loop' as const,
      },
    },
    still: {
      x: 0,
      y: 0,
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        ...(phase === 'breach' ? shakeViewport.shake : shakeViewport.still),
      }}
      exit={{ opacity: 0 }}
      transition={
        phase === 'breach'
          ? shakeViewport.shake.transition
          : { duration: 0.15 }
      }
      className="fixed inset-0 bg-black overflow-hidden"
      style={{ zIndex: 9999 }}
    >
      {/* ── WHITE FLASH — simulates CRT power-off flash ─────────── */}
      <AnimatePresence>
        {showWhiteFlash && (
          <motion.div
            key="white-flash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="fixed inset-0 bg-white z-[100]"
          />
        )}
      </AnimatePresence>

      {/* ── SCANLINES ───────────────────────────────────────────── */}
      {showScanlines && (
        <div
          className="fixed inset-0 pointer-events-none z-[70]"
          style={{
            background:
              'repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 1px, transparent 1px, transparent 3px)',
            animation: 'scanline-crawl 8s linear infinite',
          }}
        />
      )}

      {/* ── SCREEN TEAR EFFECT — displaced horizontal strips ───── */}
      {tearStrips.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[60]">
          {tearStrips.map((tear) => (
            <motion.div
              key={tear.id}
              className="absolute left-0 right-0"
              style={{
                top: `${tear.top}%`,
                height: `${tear.height}px`,
                backdropFilter: 'invert(1) hue-rotate(180deg)',
                transform: `translateX(${tear.offsetX}px)`,
                background: `linear-gradient(90deg,
                  transparent 0%,
                  rgba(255,0,0,0.15) 10%,
                  rgba(0,255,0,0.1) 30%,
                  rgba(0,0,255,0.12) 60%,
                  transparent 100%)`,
                mixBlendMode: 'screen',
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.9, 0.6, 0.95, 0],
                x: [tear.offsetX, tear.offsetX * 1.5, tear.offsetX * 0.3, tear.offsetX * -0.5, 0],
              }}
              transition={{
                duration: 0.15 + Math.random() * 0.15,
                repeat: Infinity,
                delay: tear.delay,
                repeatDelay: 0.1 + Math.random() * 0.3,
              }}
            />
          ))}
        </div>
      )}

      {/* ── STATIC NOISE — chaotic character matrix ────────────── */}
      <AnimatePresence>
        {(phase === 'static' || phase === 'breach') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.5, 0.15, 0.45, 0.3] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.08, repeat: Infinity }}
            className="fixed inset-0 z-[10] font-mono text-green-500/30 text-xs leading-none overflow-hidden whitespace-pre"
            style={{ wordBreak: 'break-all' }}
          >
            {noiseBlocks.map((block, i) => (
              <div key={i} style={{ opacity: 0.3 + Math.random() * 0.7 }}>
                {block}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RGB SPLIT — chromatic aberration ────────────────────── */}
      {(phase === 'static' || phase === 'breach') && (
        <>
          <motion.div
            className="fixed inset-0 z-[20] bg-red-500 mix-blend-screen"
            animate={{
              x: phase === 'breach' ? [-4, 6, -3, 5, -2, 4, 0] : [-2, 2, -1, 1, 0],
              y: phase === 'breach' ? [1, -2, 1, -1, 0] : [0, 0, 0, 0, 0],
              opacity: phase === 'breach'
                ? [0.15, 0.25, 0.1, 0.2, 0.15]
                : [0.08, 0.15, 0.08, 0.12, 0.08],
            }}
            transition={{ duration: 0.12, repeat: Infinity }}
          />
          <motion.div
            className="fixed inset-0 z-[20] bg-cyan-400 mix-blend-screen"
            animate={{
              x: phase === 'breach' ? [4, -6, 3, -5, 2, -4, 0] : [2, -2, 1, -1, 0],
              y: phase === 'breach' ? [-1, 2, -1, 1, 0] : [0, 0, 0, 0, 0],
              opacity: phase === 'breach'
                ? [0.12, 0.2, 0.08, 0.18, 0.12]
                : [0.06, 0.12, 0.06, 0.1, 0.06],
            }}
            transition={{ duration: 0.12, repeat: Infinity }}
          />
        </>
      )}

      {/* ── CRT FLICKER — subtle white strobes ─────────────────── */}
      {phase !== 'blackout' && (
        <motion.div
          className="fixed inset-0 z-[25] bg-white pointer-events-none"
          animate={{
            opacity: [0, 0.06, 0, 0.03, 0, 0.1, 0, 0, 0.04, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      )}

      {/* ── GLITCH TEXT FLASHES — random words that punch in ──── */}
      <AnimatePresence>
        {glitchText && (
          <motion.div
            key={glitchText + Date.now()}
            initial={{ opacity: 0, scale: 2.5, rotate: Math.random() * 6 - 3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.06 }}
            className="fixed inset-0 z-[40] flex items-center justify-center pointer-events-none"
            style={{
              // Randomly offset from center for chaos
              paddingLeft: `${Math.random() * 30 - 15}%`,
              paddingTop: `${Math.random() * 30 - 15}%`,
            }}
          >
            <span
              className="font-mono text-xl md:text-3xl lg:text-5xl font-black select-none"
              style={{
                color: Math.random() > 0.5 ? '#ff0033' : '#00ff41',
                textShadow: `
                  ${Math.random() * 12 - 6}px ${Math.random() * 8 - 4}px 0 #ff0033,
                  ${Math.random() * 12 - 6}px ${Math.random() * 8 - 4}px 0 #00ff41,
                  ${Math.random() * 12 - 6}px ${Math.random() * 8 - 4}px 0 #0066ff,
                  0 0 20px rgba(255,0,0,0.5)
                `,
                transform: `skewX(${Math.random() * 14 - 7}deg)`,
                letterSpacing: `${Math.random() * 8}px`,
              }}
            >
              {glitchText}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BREACH DETECTED — the dramatic centrepiece ──────────── */}
      <AnimatePresence>
        {phase === 'breach' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.08 }}
            className="fixed inset-0 z-[50] flex flex-col items-center justify-center"
          >
            {/* Pulsing red vignette behind the text */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(ellipse at center, rgba(255,0,0,0.15) 0%, transparent 70%)',
                  'radial-gradient(ellipse at center, rgba(255,0,0,0.25) 0%, transparent 60%)',
                  'radial-gradient(ellipse at center, rgba(255,0,0,0.1) 0%, transparent 75%)',
                ],
              }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />

            <motion.div
              animate={{
                x: [0, -8, 10, -6, 7, -3, 4, 0],
                y: [0, 3, -4, 2, -3, 1, -1, 0],
                skewX: [0, -2, 3, -1, 2, 0],
              }}
              transition={{ duration: 0.25, repeat: Infinity }}
            >
              {/* Triple-layered text for heavy glitch */}
              <div className="relative">
                {/* Red ghost (offset left) */}
                <motion.div
                  className="absolute inset-0 text-red-600 font-mono text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-black tracking-wider text-center select-none"
                  animate={{
                    x: [-3, 4, -2, 3, -1],
                    opacity: [0.6, 0.8, 0.5, 0.7, 0.6],
                  }}
                  transition={{ duration: 0.12, repeat: Infinity }}
                  aria-hidden
                >
                  SYSTEM BREACH
                  <br />
                  DETECTED
                </motion.div>

                {/* Cyan ghost (offset right) */}
                <motion.div
                  className="absolute inset-0 text-cyan-500 font-mono text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-black tracking-wider text-center select-none"
                  animate={{
                    x: [3, -4, 2, -3, 1],
                    opacity: [0.4, 0.6, 0.35, 0.55, 0.4],
                  }}
                  transition={{ duration: 0.12, repeat: Infinity }}
                  aria-hidden
                >
                  SYSTEM BREACH
                  <br />
                  DETECTED
                </motion.div>

                {/* Primary text */}
                <div
                  className="relative text-red-500 font-mono text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-black tracking-wider text-center select-none"
                  style={{
                    textShadow: `
                      0 0 10px rgba(255,0,0,0.8),
                      0 0 40px rgba(255,0,0,0.4),
                      0 0 80px rgba(255,0,0,0.2)
                    `,
                  }}
                >
                  SYSTEM BREACH
                  <br />
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1, 0.7, 1] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                  >
                    DETECTED
                  </motion.span>
                </div>
              </div>
            </motion.div>

            {/* Horizontal glitch bar under the text */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '60%', opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.8, opacity: { duration: 0.3, repeat: Infinity } }}
              className="h-[2px] bg-red-500 mt-6 max-w-lg"
              style={{
                boxShadow: '0 0 12px rgba(255,0,0,0.6), 0 0 30px rgba(255,0,0,0.3)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SCANNING PHASE — probe-like progress ───────────────── */}
      <AnimatePresence>
        {phase === 'scanning' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[50] flex flex-col items-center justify-center px-6"
          >
            {/* Scan header */}
            <motion.div
              animate={{ opacity: [1, 0.4, 1, 0.6, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              <div
                className="text-green-400 font-mono text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold tracking-[0.2em] md:tracking-[0.3em] mb-8 text-center select-none"
                style={{
                  textShadow: '0 0 8px rgba(0,255,65,0.6), 0 0 25px rgba(0,255,65,0.3)',
                }}
              >
                INITIATING SCAN PROTOCOL
              </div>
            </motion.div>

            {/* Progress bar container */}
            <div className="w-full max-w-md mb-6">
              <div
                className="relative h-[6px] bg-green-900/40 overflow-hidden"
                style={{
                  border: '1px solid rgba(0,255,65,0.3)',
                }}
              >
                {/* Fill bar */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-green-500"
                  style={{
                    width: `${scanProgress}%`,
                    boxShadow: '0 0 10px rgba(0,255,65,0.6), 0 0 25px rgba(0,255,65,0.3)',
                  }}
                />

                {/* Scan-head glow at the leading edge */}
                <motion.div
                  className="absolute top-0 bottom-0 w-6"
                  style={{
                    left: `calc(${scanProgress}% - 12px)`,
                    background: 'radial-gradient(ellipse at center, rgba(0,255,65,0.8) 0%, transparent 70%)',
                  }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.2, repeat: Infinity }}
                />
              </div>

              {/* Percentage readout */}
              <div className="flex justify-between mt-2 font-mono text-xs text-green-500/70">
                <span>PROBING TARGET</span>
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                >
                  {Math.floor(scanProgress)}%
                </motion.span>
              </div>
            </div>

            {/* Data readout lines — scroll of fake diagnostics */}
            <div className="w-full max-w-md h-20 overflow-hidden font-mono text-xs text-green-600/60 leading-relaxed">
              {[
                '> net.probe.init(target=USER, depth=FULL)',
                '> fingerprint.browser :: MATCH',
                '> geo.resolve :: TRIANGULATING...',
                '> cookies.harvest :: 847 entries found',
                '> shadow_profile.construct :: IN PROGRESS',
                '> data_broker.query :: 23 records matched',
                '> behavioral.model :: BUILDING...',
              ].map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 0.7, x: 0 }}
                  transition={{ delay: i * 0.25, duration: 0.15 }}
                >
                  {line}
                </motion.div>
              ))}
            </div>

            {/* Pulsing dots */}
            <div className="flex gap-1.5 mt-4">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-green-500"
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.08,
                  }}
                  style={{
                    boxShadow: '0 0 4px rgba(0,255,65,0.5)',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HORIZONTAL GLITCH BARS — fast sweeping lines ────────── */}
      {(phase === 'static' || phase === 'breach') && (
        <>
          {Array.from({ length: 7 }, (_, i) => {
            const yPos = 5 + (i * 14) + Math.random() * 5
            return (
              <motion.div
                key={`hbar-${i}`}
                className="fixed left-0 right-0 z-[35]"
                style={{
                  top: `${yPos}%`,
                  height: `${1 + Math.random() * 3}px`,
                  background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,${0.15 + Math.random() * 0.2}) 20%, rgba(0,255,0,0.08) 60%, transparent 100%)`,
                }}
                animate={{
                  x: ['-110%', '110%'],
                  opacity: [0, 0.7, 0],
                }}
                transition={{
                  duration: 0.2 + Math.random() * 0.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  repeatDelay: 0.3 + Math.random() * 1.5,
                }}
              />
            )
          })}
        </>
      )}

      {/* ── EDGE VIGNETTE — CRT curvature feel ─────────────────── */}
      <div
        className="fixed inset-0 z-[45] pointer-events-none"
        style={{
          boxShadow: `
            inset 0 0 120px rgba(0,0,0,0.8),
            inset 0 0 60px rgba(0,255,0,0.05),
            inset 0 0 30px rgba(255,0,0,0.05)
          `,
        }}
      />

      {/* ── INLINE KEYFRAMES ───────────────────────────────────── */}
      <style jsx global>{`
        @keyframes scanline-crawl {
          0% { background-position: 0 0; }
          100% { background-position: 0 100vh; }
        }
      `}</style>
    </motion.div>
  )
}
