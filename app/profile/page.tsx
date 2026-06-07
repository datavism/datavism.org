'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useDatavist, ROLE_CONFIG, MOTIVATION_CONFIG } from '@/lib/store/useDatavist'
import { MISSIONS } from '@/lib/data/missions'
import { impact, success, scan } from '@/lib/audio/procedural'

// ─── Rank computation ────────────────────────────────────────────────
function getRank(influence: number): { title: string; level: number } {
  if (influence >= 1000) return { title: 'ELITE', level: 4 }
  if (influence >= 500) return { title: 'AGENT', level: 3 }
  if (influence >= 100) return { title: 'OPERATIVE', level: 2 }
  return { title: 'RECRUIT', level: 1 }
}

// ─── Category badge colors ──────────────────────────────────────────
const CATEGORY_COLORS: Record<string, { text: string; border: string; bg: string }> = {
  greenwashing: { text: 'text-green-400', border: 'border-green-500/40', bg: 'bg-green-500/10' },
  pricing: { text: 'text-yellow-400', border: 'border-yellow-500/40', bg: 'bg-yellow-500/10' },
  manipulation: { text: 'text-red-400', border: 'border-red-500/40', bg: 'bg-red-500/10' },
  surveillance: { text: 'text-cyan-400', border: 'border-cyan-500/40', bg: 'bg-cyan-500/10' },
  inequality: { text: 'text-purple-400', border: 'border-purple-500/40', bg: 'bg-purple-500/10' },
}

export default function ProfilePage() {
  const { profile, reset } = useDatavist()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !profile) {
      router.push('/awaken')
    }
  }, [mounted, profile, router])

  useEffect(() => {
    if (mounted && profile) {
      try { impact() } catch {}
    }
  }, [mounted, profile])

  const handleReset = useCallback(() => {
    reset()
    router.push('/awaken')
  }, [reset, router])

  // Not mounted yet or no profile -- loading state
  if (!mounted || !profile) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4 animate-pulse tracking-wider">AUTHENTICATING OPERATIVE...</div>
          <div className="text-green-400/30 text-xs tracking-[0.3em]">SECURE CHANNEL INITIALIZING</div>
        </div>
      </div>
    )
  }

  const roleConfig = ROLE_CONFIG[profile.role]
  const motivationConfig = MOTIVATION_CONFIG[profile.motivation]
  const rank = getRank(profile.influenceScore)

  // Look up completed missions from MISSIONS data
  const completedMissions = profile.missionsCompleted
    .map(id => MISSIONS.find(m => m.id === id))
    .filter(Boolean)

  const awakenedDate = new Date(profile.awakenedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,65,0.008) 3px, rgba(0,255,65,0.008) 6px)',
        }}
      />

      <div className="relative z-10 px-6 py-10 md:py-14">
        <div className="max-w-3xl mx-auto">
          {/* Classification header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-red-400/30 text-[0.55rem] tracking-[0.5em] mb-1">
              // TOP SECRET — NEED-TO-KNOW BASIS
            </div>
            <div className="flex items-center gap-3 mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-green-400 tracking-wider">
                OPERATIVE DOSSIER
              </h1>
              <div className="flex-1 h-px bg-green-500/10" />
              <span className="text-green-400/20 text-[0.55rem] tracking-[0.15em]">
                FILE #{profile.codename.replace(/[^A-Z0-9]/gi, '').slice(0, 8).toUpperCase()}
              </span>
            </div>
          </motion.div>

          {/* ═══ Section 1: Identity ═══ */}
          <motion.section
            className="border border-green-500/15 bg-green-950/5 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <div className="border-b border-green-500/10 px-5 py-2.5 flex items-center justify-between">
              <span className="text-green-400/30 text-[0.55rem] tracking-[0.3em]">SECTION 1: IDENTITY</span>
              <span className="text-green-400/15 text-[0.5rem]">VERIFIED</span>
            </div>
            <div className="p-5 md:p-6">
              {/* Codename */}
              <div className="mb-5">
                <div className="text-green-400/25 text-[0.55rem] tracking-[0.2em] mb-1">CODENAME</div>
                <div
                  className="text-2xl md:text-3xl font-bold tracking-[0.15em]"
                  style={{ color: roleConfig.colorHex }}
                >
                  {profile.codename.toUpperCase()}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Role */}
                <div>
                  <div className="text-green-400/25 text-[0.55rem] tracking-[0.2em] mb-1">ROLE</div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg" style={{ color: roleConfig.colorHex }}>{roleConfig.icon}</span>
                    <span
                      className="text-sm font-bold tracking-wider"
                      style={{ color: roleConfig.colorHex }}
                    >
                      {roleConfig.title.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-green-400/20 text-[0.55rem] mt-1">
                    {roleConfig.description}
                  </div>
                </div>

                {/* Motivation */}
                <div>
                  <div className="text-green-400/25 text-[0.55rem] tracking-[0.2em] mb-1">MOTIVATION</div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-green-400/60">{motivationConfig.icon}</span>
                    <span className="text-sm font-bold tracking-wider text-green-300">
                      {motivationConfig.title.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-green-400/20 text-[0.55rem] mt-1">
                    {motivationConfig.description}
                  </div>
                </div>
              </div>

              {/* Awakened date + liberation code */}
              <div className="mt-5 pt-4 border-t border-green-500/8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-green-400/25 text-[0.55rem] tracking-[0.2em] mb-1">AWAKENED SINCE</div>
                  <div className="text-green-300/60 text-xs tracking-wider">{awakenedDate}</div>
                </div>
                {profile.liberationCode && (
                  <div>
                    <div className="text-green-400/25 text-[0.55rem] tracking-[0.2em] mb-1">LIBERATION CODE</div>
                    <div className="text-green-300/40 text-xs tracking-[0.2em] font-mono">
                      {profile.liberationCode}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* ═══ Section 2: Stats ═══ */}
          <motion.section
            className="border border-green-500/15 bg-green-950/5 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="border-b border-green-500/10 px-5 py-2.5 flex items-center justify-between">
              <span className="text-green-400/30 text-[0.55rem] tracking-[0.3em]">SECTION 2: OPERATIONAL STATUS</span>
              <span className="text-green-400/15 text-[0.5rem]">LIVE</span>
            </div>
            <div className="p-5 md:p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                {/* Influence Score */}
                <div>
                  <div className="text-green-400/25 text-[0.5rem] tracking-[0.2em] mb-2">INFLUENCE</div>
                  <div
                    className="text-2xl md:text-3xl font-bold tabular-nums"
                    style={{
                      color: roleConfig.colorHex,
                      textShadow: `0 0 20px ${roleConfig.colorHex}40, 0 0 40px ${roleConfig.colorHex}20`,
                    }}
                  >
                    {profile.influenceScore.toLocaleString()}
                  </div>
                </div>

                {/* Missions Completed */}
                <div>
                  <div className="text-green-400/25 text-[0.5rem] tracking-[0.2em] mb-2">MISSIONS</div>
                  <div className="text-2xl md:text-3xl font-bold text-green-300 tabular-nums">
                    {profile.missionsCompleted.length}
                  </div>
                </div>

                {/* Rank */}
                <div>
                  <div className="text-green-400/25 text-[0.5rem] tracking-[0.2em] mb-2">RANK</div>
                  <div
                    className="text-sm md:text-base font-bold tracking-[0.15em]"
                    style={{ color: roleConfig.colorHex }}
                  >
                    {rank.title}
                  </div>
                  <div className="text-green-400/15 text-[0.5rem] mt-1">LEVEL {rank.level}</div>
                </div>
              </div>

              {/* Rank progress bar */}
              <div className="mt-5 pt-4 border-t border-green-500/8">
                <div className="flex items-center justify-between text-[0.5rem] tracking-[0.15em] mb-2">
                  <span className="text-green-400/25">RANK PROGRESS</span>
                  <span className="text-green-400/20">
                    {rank.level < 4
                      ? `NEXT: ${rank.level === 1 ? 'OPERATIVE (100)' : rank.level === 2 ? 'AGENT (500)' : 'ELITE (1000)'}`
                      : 'MAX RANK ACHIEVED'
                    }
                  </span>
                </div>
                <div className="h-1 bg-green-950/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: roleConfig.colorHex }}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(100, rank.level === 1
                        ? (profile.influenceScore / 100) * 100
                        : rank.level === 2
                          ? ((profile.influenceScore - 100) / 400) * 100
                          : rank.level === 3
                            ? ((profile.influenceScore - 500) / 500) * 100
                            : 100
                      )}%`,
                    }}
                    transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* ═══ Section 3: Completed Missions ═══ */}
          <motion.section
            className="border border-green-500/15 bg-green-950/5 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <div className="border-b border-green-500/10 px-5 py-2.5 flex items-center justify-between">
              <span className="text-green-400/30 text-[0.55rem] tracking-[0.3em]">SECTION 3: MISSION LOG</span>
              <span className="text-green-400/15 text-[0.5rem]">
                {completedMissions.length} RECORD{completedMissions.length !== 1 ? 'S' : ''}
              </span>
            </div>
            <div className="p-5 md:p-6">
              {completedMissions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-green-400/15 text-sm tracking-wider mb-2">
                    NO MISSIONS COMPLETED
                  </div>
                  <div className="text-green-400/10 text-[0.6rem] tracking-wider">
                    Head to the Mission Board to begin your first investigation.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {completedMissions.map((mission, index) => {
                    if (!mission) return null
                    const catColors = CATEGORY_COLORS[mission.category] || CATEGORY_COLORS.greenwashing
                    return (
                      <motion.div
                        key={mission.id}
                        className="flex items-center justify-between gap-4 py-2.5 border-b border-green-500/5 last:border-0"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.08, duration: 0.3 }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-green-300/70 text-xs font-bold tracking-wider truncate">
                            {mission.title.toUpperCase()}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-[0.5rem] tracking-[0.1em] px-1.5 py-0.5 border rounded-sm ${catColors.text} ${catColors.border} ${catColors.bg}`}
                            >
                              {mission.category.toUpperCase()}
                            </span>
                            <span className="text-green-400/15 text-[0.5rem]">
                              {mission.difficulty.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-green-300/50 text-xs font-bold tabular-nums">
                            +{mission.influenceReward}
                          </div>
                          <div className="text-green-400/15 text-[0.5rem]">INF</div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.section>

          {/* ═══ Section 4: Actions ═══ */}
          <motion.section
            className="border border-green-500/15 bg-green-950/5 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="border-b border-green-500/10 px-5 py-2.5">
              <span className="text-green-400/30 text-[0.55rem] tracking-[0.3em]">SECTION 4: ACTIONS</span>
            </div>
            <div className="p-5 md:p-6 space-y-4">
              {/* Mission Board button */}
              <button
                onClick={() => {
                  try { scan() } catch {}
                  router.push('/ops')
                }}
                className="w-full sm:w-auto px-8 py-3 border border-green-500/40 text-green-400 text-xs tracking-[0.2em] font-bold hover:bg-green-500/10 hover:border-green-400 transition-all duration-200"
              >
                VIEW MISSION BOARD
              </button>

              {/* Reset Identity */}
              <div className="pt-4 border-t border-green-500/8">
                <AnimatePresence mode="wait">
                  {!showResetConfirm ? (
                    <motion.button
                      key="reset-btn"
                      onClick={() => setShowResetConfirm(true)}
                      className="text-red-400/40 text-[0.6rem] tracking-[0.15em] hover:text-red-400/70 transition-colors underline underline-offset-4 decoration-red-500/20 hover:decoration-red-500/40"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      RESET IDENTITY
                    </motion.button>
                  ) : (
                    <motion.div
                      key="reset-confirm"
                      className="border border-red-500/30 bg-red-950/10 p-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="text-red-400/60 text-[0.6rem] tracking-[0.15em] mb-3">
                        WARNING: This will permanently erase your operative identity, mission history, and influence score. This action cannot be undone.
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleReset}
                          className="px-5 py-2 border border-red-500/50 text-red-400 text-[0.6rem] tracking-[0.15em] font-bold hover:bg-red-500/10 hover:border-red-400 transition-all"
                        >
                          CONFIRM RESET
                        </button>
                        <button
                          onClick={() => setShowResetConfirm(false)}
                          className="px-5 py-2 border border-green-500/20 text-green-400/40 text-[0.6rem] tracking-[0.15em] hover:text-green-400/60 hover:border-green-500/30 transition-all"
                        >
                          CANCEL
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.section>

          {/* Footer classification stamp */}
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="text-green-400/8 text-[0.5rem] tracking-[0.5em]">
              END OF DOSSIER — DATAVISM INTELLIGENCE NETWORK
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
