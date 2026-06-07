'use client'

import { use, useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useDatavist, ROLE_CONFIG, type DatavistProfile } from '@/lib/store/useDatavist'
import { getMissionBySlug } from '@/lib/data/missions'
import { success, impact, scan, whoosh } from '@/lib/audio/procedural'

// ─── Types ───────────────────────────────────────────────────────────

type DebriefPhase =
  | 'blackout'
  | 'mission-complete'
  | 'title-reveal'
  | 'influence'
  | 'objectives'
  | 'assessment'
  | 'particles'
  | 'actions'

// ─── Impact Statements by Category ──────────────────────────────────

const IMPACT_STATEMENTS: Record<string, string[]> = {
  greenwashing: [
    'Your investigation exposed the gap between corporate PR and environmental reality.',
    'The evidence you gathered makes greenwashing harder to hide.',
    'Another layer of corporate deception documented and challenged.',
  ],
  pricing: [
    'Your analysis revealed how algorithms exploit users through discriminatory pricing.',
    'The pricing patterns you uncovered prove these systems are anything but neutral.',
    'Your work exposes the invisible tax that dynamic pricing imposes on vulnerable users.',
  ],
  manipulation: [
    'Your research documented the dark patterns designed to exploit human psychology.',
    'The manipulation techniques you cataloged can now be recognized and resisted.',
    'Your findings make the invisible mechanisms of digital manipulation visible.',
  ],
  surveillance: [
    'Your investigation revealed the true scope of surveillance infrastructure.',
    'The monitoring systems you documented can now be understood and challenged.',
    'Your work exposes the gap between privacy promises and surveillance reality.',
  ],
  inequality: [
    'Your analysis quantified the systemic inequalities hidden in plain sight.',
    'The data patterns you uncovered reveal how systems perpetuate inequality.',
    'Your findings transform abstract inequality into documented, actionable evidence.',
  ],
}

// ─── Liberation Code Generator ──────────────────────────────────────

function generateGhostCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const segment = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `GHOST-${segment()}-${segment()}`
}

// ─── Page ────────────────────────────────────────────────────────────

export default function MissionDebriefPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const { profile } = useDatavist()
  const router = useRouter()

  const mission = getMissionBySlug(resolvedParams.slug)

  // ── Redirect guards ──
  useEffect(() => {
    if (!profile) {
      router.push('/awaken')
      return
    }
    if (!mission) {
      router.push('/ops')
      return
    }
    // Check if mission was actually completed
    if (!profile.missionsCompleted.includes(mission.id)) {
      router.push(`/ops/investigate/${resolvedParams.slug}`)
      return
    }
  }, [profile, mission, router, resolvedParams.slug])

  if (!profile || !mission || !profile.missionsCompleted.includes(mission.id)) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="animate-pulse tracking-wider text-sm">LOADING DEBRIEF...</div>
      </div>
    )
  }

  return <DebriefCinematic mission={mission} profile={profile} />
}

// ─── Debrief Cinematic ──────────────────────────────────────────────

interface DebriefCinematicProps {
  mission: NonNullable<ReturnType<typeof getMissionBySlug>>
  profile: DatavistProfile
}

function DebriefCinematic({ mission, profile }: DebriefCinematicProps) {
  const router = useRouter()
  const [phase, setPhase] = useState<DebriefPhase>('blackout')
  const [countedInfluence, setCountedInfluence] = useState(0)
  const [skipped, setSkipped] = useState(false)
  const [liberationCode] = useState(generateGhostCode)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [particles, setParticles] = useState<{ x: number; y: number; delay: number }[]>([])
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([])

  const roleConfig = ROLE_CONFIG[profile.role]

  // Get a random impact statement for this mission's category
  const impactStatement =
    IMPACT_STATEMENTS[mission!.category]?.[
      Math.floor(Math.random() * (IMPACT_STATEMENTS[mission!.category]?.length || 1))
    ] || 'Your investigation has made a difference.'

  // ── Phase progression ──
  const advancePhase = useCallback(
    (nextPhase: DebriefPhase, delay: number) => {
      const timer = setTimeout(() => setPhase(nextPhase), delay)
      timerRefs.current.push(timer)
      return timer
    },
    []
  )

  useEffect(() => {
    if (skipped) return

    // Generate particle positions
    setParticles(
      Array.from({ length: 40 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      }))
    )

    // Phase timeline
    advancePhase('mission-complete', 600)
    advancePhase('title-reveal', 2200)
    advancePhase('influence', 3800)
    advancePhase('objectives', 5800)
    advancePhase('assessment', 7400)
    advancePhase('particles', 8800)
    advancePhase('actions', 10200)

    // Sound timeline
    setTimeout(() => impact(), 600)
    setTimeout(() => success(), 1000)
    setTimeout(() => scan(), 3800)
    setTimeout(() => impact(), 5800)
    setTimeout(() => scan(), 7400)
    setTimeout(() => whoosh(), 8800)
    setTimeout(() => success(), 10200)

    return () => {
      timerRefs.current.forEach(clearTimeout)
    }
  }, [advancePhase, skipped])

  // ── Influence counting animation ──
  useEffect(() => {
    if (phase !== 'influence' && !skipped) return

    const target = mission!.influenceReward
    const duration = 1200
    const steps = 30
    const stepDuration = duration / steps
    let current = 0
    const increment = target / steps

    const interval = setInterval(() => {
      current += increment
      if (current >= target) {
        setCountedInfluence(target)
        clearInterval(interval)
      } else {
        setCountedInfluence(Math.round(current))
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [phase, mission, skipped])

  // ── Skip handler ──
  const handleSkip = useCallback(() => {
    timerRefs.current.forEach(clearTimeout)
    setSkipped(true)
    setPhase('actions')
    setCountedInfluence(mission!.influenceReward)
    success()
  }, [mission])

  // ── Share dialog ──
  const shareText = `I just completed "${mission!.title}" on DATAVISM.\n\nLiberation Code: ${liberationCode}\n\nJoin the data resistance: datavism.org`

  const handleShare = useCallback(
    (platform: string) => {
      const encodedText = encodeURIComponent(shareText)
      const urls: Record<string, string> = {
        twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://datavism.org')}`,
        copy: '',
      }
      if (platform === 'copy') {
        navigator.clipboard.writeText(shareText)
        return
      }
      window.open(urls[platform], '_blank', 'width=600,height=400')
    },
    [shareText]
  )

  // ── Phase visibility helper ──
  const isVisible = (targetPhase: DebriefPhase) => {
    const order: DebriefPhase[] = [
      'blackout',
      'mission-complete',
      'title-reveal',
      'influence',
      'objectives',
      'assessment',
      'particles',
      'actions',
    ]
    return order.indexOf(phase) >= order.indexOf(targetPhase)
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* ─── Scanline overlay ─── */}
      <div
        className="fixed inset-0 pointer-events-none z-40 opacity-[0.025]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,255,65,0.04) 2px, rgba(0,255,65,0.04) 4px)',
        }}
      />

      {/* ─── Skip button ─── */}
      {!skipped && phase !== 'actions' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={handleSkip}
          className="fixed top-20 right-6 z-50 text-green-400/20 hover:text-green-400/50 text-[0.6rem] tracking-[0.2em] transition-colors"
        >
          SKIP &gt;&gt;
        </motion.button>
      )}

      {/* ─── Green particle burst ─── */}
      <AnimatePresence>
        {isVisible('particles') && (
          <>
            {particles.map((p, i) => (
              <motion.div
                key={i}
                className="fixed w-1 h-1 rounded-full bg-green-400 z-30"
                initial={{
                  left: '50%',
                  top: '50%',
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 2,
                  delay: p.delay * 0.3,
                  ease: 'easeOut',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* ─── Content stack ─── */}
      <div className="relative z-30 max-w-2xl w-full text-center space-y-8">
        {/* Phase 1: MISSION COMPLETE */}
        <AnimatePresence>
          {isVisible('mission-complete') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[0.15em] text-green-400"
                style={{
                  textShadow:
                    '0 0 30px rgba(0,255,65,0.4), 0 0 60px rgba(0,255,65,0.2), 0 0 90px rgba(0,255,65,0.1)',
                }}
              >
                MISSION
                <br />
                COMPLETE
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 2: Mission title */}
        <AnimatePresence>
          {isVisible('title-reveal') && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-green-400/30 text-[0.6rem] tracking-[0.3em] mb-2">
                // OPERATION
              </div>
              <div className="text-green-300 text-xl md:text-2xl tracking-wider font-bold">
                {mission!.title.toUpperCase()}
              </div>
              <div className="text-green-400/30 text-[0.6rem] tracking-[0.2em] mt-2">
                CATEGORY: {mission!.category.toUpperCase()} // DIFFICULTY:{' '}
                {mission!.difficulty.toUpperCase()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 3: Influence gained */}
        <AnimatePresence>
          {isVisible('influence') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="inline-block px-8 py-5 border border-green-400/40 bg-green-500/5 rounded-sm">
                <div className="text-green-400/40 text-[0.6rem] tracking-[0.3em] mb-2">
                  INFLUENCE GAINED
                </div>
                <div
                  className="text-4xl md:text-5xl font-bold text-green-300 tabular-nums"
                  style={{
                    textShadow: '0 0 20px rgba(0,255,65,0.3)',
                  }}
                >
                  +{countedInfluence}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 4: Objectives completed */}
        <AnimatePresence>
          {isVisible('objectives') && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-left mx-auto max-w-md"
            >
              <div className="text-green-400/30 text-[0.6rem] tracking-[0.3em] mb-3 text-center">
                // OBJECTIVES COMPLETED
              </div>
              <div className="space-y-2">
                {mission!.objectives.map((objective, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.3 }}
                    className="flex items-start gap-3 px-3 py-2 bg-green-500/5 border border-green-500/10 rounded-sm"
                  >
                    <span className="text-green-400 text-sm mt-0.5 flex-shrink-0">
                      &#10003;
                    </span>
                    <span className="text-green-300/70 text-[0.7rem] leading-relaxed">
                      {objective}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 5: Impact assessment */}
        <AnimatePresence>
          {isVisible('assessment') && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-green-400/30 text-[0.6rem] tracking-[0.3em] mb-3">
                // IMPACT ASSESSMENT
              </div>
              <div
                className="text-green-300/80 text-sm md:text-base leading-relaxed max-w-lg mx-auto italic"
                style={{ textShadow: '0 0 8px rgba(0,255,65,0.08)' }}
              >
                &quot;{impactStatement}&quot;
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 7: Actions */}
        <AnimatePresence>
          {isVisible('actions') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 pt-4"
            >
              {/* Liberation code */}
              <div className="border border-green-400/30 bg-green-500/5 px-6 py-4 rounded-sm">
                <div className="text-green-400/30 text-[0.55rem] tracking-[0.3em] mb-2">
                  LIBERATION CODE
                </div>
                <div
                  className="text-xl md:text-2xl font-bold text-green-300 tracking-[0.2em] tabular-nums"
                  style={{ textShadow: '0 0 12px rgba(0,255,65,0.25)' }}
                >
                  {liberationCode}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowShareDialog(true)}
                  className="
                    px-8 py-3 bg-green-500/20 text-green-300 text-sm
                    font-bold tracking-[0.15em] border border-green-400/50
                    rounded-sm hover:bg-green-500/30 hover:border-green-400/70
                    transition-all
                  "
                  style={{
                    boxShadow: '0 0 15px rgba(0,255,65,0.1)',
                  }}
                >
                  SHARE YOUR FINDINGS
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    whoosh()
                    router.push('/ops')
                  }}
                  className="
                    px-8 py-3 bg-transparent text-green-400/60 text-sm
                    font-bold tracking-[0.15em] border border-green-500/20
                    rounded-sm hover:bg-green-500/5 hover:text-green-400/80
                    hover:border-green-500/40 transition-all
                  "
                >
                  BACK TO MISSION BOARD
                </motion.button>
              </div>

              {/* Operative status */}
              <div className="text-green-400/15 text-[0.55rem] tracking-[0.15em] pt-4">
                OPERATIVE {profile.codename.toUpperCase()} //{' '}
                {roleConfig.title.toUpperCase()} // TOTAL INFLUENCE:{' '}
                {profile.influenceScore.toLocaleString()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Share Dialog ─── */}
      <AnimatePresence>
        {showShareDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowShareDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full bg-black border border-green-400/30 rounded-sm p-6"
            >
              <div className="text-green-400/40 text-[0.6rem] tracking-[0.3em] mb-4">
                // SHARE INTEL
              </div>

              <div className="text-green-300/60 text-[0.7rem] leading-relaxed mb-6 bg-green-500/5 border border-green-500/10 p-3 rounded-sm whitespace-pre-line">
                {shareText}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full py-2.5 bg-[#1DA1F2]/20 text-[#1DA1F2] text-[0.7rem] font-bold tracking-wider border border-[#1DA1F2]/30 rounded-sm hover:bg-[#1DA1F2]/30 transition-all"
                >
                  SHARE ON X / TWITTER
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-full py-2.5 bg-[#0077B5]/20 text-[#0077B5] text-[0.7rem] font-bold tracking-wider border border-[#0077B5]/30 rounded-sm hover:bg-[#0077B5]/30 transition-all"
                >
                  SHARE ON LINKEDIN
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="w-full py-2.5 bg-green-500/10 text-green-300 text-[0.7rem] font-bold tracking-wider border border-green-500/20 rounded-sm hover:bg-green-500/20 transition-all"
                >
                  COPY TO CLIPBOARD
                </button>
              </div>

              <button
                onClick={() => setShowShareDialog(false)}
                className="w-full mt-4 py-2 text-green-400/30 text-[0.6rem] tracking-wider hover:text-green-400/50 transition-colors"
              >
                [ CLOSE ]
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
