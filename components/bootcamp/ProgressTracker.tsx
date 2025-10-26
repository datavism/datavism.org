'use client'

import { motion } from 'framer-motion'
import { Check, Lock } from 'lucide-react'

interface ProgressTrackerProps {
  currentChallenge: number
  totalChallenges: number
  completedChallenges: string[]
  challengeTitles: string[]
}

export function ProgressTracker({
  currentChallenge,
  totalChallenges,
  completedChallenges,
  challengeTitles
}: ProgressTrackerProps) {
  const progress = ((completedChallenges.length) / totalChallenges) * 100

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm font-mono text-green-400">
            {completedChallenges.length}/{totalChallenges} completed
          </span>
        </div>

        <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-cyan-400"
          />

          {/* Glow effect */}
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 left-0 h-full bg-green-400/30 blur-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Challenge list */}
      <div className="space-y-2">
        {challengeTitles.map((title, index) => {
          const isCompleted = index < completedChallenges.length
          const isCurrent = index === currentChallenge
          const isLocked = index > currentChallenge

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                flex items-center gap-3 p-2 rounded transition-all
                ${isCurrent ? 'bg-green-950/30 border border-green-500/30' : ''}
                ${isCompleted ? 'opacity-60' : ''}
                ${isLocked ? 'opacity-30' : ''}
              `}
            >
              {/* Status icon */}
              <div className={`
                flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
                ${isCompleted ? 'bg-green-500 border-green-500' : ''}
                ${isCurrent ? 'border-green-400 animate-pulse' : ''}
                ${isLocked ? 'border-gray-700' : ''}
                ${!isCompleted && !isCurrent && !isLocked ? 'border-gray-600' : ''}
              `}>
                {isCompleted ? (
                  <Check className="w-4 h-4 text-black" />
                ) : isLocked ? (
                  <Lock className="w-3 h-3 text-gray-700" />
                ) : (
                  <span className="text-xs font-bold text-gray-500">{index + 1}</span>
                )}
              </div>

              {/* Title */}
              <span className={`
                text-sm
                ${isCurrent ? 'text-green-400 font-semibold' : ''}
                ${isCompleted ? 'text-gray-500 line-through' : ''}
                ${isLocked ? 'text-gray-700' : ''}
                ${!isCompleted && !isCurrent && !isLocked ? 'text-gray-400' : ''}
              `}>
                {title}
              </span>

              {/* Current indicator */}
              {isCurrent && (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="ml-auto text-xs text-green-400 uppercase tracking-wide"
                >
                  Active
                </motion.span>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Completion percentage */}
      <div className="mt-6 text-center">
        <div className="text-3xl font-bold text-green-400 font-mono mb-1">
          {Math.round(progress)}%
        </div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">
          Liberation Progress
        </div>
      </div>
    </div>
  )
}
