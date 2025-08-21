'use client'

import { motion } from 'framer-motion'
import { Calendar, Code, Trophy, Zap } from 'lucide-react'
import type { Database } from '@/types/database'

type Progress = Database['public']['Tables']['progress']['Row']

interface RecentActivityProps {
  recentProgress: Progress[]
}

export function RecentActivity({ recentProgress }: RecentActivityProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActivityIcon = (challengeId: string) => {
    if (challengeId.includes('boss')) return Trophy
    if (challengeId.includes('code')) return Code
    return Zap
  }

  const getActivityColor = (challengeId: string) => {
    if (challengeId.includes('boss')) return 'red'
    if (challengeId.includes('pattern')) return 'cyan'
    if (challengeId.includes('data')) return 'purple'
    return 'green'
  }

  if (recentProgress.length === 0) {
    return (
      <div className="border border-green-400 p-6">
        <h2 className="text-2xl font-bold text-green-400 mb-6">RECENT ACTIVITY</h2>
        <div className="text-center text-green-300 py-8">
          <Calendar size={48} className="mx-auto mb-4 text-green-400/50" />
          <p>No recent activity</p>
          <p className="text-sm">Start your first challenge to see activity here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-green-400 p-6">
      <h2 className="text-2xl font-bold text-green-400 mb-6">RECENT ACTIVITY</h2>
      
      <div className="space-y-4">
        {recentProgress.map((activity, index) => {
          const Icon = getActivityIcon(activity.challenge_id)
          const color = getActivityColor(activity.challenge_id)
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 border border-green-400/30 bg-black/50"
            >
              <div className={`w-10 h-10 border border-${color}-400 bg-${color}-950/20 flex items-center justify-center`}>
                <Icon className={`text-${color}-400`} size={20} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-green-400">
                    Week {activity.week_id} - {activity.challenge_id.replace('week' + activity.week_id + '-', '').replace('-', ' ').toUpperCase()}
                  </h3>
                  <span className="text-xs text-green-300">
                    {formatDate(activity.created_at)}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 mt-1">
                  <span className={`text-sm text-${color}-400`}>
                    {activity.completed ? '✓ Completed' : '○ In Progress'}
                  </span>
                  {activity.xp_earned > 0 && (
                    <span className="text-sm text-yellow-400">
                      +{activity.xp_earned} XP
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}