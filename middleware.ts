import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/services/supabase/middleware'
import { isSupabaseConfigured } from '@/lib/env'

export async function middleware(request: NextRequest) {
  // Skip Supabase session handling when not configured (e.g. deploy without env vars)
  if (!isSupabaseConfigured()) {
    return NextResponse.next()
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
