'use client'

import { motion } from 'framer-motion'

/**
 * Loading state indicator for GHOST AI agent.
 * Shows an animated "analyzing" state with a scanning line effect.
 */
export function AgentThinking() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3 px-4 py-3"
    >
      {/* GHOST label */}
      <span
        className="font-mono text-xs font-bold tracking-widest shrink-0 mt-0.5"
        style={{
          color: '#00ff41',
          textShadow: '0 0 5px rgba(0,255,0,0.5)',
        }}
      >
        GHOST
      </span>

      {/* Thinking container */}
      <div className="relative font-mono text-sm overflow-hidden">
        {/* Animated text */}
        <motion.span
          className="text-green-400/80"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          analyzing
        </motion.span>

        {/* Animated dots */}
        <span className="inline-flex ml-0.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="text-green-400/80"
              animate={{ opacity: [0, 1, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
            >
              .
            </motion.span>
          ))}
        </span>

        {/* Scanning line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, #00ff41 50%, transparent 100%)',
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </motion.div>
  )
}
