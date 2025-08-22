// Environment Variables with Fallbacks
// This prevents build errors when env vars are not set

export const env = {
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-anon-key',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-service-role-key',
  
  // App Configuration
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Analytics (optional)
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY || '',
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
}

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return env.NEXT_PUBLIC_SUPABASE_URL !== 'https://dummy.supabase.co' && 
         env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'dummy-anon-key'
}

// Helper function to get Supabase config or throw helpful error
export const getSupabaseConfig = () => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured properly. Using dummy values for build.')
  }
  
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY
  }
}