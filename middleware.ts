import { type NextRequest, NextResponse } from 'next/server'
// import { updateSession } from '@/lib/services/supabase/middleware'

// TODO: Update Supabase middleware for Next.js 15 async cookies API
// Temporarily disabled to allow build
export async function middleware(request: NextRequest) {
  // return await updateSession(request)
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}