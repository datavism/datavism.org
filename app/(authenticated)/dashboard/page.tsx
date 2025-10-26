import { createServerSupabaseClient } from '@/lib/services/supabase/server'
import { DashboardStats } from '@/components/features/dashboard/DashboardStats'
import { RecentActivity } from '@/components/features/dashboard/RecentActivity'
import { NextActions } from '@/components/features/dashboard/NextActions'
import { AchievementGrid } from '@/components/features/dashboard/AchievementGrid'
import { SkillProgress } from '@/components/features/dashboard/SkillProgress'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Fetch user data
  const [
    { data: profile },
    { data: progress },
    { data: recentProgress },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('progress').select('*').eq('user_id', user.id),
    supabase.from('progress').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5)
  ])

  return (
    <div className="min-h-screen bg-black text-green-400">
      {/* Hero Section */}
      <div className="border-b border-green-400/30 pb-8 mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 glitch-text text-red-400">
            OPERATIVE HQ
          </h1>
          <p className="text-green-300 mb-6">
            Welcome back, <span className="text-yellow-400 font-mono">{profile?.username}</span>
          </p>
          
          <div className="flex justify-center items-center gap-8 text-center">
            <div className="border border-yellow-400 p-4 bg-yellow-950/10">
              <div className="text-2xl font-bold text-yellow-400">{profile?.level || 1}</div>
              <div className="text-sm text-green-300">LEVEL</div>
            </div>
            <div className="border border-green-400 p-4 bg-green-950/10">
              <div className="text-2xl font-bold text-green-400">{profile?.xp || 0}</div>
              <div className="text-sm text-green-300">XP</div>
            </div>
            <div className="border border-cyan-400 p-4 bg-cyan-950/10">
              <div className="text-2xl font-bold text-cyan-400">{profile?.investigations_count || 0}</div>
              <div className="text-sm text-green-300">INVESTIGATIONS</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <DashboardStats profile={profile} progress={progress || []} />
          <NextActions profile={profile} progress={progress || []} />
          <RecentActivity recentProgress={recentProgress || []} />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <SkillProgress progress={progress || []} />
          <AchievementGrid achievements={profile?.achievements || []} />
        </div>
      </div>
    </div>
  )
}