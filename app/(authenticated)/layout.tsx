import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/services/supabase/server'
import { AuthenticatedNavigation } from '@/components/layout/AuthenticatedNavigation'

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user || error) {
    redirect('/auth')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-black text-green-400">
      <AuthenticatedNavigation user={user} profile={profile} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}