'use client'

import { motion } from 'framer-motion'

interface Challenge {
  id: string
  title: string
  xp: number
  isBoss?: boolean
  isCheckpoint?: boolean
}

interface ProgressTrackerProps {
  challenges: Challenge[]
  currentChallenge: number
  completedChallenges: string[]
}

export function ProgressTracker({ challenges, currentChallenge, completedChallenges }: ProgressTrackerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="border border-green-400/30 p-4 mb-4 bg-black/50"
    >
      <h3 className="text-green-400 font-bold mb-3">MISSION PROGRESS</h3>
      
      <div className="space-y-2">
        {challenges.map((challenge, index) => {
          const isCompleted = completedChallenges.includes(challenge.id)
          const isCurrent = index === currentChallenge
          const isLocked = index > currentChallenge
          
          return (
            <div
              key={challenge.id}
              className={`flex items-center gap-3 p-2 rounded text-sm ${
                isCurrent 
                  ? 'bg-yellow-950/20 border border-yellow-400/30' 
                  : isCompleted 
                  ? 'bg-green-950/20'
                  : 'bg-gray-950/20'
              }`}
            >
              <div className={`text-lg ${
                isCompleted ? 'text-green-400' :
                isCurrent ? 'text-yellow-400' :
                isLocked ? 'text-gray-600' : 'text-cyan-400'
              }`}>
                {challenge.isBoss ? '⚔️' :
                 challenge.isCheckpoint ? '📍' :
                 isCompleted ? '✅' :
                 isCurrent ? '🎯' : '🔒'}
              </div>
              
              <div className="flex-1">
                <div className={`font-mono ${
                  isCurrent ? 'text-yellow-400' :
                  isCompleted ? 'text-green-400' :
                  'text-gray-400'
                }`}>
                  {challenge.title}
                </div>
              </div>
              
              <div className={`text-xs ${
                isCurrent ? 'text-yellow-400' :
                isCompleted ? 'text-green-400' :
                'text-gray-500'
              }`}>
                +{challenge.xp} XP
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-green-400/30">
        <div className="flex justify-between text-xs">
          <span className="text-green-400">Progress</span>
          <span className="text-yellow-400">
            {completedChallenges.length}/{challenges.length}
          </span>
        </div>
        
        <div className="w-full h-2 bg-black border border-green-400 mt-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedChallenges.length / challenges.length) * 100}%` }}
            className="h-full bg-green-400"
          />
        </div>
      </div>
    </motion.div>
  )
}