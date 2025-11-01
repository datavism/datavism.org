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

  // Calculate recent challenges (last 7 days) safely
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const recentChallenges = progress.filter(p => {
    if (!p.completed || !p.created_at) return false
    const createdDate = new Date(p.created_at)
    return createdDate > oneWeekAgo
  }).length

  // Color mapping for Tailwind classes (must be static for compilation)
  const colorClasses = {
    yellow: {
      border: 'border-yellow-400',
      bg: 'bg-yellow-950/10',
      text: 'text-yellow-400'
    },
    green: {
      border: 'border-green-400',
      bg: 'bg-green-950/10',
      text: 'text-green-400'
    },
    cyan: {
      border: 'border-cyan-400',
      bg: 'bg-cyan-950/10',
      text: 'text-cyan-400'
    },
    purple: {
      border: 'border-purple-400',
      bg: 'bg-purple-950/10',
      text: 'text-purple-400'
    }
  } as const

  type ColorKey = keyof typeof colorClasses

  const stats = [
    {
      icon: Trophy,
      label: 'Completed Challenges',
      value: completedChallenges,
      color: 'yellow' as ColorKey,
      trend: `+${recentChallenges} this week`
    },
    {
      icon: Zap,
      label: 'Total XP Earned',
      value: totalXP,
      color: 'green' as ColorKey,
      trend: `Level ${profile?.level || 1}`
    },
    {
      icon: Target,
      label: 'Current Week',
      value: currentWeek,
      color: 'cyan' as ColorKey,
      trend: `${weekProgress}/5 challenges`
    },
    {
      icon: Clock,
      label: 'Active Days',
      value: new Set(progress.filter(p => p.created_at).map(p => {
        const date = new Date(p.created_at)
        return date.toISOString().split('T')[0]
      })).size,
      color: 'purple' as ColorKey,
      trend: 'streak building'
    }
  ]

  return (
    <div className="border border-green-400 p-6">
      <h2 className="text-2xl font-bold text-green-400 mb-6">MISSION STATUS</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const colors = colorClasses[stat.color]
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border ${colors.border} p-4 ${colors.bg}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={colors.text} size={24} />
                <h3 className={`font-bold ${colors.text}`}>{stat.label}</h3>
              </div>

              <div className={`text-3xl font-bold ${colors.text} mb-1`}>
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