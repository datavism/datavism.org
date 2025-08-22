'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  height?: string
  theme?: string
}

export function CodeEditor({ value, onChange, language = 'python', height = '300px', theme = 'resistance' }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [value])
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newValue = value.substring(0, start) + '    ' + value.substring(end)
      onChange(newValue)
      
      // Set cursor position after the tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4
        }
      })
    }
  }
  
  const getThemeClasses = () => {
    switch (theme) {
      case 'boss-battle':
        return 'bg-red-950/20 border-red-400 text-red-100'
      case 'victory':
        return 'bg-green-950/20 border-green-400 text-green-100'
      default:
        return 'bg-black border-green-400 text-green-300'
    }
  }
  
  const getLineNumbers = () => {
    const lines = value.split('\n')
    return lines.map((_, index) => index + 1)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border-2 mb-6 ${getThemeClasses()}`}
      style={{ minHeight: height }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-current/30">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm font-mono">resistance_terminal.py</span>
        </div>
        <div className="text-xs font-mono opacity-60">
          {language.toUpperCase()} | {theme.toUpperCase()}
        </div>
      </div>
      
      {/* Code Editor */}
      <div className="flex">
        {/* Line Numbers */}
        <div className="flex flex-col text-right pr-4 py-4 text-xs font-mono opacity-40 border-r border-current/20 bg-black/20 min-w-[3rem]">
          {getLineNumbers().map((lineNum) => (
            <div key={lineNum} className="leading-6">
              {lineNum}
            </div>
          ))}
        </div>
        
        {/* Code Area */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={`w-full p-4 bg-transparent resize-none outline-none font-mono text-sm leading-6 ${
              theme === 'boss-battle' ? 'text-red-100' : 'text-green-300'
            }`}
            placeholder="# Write your resistance code here..."
            style={{
              minHeight: height,
              maxHeight: '80vh'
            }}
          />
          
          {/* Syntax highlighting overlay (simplified) */}
          <div className="absolute inset-0 pointer-events-none p-4 font-mono text-sm leading-6 opacity-0">
            {value.split('\n').map((line, index) => (
              <div key={index}>
                {line.replace(/^(#.*)/g, '<span class="text-gray-500">$1</span>')}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-current/30 text-xs">
        <div className="font-mono opacity-60">
          Lines: {value.split('\\n').length} | Characters: {value.length}
        </div>
        <div className="font-mono opacity-60">
          Encoding: UTF-8 | EOL: LF
        </div>
      </div>
    </motion.div>
  )
}