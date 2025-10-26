'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Trophy, Users as UsersIcon, Zap, Clock } from 'lucide-react'
import { createClient } from '@/lib/services/supabase/client'

interface Activity {
  id: string
  type: 'signup' | 'level_complete' | 'squad_join' | 'investigation_publish'
  user: string
  location?: string
  timestamp: Date
  data?: Record<string, any>
}

// Fake activity generator for demo (will be replaced with real Supabase data)
function generateFakeActivity(): Activity {
  const types: Activity['type'][] = ['signup', 'level_complete', 'squad_join']
  const names = ['Sarah', 'Mike', 'Alex', 'Emma', 'David', 'Lisa', 'Tom', 'Anna', 'Chris', 'Maya']
  const cities = ['Berlin', 'London', 'NYC', 'SF', 'Tokyo', 'Paris', 'Sydney', 'Toronto', 'Amsterdam', 'Singapore']
  const squads = ['Data Rebels', 'Truth Seekers', 'Code Warriors', 'Digital Freedom', 'Algorithm Slayers']

  const type = types[Math.floor(Math.random() * types.length)]
  const name = names[Math.floor(Math.random() * names.length)]
  const city = cities[Math.floor(Math.random() * cities.length)]

  const activity: Activity = {
    id: `${Date.now()}_${Math.random()}`,
    type,
    user: name,
    location: city,
    timestamp: new Date(),
  }

  if (type === 'level_complete') {
    activity.data = {
      level: Math.floor(Math.random() * 3) + 1,
      time: `${Math.floor(Math.random() * 4) + 1}h ${Math.floor(Math.random() * 60)}m`
    }
  } else if (type === 'squad_join') {
    activity.data = {
      squad: squads[Math.floor(Math.random() * squads.length)]
    }
  }

  return activity
}

export function LiveActivityFeed({ maxItems = 5 }: { maxItems?: number }) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    // Initialize with some activities
    setActivities([
      generateFakeActivity(),
      generateFakeActivity(),
      generateFakeActivity()
    ])

    // Add new activity every 5-10 seconds
    const interval = setInterval(() => {
      if (!isPaused) {
        setActivities(prev => {
          const newActivity = generateFakeActivity()
          const updated = [newActivity, ...prev].slice(0, maxItems)
          return updated
        })
      }
    }, Math.random() * 5000 + 5000) // 5-10 seconds

    return () => clearInterval(interval)
  }, [isPaused, maxItems])

  // TODO: Replace with real Supabase Realtime subscription
  // useEffect(() => {
  //   const supabase = createBrowserSupabaseClient()
  //
  //   const channel = supabase
  //     .channel('activity_feed')
  //     .on('postgres_changes', {
  //       event: 'INSERT',
  //       schema: 'public',
  //       table: 'activity_feed',
  //       filter: 'is_public=eq.true'
  //     }, (payload) => {
  //       const newActivity = payload.new
  //       setActivities(prev => [newActivity, ...prev].slice(0, maxItems))
  //     })
  //     .subscribe()
  //
  //   return () => {
  //     supabase.removeChannel(channel)
  //   }
  // }, [maxItems])

  const getActivityMessage = (activity: Activity): { icon: React.ReactNode; text: string; color: string } => {
    switch (activity.type) {
      case 'signup':
        return {
          icon: <User className="w-4 h-4" />,
          text: `${activity.user} from ${activity.location} just joined the resistance`,
          color: 'text-green-400'
        }
      case 'level_complete':
        return {
          icon: <Trophy className="w-4 h-4" />,
          text: `${activity.user} completed Level ${activity.data?.level} in ${activity.data?.time}`,
          color: 'text-yellow-400'
        }
      case 'squad_join':
        return {
          icon: <UsersIcon className="w-4 h-4" />,
          text: `${activity.user} joined squad "${activity.data?.squad}"`,
          color: 'text-cyan-400'
        }
      default:
        return {
          icon: <Zap className="w-4 h-4" />,
          text: `${activity.user} is active`,
          color: 'text-gray-400'
        }
    }
  }

  const getTimeAgo = (timestamp: Date): string => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000)
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Live indicator */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-gray-400 uppercase tracking-wide">Live Activity</span>
        </div>
        {isPaused && (
          <span className="text-xs text-gray-600">(Paused)</span>
        )}
      </div>

      {/* Activity list */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {activities.map((activity) => {
            const { icon, text, color } = getActivityMessage(activity)

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-3 p-3 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
              >
                <div className={`mt-0.5 ${color}`}>
                  {icon}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-600" />
                    <span className="text-xs text-gray-600">
                      {getTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Hover hint */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-600">
          Hover to pause • Updated in real-time
        </p>
      </div>
    </div>
  )
}
