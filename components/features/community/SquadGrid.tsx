'use client'

import { motion } from 'framer-motion'
import { Users, Eye, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Database } from '@/types/database'

type Squad = Database['public']['Tables']['squads']['Row'] & {
  squad_members: { count: number }[]
}

type SquadMember = Database['public']['Tables']['squad_members']['Row'] & {
  squads: Database['public']['Tables']['squads']['Row']
}

interface SquadGridProps {
  squads: Squad[]
  userSquads: SquadMember[]
}

export function SquadGrid({ squads, userSquads }: SquadGridProps) {
  const getSquadTypeColor = (type: string) => {
    switch (type) {
      case 'investigation': return 'red'
      case 'learning': return 'green'
      case 'strike': return 'purple'
      default: return 'cyan'
    }
  }

  const getSquadTypeIcon = (type: string) => {
    switch (type) {
      case 'investigation': return '🔍'
      case 'learning': return '📚'
      case 'strike': return '⚡'
      default: return '🎯'
    }
  }

  const isUserMember = (squadId: string) => {
    return userSquads.some(us => us.squad_id === squadId)
  }

  return (
    <div className="border border-green-400 p-6">
      <h2 className="text-2xl font-bold text-green-400 mb-6">ACTIVE SQUADS</h2>
      
      {squads.length === 0 ? (
        <div className="text-center py-8">
          <Users size={48} className="mx-auto mb-4 text-green-400/50" />
          <p className="text-green-300 mb-4">No active squads yet</p>
          <p className="text-sm text-green-300/70">Be the first to create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {squads.map((squad, index) => {
            const color = getSquadTypeColor(squad.type)
            const icon = getSquadTypeIcon(squad.type)
            const memberCount = squad.squad_members?.[0]?.count || squad.member_count
            const isMember = isUserMember(squad.id)
            
            return (
              <motion.div
                key={squad.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border-2 ${
                  isMember 
                    ? `border-${color}-400 bg-${color}-950/20` 
                    : `border-${color}-400/50 bg-${color}-950/5`
                } p-4 group hover:bg-${color}-950/10 transition-all`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <h3 className={`font-bold text-${color}-400 group-hover:text-${color}-300`}>
                        {squad.name}
                      </h3>
                      <div className="text-sm text-green-300 capitalize">
                        {squad.type} Squad
                      </div>
                    </div>
                  </div>
                  
                  {isMember && (
                    <div className="flex items-center gap-1 text-xs text-yellow-400">
                      <Star size={12} />
                      MEMBER
                    </div>
                  )}
                </div>
                
                <p className="text-green-300 text-sm mb-4 line-clamp-2">
                  {squad.description || 'No description available'}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-green-300">
                      <Users size={14} />
                      {memberCount} members
                    </div>
                    <div className="flex items-center gap-1 text-purple-300">
                      <Eye size={14} />
                      {squad.investigations_completed} ops
                    </div>
                  </div>
                  
                  <Link
                    href={`/community/squads/${squad.id}`}
                    className={`flex items-center gap-1 text-${color}-400 hover:text-${color}-300 text-sm font-mono`}
                  >
                    {isMember ? 'OPEN' : 'JOIN'}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}