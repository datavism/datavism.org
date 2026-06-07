'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface AutopilotButtonProps {
  onClick: () => void
  disabled?: boolean
}

export function AutopilotButton({ onClick, disabled = false }: AutopilotButtonProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        relative flex items-center gap-2 px-3 py-1.5 rounded-sm
        text-[0.6rem] tracking-[0.12em] uppercase font-bold font-mono
        border transition-all duration-300 overflow-hidden
        ${disabled
          ? 'text-green-400/20 border-green-500/10 cursor-not-allowed'
          : 'text-green-400 border-green-500/30 hover:border-green-400/60 hover:bg-green-500/10 hover:shadow-[0_0_16px_rgba(0,255,65,0.15)]'
        }
      `}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      {/* Radar sweep icon */}
      <div className="relative w-4 h-4 flex-shrink-0">
        {/* Outer ring */}
        <div className={`
          absolute inset-0 rounded-full border
          ${disabled ? 'border-green-500/15' : 'border-green-500/40'}
        `} />
        {/* Inner ring */}
        <div className={`
          absolute inset-[3px] rounded-full border
          ${disabled ? 'border-green-500/10' : 'border-green-500/25'}
        `} />
        {/* Center dot */}
        <div className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-1 h-1 rounded-full
          ${disabled ? 'bg-green-500/15' : 'bg-green-400'}
        `} />
        {/* Sweep line — animated */}
        {!disabled && (
          <motion.div
            className="absolute top-1/2 left-1/2 w-[7px] h-[1px] bg-green-400/70 origin-left"
            animate={{ rotate: 360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </div>

      <span>GHOST AUTOPILOT</span>

      {/* Hover glow effect */}
      {hovered && !disabled && (
        <motion.div
          className="absolute inset-0 bg-green-500/5 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      {/* Tooltip */}
      {hovered && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5
            bg-black border border-green-500/30 text-green-400/70 text-[0.5rem]
            tracking-wider whitespace-nowrap z-50 pointer-events-none"
        >
          Run autonomous investigation
        </motion.div>
      )}
    </motion.button>
  )
}
