'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Users, 
  Search, 
  Award,
  ArrowRight,
  Zap
} from 'lucide-react'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type Progress = Database['public']['Tables']['progress']['Row']

interface NextActionsProps {
  profile: Profile | null
  progress: Progress[]
}

export function NextActions({ profile, progress }: NextActionsProps) {
  const completedChallenges = progress.filter(p => p.completed).length
  const currentWeek = Math.floor(completedChallenges / 5) + 1
  const weekProgress = completedChallenges % 5

  const getNextAction = () => {
    if (completedChallenges === 0) {
      return {
        title: 'START YOUR JOURNEY',
        description: 'Begin Level 1: Digital Detox',
        href: '/bootcamp/level/1',
        icon: BookOpen,
        color: 'red',
        priority: 'URGENT'
      }
    }

    if (weekProgress < 5) {
      return {
        title: `CONTINUE LEVEL ${currentWeek}`,
        description: `Complete challenge ${weekProgress + 1} of 5`,
        href: `/bootcamp/level/${currentWeek}`,
        icon: BookOpen,
        color: 'yellow',
        priority: 'HIGH'
      }
    }

    if (currentWeek < 12) {
      return {
        title: `START LEVEL ${currentWeek + 1}`,
        description: 'New missions available',
        href: `/bootcamp/level/${currentWeek + 1}`,
        icon: Zap,
        color: 'green',
        priority: 'READY'
      }
    }

    return {
      title: 'JOIN INVESTIGATION',
      description: 'Put your skills to real use',
      href: '/investigations',
      icon: Search,
      color: 'cyan',
      priority: 'GRADUATE'
    }
  }

  const nextAction = getNextAction()
  const Icon = nextAction.icon

  const suggestedActions = [
    {
      title: 'Find Your Squad',
      description: 'Team up with other investigators',
      href: '/community',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Browse Investigations',
      description: 'Explore active operations',
      href: '/investigations',
      icon: Search,
      color: 'cyan'
    },
    {
      title: 'Check Leaderboard',
      description: 'See global rankings',
      href: '/leaderboard',
      icon: Award,
      color: 'yellow'
    }
  ]

  return (
    <div className="border border-green-400 p-6">
      <h2 className="text-2xl font-bold text-green-400 mb-6">NEXT ACTIONS</h2>
      
      {/* Primary Action */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`border-2 border-${nextAction.color}-400 p-6 bg-${nextAction.color}-950/10 mb-6`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Icon className={`text-${nextAction.color}-400`} size={32} />
            <div>
              <div className={`text-sm text-${nextAction.color}-400 font-mono mb-1`}>
                {nextAction.priority}
              </div>
              <h3 className={`text-xl font-bold text-${nextAction.color}-400 mb-1`}>
                {nextAction.title}
              </h3>
              <p className="text-green-300 text-sm">
                {nextAction.description}
              </p>
            </div>
          </div>
          
          <Link
            href={nextAction.href}
            className={`flex items-center gap-2 px-6 py-3 border-2 border-${nextAction.color}-400 text-${nextAction.color}-400 hover:bg-${nextAction.color}-400 hover:text-black transition-all font-bold`}
          >
            CONTINUE
            <ArrowRight size={20} />
          </Link>
        </div>
      </motion.div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suggestedActions.map((action, index) => {
          const ActionIcon = action.icon
          return (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={action.href}
                className={`block border border-${action.color}-400 p-4 hover:bg-${action.color}-950/20 transition-all group`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <ActionIcon className={`text-${action.color}-400`} size={20} />
                  <h4 className={`font-bold text-${action.color}-400 group-hover:text-${action.color}-300`}>
                    {action.title}
                  </h4>
                </div>
                <p className="text-green-300 text-sm">
                  {action.description}
                </p>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}