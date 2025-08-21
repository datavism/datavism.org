'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Shield, Target } from 'lucide-react'
import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-black via-red-950/10 to-black">
      <div className="max-w-4xl mx-auto">
        {/* Warning Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="border-2 border-red-500 bg-red-950/20 p-8 mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="text-red-500" size={32} />
            <span className="text-red-500 font-bold text-xl uppercase tracking-wider">
              SYSTEM WARNING
            </span>
          </div>
          
          <div className="space-y-4 text-red-300 leading-relaxed">
            <p className="text-lg">
              <strong>This is not a game.</strong> You will analyze real leaked data.
            </p>
            <p className="text-lg">
              <strong>You will expose actual corruption.</strong> You will make enemies.
            </p>
            <p className="text-lg">
              <strong>They will try to stop you.</strong> Are you ready?
            </p>
          </div>
        </motion.div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-5xl font-bold mb-6 text-yellow-400">
            THE CHOICE IS YOURS
          </h2>
          
          <p className="text-xl text-green-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Stay comfortable with Excel and watch corruption thrive. 
            Or learn Python and start exposing the truth. What will it be?
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/academy/week/1"
                className="inline-flex items-center gap-3 px-10 py-5 bg-transparent border-2 border-yellow-400 text-yellow-400 font-bold text-lg hover:bg-yellow-400 hover:text-black transition-all duration-300 group"
              >
                <Target size={24} />
                <span>START INVESTIGATION</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="group-hover:translate-x-2 transition-transform"
                >
                  →
                </motion.span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-3 px-10 py-5 bg-transparent border-2 border-green-400 text-green-400 font-bold text-lg hover:bg-green-400 hover:text-black transition-all duration-300"
              >
                <Shield size={24} />
                <span>READ MANIFESTO</span>
              </Link>
            </motion.div>
          </div>

          {/* Alternative Options */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <p className="text-green-400/60 text-sm mb-4 uppercase tracking-wider">
              NOT READY TO COMMIT?
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link 
                href="/demo" 
                className="text-cyan-400 hover:text-cyan-300 transition-colors border-b border-cyan-400/30 hover:border-cyan-300"
              >
                Try Demo Challenge
              </Link>
              <span className="text-green-400/30">•</span>
              <Link 
                href="/trailer" 
                className="text-purple-400 hover:text-purple-300 transition-colors border-b border-purple-400/30 hover:border-purple-300"
              >
                Watch Trailer
              </Link>
              <span className="text-green-400/30">•</span>
              <Link 
                href="/contact" 
                className="text-yellow-400 hover:text-yellow-300 transition-colors border-b border-yellow-400/30 hover:border-yellow-300"
              >
                Secure Contact
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Final Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <blockquote className="text-lg text-green-400 font-mono max-w-2xl mx-auto">
            "When every citizen can analyze data,<br/>
            evil has nowhere to hide."
          </blockquote>
          <cite className="text-green-400/60 text-sm mt-2 block">
            — The Data Underground
          </cite>
        </motion.div>
      </div>
    </section>
  )
}