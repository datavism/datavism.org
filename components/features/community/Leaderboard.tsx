'use client'

import { motion } from 'framer-motion'
import { Trophy, Medal, Award, Crown } from 'lucide-react'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

interface LeaderboardProps {
  users: Profile[]
  currentUserId: string
}

export function Leaderboard({ users, currentUserId }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="text-yellow-400" size={20} />
      case 2: return <Medal className="text-gray-300" size={20} />
      case 3: return <Award className="text-orange-400" size={20} />
      default: return <Trophy className="text-green-400" size={16} />
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'yellow'
      case 2: return 'gray'
      case 3: return 'orange'
      default: return 'green'
    }
  }

  return (
    <div className="border border-purple-400 p-6 bg-purple-950/10">
      <h2 className="text-2xl font-bold text-purple-400 mb-6">GLOBAL LEADERBOARD</h2>
      
      <div className="space-y-3">
        {users.map((user, index) => {
          const rank = index + 1
          const isCurrentUser = user.id === currentUserId
          const color = getRankColor(rank)
          
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-3 p-3 border transition-all ${
                isCurrentUser
                  ? `border-${color}-400 bg-${color}-950/20`
                  : `border-${color}-400/30 hover:border-${color}-400/50`
              }`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-8">
                {getRankIcon(rank)}
              </div>
              
              {/* Avatar */}
              <div className={`w-10 h-10 border border-${color}-400 bg-${color}-950/20 flex items-center justify-center text-${color}-400 font-bold text-sm`}>
                {user.username[0]?.toUpperCase()}
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className={`font-bold text-${color}-400 truncate ${
                  isCurrentUser ? 'text-yellow-400' : ''
                }`}>
                  {user.username} {isCurrentUser && '(You)'}
                </div>
                <div className="text-xs text-green-300">
                  {user.reputation} • Level {user.level}
                </div>
              </div>
              
              {/* XP */}
              <div className="text-right">
                <div className={`font-bold text-${color}-400`}>
                  {user.xp.toLocaleString()}
                </div>
                <div className="text-xs text-green-300">XP</div>
              </div>
            </motion.div>
          )
        })}
      </div>
      
      {/* View More */}
      <div className="mt-4 text-center">
        <button className="text-purple-400 hover:text-purple-300 text-sm font-mono">
          VIEW FULL LEADERBOARD →
        </button>
      </div>
    </div>
  )
}