'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface AgentInputProps {
  onSubmit: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function AgentInput({ onSubmit, disabled = false, placeholder = 'Enter command...' }: AgentInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current && !disabled) textareaRef.current.focus()
  }, [disabled])

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`
  }, [])

  useEffect(() => { adjustHeight() }, [value, adjustHeight])

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSubmit(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }, [value, disabled, onSubmit])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-green-500/15 bg-black px-4 md:px-8 lg:px-16 py-4">
      <div className="flex items-end gap-3">
        {/* Prompt character */}
        <motion.span
          animate={disabled ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 1 }}
          transition={disabled ? { duration: 1.5, repeat: Infinity } : {}}
          className="font-mono text-sm font-bold shrink-0 pb-1 select-none"
          style={{ color: '#00ff41', textShadow: '0 0 8px rgba(0,255,65,0.5)' }}
        >
          {disabled ? '...' : '>'}
        </motion.span>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={disabled ? 'GHOST is responding...' : placeholder}
          rows={1}
          className="flex-1 bg-transparent font-mono text-sm text-white/90 placeholder-green-500/20 border-none outline-none resize-none leading-6 disabled:opacity-30"
          style={{ caretColor: '#00ff41' }}
          autoComplete="off"
          spellCheck={false}
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="shrink-0 font-mono text-xs tracking-[0.15em] px-4 py-2 text-green-400/70 hover:text-green-400 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          style={{ textShadow: '0 0 5px rgba(0,255,0,0.2)' }}
        >
          SEND
        </button>
      </div>
    </div>
  )
}
