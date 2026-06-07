'use client'

import { useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { typing } from '@/lib/audio/procedural'

interface AgentMessageProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
  timestamp?: number
}

let lastTypingSoundTime = 0
function throttledTypingSound() {
  const now = Date.now()
  if (now - lastTypingSoundTime >= 50) {
    lastTypingSoundTime = now
    typing()
  }
}

export function AgentMessage({ role, content, isStreaming = false, timestamp }: AgentMessageProps) {
  const isAgent = role === 'assistant'
  const prevLengthRef = useRef(content.length)
  const reducedMotion = useRef(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
  }, [])

  useEffect(() => {
    if (!isAgent || !isStreaming || reducedMotion.current) return
    if (content.length > prevLengthRef.current) throttledTypingSound()
    prevLengthRef.current = content.length
  }, [content, isAgent, isStreaming])

  const rendered = useMemo(() => renderMarkdown(content), [content])

  if (!isAgent) {
    // User message — looks like terminal input
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="my-4 font-mono text-sm"
      >
        <span className="text-green-500/50 select-none">{'> '}</span>
        <span className="text-white/90">{content}</span>
        {timestamp && (
          <span className="text-white/15 text-xs ml-3">
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </motion.div>
    )
  }

  // Agent message — terminal output
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="my-4 font-mono text-sm leading-relaxed"
      style={{ color: '#00ff41', textShadow: '0 0 8px rgba(0,255,65,0.3)' }}
    >
      {rendered}
      {isStreaming && (
        <motion.span
          className="inline-block w-[8px] h-[14px] ml-0.5 align-middle bg-green-400"
          style={{ boxShadow: '0 0 6px rgba(0,255,65,0.6)' }}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        />
      )}
    </motion.div>
  )
}

// ─── Markdown ─────────────────────────────────────────────────────

function renderMarkdown(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  const segments = text.split(/(```[\s\S]*?```)/g)

  segments.forEach((segment, segIdx) => {
    if (segment.startsWith('```') && segment.endsWith('```')) {
      const inner = segment.slice(3, -3)
      const lines = inner.split('\n')
      const firstLine = lines[0]?.trim()
      const isLangTag = firstLine && /^[a-zA-Z0-9_+-]+$/.test(firstLine) && lines.length > 1
      const code = isLangTag ? lines.slice(1).join('\n') : inner

      nodes.push(
        <pre
          key={`code-${segIdx}`}
          className="my-3 px-4 py-3 bg-black/60 border-l-2 border-green-500/40 overflow-x-auto text-xs leading-5 whitespace-pre"
          style={{ color: '#66ffaa' }}
        >
          <code>{code.trim()}</code>
        </pre>
      )
      return
    }

    const lines = segment.split('\n')
    let listItems: React.ReactNode[] = []
    let listOrdered = false

    const flushList = () => {
      if (listItems.length > 0) {
        const Tag = listOrdered ? 'ol' : 'ul'
        nodes.push(
          <Tag key={`list-${segIdx}-${nodes.length}`} className={`my-2 ml-4 ${listOrdered ? 'list-decimal' : 'list-disc'} list-inside space-y-1`}>
            {listItems}
          </Tag>
        )
        listItems = []
      }
    }

    lines.forEach((line, lineIdx) => {
      const trimmed = line.trim()

      if (/^[-*]\s+/.test(trimmed)) {
        if (listOrdered) { flushList(); listOrdered = false }
        listItems.push(<li key={`li-${segIdx}-${lineIdx}`}>{renderInline(trimmed.replace(/^[-*]\s+/, ''))}</li>)
        return
      }

      if (/^\d+\.\s+/.test(trimmed)) {
        if (!listOrdered && listItems.length > 0) flushList()
        listOrdered = true
        listItems.push(<li key={`li-${segIdx}-${lineIdx}`}>{renderInline(trimmed.replace(/^\d+\.\s+/, ''))}</li>)
        return
      }

      flushList()

      if (trimmed === '') {
        nodes.push(<div key={`br-${segIdx}-${lineIdx}`} className="h-3" />)
        return
      }

      // Heading-style lines (## or NEXT STEPS etc)
      if (/^#{1,3}\s/.test(trimmed)) {
        nodes.push(
          <div key={`h-${segIdx}-${lineIdx}`} className="mt-4 mb-2 font-bold tracking-wider text-green-300" style={{ textShadow: '0 0 10px rgba(0,255,65,0.4)' }}>
            {renderInline(trimmed.replace(/^#{1,3}\s/, ''))}
          </div>
        )
        return
      }

      nodes.push(
        <span key={`line-${segIdx}-${lineIdx}`}>
          {renderInline(trimmed)}
          {lineIdx < lines.length - 1 && <br />}
        </span>
      )
    })

    flushList()
  })

  return nodes
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    const token = match[0]
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(<strong key={`b-${match.index}`} className="font-bold text-green-300">{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={`ic-${match.index}`} className="px-1.5 py-0.5 bg-black/50 border-l border-green-500/30 text-xs" style={{ color: '#66ffaa' }}>
          {token.slice(1, -1)}
        </code>
      )
    }
    lastIndex = match.index + token.length
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts
}
