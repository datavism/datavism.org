'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { impact, whoosh, scan } from '@/lib/audio/procedural'
import { MOTIVATION_CONFIG, type UserMotivation } from '@/lib/store/useDatavist'

interface DriveSelectionProps {
  onSelect: (motivation: UserMotivation) => void
}

const MOTIVATION_COLORS: Record<UserMotivation, {
  border: string
  text: string
  bg: string
  glow: string
  hoverBg: string
}> = {
  truth: {
    border: 'border-cyan-400',
    text: 'text-cyan-400',
    bg: 'bg-cyan-400',
    glow: 'shadow-cyan-400/40',
    hoverBg: 'hover:bg-cyan-950/30',
  },
  justice: {
    border: 'border-yellow-400',
    text: 'text-yellow-400',
    bg: 'bg-yellow-400',
    glow: 'shadow-yellow-400/40',
    hoverBg: 'hover:bg-yellow-950/30',
  },
  freedom: {
    border: 'border-green-400',
    text: 'text-green-400',
    bg: 'bg-green-400',
    glow: 'shadow-green-400/40',
    hoverBg: 'hover:bg-green-950/30',
  },
  impact: {
    border: 'border-purple-400',
    text: 'text-purple-400',
    bg: 'bg-purple-400',
    glow: 'shadow-purple-400/40',
    hoverBg: 'hover:bg-purple-950/30',
  },
}

const motivationKeys: UserMotivation[] = ['truth', 'justice', 'freedom', 'impact']

export function DriveSelection({ onSelect }: DriveSelectionProps) {
  const [selected, setSelected] = useState<UserMotivation | null>(null)

  const handleSelect = (key: UserMotivation) => {
    if (selected) return // Prevent double-click
    setSelected(key)
    impact()
    setTimeout(() => {
      whoosh()
      onSelect(key)
    }, 1000)
  }

  const handleHover = () => {
    scan()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-16"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-green-400 mb-3">
          What drives you?
        </h1>
        <p className="text-green-400/60 text-sm md:text-base">
          This defines your mission priority. Choose carefully.
        </p>
      </motion.div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-2xl w-full">
        {motivationKeys.map((key, i) => {
          const config = MOTIVATION_CONFIG[key]
          const colors = MOTIVATION_COLORS[key]
          const isSelected = selected === key
          const isOther = selected !== null && selected !== key

          return (
            <motion.button
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isOther ? 0.15 : 1,
                y: 0,
                scale: isSelected ? 1.05 : 1,
              }}
              transition={{
                delay: isOther ? 0 : 0.3 + i * 0.1,
                duration: isOther ? 0.4 : 0.5,
              }}
              whileHover={!selected ? { scale: 1.03 } : undefined}
              whileTap={!selected ? { scale: 0.97 } : undefined}
              onHoverStart={!selected ? handleHover : undefined}
              onClick={() => handleSelect(key)}
              disabled={!!selected}
              className={`
                relative border-2 ${colors.border} p-4 sm:p-6 md:p-8 text-left
                transition-all duration-300 cursor-pointer min-h-[44px]
                ${!selected ? colors.hoverBg : ''}
                ${isSelected ? `shadow-lg ${colors.glow}` : ''}
                ${selected ? 'cursor-default' : ''}
                bg-black/60
              `}
            >
              {/* Icon */}
              <div className={`text-4xl md:text-5xl lg:text-6xl mb-4 ${colors.text}`}>
                {config.icon}
              </div>

              {/* Title */}
              <h3 className={`text-xl md:text-2xl font-bold ${colors.text} mb-2`}>
                {config.title}
              </h3>

              {/* Description */}
              <p className="text-green-300/70 text-sm md:text-base">
                {config.description}
              </p>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`absolute top-3 right-3 w-3 h-3 rounded-full ${colors.bg} animate-pulse`}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
