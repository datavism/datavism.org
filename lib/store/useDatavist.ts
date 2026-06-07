import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Types ──────────────────────────────────────────────────────────

export type UserRole = 'warrior' | 'rebel' | 'artist' | 'explorer'
export type UserMotivation = 'truth' | 'justice' | 'freedom' | 'impact'

export interface DatavistProfile {
  codename: string
  role: UserRole
  motivation: UserMotivation
  liberationCode?: string
  awakenedAt: string
  influenceScore: number
  missionsCompleted: string[]
  activeMissionId?: string
  currentChapter: number
  chaptersCompleted: string[]
}

interface DatavistStore {
  // Identity
  profile: DatavistProfile | null

  // UI state
  soundEnabled: boolean

  // Actions
  setProfile: (profile: DatavistProfile) => void
  updateProfile: (updates: Partial<DatavistProfile>) => void
  startMission: (missionId: string) => void
  completeMission: (missionId: string, influence: number) => void
  completeChapter: (chapterId: string) => void
  setSoundEnabled: (enabled: boolean) => void
  reset: () => void

  // Computed
  isAwakened: () => boolean
}

export const useDatavist = create<DatavistStore>()(
  persist(
    (set, get) => ({
      profile: null,
      soundEnabled: true,

      setProfile: (profile) => set({ profile }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),

      startMission: (missionId) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, activeMissionId: missionId }
            : null,
        })),

      completeMission: (missionId, influence) =>
        set((state) => {
          if (!state.profile) return state
          return {
            profile: {
              ...state.profile,
              influenceScore: state.profile.influenceScore + influence,
              missionsCompleted: [...state.profile.missionsCompleted, missionId],
              activeMissionId: undefined,
            },
          }
        }),

      completeChapter: (chapterId) =>
        set((state) => {
          if (!state.profile) return state
          if (state.profile.chaptersCompleted.includes(chapterId)) return state
          return {
            profile: {
              ...state.profile,
              chaptersCompleted: [...state.profile.chaptersCompleted, chapterId],
              currentChapter: Math.min(state.profile.currentChapter + 1, 5),
            },
          }
        }),

      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

      reset: () => set({ profile: null }),

      isAwakened: () => !!get().profile,
    }),
    {
      name: 'datavism-datavist',
      // Migrate existing profiles that lack new chapter fields
      merge: (persisted, current) => {
        const state = persisted as DatavistStore
        if (state?.profile) {
          if (state.profile.currentChapter === undefined) {
            state.profile.currentChapter = 1
          }
          if (!Array.isArray(state.profile.chaptersCompleted)) {
            state.profile.chaptersCompleted = []
          }
        }
        return { ...current, ...state }
      },
    }
  )
)

// ─── Role & Motivation Configs ──────────────────────────────────────

export const ROLE_CONFIG = {
  warrior: {
    title: 'Data Warrior',
    icon: '⚔',
    color: 'cyan',
    colorHex: '#00e5ff',
    description: 'Tactical analyst. You find the patterns that expose the truth.',
    agentVoice: 'Precision-focused. Data-driven. Every number tells a story.',
  },
  rebel: {
    title: 'Code Rebel',
    icon: '⌨',
    color: 'green',
    colorHex: '#00ff41',
    description: 'Systems hacker. You build the tools that fight back.',
    agentVoice: 'Builder energy. Code is your weapon of liberation.',
  },
  artist: {
    title: 'Viz Artist',
    icon: '◉',
    color: 'purple',
    colorHex: '#b388ff',
    description: 'Visual intelligence. You make injustice impossible to ignore.',
    agentVoice: 'Creative strategist. Every dataset has a story waiting to be told.',
  },
  explorer: {
    title: 'Truth Explorer',
    icon: '◎',
    color: 'yellow',
    colorHex: '#ffd600',
    description: 'Field investigator. You follow the trail wherever it leads.',
    agentVoice: 'Relentless curiosity. Something always doesn\'t add up.',
  },
} as const

export const MOTIVATION_CONFIG = {
  truth: {
    title: 'Truth',
    description: 'Uncover what they hide.',
    icon: '◈',
  },
  justice: {
    title: 'Justice',
    description: 'Hold the powerful accountable.',
    icon: '⚖',
  },
  freedom: {
    title: 'Freedom',
    description: 'Protect privacy and autonomy.',
    icon: '◇',
  },
  impact: {
    title: 'Impact',
    description: 'Create measurable change.',
    icon: '◆',
  },
} as const
