import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/services/supabase/client'

interface UserProgress {
  xp: number
  level: number
  reputation: string
  completedChallenges: string[]
  currentWeek: number
  achievements: string[]
}

interface AcademyState {
  userProgress: UserProgress
  loading: boolean
  addXP: (amount: number) => Promise<void>
  completeChallenge: (challengeId: string, weekId: number, code?: string, xpEarned?: number) => Promise<void>
  unlockAchievement: (achievementId: string) => void
  resetProgress: () => void
  syncWithDatabase: (userId: string) => Promise<void>
}

const calculateLevel = (xp: number) => {
  if (xp >= 5000) return 12
  if (xp >= 3000) return 10
  if (xp >= 1500) return 7
  if (xp >= 500) return 4
  return Math.floor(xp / 100) + 1
}

const calculateReputation = (xp: number) => {
  if (xp >= 5000) return 'Ghost'
  if (xp >= 3000) return 'Revolutionary'
  if (xp >= 1500) return 'Investigator'
  if (xp >= 500) return 'Data Analyst'
  if (xp >= 50) return 'Script Kiddie'
  return 'Curious Citizen'
}

export const useAcademyStore = create<AcademyState>()(
  persist(
    (set, get) => ({
      userProgress: {
        xp: 0,
        level: 1,
        reputation: 'Curious Citizen',
        completedChallenges: [],
        currentWeek: 1,
        achievements: []
      },
      loading: false,
      
      addXP: async (amount) => {
        const state = get()
        const newXP = state.userProgress.xp + amount
        const newLevel = calculateLevel(newXP)
        const newReputation = calculateReputation(newXP)
        
        set({
          userProgress: {
            ...state.userProgress,
            xp: newXP,
            level: newLevel,
            reputation: newReputation
          }
        })
        
        // Update database
        try {
          const supabase = createClient()
          const { data: { user } } = await supabase.auth.getUser()
          
          if (user) {
            await supabase
              .from('profiles')
              .update({
                xp: newXP,
                level: newLevel,
                reputation: newReputation
              })
              .eq('id', user.id)
          }
        } catch (error) {
          console.error('Failed to update XP in database:', error)
        }
      },
      
      completeChallenge: async (challengeId, weekId, code, xpEarned = 0) => {
        const state = get()
        const fullChallengeId = `week${weekId}-${challengeId}`
        
        if (state.userProgress.completedChallenges.includes(fullChallengeId)) {
          return // Already completed
        }
        
        set({
          userProgress: {
            ...state.userProgress,
            completedChallenges: [...state.userProgress.completedChallenges, fullChallengeId]
          }
        })
        
        // Save to database
        try {
          const supabase = createClient()
          const { data: { user } } = await supabase.auth.getUser()
          
          if (user) {
            await supabase
              .from('progress')
              .upsert({
                user_id: user.id,
                week_id: weekId,
                challenge_id: challengeId,
                completed: true,
                code: code || null,
                xp_earned: xpEarned,
                completed_at: new Date().toISOString()
              })
          }
        } catch (error) {
          console.error('Failed to save challenge progress:', error)
        }
        
        // Add XP if specified
        if (xpEarned > 0) {
          await get().addXP(xpEarned)
        }
      },
      
      unlockAchievement: (achievementId) => set((state) => ({
        userProgress: {
          ...state.userProgress,
          achievements: [...state.userProgress.achievements, achievementId]
        }
      })),
      
      syncWithDatabase: async (userId) => {
        set({ loading: true })
        
        try {
          const supabase = createClient()
          
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()
          
          // Fetch user progress
          const { data: progress } = await supabase
            .from('progress')
            .select('*')
            .eq('user_id', userId)
            .eq('completed', true)
          
          if (profile) {
            const completedChallenges = progress?.map(p => `week${p.week_id}-${p.challenge_id}`) || []
            
            set({
              userProgress: {
                xp: profile.xp,
                level: profile.level,
                reputation: profile.reputation,
                completedChallenges,
                currentWeek: Math.floor(completedChallenges.length / 5) + 1,
                achievements: profile.achievements || []
              }
            })
          }
        } catch (error) {
          console.error('Failed to sync with database:', error)
        } finally {
          set({ loading: false })
        }
      },
      
      resetProgress: () => set({
        userProgress: {
          xp: 0,
          level: 1,
          reputation: 'Curious Citizen',
          completedChallenges: [],
          currentWeek: 1,
          achievements: []
        }
      })
    }),
    {
      name: 'datavism-academy-progress'
    }
  )
)