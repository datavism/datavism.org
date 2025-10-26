'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, MapPin, Clock, Smartphone, Globe, Activity } from 'lucide-react'

interface TrackingEvent {
  id: string
  type: 'location' | 'device' | 'behavior' | 'time' | 'network'
  message: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const trackingEvents: TrackingEvent[] = [
  {
    id: '1',
    type: 'location',
    message: 'IP geolocation tracked',
    icon: MapPin,
    color: 'text-red-400'
  },
  {
    id: '2',
    type: 'device',
    message: 'Browser fingerprint collected',
    icon: Smartphone,
    color: 'text-yellow-400'
  },
  {
    id: '3',
    type: 'behavior',
    message: 'Mouse movement pattern recorded',
    icon: Activity,
    color: 'text-cyan-400'
  },
  {
    id: '4',
    type: 'time',
    message: 'Session duration: 00:00:47',
    icon: Clock,
    color: 'text-green-400'
  },
  {
    id: '5',
    type: 'network',
    message: 'Referrer source analyzed',
    icon: Globe,
    color: 'text-magenta-400'
  },
  {
    id: '6',
    type: 'device',
    message: 'Screen resolution captured',
    icon: Eye,
    color: 'text-yellow-400'
  }
]

export function DataTrackingSimulation() {
  const [trackedCount, setTrackedCount] = useState(0)
  const [currentEvent, setCurrentEvent] = useState<TrackingEvent | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Show tracking events every 2-3 seconds
    const showEvent = () => {
      const randomEvent = trackingEvents[Math.floor(Math.random() * trackingEvents.length)]
      setCurrentEvent(randomEvent)
      setTrackedCount(prev => prev + 1)

      // Hide after 1.5 seconds
      setTimeout(() => {
        setCurrentEvent(null)
      }, 1500)
    }

    // Initial delay
    const initialTimer = setTimeout(() => {
      showEvent()

      // Then repeat every 2.5 seconds
      const interval = setInterval(showEvent, 2500)

      return () => clearInterval(interval)
    }, 1000)

    return () => clearTimeout(initialTimer)
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-xs">
      {/* Tracking Counter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 px-4 py-3 bg-black/90 border-2 border-red-500 rounded-lg backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <Eye className="w-5 h-5 text-red-400 animate-pulse" />
          <div>
            <div className="text-xs text-gray-400 uppercase">You've been tracked</div>
            <div className="text-2xl font-bold text-red-400 font-mono">
              {trackedCount} times
            </div>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          in the last {Math.floor(trackedCount / 2)} seconds
        </div>
      </motion.div>

      {/* Live Tracking Event */}
      <AnimatePresence mode="wait">
        {currentEvent && (
          <motion.div
            key={currentEvent.id}
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.8 }}
            className="px-4 py-3 bg-black/90 border border-gray-700 rounded-lg backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <currentEvent.icon className={`w-4 h-4 ${currentEvent.color}`} />
              <span className={`text-sm font-mono ${currentEvent.color}`}>
                {currentEvent.message}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close button (optional) */}
      <button
        onClick={() => setIsVisible(false)}
        className="mt-2 text-xs text-gray-600 hover:text-gray-400 transition-colors w-full text-right"
      >
        (This is just a demo - but it's real on most sites)
      </button>
    </div>
  )
}
