import { createServerSupabaseClient } from '@/lib/services/supabase/server'
import { SquadGrid } from '@/components/features/community/SquadGrid'
import { Leaderboard } from '@/components/features/community/Leaderboard'
import { LiveFeed } from '@/components/features/community/LiveFeed'
import { CreateSquadButton } from '@/components/features/community/CreateSquadButton'
import { Users, Trophy, Activity, Plus } from 'lucide-react'

export default async function CommunityPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Fetch community data
  const [
    { data: squads },
    { data: topUsers },
    { data: userSquads }
  ] = await Promise.all([
    supabase
      .from('squads')
      .select(`
        *,
        squad_members(count)
      `)
      .order('created_at', { ascending: false })
      .limit(12),
    supabase
      .from('profiles')
      .select('*')
      .order('xp', { ascending: false })
      .limit(10),
    supabase
      .from('squad_members')
      .select(`
        *,
        squads(*)
      `)
      .eq('user_id', user.id)
  ])

  return (
    <div className="min-h-screen bg-black text-green-400">
      {/* Header */}
      <div className="border-b border-green-400/30 pb-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 glitch-text text-red-400">
              COMMUNITY HQ
            </h1>
            <p className="text-green-300">
              Connect with fellow data revolutionaries
            </p>
          </div>
          
          <CreateSquadButton />
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="border border-green-400 p-4 text-center">
            <Users className="text-green-400 mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-green-400">{(topUsers?.length || 0) * 47}</div>
            <div className="text-sm text-green-300">ACTIVE OPERATIVES</div>
          </div>
          
          <div className="border border-purple-400 p-4 text-center">
            <Trophy className="text-purple-400 mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-purple-400">{squads?.length || 0}</div>
            <div className="text-sm text-green-300">ACTIVE SQUADS</div>
          </div>
          
          <div className="border border-cyan-400 p-4 text-center">
            <Activity className="text-cyan-400 mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-cyan-400">23</div>
            <div className="text-sm text-green-300">INVESTIGATIONS</div>
          </div>
          
          <div className="border border-yellow-400 p-4 text-center">
            <Plus className="text-yellow-400 mx-auto mb-2" size={32} />
            <div className="text-2xl font-bold text-yellow-400">{userSquads?.length || 0}</div>
            <div className="text-sm text-green-300">YOUR SQUADS</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <SquadGrid squads={squads || []} userSquads={userSquads || []} />
          <LiveFeed />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Leaderboard users={topUsers || []} currentUserId={user.id} />
        </div>
      </div>
    </div>
  )
}