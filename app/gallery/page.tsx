'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { impact, scan } from '@/lib/audio/procedural'

// ─── Category config (matches MissionBoard) ─────────────────────────
type ArtifactCategory = 'greenwashing' | 'surveillance' | 'pricing' | 'inequality' | 'manipulation'

const CATEGORY_CONFIG: Record<ArtifactCategory, { label: string; color: string; borderColor: string; bgColor: string }> = {
  greenwashing: { label: 'GREENWASHING', color: 'text-green-400', borderColor: 'border-green-500/40', bgColor: 'bg-green-500/10' },
  pricing: { label: 'PRICING', color: 'text-yellow-400', borderColor: 'border-yellow-500/40', bgColor: 'bg-yellow-500/10' },
  manipulation: { label: 'MANIPULATION', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
  surveillance: { label: 'SURVEILLANCE', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
  inequality: { label: 'INEQUALITY', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
}

const CATEGORY_FILTERS: { value: ArtifactCategory | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'ALL', color: 'text-green-400 border-green-400/30 hover:bg-green-400/10' },
  { value: 'greenwashing', label: 'GREENWASHING', color: 'text-green-400 border-green-500/30 hover:bg-green-500/10' },
  { value: 'pricing', label: 'PRICING', color: 'text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/10' },
  { value: 'manipulation', label: 'MANIPULATION', color: 'text-red-400 border-red-500/30 hover:bg-red-500/10' },
  { value: 'surveillance', label: 'SURVEILLANCE', color: 'text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10' },
  { value: 'inequality', label: 'INEQUALITY', color: 'text-purple-400 border-purple-500/30 hover:bg-purple-500/10' },
]

// ─── Placeholder Artifacts ───────────────────────────────────────────
interface Artifact {
  id: string
  title: string
  operative: string
  category: ArtifactCategory
  date: string
  influence: number
  summary: string
}

const ARTIFACTS: Artifact[] = [
  {
    id: 'art-001',
    title: 'Amazon Price Discrimination Report',
    operative: 'CIPHER-7',
    category: 'pricing',
    date: '2026-03-12',
    influence: 250,
    summary: 'Exposed device-based price variations across 47 product categories. Mac users shown prices 8-23% higher than Android equivalents.',
  },
  {
    id: 'art-002',
    title: 'Shell Greenwashing Analysis',
    operative: 'GHOST-4A2B',
    category: 'greenwashing',
    date: '2026-03-10',
    influence: 150,
    summary: 'Compared Shell\'s "carbon neutral by 2030" claims against actual Scope 3 emissions. Found 340% discrepancy between PR narrative and reported data.',
  },
  {
    id: 'art-003',
    title: 'TikTok Attention Manipulation Map',
    operative: 'WRAITH-X9',
    category: 'manipulation',
    date: '2026-03-08',
    influence: 200,
    summary: 'Mapped algorithmic engagement loops across 12,000 user sessions. Documented "dopamine cliff" patterns that keep users scrolling past natural stopping points.',
  },
  {
    id: 'art-004',
    title: 'Clearview AI Surveillance Network',
    operative: 'SPECTER-11',
    category: 'surveillance',
    date: '2026-03-05',
    influence: 300,
    summary: 'Mapped law enforcement contracts and facial recognition deployments across 14 US states. Identified unauthorized school zone surveillance in 3 districts.',
  },
  {
    id: 'art-005',
    title: 'Uber Surge Pricing: Neighborhood Inequality',
    operative: 'CIPHER-7',
    category: 'pricing',
    date: '2026-03-03',
    influence: 250,
    summary: 'Analyzed 8,000 ride quotes across NYC. Low-income ZIP codes experience surge pricing 2.7x more frequently than affluent areas for equivalent distances.',
  },
  {
    id: 'art-006',
    title: 'Meta Filter Bubble Depth Study',
    operative: 'ECHO-33',
    category: 'manipulation',
    date: '2026-02-28',
    influence: 150,
    summary: 'Created parallel accounts with different political leanings. Within 72 hours, content overlap dropped below 4%. Users see entirely different realities.',
  },
  {
    id: 'art-007',
    title: 'Healthcare Cost Inequality Dashboard',
    operative: 'PRISM-K7',
    category: 'inequality',
    date: '2026-02-25',
    influence: 200,
    summary: 'Visualized insulin pricing across 50 states vs. manufacturer costs. Average markup: 1,200%. Interactive map reveals geographic pricing deserts.',
  },
  {
    id: 'art-008',
    title: 'BP Carbon Offset Fraud Analysis',
    operative: 'GHOST-4A2B',
    category: 'greenwashing',
    date: '2026-02-20',
    influence: 150,
    summary: 'Traced carbon offset purchases to non-additional forestry projects. 67% of claimed offsets represent forests that were never under threat.',
  },
  {
    id: 'art-009',
    title: 'Ring Doorbell Police Sharing Network',
    operative: 'SPECTER-11',
    category: 'surveillance',
    date: '2026-02-15',
    influence: 250,
    summary: 'FOIA requests revealed 2,400+ police departments accessing Ring footage without warrants. Mapped the complete surveillance mesh across residential areas.',
  },
  {
    id: 'art-010',
    title: 'Dark Patterns in Subscription Cancellation',
    operative: 'WRAITH-X9',
    category: 'manipulation',
    date: '2026-02-10',
    influence: 150,
    summary: 'Documented 47 distinct dark patterns across 20 subscription services. Average cancellation flow: 7.3 screens. Sign-up flow: 2.1 screens.',
  },
]

// ─── Stats ───────────────────────────────────────────────────────────
const STATS = {
  investigations: 47,
  influence: 12450,
  operatives: 23,
}

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<ArtifactCategory | 'all'>('all')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try { impact() } catch {}
  }, [])

  const filteredArtifacts = activeFilter === 'all'
    ? ARTIFACTS
    : ARTIFACTS.filter(a => a.category === activeFilter)

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,65,0.008) 3px, rgba(0,255,65,0.008) 6px)',
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="px-6 py-10 md:py-14">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-green-400/20 text-[0.6rem] tracking-[0.5em] mb-3">
                // DECLASSIFIED — PUBLIC ACCESS GRANTED
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-green-400 tracking-wider relative inline-block">
                GALLERY OF IMPACT
                {/* Scanline sweep */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/5 to-transparent pointer-events-none"
                  initial={{ y: '-100%' }}
                  animate={{ y: '200%' }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: 'linear' }}
                />
              </h1>
              <div className="text-green-400/30 text-xs tracking-wider mt-2">
                Investigations completed by DATAVISM operatives.
              </div>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              className="mt-8 border border-green-500/10 bg-green-950/10 px-4 py-3 flex flex-wrap gap-x-8 gap-y-2 text-[0.6rem] tracking-[0.15em]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <span className="text-green-400/30">INVESTIGATIONS:</span>
                <span className="text-green-300 font-bold tabular-nums">{STATS.investigations}</span>
              </div>
              <div className="hidden sm:block text-green-500/20">|</div>
              <div className="flex items-center gap-2">
                <span className="text-green-400/30">INFLUENCE GENERATED:</span>
                <span className="text-green-300 font-bold tabular-nums">{STATS.influence.toLocaleString()}</span>
              </div>
              <div className="hidden sm:block text-green-500/20">|</div>
              <div className="flex items-center gap-2">
                <span className="text-green-400/30">OPERATIVES ACTIVE:</span>
                <span className="text-green-300 font-bold tabular-nums">{STATS.operatives}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="mb-2 flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              {CATEGORY_FILTERS.map(filter => {
                const isActive = activeFilter === filter.value
                return (
                  <button
                    key={filter.value}
                    onClick={() => {
                      setActiveFilter(filter.value)
                      try { scan() } catch {}
                    }}
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
                        ({ARTIFACTS.filter(a => a.category === filter.value).length})
                      </span>
                    )}
                  </button>
                )
              })}
            </motion.div>

            <div className="mb-6 text-green-400/15 text-[0.55rem] tracking-[0.2em]">
              {filteredArtifacts.length} ARTIFACT{filteredArtifacts.length !== 1 ? 'S' : ''} DISPLAYED
            </div>
          </div>
        </div>

        {/* Artifact Grid */}
        <div className="px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredArtifacts.map((artifact, index) => (
                  <ArtifactCard key={artifact.id} artifact={artifact} index={index} />
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredArtifacts.length === 0 && (
              <div className="text-center py-20">
                <div className="text-green-400/20 text-sm tracking-wider">
                  NO ARTIFACTS IN THIS CATEGORY
                </div>
                <div className="text-green-400/10 text-xs tracking-wider mt-2">
                  Operatives are still in the field
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Artifact Card ───────────────────────────────────────────────────
function ArtifactCard({ artifact, index }: { artifact: Artifact; index: number }) {
  const cat = CATEGORY_CONFIG[artifact.category]

  const formattedDate = new Date(artifact.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className={`
        group relative border ${cat.borderColor} bg-black
        hover:bg-green-950/10 transition-all duration-300 cursor-default
      `}
    >
      {/* Top accent line */}
      <div className={`h-px w-full ${cat.bgColor}`} />

      <div className="p-5">
        {/* Category badge + date */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`
              text-[0.55rem] tracking-[0.15em] px-2 py-0.5 border rounded-sm
              ${cat.color} ${cat.borderColor} ${cat.bgColor}
            `}
          >
            {cat.label}
          </span>
          <span className="text-green-400/20 text-[0.55rem] tracking-wider tabular-nums">
            {formattedDate}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-green-300 text-sm font-bold tracking-wider mb-2 leading-tight group-hover:text-green-200 transition-colors">
          {artifact.title}
        </h3>

        {/* Summary */}
        <p className="text-green-400/35 text-[0.65rem] leading-relaxed mb-4">
          {artifact.summary}
        </p>

        {/* Footer: operative + influence */}
        <div className="flex items-center justify-between pt-3 border-t border-green-500/8">
          <div className="flex items-center gap-2">
            <span className="text-green-400/25 text-[0.55rem]">BY:</span>
            <span className="text-green-400/60 text-[0.55rem] tracking-[0.1em] font-bold">
              {artifact.operative}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-green-400/25 text-[0.55rem]">+</span>
            <span className="text-green-300/70 text-[0.65rem] font-bold tabular-nums">
              {artifact.influence}
            </span>
            <span className="text-green-400/20 text-[0.5rem]">INF</span>
          </div>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 30px rgba(0, 255, 65, 0.03)`,
        }}
      />
    </motion.div>
  )
}
