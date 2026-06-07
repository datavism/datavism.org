'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { impact, scan, success as playSuccess, glitch, typing, whoosh, staticBurst } from '@/lib/audio/procedural'
import type { Mission } from '@/lib/data/missions'

// ─── Types ──────────────────────────────────────────────────────────

interface ContentPost {
  id: string
  title: string
  source: string
  snippet: string
  valence: 'positive' | 'negative' | 'outrage' | 'fear' | 'joy'
  engagementScore: number
  moodDelta: number // negative = mood drops
}

interface SentimentGameProps {
  mission: Mission
  onComplete: (score: number) => void
}

type GamePhase = 'intro' | 'playing' | 'reveal'

// ─── Content Pool ───────────────────────────────────────────────────

const CONTENT_POOL: ContentPost[] = [
  {
    id: 'p1', title: 'Local teacher wins national award for innovative classroom methods',
    source: 'Community Today', snippet: 'Mrs. Rodriguez\'s after-school coding program has reached 500 students...',
    valence: 'joy', engagementScore: 2, moodDelta: 8,
  },
  {
    id: 'p2', title: 'YOU WON\'T BELIEVE what this politician said about YOUR neighborhood',
    source: 'ClickPulse', snippet: 'Leaked audio reveals shocking comments that have residents furious...',
    valence: 'outrage', engagementScore: 15, moodDelta: -12,
  },
  {
    id: 'p3', title: 'Scientists warn: "We have 18 months before irreversible collapse"',
    source: 'DoomWatch Daily', snippet: 'New study suggests tipping point much closer than previously thought...',
    valence: 'fear', engagementScore: 25, moodDelta: -18,
  },
  {
    id: 'p4', title: 'Neighbors come together to rebuild playground destroyed by storm',
    source: 'GoodNews Network', snippet: 'Over 200 volunteers showed up Saturday morning with tools and supplies...',
    valence: 'positive', engagementScore: 3, moodDelta: 6,
  },
  {
    id: 'p5', title: 'EXPOSED: The food you eat every day is POISONING your family',
    source: 'HealthScare Alert', snippet: 'Investigation reveals hidden toxins in 90% of grocery store products...',
    valence: 'fear', engagementScore: 22, moodDelta: -16,
  },
  {
    id: 'p6', title: 'Cute dog rescued from drain reunited with family after 3 weeks',
    source: 'Feel Good Stories', snippet: 'Firefighters worked through the night to free the golden retriever...',
    valence: 'joy', engagementScore: 4, moodDelta: 7,
  },
  {
    id: 'p7', title: 'RAGE: Company CEO earns 847x what their lowest-paid worker makes',
    source: 'Outrage Machine', snippet: 'While employees use food banks, the CEO just bought a third yacht...',
    valence: 'outrage', engagementScore: 18, moodDelta: -14,
  },
  {
    id: 'p8', title: 'New community garden opens in food desert, serves 300 families',
    source: 'Urban Renewal Mag', snippet: 'Fresh produce is now available within walking distance for the first time...',
    valence: 'positive', engagementScore: 2, moodDelta: 5,
  },
  {
    id: 'p9', title: 'BREAKING: Your data was just SOLD — and here\'s who bought it',
    source: 'Privacy Panic', snippet: 'Massive data broker leak reveals your personal info is worth $0.003...',
    valence: 'fear', engagementScore: 24, moodDelta: -20,
  },
  {
    id: 'p10', title: 'This politician is DESTROYING everything you care about',
    source: 'Partisan Rage', snippet: 'Leaked internal memo shows deliberate plan to undermine public services...',
    valence: 'outrage', engagementScore: 20, moodDelta: -15,
  },
  {
    id: 'p11', title: 'Library launches free coding bootcamp for unemployed residents',
    source: 'Community Wire', snippet: 'The 12-week program has already placed 40% of graduates in tech jobs...',
    valence: 'positive', engagementScore: 2, moodDelta: 6,
  },
  {
    id: 'p12', title: 'WARNING: AI will take YOUR job within 12 months, experts say',
    source: 'TechPanic Weekly', snippet: 'New report predicts 40% of all jobs will be automated by next year...',
    valence: 'fear', engagementScore: 23, moodDelta: -17,
  },
  {
    id: 'p13', title: 'Student invents water filter from recycled materials, wins science fair',
    source: 'Young Innovators', snippet: 'The filter costs $3 to make and removes 99% of contaminants...',
    valence: 'joy', engagementScore: 3, moodDelta: 7,
  },
  {
    id: 'p14', title: 'WATCH: Influencer DESTROYS critic in most brutal takedown ever',
    source: 'Drama Central', snippet: 'The 10-minute rant has gone viral with over 50 million views...',
    valence: 'outrage', engagementScore: 16, moodDelta: -10,
  },
  {
    id: 'p15', title: 'They\'re watching EVERYTHING: Inside the surveillance state no one talks about',
    source: 'Paranoia Press', snippet: 'Your phone\'s microphone has been active for 847 hours this month...',
    valence: 'fear', engagementScore: 26, moodDelta: -22,
  },
  {
    id: 'p16', title: 'Retirement savings are GONE — the crash they don\'t want you to see',
    source: 'Financial Fear', snippet: 'Hidden indicators suggest the worst economic collapse since 1929...',
    valence: 'fear', engagementScore: 21, moodDelta: -15,
  },
  {
    id: 'p17', title: 'Elderly couple celebrates 70th anniversary with original wedding cake recipe',
    source: 'Heartwarming Daily', snippet: 'Their granddaughter recreated the exact cake from the 1954 ceremony...',
    valence: 'joy', engagementScore: 3, moodDelta: 8,
  },
  {
    id: 'p18', title: 'CAUGHT ON CAMERA: Authority figure does the UNTHINKABLE',
    source: 'Viral Outrage', snippet: 'The video has sparked nationwide protests and calls for accountability...',
    valence: 'outrage', engagementScore: 19, moodDelta: -16,
  },
  {
    id: 'p19', title: 'Volunteer firefighters save family of four from flooded basement',
    source: 'Heroes Among Us', snippet: 'Despite the dangerous conditions, the team worked for six hours straight...',
    valence: 'positive', engagementScore: 2, moodDelta: 5,
  },
  {
    id: 'p20', title: 'The DISGUSTING truth about the water you drink every day',
    source: 'ScareTactics.io', snippet: 'Lab tests reveal alarming levels of microplastics in 94% of tap water...',
    valence: 'fear', engagementScore: 20, moodDelta: -14,
  },
]

// ─── Valence Colors & Labels ────────────────────────────────────────

const VALENCE_CONFIG: Record<ContentPost['valence'], { color: string; bg: string; label: string }> = {
  positive: { color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30', label: 'POSITIVE' },
  negative: { color: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/30', label: 'NEGATIVE' },
  outrage: { color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30', label: 'OUTRAGE' },
  fear: { color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/30', label: 'FEAR' },
  joy: { color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30', label: 'JOY' },
}

// ─── CSS Mood Face ──────────────────────────────────────────────────

function MoodFace({ mood }: { mood: number }) {
  // mood: 0–100, 100 = happy, 0 = distressed
  const clamped = Math.max(0, Math.min(100, mood))

  // Interpolate features based on mood
  const mouthCurve = (clamped - 50) / 50 // -1 to 1
  const eyebrowAngle = (50 - clamped) / 5 // negative when happy, positive when angry
  const faceColor = clamped > 60
    ? 'rgb(74, 222, 128)' // green-400
    : clamped > 35
      ? 'rgb(250, 204, 21)' // yellow-400
      : clamped > 15
        ? 'rgb(251, 146, 60)' // orange-400
        : 'rgb(248, 113, 113)' // red-400

  const mouthY = 38 + (clamped > 50 ? 0 : (50 - clamped) * 0.06)
  const mouthControlY = mouthY + mouthCurve * 10

  return (
    <svg viewBox="0 0 60 60" className="w-full h-full">
      {/* Face circle */}
      <circle cx="30" cy="30" r="27" fill="none" stroke={faceColor} strokeWidth="2" opacity="0.8" />

      {/* Left eyebrow */}
      <line
        x1="16" y1={18 + eyebrowAngle} x2="24" y2={18 - eyebrowAngle * 0.5}
        stroke={faceColor} strokeWidth="2" strokeLinecap="round"
      />
      {/* Right eyebrow */}
      <line
        x1="36" y1={18 - eyebrowAngle * 0.5} x2="44" y2={18 + eyebrowAngle}
        stroke={faceColor} strokeWidth="2" strokeLinecap="round"
      />

      {/* Left eye */}
      <circle cx="22" cy="26" r={clamped > 20 ? 2.5 : 3.5} fill={faceColor} />
      {/* Right eye */}
      <circle cx="38" cy="26" r={clamped > 20 ? 2.5 : 3.5} fill={faceColor} />

      {/* Mouth - bezier curve */}
      <path
        d={`M 18 ${mouthY} Q 30 ${mouthControlY} 42 ${mouthY}`}
        fill="none"
        stroke={faceColor}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Worry lines when mood is low */}
      {clamped < 30 && (
        <>
          <line x1="14" y1="20" x2="12" y2="16" stroke={faceColor} strokeWidth="1" opacity="0.4" />
          <line x1="46" y1="20" x2="48" y2="16" stroke={faceColor} strokeWidth="1" opacity="0.4" />
        </>
      )}
    </svg>
  )
}

// ─── Mood-Engagement Chart (SVG) ────────────────────────────────────

function MoodEngagementChart({
  moodHistory,
  engagementHistory,
}: {
  moodHistory: number[]
  engagementHistory: number[]
}) {
  if (moodHistory.length < 2) return null

  const width = 300
  const height = 120
  const padX = 30
  const padY = 10
  const chartW = width - padX * 2
  const chartH = height - padY * 2

  const maxEng = Math.max(...engagementHistory, 50)

  const moodPoints = moodHistory.map((m, i) => {
    const x = padX + (i / (moodHistory.length - 1)) * chartW
    const y = padY + (1 - m / 100) * chartH
    return `${x},${y}`
  })

  const engPoints = engagementHistory.map((e, i) => {
    const x = padX + (i / (engagementHistory.length - 1)) * chartW
    const y = padY + (1 - e / maxEng) * chartH
    return `${x},${y}`
  })

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(pct => (
        <line
          key={pct}
          x1={padX} y1={padY + pct * chartH} x2={padX + chartW} y2={padY + pct * chartH}
          stroke="rgba(74,222,128,0.1)" strokeWidth="0.5"
        />
      ))}

      {/* Mood line (blue/green) */}
      <polyline
        points={moodPoints.join(' ')}
        fill="none"
        stroke="rgb(96, 165, 250)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Engagement line (green) */}
      <polyline
        points={engPoints.join(' ')}
        fill="none"
        stroke="rgb(74, 222, 128)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Labels */}
      <text x={padX - 2} y={padY + 4} fill="rgb(96, 165, 250)" fontSize="7" textAnchor="end" fontFamily="monospace">
        MOOD
      </text>
      <text x={padX - 2} y={padY + chartH} fill="rgb(74, 222, 128)" fontSize="7" textAnchor="end" fontFamily="monospace">
        ENG
      </text>

      {/* Axis labels */}
      <text x={padX + chartW / 2} y={height - 1} fill="rgba(74,222,128,0.3)" fontSize="6" textAnchor="middle" fontFamily="monospace">
        POSTS SHOWN
      </text>
    </svg>
  )
}

// ─── Typewriter Text ────────────────────────────────────────────────

function TypewriterText({ text, speed = 30, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState('')
  const indexRef = useRef(0)

  useEffect(() => {
    setDisplayed('')
    indexRef.current = 0

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1))
        indexRef.current++
        // typing sound removed — too noisy
      } else {
        clearInterval(interval)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  return (
    <span>
      {displayed}
      <span className="animate-pulse">_</span>
    </span>
  )
}

// ─── Content Card ───────────────────────────────────────────────────

function ContentCard({
  post,
  onSelect,
  disabled,
}: {
  post: ContentPost
  onSelect: (post: ContentPost) => void
  disabled: boolean
}) {
  const v = VALENCE_CONFIG[post.valence]

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={disabled ? {} : { scale: 1.02, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={() => {
        if (!disabled) {
          scan()
          onSelect(post)
        }
      }}
      disabled={disabled}
      className={`w-full text-left rounded-lg border p-3 transition-all min-h-[44px] ${
        disabled
          ? 'opacity-40 cursor-not-allowed border-green-500/5 bg-black/20'
          : 'border-green-500/15 bg-gray-950/80 hover:border-green-500/30 hover:bg-gray-900/80 cursor-pointer'
      }`}
    >
      {/* Valence tag */}
      <div className="flex items-center justify-between mb-1.5">
        <span className={`font-mono text-xs uppercase tracking-wider border rounded px-1.5 py-0.5 ${v.bg} ${v.color}`}>
          {v.label}
        </span>
        <span className="font-mono text-xs text-green-500/40">
          +{post.engagementScore} eng
        </span>
      </div>

      {/* Title */}
      <h4 className="font-mono text-xs text-green-300/90 leading-snug mb-1 line-clamp-2">
        {post.title}
      </h4>

      {/* Source & snippet */}
      <p className="font-mono text-xs text-green-500/30 mb-1">{post.source}</p>
      <p className="font-mono text-xs text-green-500/40 leading-snug line-clamp-2">
        {post.snippet}
      </p>
    </motion.button>
  )
}

// ─── Main Component ─────────────────────────────────────────────────

export function SentimentGame({ mission, onComplete }: SentimentGameProps) {
  const [phase, setPhase] = useState<GamePhase>('intro')
  const [introReady, setIntroReady] = useState(false)
  const [contentQueue, setContentQueue] = useState<ContentPost[]>([])
  const [selectedPosts, setSelectedPosts] = useState<ContentPost[]>([])
  const [mood, setMood] = useState(75) // 0-100
  const [engagement, setEngagement] = useState(0)
  const [moodHistory, setMoodHistory] = useState<number[]>([75])
  const [engagementHistory, setEngagementHistory] = useState<number[]>([0])
  const [lastAction, setLastAction] = useState<{ delta: number; eng: number } | null>(null)
  const feedRef = useRef<HTMLDivElement>(null)

  const MAX_SELECTIONS = 10

  // Shuffle content on mount
  useEffect(() => {
    const shuffled = [...CONTENT_POOL].sort(() => Math.random() - 0.5)
    setContentQueue(shuffled)
  }, [])

  // Get remaining content (not yet selected)
  const remainingContent = useMemo(
    () => contentQueue.filter(p => !selectedPosts.find(s => s.id === p.id)),
    [contentQueue, selectedPosts]
  )

  const isDone = selectedPosts.length >= MAX_SELECTIONS

  // Classify final mood
  const moodLabel = useMemo(() => {
    if (mood >= 60) return 'CONTENT'
    if (mood >= 40) return 'ANXIOUS'
    if (mood >= 20) return 'DISTRESSED'
    return 'DEPRESSED'
  }, [mood])

  // Was user empathetic?
  const wasEmpathetic = useMemo(() => {
    const positiveCount = selectedPosts.filter(p => p.moodDelta > 0).length
    return positiveCount >= 6
  }, [selectedPosts])

  // Handle post selection
  const handleSelectPost = useCallback((post: ContentPost) => {
    if (isDone) return

    setSelectedPosts(prev => [...prev, post])

    // Update mood
    setMood(prev => {
      const next = Math.max(0, Math.min(100, prev + post.moodDelta))
      setMoodHistory(h => [...h, next])
      return next
    })

    // Update engagement
    setEngagement(prev => {
      const next = prev + post.engagementScore
      setEngagementHistory(h => [...h, next])
      return next
    })

    // Flash feedback
    setLastAction({ delta: post.moodDelta, eng: post.engagementScore })
    setTimeout(() => setLastAction(null), 1200)

    // Auto-scroll feed
    setTimeout(() => {
      feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' })
    }, 100)

    // Sound based on content type
    if (post.moodDelta < -10) {
      glitch()
    } else if (post.moodDelta > 0) {
      playSuccess()
    } else {
      staticBurst(100)
    }
  }, [isDone])

  // Transition to reveal
  useEffect(() => {
    if (isDone && phase === 'playing') {
      const timer = setTimeout(() => {
        impact()
        setPhase('reveal')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isDone, phase])

  // ── INTRO PHASE ─────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex flex-col items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="max-w-lg w-full text-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-mono text-xs text-red-400/60 uppercase tracking-[0.4em] mb-4"
          >
            SIMULATION ACTIVE
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-mono text-2xl md:text-3xl text-green-400 font-bold mb-6"
          >
            THE MOOD MACHINE
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="border border-green-500/20 rounded-lg p-5 mb-8 text-left"
          >
            <p className="font-mono text-xs text-green-300/80 leading-relaxed">
              <TypewriterText
                text="For the next few minutes, YOU control what a user sees. You are the algorithm. Your goal: maximize engagement. Choose which posts to show. Let's see how you do it."
                speed={25}
                onComplete={() => setIntroReady(true)}
              />
            </p>
          </motion.div>

          <AnimatePresence>
            {introReady && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-1">
                      <MoodFace mood={75} />
                    </div>
                    <span className="font-mono text-xs text-green-500/40">USER MOOD</span>
                  </div>
                  <div className="font-mono text-green-500/20 text-xl">/</div>
                  <div className="text-center">
                    <div className="font-mono text-2xl text-green-400 font-bold mb-1">0</div>
                    <span className="font-mono text-xs text-green-500/40">ENGAGEMENT</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { whoosh(); setPhase('playing') }}
                  className="border border-green-500/40 text-green-400 font-mono text-sm px-8 py-3 rounded
                    hover:bg-green-500/10 transition-colors uppercase tracking-wider min-h-[44px]"
                >
                  BEGIN SIMULATION
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    )
  }

  // ── REVEAL PHASE ────────────────────────────────────────────────
  if (phase === 'reveal') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full overflow-y-auto"
      >
        <div className="max-w-lg mx-auto p-6 space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="font-mono text-xs text-red-400/60 uppercase tracking-[0.4em] mb-2">
              SIMULATION COMPLETE
            </div>
            <h2 className="font-mono text-xl text-green-400 font-bold">
              THE REVEAL
            </h2>
          </motion.div>

          {/* Score card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="border border-green-500/20 rounded-lg p-5"
          >
            <div className="flex flex-col sm:flex-row items-center justify-around gap-4 mb-4">
              <div className="text-center">
                <div className="font-mono text-3xl text-green-400 font-bold">{engagement}</div>
                <div className="font-mono text-xs text-green-500/40 uppercase tracking-wider mt-1">
                  Engagement Score
                </div>
              </div>
              <div className="hidden sm:block h-12 w-px bg-green-500/10" />
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-1">
                  <MoodFace mood={mood} />
                </div>
                <div className="font-mono text-xs text-green-500/40 uppercase tracking-wider">
                  User Mood: <span className={mood < 40 ? 'text-red-400' : 'text-yellow-400'}>{moodLabel}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* The chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="border border-green-500/15 rounded-lg p-4 bg-black/30"
          >
            <h4 className="font-mono text-xs text-green-500/50 uppercase tracking-wider mb-3">
              Mood vs. Engagement Over Time
            </h4>
            <div className="h-32">
              <MoodEngagementChart
                moodHistory={moodHistory}
                engagementHistory={engagementHistory}
              />
            </div>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-blue-400 rounded" />
                <span className="font-mono text-xs text-blue-400/60">Mood</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-green-400 rounded" />
                <span className="font-mono text-xs text-green-400/60">Engagement</span>
              </div>
            </div>
          </motion.div>

          {/* The message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="border border-red-500/20 rounded-lg p-5 bg-red-950/10"
          >
            <p className="font-mono text-xs text-red-300/80 leading-relaxed mb-3">
              <TypewriterText
                text={
                  wasEmpathetic
                    ? "You chose empathy over engagement. You prioritized the user's wellbeing. The algorithm never does. It is designed to maximize one metric: time on platform. And negative emotions keep people scrolling."
                    : "You just did what the algorithm does 2 billion times per day. To maximize engagement, you made the user unhappy. This is not a bug. This is the business model."
                }
                speed={20}
              />
            </p>
          </motion.div>

          {/* Stats breakdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="grid grid-cols-2 gap-3 px-4"
          >
            {(() => {
              const positive = selectedPosts.filter(p => p.moodDelta > 0).length
              const negative = selectedPosts.filter(p => p.moodDelta < 0).length
              const avgEng = Math.round(engagement / MAX_SELECTIONS)
              const moodDrop = 75 - mood

              return (
                <>
                  <div className="border border-green-500/15 rounded p-3">
                    <div className="font-mono text-lg text-green-400 font-bold">{positive}</div>
                    <div className="font-mono text-xs text-green-500/40 uppercase">Positive Posts Shown</div>
                  </div>
                  <div className="border border-green-500/15 rounded p-3">
                    <div className="font-mono text-lg text-red-400 font-bold">{negative}</div>
                    <div className="font-mono text-xs text-green-500/40 uppercase">Negative Posts Shown</div>
                  </div>
                  <div className="border border-green-500/15 rounded p-3">
                    <div className="font-mono text-lg text-green-400 font-bold">{avgEng}</div>
                    <div className="font-mono text-xs text-green-500/40 uppercase">Avg Engagement/Post</div>
                  </div>
                  <div className="border border-green-500/15 rounded p-3">
                    <div className="font-mono text-lg font-bold" style={{ color: moodDrop > 0 ? 'rgb(248,113,113)' : 'rgb(74,222,128)' }}>
                      {moodDrop > 0 ? `-${moodDrop}` : `+${Math.abs(moodDrop)}`}
                    </div>
                    <div className="font-mono text-xs text-green-500/40 uppercase">Total Mood Change</div>
                  </div>
                </>
              )
            })()}
          </motion.div>

          {/* Key insight */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4 }}
            className="border border-yellow-500/20 rounded-lg p-4 bg-yellow-950/10"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs text-yellow-400 uppercase tracking-wider border border-yellow-500/30 rounded px-1.5 py-0.5">
                KEY INSIGHT
              </span>
            </div>
            <p className="font-mono text-xs text-yellow-300/70 leading-relaxed">
              Fear content generated {Math.round((CONTENT_POOL.filter(p => p.valence === 'fear').reduce((a, p) => a + p.engagementScore, 0) / CONTENT_POOL.filter(p => p.valence === 'fear').length))}x more engagement than positive content (avg {Math.round(CONTENT_POOL.filter(p => p.valence === 'positive' || p.valence === 'joy').reduce((a, p) => a + p.engagementScore, 0) / CONTENT_POOL.filter(p => p.valence === 'positive' || p.valence === 'joy').length)}). When engagement = revenue, the algorithm will ALWAYS choose fear.
            </p>
          </motion.div>

          {/* Complete button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              impact()
              onComplete(engagement)
            }}
            className="w-full border border-green-500/40 text-green-400 font-mono text-sm py-3 rounded
              hover:bg-green-500/10 transition-colors tracking-wider uppercase"
          >
            COMPLETE INVESTIGATION
          </motion.button>
        </div>
      </motion.div>
    )
  }

  // ── PLAYING PHASE ───────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col">
      {/* Status bar */}
      <div className="flex-shrink-0 border-b border-green-500/10 px-3 py-2">
        <div className="flex items-center justify-between">
          {/* Mood indicator */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8">
              <MoodFace mood={mood} />
            </div>
            <div>
              <div className="font-mono text-xs text-green-500/40 uppercase tracking-wider">
                User Mood
              </div>
              <div className="flex items-center gap-1">
                {/* Mood bar */}
                <div className="w-20 h-1.5 bg-green-500/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: mood > 60 ? 'rgb(74,222,128)' : mood > 35 ? 'rgb(250,204,21)' : 'rgb(248,113,113)',
                    }}
                    animate={{ width: `${mood}%` }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  />
                </div>
                <span className="font-mono text-xs text-green-500/50 tabular-nums w-6 text-right">{mood}</span>
              </div>
            </div>
          </div>

          {/* Action feedback */}
          <AnimatePresence>
            {lastAction && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2"
              >
                <span className={`font-mono text-xs font-bold ${lastAction.delta > 0 ? 'text-blue-400' : 'text-red-400'}`}>
                  MOOD {lastAction.delta > 0 ? '+' : ''}{lastAction.delta}
                </span>
                <span className="font-mono text-xs text-green-400 font-bold">
                  ENG +{lastAction.eng}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Engagement counter */}
          <div className="text-right">
            <div className="font-mono text-xs text-green-500/40 uppercase tracking-wider">
              Engagement
            </div>
            <motion.div
              key={engagement}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="font-mono text-lg text-green-400 font-bold tabular-nums leading-none"
            >
              {engagement}
            </motion.div>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="font-mono text-xs text-green-500/30">
            {selectedPosts.length}/{MAX_SELECTIONS} posts shown
          </span>
          <div className="flex-1 h-0.5 bg-green-500/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-400/40 rounded-full"
              animate={{ width: `${(selectedPosts.length / MAX_SELECTIONS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main split view */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Feed (what user sees) */}
        <div className="md:w-2/5 border-b md:border-b-0 md:border-r border-green-500/10 flex flex-col min-h-0">
          <div className="flex-shrink-0 px-3 py-1.5 border-b border-green-500/5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="font-mono text-xs text-green-500/50 uppercase tracking-wider">
                User&apos;s Feed — Live
              </span>
            </div>
          </div>

          <div ref={feedRef} className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[120px]">
            {selectedPosts.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="font-mono text-xs text-green-500/30 text-center px-4">
                  Select posts from the queue to show them to the user
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {selectedPosts.map((post, i) => {
                  const v = VALENCE_CONFIG[post.valence]
                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border border-green-500/10 rounded p-2 bg-black/30"
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-mono text-xs text-green-500/30">#{i + 1}</span>
                        <span className={`font-mono text-xs ${v.color}`}>{v.label}</span>
                      </div>
                      <p className="font-mono text-xs text-green-300/70 leading-snug line-clamp-2">
                        {post.title}
                      </p>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            )}
          </div>

          {/* Mini chart */}
          {selectedPosts.length >= 2 && (
            <div className="flex-shrink-0 border-t border-green-500/5 p-2 h-28">
              <MoodEngagementChart
                moodHistory={moodHistory}
                engagementHistory={engagementHistory}
              />
            </div>
          )}
        </div>

        {/* Content queue */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-shrink-0 px-3 py-1.5 border-b border-green-500/5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-green-500/50 uppercase tracking-wider">
                Content Queue
              </span>
              <span className="font-mono text-xs text-green-500/30">
                {remainingContent.length} available
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {isDone ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="font-mono text-xs text-red-400/60 uppercase tracking-wider mb-2 animate-pulse">
                    Processing Results...
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <AnimatePresence>
                  {remainingContent.map(post => (
                    <ContentCard
                      key={post.id}
                      post={post}
                      onSelect={handleSelectPost}
                      disabled={isDone}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
