'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { AgentChat } from '@/components/ai/AgentChat'
import { MissionSidebar } from '@/components/workbench/MissionSidebar'
import { AutoInvestigate } from '@/components/workbench/AutoInvestigate'
import { AutopilotButton } from '@/components/workbench/AutopilotButton'
import { buildSystemPrompt } from '@/lib/ai/system-prompts'
import { useDatavist } from '@/lib/store/useDatavist'
import { whoosh, success } from '@/lib/audio/procedural'
import type { InvestigationRun } from '@/lib/ai/auto-investigate'
import type { Mission } from '@/lib/data/missions'

// ─── Props ───────────────────────────────────────────────────────────

interface WorkbenchProps {
  mission: Mission
}

// ─── Role-specific opening lines ─────────────────────────────────────

const ROLE_OPENINGS: Record<string, string> = {
  warrior:
    "I've mapped the data landscape and identified the key vectors for analysis. Let's be precise about this.",
  rebel:
    "I've already started thinking about what tools we can build to crack this open. Let's get to work.",
  artist:
    "I can already see the story this data wants to tell. Let's make it impossible to ignore.",
  explorer:
    "I've done some preliminary digging and something already doesn't add up. Let's follow the trail.",
}

// ─── Component ───────────────────────────────────────────────────────

export function Workbench({ mission }: WorkbenchProps) {
  const { profile, startMission, completeMission } = useDatavist()
  const router = useRouter()

  // Panel visibility state
  const [leftOpen, setLeftOpen] = useState(true)
  const [rightOpen, setRightOpen] = useState(false)
  const [mobilePanel, setMobilePanel] = useState<'chat' | 'mission' | 'notes'>('chat')

  // Objectives tracking
  const [completedObjectives, setCompletedObjectives] = useState<string[]>([])

  // Notes
  const [notes, setNotes] = useState('')
  const [intelCount, setIntelCount] = useState(0)

  // Autopilot
  const [autopilotActive, setAutopilotActive] = useState(false)

  // Mark mission as active on mount
  useEffect(() => {
    if (profile) {
      startMission(mission.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Build system prompt with mission context ──
  const systemPrompt = profile
    ? `${buildSystemPrompt(profile.role, profile.motivation, profile.codename)}

ACTIVE MISSION CONTEXT:
Mission: "${mission.title}"
Category: ${mission.category}
Difficulty: ${mission.difficulty}

MISSION BRIEFING:
${mission.briefing}

OBJECTIVES THE OPERATIVE MUST COMPLETE:
${mission.objectives.map((o, i) => `${i + 1}. ${o}`).join('\n')}

SUGGESTED DATA SOURCES:
${mission.dataSources.map((s) => `- ${s}`).join('\n')}

INSTRUCTIONS:
- Help the operative complete the mission objectives listed above
- Proactively suggest investigation approaches and data analysis strategies
- When the operative asks for help, provide concrete, actionable guidance
- Reference specific objectives when relevant ("This addresses Objective 2...")
- If the operative seems stuck, suggest next steps based on incomplete objectives
- Format findings as structured intel reports when appropriate
- Remember: this is a real investigation using real public data`
    : ''

  // ── Initial AI message ──
  const roleOpening = profile ? ROLE_OPENINGS[profile.role] || ROLE_OPENINGS.explorer : ''
  const initialMessage = `Mission **${mission.title}** loaded. I've reviewed the brief. ${roleOpening}\n\nWhere do you want to start?`

  // ── Objective toggling ──
  const handleToggleObjective = useCallback((objective: string) => {
    setCompletedObjectives((prev) =>
      prev.includes(objective)
        ? prev.filter((o) => o !== objective)
        : [...prev, objective]
    )
  }, [])

  // ── Mission completion ──
  const handleComplete = useCallback(() => {
    if (completedObjectives.length === 0 || !profile) return

    success()
    completeMission(mission.id, mission.influenceReward)

    // Navigate to debrief with a brief delay for the sound
    setTimeout(() => {
      router.push(`/missions/${mission.slug}/debrief`)
    }, 400)
  }, [completedObjectives, profile, mission, completeMission, router])

  // ── Notes handling ──
  const handleNotesChange = useCallback((value: string) => {
    setNotes(value)
    // Count non-empty lines as "intel"
    const lines = value.split('\n').filter((l) => l.trim().length > 0)
    setIntelCount(lines.length)
  }, [])

  // ── Autopilot complete handler — add findings to notes ──
  const handleAutopilotComplete = useCallback((run: InvestigationRun) => {
    const findings = run.cycles
      .map((c) => `[${c.rating}] ${c.finding}`)
      .join('\n')
    const autopilotNotes = `\n\n--- GHOST AUTOPILOT FINDINGS ---\n${findings}${run.summary ? `\n\n--- SUMMARY ---\n${run.summary}` : ''}\n`
    setNotes((prev) => prev + autopilotNotes)
    const lines = (notes + autopilotNotes).split('\n').filter((l) => l.trim().length > 0)
    setIntelCount(lines.length)
    // Auto-open the notes panel so the user sees them
    setRightOpen(true)
  }, [notes])

  // ── Toggle panels with sound ──
  const toggleLeft = useCallback(() => {
    whoosh()
    setLeftOpen((p) => !p)
  }, [])

  const toggleRight = useCallback(() => {
    whoosh()
    setRightOpen((p) => !p)
  }, [])

  return (
    <div className="h-[calc(100vh-48px)] flex flex-col bg-black font-mono">
      {/* ─── Mobile tab bar ─── */}
      <div className="md:hidden flex border-b border-green-500/15 bg-black/90">
        {(['mission', 'chat', 'notes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              whoosh()
              setMobilePanel(tab)
            }}
            className={`
              flex-1 py-2.5 text-[0.65rem] tracking-[0.15em] uppercase font-bold
              transition-all duration-200 border-b-2
              ${
                mobilePanel === tab
                  ? 'text-green-400 border-green-400 bg-green-500/5'
                  : 'text-green-400/30 border-transparent hover:text-green-400/50'
              }
            `}
          >
            {tab === 'mission' && 'MISSION'}
            {tab === 'chat' && 'GHOST'}
            {tab === 'notes' && 'NOTES'}
          </button>
        ))}
      </div>

      {/* ─── Desktop layout ─── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ─── Left sidebar: Mission context ─── */}
        <AnimatePresence initial={false}>
          {leftOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="hidden md:block flex-shrink-0 overflow-hidden"
            >
              <MissionSidebar
                mission={mission}
                completedObjectives={completedObjectives}
                onToggleObjective={handleToggleObjective}
                onComplete={handleComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile: Mission panel */}
        {mobilePanel === 'mission' && (
          <div className="md:hidden w-full h-full">
            <MissionSidebar
              mission={mission}
              completedObjectives={completedObjectives}
              onToggleObjective={handleToggleObjective}
              onComplete={handleComplete}
            />
          </div>
        )}

        {/* ─── Center: AI Chat ─── */}
        <div
          className={`
            flex-1 flex flex-col min-w-0
            ${mobilePanel !== 'chat' ? 'hidden md:flex' : 'flex'}
          `}
        >
          {/* Desktop panel toggle buttons */}
          <div className="hidden md:flex items-center gap-1 px-2 py-1.5 border-b border-green-500/10 bg-black/60">
            <button
              onClick={toggleLeft}
              className={`
                px-2.5 py-1 text-[0.55rem] tracking-[0.1em] rounded-sm transition-all
                ${
                  leftOpen
                    ? 'text-green-400/70 bg-green-500/10 hover:bg-green-500/15'
                    : 'text-green-400/30 hover:text-green-400/50 hover:bg-green-500/5'
                }
              `}
            >
              {leftOpen ? '[ HIDE MISSION ]' : '[ SHOW MISSION ]'}
            </button>

            <div className="flex-1" />

            {/* GHOST Autopilot button */}
            <AutopilotButton
              onClick={() => {
                whoosh()
                setAutopilotActive(true)
              }}
              disabled={autopilotActive}
            />

            {/* Status indicator */}
            <div className="flex items-center gap-2 mr-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-400/30 text-[0.55rem] tracking-[0.15em]">
                SECURE WORKBENCH
              </span>
            </div>

            <button
              onClick={toggleRight}
              className={`
                px-2.5 py-1 text-[0.55rem] tracking-[0.1em] rounded-sm transition-all
                ${
                  rightOpen
                    ? 'text-green-400/70 bg-green-500/10 hover:bg-green-500/15'
                    : 'text-green-400/30 hover:text-green-400/50 hover:bg-green-500/5'
                }
              `}
            >
              {rightOpen ? '[ HIDE NOTES ]' : '[ SHOW NOTES ]'}
            </button>
          </div>

          {/* Chat */}
          <AgentChat
            systemPrompt={systemPrompt}
            initialMessage={initialMessage}
            conversationId={`MISSION-${mission.id}`}
            className="flex-1 border-0 rounded-none"
          />
        </div>

        {/* ─── Right sidebar: Notes ─── */}
        <AnimatePresence initial={false}>
          {rightOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="hidden md:flex flex-shrink-0 flex-col overflow-hidden border-l border-green-500/15 bg-black/95"
            >
              <NotesPanel
                notes={notes}
                intelCount={intelCount}
                onChange={handleNotesChange}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile: Notes panel */}
        {mobilePanel === 'notes' && (
          <div className="md:hidden w-full h-full bg-black/95">
            <NotesPanel
              notes={notes}
              intelCount={intelCount}
              onChange={handleNotesChange}
            />
          </div>
        )}
      </div>

      {/* ─── Autopilot overlay ─── */}
      <AnimatePresence>
        {autopilotActive && (
          <AutoInvestigate
            mission={mission}
            onComplete={handleAutopilotComplete}
            onClose={() => setAutopilotActive(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Notes Panel ─────────────────────────────────────────────────────

interface NotesPanelProps {
  notes: string
  intelCount: number
  onChange: (value: string) => void
}

function NotesPanel({ notes, intelCount, onChange }: NotesPanelProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-green-500/10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-green-400/40 text-[0.6rem] tracking-[0.3em] uppercase">
            // FIELD NOTES
          </span>
          <span className="text-green-400/30 text-[0.6rem] tabular-nums">
            {intelCount} INTEL COLLECTED
          </span>
        </div>
        <div className="text-green-400/20 text-[0.55rem]">
          Paste findings, URLs, and analysis notes below
        </div>
      </div>

      {/* Textarea */}
      <div className="flex-1 p-4">
        <textarea
          value={notes}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Paste your findings here...\n\nExamples:\n- Key data points discovered\n- URLs of evidence\n- Analysis conclusions\n- Screenshots notes`}
          className="
            w-full h-full bg-transparent text-green-300/80 text-[0.75rem]
            font-mono leading-relaxed resize-none outline-none
            placeholder:text-green-400/15
            border border-green-500/10 rounded-sm p-3
            focus:border-green-500/30 transition-colors
          "
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent 0px, transparent 22px, rgba(0,255,65,0.02) 22px, rgba(0,255,65,0.02) 23px)',
          }}
        />
      </div>

      {/* Intel count badge */}
      {intelCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 pb-4"
        >
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/15 rounded-sm">
            <div className="w-2 h-2 rounded-full bg-green-400/60" />
            <span className="text-green-400/60 text-[0.6rem] tracking-wider">
              {intelCount} item{intelCount !== 1 ? 's' : ''} logged
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
