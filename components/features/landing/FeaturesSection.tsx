'use client'

import { motion } from 'framer-motion'
import { Code, Database, Users, Shield, Target, Zap } from 'lucide-react'
import Link from 'next/link'

export function FeaturesSection() {
  const features = [
    {
      icon: Code,
      title: 'Real Python Training',
      description: 'Learn Python, SQL, and ML by analyzing actual leaked data. No toy projects, no fake datasets.',
      color: 'border-yellow-400 hover:shadow-yellow-400/20',
      textColor: 'text-yellow-400',
      link: '/academy/week/1'
    },
    {
      icon: Database,
      title: 'Live Investigations',
      description: 'Access real corruption cases. Contribute to ongoing investigations with global impact.',
      color: 'border-red-400 hover:shadow-red-400/20',
      textColor: 'text-red-400',
      link: '/investigations'
    },
    {
      icon: Users,
      title: 'Global Network',
      description: 'Join 2,847+ investigators worldwide. Form squads, share intel, coordinate operations.',
      color: 'border-cyan-400 hover:shadow-cyan-400/20',
      textColor: 'text-cyan-400',
      link: '/community'
    },
    {
      icon: Shield,
      title: 'Secure Operations',
      description: 'Military-grade encryption, anonymous communication, whistleblower protection protocols.',
      color: 'border-green-400 hover:shadow-green-400/20',
      textColor: 'text-green-400',
      link: '/security'
    },
    {
      icon: Target,
      title: 'Mission System',
      description: 'Complete special operations. Target specific corruption networks. Make real impact.',
      color: 'border-purple-400 hover:shadow-purple-400/20',
      textColor: 'text-purple-400',
      link: '/missions'
    },
    {
      icon: Zap,
      title: 'AI Assistant',
      description: 'Ghost AI helps you analyze data patterns, identify anomalies, and connect the dots.',
      color: 'border-orange-400 hover:shadow-orange-400/20',
      textColor: 'text-orange-400',
      link: '/tools/ai'
    }
  ]

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 text-yellow-400">
            WEAPONS OF MASS INSTRUCTION
          </h2>
          <p className="text-xl text-green-300 max-w-3xl mx-auto leading-relaxed">
            Transform from Excel victim to data vigilante. Our platform gives you everything 
            needed to expose corruption and create real-world impact.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group h-full"
            >
              <Link href={feature.link}>
                <div className={`bg-black/50 border ${feature.color} p-6 h-full transition-all duration-300 hover:bg-black/70 cursor-pointer`}>
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`${feature.textColor} w-12 h-12 mb-4 flex items-center justify-center`}
                  >
                    <feature.icon size={32} />
                  </motion.div>

                  {/* Title */}
                  <h3 className={`text-xl font-bold ${feature.textColor} mb-3`}>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-green-300/80 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Action indicator */}
                  <div className="flex items-center gap-2 text-xs text-green-400/60 group-hover:text-green-400 transition-colors">
                    <span>ACCESS MODULE</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-black/50 border border-green-400/30 p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">
              Ready to Join the Revolution?
            </h3>
            <p className="text-green-300 mb-6 leading-relaxed">
              Every corrupt official you expose. Every hidden network you uncover. 
              Every dollar you recover. You're not just learning—you're fighting back.
            </p>
            <Link
              href="/academy/week/1"
              className="inline-block px-8 py-4 bg-transparent border-2 border-yellow-400 text-yellow-400 font-bold hover:bg-yellow-400 hover:text-black transition-all duration-300"
            >
              START YOUR TRAINING
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}