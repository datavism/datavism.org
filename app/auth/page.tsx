'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Terminal, Zap, Lock } from 'lucide-react'
import { createClient } from '@/lib/services/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        router.push('/dashboard')
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            }
          }
        })
        
        if (error) throw error
        
        if (data.user) {
          // Create profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              username: username,
              reputation: 'Curious Citizen',
              xp: 0,
              level: 1,
              investigations_count: 0,
              achievements: []
            })
          
          if (profileError) throw profileError
        }
        
        setError('Check your email for verification link!')
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-400 flex items-center justify-center p-4">
      {/* CRT Effect */}
      <div className="crt-overlay" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mb-4"
          >
            <Terminal size={64} className="mx-auto text-red-400" />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-2 glitch-text text-red-400">
            {mode === 'login' ? 'SYSTEM ACCESS' : 'RECRUIT VERIFICATION'}
          </h1>
          
          <p className="text-green-300 text-sm">
            {mode === 'login' 
              ? 'Enter credentials to access the Data Underground'
              : 'Join the revolution against corporate corruption'
            }
          </p>
        </div>

        {/* Auth Form */}
        <div className="border-2 border-green-400 p-6 bg-black/90 relative">
          <div className="absolute top-2 right-2 flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-green-400 text-sm font-mono mb-2">
                  OPERATIVE CALLSIGN
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 bg-transparent border border-green-400 text-green-400 font-mono outline-none focus:border-yellow-400 transition-colors"
                  placeholder="Enter unique username..."
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-green-400 text-sm font-mono mb-2">
                EMAIL PROTOCOL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-transparent border border-green-400 text-green-400 font-mono outline-none focus:border-yellow-400 transition-colors"
                placeholder="operative@datavism.org"
                required
              />
            </div>

            <div>
              <label className="block text-green-400 text-sm font-mono mb-2">
                ACCESS CODE
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-transparent border border-green-400 text-green-400 font-mono outline-none focus:border-yellow-400 transition-colors pr-10"
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-green-400 hover:text-yellow-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="border border-red-400 p-3 bg-red-950/20">
                <p className="text-red-400 text-sm font-mono">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all font-bold font-mono disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  {mode === 'login' ? 'ACCESSING...' : 'VERIFYING...'}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {mode === 'login' ? <Lock size={20} /> : <Zap size={20} />}
                  {mode === 'login' ? 'ACCESS SYSTEM' : 'JOIN REVOLUTION'}
                </span>
              )}
            </button>
          </form>

          {/* Mode Switch */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-cyan-400 hover:text-cyan-300 text-sm font-mono"
            >
              {mode === 'login' 
                ? "New operative? Create account →" 
                : "Already registered? Access system →"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-green-300/50">
          <p className="mb-1">🔒 Connection encrypted via AES-256</p>
          <p>Your data is yours. We just help you weaponize it.</p>
        </div>
      </motion.div>
    </div>
  )
}