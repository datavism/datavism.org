'use client'

import { motion } from 'framer-motion'

interface AchievementGridProps {
  achievements: string[]
}

export function AchievementGrid({ achievements }: AchievementGridProps) {
  const allAchievements = [
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Complete your first challenge',
      icon: '👶',
      rarity: 'common'
    },
    {
      id: 'code-warrior',
      name: 'Code Warrior',
      description: 'Write your first Python code',
      icon: '⚔️',
      rarity: 'common'
    },
    {
      id: 'data-liberator',
      name: 'Data Liberator',
      description: 'Load your first dataset',
      icon: '🔓',
      rarity: 'common'
    },
    {
      id: 'pattern-hunter',
      name: 'Pattern Hunter',
      description: 'Discover data patterns',
      icon: '🔍',
      rarity: 'uncommon'
    },
    {
      id: 'excel-slayer',
      name: 'Excel Slayer',
      description: 'Defeat the Excel Overlord',
      icon: '⚡',
      rarity: 'rare'
    },
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: 'Complete an entire week',
      icon: '🏆',
      rarity: 'uncommon'
    },
    {
      id: 'speed-demon',
      name: 'Speed Demon',
      description: 'Complete 5 challenges in one day',
      icon: '💨',
      rarity: 'rare'
    },
    {
      id: 'mentor',
      name: 'Mentor',
      description: 'Help another operative',
      icon: '🎓',
      rarity: 'epic'
    },
    {
      id: 'investigator',
      name: 'Investigator',
      description: 'Complete your first investigation',
      icon: '🕵️',
      rarity: 'epic'
    },
    {
      id: 'revolutionary',
      name: 'Revolutionary',
      description: 'Graduate from the academy',
      icon: '🔴',
      rarity: 'legendary'
    }
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'green'
      case 'uncommon': return 'cyan'
      case 'rare': return 'purple'
      case 'epic': return 'yellow'
      case 'legendary': return 'red'
      default: return 'gray'
    }
  }

  const isUnlocked = (achievementId: string) => {
    return achievements.includes(achievementId)
  }

  return (
    <div className="border border-green-400 p-6">
      <h2 className="text-2xl font-bold text-green-400 mb-6">ACHIEVEMENTS</h2>
      
      <div className="grid grid-cols-3 gap-3">
        {allAchievements.map((achievement, index) => {
          const unlocked = isUnlocked(achievement.id)
          const color = getRarityColor(achievement.rarity)
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`aspect-square border-2 p-3 text-center cursor-pointer group relative ${
                unlocked
                  ? `border-${color}-400 bg-${color}-950/20`
                  : 'border-gray-600 bg-gray-950/10'
              }`}
              title={achievement.description}
            >
              <div className={`text-2xl mb-2 ${unlocked ? '' : 'grayscale opacity-50'}`}>
                {achievement.icon}
              </div>
              
              <div className={`text-xs font-bold leading-tight ${
                unlocked ? `text-${color}-400` : 'text-gray-600'
              }`}>
                {achievement.name}
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-black border border-green-400 p-2 text-xs whitespace-nowrap">
                  <div className={`font-bold text-${color}-400 mb-1`}>
                    {achievement.name}
                  </div>
                  <div className="text-green-300">
                    {achievement.description}
                  </div>
                  <div className={`text-${color}-400 text-xs mt-1 capitalize`}>
                    {achievement.rarity}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-sm text-green-300">
          {achievements.length} / {allAchievements.length} unlocked
        </div>
        <div className="w-full h-2 bg-black border border-green-400/30 mt-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(achievements.length / allAchievements.length) * 100}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-green-400"
          />
        </div>
      </div>
    </div>
  )
}