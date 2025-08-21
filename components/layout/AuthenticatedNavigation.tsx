'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Trophy,
  Users,
  Search,
  Bell
} from 'lucide-react'
import { createClient } from '@/lib/services/supabase/client'
import { useRouter } from 'next/navigation'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthenticatedNavigationProps {
  user: SupabaseUser
  profile: Profile | null
}

export function AuthenticatedNavigation({ user, profile }: AuthenticatedNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const navItems = [
    { href: '/dashboard', label: 'HQ', icon: User },
    { href: '/bootcamp', label: 'BOOTCAMP', icon: Trophy },
    { href: '/community', label: 'SQUADS', icon: Users },
    { href: '/investigations', label: 'OPS', icon: Search },
  ]

  return (
    <nav className="border-b border-green-400/30 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <img 
              src="/brand/svg/g3-neon-ghost-icon-dark.svg" 
              alt="DATAVISM Ghost Logo" 
              className="w-8 h-8"
            />
            <span className="text-xl font-bold text-green-400">DATAVISM</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 text-green-400 hover:text-yellow-400 transition-colors duration-300 font-mono tracking-wider"
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {/* Notifications */}
            <button className="text-green-400 hover:text-yellow-400 transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 text-green-400 hover:text-yellow-400 transition-colors"
              >
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-black font-bold text-sm">
                  {profile?.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="text-sm font-mono">{profile?.username || 'Agent'}</div>
                  <div className="text-xs text-green-300">{profile?.reputation || 'Curious Citizen'}</div>
                </div>
              </button>

              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 border border-green-400 bg-black/95 backdrop-blur-sm"
                >
                  <div className="p-2">
                    <div className="border-b border-green-400/30 pb-2 mb-2">
                      <div className="text-yellow-400 font-mono text-sm">
                        Level {profile?.level || 1} • {profile?.xp || 0} XP
                      </div>
                    </div>
                    
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-green-400 hover:bg-green-950/20 transition-colors"
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-3 py-2 text-green-400 hover:bg-green-950/20 transition-colors"
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-950/20 transition-colors w-full text-left"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-green-400 hover:text-yellow-400 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4"
          >
            <div className="flex flex-col gap-3">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-green-400 hover:text-yellow-400 transition-colors font-mono tracking-wider py-2"
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                )
              })}
              
              <div className="border-t border-green-400/30 pt-3 mt-3">
                <div className="text-yellow-400 font-mono text-sm mb-2">
                  {profile?.username || 'Agent'} • Level {profile?.level || 1}
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-red-400 font-mono"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}