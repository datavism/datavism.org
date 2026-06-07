'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SoundEngine } from '@/lib/audio/SoundEngine'

/**
 * Minimal sound toggle button — fixed bottom-left.
 * Shows current state as a small monospace indicator.
 */
export function SoundToggle() {
  const [enabled, setEnabled] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setEnabled(SoundEngine.getInstance().enabled)
  }, [])

  if (!mounted) return null

  const toggle = () => {
    const engine = SoundEngine.getInstance()
    engine.toggle()
    setEnabled(engine.enabled)
  }

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
      onClick={toggle}
      className="fixed bottom-4 left-4 z-50 font-mono text-xs tracking-wider px-3 py-2 min-h-[44px] min-w-[44px] flex items-center text-green-400/30 hover:text-green-400/60 transition-colors"
      title={enabled ? 'Mute sound' : 'Enable sound'}
    >
      {enabled ? 'SOUND ON' : 'SOUND OFF'}
    </motion.button>
  )
}
