'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { typing as typingSound, impact, scan, whoosh } from '@/lib/audio/procedural'
import { ROLE_CONFIG, type UserRole } from '@/lib/store/useDatavist'

interface CodenameEntryProps {
  role: UserRole
  onSubmit: (codename: string) => void
}

export function CodenameEntry({ role, onSubmit }: CodenameEntryProps) {
  const [value, setValue] = useState('')
  const [encrypting, setEncrypting] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const roleConfig = ROLE_CONFIG[role]

  // Auto-focus the input
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
      .toUpperCase()
      .replace(/\s/g, '')
      .replace(/[^A-Z0-9_\-]/g, '')
      .slice(0, 20)

    if (raw !== value) {
      typingSound()
    }
    setValue(raw)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      handleSubmit()
    }
  }

  const isValid = value.length >= 2

  const handleSubmit = () => {
    if (!isValid || encrypting) return
    setEncrypting(true)
    impact()

    // Simulate encryption progress
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        scan()
        setTimeout(() => {
          whoosh()
          onSubmit(value)
        }, 600)
      }
      setProgress(Math.min(p, 100))
    }, 120)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6"
    >
      <div className="max-w-lg w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <div className="text-green-400/50 text-sm tracking-widest mb-4">
            {roleConfig.icon} {roleConfig.title.toUpperCase()} OPERATIVE
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-green-400 tracking-wide">
            ENTER OPERATIVE CODENAME
          </h1>
        </motion.div>

        {/* Terminal input area */}
        {!encrypting ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="border-2 border-green-400/60 bg-black p-1 mb-4">
              <div className="flex items-center px-4 py-3 min-h-[48px]">
                <span className="text-green-400/50 mr-3 select-none text-lg">{'>'}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={value}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  maxLength={20}
                  placeholder="CODENAME"
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="characters"
                  className="flex-1 bg-transparent text-green-400 text-base sm:text-xl md:text-2xl font-mono font-bold tracking-widest outline-none placeholder:text-green-400/20 caret-green-400 min-h-[48px]"
                />
                <span className="inline-block w-2.5 h-6 bg-green-400 animate-blink ml-1" />
              </div>
            </div>

            {/* Constraints */}
            <div className="flex justify-between text-xs text-green-400/40 mb-8 px-1">
              <span>MIN 2 CHARS / NO SPACES</span>
              <span>{value.length}/20</span>
            </div>

            {/* Submit button */}
            <motion.button
              whileHover={isValid ? { scale: 1.03 } : undefined}
              whileTap={isValid ? { scale: 0.97 } : undefined}
              onClick={handleSubmit}
              disabled={!isValid}
              className={`
                w-full py-4 min-h-[56px] border-2 font-bold text-lg tracking-widest transition-all duration-300
                ${isValid
                  ? 'border-green-400 text-green-400 hover:bg-green-400/10 cursor-pointer'
                  : 'border-green-400/20 text-green-400/20 cursor-not-allowed'
                }
              `}
            >
              CONFIRM IDENTITY
            </motion.button>
          </motion.div>
        ) : (
          /* Encrypting animation */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="mb-6">
              <span className="text-green-400/70 text-sm tracking-widest">
                ENCRYPTING IDENTITY...
              </span>
            </div>

            {/* Progress bar */}
            <div className="border border-green-400/40 p-0.5 mb-4">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                className="h-3 bg-green-400"
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Progress blocks */}
            <div className="font-mono text-green-400/60 text-xs tracking-widest">
              {Array.from({ length: 20 }).map((_, i) => (
                <span
                  key={i}
                  className={i < Math.floor(progress / 5) ? 'text-green-400' : 'text-green-400/20'}
                >
                  {'\u2588'}
                </span>
              ))}
              <span className="ml-2 text-green-400">
                {Math.floor(progress)}%
              </span>
            </div>

            {/* Codename confirmation */}
            {progress >= 100 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 text-green-400 font-bold text-lg"
              >
                IDENTITY SECURED: {value}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
