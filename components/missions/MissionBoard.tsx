'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MISSIONS } from '@/lib/data/missions'
import type { Mission } from '@/lib/data/missions'
import { useDatavist } from '@/lib/store/useDatavist'
import { CHAPTERS, isChapterUnlocked, getChapterForMission } from '@/lib/data/chapters'
import { MissionCard } from './MissionCard'
import { BriefingCinematic } from './BriefingCinematic'

type CategoryFilter = Mission['category'] | 'all'

const CATEGORY_FILTERS: { value: CategoryFilter; label: string; color: string }[] = [
  { value: 'all', label: 'ALL', color: 'text-green-400 border-green-400/30 hover:bg-green-400/10' },
  { value: 'greenwashing', label: 'GREENWASHING', color: 'text-green-400 border-green-500/30 hover:bg-green-500/10' },
  { value: 'pricing', label: 'PRICING', color: 'text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/10' },
  { value: 'manipulation', label: 'MANIPULATION', color: 'text-red-400 border-red-500/30 hover:bg-red-500/10' },
  { value: 'surveillance', label: 'SURVEILLANCE', color: 'text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10' },
  { value: 'inequality', label: 'INEQUALITY', color: 'text-purple-400 border-purple-500/30 hover:bg-purple-500/10' },
]

export function MissionBoard() {
  const { profile, startMission } = useDatavist()
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all')
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)

  const completedIds = profile?.missionsCompleted ?? []
  const completedChapterIds = profile?.chaptersCompleted ?? []

  // Determine which missions are unlocked based on chapter progression
  const missionAccessMap = useMemo(() => {
    const map = new Map<string, { unlocked: boolean; chapterNumber: number }>()

    MISSIONS.forEach(mission => {
      const chapter = getChapterForMission(mission.slug)
      if (chapter) {
        const unlocked = isChapterUnlocked(chapter, completedIds, completedChapterIds)
        map.set(mission.id, { unlocked, chapterNumber: chapter.number })
      } else {
        // Missions not assigned to any chapter are always available
        map.set(mission.id, { unlocked: true, chapterNumber: 0 })
      }
    })

    return map
  }, [completedIds, completedChapterIds])

  const filteredMissions = useMemo(() => {
    let missions = activeFilter === 'all'
      ? MISSIONS
      : MISSIONS.filter(m => m.category === activeFilter)

    return missions
  }, [activeFilter])

  // Count available (unlocked) missions
  const availableCount = useMemo(() => {
    return filteredMissions.filter(m => missionAccessMap.get(m.id)?.unlocked).length
  }, [filteredMissions, missionAccessMap])

  const handleMissionClick = useCallback((mission: Mission) => {
    const access = missionAccessMap.get(mission.id)
    if (access?.unlocked) {
      setSelectedMission(mission)
    }
  }, [missionAccessMap])

  const handleAccept = useCallback(() => {
    if (selectedMission) {
      startMission(selectedMission.id)
    }
  }, [selectedMission, startMission])

  const handleClose = useCallback(() => {
    setSelectedMission(null)
  }, [])

  return (
    <div className="relative px-6 pb-16">
      {/* Scanline overlay for whole board area */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,65,0.008) 3px, rgba(0,255,65,0.008) 6px)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Filter bar */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map(filter => {
            const isActive = activeFilter === filter.value
            return (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`
                  font-mono text-[0.6rem] tracking-[0.15em] px-3 py-1.5
                  border rounded-sm transition-all duration-200
                  ${filter.color}
                  ${isActive
                    ? 'bg-green-400/10 border-opacity-80 font-bold'
                    : 'border-opacity-30 opacity-60 hover:opacity-100'
                  }
                `}
              >
                {filter.label}
                {filter.value !== 'all' && (
                  <span className="ml-1.5 opacity-50">
                    ({MISSIONS.filter(m =>
                      filter.value === 'all' ? true : m.category === filter.value
                    ).length})
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Mission count */}
        <div className="mb-4 text-green-400/20 text-[0.6rem] tracking-[0.2em]">
          {availableCount} MISSION{availableCount !== 1 ? 'S' : ''} AVAILABLE
          {completedIds.length > 0 && (
            <span className="ml-4">
              // {completedIds.length} COMPLETED
            </span>
          )}
          {filteredMissions.length > availableCount && (
            <span className="ml-4">
              // {filteredMissions.length - availableCount} LOCKED
            </span>
          )}
        </div>

        {/* Mission grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredMissions.map((mission, index) => {
              const access = missionAccessMap.get(mission.id)
              const isLocked = !access?.unlocked
              const isCompleted = completedIds.includes(mission.id)

              return (
                <motion.div
                  key={mission.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {isLocked ? (
                    <LockedMissionCard
                      mission={mission}
                      chapterNumber={access?.chapterNumber ?? 0}
                    />
                  ) : (
                    <MissionCard
                      mission={mission}
                      isCompleted={isCompleted}
                      onClick={() => handleMissionClick(mission)}
                    />
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredMissions.length === 0 && (
          <div className="text-center py-20">
            <div className="text-green-400/20 text-sm tracking-wider">
              NO MISSIONS IN THIS CATEGORY
            </div>
            <div className="text-green-400/10 text-xs tracking-wider mt-2">
              Check back for new assignments
            </div>
          </div>
        )}
      </div>

      {/* Briefing cinematic overlay */}
      <AnimatePresence>
        {selectedMission && (
          <BriefingCinematic
            key={selectedMission.id}
            mission={selectedMission}
            onAccept={handleAccept}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Locked Mission Card ────────────────────────────────────────────

function LockedMissionCard({ mission, chapterNumber }: { mission: Mission; chapterNumber: number }) {
  return (
    <div
      className="
        relative w-full text-left p-5 font-mono
        border border-green-500/10 bg-black/80
        rounded-sm opacity-40 cursor-not-allowed
        select-none
      "
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.03) 2px, rgba(0,255,65,0.03) 4px)',
        }}
      />

      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center">
          <div className="text-green-500/30 text-2xl mb-1">&#9632;</div>
          <div className="text-green-500/20 text-[0.5rem] tracking-[0.2em]">
            CHAPTER {chapterNumber} REQUIRED
          </div>
        </div>
      </div>

      {/* Top row: redacted */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[0.65rem] tracking-[0.15em] px-2 py-0.5 rounded-sm uppercase font-bold bg-green-500/5 text-green-500/20">
          {mission.category}
        </span>
        <span className="text-[0.65rem] text-green-500/15 tracking-wider">
          CLASSIFIED
        </span>
      </div>

      {/* Title — partially redacted */}
      <h3 className="text-green-500/15 text-sm font-bold tracking-wider mb-2">
        {mission.title.split('').map((char, i) =>
          Math.random() > 0.4 ? char : '\u2588'
        ).join('')}
      </h3>

      {/* Description — redacted */}
      <p className="text-green-500/10 text-[0.7rem] leading-relaxed mb-4">
        [REDACTED — INSUFFICIENT CLEARANCE]
      </p>

      {/* Bottom row */}
      <div className="flex items-center justify-between border-t border-green-500/5 pt-3">
        <span className="text-green-500/10 text-[0.65rem] tracking-wider">
          LOCKED
        </span>
        <span className="text-green-500/10 text-[0.65rem] tracking-wider">
          CHAPTER {chapterNumber}
        </span>
      </div>
    </div>
  )
}
