'use client'

import { useRef } from 'react'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  height?: string
  readOnly?: boolean
}

export function CodeEditor({ 
  value, 
  onChange, 
  language = 'python', 
  height = '400px',
  readOnly = false 
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Simple code editor for now, can upgrade to Monaco later
  return (
    <div className="relative border border-green-400 bg-black mb-6">
      <div className="flex items-center justify-between px-4 py-2 border-b border-green-400/30 bg-green-950/10">
        <span className="text-green-400 text-sm font-mono">
          {language.toUpperCase()} - SECURE TERMINAL
        </span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
      </div>
      
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        className="w-full p-4 bg-transparent text-green-400 font-mono text-sm outline-none resize-none"
        style={{ height }}
        spellCheck={false}
        placeholder="# Start coding here..."
      />
    </div>
  )
}