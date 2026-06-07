'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useDatavist, ROLE_CONFIG } from '@/lib/store/useDatavist'
import { MissionBoard } from '@/components/missions/MissionBoard'
import { ChapterMap } from '@/components/story/ChapterMap'
import { ChapterBriefing } from '@/components/story/ChapterBriefing'
import { CHAPTERS, isChapterUnlocked, isChapterComplete, getChapterByNumber } from '@/lib/data/chapters'
import { getMissionIdBySlug } from '@/lib/data/missions'

export default function MissionsPage() {
  const { profile, completeChapter } = useDatavist()
  const router = useRouter()
  const [showBriefing, setShowBriefing] = useState(false)

  useEffect(() => {
    if (!profile) {
      router.push('/awaken')
    }
  }, [profile, router])

  // Auto-complete chapters when all their missions are done
  useEffect(() => {
    if (!profile) return

    CHAPTERS.forEach(chapter => {
      const unlocked = isChapterUnlocked(chapter, profile.missionsCompleted, profile.chaptersCompleted)
      const complete = isChapterComplete(chapter, profile.missionsCompleted, getMissionIdBySlug)

      if (unlocked && complete && !profile.chaptersCompleted.includes(chapter.id)) {
        completeChapter(chapter.id)
      }
    })
  }, [profile?.missionsCompleted, profile?.chaptersCompleted, completeChapter, profile])

  const currentChapter = useMemo(() => {
    return getChapterByNumber(profile?.currentChapter ?? 1)
  }, [profile?.currentChapter])

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4 animate-pulse">AUTHENTICATING OPERATIVE...</div>
        </div>
      </div>
    )
  }

  const roleConfig = ROLE_CONFIG[profile.role]

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Operative status bar */}
      <div className="border-b border-green-500/10 bg-black/60 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-green-400/40 text-xs">OPERATIVE:</span>
              <span className="text-green-300 text-xs font-bold tracking-wider">
                {profile.codename.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400/40 text-xs">ROLE:</span>
              <span className="text-xs font-bold tracking-wider" style={{ color: roleConfig.colorHex }}>
                {roleConfig.title.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-green-400/40 text-xs">CHAPTER:</span>
              <span className="text-green-300 text-xs font-bold tabular-nums">
                {profile.currentChapter ?? 1}/5
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400/40 text-xs">INFLUENCE:</span>
              <span className="text-green-300 text-xs font-bold tabular-nums">
                {profile.influenceScore.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Map */}
      <div className="px-6 pt-6 pb-2">
        <div className="max-w-7xl mx-auto">
          <ChapterMap />
        </div>
      </div>

      {/* Current chapter briefing button */}
      {currentChapter && (
        <div className="px-6 pt-2 pb-4">
          <div className="max-w-7xl mx-auto">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowBriefing(true)}
              className="
                flex items-center gap-3 px-4 py-2.5
                border border-green-500/20 bg-green-400/[0.03]
                hover:bg-green-400/[0.06] hover:border-green-500/30
                transition-all duration-200 rounded-sm group
              "
            >
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-green-400 text-[0.65rem]"
              >
                &#9656;
              </motion.span>
              <span className="text-green-400/50 text-[0.6rem] tracking-[0.15em] group-hover:text-green-400/70 transition-colors">
                CHAPTER {currentChapter.number} BRIEFING: {currentChapter.codename}
              </span>
            </motion.button>
          </div>
        </div>
      )}

      {/* Mission Board heading */}
      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-2 text-green-400/30 text-xs tracking-[0.5em]">
            // CLASSIFIED — AUTHORIZED PERSONNEL ONLY
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-green-400 tracking-wider mb-1">
            MISSION BOARD
          </h1>
          <div className="text-green-400/40 text-xs tracking-wider">
            SELECT A MISSION TO BEGIN YOUR INVESTIGATION
          </div>
        </div>
      </div>

      {/* Board */}
      <MissionBoard />

      {/* Chapter briefing overlay */}
      <AnimatePresence>
        {showBriefing && currentChapter && (
          <ChapterBriefing
            chapter={currentChapter}
            onClose={() => setShowBriefing(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
