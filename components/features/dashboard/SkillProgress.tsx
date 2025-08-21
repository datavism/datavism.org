'use client'

import { motion } from 'framer-motion'
import type { Database } from '@/types/database'

type Progress = Database['public']['Tables']['progress']['Row']

interface SkillProgressProps {
  progress: Progress[]
}

export function SkillProgress({ progress }: SkillProgressProps) {
  const skills = [
    {
      name: 'Python Basics',
      color: 'green',
      challenges: ['first-contact', 'weapon-selection'],
      icon: '🐍'
    },
    {
      name: 'Data Analysis',
      color: 'cyan',
      challenges: ['data-extraction', 'pattern-analysis'],
      icon: '📊'
    },
    {
      name: 'Pandas Mastery',
      color: 'yellow',
      challenges: ['boss-battle'],
      icon: '🐼'
    },
    {
      name: 'SQL Queries',
      color: 'purple',
      challenges: [], // Week 2+
      icon: '🗃️'
    },
    {
      name: 'Data Visualization',
      color: 'red',
      challenges: [], // Week 3+
      icon: '📈'
    }
  ]

  const getSkillProgress = (skill: any) => {
    const completedChallenges = skill.challenges.filter((challengeId: string) =>
      progress.some(p => p.challenge_id === challengeId && p.completed)
    ).length
    
    const totalChallenges = skill.challenges.length || 1
    return (completedChallenges / totalChallenges) * 100
  }

  return (
    <div className="border border-green-400 p-6">
      <h2 className="text-2xl font-bold text-green-400 mb-6">SKILL TREE</h2>
      
      <div className="space-y-4">
        {skills.map((skill, index) => {
          const progressPercent = getSkillProgress(skill)
          const isUnlocked = index === 0 || skills[index - 1].challenges.length === 0 || getSkillProgress(skills[index - 1]) > 0
          
          return (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 border ${
                isUnlocked 
                  ? `border-${skill.color}-400 bg-${skill.color}-950/10` 
                  : 'border-gray-600 bg-gray-950/10'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{skill.icon}</span>
                <div className="flex-1">
                  <h3 className={`font-bold ${
                    isUnlocked ? `text-${skill.color}-400` : 'text-gray-600'
                  }`}>
                    {skill.name}
                  </h3>
                  <div className="text-sm text-green-300">
                    {isUnlocked ? `${Math.round(progressPercent)}% Complete` : '🔒 Locked'}
                  </div>
                </div>
              </div>
              
              {isUnlocked && (
                <div className="w-full h-2 bg-black border border-green-400/30">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                    className={`h-full bg-${skill.color}-400`}
                  />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
      
      <div className="mt-6 text-center text-sm text-green-300">
        Complete challenges to unlock new skills
      </div>
    </div>
  )
}