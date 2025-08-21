// /components/Logo.tsx
'use client'
import { motion } from 'framer-motion'

export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .6, ease: 'easeOut' }}
    >
      <motion.div
        className="rounded-xl bg-black text-white grid place-items-center"
        style={{ width: size, height: size }}
        animate={{ rotate: [0, -2, 2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-xs font-bold">DV</span>
      </motion.div>
      <span className="text-xl md:text-2xl font-extrabold tracking-tight">
        DATAVISM
      </span>
    </motion.div>
  )
}
