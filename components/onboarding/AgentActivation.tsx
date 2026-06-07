'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { scan, success, impact } from '@/lib/audio/procedural'
import {
  useDatavist,
  ROLE_CONFIG,
  MOTIVATION_CONFIG,
  type UserRole,
  type UserMotivation,
} from '@/lib/store/useDatavist'

interface AgentActivationProps {
  codename: string
  role: UserRole
  motivation: UserMotivation
}

interface TerminalLine {
  text: string
  isProgress?: boolean
  isBlank?: boolean
  isFinal?: boolean
}

export function AgentActivation({ codename, role, motivation }: AgentActivationProps) {
  const router = useRouter()
  const [visibleLines, setVisibleLines] = useState(0)
  const [currentChars, setCurrentChars] = useState(0)
  const [allDone, setAllDone] = useState(false)
  const profileSavedRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const roleConfig = ROLE_CONFIG[role]
  const motivationConfig = MOTIVATION_CONFIG[motivation]

  const lines: TerminalLine[] = [
    { text: '> INITIALIZING GHOST AGENT...' },
    { text: `> PERSONALITY MATRIX: ${roleConfig.title.toUpperCase()}` },
    { text: `> PRIMARY DIRECTIVE: ${motivationConfig.title.toUpperCase()}` },
    { text: `> OPERATIVE: ${codename}` },
    { text: '> ESTABLISHING SECURE CHANNEL...' },
    { text: '', isBlank: true },
    { text: '\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 100%', isProgress: true },
    { text: '', isBlank: true },
    { text: '> AGENT ONLINE.', isFinal: true },
    { text: '', isBlank: true },
    { text: `> Awaiting your first command, ${codename}.` },
  ]

  const CHAR_SPEED = 30
  const LINE_PAUSE = 500
  const PROGRESS_PAUSE = 1200

  // Typewriter sequencer
  useEffect(() => {
    if (visibleLines >= lines.length) {
      setAllDone(true)
      return
    }

    const line = lines[visibleLines]

    // Blank lines — show and advance
    if (line.isBlank) {
      const timer = setTimeout(() => {
        setVisibleLines((v) => v + 1)
        setCurrentChars(0)
      }, 300)
      return () => clearTimeout(timer)
    }

    // Progress bar — show all at once with delay
    if (line.isProgress) {
      scan()
      const timer = setTimeout(() => {
        setCurrentChars(line.text.length)
        setTimeout(() => {
          setVisibleLines((v) => v + 1)
          setCurrentChars(0)
        }, PROGRESS_PAUSE)
      }, 200)
      return () => clearTimeout(timer)
    }

    // Normal lines — type character by character
    if (currentChars < line.text.length) {
      const timer = setTimeout(() => {
        setCurrentChars((c) => c + 1)
      }, CHAR_SPEED)
      return () => clearTimeout(timer)
    }

    // Line complete — play sound and pause
    if (line.isFinal) {
      success()
    } else {
      scan()
    }

    const timer = setTimeout(() => {
      setVisibleLines((v) => v + 1)
      setCurrentChars(0)
    }, LINE_PAUSE)
    return () => clearTimeout(timer)
  }, [visibleLines, currentChars, lines])

  // Save profile and redirect after completion
  useEffect(() => {
    if (allDone && !profileSavedRef.current) {
      profileSavedRef.current = true

      // Save to store
      useDatavist.getState().setProfile({
        codename,
        role,
        motivation,
        awakenedAt: new Date().toISOString(),
        influenceScore: 0,
        missionsCompleted: [],
        currentChapter: 1,
        chaptersCompleted: [],
      })

      // Final impact sound
      setTimeout(() => {
        impact()
      }, 800)

      // Redirect after dramatic pause
      setTimeout(() => {
        router.push('/ops')
      }, 2500)
    }
  }, [allDone, codename, role, motivation, router])

  // Auto-scroll terminal
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [visibleLines, currentChars])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center min-h-screen px-4 sm:px-6"
    >
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.03) 2px, rgba(0,255,65,0.03) 4px)',
        }}
      />

      <div className="max-w-lg md:max-w-2xl w-full mx-auto relative z-20">
        {/* Terminal window */}
        <div className="border border-green-400/30 bg-black">
          {/* Title bar */}
          <div className="border-b border-green-400/20 px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400/60" />
            <div className="w-2 h-2 rounded-full bg-green-400/30" />
            <div className="w-2 h-2 rounded-full bg-green-400/30" />
            <span className="text-green-400/40 text-xs ml-2 tracking-widest truncate">
              GHOST_AGENT_v1.0
            </span>
          </div>

          {/* Terminal content */}
          <div
            ref={containerRef}
            className="p-4 sm:p-6 md:p-8 min-h-[300px] md:min-h-[400px] max-h-[70vh] overflow-y-auto"
          >
            <div className="space-y-2">
              {lines.slice(0, visibleLines + 1).map((line, i) => {
                if (line.isBlank) return <div key={i} className="h-4" />

                const isCurrentLine = i === visibleLines && !allDone
                const displayText = isCurrentLine
                  ? line.text.slice(0, currentChars)
                  : i < visibleLines
                    ? line.text
                    : line.text.slice(0, currentChars)

                // Determine text color
                let textClass = 'text-green-400 text-xs md:text-sm'
                if (line.isFinal) {
                  textClass = 'text-green-300 font-bold text-base md:text-xl'
                } else if (line.isProgress) {
                  textClass = 'text-green-500 text-xs md:text-sm'
                } else if (line.text.includes('PERSONALITY MATRIX')) {
                  textClass = 'font-bold text-xs md:text-sm'
                  // Use role color inline
                } else if (line.text.includes('PRIMARY DIRECTIVE')) {
                  textClass = 'text-yellow-400 text-xs md:text-sm'
                } else if (line.text.includes('OPERATIVE')) {
                  textClass = 'text-green-300 font-bold text-xs md:text-sm'
                }

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-mono"
                  >
                    <span
                      className={textClass}
                      style={
                        line.text.includes('PERSONALITY MATRIX')
                          ? { color: roleConfig.colorHex }
                          : undefined
                      }
                    >
                      {displayText}
                    </span>
                    {isCurrentLine && !line.isProgress && (
                      <span className="inline-block w-2 h-4 bg-green-400 ml-0.5 animate-blink align-text-bottom" />
                    )}
                  </motion.div>
                )
              })}

              {/* Final blinking cursor */}
              {allDone && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4"
                >
                  <span className="text-green-400/50">{'> '}</span>
                  <span className="inline-block w-2.5 h-5 bg-green-400 animate-blink" />
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Ambient glow under terminal */}
        {allDone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="h-1 mx-8 rounded-full mt-1"
            style={{
              background: `linear-gradient(90deg, transparent, ${roleConfig.colorHex}40, transparent)`,
            }}
          />
        )}
      </div>
    </motion.div>
  )
}
