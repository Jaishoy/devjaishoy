import { getProfile } from '@/lib/user'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const profile = await getProfile()

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-4 w-full max-w-md">
        <div className="space-y-1">
          <p className="text-xs text-zinc-500 uppercase tracking-widest">Profile</p>
          <h1 className="text-xl font-semibold text-zinc-100">{profile.username}</h1>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">Email</span>
            <span className="text-zinc-300">{profile.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Role</span>
            <span className={`font-medium ${profile.role === 'admin' ? 'text-amber-400' : 'text-zinc-300'}`}>
              {profile.role}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">UID</span>
            <span className="text-zinc-600 text-xs font-mono">{profile.uid.slice(0, 8)}...</span>
          </div>
        </div>

        <form action={signOut}>
          <button
            type="submit"
            className="w-full mt-2 border border-zinc-700 text-zinc-400 rounded-lg py-2 text-sm hover:bg-zinc-800 hover:text-zinc-200 transition"
          >
            ออกจากระบบ
          </button>
        </form>
      </div>
    </div>
  )
}