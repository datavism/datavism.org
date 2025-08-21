'use client'

import { useEffect } from 'react'
import { useAuth } from './useAuth'
import { useAcademyStore } from '@/lib/store/academy.store'

export function useAcademySync() {
  const { user, loading: authLoading } = useAuth()
  const { syncWithDatabase, loading: storeLoading } = useAcademyStore()

  useEffect(() => {
    if (user && !authLoading) {
      syncWithDatabase(user.id)
    }
  }, [user, authLoading, syncWithDatabase])

  return {
    loading: authLoading || storeLoading
  }
}