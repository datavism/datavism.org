'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { success as playSuccess, scan, typing } from '@/lib/audio/procedural'
import type { Mission } from '@/lib/data/missions'

// ─── Types ──────────────────────────────────────────────────────────

interface StickyNote {
  id: string
  text: string
  x: number
  y: number
  color: string
}

interface GenericInvestigationProps {
  mission: Mission
  onComplete?: () => void
  onEvidenceAdd?: (evidence: { type: string; data: unknown }) => void
}

const NOTE_COLORS = [
  'from-yellow-400/90 to-yellow-500/90',
  'from-green-400/90 to-green-500/90',
  'from-blue-400/90 to-blue-500/90',
  'from-pink-400/90 to-pink-500/90',
  'from-purple-400/90 to-purple-500/90',
  'from-orange-400/90 to-orange-500/90',
]

// ─── Main Component ─────────────────────────────────────────────────

export function GenericInvestigation({ mission, onComplete, onEvidenceAdd }: GenericInvestigationProps) {
  const [completedObjectives, setCompletedObjectives] = useState<Set<number>>(new Set())
  const [notes, setNotes] = useState<StickyNote[]>([])
  const [newNoteText, setNewNoteText] = useState('')
  const [showAddNote, setShowAddNote] = useState(false)
  const [dragging, setDragging] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const boardRef = useRef<HTMLDivElement>(null)

  // Toggle objective completion
  const toggleObjective = useCallback((index: number) => {
    setCompletedObjectives(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
        playSuccess()
      }
      return next
    })
  }, [])

  // Add a sticky note to the board
  const handleAddNote = useCallback(() => {
    if (!newNoteText.trim()) return

    const boardRect = boardRef.current?.getBoundingClientRect()
    const maxX = boardRect ? boardRect.width - 180 : 400
    const maxY = boardRect ? boardRect.height - 120 : 300

    const note: StickyNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text: newNoteText.trim(),
      x: 40 + Math.random() * Math.max(maxX - 40, 100),
      y: 40 + Math.random() * Math.max(maxY - 40, 100),
      color: NOTE_COLORS[notes.length % NOTE_COLORS.length],
    }

    setNotes(prev => [...prev, note])
    setNewNoteText('')
    setShowAddNote(false)
  }, [newNoteText, notes.length])

  // Remove a note
  const handleRemoveNote = useCallback((noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId))
  }, [])

  // Build evidence package
  const handleAddEvidence = useCallback(() => {
    playSuccess()
    onEvidenceAdd?.({
      type: 'investigation-workspace',
      data: {
        mission: mission.title,
        objectivesCompleted: completedObjectives.size,
        totalObjectives: mission.objectives.length,
        notes: notes.map(n => n.text),
      },
    })
  }, [mission, completedObjectives, notes, onEvidenceAdd])

  const allObjectivesDone = completedObjectives.size === mission.objectives.length

  return (
    <div className="h-full flex flex-col lg:flex-row">
      {/* ── Left Panel: Mission Brief ─────────────────────────────── */}
      <div className="flex-shrink-0 w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-green-500/10 overflow-y-auto">
        {/* Mobile toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden w-full flex items-center justify-between px-4 py-3 border-b border-green-500/10 min-h-[44px]"
        >
          <span className="font-mono text-xs text-green-400 uppercase tracking-wider">Mission Brief</span>
          <span className="font-mono text-xs text-green-500/50">{sidebarOpen ? '\u25B2' : '\u25BC'}</span>
        </button>

        <div className={`p-4 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
          {/* Mission header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                mission.difficulty === 'recruit'
                  ? 'text-green-400 border-green-500/30'
                  : mission.difficulty === 'operative'
                    ? 'text-yellow-400 border-yellow-500/30'
                    : 'text-red-400 border-red-500/30'
              }`}>
                {mission.difficulty}
              </span>
              <span className="text-xs font-mono text-green-500/30 uppercase tracking-wider">
                {mission.category}
              </span>
            </div>
            <h2 className="font-mono text-sm text-green-400 font-bold">{mission.title}</h2>
          </div>

          {/* Briefing excerpt */}
          <div className="mb-5 border border-green-500/10 rounded p-3 bg-green-950/10">
            <h3 className="font-mono text-xs text-green-500/50 uppercase tracking-widest mb-2">
              Briefing
            </h3>
            <p className="font-mono text-xs text-green-300/60 leading-relaxed line-clamp-6">
              {mission.briefing.split('\n').slice(1, 3).join(' ').trim()}
            </p>
          </div>

          {/* Objectives checklist */}
          <div className="mb-5">
            <h3 className="font-mono text-xs text-green-500/50 uppercase tracking-widest mb-2">
              Objectives ({completedObjectives.size}/{mission.objectives.length})
            </h3>
            <div className="space-y-1.5">
              {mission.objectives.map((obj, i) => {
                const done = completedObjectives.has(i)
                return (
                  <motion.button
                    key={i}
                    onClick={() => toggleObjective(i)}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left flex items-start gap-2 p-2 rounded transition-colors min-h-[44px]
                      ${done
                        ? 'bg-green-500/10 border border-green-500/20'
                        : 'border border-transparent hover:border-green-500/10 hover:bg-green-500/5'
                      }`}
                  >
                    <span className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center mt-0.5 text-xs
                      ${done
                        ? 'border-green-400 bg-green-500/20 text-green-400'
                        : 'border-green-500/30 text-transparent'
                      }`}
                    >
                      {done ? '\u2713' : ''}
                    </span>
                    <span className={`font-mono text-xs leading-relaxed ${
                      done ? 'text-green-400/70 line-through' : 'text-green-300/60'
                    }`}>
                      {obj}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Data sources */}
          <div className="mb-5">
            <h3 className="font-mono text-xs text-green-500/50 uppercase tracking-widest mb-2">
              Data Sources
            </h3>
            <div className="space-y-1">
              {mission.dataSources.map((src, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-green-500/30 font-mono text-xs mt-px">&#9670;</span>
                  <span className="font-mono text-xs text-green-500/40">{src}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {allObjectivesDone && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddEvidence}
                className="w-full border border-green-500/40 text-green-400 font-mono text-xs py-2.5 rounded
                  hover:bg-green-500/10 transition-colors tracking-wider uppercase min-h-[44px]"
              >
                &#9670; Compile Evidence
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* ── Center: Evidence Board ────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Board toolbar */}
        <div className="flex-shrink-0 border-b border-green-500/10 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-green-500/50 uppercase tracking-wider">
              Evidence Board
            </span>
            <span className="font-mono text-xs text-green-500/30">
              ({notes.length} notes)
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddNote(!showAddNote)}
            className="border border-green-500/20 text-green-500/60 hover:text-green-400 hover:border-green-500/40
              font-mono text-xs px-3 py-2 rounded transition-colors uppercase tracking-wider min-h-[44px]"
          >
            + Add Note
          </motion.button>
        </div>

        {/* Add note input */}
        <AnimatePresence>
          {showAddNote && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex-shrink-0 overflow-hidden border-b border-green-500/10"
            >
              <div className="p-3 flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                  placeholder="Type your finding or observation..."
                  className="flex-1 bg-black/40 border border-green-500/20 rounded px-3 py-2 font-mono text-xs
                    text-green-300 placeholder:text-green-500/20 focus:outline-none focus:border-green-500/40"
                  autoFocus
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNoteText.trim()}
                  className="border border-green-500/30 text-green-400 font-mono text-xs px-4 py-2 rounded
                    hover:bg-green-500/10 transition-colors uppercase tracking-wider disabled:opacity-30 min-h-[44px]"
                >
                  Pin
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile: Simple vertical note list */}
        <div className="lg:hidden flex-1 overflow-y-auto px-4 py-3">
          {notes.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="font-mono text-green-500/15 text-4xl mb-3">&#9638;</div>
                <p className="font-mono text-xs text-green-500/20 max-w-xs">
                  Your evidence board is empty. Add notes, findings, and observations
                  as you investigate. Ask GHOST for help in the sidebar.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {notes.map(note => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-start gap-2"
                >
                  <div className={`flex-1 bg-gradient-to-br ${note.color} rounded shadow-lg p-3`}>
                    <p className="text-gray-900 text-xs leading-relaxed font-sans font-medium break-words">
                      {note.text}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveNote(note.id)}
                    className="flex-shrink-0 w-8 h-8 bg-gray-800 border border-gray-600 rounded-full
                      flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600
                      transition-colors text-xs min-h-[44px] min-w-[44px]"
                  >
                    &#10005;
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop: Draggable board */}
        <div
          ref={boardRef}
          className="hidden lg:block flex-1 relative overflow-hidden"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(0,255,65,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
        >
          {/* Empty state */}
          {notes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="font-mono text-green-500/15 text-4xl mb-3">&#9638;</div>
                <p className="font-mono text-xs text-green-500/20 max-w-xs">
                  Your evidence board is empty. Add notes, findings, and observations
                  as you investigate. Ask GHOST for help in the sidebar.
                </p>
              </div>
            </div>
          )}

          {/* Sticky notes */}
          <AnimatePresence>
            {notes.map(note => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: (Math.random() - 0.5) * 6,
                  x: note.x,
                  y: note.y,
                }}
                exit={{ opacity: 0, scale: 0.3 }}
                drag
                dragMomentum={false}
                onDragStart={() => setDragging(note.id)}
                onDragEnd={() => setDragging(null)}
                whileDrag={{ scale: 1.08, zIndex: 50 }}
                className={`absolute top-0 left-0 w-40 cursor-grab active:cursor-grabbing ${
                  dragging === note.id ? 'z-50' : 'z-10'
                }`}
                style={{ touchAction: 'none' }}
              >
                <div className={`bg-gradient-to-br ${note.color} rounded shadow-lg p-3 relative`}>
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveNote(note.id)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-800 border border-gray-600 rounded-full
                      flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600
                      transition-colors text-xs shadow"
                  >
                    &#10005;
                  </button>

                  {/* Pin indicator */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full
                    border-2 border-red-700 shadow-sm" />

                  <p className="text-gray-900 text-xs leading-relaxed font-sans font-medium break-words pt-1">
                    {note.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Connection lines hint (desktop only) */}
          {notes.length >= 2 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              {notes.slice(0, -1).map((note, i) => {
                const next = notes[i + 1]
                return (
                  <line
                    key={`${note.id}-${next.id}`}
                    x1={note.x + 80}
                    y1={note.y + 40}
                    x2={next.x + 80}
                    y2={next.y + 40}
                    stroke="rgba(0,255,65,0.3)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                )
              })}
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}
