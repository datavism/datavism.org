// Hook for managing level progress
import { useState, useEffect, useCallback } from 'react'
import { progressService, LevelProgress } from '@/lib/services/progress'
import { createClient } from '@/lib/services/supabase/client'

interface UseProgressOptions {
  levelId: string
  autoSave?: boolean
  syncOnMount?: boolean
}

interface UseProgressReturn {
  progress: LevelProgress | null
  isLoading: boolean
  isSaving: boolean
  isLoggedIn: boolean
  saveProgress: (progress: Partial<LevelProgress>) => Promise<void>
  resetProgress: () => Promise<void>
  syncProgress: () => Promise<void>
}

export function useProgress({ levelId, autoSave = true, syncOnMount = true }: UseProgressOptions): UseProgressReturn {
  const [progress, setProgress] = useState<LevelProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  const supabase = createClient()
  
  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    }
    
    checkAuth()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session?.user)
      
      // Sync progress when user logs in
      if (event === 'SIGNED_IN' && syncOnMount) {
        progressService.syncLocalToCloud()
      }
    })
    
    return () => subscription.unsubscribe()
  }, [supabase, syncOnMount])
  
  // Load progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      setIsLoading(true)
      try {
        const savedProgress = await progressService.loadProgress(levelId)
        if (savedProgress) {
          setProgress(savedProgress)
        } else {
          // Initialize with default progress
          setProgress({
            levelId,
            completedChallenges: [],
            totalXp: 0,
            currentChallenge: 0
          })
        }
      } catch (error) {
        console.error('Error loading progress:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadProgress()
  }, [levelId])
  
  // Save progress
  const saveProgress = useCallback(async (updates: Partial<LevelProgress>) => {
    if (!progress) return
    
    const updatedProgress: LevelProgress = {
      ...progress,
      ...updates
    }
    
    setProgress(updatedProgress)
    
    if (autoSave) {
      setIsSaving(true)
      try {
        await progressService.saveProgress(levelId, updatedProgress)
      } catch (error) {
        console.error('Error saving progress:', error)
      } finally {
        setIsSaving(false)
      }
    }
  }, [progress, levelId, autoSave])
  
  // Reset progress
  const resetProgress = useCallback(async () => {
    const emptyProgress: LevelProgress = {
      levelId,
      completedChallenges: [],
      totalXp: 0,
      currentChallenge: 0
    }
    
    setProgress(emptyProgress)
    setIsSaving(true)
    
    try {
      await progressService.saveProgress(levelId, emptyProgress)
      progressService.clearLocalProgress(levelId)
    } catch (error) {
      console.error('Error resetting progress:', error)
    } finally {
      setIsSaving(false)
    }
  }, [levelId])
  
  // Sync progress manually
  const syncProgress = useCallback(async () => {
    setIsSaving(true)
    try {
      await progressService.syncLocalToCloud()
      // Reload progress after sync
      const savedProgress = await progressService.loadProgress(levelId)
      if (savedProgress) {
        setProgress(savedProgress)
      }
    } catch (error) {
      console.error('Error syncing progress:', error)
    } finally {
      setIsSaving(false)
    }
  }, [levelId])
  
  return {
    progress,
    isLoading,
    isSaving,
    isLoggedIn,
    saveProgress,
    resetProgress,
    syncProgress
  }
}