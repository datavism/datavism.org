'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { success } from '@/lib/audio/procedural'

// ─── Particle Burst Component ──────────────────────────────────────
// Green confetti-like particles that float upward on arrival

interface Particle {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
  drift: number
  opacity: number
}

function ParticleBurst({ count = 40 }: { count?: number }) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 80 + Math.random() * 30,
      size: 3 + Math.random() * 6,
      delay: Math.random() * 1.2,
      duration: 2 + Math.random() * 3,
      drift: (Math.random() - 0.5) * 60,
      opacity: 0.4 + Math.random() * 0.6,
    }))
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `rgba(${50 + Math.random() * 50}, ${180 + Math.random() * 75}, ${50 + Math.random() * 50}, ${p.opacity})`,
            boxShadow: `0 0 ${p.size * 2}px rgba(0,255,0,0.3)`,
          }}
          initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
          animate={{
            opacity: [0, p.opacity, p.opacity, 0],
            y: [0, -200 - Math.random() * 400],
            x: [0, p.drift],
            scale: [0, 1, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── Animated Counter Digit ────────────────────────────────────────

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const formatted = value.toLocaleString()
  const prevRef = useRef(formatted)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    if (prevRef.current !== formatted) {
      prevRef.current = formatted
      setFlash(true)
      const t = setTimeout(() => setFlash(false), 600)
      return () => clearTimeout(t)
    }
  }, [formatted])

  return (
    <motion.span
      className={className}
      animate={
        flash
          ? {
              scale: [1, 1.25, 1],
              textShadow: [
                '0 0 10px rgba(0,255,0,0.5)',
                '0 0 30px rgba(0,255,0,1)',
                '0 0 10px rgba(0,255,0,0.5)',
              ],
            }
          : {}
      }
      transition={{ duration: 0.6 }}
      style={{ display: 'inline-block' }}
    >
      {formatted}
    </motion.span>
  )
}

// ─── Share Button ──────────────────────────────────────────────────

function ShareButton({
  onClick,
  label,
  hoverBg,
  hoverBorder,
}: {
  onClick: () => void
  label: string
  hoverBg: string
  hoverBorder: string
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`
        font-mono text-base md:text-lg px-6 py-3 border-2 border-gray-600 text-gray-300
        transition-colors duration-200 tracking-wide min-h-[44px] min-w-[44px]
        ${hoverBg} ${hoverBorder} hover:text-white
      `}
    >
      {label}
    </motion.button>
  )
}

// ─── Main Component ────────────────────────────────────────────────

interface TheHookProps {
  fingerprint: string
  hasInteracted: boolean
}

export function TheHook({ fingerprint, hasInteracted }: TheHookProps) {
  const [awakened, setAwakened] = useState(2847)
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)
  const hasSounded = useRef(false)

  const shareText = `I've awakened. My liberation code: ${fingerprint}\n\nThey've been watching. Now I'm watching back.\n\n\u{1F441}\uFE0F https://datavism.org`

  // Triumphant success sound on mount
  useEffect(() => {
    if (!hasSounded.current) {
      hasSounded.current = true
      // Small delay so it plays after visual transition begins
      const t = setTimeout(() => success(), 300)
      return () => {
        clearTimeout(t)
        hasSounded.current = false // Allow re-run on StrictMode remount
      }
    }
  }, [])

  // Detect native Web Share API support
  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  // Simulate awakening counter incrementing
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setAwakened((prev) => prev + Math.floor(1 + Math.random() * 3))
      }
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  // Show share options after welcome
  useEffect(() => {
    const timer = setTimeout(() => setShowShare(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  // ─── Share handlers ────────────────────────────────────────────

  const handleNativeShare = useCallback(async () => {
    try {
      await navigator.share({
        title: 'DATAVISM — I\'ve Awakened',
        text: shareText,
        url: 'https://datavism.org',
      })
    } catch {
      // User cancelled or share failed — ignore
    }
  }, [shareText])

  const handleShare = useCallback(
    (platform: string) => {
      const encodedText = encodeURIComponent(shareText)
      const url = encodeURIComponent('https://datavism.org')

      const urls: Record<string, string> = {
        twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedText}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        reddit: `https://reddit.com/submit?url=${url}&title=${encodeURIComponent("I've awakened. " + fingerprint)}`,
        whatsapp: `https://wa.me/?text=${encodedText}`,
      }

      if (urls[platform]) {
        window.open(urls[platform], '_blank', 'width=600,height=400')
      }
    },
    [shareText, fingerprint]
  )

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [shareText])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="fixed inset-0 bg-black flex flex-col items-center justify-center px-4 py-8 overflow-y-auto"
    >
      {/* Particle burst celebration */}
      <ParticleBurst count={50} />

      {/* Success glow — breathing green radial */}
      <motion.div
        className="fixed inset-0"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          background: [
            'radial-gradient(ellipse at center, rgba(0,120,0,0.25) 0%, rgba(0,40,0,0.08) 40%, black 70%)',
            'radial-gradient(ellipse at center, rgba(0,180,0,0.2) 0%, rgba(0,60,0,0.06) 40%, black 70%)',
            'radial-gradient(ellipse at center, rgba(0,120,0,0.25) 0%, rgba(0,40,0,0.08) 40%, black 70%)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Subtle scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background:
            'repeating-linear-gradient(0deg, rgba(0,255,0,0.015) 0px, transparent 1px, transparent 3px)',
        }}
      />

      {/* Content container */}
      <div className="relative z-20 text-center max-w-2xl w-full">
        {/* Welcome message */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, type: 'spring', stiffness: 100 }}
          className="mb-10"
        >
          <motion.h1
            className="font-mono text-xl md:text-3xl lg:text-5xl font-bold text-green-400 mb-5 leading-tight"
            style={{ textShadow: '0 0 40px rgba(0,255,0,0.6), 0 0 80px rgba(0,255,0,0.2)' }}
            animate={{
              textShadow: [
                '0 0 40px rgba(0,255,0,0.6), 0 0 80px rgba(0,255,0,0.2)',
                '0 0 60px rgba(0,255,0,0.8), 0 0 100px rgba(0,255,0,0.3)',
                '0 0 40px rgba(0,255,0,0.6), 0 0 80px rgba(0,255,0,0.2)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            WELCOME TO THE RESISTANCE
          </motion.h1>
          <motion.p
            className="font-mono text-green-300/80 text-lg md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            You&apos;ve taken the first step.
          </motion.p>
        </motion.div>

        {/* Liberation Code — dramatic pulsing glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6, type: 'spring' }}
          className="mb-10"
        >
          <motion.div
            className="inline-block border-2 border-green-500 bg-black/90 px-4 md:px-10 py-6 md:py-8 relative w-full sm:w-auto"
            animate={{
              boxShadow: [
                '0 0 20px rgba(0,255,0,0.15), inset 0 0 20px rgba(0,255,0,0.05)',
                '0 0 40px rgba(0,255,0,0.35), inset 0 0 30px rgba(0,255,0,0.1)',
                '0 0 20px rgba(0,255,0,0.15), inset 0 0 20px rgba(0,255,0,0.05)',
              ],
              borderColor: [
                'rgba(34,197,94,0.7)',
                'rgba(34,197,94,1)',
                'rgba(34,197,94,0.7)',
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="font-mono text-green-400/60 text-sm mb-3 tracking-widest uppercase">
              Your Liberation Code
            </div>
            <motion.div
              className="font-mono text-xl md:text-3xl lg:text-5xl font-bold text-green-400 tracking-widest"
              animate={{
                textShadow: [
                  '0 0 15px rgba(0,255,0,0.5), 0 0 30px rgba(0,255,0,0.2)',
                  '0 0 25px rgba(0,255,0,0.8), 0 0 50px rgba(0,255,0,0.4)',
                  '0 0 15px rgba(0,255,0,0.5), 0 0 30px rgba(0,255,0,0.2)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {fingerprint}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Counter — animated with flash on increment */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mb-10 font-mono"
        >
          <div className="flex justify-center items-center gap-6 md:gap-10 text-lg">
            <div className="flex flex-col items-center">
              <AnimatedNumber
                value={awakened}
                className="text-green-400 font-bold text-xl md:text-3xl lg:text-5xl"
              />
              <span className="text-green-400/60 text-sm mt-1 tracking-wider">AWAKENED</span>
            </div>
            <div className="text-gray-700 text-2xl">|</div>
            <div className="flex flex-col items-center">
              <AnimatedNumber
                value={8000000000 - awakened}
                className="text-red-400/60 font-bold text-xl md:text-3xl lg:text-5xl"
              />
              <span className="text-red-400/40 text-sm mt-1 tracking-wider">SLEEPING</span>
            </div>
          </div>
        </motion.div>

        {/* Share section */}
        <AnimatePresence>
          {showShare && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <motion.div
                className="font-mono text-green-300 text-lg md:text-xl mb-6 font-bold"
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Wake others. Every share matters.
              </motion.div>

              {/* Native share button — primary on mobile */}
              {canNativeShare && (
                <motion.button
                  onClick={handleNativeShare}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    font-mono text-lg md:text-xl px-10 py-4 mb-6 block mx-auto
                    bg-green-500 text-black font-bold tracking-widest
                    border-2 border-green-400
                    transition-all duration-200 min-h-[56px] w-full sm:w-auto
                  "
                  style={{
                    boxShadow: '0 0 20px rgba(0,255,0,0.3), 0 0 40px rgba(0,255,0,0.1)',
                  }}
                >
                  SHARE
                </motion.button>
              )}

              {/* Social share buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 md:gap-4 mb-5 max-w-md mx-auto">
                <ShareButton
                  onClick={() => handleShare('twitter')}
                  label="X"
                  hoverBg="hover:bg-gray-800"
                  hoverBorder="hover:border-gray-400"
                />
                <ShareButton
                  onClick={() => handleShare('facebook')}
                  label="FB"
                  hoverBg="hover:bg-blue-900"
                  hoverBorder="hover:border-blue-500"
                />
                <ShareButton
                  onClick={() => handleShare('linkedin')}
                  label="IN"
                  hoverBg="hover:bg-blue-800"
                  hoverBorder="hover:border-blue-400"
                />
                <ShareButton
                  onClick={() => handleShare('reddit')}
                  label="RD"
                  hoverBg="hover:bg-orange-900"
                  hoverBorder="hover:border-orange-500"
                />
                <ShareButton
                  onClick={() => handleShare('whatsapp')}
                  label="WA"
                  hoverBg="hover:bg-green-800"
                  hoverBorder="hover:border-green-500"
                />
              </div>

              {/* Copy button */}
              <motion.button
                onClick={handleCopy}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  font-mono text-sm px-8 py-3 border-2 transition-all duration-200 min-h-[44px]
                  ${
                    copied
                      ? 'border-green-400 text-green-400 bg-green-400/10'
                      : 'border-gray-600 text-gray-400 hover:border-green-400 hover:text-green-400'
                  }
                `}
              >
                {copied ? '\u2713 COPIED' : 'COPY MESSAGE'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* JOIN THE MOVEMENT CTA */}
        <AnimatePresence>
          {showShare && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <motion.a
                href="/awaken"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="
                  inline-block font-mono text-lg md:text-xl lg:text-2xl text-yellow-400
                  border-2 border-yellow-400 px-6 md:px-10 py-4 md:py-5 font-bold tracking-wider
                  hover:bg-yellow-400 hover:text-black transition-colors duration-200
                  w-full sm:w-auto min-h-[56px] text-center
                "
                style={{
                  boxShadow: '0 0 20px rgba(234,179,8,0.2)',
                }}
              >
                JOIN THE MOVEMENT &rarr;
              </motion.a>

              <motion.p
                className="font-mono text-gray-500 text-sm mt-6 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 2 }}
              >
                Wield AI as your superpower. Fight back with data.
                <br />
                Turn awareness into action.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ghost signature */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 2 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 font-mono text-green-500/30 text-xs"
      >
        {'\u{1F47B}'} GHOST // datavism.org
      </motion.div>

      {/* Decorative corners */}
      <div className="fixed top-4 left-4 font-mono text-green-500/20 text-xs">
        {'\u250C\u2500'} AWAKENED {'\u2500\u2510'}
      </div>
      <div className="fixed top-4 right-4 font-mono text-green-500/20 text-xs">
        {'\u250C\u2500'} {fingerprint} {'\u2500\u2510'}
      </div>
    </motion.div>
  )
}
