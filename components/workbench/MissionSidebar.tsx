'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { Mission } from '@/lib/data/missions'
import { scan } from '@/lib/audio/procedural'

// ─── Category & Difficulty Styles ────────────────────────────────────

const CATEGORY_COLORS: Record<Mission['category'], { bg: string; text: string }> = {
  greenwashing: { bg: 'bg-green-500/15', text: 'text-green-400' },
  pricing: { bg: 'bg-yellow-500/15', text: 'text-yellow-400' },
  manipulation: { bg: 'bg-red-500/15', text: 'text-red-400' },
  surveillance: { bg: 'bg-cyan-500/15', text: 'text-cyan-400' },
  inequality: { bg: 'bg-purple-500/15', text: 'text-purple-400' },
}

const DIFFICULTY_COLORS: Record<Mission['difficulty'], { text: string; label: string }> = {
  recruit: { text: 'text-green-400', label: 'RECRUIT' },
  operative: { text: 'text-yellow-400', label: 'OPERATIVE' },
  elite: { text: 'text-red-400', label: 'ELITE' },
}

// ─── Props ───────────────────────────────────────────────────────────

interface MissionSidebarProps {
  mission: Mission
  completedObjectives: string[]
  onToggleObjective: (objective: string) => void
  onComplete: () => void
}

// ─── Component ───────────────────────────────────────────────────────

export function MissionSidebar({
  mission,
  completedObjectives,
  onToggleObjective,
  onComplete,
}: MissionSidebarProps) {
  const categoryStyle = CATEGORY_COLORS[mission.category]
  const difficultyStyle = DIFFICULTY_COLORS[mission.difficulty]
  const canComplete = completedObjectives.length > 0

  return (
    <div className="h-full flex flex-col bg-black/95 border-r border-green-500/15 relative overflow-hidden">
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.02]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,255,65,0.04) 2px, rgba(0,255,65,0.04) 4px)',
        }}
      />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto relative z-20">
        {/* Header: Mission title */}
        <div className="p-4 border-b border-green-500/10">
          <div className="text-green-400/30 text-[0.6rem] tracking-[0.3em] mb-2">
            // MISSION DOSSIER
          </div>
          <h2
            className="text-green-300 text-base font-bold tracking-wider leading-tight mb-3"
            style={{ textShadow: '0 0 8px rgba(0,255,65,0.15)' }}
          >
            {mission.title.toUpperCase()}
          </h2>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[0.6rem] tracking-[0.12em] px-2 py-0.5 rounded-sm uppercase font-bold ${categoryStyle.bg} ${categoryStyle.text}`}
            >
              {mission.category}
            </span>
            <span className={`text-[0.6rem] tracking-[0.1em] ${difficultyStyle.text}`}>
              {difficultyStyle.label}
            </span>
            <span className="text-green-400/30 text-[0.6rem]">
              {mission.estimatedTime}
            </span>
          </div>
        </div>

        {/* Objectives */}
        <div className="p-4 border-b border-green-500/10">
          <div className="text-green-400/40 text-[0.6rem] tracking-[0.2em] mb-3 uppercase">
            Objectives ({completedObjectives.length}/{mission.objectives.length})
          </div>

          <div className="space-y-2">
            {mission.objectives.map((objective, i) => {
              const isChecked = completedObjectives.includes(objective)
              return (
                <motion.button
                  key={i}
                  onClick={() => {
                    onToggleObjective(objective)
                    if (!isChecked) scan()
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full text-left flex items-start gap-2.5 p-2 rounded-sm
                    transition-all duration-200 group
                    ${isChecked ? 'bg-green-500/10' : 'hover:bg-green-500/5'}
                  `}
                >
                  {/* Checkbox */}
                  <div
                    className={`
                      mt-0.5 w-4 h-4 flex-shrink-0 border rounded-sm flex items-center justify-center
                      transition-all duration-200
                      ${
                        isChecked
                          ? 'border-green-400 bg-green-500/20'
                          : 'border-green-500/30 group-hover:border-green-400/50'
                      }
                    `}
                  >
                    <AnimatePresence>
                      {isChecked && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="text-green-400 text-[0.6rem] font-bold"
                        >
                          &#10003;
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Label */}
                  <span
                    className={`
                      text-[0.7rem] leading-relaxed transition-colors duration-200
                      ${isChecked ? 'text-green-300 line-through opacity-70' : 'text-green-400/70'}
                    `}
                  >
                    {objective}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Data Sources */}
        <div className="p-4 border-b border-green-500/10">
          <div className="text-green-400/40 text-[0.6rem] tracking-[0.2em] mb-3 uppercase">
            Intel Sources
          </div>

          <div className="space-y-1.5">
            {mission.dataSources.map((source, i) => {
              // Check if the source contains a URL-like pattern
              const urlMatch = source.match(/\(([^)]+\.[^)]+)\)/)
              const url = urlMatch ? `https://${urlMatch[1].replace(/^https?:\/\//, '')}` : null
              const label = url ? source.replace(/\s*\([^)]+\)/, '') : source

              return (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-green-500/30 text-[0.6rem] mt-0.5 flex-shrink-0">
                    &#9670;
                  </span>
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.65rem] text-green-400/60 hover:text-green-300 underline underline-offset-2 decoration-green-500/20 hover:decoration-green-400/40 transition-colors"
                    >
                      {label}
                    </a>
                  ) : (
                    <span className="text-[0.65rem] text-green-400/50">{label}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Reward info */}
        <div className="p-4">
          <div className="text-green-400/40 text-[0.6rem] tracking-[0.2em] mb-2 uppercase">
            Mission Reward
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-300 text-sm font-bold tabular-nums">
              +{mission.influenceReward}
            </span>
            <span className="text-green-400/40 text-[0.6rem] tracking-wider">INFLUENCE</span>
          </div>
        </div>
      </div>

      {/* Complete Mission Button — pinned at bottom */}
      <div className="relative z-20 p-4 border-t border-green-500/15 bg-black/80">
        <motion.button
          onClick={onComplete}
          disabled={!canComplete}
          whileHover={canComplete ? { scale: 1.02 } : undefined}
          whileTap={canComplete ? { scale: 0.98 } : undefined}
          className={`
            w-full py-3 font-mono text-sm font-bold tracking-[0.15em] rounded-sm
            transition-all duration-300 relative overflow-hidden
            ${
              canComplete
                ? 'bg-green-500/20 text-green-300 border border-green-400/60 hover:bg-green-500/30 cursor-pointer'
                : 'bg-green-500/5 text-green-400/25 border border-green-500/10 cursor-not-allowed'
            }
          `}
          style={
            canComplete
              ? {
                  boxShadow: '0 0 20px rgba(0,255,65,0.15), inset 0 0 20px rgba(0,255,65,0.05)',
                }
              : undefined
          }
        >
          {/* Glow pulse when enabled */}
          {canComplete && (
            <motion.div
              className="absolute inset-0 bg-green-400/10 rounded-sm"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <span className="relative z-10">COMPLETE MISSION</span>
        </motion.button>

        {!canComplete && (
          <div className="text-center mt-2 text-green-400/20 text-[0.55rem] tracking-wider">
            CHECK AT LEAST 1 OBJECTIVE TO COMPLETE
          </div>
        )}
      </div>
    </div>
  )
}
