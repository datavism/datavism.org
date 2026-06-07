'use client'

import { useState, useEffect, useCallback, useMemo, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getMissionBySlug } from '@/lib/data/missions'
import { useDatavist, ROLE_CONFIG } from '@/lib/store/useDatavist'
import { AgentChat } from '@/components/ai/AgentChat'
import { DarkPatternHunt } from '@/components/investigations/DarkPatternHunt'
import { PriceDiscrimination } from '@/components/investigations/PriceDiscrimination'
import { FilterBubbleViz } from '@/components/investigations/FilterBubbleViz'
import { DataBrokerMap } from '@/components/investigations/DataBrokerMap'
import { SentimentGame } from '@/components/investigations/SentimentGame'
import { AlgoAuditGame } from '@/components/investigations/AlgoAuditGame'
import { GenericInvestigation } from '@/components/investigations/GenericInvestigation'
import { impact, success as playSuccess, whoosh } from '@/lib/audio/procedural'
import { AutoInvestigate } from '@/components/workbench/AutoInvestigate'
import type { InvestigationRun } from '@/lib/ai/auto-investigate'

// ─── Investigation Component Map ────────────────────────────────────

const INVESTIGATION_COMPONENTS: Record<string, string> = {
  'dark-patterns-decoded': 'dark-pattern-hunt',
  'surge-pricing-exposed': 'price-discrimination',
  'invisible-tax': 'price-discrimination',
  'filter-bubble-analyzer': 'filter-bubble-viz',
  'data-broker-exposed': 'data-broker-map',
  'sentiment-manipulation': 'sentiment-game',
  'the-algorithm-audit': 'algo-audit-game',
}

// ─── Timer Hook ─────────────────────────────────────────────────────

function useTimer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const formatted = useMemo(() => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }, [seconds])

  return formatted
}

// ─── GHOST System Prompt Builder ────────────────────────────────────

function buildGhostPrompt(missionTitle: string, missionBriefing: string, codename: string, roleTitle: string): string {
  return `You are GHOST, an AI investigation assistant embedded in the DATAVISM platform. You are helping operative "${codename}" (a ${roleTitle}) with the mission: "${missionTitle}".

MISSION BRIEFING:
${missionBriefing}

YOUR ROLE:
- You are a sidebar helper — concise, tactical, focused
- Give SHORT answers (2-4 sentences max unless asked for detail)
- Use terminal/hacker aesthetic in your language
- Help with investigation strategy, data interpretation, and finding patterns
- You can suggest what to look for, explain concepts, and help connect dots
- Never do the investigation FOR them — guide, don't solve
- Refer to the operative by codename
- Stay in character: you are a clandestine AI ally

TONE: Sharp. Efficient. Slightly conspiratorial. Like a handler on comms during a mission.`
}

// ─── Page Component ─────────────────────────────────────────────────

export default function InvestigatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const profile = useDatavist(s => s.profile)
  const completeMission = useDatavist(s => s.completeMission)
  const [ghostOpen, setGhostOpen] = useState(false)
  const [ghostMobileOpen, setGhostMobileOpen] = useState(false)
  const [autopilotOpen, setAutopilotOpen] = useState(false)
  const [evidenceCount, setEvidenceCount] = useState(0)
  const [missionComplete, setMissionComplete] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const timer = useTimer()

  useEffect(() => { setHydrated(true) }, [])

  const mission = getMissionBySlug(slug)

  // Handle evidence additions from investigation components
  const handleEvidenceAdd = useCallback((evidence: { type: string; data: unknown }) => {
    playSuccess()
    setEvidenceCount(prev => prev + 1)
  }, [])

  // Handle investigation complete
  const handleInvestigationComplete = useCallback((scoreOrFindings?: number) => {
    // Don't auto-complete; let user press COMPLETE
  }, [])

  // Handle mission completion
  const handleCompleteMission = useCallback(() => {
    if (!mission) return
    impact()
    setMissionComplete(true)
    completeMission(mission.id, mission.influenceReward)
  }, [mission, completeMission])

  // Toggle GHOST sidebar (desktop)
  const toggleGhost = useCallback(() => {
    whoosh()
    setGhostOpen(prev => !prev)
  }, [])

  // Loading / guard states
  if (!hydrated) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-green-500/40 font-mono text-sm animate-pulse">
          LOADING INVESTIGATION...
        </div>
      </div>
    )
  }

  if (!profile) {
    router.replace('/awaken')
    return null
  }

  if (!mission) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="text-red-400 font-mono text-sm">MISSION NOT FOUND</div>
        <p className="text-green-500/40 font-mono text-xs">
          No mission with slug &quot;{slug}&quot; exists in the database.
        </p>
        <button
          onClick={() => router.push('/ops')}
          className="border border-green-500/30 text-green-400 font-mono text-xs px-4 py-2 rounded
            hover:bg-green-500/10 transition-colors"
        >
          Return to Operations
        </button>
      </div>
    )
  }

  // Determine which investigation component to render
  const investigationType = INVESTIGATION_COMPONENTS[slug] || 'generic'
  const roleConf = ROLE_CONFIG[profile.role]

  const ghostSystemPrompt = buildGhostPrompt(
    mission.title,
    mission.briefing,
    profile.codename,
    roleConf.title
  )

  // ── Mission Complete Overlay ────────────────────────────────────
  if (missionComplete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex flex-col items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 border-2 border-green-400/40 rounded-full mx-auto mb-6
              flex items-center justify-center"
          >
            <span className="text-green-400 text-3xl">{'\u2713'}</span>
          </motion.div>

          <h2 className="font-mono text-xl text-green-400 font-bold mb-2">
            MISSION COMPLETE
          </h2>
          <p className="font-mono text-sm text-green-500/60 mb-1">{mission.title}</p>
          <p className="font-mono text-xs text-green-500/30 mb-6">
            Time: {timer} | Evidence: {evidenceCount} items
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="border border-green-500/20 rounded p-4 mb-6"
          >
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-mono text-green-400 font-bold">
                  +{mission.influenceReward}
                </div>
                <div className="text-xs font-mono text-green-500/40 uppercase tracking-wider mt-1">
                  Influence
                </div>
              </div>
              <div className="h-8 w-px bg-green-500/10" />
              <div className="text-center">
                <div className="text-2xl font-mono text-green-400 font-bold">
                  {evidenceCount}
                </div>
                <div className="text-xs font-mono text-green-500/40 uppercase tracking-wider mt-1">
                  Evidence
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push('/ops')}
              className="flex-1 border border-green-500/30 text-green-400 font-mono text-xs min-h-[44px] py-2.5 rounded
                hover:bg-green-500/10 transition-colors uppercase tracking-wider"
            >
              Operations
            </button>
            <button
              onClick={() => router.push(`/missions/${slug}/debrief`)}
              className="flex-1 border border-green-500/40 text-green-400 font-mono text-xs min-h-[44px] py-2.5 rounded
                hover:bg-green-500/10 transition-colors uppercase tracking-wider bg-green-500/5"
            >
              Debrief &#8594;
            </button>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* ── Mission Top Bar ───────────────────────────────────────── */}
      {/* Mobile: compact — back + title only */}
      <div className="md:hidden flex-shrink-0 h-12 border-b border-green-500/10 flex items-center px-4 gap-3 z-40">
        <button
          onClick={() => router.back()}
          className="text-green-500/40 hover:text-green-400 font-mono text-sm transition-colors flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          &#8592;
        </button>
        <div className="h-4 w-px bg-green-500/10" />
        <div className="flex-1 min-w-0">
          <h1 className="font-mono text-sm text-green-400 truncate">
            {mission.title}
          </h1>
        </div>
      </div>

      {/* Desktop: full top bar with all controls */}
      <div className="hidden md:flex flex-shrink-0 h-10 border-b border-green-500/10 items-center px-3 gap-3 z-40">
        <button
          onClick={() => router.back()}
          className="text-green-500/40 hover:text-green-400 font-mono text-xs transition-colors flex-shrink-0"
        >
          &#8592;
        </button>
        <div className="h-4 w-px bg-green-500/10" />
        <div className="flex-1 min-w-0">
          <h1 className="font-mono text-xs text-green-400 truncate">
            {mission.title}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          <span className="font-mono text-xs text-green-500/60 tabular-nums tracking-wider">
            {timer}
          </span>
        </div>
        <div className="h-4 w-px bg-green-500/10" />
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="font-mono text-xs text-green-500/40 uppercase tracking-wider">
            Evidence
          </span>
          <span className="font-mono text-xs text-green-400 tabular-nums">{evidenceCount}</span>
        </div>
        <div className="h-4 w-px bg-green-500/10" />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCompleteMission}
          className="flex-shrink-0 border border-green-500/30 text-green-400 font-mono text-xs px-3 py-1.5
            rounded hover:bg-green-500/10 transition-colors uppercase tracking-wider"
        >
          Complete
        </motion.button>
        <button
          onClick={() => setAutopilotOpen(true)}
          disabled={autopilotOpen}
          className="flex-shrink-0 flex items-center gap-1.5 border border-yellow-500/30 rounded px-2 py-1.5
            font-mono text-xs uppercase tracking-wider transition-colors
            text-yellow-400/70 hover:text-yellow-400 hover:border-yellow-500/50 hover:bg-yellow-500/5
            disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
          Autopilot
        </button>
        <button
          onClick={toggleGhost}
          className={`flex-shrink-0 flex items-center gap-1.5 border rounded px-2 py-1.5
            font-mono text-xs uppercase tracking-wider transition-colors ${
              ghostOpen
                ? 'border-green-400/40 text-green-400 bg-green-500/10'
                : 'border-green-500/20 text-green-500/40 hover:text-green-400 hover:border-green-500/40'
            }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Ghost
        </button>
      </div>

      {/* ── Mobile Bottom Bar ──────────────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 border-t border-green-500/10 px-4 py-2 pb-[env(safe-area-inset-bottom,8px)]">
        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <span className="font-mono text-xs text-green-500/60 tabular-nums">
              {timer}
            </span>
          </div>

          {/* Evidence count */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="font-mono text-xs text-green-400 tabular-nums">{evidenceCount}</span>
            <span className="font-mono text-xs text-green-500/40">ev</span>
          </div>

          {/* Complete button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleCompleteMission}
            className="flex-1 border border-green-500/30 text-green-400 font-mono text-xs min-h-[44px]
              rounded hover:bg-green-500/10 transition-colors uppercase tracking-wider"
          >
            Complete
          </motion.button>

          {/* Autopilot button */}
          <button
            onClick={() => setAutopilotOpen(true)}
            disabled={autopilotOpen}
            className="flex-shrink-0 flex items-center gap-1.5 border border-yellow-500/30 rounded px-3 min-h-[44px]
              font-mono text-xs uppercase tracking-wider transition-colors
              text-yellow-400/70 hover:text-yellow-400 hover:border-yellow-500/50 hover:bg-yellow-500/5
              disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
            <span className="hidden xs:inline">Auto</span>
          </button>
        </div>
      </div>

      {/* ── Main Content Area ─────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Investigation Area */}
        <div className="flex-1 overflow-hidden pb-20 md:pb-0">
          {investigationType === 'dark-pattern-hunt' && (
            <DarkPatternHunt
              onComplete={(score, findings, total) => handleInvestigationComplete(score)}
              onEvidenceAdd={handleEvidenceAdd}
            />
          )}
          {investigationType === 'price-discrimination' && (
            <PriceDiscrimination
              onComplete={(findings) => handleInvestigationComplete(findings)}
              onEvidenceAdd={handleEvidenceAdd}
            />
          )}
          {investigationType === 'filter-bubble-viz' && (
            <FilterBubbleViz
              onComplete={(score) => handleInvestigationComplete(score)}
              onEvidenceAdd={handleEvidenceAdd}
            />
          )}
          {investigationType === 'data-broker-map' && (
            <DataBrokerMap
              onComplete={(score) => handleInvestigationComplete(score)}
              onEvidenceAdd={handleEvidenceAdd}
            />
          )}
          {investigationType === 'sentiment-game' && (
            <SentimentGame
              mission={mission}
              onComplete={(score) => handleInvestigationComplete(score)}
            />
          )}
          {investigationType === 'algo-audit-game' && (
            <AlgoAuditGame
              mission={mission}
              onComplete={(score) => handleInvestigationComplete(score)}
            />
          )}
          {investigationType === 'generic' && (
            <GenericInvestigation
              mission={mission}
              onComplete={() => handleInvestigationComplete()}
              onEvidenceAdd={handleEvidenceAdd}
            />
          )}
        </div>

        {/* GHOST Sidebar (Desktop) */}
        <AnimatePresence>
          {ghostOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="hidden md:flex flex-shrink-0 border-l border-green-500/10 flex-col overflow-hidden bg-black/60"
            >
              {/* GHOST header */}
              <div className="flex-shrink-0 h-8 border-b border-green-500/10 flex items-center px-3 justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-mono text-xs text-green-500/60 uppercase tracking-widest">
                    Ghost AI
                  </span>
                </div>
                <button
                  onClick={toggleGhost}
                  className="text-green-500/30 hover:text-green-400 font-mono text-xs transition-colors"
                >
                  &#10005;
                </button>
              </div>

              {/* Chat */}
              <AgentChat
                systemPrompt={ghostSystemPrompt}
                initialMessage={`Mission loaded: ${mission.title}. I'm monitoring your investigation, ${profile.codename}. Ask me anything about dark patterns, data sources, or investigation strategy. I'm here to help you see what they don't want you to see.`}
                className="flex-1"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mobile GHOST FAB ──────────────────────────────────────── */}
      <div className="md:hidden">
        {/* Floating action button — positioned above the mobile bottom bar */}
        {!ghostMobileOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { whoosh(); setGhostMobileOpen(true) }}
            className="fixed bottom-[72px] right-4 z-50 w-12 h-12 bg-green-500/20 border border-green-500/30
              rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg
              shadow-green-500/10 min-h-[44px] min-w-[44px]"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </motion.button>
        )}

        {/* Mobile GHOST modal */}
        <AnimatePresence>
          {ghostMobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setGhostMobileOpen(false)}
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              />

              {/* Modal */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed inset-x-0 bottom-0 z-50 h-[70vh] bg-black border-t border-green-500/20
                  rounded-t-xl flex flex-col overflow-hidden"
              >
                {/* Mobile header */}
                <div className="flex-shrink-0 h-10 border-b border-green-500/10 flex items-center px-4 justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="font-mono text-xs text-green-500/60 uppercase tracking-widest">
                      Ghost AI
                    </span>
                  </div>
                  <button
                    onClick={() => setGhostMobileOpen(false)}
                    className="text-green-500/40 hover:text-green-400 font-mono text-sm transition-colors"
                  >
                    &#10005;
                  </button>
                </div>

                {/* Chat */}
                <AgentChat
                  systemPrompt={ghostSystemPrompt}
                  initialMessage={`Mission active: ${mission.title}. How can I help, ${profile.codename}?`}
                  className="flex-1"
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* AutoInvestigate Overlay */}
      <AnimatePresence>
        {autopilotOpen && (
          <AutoInvestigate
            mission={mission}
            onComplete={(run: InvestigationRun) => {
              setEvidenceCount(prev => prev + run.cycles.filter(c => c.rating === 'CONFIRMED').length)
            }}
            onClose={() => setAutopilotOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
