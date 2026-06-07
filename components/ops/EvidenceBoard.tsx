'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { scan } from '@/lib/audio/procedural'

// ─── Types ──────────────────────────────────────────────────────────

export interface EvidenceItem {
  id: string
  title: string
  content: string
  category: string
  missionSlug?: string
  x: number
  y: number
  connections: string[]
  createdAt: number
}

interface EvidenceBoardProps {
  evidence: EvidenceItem[]
}

// ─── Category Colors ────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  pricing: '#00e5ff',
  surveillance: '#ff1744',
  algorithm: '#b388ff',
  greenwash: '#00ff41',
  privacy: '#ffd600',
  manipulation: '#ff9100',
  default: '#00ff41',
}

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category.toLowerCase()] || CATEGORY_COLORS.default
}

// ─── Local Storage ──────────────────────────────────────────────────

const STORAGE_KEY = 'datavism-evidence-board'

function loadEvidence(): EvidenceItem[] | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return null
}

function saveEvidence(items: EvidenceItem[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

// ─── Component ──────────────────────────────────────────────────────

export default function EvidenceBoard({ evidence: initialEvidence }: EvidenceBoardProps) {
  const [items, setItems] = useState<EvidenceItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Board pan state
  const boardRef = useRef<HTMLDivElement>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStart = useRef({ x: 0, y: 0 })
  const panOrigin = useRef({ x: 0, y: 0 })

  // Hydrate from localStorage or use initial
  useEffect(() => {
    const stored = loadEvidence()
    if (stored && stored.length > 0) {
      setItems(stored)
    } else {
      setItems(initialEvidence)
    }
    setHydrated(true)
  }, [initialEvidence])

  // Persist on change
  useEffect(() => {
    if (hydrated && items.length > 0) {
      saveEvidence(items)
    }
  }, [items, hydrated])

  // Update card position after drag
  const handleDragEnd = useCallback(
    (id: string, info: { point: { x: number; y: number }; offset: { x: number; y: number } }) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, x: item.x + info.offset.x, y: item.y + info.offset.y }
            : item
        )
      )
    },
    []
  )

  // Board panning (middle-click or empty area drag)
  const handleBoardPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Only pan from direct board clicks, not card clicks
      if (e.target !== boardRef.current && e.target !== (boardRef.current?.firstChild as HTMLElement)) return
      setIsPanning(true)
      panStart.current = { x: e.clientX, y: e.clientY }
      panOrigin.current = { ...pan }
    },
    [pan]
  )

  const handleBoardPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPanning) return
      const dx = e.clientX - panStart.current.x
      const dy = e.clientY - panStart.current.y
      setPan({ x: panOrigin.current.x + dx, y: panOrigin.current.y + dy })
    },
    [isPanning]
  )

  const handleBoardPointerUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  // Add new evidence
  const handleAddEvidence = useCallback(
    (title: string, content: string, category: string) => {
      const newItem: EvidenceItem = {
        id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title,
        content,
        category,
        x: 300 + Math.random() * 400 - pan.x,
        y: 200 + Math.random() * 300 - pan.y,
        connections: [],
        createdAt: Date.now(),
      }
      setItems((prev) => [...prev, newItem])
      scan()
      setShowAddModal(false)
    },
    [pan]
  )

  const selectedItem = items.find((i) => i.id === selectedId)

  // ─── Connection Lines SVG ───────────────────────────────────────

  const renderConnections = () => {
    const lines: JSX.Element[] = []
    const itemMap = new Map(items.map((i) => [i.id, i]))

    for (const item of items) {
      for (const targetId of item.connections) {
        const target = itemMap.get(targetId)
        if (!target) continue
        // Avoid duplicate lines (only draw if source id < target id)
        if (item.id > targetId) continue

        const x1 = item.x + 100 // center of card (200/2)
        const y1 = item.y + 75  // center of card (150/2)
        const x2 = target.x + 100
        const y2 = target.y + 75

        // Bezier control points
        const mx = (x1 + x2) / 2
        const my = (y1 + y2) / 2 - 30

        lines.push(
          <path
            key={`${item.id}-${targetId}`}
            d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
            fill="none"
            stroke="rgba(0,255,65,0.15)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            style={{
              filter: 'drop-shadow(0 0 3px rgba(0,255,65,0.2))',
            }}
          />
        )
      }
    }
    return lines
  }

  if (!hydrated) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <span className="font-mono text-xs text-green-500/40 animate-pulse">
          LOADING EVIDENCE...
        </span>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* ── Film Grain Overlay ──────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* ── Ambient Glow ───────────────────────────────────────────── */}
      <div
        className="absolute pointer-events-none z-0"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(0,255,65,0.03) 0%, transparent 70%)',
        }}
      />

      {/* ── Grid Background ────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,65,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,65,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: `${pan.x % 40}px ${pan.y % 40}px`,
        }}
      />

      {/* ── Board Canvas ───────────────────────────────────────────── */}
      <div
        ref={boardRef}
        className="absolute inset-0 z-10"
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        onPointerDown={handleBoardPointerDown}
        onPointerMove={handleBoardPointerMove}
        onPointerUp={handleBoardPointerUp}
        onPointerLeave={handleBoardPointerUp}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px)`,
            width: '3000px',
            height: '2000px',
            position: 'relative',
          }}
        >
          {/* SVG Connection Lines */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width="3000"
            height="2000"
            style={{ overflow: 'visible' }}
          >
            {renderConnections()}
          </svg>

          {/* Evidence Cards */}
          {items.map((item) => {
            const color = getCategoryColor(item.category)
            // Deterministic rotation from id
            const seed = item.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
            const rotation = ((seed % 7) - 3) * 1

            return (
              <motion.div
                key={item.id}
                drag
                dragMomentum={false}
                onDragEnd={(_, info) => handleDragEnd(item.id, info)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{
                  scale: 1.05,
                  zIndex: 40,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 12px ${color}20`,
                }}
                className="absolute cursor-grab active:cursor-grabbing"
                style={{
                  left: item.x,
                  top: item.y,
                  width: 200,
                  height: 150,
                  rotate: `${rotation}deg`,
                  zIndex: 20,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedId(item.id)
                }}
              >
                {/* Pin dot */}
                <div
                  className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full z-30"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${color}, ${color}80)`,
                    boxShadow: `0 0 6px ${color}50`,
                  }}
                />

                {/* Card body */}
                <div
                  className="w-full h-full rounded-sm overflow-hidden flex flex-col"
                  style={{
                    background: 'rgba(10,15,10,0.92)',
                    borderLeft: `3px solid ${color}`,
                    border: `1px solid rgba(0,255,65,0.08)`,
                    borderLeftWidth: '3px',
                    borderLeftColor: color,
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {/* Category badge */}
                  <div className="flex items-center justify-between px-2.5 pt-2 pb-1">
                    <span
                      className="font-mono text-xs uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-sm"
                      style={{
                        color,
                        background: `${color}10`,
                        border: `1px solid ${color}20`,
                      }}
                    >
                      {item.category}
                    </span>
                    <span className="font-mono text-xs text-green-500/30">
                      {new Date(item.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="px-2.5 pt-1">
                    <h4
                      className="font-mono text-xs font-bold leading-tight line-clamp-2"
                      style={{ color }}
                    >
                      {item.title}
                    </h4>
                  </div>

                  {/* Content preview */}
                  <div className="flex-1 px-2.5 pt-1.5 overflow-hidden">
                    <p className="font-mono text-xs leading-[13px] text-green-500/40 line-clamp-4">
                      {item.content}
                    </p>
                  </div>

                  {/* Mission source */}
                  {item.missionSlug && (
                    <div className="px-2.5 pb-1.5">
                      <span className="font-mono text-xs text-green-500/20 uppercase tracking-wider">
                        SRC: {item.missionSlug}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ── ADD EVIDENCE Button ─────────────────────────────────────── */}
      <button
        onClick={() => setShowAddModal(true)}
        className="absolute bottom-20 md:bottom-6 right-4 md:right-6 z-40 font-mono text-xs uppercase tracking-[0.15em] px-4 py-2.5 min-h-[44px] rounded-sm transition-all duration-200 hover:scale-105"
        style={{
          background: 'rgba(0,255,65,0.08)',
          border: '1px solid rgba(0,255,65,0.25)',
          color: '#00ff41',
          boxShadow: '0 0 12px rgba(0,255,65,0.1)',
        }}
      >
        + ADD EVIDENCE
      </button>

      {/* ── Evidence Count ──────────────────────────────────────────── */}
      <div className="absolute bottom-20 md:bottom-6 left-4 md:left-6 z-40 font-mono text-xs text-green-500/30 uppercase tracking-wider">
        {items.length} items on board
      </div>

      {/* ── Expanded Card Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {selectedId && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            onClick={() => setSelectedId(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Card detail */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'rgba(8,12,8,0.95)',
                border: `1px solid ${getCategoryColor(selectedItem.category)}30`,
                borderLeft: `4px solid ${getCategoryColor(selectedItem.category)}`,
                borderRadius: '4px',
              }}
            >
              <div className="p-6">
                {/* Category + date */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="font-mono text-xs uppercase tracking-[0.15em] px-2 py-1 rounded-sm"
                    style={{
                      color: getCategoryColor(selectedItem.category),
                      background: `${getCategoryColor(selectedItem.category)}10`,
                      border: `1px solid ${getCategoryColor(selectedItem.category)}20`,
                    }}
                  >
                    {selectedItem.category}
                  </span>
                  <span className="font-mono text-xs text-green-500/40">
                    {new Date(selectedItem.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="font-mono text-sm font-bold mb-4 leading-snug"
                  style={{ color: getCategoryColor(selectedItem.category) }}
                >
                  {selectedItem.title}
                </h3>

                {/* Full content */}
                <p className="font-mono text-xs leading-relaxed text-green-500/60 mb-4">
                  {selectedItem.content}
                </p>

                {/* Mission source */}
                {selectedItem.missionSlug && (
                  <div className="pt-3 border-t border-green-500/10">
                    <span className="font-mono text-xs text-green-500/30 uppercase tracking-wider">
                      SOURCE MISSION: {selectedItem.missionSlug}
                    </span>
                  </div>
                )}

                {/* Connections */}
                {selectedItem.connections.length > 0 && (
                  <div className="pt-3 mt-3 border-t border-green-500/10">
                    <span className="font-mono text-xs text-green-500/30 uppercase tracking-wider">
                      CONNECTED TO: {selectedItem.connections.length} item
                      {selectedItem.connections.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                {/* Close */}
                <button
                  onClick={() => setSelectedId(null)}
                  className="absolute top-3 right-3 font-mono text-xs text-green-500/40 hover:text-green-400 transition-colors w-8 h-8 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  X
                </button>

                {/* Delete */}
                <button
                  onClick={() => {
                    setItems((prev) => prev.filter((i) => i.id !== selectedId))
                    setSelectedId(null)
                  }}
                  className="mt-4 font-mono text-xs uppercase tracking-wider text-red-500/50 hover:text-red-400 transition-colors min-h-[44px]"
                >
                  REMOVE FROM BOARD
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Add Evidence Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <AddEvidenceModal
            onAdd={handleAddEvidence}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Add Evidence Modal ──────────────────────────────────────────────

interface AddModalProps {
  onAdd: (title: string, content: string, category: string) => void
  onClose: () => void
}

const CATEGORIES = ['pricing', 'surveillance', 'algorithm', 'greenwash', 'privacy', 'manipulation']

function AddEvidenceModal({ onAdd, onClose }: AddModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    onAdd(title.trim(), content.trim(), category)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.form
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md mx-4 p-6 rounded-sm"
        style={{
          background: 'rgba(8,12,8,0.95)',
          border: '1px solid rgba(0,255,65,0.15)',
        }}
      >
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-green-400 mb-5">
          New Evidence
        </h3>

        {/* Title */}
        <div className="mb-4">
          <label className="font-mono text-xs uppercase tracking-wider text-green-500/40 mb-1.5 block">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Evidence title..."
            className="w-full bg-transparent font-mono text-base md:text-xs text-green-400 px-3 py-2 min-h-[44px] rounded-sm outline-none placeholder:text-green-500/20"
            style={{
              border: '1px solid rgba(0,255,65,0.15)',
            }}
            autoFocus
          />
        </div>

        {/* Content */}
        <div className="mb-4">
          <label className="font-mono text-xs uppercase tracking-wider text-green-500/40 mb-1.5 block">
            Finding
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe the evidence..."
            rows={4}
            className="w-full bg-transparent font-mono text-base md:text-xs text-green-400 px-3 py-2 rounded-sm outline-none resize-none placeholder:text-green-500/20"
            style={{
              border: '1px solid rgba(0,255,65,0.15)',
            }}
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="font-mono text-xs uppercase tracking-wider text-green-500/40 mb-1.5 block">
            Category
          </label>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className="font-mono text-xs uppercase tracking-wider px-3 py-2 min-h-[44px] rounded-sm transition-all duration-150"
                style={{
                  color: category === cat ? getCategoryColor(cat) : 'rgba(0,255,65,0.3)',
                  background:
                    category === cat
                      ? `${getCategoryColor(cat)}15`
                      : 'transparent',
                  border: `1px solid ${
                    category === cat
                      ? `${getCategoryColor(cat)}40`
                      : 'rgba(0,255,65,0.08)'
                  }`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-xs uppercase tracking-wider text-green-500/30 hover:text-green-500/60 transition-colors min-h-[44px]"
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={!title.trim() || !content.trim()}
            className="font-mono text-xs uppercase tracking-[0.15em] px-4 py-2 min-h-[44px] rounded-sm transition-all duration-200 disabled:opacity-30"
            style={{
              background: 'rgba(0,255,65,0.1)',
              border: '1px solid rgba(0,255,65,0.3)',
              color: '#00ff41',
            }}
          >
            PIN TO BOARD
          </button>
        </div>

        {/* Close X */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 font-mono text-xs text-green-500/40 hover:text-green-400 transition-colors w-6 h-6 flex items-center justify-center"
        >
          X
        </button>
      </motion.form>
    </motion.div>
  )
}
