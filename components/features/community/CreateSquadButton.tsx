'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Users } from 'lucide-react'
import { createClient } from '@/lib/services/supabase/client'
import { useRouter } from 'next/navigation'

export function CreateSquadButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'learning' as 'investigation' | 'learning' | 'strike'
  })

  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create squad
      const { data: squad, error: squadError } = await supabase
        .from('squads')
        .insert({
          name: formData.name,
          description: formData.description,
          type: formData.type,
          leader_id: user.id,
          member_count: 1
        })
        .select()
        .single()

      if (squadError) throw squadError

      // Add user as member
      const { error: memberError } = await supabase
        .from('squad_members')
        .insert({
          squad_id: squad.id,
          user_id: user.id,
          role: 'leader'
        })

      if (memberError) throw memberError

      setIsOpen(false)
      setFormData({ name: '', description: '', type: 'learning' })
      router.refresh()
    } catch (error: any) {
      console.error('Error creating squad:', error)
      alert('Failed to create squad: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all font-bold"
      >
        <Plus size={20} />
        CREATE SQUAD
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black border-2 border-green-400 p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-green-400">CREATE NEW SQUAD</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-green-400 hover:text-red-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-green-400 text-sm font-mono mb-2">
                    SQUAD NAME
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 bg-transparent border border-green-400 text-green-400 font-mono outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Data Liberation Front"
                    required
                  />
                </div>

                <div>
                  <label className="block text-green-400 text-sm font-mono mb-2">
                    SQUAD TYPE
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full p-3 bg-black border border-green-400 text-green-400 font-mono outline-none focus:border-yellow-400 transition-colors"
                  >
                    <option value="learning">🎓 Learning Squad</option>
                    <option value="investigation">🔍 Investigation Squad</option>
                    <option value="strike">⚡ Strike Squad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-green-400 text-sm font-mono mb-2">
                    MISSION DESCRIPTION
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 bg-transparent border border-green-400 text-green-400 font-mono outline-none focus:border-yellow-400 transition-colors resize-none"
                    rows={3}
                    placeholder="Describe your squad's mission and goals..."
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-3 border border-red-400 text-red-400 hover:bg-red-400 hover:text-black transition-all font-bold"
                  >
                    CANCEL
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all font-bold disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        CREATING...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Users size={20} />
                        CREATE
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}