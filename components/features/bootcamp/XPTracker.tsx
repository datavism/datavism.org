'use client'

import { useAcademyStore } from '@/lib/store/academy.store'

export function XPTracker() {
  const { userProgress } = useAcademyStore()
  
  return (
    <div className="border border-yellow-400 p-4 bg-yellow-950/10 text-center mb-4">
      <h3 className="text-yellow-400 font-bold mb-2">DATA ACTIVIST STATUS</h3>
      <div className="text-3xl font-bold text-yellow-400 mb-2">{userProgress.xp} XP</div>
      <div className="text-sm text-green-400">Level {userProgress.level} - {userProgress.reputation}</div>
      <div className="mt-4 h-2 bg-black border border-yellow-400">
        <div 
          className="h-full bg-yellow-400 transition-all"
          style={{ width: `${Math.min((userProgress.xp % 500) / 5, 100)}%` }}
        />
      </div>
      <div className="text-xs text-green-300 mt-2">
        {500 - (userProgress.xp % 500)} XP to next level
      </div>
    </div>
  )
}