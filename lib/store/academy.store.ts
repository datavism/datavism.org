import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserProgress {
  xp: number
  level: number
  completedChallenges: string[]
  currentStreak: number
  lastActiveDate: string
  achievements: string[]
  totalTimeSpent: number // in minutes
}

interface Challenge {
  id: string
  levelId: number
  code: string
  xpEarned: number
  completedAt: string
}

interface AcademyState {
  userProgress: UserProgress
  challenges: Challenge[]
  
  // Actions
  addXP: (amount: number) => Promise<void>
  completeChallenge: (challengeId: string, levelId: number, code: string, xpEarned: number) => Promise<void>
  updateStreak: () => void
  addAchievement: (achievementId: string) => void
  resetProgress: () => void
}

const initialUserProgress: UserProgress = {
  xp: 0,
  level: 1,
  completedChallenges: [],
  currentStreak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  achievements: [],
  totalTimeSpent: 0
}

export const useAcademyStore = create<AcademyState>()(
  persist(
    (set, get) => ({
      userProgress: initialUserProgress,
      challenges: [],
      
      addXP: async (amount: number) => {
        set((state) => {
          const newXP = state.userProgress.xp + amount
          const newLevel = Math.floor(newXP / 1000) + 1
          
          return {
            userProgress: {
              ...state.userProgress,
              xp: newXP,
              level: newLevel,
              lastActiveDate: new Date().toISOString().split('T')[0]
            }
          }
        })
      },
      
      completeChallenge: async (challengeId: string, levelId: number, code: string, xpEarned: number) => {
        set((state) => {
          const isAlreadyCompleted = state.userProgress.completedChallenges.includes(challengeId)
          
          if (isAlreadyCompleted) {
            return state // Don't update if already completed
          }
          
          const newChallenge: Challenge = {
            id: challengeId,
            levelId,
            code,
            xpEarned,
            completedAt: new Date().toISOString()
          }
          
          const newXP = state.userProgress.xp + xpEarned
          const newLevel = Math.floor(newXP / 1000) + 1
          
          // Check for achievements
          const newAchievements = [...state.userProgress.achievements]
          const completedCount = state.userProgress.completedChallenges.length + 1
          
          if (completedCount === 1 && !newAchievements.includes('first_challenge')) {
            newAchievements.push('first_challenge')
          }
          if (completedCount === 5 && !newAchievements.includes('mission_veteran')) {
            newAchievements.push('mission_veteran')
          }
          if (newXP >= 100 && !newAchievements.includes('xp_hunter')) {
            newAchievements.push('xp_hunter')
          }
          
          return {
            userProgress: {
              ...state.userProgress,
              xp: newXP,
              level: newLevel,
              completedChallenges: [...state.userProgress.completedChallenges, challengeId],
              achievements: newAchievements,
              lastActiveDate: new Date().toISOString().split('T')[0]
            },
            challenges: [...state.challenges, newChallenge]
          }
        })
      },
      
      updateStreak: () => {
        set((state) => {
          const today = new Date().toISOString().split('T')[0]
          const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          
          let newStreak = state.userProgress.currentStreak
          
          if (state.userProgress.lastActiveDate === yesterday) {
            newStreak += 1
          } else if (state.userProgress.lastActiveDate !== today) {
            newStreak = 1
          }
          
          return {
            userProgress: {
              ...state.userProgress,
              currentStreak: newStreak,
              lastActiveDate: today
            }
          }
        })
      },
      
      addAchievement: (achievementId: string) => {
        set((state) => {
          if (state.userProgress.achievements.includes(achievementId)) {
            return state
          }
          
          return {
            userProgress: {
              ...state.userProgress,
              achievements: [...state.userProgress.achievements, achievementId]
            }
          }
        })
      },
      
      resetProgress: () => {
        set({
          userProgress: initialUserProgress,
          challenges: []
        })
      }
    }),
    {
      name: 'datavism-academy-storage',
      partialize: (state) => ({
        userProgress: state.userProgress,
        challenges: state.challenges
      })
    }
  )
)