'use client'

import { motion } from 'framer-motion'
import { Users, Trophy, Target, TrendingUp } from 'lucide-react'

interface TrustBadge {
  icon: React.ComponentType<{ className?: string }>
  value: string
  label: string
  color: string
}

const badges: TrustBadge[] = [
  {
    icon: Users,
    value: '5,000+',
    label: 'Resistance Members',
    color: 'text-cyan-400'
  },
  {
    icon: Trophy,
    value: '80%',
    label: 'Completion Rate',
    color: 'text-yellow-400'
  },
  {
    icon: Target,
    value: '10',
    label: 'Algorithms Changed',
    color: 'text-green-400'
  },
  {
    icon: TrendingUp,
    value: 'Free',
    label: 'To Start',
    color: 'text-magenta-400'
  }
]

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {badges.map((badge, index) => (
        <motion.div
          key={badge.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative"
        >
          {/* Background glow */}
          <div className={`absolute inset-0 bg-gradient-to-br from-${badge.color.split('-')[1]}-500/20 to-transparent rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />

          {/* Badge content */}
          <div className="relative px-6 py-4 border-2 border-gray-700 group-hover:border-gray-500 rounded-lg bg-black/50 backdrop-blur-sm transition-all">
            <div className="flex flex-col items-center text-center gap-2">
              <badge.icon className={`w-6 h-6 ${badge.color}`} />
              <div className={`text-2xl md:text-3xl font-bold ${badge.color} font-mono`}>
                {badge.value}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                {badge.label}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
