'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDatavist } from '@/lib/store/useDatavist'
import { CHAPTERS, isChapterUnlocked, isChapterComplete } from '@/lib/data/chapters'
import { getMissionIdBySlug, getMissionsBySlugs } from '@/lib/data/missions'
import { ChapterBriefing } from './ChapterBriefing'
import type { Chapter } from '@/lib/data/chapters'

type ChapterStatus = 'completed' | 'current' | 'locked'

export function ChapterMap() {
  const { profile } = useDatavist()
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)

  const completedMissionIds = profile?.missionsCompleted ?? []
  const completedChapterIds = profile?.chaptersCompleted ?? []
  const currentChapterNumber = profile?.currentChapter ?? 1

  const chapterStatuses = useMemo(() => {
    return CHAPTERS.map(chapter => {
      const unlocked = isChapterUnlocked(chapter, completedMissionIds, completedChapterIds)
      const complete = isChapterComplete(chapter, completedMissionIds, getMissionIdBySlug)

      let status: ChapterStatus = 'locked'
      if (complete) {
        status = 'completed'
      } else if (unlocked) {
        status = 'current'
      }

      // Count completed missions in this chapter
      const chapterMissions = getMissionsBySlugs(chapter.missionSlugs)
      const completedInChapter = chapterMissions.filter(m =>
        completedMissionIds.includes(m.id)
      ).length

      return {
        chapter,
        status,
        completedMissions: completedInChapter,
        totalMissions: chapter.missionSlugs.length,
      }
    })
  }, [completedMissionIds, completedChapterIds])

  const handleChapterClick = (chapter: Chapter, status: ChapterStatus) => {
    if (status !== 'locked') {
      setSelectedChapter(chapter)
    }
  }

  return (
    <>
      <div className="w-full">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-green-500/10" />
          <span className="text-green-400/30 text-[0.6rem] tracking-[0.3em] font-mono">
            OPERATION TIMELINE
          </span>
          <div className="h-px flex-1 bg-green-500/10" />
        </div>

        {/* Chapter timeline */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[19px] top-4 bottom-4 w-px bg-green-500/10 md:hidden" />

          {/* Desktop: horizontal layout */}
          <div className="hidden md:flex items-stretch gap-0 relative">
            {/* Horizontal connector line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-green-500/10 -translate-y-1/2" />

            {chapterStatuses.map(({ chapter, status, completedMissions, totalMissions }, index) => (
              <ChapterNode
                key={chapter.id}
                chapter={chapter}
                status={status}
                completedMissions={completedMissions}
                totalMissions={totalMissions}
                index={index}
                onClick={() => handleChapterClick(chapter, status)}
              />
            ))}
          </div>

          {/* Mobile: vertical layout */}
          <div className="flex flex-col gap-2 md:hidden">
            {chapterStatuses.map(({ chapter, status, completedMissions, totalMissions }, index) => (
              <ChapterNodeMobile
                key={chapter.id}
                chapter={chapter}
                status={status}
                completedMissions={completedMissions}
                totalMissions={totalMissions}
                index={index}
                onClick={() => handleChapterClick(chapter, status)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Chapter briefing overlay */}
      <AnimatePresence>
        {selectedChapter && (
          <ChapterBriefing
            chapter={selectedChapter}
            onClose={() => setSelectedChapter(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Desktop Chapter Node ────────────────────────────────────────────

interface ChapterNodeProps {
  chapter: Chapter
  status: ChapterStatus
  completedMissions: number
  totalMissions: number
  index: number
  onClick: () => void
}

function ChapterNode({ chapter, status, completedMissions, totalMissions, index, onClick }: ChapterNodeProps) {
  const isCompleted = status === 'completed'
  const isCurrent = status === 'current'
  const isLocked = status === 'locked'

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={onClick}
      disabled={isLocked}
      className={`
        relative flex-1 px-3 py-4 font-mono text-left z-10
        transition-all duration-300 group
        ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {/* Node dot */}
      <div className="flex justify-center mb-3">
        <div className="relative">
          <div
            className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center
              transition-all duration-300
              ${isCompleted
                ? 'border-green-400 bg-green-400/20 shadow-[0_0_12px_rgba(0,255,65,0.3)]'
                : isCurrent
                  ? 'border-green-400 bg-black shadow-[0_0_8px_rgba(0,255,65,0.2)]'
                  : 'border-green-500/20 bg-black/50'
              }
            `}
          >
            {isCompleted && (
              <span className="text-green-400 text-[0.5rem] font-bold">&#10003;</span>
            )}
            {isCurrent && (
              <motion.div
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            {isLocked && (
              <span className="text-green-500/30 text-[0.45rem]">&#9679;</span>
            )}
          </div>

          {/* Pulsing ring for current chapter */}
          {isCurrent && (
            <motion.div
              className="absolute inset-0 rounded-full border border-green-400/30"
              animate={{
                scale: [1, 1.8],
                opacity: [0.4, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
      </div>

      {/* Chapter info */}
      <div className="text-center">
        <div
          className={`
            text-[0.55rem] tracking-[0.15em] mb-1
            ${isCompleted
              ? 'text-green-400/60'
              : isCurrent
                ? 'text-green-400'
                : 'text-green-500/20'
            }
          `}
        >
          CH.{chapter.number}
        </div>
        <div
          className={`
            text-[0.6rem] tracking-wider font-bold mb-1.5 leading-tight
            ${isCompleted
              ? 'text-green-400/50'
              : isCurrent
                ? 'text-green-300 group-hover:text-green-200'
                : 'text-green-500/15'
            }
          `}
        >
          {isLocked ? '??????' : chapter.title}
        </div>
        <div
          className={`
            text-[0.5rem] tracking-wider
            ${isCompleted
              ? 'text-green-400/30'
              : isCurrent
                ? 'text-green-400/50'
                : 'text-green-500/10'
            }
          `}
        >
          {isLocked
            ? 'LOCKED'
            : `${completedMissions}/${totalMissions} MISSIONS`
          }
        </div>
      </div>

      {/* Current chapter indicator */}
      {isCurrent && (
        <motion.div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-green-400/40 text-[0.45rem] tracking-[0.2em]"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ACTIVE
        </motion.div>
      )}
    </motion.button>
  )
}

// ─── Mobile Chapter Node ────────────────────────────────────────────

function ChapterNodeMobile({ chapter, status, completedMissions, totalMissions, index, onClick }: ChapterNodeProps) {
  const isCompleted = status === 'completed'
  const isCurrent = status === 'current'
  const isLocked = status === 'locked'

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      onClick={onClick}
      disabled={isLocked}
      className={`
        relative flex items-center gap-4 px-3 py-3 font-mono text-left z-10
        transition-all duration-300 group
        ${isCurrent ? 'bg-green-400/5 border border-green-500/20 rounded-sm' : ''}
        ${isLocked ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}
      `}
    >
      {/* Node dot */}
      <div className="relative flex-shrink-0">
        <div
          className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center
            ${isCompleted
              ? 'border-green-400 bg-green-400/20 shadow-[0_0_10px_rgba(0,255,65,0.3)]'
              : isCurrent
                ? 'border-green-400 bg-black shadow-[0_0_8px_rgba(0,255,65,0.2)]'
                : 'border-green-500/20 bg-black/50'
            }
          `}
        >
          {isCompleted && (
            <span className="text-green-400 text-[0.5rem] font-bold">&#10003;</span>
          )}
          {isCurrent && (
            <motion.div
              className="w-2 h-2 rounded-full bg-green-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
          {isLocked && (
            <span className="text-green-500/30 text-[0.45rem]">&#9679;</span>
          )}
        </div>

        {isCurrent && (
          <motion.div
            className="absolute inset-0 rounded-full border border-green-400/30"
            animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>

      {/* Chapter info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`
              text-[0.55rem] tracking-[0.15em]
              ${isCompleted ? 'text-green-400/50' : isCurrent ? 'text-green-400' : 'text-green-500/20'}
            `}
          >
            CH.{chapter.number}
          </span>
          <span
            className={`
              text-[0.65rem] tracking-wider font-bold truncate
              ${isCompleted ? 'text-green-400/50' : isCurrent ? 'text-green-300' : 'text-green-500/15'}
            `}
          >
            {isLocked ? '??????' : chapter.title}
          </span>
        </div>
      </div>

      {/* Mission count */}
      <div
        className={`
          text-[0.5rem] tracking-wider flex-shrink-0
          ${isCompleted ? 'text-green-400/30' : isCurrent ? 'text-green-400/50' : 'text-green-500/10'}
        `}
      >
        {isLocked ? 'LOCKED' : `${completedMissions}/${totalMissions}`}
      </div>
    </motion.button>
  )
}
