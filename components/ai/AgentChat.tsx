'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { AgentMessage } from './AgentMessage'
import { AgentInput } from './AgentInput'
import { AgentThinking } from './AgentThinking'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface AgentChatProps {
  systemPrompt: string
  initialMessage?: string
  conversationId?: string
  onConversationUpdate?: (messages: Message[]) => void
  className?: string
}

export function AgentChat({
  systemPrompt,
  initialMessage,
  onConversationUpdate,
  className = '',
}: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true
    if (initialMessage) {
      setMessages([{
        id: generateId(),
        role: 'assistant',
        content: initialMessage,
        timestamp: Date.now(),
      }])
    }
  }, [initialMessage])

  useEffect(() => {
    if (messages.length > 0) onConversationUpdate?.(messages)
  }, [messages, onConversationUpdate])

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, streamingContent, isLoading, scrollToBottom])

  const handleSend = useCallback(async (text: string) => {
    setError(null)
    const userMsg: Message = { id: generateId(), role: 'user', content: text, timestamp: Date.now() }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setIsLoading(true)
    setStreamingContent('')

    const apiMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...updatedMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ]

    if (abortRef.current) abortRef.current.abort()
    const abortController = new AbortController()
    abortRef.current = abortController

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortController.signal,
      })

      if (!res.ok) {
        const errBody = await res.text()
        let errMsg = 'Connection failed'
        try { errMsg = JSON.parse(errBody).error || errMsg } catch {}
        throw new Error(errMsg)
      }

      if (!res.body) throw new Error('No response stream')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setStreamingContent(accumulated)
      }

      setMessages(prev => [...prev, {
        id: generateId(), role: 'assistant', content: accumulated, timestamp: Date.now(),
      }])
      setStreamingContent('')
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
      abortRef.current = null
    }
  }, [messages, systemPrompt])

  useEffect(() => {
    return () => { abortRef.current?.abort() }
  }, [])

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Messages — full bleed, no borders, no widget framing */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-16 py-6"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,255,65,0.006) 2px, rgba(0,255,65,0.006) 3px)',
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <AgentMessage key={msg.id} role={msg.role} content={msg.content} timestamp={msg.timestamp} />
          ))}
          {streamingContent && (
            <AgentMessage key="streaming" role="assistant" content={streamingContent} isStreaming />
          )}
          {isLoading && !streamingContent && <AgentThinking key="thinking" />}
        </AnimatePresence>

        {error && (
          <div className="my-4 px-4 py-3 border border-red-500/30 font-mono text-xs text-red-400">
            <span className="text-red-500 font-bold">TRANSMISSION ERROR:</span> {error}
            <button type="button" onClick={() => setError(null)} className="ml-3 text-red-500/50 hover:text-red-400">
              [retry]
            </button>
          </div>
        )}
      </div>

      {/* Input — clean terminal line at bottom */}
      <AgentInput onSubmit={handleSend} disabled={isLoading} />
    </div>
  )
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
