'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { impact, whoosh, scan } from '@/lib/audio/procedural'
import {
  ROLE_CONFIG,
  type UserRole,
  type UserMotivation,
} from '@/lib/store/useDatavist'

interface RoleSelectionProps {
  motivation: UserMotivation
  onSelect: (role: UserRole) => void
}

const ROLE_COLORS: Record<UserRole, {
  border: string
  text: string
  textSecondary: string
  bg: string
  glow: string
  hoverBg: string
  accentBorder: string
}> = {
  warrior: {
    border: 'border-cyan-400',
    text: 'text-cyan-400',
    textSecondary: 'text-cyan-300',
    bg: 'bg-cyan-400',
    glow: 'shadow-cyan-400/40',
    hoverBg: 'hover:bg-cyan-950/20',
    accentBorder: 'border-l-cyan-400',
  },
  rebel: {
    border: 'border-green-400',
    text: 'text-green-400',
    textSecondary: 'text-green-300',
    bg: 'bg-green-400',
    glow: 'shadow-green-400/40',
    hoverBg: 'hover:bg-green-950/20',
    accentBorder: 'border-l-green-400',
  },
  artist: {
    border: 'border-purple-400',
    text: 'text-purple-400',
    textSecondary: 'text-purple-300',
    bg: 'bg-purple-400',
    glow: 'shadow-purple-400/40',
    hoverBg: 'hover:bg-purple-950/20',
    accentBorder: 'border-l-purple-400',
  },
  explorer: {
    border: 'border-yellow-400',
    text: 'text-yellow-400',
    textSecondary: 'text-yellow-300',
    bg: 'bg-yellow-400',
    glow: 'shadow-yellow-400/40',
    hoverBg: 'hover:bg-yellow-950/20',
    accentBorder: 'border-l-yellow-400',
  },
}

const roleKeys: UserRole[] = ['warrior', 'rebel', 'artist', 'explorer']

export function RoleSelection({ onSelect }: RoleSelectionProps) {
  const [selected, setSelected] = useState<UserRole | null>(null)

  const handleSelect = (key: UserRole) => {
    if (selected) return
    setSelected(key)
    impact()
    setTimeout(() => {
      whoosh()
      onSelect(key)
    }, 1200)
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
          Choose your weapon.
        </h1>
        <p className="text-green-400/60 text-sm md:text-base">
          Your role determines how your AI agent thinks.
        </p>
      </motion.div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl w-full">
        {roleKeys.map((key, i) => {
          const config = ROLE_CONFIG[key]
          const colors = ROLE_COLORS[key]
          const isSelected = selected === key
          const isOther = selected !== null && selected !== key

          return (
            <motion.button
              key={key}
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: isOther ? 0.1 : 1,
                y: 0,
                scale: isSelected ? 1.05 : 1,
              }}
              transition={{
                delay: isOther ? 0 : 0.3 + i * 0.12,
                duration: isOther ? 0.5 : 0.5,
              }}
              whileHover={!selected ? { scale: 1.03, y: -2 } : undefined}
              whileTap={!selected ? { scale: 0.97 } : undefined}
              onHoverStart={!selected ? handleHover : undefined}
              onClick={() => handleSelect(key)}
              disabled={!!selected}
              className={`
                relative border-2 ${colors.border} p-4 sm:p-6 md:p-8 text-left
                transition-all duration-300 cursor-pointer min-h-[44px]
                ${!selected ? colors.hoverBg : ''}
                ${isSelected ? `shadow-xl ${colors.glow}` : ''}
                ${selected ? 'cursor-default' : ''}
                bg-black/60
              `}
            >
              {/* Icon — large */}
              <div className={`text-4xl md:text-5xl lg:text-6xl mb-4 ${colors.text}`}>
                {config.icon}
              </div>

              {/* Title */}
              <h3 className={`text-xl md:text-2xl font-bold ${colors.text} mb-2`}>
                {config.title}
              </h3>

              {/* Description */}
              <p className="text-green-300/70 text-sm md:text-base mb-4">
                {config.description}
              </p>

              {/* Agent voice quote */}
              <div className={`border-l-2 ${colors.accentBorder} pl-3 mt-3`}>
                <p className={`${colors.textSecondary} text-xs md:text-sm italic opacity-80`}>
                  &ldquo;{config.agentVoice}&rdquo;
                </p>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`absolute top-3 right-3 px-2 py-1 text-xs font-bold ${colors.bg} text-black`}
                >
                  SELECTED
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="text-green-400/40 text-xs mt-8 text-center"
      >
        This shapes your agent&apos;s personality and mission approach.
      </motion.p>
    </motion.div>
  )
}
