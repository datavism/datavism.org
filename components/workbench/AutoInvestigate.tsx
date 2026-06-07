'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  runInvestigation,
  formatRunForExport,
  type InvestigationCycle,
  type InvestigationRun,
} from '@/lib/ai/auto-investigate'
import { useDatavist } from '@/lib/store/useDatavist'
import { scan, typing, impact, success, drone, whoosh } from '@/lib/audio/procedural'
import type { Mission } from '@/lib/data/missions'

// ─── Props ──────────────────────────────────────────────────────────

interface AutoInvestigateProps {
  mission: Mission
  onComplete: (run: InvestigationRun) => void
  onClose: () => void
}

// ─── Cycle count options ────────────────────────────────────────────

const CYCLE_OPTIONS = [3, 5, 7, 10] as const

// ─── Component ──────────────────────────────────────────────────────

export function AutoInvestigate({ mission, onComplete, onClose }: AutoInvestigateProps) {
  const { profile } = useDatavist()

  // ── State ──
  const [status, setStatus] = useState<'config' | 'running' | 'complete' | 'stopped'>('config')
  const [maxCycles, setMaxCycles] = useState(5)
  const [currentCycle, setCurrentCycle] = useState(0)
  const [cycles, setCycles] = useState<InvestigationCycle[]>([])
  const [streamingText, setStreamingText] = useState('')
  const [streamingCycleNum, setStreamingCycleNum] = useState(0)
  const [transitionText, setTransitionText] = useState('')
  const [summary, setSummary] = useState<string | null>(null)
  const [run, setRun] = useState<InvestigationRun | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // ── Refs ──
  const abortRef = useRef<AbortController | null>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const droneStopRef = useRef<(() => void) | null>(null)
  const typingSoundRef = useRef<number>(0)

  // ── Auto-scroll ──
  const scrollToBottom = useCallback(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [cycles, streamingText, transitionText, summary, scrollToBottom])

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      droneStopRef.current?.()
    }
  }, [])

  // ── Throttled typing sound ──
  const playTypingSound = useCallback(() => {
    const now = Date.now()
    if (now - typingSoundRef.current > 80) {
      typingSoundRef.current = now
      typing()
    }
  }, [])

  // ── Start investigation ──
  const handleStart = useCallback(async () => {
    if (!profile) return

    setStatus('running')
    setError(null)
    setCycles([])
    setStreamingText('')
    setSummary(null)
    setCurrentCycle(0)

    // Start ambient drone
    droneStopRef.current = drone(45, 0.05)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const result = await runInvestigation({
        missionTitle: mission.title,
        missionBriefing: mission.briefing,
        objectives: mission.objectives,
        dataSources: mission.dataSources,
        role: profile.role,
        motivation: profile.motivation,
        codename: profile.codename,
        chapter: profile.currentChapter,
        maxCycles,
        signal: controller.signal,

        onCycleStart: (cycleNum: number, _question: string) => {
          setCurrentCycle(cycleNum)
          setStreamingCycleNum(cycleNum)
          setStreamingText('')
          setTransitionText('')
          scan()
        },

        onCycleUpdate: (cycleNum: number, partialText: string) => {
          setStreamingCycleNum(cycleNum)
          setStreamingText(partialText)
          playTypingSound()
        },

        onCycleComplete: (cycle: InvestigationCycle) => {
          setStreamingText('')
          setStreamingCycleNum(0)
          setCycles((prev) => [...prev, cycle])

          // Play sound based on rating
          if (cycle.rating === 'CONFIRMED') {
            impact()
          }

          // Show transition if not the last cycle
          setTransitionText('INITIATING NEXT CYCLE...')
        },

        onComplete: (completedRun: InvestigationRun) => {
          setRun(completedRun)
          setSummary(completedRun.summary)
          setTransitionText('')
          setStreamingText('')

          // Stop drone
          droneStopRef.current?.()
          droneStopRef.current = null

          if (completedRun.status === 'complete') {
            setStatus('complete')
            success()
            onComplete(completedRun)
          } else {
            setStatus('stopped')
          }
        },
      })

      setRun(result)
    } catch (err: unknown) {
      droneStopRef.current?.()
      droneStopRef.current = null

      if (err instanceof Error && err.name === 'AbortError') {
        setStatus('stopped')
      } else {
        setError(err instanceof Error ? err.message : 'Investigation failed')
        setStatus('stopped')
      }
    }
  }, [profile, mission, maxCycles, onComplete, playTypingSound])

  // ── Stop investigation ──
  const handleStop = useCallback(() => {
    abortRef.current?.abort()
    droneStopRef.current?.()
    droneStopRef.current = null
    setStatus('stopped')
    setTransitionText('')
    setStreamingText('')
  }, [])

  // ── Export findings ──
  const handleExport = useCallback(async () => {
    if (!run) return
    const text = formatRunForExport(run)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: create a textarea and copy
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [run])

  // ── Close ──
  const handleClose = useCallback(() => {
    abortRef.current?.abort()
    droneStopRef.current?.()
    droneStopRef.current = null
    whoosh()
    onClose()
  }, [onClose])

  // ── Rating badge color ──
  const ratingColor = useCallback((rating: InvestigationCycle['rating']) => {
    switch (rating) {
      case 'CONFIRMED': return 'text-green-400 border-green-500/40 bg-green-500/10'
      case 'PARTIAL': return 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10'
      case 'INCONCLUSIVE': return 'text-gray-400 border-gray-500/40 bg-gray-500/10'
    }
  }, [])

  const ratingDot = useCallback((rating: InvestigationCycle['rating']) => {
    switch (rating) {
      case 'CONFIRMED': return 'bg-green-400'
      case 'PARTIAL': return 'bg-yellow-400'
      case 'INCONCLUSIVE': return 'bg-gray-400'
    }
  }, [])

  // ── Progress percentage ──
  const progress = useMemo(() => {
    if (status === 'complete') return 100
    if (status === 'config') return 0
    return Math.round((cycles.length / maxCycles) * 100)
  }, [status, cycles.length, maxCycles])

  // ──────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-black/98 font-mono"
    >
      {/* ─── Header ─── */}
      <div className="flex-shrink-0 border-b border-green-500/15 bg-black">
        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          {/* Left: Title + status */}
          <div className="flex items-center gap-3">
            {/* Pulsing dot */}
            <div className="relative">
              <div className={`w-2 h-2 rounded-full ${status === 'running' ? 'bg-green-400' : status === 'complete' ? 'bg-green-400' : 'bg-gray-500'}`} />
              {status === 'running' && (
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-400 animate-ping" />
              )}
            </div>
            <span className="text-green-400 text-[0.7rem] md:text-xs tracking-[0.2em] font-bold">
              GHOST AUTOPILOT
            </span>
            <span className="hidden md:inline text-green-400/30 text-[0.6rem] tracking-wider">
              // {mission.title}
            </span>
          </div>

          {/* Center: Cycle counter */}
          <div className="flex items-center gap-4">
            {status === 'running' && (
              <span className="text-green-400/60 text-[0.65rem] tracking-[0.15em] tabular-nums">
                CYCLE {currentCycle}/{maxCycles}
              </span>
            )}
            {status === 'complete' && (
              <span className="text-green-400 text-[0.65rem] tracking-[0.15em]">
                INVESTIGATION COMPLETE
              </span>
            )}
            {status === 'stopped' && cycles.length > 0 && (
              <span className="text-yellow-400/60 text-[0.65rem] tracking-[0.15em]">
                STOPPED AT CYCLE {cycles.length}/{maxCycles}
              </span>
            )}
          </div>

          {/* Right: Stop / Close buttons */}
          <div className="flex items-center gap-2">
            {status === 'running' && (
              <button
                onClick={handleStop}
                className="px-3 py-1.5 text-[0.6rem] tracking-[0.12em] uppercase font-bold
                  text-red-400 border border-red-500/30 rounded-sm
                  hover:bg-red-500/10 hover:border-red-400/50 transition-all"
              >
                STOP
              </button>
            )}
            <button
              onClick={handleClose}
              className="px-3 py-1.5 text-[0.6rem] tracking-[0.12em] uppercase
                text-green-400/40 border border-green-500/10 rounded-sm
                hover:text-green-400/60 hover:border-green-500/20 transition-all"
            >
              CLOSE
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {status !== 'config' && (
          <div className="h-[2px] bg-green-500/10">
            <motion.div
              className="h-full bg-green-500/60"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        )}
      </div>

      {/* ─── Main area ─── */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* ── Config screen ── */}
        {status === 'config' && (
          <div className="flex-1 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg w-full space-y-8"
            >
              {/* Title */}
              <div className="text-center space-y-3">
                <div className="text-green-400 text-xs tracking-[0.3em] uppercase font-bold">
                  GHOST AUTOPILOT
                </div>
                <div className="text-green-400/40 text-[0.65rem] tracking-wider leading-relaxed max-w-sm mx-auto">
                  GHOST will run autonomous investigation cycles against the mission objectives.
                  Each cycle formulates a question, analyzes data, and produces a rated finding.
                </div>
              </div>

              {/* Mission info */}
              <div className="border border-green-500/15 rounded-sm p-4 space-y-2">
                <div className="text-green-400/30 text-[0.55rem] tracking-[0.2em] uppercase">
                  TARGET MISSION
                </div>
                <div className="text-green-400 text-sm font-bold">
                  {mission.title}
                </div>
                <div className="text-green-400/40 text-[0.7rem] leading-relaxed">
                  {mission.objectives.length} objectives // {mission.dataSources.length} data sources
                </div>
              </div>

              {/* Cycle selector */}
              <div className="space-y-3">
                <div className="text-green-400/30 text-[0.55rem] tracking-[0.2em] uppercase">
                  INVESTIGATION DEPTH
                </div>
                <div className="flex items-center gap-2">
                  {CYCLE_OPTIONS.map((num) => (
                    <button
                      key={num}
                      onClick={() => setMaxCycles(num)}
                      className={`
                        flex-1 py-2.5 text-[0.7rem] tracking-wider font-bold rounded-sm
                        border transition-all duration-200
                        ${maxCycles === num
                          ? 'text-green-400 border-green-500/40 bg-green-500/10'
                          : 'text-green-400/30 border-green-500/10 hover:text-green-400/50 hover:border-green-500/20'
                        }
                      `}
                    >
                      {num} CYCLES
                    </button>
                  ))}
                </div>
                <div className="text-green-400/20 text-[0.55rem] tracking-wider">
                  {maxCycles <= 3 && 'Quick scan — surface-level findings'}
                  {maxCycles === 5 && 'Standard depth — balanced coverage of objectives'}
                  {maxCycles === 7 && 'Deep investigation — thorough analysis'}
                  {maxCycles >= 10 && 'Exhaustive — maximum depth and cross-referencing'}
                </div>
              </div>

              {/* Launch button */}
              <motion.button
                onClick={handleStart}
                className="w-full py-3.5 text-[0.7rem] tracking-[0.2em] uppercase font-bold
                  text-green-400 border border-green-500/40 rounded-sm
                  bg-green-500/5 hover:bg-green-500/15 hover:border-green-400/60
                  hover:shadow-[0_0_24px_rgba(0,255,65,0.1)]
                  transition-all duration-300"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                INITIATE AUTOPILOT
              </motion.button>

              {error && (
                <div className="text-red-400 text-[0.65rem] text-center border border-red-500/20 rounded-sm p-3">
                  {error}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* ── Research log ── */}
        {status !== 'config' && (
          <div
            ref={logRef}
            className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-16 py-6"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,255,65,0.006) 2px, rgba(0,255,65,0.006) 3px)',
            }}
          >
            {/* Completed cycles */}
            <AnimatePresence initial={false}>
              {cycles.map((cycle) => (
                <motion.div
                  key={`cycle-${cycle.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mb-8"
                >
                  {/* Cycle separator */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-green-400/25 text-[0.6rem] tracking-[0.2em] whitespace-nowrap">
                      CYCLE {cycle.id}
                    </div>
                    <div className="flex-1 h-px bg-green-500/10" />
                    <div className="text-green-400/15 text-[0.5rem] tabular-nums">
                      {new Date(cycle.timestamp).toLocaleTimeString()}
                    </div>
                  </div>

                  {/* Question */}
                  <div className="mb-3">
                    <div className="text-cyan-400/40 text-[0.55rem] tracking-[0.15em] uppercase mb-1">
                      RESEARCH QUESTION
                    </div>
                    <div className="text-cyan-300/80 text-[0.8rem] leading-relaxed">
                      {cycle.question}
                    </div>
                  </div>

                  {/* Analysis */}
                  <div className="mb-3">
                    <div className="text-green-400/40 text-[0.55rem] tracking-[0.15em] uppercase mb-1">
                      ANALYSIS
                    </div>
                    <div className="text-green-300/60 text-[0.75rem] leading-relaxed whitespace-pre-wrap">
                      {cycle.analysis}
                    </div>
                  </div>

                  {/* Finding */}
                  <div className="mb-3">
                    <div className="text-yellow-400/40 text-[0.55rem] tracking-[0.15em] uppercase mb-1">
                      FINDING
                    </div>
                    <div className="text-yellow-300/90 text-[0.8rem] leading-relaxed font-bold">
                      {cycle.finding}
                    </div>
                  </div>

                  {/* Rating badge */}
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${ratingDot(cycle.rating)}`} />
                    <span className={`
                      inline-block px-2.5 py-1 text-[0.55rem] tracking-[0.15em] font-bold
                      border rounded-sm ${ratingColor(cycle.rating)}
                    `}>
                      {cycle.rating}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Currently streaming cycle */}
            {streamingText && streamingCycleNum > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                {/* Cycle separator */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-green-400/40 text-[0.6rem] tracking-[0.2em] whitespace-nowrap">
                    CYCLE {streamingCycleNum}
                  </div>
                  <div className="flex-1 h-px bg-green-500/10" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400/40 text-[0.5rem] tracking-wider">
                      PROCESSING
                    </span>
                  </div>
                </div>

                {/* Raw streaming output */}
                <div className="text-green-300/60 text-[0.75rem] leading-relaxed whitespace-pre-wrap">
                  {streamingText}
                  <span className="inline-block w-2 h-3.5 bg-green-400/60 ml-0.5 animate-pulse" />
                </div>
              </motion.div>
            )}

            {/* Transition text between cycles */}
            {transitionText && status === 'running' && !streamingText && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 my-6"
              >
                <LoadingDots />
                <span className="text-green-400/30 text-[0.6rem] tracking-[0.2em]">
                  {transitionText}
                </span>
              </motion.div>
            )}

            {/* Summary section */}
            {summary && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-green-500/20" />
                  <div className="text-green-400/50 text-[0.6rem] tracking-[0.3em]">
                    INVESTIGATION SUMMARY
                  </div>
                  <div className="flex-1 h-px bg-green-500/20" />
                </div>

                <div className="border border-green-500/15 rounded-sm p-5 bg-green-500/[0.02]">
                  <div className="text-green-300/70 text-[0.8rem] leading-[1.8] whitespace-pre-wrap">
                    {summary}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stopped message */}
            {status === 'stopped' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60" />
                <span className="text-yellow-400/50 text-[0.65rem] tracking-[0.15em]">
                  INVESTIGATION HALTED BY OPERATOR
                  {cycles.length > 0 && ` // ${cycles.length} cycle${cycles.length !== 1 ? 's' : ''} completed`}
                </span>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-6 px-4 py-3 border border-red-500/30 text-red-400 text-[0.7rem]">
                <span className="font-bold">AUTOPILOT ERROR:</span> {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Footer ─── */}
      {status !== 'config' && (
        <div className="flex-shrink-0 border-t border-green-500/15 bg-black px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Stats */}
            <div className="flex items-center gap-4 text-[0.55rem] text-green-400/30 tracking-wider">
              <span>
                {cycles.filter((c) => c.rating === 'CONFIRMED').length} CONFIRMED
              </span>
              <span>
                {cycles.filter((c) => c.rating === 'PARTIAL').length} PARTIAL
              </span>
              <span>
                {cycles.filter((c) => c.rating === 'INCONCLUSIVE').length} INCONCLUSIVE
              </span>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {(status === 'complete' || status === 'stopped') && cycles.length > 0 && (
                <button
                  onClick={handleExport}
                  className="px-3 py-1.5 text-[0.6rem] tracking-[0.12em] uppercase font-bold
                    text-green-400/60 border border-green-500/20 rounded-sm
                    hover:text-green-400 hover:border-green-500/40 hover:bg-green-500/5
                    transition-all"
                >
                  {copied ? 'COPIED TO CLIPBOARD' : 'EXPORT FINDINGS'}
                </button>
              )}
              {(status === 'complete' || status === 'stopped') && (
                <button
                  onClick={() => {
                    setStatus('config')
                    setCycles([])
                    setStreamingText('')
                    setSummary(null)
                    setRun(null)
                    setError(null)
                    setCurrentCycle(0)
                  }}
                  className="px-3 py-1.5 text-[0.6rem] tracking-[0.12em] uppercase
                    text-green-400/40 border border-green-500/10 rounded-sm
                    hover:text-green-400/60 hover:border-green-500/20 transition-all"
                >
                  NEW RUN
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// ─── Loading dots animation ─────────────────────────────────────────

function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1 h-1 rounded-full bg-green-400/40"
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}
