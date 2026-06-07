'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { corporateMuzak, staticBurst, glitch } from '@/lib/audio/procedural'

interface FalseComfortProps {
  onComplete: () => void
  hasInteracted: boolean
}

// Peripheral tracking notifications — ironic foreshadowing
const TRACKING_NOTIFICATIONS = [
  'Location accessed',
  'Cookies loaded: 47',
  'Session fingerprint: generating...',
  'Ad profile: building...',
  'Browser history: indexed',
  'Device ID: captured',
  'Scroll behavior: recording...',
  'Canvas fingerprint: hashed',
  'WebRTC leak: detected',
  'Third-party trackers: 138 active',
  'Keystroke cadence: profiling...',
  'Screen resolution: logged',
  'Font enumeration: complete',
  'Battery level: accessed',
  'Network type: stored',
]

// Positions for tracking notifications around the edges
type EdgePosition = {
  top?: string
  bottom?: string
  left?: string
  right?: string
  textAlign: 'left' | 'right'
}

const EDGE_POSITIONS: EdgePosition[] = [
  { top: '8%', left: '3%', textAlign: 'left' },
  { top: '15%', right: '3%', textAlign: 'right' },
  { top: '25%', left: '2%', textAlign: 'left' },
  { bottom: '30%', right: '4%', textAlign: 'right' },
  { bottom: '20%', left: '3%', textAlign: 'left' },
  { top: '40%', right: '2%', textAlign: 'right' },
  { bottom: '12%', right: '3%', textAlign: 'right' },
  { top: '60%', left: '2%', textAlign: 'left' },
  { bottom: '40%', left: '4%', textAlign: 'left' },
  { top: '75%', right: '3%', textAlign: 'right' },
]

export function FalseComfort({ onComplete, hasInteracted }: FalseComfortProps) {
  const [progress, setProgress] = useState(0)
  const [showGlitch, setShowGlitch] = useState(false)
  const [cookieDismissed, setCookieDismissed] = useState(false)
  const [whiteFlash, setWhiteFlash] = useState(false)
  const [activeNotifications, setActiveNotifications] = useState<
    { id: number; text: string; position: EdgePosition }[]
  >([])
  const notificationCounter = useRef(0)
  const stopMuzakRef = useRef<(() => void) | null>(null)
  const muzakStartedRef = useRef(false)

  // Start corporate muzak when user has interacted
  useEffect(() => {
    if (hasInteracted && !muzakStartedRef.current) {
      muzakStartedRef.current = true
      const stop = corporateMuzak()
      stopMuzakRef.current = stop
    }

    return () => {
      if (stopMuzakRef.current) {
        stopMuzakRef.current()
        stopMuzakRef.current = null
      }
    }
  }, [hasInteracted])

  // Progress bar fills over ~7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Slightly slower progression for the longer duration
        return prev + 1.5
      })
    }, 100)

    // After ~6.5 seconds, trigger the exit sequence
    const timer = setTimeout(() => {
      // Stop muzak with a glitch
      if (stopMuzakRef.current) {
        stopMuzakRef.current()
        stopMuzakRef.current = null
      }
      glitch()

      // White flash before transition
      setWhiteFlash(true)
      setTimeout(() => {
        onComplete()
      }, 500)
    }, 6500)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [onComplete])

  // Peripheral tracking notifications — increase frequency with progress
  useEffect(() => {
    // Don't start notifications until some progress
    if (progress < 10) return

    // Interval decreases as progress increases (more frequent at the end)
    const baseInterval = progress < 40 ? 2200 : progress < 70 ? 1200 : 600
    const interval = setInterval(() => {
      const text =
        TRACKING_NOTIFICATIONS[
          Math.floor(Math.random() * TRACKING_NOTIFICATIONS.length)
        ]
      const position =
        EDGE_POSITIONS[Math.floor(Math.random() * EDGE_POSITIONS.length)]
      const id = notificationCounter.current++

      setActiveNotifications(prev => [...prev, { id, text, position }])

      // Remove after a delay
      setTimeout(() => {
        setActiveNotifications(prev => prev.filter(n => n.id !== id))
      }, 1800)
    }, baseInterval)

    return () => clearInterval(interval)
  }, [progress < 10 ? 0 : progress < 40 ? 1 : progress < 70 ? 2 : 3])

  // Subtle random glitches that increase as we approach the crash
  useEffect(() => {
    if (progress > 60) {
      const glitchInterval = setInterval(() => {
        const threshold = progress > 85 ? 0.5 : 0.7
        if (Math.random() > threshold) {
          setShowGlitch(true)
          // Play static burst for audio glitches past 75%
          if (progress > 75) {
            staticBurst(50 + Math.random() * 100)
          }
          setTimeout(() => setShowGlitch(false), 50 + Math.random() * 100)
        }
      }, 200)
      return () => clearInterval(glitchInterval)
    }
  }, [progress > 60 ? (progress > 75 ? (progress > 85 ? 3 : 2) : 1) : 0])

  // Distort muzak progressively via static overlays
  useEffect(() => {
    if (progress > 50 && progress < 100 && hasInteracted) {
      const distortInterval = setInterval(() => {
        if (Math.random() > 0.6) {
          staticBurst(30 + Math.random() * 60)
        }
      }, progress > 80 ? 400 : 800)
      return () => clearInterval(distortInterval)
    }
  }, [progress > 50 ? (progress > 80 ? 2 : 1) : 0, hasInteracted])

  const handleDismissCookie = useCallback(() => {
    setCookieDismissed(true)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ exit: { duration: 0.15 } }}
      className="fixed inset-0 overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #ffffff 0%, #f8f9fc 40%, #f0f2f8 100%)',
      }}
    >
      {/* Subtle background pattern — corporate grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* The "normal" corporate page content */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center min-h-screen transition-all duration-100 ${
          showGlitch ? 'translate-x-1 skew-x-1' : ''
        }`}
      >
        {/* Fake top navigation bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between px-6 z-20"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <div className="w-3 h-3 border border-white rounded-sm" />
            </div>
            <span className="text-sm font-medium text-gray-700 tracking-wide">
              DataFlow
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-20 h-2 bg-gray-100 rounded-full" />
            <div className="w-16 h-2 bg-gray-100 rounded-full" />
            <div className="w-8 h-8 rounded-full bg-gray-100" />
          </div>
        </motion.div>

        {/* Main content area */}
        <div className="text-center max-w-md mx-auto px-4">
          {/* Corporate logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-10"
          >
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <div className="w-10 h-10 border-2 border-white/80 rounded-xl flex items-center justify-center">
                <div className="w-4 h-4 bg-white/90 rounded-sm" />
              </div>
            </div>
          </motion.div>

          {/* Welcome heading */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl md:text-3xl font-light text-gray-800 mb-3 tracking-tight"
          >
            Preparing Your Experience
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-gray-400 mb-10 text-sm leading-relaxed"
          >
            {progress < 30
              ? 'Initializing secure connection...'
              : progress < 60
                ? 'Loading your personalized experience...'
                : progress < 90
                  ? 'Optimizing content delivery...'
                  : 'Finalizing...'}
          </motion.p>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="mx-auto max-w-xs"
          >
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(progress, 100)}%`,
                  background:
                    progress > 85
                      ? 'linear-gradient(90deg, #6366f1, #ef4444)'
                      : 'linear-gradient(90deg, #3b82f6, #6366f1)',
                  transition: 'width 0.1s linear, background 0.5s ease',
                }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-300">
                {Math.min(Math.round(progress), 100)}%
              </p>
              <p className="text-xs text-gray-300">
                {progress < 100 ? 'Please wait...' : ''}
              </p>
            </div>
          </motion.div>

          {/* Fake reassuring privacy text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-12 flex items-center justify-center gap-1.5"
          >
            <svg
              className="w-3 h-3 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span className="text-xs text-gray-400">
              256-bit encrypted &middot; Your privacy is important to us
            </span>
          </motion.div>
        </div>
      </div>

      {/* ─── Peripheral Tracking Notifications ─── */}
      <AnimatePresence>
        {activeNotifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: progress > 70 ? 0.35 : 0.15, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="fixed z-30 pointer-events-none hidden sm:block"
            style={{
              ...notification.position,
              textAlign: notification.position.textAlign,
            }}
          >
            <span
              className="text-xs font-mono tracking-wider"
              style={{
                color:
                  progress > 80
                    ? 'rgba(220, 38, 38, 0.6)'
                    : 'rgba(100, 116, 139, 0.5)',
              }}
            >
              {notification.text}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ─── Fake Cookie Consent Banner ─── */}
      <AnimatePresence>
        {!cookieDismissed && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              delay: 0.8,
            }}
            className="fixed bottom-0 left-0 right-0 z-40 p-4 md:p-5"
          >
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl shadow-black/10 border border-gray-100 p-5 md:p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-700 font-medium mb-1">
                    We value your privacy
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    We use cookies and similar technologies to personalize
                    content, analyze traffic, and improve your experience. By
                    continuing, you agree to our use of cookies.{' '}
                    <span className="underline cursor-pointer">Learn more</span>
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={handleDismissCookie}
                    className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors min-h-[44px]"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleDismissCookie}
                    className="px-5 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-sm min-h-[44px]"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Subtle Glitch Overlay ─── */}
      {showGlitch && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div
            className="absolute inset-0"
            style={{
              background:
                'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, transparent 1px, transparent 2px)',
              animation: 'glitch-lines 0.1s linear infinite',
            }}
          />
          <div
            className="absolute inset-0 mix-blend-overlay"
            style={{
              background: `rgb(${Math.random() * 50}, ${Math.random() * 255}, ${Math.random() * 50})`,
              opacity: 0.15,
            }}
          />
          {/* RGB channel split on glitch */}
          <div
            className="absolute inset-0"
            style={{
              boxShadow:
                'inset 3px 0 0 rgba(255,0,0,0.1), inset -3px 0 0 rgba(0,0,255,0.1)',
            }}
          />
        </div>
      )}

      {/* ─── Edge Artifacts (late stage) ─── */}
      {progress > 80 && (
        <>
          <motion.div
            className="fixed top-0 left-0 w-full h-[2px] z-50"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)',
              transformOrigin: 'left',
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [0, 1, 0], opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
          <motion.div
            className="fixed bottom-0 right-0 w-[2px] h-full bg-red-500/30 z-50"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 0.4, 0], opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.2, repeat: Infinity, delay: 0.1 }}
            style={{ transformOrigin: 'bottom' }}
          />
          <motion.div
            className="fixed bottom-0 left-0 w-full h-[2px] bg-green-500/20 z-50"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [0, 0.6, 0], opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.25, repeat: Infinity, delay: 0.15 }}
            style={{ transformOrigin: 'right' }}
          />
        </>
      )}

      {/* ─── White Flash Exit Transition ─── */}
      <AnimatePresence>
        {whiteFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0.8] }}
            transition={{ duration: 0.4, times: [0, 0.1, 0.5, 1] }}
            className="fixed inset-0 z-[100] bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
