import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    console.log('=== CALLBACK DEBUG ===')
    console.log('exchange error:', error?.message ?? 'none')

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  console.log('=== CALLBACK FAILED ===')
  return NextResponse.redirect(`${origin}/auth/login?error=callback_failed`)
}