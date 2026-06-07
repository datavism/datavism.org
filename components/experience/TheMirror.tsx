'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { SoundEngine } from '@/lib/audio/SoundEngine'
import { impact, bassDrop } from '@/lib/audio/procedural'
import { collectUserData, FALLBACK_USER_DATA, type UserData } from '@/lib/data/collect-user-data'

// ─── Types ──────────────────────────────────────────────────────────

type Beat = 'prompt' | 'reveal' | 'hook'

interface RevealItem {
  label: string
  value: string
  color: string
  glow?: string
  duration: number // ms before next item
  sound: 'impact' | 'bassDrop' | 'none'
  scale?: number // starting scale for spring animation
}

// ─── Component ──────────────────────────────────────────────────────

export function TheMirror() {
  const router = useRouter()
  const [beat, setBeat] = useState<Beat>('prompt')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [revealIndex, setRevealIndex] = useState(-1)
  const [revealItems, setRevealItems] = useState<RevealItem[]>([])
  const soundInitRef = useRef(false)
  const revealTimeouts = useRef<NodeJS.Timeout[]>([])

  // Collect user data on mount (before any interaction)
  useEffect(() => {
    collectUserData()
      .then(setUserData)
      .catch(() => setUserData(FALLBACK_USER_DATA))
  }, [])

  // Build reveal sequence when userData is ready
  useEffect(() => {
    if (!userData) return

    const items: RevealItem[] = [
      {
        label: 'YOUR LOCATION',
        value: userData.city,
        color: '#ffd600',
        glow: '0 0 40px rgba(255,214,0,0.4), 0 0 80px rgba(255,214,0,0.15)',
        duration: 1500,
        sound: 'impact',
        scale: 1.2,
      },
      {
        label: 'YOUR DEVICE',
        value: userData.device,
        color: '#ffffff',
        duration: 1500,
        sound: 'impact',
      },
      {
        label: 'YOUR BROWSER',
        value: userData.browser,
        color: '#ffffff',
        duration: 1500,
        sound: 'impact',
      },
      {
        label: 'YOUR OS',
        value: userData.os,
        color: '#ffffff',
        duration: 1500,
        sound: 'impact',
      },
      {
        label: 'YOUR SCREEN',
        value: `${userData.screenResolution} @${userData.pixelRatio}x`,
        color: '#ffffff',
        duration: 1500,
        sound: 'impact',
      },
      {
        label: 'YOUR FINGERPRINT',
        value: userData.fingerprint,
        color: '#ff1744',
        glow: '0 0 30px rgba(255,23,68,0.5), 0 0 60px rgba(255,23,68,0.2)',
        duration: 2000,
        sound: 'bassDrop',
        scale: 1.25,
      },
      {
        label: '',
        value: 'YOU ARE NOT ANONYMOUS.',
        color: '#ff1744',
        glow: '0 0 40px rgba(255,23,68,0.3)',
        duration: 2500,
        sound: 'none',
        scale: 1.1,
      },
    ]

    setRevealItems(items)
  }, [userData])

  // Run the reveal sequence
  const startReveal = useCallback(() => {
    if (revealItems.length === 0) return

    let elapsed = 0
    revealItems.forEach((item, index) => {
      const timeout = setTimeout(() => {
        setRevealIndex(index)

        // Play sound
        if (item.sound === 'impact') impact()
        else if (item.sound === 'bassDrop') bassDrop()
      }, elapsed)

      revealTimeouts.current.push(timeout)
      elapsed += item.duration
    })

    // After all reveals, transition to hook
    const hookTimeout = setTimeout(() => {
      setBeat('hook')
    }, elapsed + 500)
    revealTimeouts.current.push(hookTimeout)
  }, [revealItems])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      revealTimeouts.current.forEach(clearTimeout)
    }
  }, [])

  // Handle "Find out" click
  const handleFindOut = async () => {
    // Init AudioContext on user interaction
    if (!soundInitRef.current) {
      try {
        await SoundEngine.getInstance().init()
        soundInitRef.current = true
      } catch {
        // AudioContext blocked — sounds will be silent
      }
    }

    setBeat('reveal')
    // Small delay to let the transition start, then begin reveal
    setTimeout(startReveal, 300)
  }

  // Handle share
  const handleShare = () => {
    const shareText = `My internet fingerprint: ${userData?.fingerprint || 'GHOST-XXXX-XXXX'}. Want to know what they know about YOU? → datavism.org`

    if (navigator.share) {
      navigator.share({
        title: 'DATAVISM',
        text: shareText,
        url: 'https://datavism.org',
      }).catch(() => {
        // User cancelled or share failed — fall back to clipboard
        copyToClipboard(shareText)
      })
    } else {
      copyToClipboard(shareText)
    }
  }

  const [copied, setCopied] = useState(false)
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  // Current reveal item
  const currentItem = revealIndex >= 0 && revealIndex < revealItems.length
    ? revealItems[revealIndex]
    : null

  return (
    <div className="fixed inset-0 bg-black overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        {/* ─── BEAT 1: THE PROMPT ─── */}
        {beat === 'prompt' && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center text-center px-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-mono text-white text-2xl md:text-3xl font-light tracking-wide mb-12"
            >
              How private are you?
            </motion.h1>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              onClick={handleFindOut}
              className="font-mono text-lg md:text-xl px-10 py-4 bg-green-500 text-black font-semibold tracking-wider hover:bg-green-400 active:scale-95 transition-all"
              style={{
                boxShadow: '0 0 20px rgba(0,255,65,0.3), 0 0 40px rgba(0,255,65,0.1)',
              }}
            >
              Find out
            </motion.button>
          </motion.div>
        )}

        {/* ─── BEAT 2: THE REVEAL ─── */}
        {beat === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center w-full h-full px-6"
          >
            <AnimatePresence mode="wait">
              {currentItem && (
                <motion.div
                  key={revealIndex}
                  initial={{ opacity: 0, scale: currentItem.scale || 1.15 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    mass: 0.8,
                  }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Label */}
                  {currentItem.label && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      transition={{ delay: 0.05 }}
                      className="font-mono text-xs md:text-sm tracking-[0.3em] mb-3"
                      style={{ color: currentItem.color }}
                    >
                      {currentItem.label}
                    </motion.div>
                  )}

                  {/* Value */}
                  <div
                    className="font-mono text-3xl md:text-5xl lg:text-6xl font-bold tracking-wide leading-tight"
                    style={{
                      color: currentItem.color,
                      textShadow: currentItem.glow || 'none',
                    }}
                  >
                    {currentItem.value}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ─── BEAT 3: THE HOOK ─── */}
        {beat === 'hook' && (
          <motion.div
            key="hook"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center text-center px-6 max-w-lg"
          >
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-mono text-white text-xl md:text-2xl font-light tracking-wide mb-8"
            >
              They track. You fight back.
            </motion.div>

            {/* Liberation Code */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-10"
            >
              <div className="font-mono text-white/40 text-xs tracking-[0.2em] mb-2">
                YOUR LIBERATION CODE
              </div>
              <div
                className="font-mono text-green-400 text-xl md:text-2xl font-bold tracking-wider"
                style={{ textShadow: '0 0 15px rgba(0,255,65,0.4)' }}
              >
                {userData?.fingerprint || 'GHOST-XXXX-XXXX'}
              </div>
            </motion.div>

            {/* WAKE UP button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              onClick={() => router.push('/awaken')}
              className="font-mono text-lg md:text-xl px-12 py-4 bg-green-500 text-black font-bold tracking-[0.2em] hover:bg-green-400 active:scale-95 transition-all mb-6"
              style={{
                boxShadow: '0 0 20px rgba(0,255,65,0.3), 0 0 40px rgba(0,255,65,0.1)',
                animation: 'pulse-glow 2s ease-in-out infinite',
              }}
            >
              WAKE UP
            </motion.button>

            {/* Share button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              onClick={handleShare}
              className="font-mono text-sm text-white/50 hover:text-white/80 transition-colors tracking-wider py-2 px-4 border border-white/20 hover:border-white/40"
            >
              {copied ? 'COPIED' : 'SHARE'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse glow keyframes */}
      <style jsx global>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0,255,65,0.3), 0 0 40px rgba(0,255,65,0.1); }
          50% { box-shadow: 0 0 30px rgba(0,255,65,0.5), 0 0 60px rgba(0,255,65,0.2); }
        }
      `}</style>
    </div>
  )
}
