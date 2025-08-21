// ============================================
// src/components/features/landing/LiveTerminal.tsx
// ============================================

'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const liveFeeds = [
  { type: 'algorithm', message: 'New discovery: Instagram algorithm bias detected - targeting minority users' },
  { type: 'investigation', message: 'Investigation #247: Dynamic pricing manipulation exposed at major retailer' },
  { type: 'alert', message: 'ALERT: AI recommendation system pushing conspiracy theories' },
  { type: 'success', message: 'SUCCESS: Greenwashing exposed - company emissions 400% higher than reported' },
  { type: 'analysis', message: 'Analyzing: social_media_manipulation_2024.json' },
  { type: 'operative', message: 'Data activist "AlgorithmHunter" joined from Amsterdam' },
  { type: 'bias', message: 'BIAS DETECTED: Hiring algorithm discriminates against women in tech' },
  { type: 'exposed', message: 'EXPOSED: Ride-sharing surge pricing targets low-income neighborhoods' }
]

export function LiveTerminal() {
  const [logs, setLogs] = useState<typeof liveFeeds>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = liveFeeds[Math.floor(Math.random() * liveFeeds.length)]
      setLogs(prev => [newLog, ...prev].slice(0, 10))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getLogColor = (type: string) => {
    switch(type) {
      case 'algorithm': return 'text-yellow-400'
      case 'alert': return 'text-red-400'
      case 'success': return 'text-green-400'
      case 'investigation': return 'text-cyan-400'
      case 'operative': return 'text-purple-400'
      case 'bias': return 'text-orange-400'
      case 'exposed': return 'text-pink-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 text-yellow-400 crt-text">LIVE OPERATIONS</h2>
          <p className="text-lg text-green-300">Real-time feed from the Data Activism network</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-black border-2 border-green-400 p-6 font-mono text-sm"
        >
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-green-400/30">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-4 text-green-400">SECURE_TERMINAL_v2.1</span>
          </div>

          <div className="space-y-2 min-h-[300px]">
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`${getLogColor(log.type)} opacity-${100 - i * 10}`}
              >
                <span className="text-gray-500">
                  [{new Date().toLocaleTimeString()}]
                </span>{' '}
                {log.message}
              </motion.div>
            ))}
            <div className="animate-pulse">
              <span className="text-green-400">ghost@datavism:~$</span>
              <span className="animate-blink ml-1">_</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <button className="px-6 py-3 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all">
            ACCESS FULL FEED →
          </button>
        </motion.div>
      </div>
    </section>
  )
}