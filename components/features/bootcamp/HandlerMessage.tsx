'use client'

import { motion } from 'framer-motion'

interface HandlerMessageProps {
  message: string
  handler: string
  avatar: string
}

export function HandlerMessage({ message, handler, avatar }: HandlerMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-purple-400/30 p-4 mb-4 bg-purple-950/10"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{avatar}</div>
        <div className="flex-1">
          <div className="text-purple-400 font-bold mb-2">{handler}</div>
          <div className="text-purple-300 text-sm italic">
            "{message}"
          </div>
        </div>
      </div>
    </motion.div>
  )
}