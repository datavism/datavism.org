'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { typing as typingSound, drone } from '@/lib/audio/procedural'

interface BriefingProps {
  onComplete: () => void
}

const LINES = [
  { text: 'GHOST PROTOCOL INITIATED', delay: 0 },
  { text: '', delay: 1800 },
  { text: 'You chose to wake up.', delay: 2200 },
  { text: '', delay: 3600 },
  { text: 'Before we begin, we need to know who you are.', delay: 4000 },
  { text: '', delay: 6200 },
  { text: 'Not your name. Not your email.', delay: 6600 },
  { text: '', delay: 8400 },
  { text: 'Your PURPOSE.', delay: 8800 },
]

const CHAR_SPEED = 35 // ms per character

export function Briefing({ onComplete }: BriefingProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [currentChars, setCurrentChars] = useState<number>(0)
  const [typingComplete, setTypingComplete] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const stopDroneRef = useRef<(() => void) | null>(null)

  // Start the drone on mount
  useEffect(() => {
    stopDroneRef.current = drone(45, 0.06)
    return () => {
      stopDroneRef.current?.()
    }
  }, [])

  // Sequence through lines
  useEffect(() => {
    if (visibleLines >= LINES.length) {
      setTypingComplete(true)
      return
    }

    const line = LINES[visibleLines]

    // Empty lines are spacers — show instantly and move on
    if (line.text === '') {
      const timer = setTimeout(() => {
        setVisibleLines((v) => v + 1)
        setCurrentChars(0)
      }, 300)
      return () => clearTimeout(timer)
    }

    // Type characters one by one
    if (currentChars < line.text.length) {
      const timer = setTimeout(() => {
        typingSound()
        setCurrentChars((c) => c + 1)
      }, CHAR_SPEED)
      return () => clearTimeout(timer)
    }

    // Line complete — pause then advance
    const timer = setTimeout(() => {
      setVisibleLines((v) => v + 1)
      setCurrentChars(0)
    }, 600)
    return () => clearTimeout(timer)
  }, [visibleLines, currentChars])

  // Show button after typing finishes
  useEffect(() => {
    if (typingComplete) {
      const timer = setTimeout(() => setShowButton(true), 800)
      return () => clearTimeout(timer)
    }
  }, [typingComplete])

  const handleProceed = () => {
    stopDroneRef.current?.()
    onComplete()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      className="flex items-center justify-center min-h-screen px-4 sm:px-6"
    >
      <div className="max-w-2xl w-full">
        {/* Terminal output */}
        <div className="space-y-1">
          {LINES.slice(0, visibleLines + 1).map((line, i) => {
            if (line.text === '') return <div key={i} className="h-4" />

            const isCurrentLine = i === visibleLines && !typingComplete
            const displayText = isCurrentLine
              ? line.text.slice(0, currentChars)
              : line.text

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start"
              >
                <span className="text-green-400/50 mr-3 select-none">{'>'}</span>
                <span
                  className={`text-sm md:text-base ${
                    i === 0
                      ? 'text-red-400 font-bold text-base md:text-lg'
                      : line.text === 'Your PURPOSE.'
                        ? 'text-yellow-400 font-bold text-xl md:text-3xl'
                        : 'text-green-300'
                  }`}
                >
                  {displayText}
                  {isCurrentLine && (
                    <span className="inline-block w-2.5 h-5 bg-green-400 ml-0.5 animate-blink align-text-bottom" />
                  )}
                </span>
              </motion.div>
            )
          })}
        </div>

        {/* Blinking cursor after all text */}
        {typingComplete && !showButton && (
          <div className="mt-2">
            <span className="text-green-400/50 mr-3">{'>'}</span>
            <span className="inline-block w-2.5 h-5 bg-green-400 animate-blink" />
          </div>
        )}

        {/* PROCEED button */}
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProceed}
              className="min-h-[56px] w-full sm:w-auto px-12 py-4 border-2 border-green-400 text-green-400 font-bold text-lg tracking-widest hover:bg-green-400/10 transition-colors relative group"
            >
              <span className="relative z-10">PROCEED</span>
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-green-400/0 group-hover:bg-green-400/5 transition-colors" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
