import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'warrior' | 'rebel' | 'artist' | 'explorer'
export type UserMotivation = 'truth' | 'justice' | 'freedom' | 'impact'

interface ResistanceProfile {
  name: string
  role: UserRole
  motivation: UserMotivation
  awakeningCompletedAt: string
  level: number
  xp: number
  missionsCompleted: string[]
  currentMission?: string
}

interface ResistanceStore {
  profile: ResistanceProfile | null
  setProfile: (profile: ResistanceProfile) => void
  updateProfile: (updates: Partial<ResistanceProfile>) => void
  completeMission: (missionId: string, xp: number) => void
  reset: () => void
  isAwakened: () => boolean
}

export const useResistance = create<ResistanceStore>()(
  persist(
    (set, get) => ({
      profile: null,

      setProfile: (profile) => set({ profile }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),

      completeMission: (missionId, xp) =>
        set((state) => {
          if (!state.profile) return state

          const newXp = state.profile.xp + xp
          const newLevel = Math.floor(newXp / 1000) + 1

          return {
            profile: {
              ...state.profile,
              xp: newXp,
              level: newLevel,
              missionsCompleted: [...state.profile.missionsCompleted, missionId],
            },
          }
        }),

      reset: () => set({ profile: null }),

      isAwakened: () => !!get().profile,
    }),
    {
      name: 'datavism-resistance',
    }
  )
)

// Role configurations
export const ROLE_CONFIG = {
  warrior: {
    title: 'Data Warrior',
    icon: '📊',
    color: 'cyan',
    description: 'Master of patterns and statistical analysis',
    primarySkills: ['Python', 'Pandas', 'Statistics', 'NumPy'],
    firstMission: 'Detect manipulation patterns in social media data',
  },
  rebel: {
    title: 'Code Rebel',
    icon: '💻',
    color: 'green',
    description: 'Builder of tools and automation systems',
    primarySkills: ['JavaScript', 'APIs', 'Automation', 'Web Scraping'],
    firstMission: 'Build a price tracking bot to expose dynamic pricing',
  },
  artist: {
    title: 'Viz Artist',
    icon: '🎨',
    color: 'purple',
    description: 'Storyteller through data visualization',
    primarySkills: ['D3.js', 'Design', 'Storytelling', 'React'],
    firstMission: 'Create an interactive visualization of filter bubbles',
  },
  explorer: {
    title: 'Truth Explorer',
    icon: '🔍',
    color: 'yellow',
    description: 'Investigator and pattern connector',
    primarySkills: ['OSINT', 'Research', 'Critical Thinking', 'Documentation'],
    firstMission: 'Investigate a case of corporate greenwashing',
  },
} as const

// Motivation configurations
export const MOTIVATION_CONFIG = {
  truth: {
    title: 'Truth Seeker',
    description: 'Driven by the need to uncover reality',
    bonus: 'Enhanced investigation rewards',
  },
  justice: {
    title: 'Justice Fighter',
    description: 'Motivated by accountability and fairness',
    bonus: 'Bonus XP for exposing powerful actors',
  },
  freedom: {
    title: 'Freedom Defender',
    description: 'Protecting privacy and autonomy',
    bonus: 'Special access to privacy missions',
  },
  impact: {
    title: 'Impact Maker',
    description: 'Focused on creating lasting change',
    bonus: 'Community collaboration bonuses',
  },
} as const
