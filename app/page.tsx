'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDatavist } from '@/lib/store/useDatavist'
import { TheMirror } from '@/components/experience/TheMirror'

export default function HomePage() {
  const profile = useDatavist((s) => s.profile)
  const [showReturn, setShowReturn] = useState(false)
  const [skipExperience, setSkipExperience] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Wait for store hydration before deciding what to show
  useEffect(() => {
    setHydrated(true)
  }, [])

  // If user has a profile, show return option briefly
  useEffect(() => {
    if (hydrated && profile) {
      setShowReturn(true)
    }
  }, [hydrated, profile])

  // Not hydrated yet — black screen
  if (!hydrated) {
    return <div className="fixed inset-0 bg-black" />
  }

  // Returning user who skipped — redirect
  if (skipExperience) {
    if (typeof window !== 'undefined') {
      window.location.href = '/ops'
    }
    return <div className="fixed inset-0 bg-black" />
  }

  return (
    <>
      {/* Returning user overlay */}
      <AnimatePresence>
        {showReturn && !skipExperience && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center px-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center max-w-md"
            >
              <div
                className="font-mono text-green-400 text-2xl md:text-3xl font-bold mb-3"
                style={{ textShadow: '0 0 20px rgba(0,255,65,0.3)' }}
              >
                Welcome back, {profile?.codename}.
              </div>
              <div className="font-mono text-green-400/40 text-sm mb-10">
                GHOST is standing by.
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setSkipExperience(true)}
                  className="font-mono text-sm text-green-400 border border-green-500/50 px-8 py-4 hover:bg-green-500/10 transition-colors tracking-wider"
                  style={{ textShadow: '0 0 8px rgba(0,255,65,0.3)' }}
                >
                  CONTINUE TO MISSIONS
                </button>
                <button
                  onClick={() => setShowReturn(false)}
                  className="font-mono text-xs text-green-400/30 hover:text-green-400/60 transition-colors tracking-wider py-2"
                >
                  replay the experience
                </button>
              </div>
            </motion.div>

            {/* Ambient */}
            <div className="fixed bottom-4 font-mono text-green-500/10 text-[10px] tracking-[0.3em]">
              DATAVISM
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The viral experience (plays if no profile or user chose to replay) */}
      {!showReturn && <TheMirror />}
    </>
  )
}
