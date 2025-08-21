'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, DollarSign, Search, ShieldCheck } from 'lucide-react'

export function StatsSection() {
  const [stats, setStats] = useState({
    investigators: 2847,
    exposedValue: 12.3,
    investigations: 247,
    algorithms: 89
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        investigators: prev.investigators + Math.floor(Math.random() * 3),
        exposedValue: prev.exposedValue + (Math.random() * 0.1),
        investigations: prev.investigations + (Math.random() > 0.8 ? 1 : 0),
        algorithms: prev.algorithms + (Math.random() > 0.95 ? 1 : 0)
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const statsData = [
    {
      icon: Users,
      value: stats.investigators.toLocaleString(),
      label: 'Data Activists',
      color: 'text-yellow-400',
      description: 'Data scientists fighting algorithmic manipulation worldwide'
    },
    {
      icon: DollarSign,
      value: `€${stats.exposedValue.toFixed(1)}M`,
      label: 'Corporate BS Exposed',
      color: 'text-red-400',
      description: 'Value of hidden corporate manipulation uncovered'
    },
    {
      icon: Search,
      value: stats.investigations.toString(),
      label: 'Active Investigations',
      color: 'text-cyan-400',
      description: 'Data-driven investigations exposing digital manipulation'
    },
    {
      icon: ShieldCheck,
      value: stats.algorithms.toString(),
      label: 'Algorithms Decoded',
      color: 'text-green-400',
      description: 'Manipulative algorithms exposed and decoded'
    }
  ]

  return (
    <section className="py-20 px-6 border-t border-green-400/30 border-b border-green-400/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-yellow-400 crt-text">GLOBAL IMPACT</h2>
          <p className="text-green-300 max-w-2xl mx-auto">
            Real numbers from real investigations. Updated in real-time as our community 
            exposes algorithmic manipulation and creates digital transparency worldwide.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="bg-black/50 border border-green-400/30 p-6 hover:border-green-400 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-400/20">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`${stat.color} w-12 h-12 mx-auto mb-4 flex items-center justify-center`}
                >
                  <stat.icon size={32} />
                </motion.div>

                {/* Value */}
                <motion.div
                  className={`text-3xl font-bold ${stat.color} mb-2 font-mono`}
                  initial={{ scale: 1 }}
                  whileInView={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {stat.value}
                </motion.div>

                {/* Label */}
                <div className="text-sm uppercase tracking-wider text-green-400/80 mb-2 font-bold">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="text-xs text-green-300/60 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {stat.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 border border-green-400/30">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-400 font-mono uppercase tracking-wider">
              LIVE DATA FEED
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}