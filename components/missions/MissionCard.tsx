'use client'

import { motion } from 'framer-motion'
import { scan } from '@/lib/audio/procedural'
import type { Mission } from '@/lib/data/missions'

interface MissionCardProps {
  mission: Mission
  isCompleted: boolean
  onClick: () => void
}

const CATEGORY_COLORS: Record<Mission['category'], { border: string; bg: string; text: string; glow: string }> = {
  greenwashing: {
    border: 'border-green-500/30',
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    glow: 'shadow-green-500/20',
  },
  pricing: {
    border: 'border-yellow-500/30',
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    glow: 'shadow-yellow-500/20',
  },
  manipulation: {
    border: 'border-red-500/30',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    glow: 'shadow-red-500/20',
  },
  surveillance: {
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    glow: 'shadow-cyan-500/20',
  },
  inequality: {
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/20',
  },
}

const DIFFICULTY_CONFIG: Record<Mission['difficulty'], { dots: string; color: string; label: string }> = {
  recruit: { dots: '\u25CF', color: 'text-green-400', label: 'RECRUIT' },
  operative: { dots: '\u25CF\u25CF', color: 'text-yellow-400', label: 'OPERATIVE' },
  elite: { dots: '\u25CF\u25CF\u25CF', color: 'text-red-400', label: 'ELITE' },
}

export function MissionCard({ mission, isCompleted, onClick }: MissionCardProps) {
  const categoryStyle = CATEGORY_COLORS[mission.category]
  const difficultyConfig = DIFFICULTY_CONFIG[mission.difficulty]

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => scan()}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative w-full text-left p-5 font-mono
        border ${categoryStyle.border} bg-black/80
        rounded-sm transition-shadow duration-300
        hover:shadow-lg hover:${categoryStyle.glow}
        hover:border-opacity-60
        group cursor-pointer
        ${isCompleted ? 'opacity-60' : ''}
      `}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.03) 2px, rgba(0,255,65,0.03) 4px)',
        }}
      />

      {/* Completed overlay */}
      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-green-400 text-4xl opacity-40">&#10003;</div>
        </div>
      )}

      {/* Top row: category badge + difficulty */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[0.65rem] tracking-[0.15em] px-2 py-0.5 rounded-sm uppercase font-bold ${categoryStyle.bg} ${categoryStyle.text}`}>
          {mission.category}
        </span>
        <span className={`text-[0.65rem] ${difficultyConfig.color} flex items-center gap-1.5`}>
          <span className="tracking-wider">{difficultyConfig.dots}</span>
          <span className="tracking-[0.1em] opacity-70">{difficultyConfig.label}</span>
        </span>
      </div>

      {/* Title */}
      <h3 className="text-green-300 text-sm font-bold tracking-wider mb-2 group-hover:text-green-200 transition-colors">
        {mission.title}
      </h3>

      {/* Description */}
      <p className="text-green-400/40 text-[0.7rem] leading-relaxed mb-4 line-clamp-2">
        {mission.description}
      </p>

      {/* Bottom row: time + reward */}
      <div className="flex items-center justify-between border-t border-green-500/10 pt-3">
        <span className="text-green-400/30 text-[0.65rem] tracking-wider flex items-center gap-1.5">
          <span className="opacity-60">&#9201;</span>
          {mission.estimatedTime}
        </span>
        <span className="text-green-300 text-[0.65rem] font-bold tracking-wider">
          +{mission.influenceReward} INFLUENCE
        </span>
      </div>

      {/* Hover glow border effect */}
      <motion.div
        className={`absolute inset-0 rounded-sm border ${categoryStyle.border} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        style={{ boxShadow: `inset 0 0 20px rgba(0,255,65,0.05)` }}
      />
    </motion.button>
  )
}
