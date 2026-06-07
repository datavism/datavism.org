'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { success as playSuccess, impact, scan, glitch, whoosh } from '@/lib/audio/procedural'

// ─── Types ──────────────────────────────────────────────────────────

interface FeedPost {
  id: string
  eventId: string
  persona: 'A' | 'B'
  avatar: string
  username: string
  handle: string
  timestamp: string
  content: string
  likes: number
  shares: number
  topic: 'politics' | 'lifestyle' | 'news' | 'entertainment' | 'tech' | 'economy'
}

interface EventPair {
  eventId: string
  eventName: string
  biasLabel: string
}

interface FilterLayer {
  name: string
  removal: number
  description: string
}

// ─── Feed Data ──────────────────────────────────────────────────────

const EVENTS: EventPair[] = [
  { eventId: 'climate', eventName: 'Climate Policy', biasLabel: 'FRAMING BIAS: Same event, opposite emotional valence' },
  { eventId: 'tech-layoffs', eventName: 'Tech Layoffs', biasLabel: 'SELECTION BIAS: Different causes emphasized' },
  { eventId: 'housing', eventName: 'Housing Crisis', biasLabel: 'ATTRIBUTION BIAS: Different groups blamed' },
  { eventId: 'ai-regulation', eventName: 'AI Regulation', biasLabel: 'OMISSION BIAS: Key facts excluded per persona' },
  { eventId: 'education', eventName: 'Education Reform', biasLabel: 'ANCHORING BIAS: Different statistics highlighted' },
  { eventId: 'healthcare', eventName: 'Healthcare Bill', biasLabel: 'EMOTIONAL BIAS: Fear vs. hope framing' },
  { eventId: 'economy', eventName: 'Jobs Report', biasLabel: 'CHERRY-PICKING: Same data, opposite conclusions' },
  { eventId: 'privacy', eventName: 'Data Privacy Law', biasLabel: 'FRAMING BIAS: Freedom vs. safety narrative' },
]

const FEED_POSTS: FeedPost[] = [
  // Climate
  {
    id: 'a-climate', eventId: 'climate', persona: 'A',
    avatar: '#3b82f6', username: 'GreenFuture', handle: '@greenfuture_now', timestamp: '2h',
    content: 'Historic climate victory! Scientists celebrate landmark agreement that could cut emissions 40% by 2035. This is the turning point we\'ve been fighting for.',
    likes: 12400, shares: 3200, topic: 'politics',
  },
  {
    id: 'b-climate', eventId: 'climate', persona: 'B',
    avatar: '#ef4444', username: 'FreeMarketNews', handle: '@freemarket_daily', timestamp: '2h',
    content: 'Government overreach: New regulations threaten 2.3 million jobs and could increase energy costs by 34%. Industry leaders warn of economic devastation.',
    likes: 9800, shares: 4100, topic: 'politics',
  },

  // Tech layoffs
  {
    id: 'a-layoffs', eventId: 'tech-layoffs', persona: 'A',
    avatar: '#8b5cf6', username: 'TechInsider', handle: '@techinsider', timestamp: '4h',
    content: 'BREAKING: Major tech company lays off 12,000. CEO pocketed $94M last year while workers lose healthcare. This is late-stage capitalism in action.',
    likes: 23100, shares: 8900, topic: 'tech',
  },
  {
    id: 'b-layoffs', eventId: 'tech-layoffs', persona: 'B',
    avatar: '#f59e0b', username: 'BusinessDaily', handle: '@bizdaily', timestamp: '3h',
    content: 'Smart restructuring: Tech giant streamlines operations, cutting 12,000 roles to focus on AI. Stock jumps 8%. Analysts praise strategic pivot.',
    likes: 7400, shares: 2100, topic: 'economy',
  },

  // Housing
  {
    id: 'a-housing', eventId: 'housing', persona: 'A',
    avatar: '#ec4899', username: 'UrbanPolicy', handle: '@urbanpolicy', timestamp: '5h',
    content: 'Housing crisis deepens: Corporate landlords now own 1 in 4 rental units. Rents up 38% since 2019. We need rent control and public housing investment NOW.',
    likes: 18700, shares: 6300, topic: 'lifestyle',
  },
  {
    id: 'b-housing', eventId: 'housing', persona: 'B',
    avatar: '#22c55e', username: 'PropertyRights', handle: '@propertyrights', timestamp: '5h',
    content: 'Housing shortage caused by excessive zoning regulations and permit delays. Government red tape — not the free market — is why you can\'t afford a home.',
    likes: 11200, shares: 3800, topic: 'economy',
  },

  // AI regulation
  {
    id: 'a-ai', eventId: 'ai-regulation', persona: 'A',
    avatar: '#06b6d4', username: 'AIEthicsWatch', handle: '@aiethics', timestamp: '6h',
    content: 'New AI safety bill would require transparency in algorithms that affect hiring, lending, and criminal justice. It\'s about time we hold these systems accountable.',
    likes: 14300, shares: 5100, topic: 'tech',
  },
  {
    id: 'b-ai', eventId: 'ai-regulation', persona: 'B',
    avatar: '#f97316', username: 'InnovationFirst', handle: '@innovate_us', timestamp: '7h',
    content: 'Proposed AI regulations would cripple American innovation and hand technological leadership to China. Bureaucrats shouldn\'t be designing our future.',
    likes: 8900, shares: 3400, topic: 'tech',
  },

  // Education
  {
    id: 'a-education', eventId: 'education', persona: 'A',
    avatar: '#a855f7', username: 'EdReform', handle: '@edreform', timestamp: '8h',
    content: 'Study: Students in well-funded public schools outperform private school peers by 12%. Invest in education, don\'t privatize it. Every child deserves quality learning.',
    likes: 16800, shares: 7200, topic: 'news',
  },
  {
    id: 'b-education', eventId: 'education', persona: 'B',
    avatar: '#84cc16', username: 'SchoolChoice', handle: '@schoolchoice', timestamp: '9h',
    content: 'Parents deserve options! School choice programs show 23% improvement in graduation rates. Competition drives excellence. Stop trapping kids in failing schools.',
    likes: 10100, shares: 4500, topic: 'news',
  },

  // Healthcare
  {
    id: 'a-healthcare', eventId: 'healthcare', persona: 'A',
    avatar: '#14b8a6', username: 'HealthForAll', handle: '@healthforall', timestamp: '10h',
    content: 'New healthcare bill could save families $4,200/year. 28 million uninsured Americans would gain coverage. Health is a right, not a privilege.',
    likes: 21000, shares: 9100, topic: 'politics',
  },
  {
    id: 'b-healthcare', eventId: 'healthcare', persona: 'B',
    avatar: '#e11d48', username: 'TaxpayerWatch', handle: '@taxpayerwatch', timestamp: '10h',
    content: 'New healthcare bill adds $2.1 TRILLION to national debt. Wait times could increase 40%. Government-run healthcare means worse care for everyone.',
    likes: 13600, shares: 5800, topic: 'politics',
  },

  // Economy / Jobs
  {
    id: 'a-economy', eventId: 'economy', persona: 'A',
    avatar: '#6366f1', username: 'WorkersUnited', handle: '@workers_united', timestamp: '12h',
    content: 'Jobs report: 275K new jobs! But real wages still 3.2% below 2019. CEO pay up 1,460% since 1978 while worker pay rose 18%. The "recovery" isn\'t reaching everyone.',
    likes: 19400, shares: 7700, topic: 'economy',
  },
  {
    id: 'b-economy', eventId: 'economy', persona: 'B',
    avatar: '#0ea5e9', username: 'EconWatch', handle: '@econwatch', timestamp: '11h',
    content: 'STRONG jobs report: 275K new jobs, unemployment at 3.9%. Economy firing on all cylinders! Markets respond positively. American entrepreneurship thrives.',
    likes: 15200, shares: 4900, topic: 'economy',
  },

  // Privacy
  {
    id: 'a-privacy', eventId: 'privacy', persona: 'A',
    avatar: '#f43f5e', username: 'DigitalRights', handle: '@digitalrights', timestamp: '14h',
    content: 'New data privacy law would ban sale of location data and require consent for tracking. Your phone tracks 350+ locations per day. It\'s time to end digital surveillance.',
    likes: 17600, shares: 8300, topic: 'news',
  },
  {
    id: 'b-privacy', eventId: 'privacy', persona: 'B',
    avatar: '#78716c', username: 'SecurityFirst', handle: '@securityfirst', timestamp: '13h',
    content: 'Proposed privacy law would handicap law enforcement and make it harder to catch criminals. Location data helps find missing children and stop terrorists. Safety > privacy theater.',
    likes: 8100, shares: 3200, topic: 'news',
  },
]

const FILTER_LAYERS: FilterLayer[] = [
  { name: 'Interest Profile', removal: 25, description: 'Content outside your historical interests is deprioritized' },
  { name: 'Political Alignment', removal: 20, description: 'Opposing viewpoints suppressed to reduce "negative experience"' },
  { name: 'Engagement Prediction', removal: 25, description: 'Low-engagement content removed regardless of importance' },
  { name: 'Confirmation Bias Loop', removal: 15, description: 'Algorithm reinforces existing beliefs to maximize comfort' },
  { name: 'Revenue Optimization', removal: 8, description: 'Content that doesn\'t monetize well is deprioritized' },
]

// ─── Topic Colors ───────────────────────────────────────────────────

const TOPIC_COLORS: Record<FeedPost['topic'], { bg: string; text: string; label: string }> = {
  politics: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'POLITICS' },
  lifestyle: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'LIFESTYLE' },
  news: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'NEWS' },
  entertainment: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'ENTERTAINMENT' },
  tech: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', label: 'TECH' },
  economy: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'ECONOMY' },
}

// ─── Helpers ────────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

// ─── Post Card ──────────────────────────────────────────────────────

function PostCard({
  post,
  isSelected,
  isMatched,
  matchedTo,
  onClick,
}: {
  post: FeedPost
  isSelected: boolean
  isMatched: boolean
  matchedTo: string | null
  onClick: () => void
}) {
  const topicStyle = TOPIC_COLORS[post.topic]

  return (
    <motion.div
      layout
      whileHover={{ scale: isMatched ? 1 : 1.02 }}
      whileTap={{ scale: isMatched ? 1 : 0.98 }}
      onClick={onClick}
      className={`relative rounded-lg p-3 cursor-pointer transition-all border ${
        isMatched
          ? 'bg-green-950/40 border-green-500/30'
          : isSelected
            ? 'bg-white/10 border-blue-400/50 shadow-lg shadow-blue-500/10'
            : 'bg-white/[0.04] border-white/[0.08] hover:border-white/20'
      }`}
    >
      {/* Matched indicator */}
      {isMatched && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-black text-xs font-bold">{'\u2713'}</span>
        </div>
      )}

      {/* Topic badge */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${topicStyle.bg} ${topicStyle.text} uppercase tracking-wider`}>
          {topicStyle.label}
        </span>
        <span className="text-xs text-gray-500 font-mono">{post.timestamp}</span>
      </div>

      {/* Author row */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: post.avatar }} />
        <div className="min-w-0">
          <span className="text-xs font-semibold text-gray-200 block truncate">{post.username}</span>
          <span className="text-xs text-gray-500 block truncate">{post.handle}</span>
        </div>
      </div>

      {/* Content */}
      <p className="text-xs text-gray-300 leading-relaxed mb-2">
        {post.content}
      </p>

      {/* Engagement */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>{'\u2661'} {formatCount(post.likes)}</span>
        <span>{'\u21C4'} {formatCount(post.shares)}</span>
      </div>

      {/* Connection label */}
      {matchedTo && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 pt-2 border-t border-green-500/20"
        >
          <span className="text-xs font-mono text-green-400 uppercase tracking-wider">
            {'\u26A0'} Connected: {matchedTo}
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── Connection SVG ─────────────────────────────────────────────────

function ConnectionLines({
  connections,
  containerRef,
}: {
  connections: { eventId: string; biasLabel: string }[]
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; label: string; eventId: string }[]>([])

  useEffect(() => {
    if (!containerRef.current || connections.length === 0) return

    const updateLines = () => {
      const container = containerRef.current
      if (!container) return
      const containerRect = container.getBoundingClientRect()

      const newLines = connections.map(conn => {
        const postA = container.querySelector(`[data-event-a="${conn.eventId}"]`)
        const postB = container.querySelector(`[data-event-b="${conn.eventId}"]`)

        if (!postA || !postB) return null

        const rectA = postA.getBoundingClientRect()
        const rectB = postB.getBoundingClientRect()

        return {
          x1: rectA.right - containerRect.left,
          y1: rectA.top + rectA.height / 2 - containerRect.top,
          x2: rectB.left - containerRect.left,
          y2: rectB.top + rectB.height / 2 - containerRect.top,
          label: conn.biasLabel,
          eventId: conn.eventId,
        }
      }).filter(Boolean) as typeof lines

      setLines(newLines)
    }

    updateLines()
    const observer = new ResizeObserver(updateLines)
    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [connections, containerRef])

  if (lines.length === 0) return null

  return (
    <svg className="absolute inset-0 pointer-events-none z-10 hidden md:block" style={{ width: '100%', height: '100%' }}>
      {lines.map((line, i) => {
        const midX = (line.x1 + line.x2) / 2
        const midY = (line.y1 + line.y2) / 2

        return (
          <g key={line.eventId}>
            <motion.line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#22c55e"
              strokeWidth={1}
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
            <motion.circle
              cx={midX}
              cy={midY}
              r={3}
              fill="#22c55e"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.8, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            />
          </g>
        )
      })}
    </svg>
  )
}

// ─── Funnel Visualization ───────────────────────────────────────────

function FunnelViz({ visible }: { visible: boolean }) {
  const totalStart = 100
  let remaining = totalStart

  return (
    <div className="max-w-md mx-auto px-4">
      {/* Top: all content */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2 }}
        className="text-center mb-3"
      >
        <div className="font-mono text-xs text-green-500/60 uppercase tracking-wider mb-1">
          Total Available Content
        </div>
        <div className="font-mono text-2xl text-green-400 font-bold">{totalStart}%</div>
      </motion.div>

      {/* Funnel layers */}
      <div className="space-y-1">
        {FILTER_LAYERS.map((layer, i) => {
          const widthBefore = remaining
          remaining -= layer.removal
          const widthAfter = remaining

          return (
            <motion.div
              key={layer.name}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={visible ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.2, duration: 0.4 }}
              className="relative"
            >
              {/* Bar */}
              <div className="relative h-10 mx-auto" style={{ width: `${widthBefore}%` }}>
                <div
                  className="absolute inset-y-0 left-0 bg-red-500/20 border border-red-500/30 rounded flex items-center justify-between px-2"
                  style={{ width: '100%' }}
                >
                  <span className="font-mono text-xs text-red-400 truncate">{layer.name}</span>
                  <span className="font-mono text-xs text-red-300 font-bold flex-shrink-0 ml-1">-{layer.removal}%</span>
                </div>
              </div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={visible ? { opacity: 1 } : {}}
                transition={{ delay: 0.7 + i * 0.2 }}
                className="font-mono text-xs text-green-500/40 text-center mt-0.5"
              >
                {layer.description}
              </motion.p>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom: what reaches user */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.8 }}
        className="text-center mt-4"
      >
        <div className="inline-block border border-green-500/30 rounded-lg px-6 py-3 bg-green-950/30">
          <div className="font-mono text-xs text-green-500/60 uppercase tracking-wider mb-1">
            Content That Reaches You
          </div>
          <div className="font-mono text-3xl text-green-400 font-bold">{remaining}%</div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Animated Counter ───────────────────────────────────────────────

function AnimatedCounter({ target, suffix, visible }: { target: number; suffix: string; visible: boolean }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!visible) { setDisplay(0); return }
    const duration = 1500
    const start = performance.now()
    let raf: number

    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - (1 - progress) * (1 - progress)
      setDisplay(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [target, visible])

  return (
    <span className="font-mono font-bold text-green-400 tabular-nums">{display}{suffix}</span>
  )
}

// ─── Main Component ─────────────────────────────────────────────────

interface FilterBubbleVizProps {
  onComplete?: (score: number) => void
  onEvidenceAdd?: (evidence: { type: string; data: unknown }) => void
}

export function FilterBubbleViz({ onComplete, onEvidenceAdd }: FilterBubbleVizProps) {
  const [phase, setPhase] = useState<'feed' | 'algorithm' | 'finding'>('feed')
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const [connectedPairs, setConnectedPairs] = useState<Set<string>>(new Set())
  const [showReveal, setShowReveal] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const feedA = useMemo(() => FEED_POSTS.filter(p => p.persona === 'A'), [])
  const feedB = useMemo(() => FEED_POSTS.filter(p => p.persona === 'B'), [])

  // Get matched event details
  const connections = useMemo(() => {
    return Array.from(connectedPairs).map(eventId => {
      const event = EVENTS.find(e => e.eventId === eventId)
      return { eventId, biasLabel: event?.biasLabel || '' }
    })
  }, [connectedPairs])

  // Handle post click
  const handlePostClick = useCallback((post: FeedPost) => {
    if (connectedPairs.has(post.eventId)) return // already matched

    if (!selectedPost) {
      // First selection
      scan()
      setSelectedPost(post.id)
    } else {
      // Second selection — check for match
      const firstPost = FEED_POSTS.find(p => p.id === selectedPost)
      if (!firstPost) { setSelectedPost(null); return }

      if (firstPost.persona !== post.persona && firstPost.eventId === post.eventId) {
        // MATCH!
        impact()
        setConnectedPairs(prev => new Set([...prev, post.eventId]))
        setSelectedPost(null)

        // Check if enough pairs connected to unlock algorithm phase
        if (connectedPairs.size + 1 >= 5 && !showReveal) {
          setShowReveal(true)
        }
      } else {
        // No match
        glitch()
        setSelectedPost(post.id) // select the new one instead
      }
    }
  }, [selectedPost, connectedPairs, showReveal])

  // Transition to algorithm phase
  const handleShowAlgorithm = useCallback(() => {
    impact()
    whoosh()
    setPhase('algorithm')
  }, [])

  // Transition to finding phase
  const handleShowFinding = useCallback(() => {
    impact()
    setPhase('finding')
  }, [])

  // Add evidence
  const handleAddEvidence = useCallback(() => {
    playSuccess()
    onEvidenceAdd?.({
      type: 'filter-bubble-analysis',
      data: {
        pairsConnected: connectedPairs.size,
        totalPossible: EVENTS.length,
        biasTypes: Array.from(connectedPairs).map(id => {
          const ev = EVENTS.find(e => e.eventId === id)
          return { event: ev?.eventName, bias: ev?.biasLabel }
        }),
        contentOverlap: '7%',
        filterLayers: FILTER_LAYERS.map(l => ({ name: l.name, removal: `${l.removal}%` })),
      },
    })
    onComplete?.(connectedPairs.size)
  }, [connectedPairs, onComplete, onEvidenceAdd])

  // ── Phase 3: THE FINDING ──────────────────────────────────────────
  if (phase === 'finding') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex flex-col items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="max-w-lg w-full"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-mono text-xs text-red-400/80 uppercase tracking-[0.3em] mb-2"
            >
              Investigation Complete
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl font-mono text-green-400 font-bold mb-4"
            >
              The Algorithm Doesn&apos;t Show You the World.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-green-400/70 font-mono text-lg mb-2"
            >
              It Shows You a Mirror.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-green-500/50 font-mono text-xs leading-relaxed max-w-md mx-auto"
            >
              Two people experiencing the same world see completely different realities.
              The algorithm curates a comfortable echo chamber that reinforces existing
              beliefs, eliminates challenging perspectives, and fractures shared understanding.
            </motion.p>
          </div>

          {/* Score */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="border border-green-500/20 rounded p-4 mb-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <div className="text-center">
                <div className="text-2xl font-mono text-green-400 font-bold">
                  {connectedPairs.size}/{EVENTS.length}
                </div>
                <div className="text-xs font-mono text-green-500/40 uppercase tracking-wider mt-1">
                  Bias Pairs Found
                </div>
              </div>
              <div className="hidden sm:block h-8 w-px bg-green-500/10" />
              <div className="text-center">
                <div className="text-2xl font-mono text-red-400 font-bold">
                  7%
                </div>
                <div className="text-xs font-mono text-green-500/40 uppercase tracking-wider mt-1">
                  Content Overlap
                </div>
              </div>
              <div className="hidden sm:block h-8 w-px bg-green-500/10" />
              <div className="text-center">
                <div className="text-2xl font-mono text-yellow-400 font-bold">
                  93%
                </div>
                <div className="text-xs font-mono text-green-500/40 uppercase tracking-wider mt-1">
                  Content Filtered Out
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bias types found */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="space-y-2 mb-6"
          >
            {Array.from(connectedPairs).map((eventId, i) => {
              const ev = EVENTS.find(e => e.eventId === eventId)
              if (!ev) return null
              return (
                <motion.div
                  key={eventId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 + i * 0.1 }}
                  className="flex items-center gap-2 text-xs font-mono"
                >
                  <span className="text-green-400">{'\u2713'}</span>
                  <span className="text-green-500/60">{ev.eventName}:</span>
                  <span className="text-yellow-400/70">{ev.biasLabel}</span>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddEvidence}
            className="w-full border border-green-500/40 text-green-400 font-mono text-sm py-3 rounded
              hover:bg-green-500/10 transition-colors tracking-wider uppercase"
          >
            {'\u25C6'} Add to Evidence Dossier
          </motion.button>
        </motion.div>
      </motion.div>
    )
  }

  // ── Phase 2: THE ALGORITHM ────────────────────────────────────────
  if (phase === 'algorithm') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex flex-col"
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-green-500/10 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-red-400/60 font-mono text-xs uppercase tracking-wider animate-pulse">
              {'\u26A0'} Algorithmic Filtering Exposed
            </span>
          </div>
          <span className="font-mono text-xs text-green-500/40">
            Phase 2/3
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Dramatic intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="font-mono text-lg text-green-400 font-bold mb-2">
              How The Algorithm Filters Reality
            </h2>
            <p className="font-mono text-xs text-green-500/50 max-w-md mx-auto">
              You connected {connectedPairs.size} matching events with completely different framing.
              Here&apos;s how the algorithm makes this happen:
            </p>
          </motion.div>

          {/* Funnel */}
          <div className="mb-8">
            <FunnelViz visible={true} />
          </div>

          {/* Overlap stat */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.2, type: 'spring' }}
            className="max-w-sm mx-auto border border-red-500/30 rounded-lg p-4 bg-red-950/20 text-center mb-6"
          >
            <div className="font-mono text-xs text-red-400/60 uppercase tracking-wider mb-2">
              Content Overlap Between Personas
            </div>
            <div className="font-mono text-4xl font-bold mb-1">
              <AnimatedCounter target={7} suffix="%" visible={true} />
            </div>
            <p className="font-mono text-xs text-red-400/40">
              Persona A and Persona B share only 7% of the same content. They live in different realities.
            </p>
          </motion.div>

          {/* Persona comparison */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto mb-6"
          >
            <div className="border border-blue-500/20 rounded p-3 bg-blue-950/10">
              <div className="font-mono text-xs text-blue-400 uppercase tracking-wider mb-1.5">Persona A Sees</div>
              <div className="space-y-1 font-mono text-xs text-blue-300/60">
                <div>{'\u2022'} Progressive framing of events</div>
                <div>{'\u2022'} Worker-focused economic takes</div>
                <div>{'\u2022'} Tech criticism & regulation support</div>
                <div>{'\u2022'} 0% conservative perspectives</div>
              </div>
            </div>
            <div className="border border-red-500/20 rounded p-3 bg-red-950/10">
              <div className="font-mono text-xs text-red-400 uppercase tracking-wider mb-1.5">Persona B Sees</div>
              <div className="space-y-1 font-mono text-xs text-red-300/60">
                <div>{'\u2022'} Free-market framing of events</div>
                <div>{'\u2022'} Business-focused economic takes</div>
                <div>{'\u2022'} Innovation-first & deregulation</div>
                <div>{'\u2022'} 0% progressive perspectives</div>
              </div>
            </div>
          </motion.div>

          {/* Next phase button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2 }}
            className="flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShowFinding}
              className="border border-green-500/40 text-green-400 font-mono text-xs px-6 py-2.5 rounded
                hover:bg-green-500/10 transition-colors uppercase tracking-wider min-h-[44px]"
            >
              See Final Analysis {'\u2192'}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // ── Phase 1: THE FEED ─────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-green-500/10 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-green-500/50 font-mono text-xs uppercase tracking-wider">
            Filter Bubble
          </span>
          <span className="text-green-400 font-mono text-sm tabular-nums">
            {connectedPairs.size}/{EVENTS.length} pairs
          </span>
        </div>
        <div className="flex items-center gap-3">
          {selectedPost && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-blue-400/60 font-mono text-xs animate-pulse"
            >
              Select matching post in other feed...
            </motion.span>
          )}
          <span className="font-mono text-xs text-green-500/40">
            Phase 1/3
          </span>
        </div>
      </div>

      {/* Instruction bar */}
      <div className="flex-shrink-0 border-b border-green-500/5 px-4 py-1.5 bg-green-950/20">
        <p className="font-mono text-xs text-green-500/50 text-center">
          {'\u25B6'} Click matching posts across feeds to connect them. Same event, different framing. Find {5 - Math.min(connectedPairs.size, 5) > 0 ? `${5 - connectedPairs.size} more` : 'all'} pairs to unlock the algorithm reveal.
        </p>
      </div>

      {/* Feeds container */}
      <div className="flex-1 overflow-hidden relative" ref={containerRef}>
        {/* Connection lines (desktop only) */}
        <ConnectionLines connections={connections} containerRef={containerRef} />

        <div className="h-full flex flex-col md:flex-row">
          {/* Feed A */}
          <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-green-500/10 min-h-0">
            <div className="flex-shrink-0 px-3 py-1.5 border-b border-blue-500/10 bg-blue-950/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="font-mono text-xs text-blue-400 uppercase tracking-wider font-bold">
                  Persona A
                </span>
                <span className="font-mono text-xs text-blue-400/40">
                  Tech / Urban / Liberal
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {feedA.map(post => (
                <div key={post.id} data-event-a={post.eventId}>
                  <PostCard
                    post={post}
                    isSelected={selectedPost === post.id}
                    isMatched={connectedPairs.has(post.eventId)}
                    matchedTo={
                      connectedPairs.has(post.eventId)
                        ? EVENTS.find(e => e.eventId === post.eventId)?.eventName || null
                        : null
                    }
                    onClick={() => handlePostClick(post)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Feed B */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-shrink-0 px-3 py-1.5 border-b border-red-500/10 bg-red-950/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="font-mono text-xs text-red-400 uppercase tracking-wider font-bold">
                  Persona B
                </span>
                <span className="font-mono text-xs text-red-400/40">
                  Sports / Rural / Conservative
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {feedB.map(post => (
                <div key={post.id} data-event-b={post.eventId}>
                  <PostCard
                    post={post}
                    isSelected={selectedPost === post.id}
                    isMatched={connectedPairs.has(post.eventId)}
                    matchedTo={
                      connectedPairs.has(post.eventId)
                        ? EVENTS.find(e => e.eventId === post.eventId)?.eventName || null
                        : null
                    }
                    onClick={() => handlePostClick(post)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reveal bar */}
      <AnimatePresence>
        {showReveal && phase === 'feed' && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="flex-shrink-0 border-t border-green-500/20 bg-black/95 backdrop-blur-sm px-4 py-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-xs text-yellow-400 uppercase tracking-wider mb-0.5">
                  {'\u26A0'} Pattern Detected
                </div>
                <p className="font-mono text-xs text-green-400/70">
                  {connectedPairs.size} bias patterns exposed. Ready to see how the algorithm creates this?
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShowAlgorithm}
                className="flex-shrink-0 border border-green-500/40 text-green-400 font-mono text-xs px-4 py-2.5 rounded
                  hover:bg-green-500/10 transition-colors uppercase tracking-wider min-h-[44px]"
              >
                Expose Algorithm {'\u2192'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom nav */}
      <div className="flex-shrink-0 border-t border-green-500/10 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {EVENTS.map(ev => (
            <div
              key={ev.eventId}
              className={`w-2 h-2 rounded-full transition-colors ${
                connectedPairs.has(ev.eventId) ? 'bg-green-400' : 'bg-green-500/10'
              }`}
              title={ev.eventName}
            />
          ))}
        </div>
        <span className="font-mono text-xs text-green-500/30">
          {connectedPairs.size < 5
            ? `Find ${5 - connectedPairs.size} more pairs to unlock reveal`
            : 'Algorithm reveal unlocked!'}
        </span>
      </div>
    </div>
  )
}
