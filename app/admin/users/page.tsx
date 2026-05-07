import { requireAdmin } from '@/lib/user'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminUsersPage() {
  await requireAdmin()
  const adminClient = createAdminClient()

  const { data: users } = await adminClient
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-24">

        <div className="mb-8">
          <h1 className="text-xl font-semibold text-zinc-100">Users</h1>
          <p className="text-zinc-500 text-sm mt-0.5">{users?.length ?? 0} accounts</p>
        </div>

        <div className="space-y-2">
          {!users?.length ? (
            <p className="text-zinc-600 text-sm py-4">ยังไม่มี users</p>
          ) : (
            users.map(user => (
              <div
                key={user.uid}
                className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4"
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 text-zinc-500 text-xs font-medium uppercase">
                  {user.username?.slice(0, 2) ?? 'U'}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-zinc-200 text-sm font-medium truncate">{user.username}</p>
                  <p className="text-zinc-500 text-xs truncate">{user.email}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <p className="text-zinc-600 text-xs hidden sm:block">
                    {new Date(user.created_at).toLocaleDateString('th-TH')}
                  </p>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    user.role === 'admin'
                      ? 'text-amber-400 bg-amber-950/40 border border-amber-900/50'
                      : 'text-zinc-500 bg-zinc-800 border border-zinc-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}