// Progress Service - Handles both local and cloud storage
import { createClient } from '@/lib/services/supabase/client'

export interface LevelProgress {
  levelId: string
  completedChallenges: string[]
  totalXp: number
  currentChallenge: number
  completedAt?: string
  timeSpent?: number
}

export interface UserProgress {
  userId?: string
  level1?: LevelProgress
  level2?: LevelProgress
  totalXp: number
  currentLevel: number
  lastActive: string
}

class ProgressService {
  private supabase = createClient()
  
  // Save progress (works for both logged in and anonymous users)
  async saveProgress(levelId: string, progress: LevelProgress): Promise<void> {
    // Always save to localStorage
    const localKey = `datavism_${levelId}_progress`
    localStorage.setItem(localKey, JSON.stringify({
      ...progress,
      timestamp: new Date().toISOString()
    }))
    
    // If user is logged in, also save to Supabase
    const { data: { user } } = await this.supabase.auth.getUser()
    if (user) {
      await this.saveToSupabase(user.id, levelId, progress)
    }
  }
  
  // Load progress (checks Supabase first if logged in, then localStorage)
  async loadProgress(levelId: string): Promise<LevelProgress | null> {
    // Check if user is logged in
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (user) {
      // Try to load from Supabase first
      const cloudProgress = await this.loadFromSupabase(user.id, levelId)
      if (cloudProgress) {
        return cloudProgress
      }
    }
    
    // Fall back to localStorage
    const localKey = `datavism_${levelId}_progress`
    const saved = localStorage.getItem(localKey)
    if (saved) {
      return JSON.parse(saved)
    }
    
    return null
  }
  
  // Save to Supabase
  private async saveToSupabase(userId: string, levelId: string, progress: LevelProgress): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          level_id: levelId,
          completed_challenges: progress.completedChallenges,
          total_xp: progress.totalXp,
          current_challenge: progress.currentChallenge,
          completed_at: progress.completedAt,
          updated_at: new Date().toISOString()
        })
      
      if (error) {
        console.error('Error saving progress to Supabase:', error)
      }
      
      // Also update user's total XP in profile
      await this.updateUserProfile(userId, progress.totalXp)
    } catch (error) {
      console.error('Error saving to Supabase:', error)
    }
  }
  
  // Load from Supabase
  private async loadFromSupabase(userId: string, levelId: string): Promise<LevelProgress | null> {
    try {
      const { data, error } = await this.supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('level_id', levelId)
        .single()
      
      if (error || !data) {
        return null
      }
      
      return {
        levelId: data.level_id,
        completedChallenges: data.completed_challenges || [],
        totalXp: data.total_xp || 0,
        currentChallenge: data.current_challenge || 0,
        completedAt: data.completed_at,
        timeSpent: data.time_spent
      }
    } catch (error) {
      console.error('Error loading from Supabase:', error)
      return null
    }
  }
  
  // Update user profile with XP
  private async updateUserProfile(userId: string, levelXp: number): Promise<void> {
    try {
      // Get current profile
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('xp')
        .eq('id', userId)
        .single()
      
      if (profile) {
        // Calculate new level based on XP
        const totalXp = (profile.xp || 0) + levelXp
        const level = Math.floor(totalXp / 1000) + 1 // Every 1000 XP = 1 level
        
        // Update profile
        await this.supabase
          .from('profiles')
          .update({
            xp: totalXp,
            level: level,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
      }
    } catch (error) {
      console.error('Error updating user profile:', error)
    }
  }
  
  // Sync local progress to cloud when user logs in
  async syncLocalToCloud(): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) return
    
    // Check for any local progress
    const levels = ['level1', 'level2', 'level3'] // Add more as needed
    
    for (const levelId of levels) {
      const localKey = `datavism_${levelId}_progress`
      const saved = localStorage.getItem(localKey)
      
      if (saved) {
        const progress = JSON.parse(saved)
        await this.saveToSupabase(user.id, levelId, progress)
      }
    }
  }
  
  // Clear local progress (useful after sync or logout)
  clearLocalProgress(levelId?: string): void {
    if (levelId) {
      localStorage.removeItem(`datavism_${levelId}_progress`)
    } else {
      // Clear all datavism progress
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('datavism_')) {
          localStorage.removeItem(key)
        }
      })
    }
  }
  
  // Get user's total progress across all levels
  async getUserProgress(): Promise<UserProgress | null> {
    const { data: { user } } = await this.supabase.auth.getUser()
    
    if (!user) {
      // Return local progress summary
      const level1 = localStorage.getItem('datavism_level1_progress')
      if (level1) {
        const progress = JSON.parse(level1)
        return {
          level1: progress,
          totalXp: progress.totalXp || 0,
          currentLevel: 1,
          lastActive: new Date().toISOString()
        }
      }
      return null
    }
    
    // Get all progress for user
    const { data: progressData } = await this.supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
    
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('xp, level')
      .eq('id', user.id)
      .single()
    
    if (!progressData || !profile) return null
    
    const progress: UserProgress = {
      userId: user.id,
      totalXp: profile.xp || 0,
      currentLevel: profile.level || 1,
      lastActive: new Date().toISOString()
    }
    
    // Add level progress
    progressData.forEach(level => {
      if (level.level_id === 'level1') {
        progress.level1 = {
          levelId: level.level_id,
          completedChallenges: level.completed_challenges || [],
          totalXp: level.total_xp || 0,
          currentChallenge: level.current_challenge || 0,
          completedAt: level.completed_at
        }
      }
      // Add more levels as needed
    })
    
    return progress
  }
}

// Export singleton instance
export const progressService = new ProgressService()