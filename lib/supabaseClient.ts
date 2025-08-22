// /lib/supabaseClient.ts
'use client'
import { createClient } from '@supabase/supabase-js'
import { getSupabaseConfig, isSupabaseConfigured } from './env'

const config = getSupabaseConfig()

export const supabase = createClient(config.url, config.anonKey, {
  auth: { 
    persistSession: isSupabaseConfigured(), 
    autoRefreshToken: isSupabaseConfigured(), 
    detectSessionInUrl: isSupabaseConfigured() 
  },
})
