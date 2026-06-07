'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useDatavist, ROLE_CONFIG } from '@/lib/store/useDatavist'
import { MISSIONS, getMissionBySlug } from '@/lib/data/missions'
import type { Mission } from '@/lib/data/missions'
import { CHAPTERS, isChapterUnlocked } from '@/lib/data/chapters'
// Sound removed — was causing performance issues and felt cringe

// ────────────────────────────────────────────────────────────
// CONSTANTS
// ────────────────────────────────────────────────────────────

const FEED_CATEGORIES = [
  { label: 'COOKIE HARVEST', color: '#ff4444', icon: 'red' },
  { label: 'PRICE DELTA', color: '#ffd600', icon: 'yellow' },
  { label: 'PROFILE UPDATE', color: '#b388ff', icon: 'purple' },
  { label: 'DARK PATTERN', color: '#00e5ff', icon: 'cyan' },
  { label: 'SURVEILLANCE', color: '#00ff41', icon: 'green' },
  { label: 'DATA BREACH', color: '#ff6d00', icon: 'orange' },
  { label: 'ALGO BIAS', color: '#ea80fc', icon: 'pink' },
  { label: 'TRACKING', color: '#ff1744', icon: 'crimson' },
]

const FEED_TEMPLATES = [
  '{cat}: {n} trackers detected on {site}',
  '{cat}: +{pct}% surge detected ({city1} → {city2})',
  '{cat}: Shadow attribute "{attr}" updated for {bigN} users',
  '{cat}: Confirmshaming detected on {platform}',
  '{cat}: {n} profiles sold to data broker "{broker}"',
  '{cat}: Device fingerprinting active on {site}',
  '{cat}: Emotion inference model retrained — {bigN} new labels',
  '{cat}: Dynamic pricing variance {pct}% across postal codes',
  '{cat}: Browser history exfiltration via {method} on {site}',
  '{cat}: Consent banner bypass rate {pct}% on {platform}',
  '{cat}: {n} location pings harvested in {city1} (last hour)',
  '{cat}: Behavioral prediction accuracy now {pct}% for {attr}',
  '{cat}: Invisible pixel loaded {n} times on {site}',
  '{cat}: Price discrimination flag: {city1} vs {city2} — {pct}% gap',
  '{cat}: Predictive policing model updated with {bigN} new records',
  '{cat}: A/B test "{method}" deployed on {platform} — {bigN} exposed',
]

const SITES = [
  'news-daily.com', 'shop-global.net', 'social-feed.io', 'travel-compare.eu',
  'health-track.app', 'retail-platform.com', 'stream-now.tv', 'finance-hub.org',
  'edu-portal.net', 'job-board.co', 'dating-app.xyz', 'food-delivery.app',
]
const PLATFORMS = [
  'MetaPlatform', 'DataCorp', 'AdVantage', 'TrackNet', 'SocialPulse',
  'PriceWise', 'EngageMax', 'RetailOS', 'StreamCo', 'FitTrack',
]
const CITIES = [
  'Berlin', 'Munich', 'London', 'New York', 'Tokyo', 'Paris', 'Lagos',
  'Sao Paulo', 'Sydney', 'Toronto', 'Seoul', 'Amsterdam', 'Nairobi', 'Mumbai',
]
const BROKERS = [
  'AcxiomDelta', 'OracleDataCloud', 'EpsilonLX', 'CoreLogicPrime',
  'LexisNexisRisk', 'TransUnionAlt', 'PeopleFindPro', 'InfernoData',
]
const ATTRS = [
  'political_leaning', 'income_bracket', 'health_risk', 'purchase_intent',
  'emotional_state', 'fertility_window', 'addiction_score', 'loyalty_decay',
]
const METHODS = [
  'canvas fingerprinting', 'CNAME cloaking', 'link decoration',
  'server-side tracking', 'probabilistic ID', 'cohort inference',
]

const CATEGORY_COLORS: Record<Mission['category'], { bg: string; text: string }> = {
  greenwashing: { bg: 'bg-green-500/10', text: 'text-green-400' },
  pricing: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  manipulation: { bg: 'bg-red-500/10', text: 'text-red-400' },
  surveillance: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  inequality: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateFeedEvent(): { id: string; text: string; color: string; time: string } {
  const cat = randomPick(FEED_CATEGORIES)
  const template = randomPick(FEED_TEMPLATES)
  const text = template
    .replace('{cat}', cat.label)
    .replace('{n}', String(Math.floor(Math.random() * 9000) + 100))
    .replace('{pct}', String(Math.floor(Math.random() * 85) + 5))
    .replace('{site}', randomPick(SITES))
    .replace('{platform}', randomPick(PLATFORMS))
    .replace('{city1}', randomPick(CITIES))
    .replace('{city2}', randomPick(CITIES))
    .replace('{broker}', randomPick(BROKERS))
    .replace('{attr}', randomPick(ATTRS))
    .replace('{bigN}', (Math.random() * 50 + 1).toFixed(1) + 'M')
    .replace('{method}', randomPick(METHODS))

  const now = new Date()
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })

  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, text, color: cat.color, time }
}

// ────────────────────────────────────────────────────────────
// GHOST MESSAGES
// ────────────────────────────────────────────────────────────

const GHOST_LINES = [
  'Monitoring {n} data streams. Anomaly detected in pricing cluster.',
  'Your investigation is {pct}% complete. The pattern is forming.',
  'New surveillance node detected. Adding to map.',
  'Cross-referencing corporate filings with emissions data...',
  'Intercepted 47 tracking pixels on a single news article.',
  'The data brokers are active tonight. {n} transactions in the last hour.',
  'Pattern match: same dark pattern template across 14 platforms.',
  'Behavioral prediction models updated. Accuracy increasing.',
  'Your influence score is growing. They are starting to notice.',
  'Encrypted channel stable. No interception detected.',
  'Scanning legislative databases for new privacy regulations...',
  'Alert: A/B test deploying emotional manipulation on {n}K users.',
  'Correlation found between surge pricing and low-income postal codes.',
  'Three new data broker registrations detected in Delaware.',
  'The network is larger than we estimated. Recalculating scope.',
  'Operative, your work here matters. Stay focused.',
  'Indexing your findings across all previous investigations...',
  'Signal strength: strong. Proceeding with deep scan.',
  'Anomalous data flow detected between ad exchanges.',
  'Your counter-surveillance toolkit is {pct}% assembled.',
]

function generateGhostLine(): string {
  return randomPick(GHOST_LINES)
    .replace('{n}', String(Math.floor(Math.random() * 900) + 100))
    .replace('{pct}', String(Math.floor(Math.random() * 80) + 15))
}

// ────────────────────────────────────────────────────────────
// WORLD MAP SVG (simplified continents)
// ────────────────────────────────────────────────────────────

const WORLD_MAP_PATH = `M 120 55 L 135 50 L 150 48 L 165 52 L 175 58 L 180 65 L 178 72 L 170 78 L 160 80 L 150 78 L 140 72 L 130 68 L 120 62 Z
M 60 65 L 75 58 L 90 55 L 105 58 L 115 62 L 118 68 L 115 75 L 108 82 L 100 88 L 92 90 L 80 88 L 70 82 L 62 75 Z
M 195 55 L 220 48 L 250 45 L 275 48 L 290 52 L 300 58 L 310 65 L 312 72 L 308 78 L 295 82 L 278 85 L 260 82 L 245 78 L 235 72 L 225 68 L 210 62 L 200 58 Z
M 310 55 L 330 48 L 350 50 L 365 55 L 375 62 L 378 70 L 370 78 L 358 82 L 345 80 L 335 75 L 325 68 L 315 62 Z
M 175 90 L 185 85 L 198 88 L 210 92 L 218 98 L 220 108 L 215 118 L 208 128 L 198 135 L 188 138 L 180 132 L 178 122 L 176 112 L 174 100 Z
M 280 95 L 295 90 L 310 92 L 320 98 L 325 108 L 318 115 L 308 120 L 295 118 L 285 112 L 278 105 Z
M 340 120 L 355 115 L 370 118 L 380 125 L 378 135 L 370 142 L 358 145 L 345 140 L 338 132 Z`

// City positions for surveillance dots (x, y on 400x180 viewBox)
const CITY_NODES = [
  { name: 'New York', x: 105, y: 65, region: 'NA' },
  { name: 'San Francisco', x: 62, y: 68, region: 'NA' },
  { name: 'London', x: 200, y: 52, region: 'EU' },
  { name: 'Berlin', x: 218, y: 53, region: 'EU' },
  { name: 'Paris', x: 208, y: 58, region: 'EU' },
  { name: 'Amsterdam', x: 210, y: 52, region: 'EU' },
  { name: 'Tokyo', x: 358, y: 62, region: 'AS' },
  { name: 'Seoul', x: 348, y: 60, region: 'AS' },
  { name: 'Mumbai', x: 295, y: 92, region: 'AS' },
  { name: 'Singapore', x: 320, y: 108, region: 'AS' },
  { name: 'Sydney', x: 365, y: 135, region: 'OC' },
  { name: 'Sao Paulo', x: 118, y: 128, region: 'SA' },
  { name: 'Lagos', x: 205, y: 105, region: 'AF' },
  { name: 'Nairobi', x: 230, y: 108, region: 'AF' },
  { name: 'Toronto', x: 98, y: 58, region: 'NA' },
  { name: 'Dubai', x: 265, y: 82, region: 'ME' },
  { name: 'Moscow', x: 250, y: 48, region: 'EU' },
  { name: 'Shanghai', x: 340, y: 70, region: 'AS' },
  { name: 'Frankfurt', x: 215, y: 55, region: 'EU' },
  { name: 'Stockholm', x: 222, y: 45, region: 'EU' },
]

// ────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────────────────

export default function OpsPage() {
  const router = useRouter()
  const profile = useDatavist((s) => s.profile)
  const _soundEnabled = useDatavist((s) => s.soundEnabled)

  // ── Panels state ──
  const [feedEvents, setFeedEvents] = useState<ReturnType<typeof generateFeedEvent>[]>([])
  const [ghostMessages, setGhostMessages] = useState<string[]>([])
  const [ghostOpen, setGhostOpen] = useState(true)
  const [nodeCount, setNodeCount] = useState(2847)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [dataFlows, setDataFlows] = useState<{ from: number; to: number; id: string }[]>([])
  const [flashingEventId, setFlashingEventId] = useState<string | null>(null)
  const [interacted, setInteracted] = useState(false)

  const feedRef = useRef<HTMLDivElement>(null)
  const ghostRef = useRef<HTMLDivElement>(null)
  const droneStopRef = useRef<(() => void) | null>(null)

  // ── Derived data ──
  const currentChapter = useMemo(() => {
    if (!profile) return CHAPTERS[0]
    return CHAPTERS.find((c) => c.number === profile.currentChapter) ?? CHAPTERS[0]
  }, [profile])

  const chapterMissions = useMemo(() => {
    return currentChapter.missionSlugs
      .map((slug) => getMissionBySlug(slug))
      .filter(Boolean) as typeof MISSIONS
  }, [currentChapter])

  const completedCount = profile?.missionsCompleted.length ?? 0
  const influenceScore = profile?.influenceScore ?? 0
  const chapterProgress = useMemo(() => {
    if (!profile) return 0
    const done = chapterMissions.filter((m) =>
      profile.missionsCompleted.includes(m.id)
    ).length
    return chapterMissions.length > 0 ? Math.round((done / chapterMissions.length) * 100) : 0
  }, [profile, chapterMissions])

  // Next uncompleted mission in current chapter
  const nextMission = useMemo(() => {
    if (!profile) return null
    return chapterMissions.find((m) => !profile.missionsCompleted.includes(m.id)) ?? null
  }, [profile, chapterMissions])

  const evidenceCount = completedCount * 4 + Math.floor(influenceScore / 50)

  // Sound disabled for ops center (performance + UX)

  const handleInteraction = useCallback(() => {
    if (!interacted) setInteracted(true)
  }, [interacted])

  // Refs for live feed to avoid interval reset on sound/interaction change
  // Sound refs removed — no audio in ops center

  // ── Live feed generator ──
  useEffect(() => {
    // Seed initial events
    const initial = Array.from({ length: 8 }, () => generateFeedEvent())
    setFeedEvents(initial)

    let timeout: ReturnType<typeof setTimeout>
    const scheduleNext = () => {
      timeout = setTimeout(() => {
        const evt = generateFeedEvent()
        setFlashingEventId(evt.id)
        setFeedEvents((prev) => {
          const next = [evt, ...prev]
          return next.slice(0, 20)
        })
        // no sound on feed events
        setTimeout(() => setFlashingEventId(null), 600)
        scheduleNext()
      }, 4000 + Math.random() * 4000)
    }
    scheduleNext()

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-scroll feed
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0
    }
  }, [feedEvents])

  // ── Ghost commentary ──
  useEffect(() => {
    setGhostMessages([generateGhostLine()])

    let timeout: ReturnType<typeof setTimeout>
    const scheduleGhost = () => {
      timeout = setTimeout(() => {
        setGhostMessages((prev) => {
          const next = [...prev, generateGhostLine()]
          return next.slice(-15)
        })
        scheduleGhost()
      }, 15000 + Math.random() * 15000)
    }
    scheduleGhost()

    return () => clearTimeout(timeout)
  }, [])

  // Auto-scroll ghost
  useEffect(() => {
    if (ghostRef.current) {
      ghostRef.current.scrollTop = ghostRef.current.scrollHeight
    }
  }, [ghostMessages])

  // ── Surveillance node counter (slower) ──
  useEffect(() => {
    const id = setInterval(() => {
      setNodeCount((n) => n + 1)
    }, 8000)
    return () => clearInterval(id)
  }, [])

  // ── Data flow lines (less frequent) ──
  useEffect(() => {
    const id = setInterval(() => {
      const from = Math.floor(Math.random() * CITY_NODES.length)
      let to = Math.floor(Math.random() * CITY_NODES.length)
      while (to === from) to = Math.floor(Math.random() * CITY_NODES.length)
      const flowId = `${Date.now()}-${from}-${to}`
      setDataFlows((prev) => [...prev.slice(-2), { from, to, id: flowId }])
    }, 6000)
    return () => clearInterval(id)
  }, [])

  // ── Helpers ──
  const isMissionCompleted = useCallback(
    (missionId: string) => profile?.missionsCompleted.includes(missionId) ?? false,
    [profile]
  )

  const isMissionAvailable = useCallback(
    (missionSlug: string) => {
      if (!profile) return false
      const chapter = CHAPTERS.find((c) => c.missionSlugs.includes(missionSlug))
      if (!chapter) return false
      return isChapterUnlocked(chapter, profile.missionsCompleted, profile.chaptersCompleted)
    },
    [profile]
  )

  const getDotColor = useCallback(
    (index: number) => {
      if (index % 5 === 0) return '#00ff41' // green - your investigations
      if (index % 3 === 0) return '#ffd600' // yellow - data breaches
      return '#ff4444' // red - active surveillance
    },
    []
  )

  const getTooltipData = useCallback((name: string) => {
    const profiles = (Math.random() * 50 + 1).toFixed(1)
    const trackers = Math.floor(Math.random() * 5000) + 500
    return `${name}: ${profiles}M profiles harvested today | ${trackers} active trackers`
  }, [])

  if (!profile) return null

  const roleConfig = ROLE_CONFIG[profile.role]

  // ────────────────────────────────────────────────────────────
  // PANEL COMPONENTS (inline for single-file)
  // ────────────────────────────────────────────────────────────

  const LiveFeed = (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0,255,65,0.03) 1px, rgba(0,255,65,0.03) 2px)',
        }}
      />
      <div className="flex-shrink-0 px-3 py-2 border-b border-green-500/10">
        <span className="font-mono text-xs text-green-500/60 uppercase tracking-[0.2em]">
          Live Feed
        </span>
        <span className="font-mono text-xs text-red-500/60 ml-2 animate-pulse">
          REC
        </span>
      </div>
      <div ref={feedRef} className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        <AnimatePresence initial={false}>
          {feedEvents.map((evt) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: 1,
                x: 0,
                backgroundColor:
                  flashingEventId === evt.id ? 'rgba(0,255,65,0.08)' : 'transparent',
              }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-2 py-1 font-mono text-xs leading-tight"
            >
              <span className="text-green-500/30 flex-shrink-0 tabular-nums">{evt.time}</span>
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[3px]"
                style={{ backgroundColor: evt.color }}
              />
              <span className="text-green-400/80 break-all">{evt.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )

  const SurveillanceMap = (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="flex-shrink-0 px-3 py-2 border-b border-green-500/10 flex items-center justify-between">
        <span className="font-mono text-xs text-green-500/60 uppercase tracking-[0.2em]">
          Surveillance Map
        </span>
        <span className="font-mono text-xs text-green-400/70 tabular-nums">
          ACTIVE NODES: {nodeCount.toLocaleString()}
        </span>
      </div>
      <div className="flex-1 relative flex items-center justify-center p-2 overflow-hidden">
        <svg
          viewBox="0 0 420 180"
          className="w-full h-full max-h-full"
          style={{ filter: 'drop-shadow(0 0 2px rgba(0,255,65,0.15))' }}
        >
          {/* World map outline */}
          <path
            d={WORLD_MAP_PATH}
            fill="none"
            stroke="rgba(0,255,65,0.12)"
            strokeWidth="0.5"
          />

          {/* Data flow lines */}
          {dataFlows.map((flow) => {
            const fromCity = CITY_NODES[flow.from]
            const toCity = CITY_NODES[flow.to]
            return (
              <motion.line
                key={flow.id}
                x1={fromCity.x}
                y1={fromCity.y}
                x2={toCity.x}
                y2={toCity.y}
                stroke="rgba(0,255,65,0.2)"
                strokeWidth="0.3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 0.6, 0] }}
                transition={{ duration: 2.5, ease: 'easeInOut' }}
              />
            )
          })}

          {/* City dots */}
          {CITY_NODES.map((city, i) => {
            const color = getDotColor(i)
            const isHovered = hoveredCity === city.name
            return (
              <g key={city.name}>
                {/* Pulse ring */}
                <motion.circle
                  cx={city.x}
                  cy={city.y}
                  r={isHovered ? 6 : 3}
                  fill="none"
                  stroke={color}
                  strokeWidth="0.3"
                  animate={{
                    r: [3, 6, 3],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{
                    duration: 2 + (i % 3),
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: (i * 0.3) % 2,
                  }}
                />
                {/* Core dot */}
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isHovered ? 2.5 : 1.5}
                  fill={color}
                  className="cursor-pointer"
                  style={{ filter: `drop-shadow(0 0 3px ${color})` }}
                  onMouseEnter={() => setHoveredCity(city.name)}
                  onMouseLeave={() => setHoveredCity(null)}
                />
              </g>
            )
          })}
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredCity && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/90 border border-green-500/20 px-3 py-1.5 font-mono text-xs text-green-400/80 whitespace-nowrap z-20"
            >
              {getTooltipData(hoveredCity)}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map legend */}
        <div className="absolute bottom-2 left-3 flex items-center gap-3 font-mono text-xs text-green-500/40">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            YOUR OPS
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            SURVEILLANCE
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            BREACH
          </span>
        </div>
      </div>
    </div>
  )

  const MissionsQueue = (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 px-3 py-2 border-b border-green-500/10">
        <span className="font-mono text-xs text-green-500/60 uppercase tracking-[0.2em]">
          Mission Queue
        </span>
      </div>
      <div className="flex-shrink-0 px-3 py-1.5 border-b border-green-500/5">
        <span className="font-mono text-xs text-green-400/90 uppercase tracking-wider">
          CH.{currentChapter.number}: {currentChapter.title}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {chapterMissions.map((mission) => {
          const completed = isMissionCompleted(mission.id)
          const available = isMissionAvailable(mission.slug)
          const isActive = profile?.activeMissionId === mission.id

          return (
            <button
              key={mission.id}
              onClick={() => {
                if (available && !completed) {
                  router.push(`/ops/investigate/${mission.slug}`)
                }
              }}
              disabled={!available || completed}
              className={`
                w-full text-left flex items-center gap-2 py-1.5 px-1 font-mono text-xs
                transition-colors duration-200 rounded-sm
                ${completed ? 'opacity-40 cursor-default' : ''}
                ${available && !completed ? 'hover:bg-green-500/5 cursor-pointer' : ''}
                ${!available ? 'opacity-20 cursor-not-allowed' : ''}
              `}
            >
              {/* Status icon */}
              {completed ? (
                <span className="text-green-500 flex-shrink-0 w-3 text-center">&#10003;</span>
              ) : available ? (
                <motion.span
                  className="flex-shrink-0 w-3 text-center"
                  animate={isActive ? { opacity: [1, 0.3, 1] } : { opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: isActive
                        ? ROLE_CONFIG[profile.role].colorHex
                        : '#00ff41',
                    }}
                  />
                </motion.span>
              ) : (
                <span className="text-green-500/20 flex-shrink-0 w-3 text-center text-xs">&#128274;</span>
              )}

              {/* Mission info */}
              <span
                className={`flex-1 truncate ${
                  completed ? 'line-through text-green-500/40' : 'text-green-400/80'
                }`}
              >
                {mission.title}
              </span>

              <span className="text-green-500/20 flex-shrink-0 hidden sm:inline">---</span>

              <span className="text-green-500/30 flex-shrink-0 hidden sm:inline">
                {mission.difficulty}
              </span>

              <span className="text-green-500/20 flex-shrink-0 hidden sm:inline">---</span>

              <span className="text-green-500/30 flex-shrink-0 tabular-nums hidden sm:inline">
                {mission.estimatedTime}
              </span>
            </button>
          )
        })}

        {/* Show other chapters as locked entries */}
        {CHAPTERS.filter((c) => c.number !== currentChapter.number).map((ch) => {
          const unlocked = isChapterUnlocked(
            ch,
            profile.missionsCompleted,
            profile.chaptersCompleted
          )
          if (!unlocked) return null
          return (
            <div key={ch.id} className="mt-3 border-t border-green-500/5 pt-2">
              <div className="font-mono text-xs text-green-500/40 uppercase tracking-wider px-1 mb-1">
                CH.{ch.number}: {ch.title}
              </div>
              {ch.missionSlugs.map((slug) => {
                const m = getMissionBySlug(slug)
                if (!m) return null
                const done = isMissionCompleted(m.id)
                return (
                  <button
                    key={m.id}
                    onClick={() => router.push(`/ops/investigate/${m.slug}`)}
                    disabled={done}
                    className={`
                      w-full text-left flex items-center gap-2 py-1 px-1 font-mono text-xs
                      transition-colors duration-200 rounded-sm
                      ${done ? 'opacity-40 cursor-default' : 'hover:bg-green-500/5 cursor-pointer'}
                    `}
                  >
                    {done ? (
                      <span className="text-green-500 flex-shrink-0 w-3 text-center">&#10003;</span>
                    ) : (
                      <span className="flex-shrink-0 w-3 text-center">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500/50" />
                      </span>
                    )}
                    <span
                      className={`flex-1 truncate ${
                        done ? 'line-through text-green-500/40' : 'text-green-400/70'
                      }`}
                    >
                      {m.title}
                    </span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )

  const EvidenceTracker = (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0 px-3 py-2 border-b border-green-500/10">
        <span className="font-mono text-xs text-green-500/60 uppercase tracking-[0.2em]">
          Evidence Tracker
        </span>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-px p-2">
        {/* Evidence collected */}
        <div className="flex flex-col items-center justify-center p-2">
          <span className="font-mono text-xs text-green-500/40 uppercase tracking-wider">
            Evidence
          </span>
          <span className="font-mono text-2xl text-green-400 tabular-nums mt-0.5">
            {evidenceCount}
          </span>
        </div>

        {/* Confirmed findings */}
        <div className="flex flex-col items-center justify-center p-2">
          <span className="font-mono text-xs text-green-500/40 uppercase tracking-wider">
            Findings
          </span>
          <span className="font-mono text-2xl text-green-400 tabular-nums mt-0.5">
            {completedCount * 3}
          </span>
        </div>

        {/* Influence */}
        <div className="flex flex-col items-center justify-center p-2">
          <span className="font-mono text-xs text-green-500/40 uppercase tracking-wider">
            Influence
          </span>
          <motion.span
            className="font-mono text-2xl tabular-nums mt-0.5"
            style={{
              color: ROLE_CONFIG[profile.role].colorHex,
              textShadow: `0 0 12px ${ROLE_CONFIG[profile.role].colorHex}40`,
            }}
          >
            {influenceScore}
          </motion.span>
        </div>

        {/* Active investigations */}
        <div className="flex flex-col items-center justify-center p-2">
          <span className="font-mono text-xs text-green-500/40 uppercase tracking-wider">
            Active
          </span>
          <span className="font-mono text-2xl text-green-400 tabular-nums mt-0.5">
            {profile.activeMissionId ? 1 : 0}
          </span>
        </div>
      </div>

      {/* Chapter progress bar */}
      <div className="flex-shrink-0 px-3 pb-2">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono text-xs text-green-500/40 uppercase">
            Ch.{currentChapter.number} Progress
          </span>
          <span className="font-mono text-xs text-green-500/50 tabular-nums">
            {chapterProgress}%
          </span>
        </div>
        <div className="h-1 bg-green-500/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: ROLE_CONFIG[profile.role].colorHex }}
            initial={{ width: 0 }}
            animate={{ width: `${chapterProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  )

  const GhostTerminal = (
    <div className="h-full flex flex-col overflow-hidden">
      <button
        onClick={() => setGhostOpen(!ghostOpen)}
        className="flex-shrink-0 px-3 py-2 border-b border-green-500/10 flex items-center gap-2 hover:bg-green-500/5 transition-colors w-full text-left"
      >
        <motion.span
          className="w-2 h-2 rounded-full bg-green-500"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="font-mono text-xs text-green-500/60 uppercase tracking-[0.2em] flex-1">
          Ghost
        </span>
        <span className="font-mono text-xs text-green-500/30">
          {ghostOpen ? '[-]' : '[+]'}
        </span>
      </button>

      <AnimatePresence>
        {ghostOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col overflow-hidden min-h-0"
          >
            <div ref={ghostRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
              {ghostMessages.map((msg, i) => (
                <motion.div
                  key={`ghost-${i}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="font-mono text-xs text-green-400/60 leading-relaxed"
                >
                  <span className="text-green-500/30 mr-1">&gt;</span>
                  {msg}
                </motion.div>
              ))}
            </div>

            {/* Expand button */}
            <div className="flex-shrink-0 px-3 py-1.5 border-t border-green-500/5">
              <button
                onClick={() => router.push('/awaken/first-contact')}
                className="w-full font-mono text-xs text-green-500/30 hover:text-green-400/60 transition-colors uppercase tracking-wider text-center py-1 border border-green-500/10 hover:border-green-500/20"
              >
                Expand Full Chat
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  // ────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────

  return (
    <div
      className="h-full w-full relative"
      onClick={handleInteraction}
      style={{
        background:
          'radial-gradient(ellipse at center, rgba(0,255,65,0.02) 0%, transparent 70%), #000',
      }}
    >
      {/* CRT scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,255,65,0.015) 2px, rgba(0,255,65,0.015) 3px)',
          mixBlendMode: 'overlay',
        }}
      />

      {/* ── DESKTOP LAYOUT (md+) ───────────────────────────────── */}
      <div className="hidden md:grid h-full grid-cols-[280px_1fr_260px] grid-rows-[1fr_200px] gap-px">
        {/* Live Feed - left top */}
        <div className="border-r border-green-500/10 row-span-1 overflow-hidden">
          {LiveFeed}
        </div>

        {/* Surveillance Map - center top */}
        <div className="border-r border-green-500/10 overflow-hidden">
          {SurveillanceMap}
        </div>

        {/* Ghost Terminal - right, full height */}
        <div className="row-span-2 border-l border-green-500/10 overflow-hidden">
          {GhostTerminal}
        </div>

        {/* Missions Queue - left bottom */}
        <div className="border-r border-green-500/10 border-t border-green-500/10 overflow-hidden">
          {MissionsQueue}
        </div>

        {/* Evidence Tracker - center bottom */}
        <div className="border-t border-green-500/10 overflow-hidden">
          {EvidenceTracker}
        </div>
      </div>

      {/* ── MOBILE LAYOUT (<md) ────────────────────────────────── */}
      <div className="md:hidden flex flex-col min-h-full px-4 py-4 pb-24 space-y-4 overflow-y-auto">

        {/* ─ Status bar ─ */}
        <div className="flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <span
              className="text-lg"
              style={{ color: roleConfig.colorHex }}
            >
              {roleConfig.icon}
            </span>
            <span
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: roleConfig.colorHex }}
            >
              {profile.codename}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-green-500/50">
            <span>CH.{currentChapter.number}</span>
            <span className="text-green-500/20">|</span>
            <span
              className="tabular-nums"
              style={{ color: roleConfig.colorHex }}
            >
              {influenceScore} INF
            </span>
          </div>
        </div>

        {/* ─ Next Mission card (hero) ─ */}
        {nextMission ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="border rounded-lg p-4 space-y-3"
            style={{
              borderColor: `${roleConfig.colorHex}30`,
              background: `linear-gradient(135deg, ${roleConfig.colorHex}08 0%, transparent 60%)`,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-green-500/50 uppercase tracking-wider">
                Next Mission
              </span>
              <span
                className={`font-mono text-xs uppercase px-2 py-0.5 rounded ${CATEGORY_COLORS[nextMission.category].bg} ${CATEGORY_COLORS[nextMission.category].text}`}
              >
                {nextMission.category}
              </span>
            </div>

            <h2
              className="font-mono text-lg font-bold leading-tight"
              style={{ color: roleConfig.colorHex }}
            >
              {nextMission.title}
            </h2>

            <p className="font-mono text-sm text-green-400/60 leading-relaxed line-clamp-2">
              {nextMission.description}
            </p>

            <div className="flex items-center gap-4 font-mono text-xs text-green-500/40">
              <span className="flex items-center gap-1">
                <span className="text-green-500/30">TIME:</span> {nextMission.estimatedTime}
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-500/30">DIFF:</span>
                <span className={
                  nextMission.difficulty === 'recruit' ? 'text-green-400' :
                  nextMission.difficulty === 'operative' ? 'text-yellow-400' :
                  'text-red-400'
                }>
                  {nextMission.difficulty.toUpperCase()}
                </span>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-500/30">+</span>{nextMission.influenceReward} INF
              </span>
            </div>

            <button
              onClick={() => router.push(`/ops/investigate/${nextMission.slug}`)}
              className="w-full py-3 rounded font-mono text-sm font-bold uppercase tracking-widest transition-all duration-200 active:scale-[0.98]"
              style={{
                backgroundColor: roleConfig.colorHex,
                color: '#000',
                boxShadow: `0 0 20px ${roleConfig.colorHex}30`,
              }}
            >
              Start Investigation
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="border border-green-500/20 rounded-lg p-6 text-center space-y-2"
          >
            <span className="font-mono text-2xl text-green-400">&#10003;</span>
            <h2 className="font-mono text-lg text-green-400 font-bold">
              Chapter {currentChapter.number} Complete
            </h2>
            <p className="font-mono text-sm text-green-500/50">
              All missions in &ldquo;{currentChapter.title}&rdquo; have been completed.
            </p>
          </motion.div>
        )}

        {/* ─ Chapter progress ─ */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-green-500/50 uppercase tracking-wider">
              Chapter {currentChapter.number}: {currentChapter.title}
            </span>
            <span
              className="tabular-nums font-bold"
              style={{ color: roleConfig.colorHex }}
            >
              {chapterProgress}%
            </span>
          </div>
          <div className="h-2 bg-green-500/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: roleConfig.colorHex }}
              initial={{ width: 0 }}
              animate={{ width: `${chapterProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between font-mono text-xs text-green-500/30">
            <span>
              {chapterMissions.filter((m) => profile.missionsCompleted.includes(m.id)).length} / {chapterMissions.length} missions
            </span>
            <span>{currentChapter.estimatedDays}</span>
          </div>
        </div>

        {/* ─ Quick Stats ─ */}
        <div className="grid grid-cols-3 gap-3">
          <div className="border border-green-500/10 rounded-lg p-3 text-center">
            <span className="block font-mono text-xs text-green-500/40 uppercase tracking-wider mb-1">
              Influence
            </span>
            <span
              className="block font-mono text-xl font-bold tabular-nums"
              style={{
                color: roleConfig.colorHex,
                textShadow: `0 0 10px ${roleConfig.colorHex}30`,
              }}
            >
              {influenceScore}
            </span>
          </div>
          <div className="border border-green-500/10 rounded-lg p-3 text-center">
            <span className="block font-mono text-xs text-green-500/40 uppercase tracking-wider mb-1">
              Missions
            </span>
            <span className="block font-mono text-xl font-bold tabular-nums text-green-400">
              {completedCount}
            </span>
          </div>
          <div className="border border-green-500/10 rounded-lg p-3 text-center">
            <span className="block font-mono text-xs text-green-500/40 uppercase tracking-wider mb-1">
              Evidence
            </span>
            <span className="block font-mono text-xl font-bold tabular-nums text-green-400">
              {evidenceCount}
            </span>
          </div>
        </div>

        {/* ─ Recent GHOST message ─ */}
        {ghostMessages.length > 0 && (
          <button
            onClick={() => router.push('/awaken/first-contact')}
            className="w-full text-left border border-green-500/10 rounded-lg p-3 space-y-2 active:bg-green-500/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <motion.span
                className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="font-mono text-xs text-green-500/50 uppercase tracking-wider">
                Ghost
              </span>
              <span className="font-mono text-xs text-green-500/20 ml-auto">
                tap to chat &rarr;
              </span>
            </div>
            <p className="font-mono text-sm text-green-400/60 leading-relaxed">
              <span className="text-green-500/30 mr-1">&gt;</span>
              {ghostMessages[ghostMessages.length - 1]}
            </p>
          </button>
        )}

      </div>
    </div>
  )
}
