'use client'

import { motion } from 'framer-motion'
import { Target, Trophy, Zap, Clock } from 'lucide-react'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type Progress = Database['public']['Tables']['progress']['Row']

interface DashboardStatsProps {
  profile: Profile | null
  progress: Progress[]
}

export function DashboardStats({ profile, progress }: DashboardStatsProps) {
  const completedChallenges = progress.filter(p => p.completed).length
  const totalXP = progress.reduce((sum, p) => sum + (p.xp_earned || 0), 0)
  const currentWeek = Math.floor(completedChallenges / 5) + 1
  const weekProgress = completedChallenges % 5

  const stats = [
    {
      icon: Trophy,
      label: 'Completed Challenges',
      value: completedChallenges,
      color: 'yellow',
      trend: `+${progress.filter(p => p.completed && new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} this week`
    },
    {
      icon: Zap,
      label: 'Total XP Earned',
      value: totalXP,
      color: 'green',
      trend: `Level ${profile?.level || 1}`
    },
    {
      icon: Target,
      label: 'Current Week',
      value: currentWeek,
      color: 'cyan',
      trend: `${weekProgress}/5 challenges`
    },
    {
      icon: Clock,
      label: 'Active Days',
      value: new Set(progress.map(p => p.created_at.split('T')[0])).size,
      color: 'purple',
      trend: 'streak building'
    }
  ]

  return (
    <div className="border border-green-400 p-6">
      <h2 className="text-2xl font-bold text-green-400 mb-6">MISSION STATUS</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border border-${stat.color}-400 p-4 bg-${stat.color}-950/10`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`text-${stat.color}-400`} size={24} />
                <h3 className={`font-bold text-${stat.color}-400`}>{stat.label}</h3>
              </div>
              
              <div className={`text-3xl font-bold text-${stat.color}-400 mb-1`}>
                {stat.value}
              </div>
              
              <div className="text-sm text-green-300">
                {stat.trend}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}