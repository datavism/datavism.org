'use client'

import { motion } from 'framer-motion'
import { Activity, User, Trophy, Users, Code, Zap } from 'lucide-react'

export function LiveFeed() {
  // Mock live feed data - in production this would come from real-time updates
  const feedItems = [
    {
      id: 1,
      type: 'challenge_completed',
      user: 'DataRebel42',
      action: 'completed',
      target: 'Week 1: Excel Overlord Boss Battle',
      xp: 300,
      timestamp: '2 minutes ago',
      icon: Trophy,
      color: 'red'
    },
    {
      id: 2,
      type: 'squad_joined',
      user: 'CyberSleuth',
      action: 'joined squad',
      target: 'Tax Haven Hunters',
      timestamp: '5 minutes ago',
      icon: Users,
      color: 'purple'
    },
    {
      id: 3,
      type: 'level_up',
      user: 'PatternSeeker',
      action: 'reached',
      target: 'Level 5 - Data Analyst',
      timestamp: '12 minutes ago',
      icon: Zap,
      color: 'yellow'
    },
    {
      id: 4,
      type: 'investigation_started',
      user: 'WhistleBlower',
      action: 'started investigation',
      target: 'Corporate Tax Evasion Analysis',
      timestamp: '18 minutes ago',
      icon: User,
      color: 'cyan'
    },
    {
      id: 5,
      type: 'code_shared',
      user: 'AlgoNinja',
      action: 'shared code for',
      target: 'Pandas Data Cleaning Tutorial',
      timestamp: '25 minutes ago',
      icon: Code,
      color: 'green'
    },
    {
      id: 6,
      type: 'achievement_unlocked',
      user: 'DataDigger',
      action: 'unlocked achievement',
      target: 'First Investigation Complete',
      timestamp: '32 minutes ago',
      icon: Trophy,
      color: 'purple'
    }
  ]

  return (
    <div className="border border-cyan-400 p-6 bg-cyan-950/10">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="text-cyan-400" size={24} />
        <h2 className="text-2xl font-bold text-cyan-400">LIVE ACTIVITY FEED</h2>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {feedItems.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 border border-cyan-400/20 bg-black/30 hover:bg-cyan-950/10 transition-all"
            >
              <div className={`w-8 h-8 border border-${item.color}-400 bg-${item.color}-950/20 flex items-center justify-center flex-shrink-0 mt-1`}>
                <Icon className={`text-${item.color}-400`} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-sm">
                  <span className="text-cyan-400 font-mono">{item.user}</span>
                  <span className="text-green-300 mx-1">{item.action}</span>
                  <span className={`text-${item.color}-400 font-semibold`}>{item.target}</span>
                  {item.xp && (
                    <span className="text-yellow-400 ml-2 font-mono">+{item.xp} XP</span>
                  )}
                </div>
                <div className="text-xs text-green-300/70 mt-1">
                  {item.timestamp}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-xs text-cyan-300">
          🔴 Live • Updates every 30 seconds
        </div>
      </div>
    </div>
  )
}