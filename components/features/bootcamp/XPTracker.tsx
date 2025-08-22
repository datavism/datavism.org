'use client'

import { motion } from 'framer-motion'
import { Trophy, Star, Target } from 'lucide-react'
import { useAcademyStore } from '@/lib/store/academy.store'

export function XPTracker() {
  const { userProgress } = useAcademyStore()
  
  const currentLevel = Math.floor(userProgress.xp / 1000) + 1
  const xpInCurrentLevel = userProgress.xp % 1000
  const xpToNextLevel = 1000 - xpInCurrentLevel
  
  const getRank = (xp: number) => {
    if (xp >= 10000) return { name: 'Revolutionary', color: 'text-red-400', icon: '🔥' }
    if (xp >= 5000) return { name: 'Data Activist', color: 'text-yellow-400', icon: '⚡' }
    if (xp >= 2000) return { name: 'Algorithm Breaker', color: 'text-cyan-400', icon: '🛡️' }
    if (xp >= 500) return { name: 'Pattern Detective', color: 'text-green-400', icon: '🔍' }
    return { name: 'Digital Awakening', color: 'text-purple-400', icon: '👁️' }
  }
  
  const currentRank = getRank(userProgress.xp)
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="border border-yellow-400/30 p-4 mb-4 bg-yellow-950/10"
    >
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="text-yellow-400" size={24} />
        <h3 className="text-yellow-400 font-bold">DATA ACTIVIST STATUS</h3>
      </div>
      
      <div className="space-y-4">
        {/* Current Rank */}
        <div className="text-center">
          <div className="text-3xl mb-2">{currentRank.icon}</div>
          <div className={`font-bold ${currentRank.color}`}>
            {currentRank.name}
          </div>
          <div className="text-yellow-400 text-sm">
            Level {currentLevel}
          </div>
        </div>
        
        {/* XP Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-yellow-400">XP Progress</span>
            <span className="text-green-400">{userProgress.xp} XP</span>
          </div>
          
          <div className="w-full h-3 bg-black border border-yellow-400">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(xpInCurrentLevel / 1000) * 100}%` }}
              className="h-full bg-gradient-to-r from-yellow-400 to-green-400"
            />
          </div>
          
          <div className="text-xs text-yellow-400/60 mt-1 text-center">
            {xpToNextLevel} XP to Level {currentLevel + 1}
          </div>
        </div>
        
        {/* Recent Achievements */}
        <div className="border-t border-yellow-400/30 pt-3">
          <div className="text-yellow-400 font-bold text-sm mb-2">🏆 ACHIEVEMENTS</div>
          <div className="space-y-1 text-xs">
            {userProgress.completedChallenges.length > 0 && (
              <div className="flex items-center gap-2 text-green-400">
                <Star size={12} />
                <span>First Challenge Complete</span>
              </div>
            )}
            {userProgress.xp >= 100 && (
              <div className="flex items-center gap-2 text-cyan-400">
                <Target size={12} />
                <span>XP Hunter</span>
              </div>
            )}
            {userProgress.completedChallenges.length >= 5 && (
              <div className="flex items-center gap-2 text-yellow-400">
                <Trophy size={12} />
                <span>Mission Veteran</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Next Milestone */}
        <div className="text-center text-xs text-yellow-400/60">
          Next: {currentLevel === 1 ? 'Algorithm Breaker (2000 XP)' : 
                 currentLevel === 2 ? 'Data Activist (5000 XP)' :
                 'Revolutionary (10000 XP)'}
        </div>
      </div>
    </motion.div>
  )
}