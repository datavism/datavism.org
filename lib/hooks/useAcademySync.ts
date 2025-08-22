import { useEffect, useState } from 'react'
import { useAcademyStore } from '@/lib/store/academy.store'

export function useAcademySync() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { userProgress, updateStreak } = useAcademyStore()
  
  // Update streak on mount
  useEffect(() => {
    updateStreak()
  }, [updateStreak])
  
  // Sync to server (placeholder for now)
  const syncToServer = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // In the future, sync to Supabase or your backend
      // await supabase.from('user_progress').upsert(userProgress)
      
      // For now, just simulate a sync
      await new Promise(resolve => setTimeout(resolve, 500))
      
    } catch (err) {
      setError('Failed to sync progress')
      console.error('Sync error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  // Auto-sync every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (userProgress.xp > 0) {
        syncToServer()
      }
    }, 5 * 60 * 1000) // 5 minutes
    
    return () => clearInterval(interval)
  }, [userProgress.xp])
  
  // Sync on significant progress changes
  useEffect(() => {
    if (userProgress.completedChallenges.length > 0) {
      syncToServer()
    }
  }, [userProgress.completedChallenges.length])
  
  return {
    loading,
    error,
    syncToServer
  }
}