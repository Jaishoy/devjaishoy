import { requireAdmin } from '@/lib/user'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

export default async function AdminPage() {
  await requireAdmin()
  const adminClient = createAdminClient()

  const [
    { count: conversationCount },
    { count: portfolioCount },
    { count: userCount },
    { data: recentConversations },
    { data: recentUsers },
  ] = await Promise.all([
    adminClient.from('conversations').select('*', { count: 'exact', head: true }),
    adminClient.from('portfolios').select('*', { count: 'exact', head: true }),
    adminClient.from('users').select('*', { count: 'exact', head: true }),
    adminClient
      .from('conversations')
      .select('*, users(username, email)')
      .order('updated_at', { ascending: false })
      .limit(5),
    adminClient
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = [
    { label: 'Conversations', value: conversationCount ?? 0, href: '/admin/conversations' },
    { label: 'Portfolios', value: portfolioCount ?? 0, href: '/admin/portfolio' },
    { label: 'Users', value: userCount ?? 0, href: '/admin/users' },
  ]

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-24 space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-0.5">ภาพรวมทั้งหมดครับ</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(s => (
            <Link
              key={s.label}
              href={s.href}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-5 hover:border-zinc-600 transition"
            >
              <p className="text-xs text-zinc-600 uppercase tracking-widest mb-2">{s.label}</p>
              <p className="text-3xl font-semibold text-zinc-100">{s.value}</p>
            </Link>
          ))}
        </div>

        {/* Recent Conversations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-zinc-600 uppercase tracking-widest">Recent Conversations</p>
            <Link href="/admin/conversations" className="text-xs text-zinc-500 hover:text-zinc-300 transition">
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="space-y-2">
            {!recentConversations?.length ? (
              <p className="text-zinc-600 text-sm py-4">ยังไม่มี conversations</p>
            ) : (
              recentConversations.map((conv: any) => (
                <Link
                  key={conv.id}
                  href={`/admin/chat/${conv.id}`}
                  className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3.5 hover:border-zinc-600 transition"
                >
                  <div>
                    <p className="text-zinc-200 text-sm font-medium">{conv.users?.username}</p>
                    <p className="text-zinc-600 text-xs">{conv.users?.email}</p>
                  </div>
                  <p className="text-zinc-600 text-xs">
                    {new Date(conv.updated_at).toLocaleDateString('th-TH')}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-zinc-600 uppercase tracking-widest">Recent Users</p>
            <Link href="/admin/users" className="text-xs text-zinc-500 hover:text-zinc-300 transition">
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="space-y-2">
            {!recentUsers?.length ? (
              <p className="text-zinc-600 text-sm py-4">ยังไม่มี users</p>
            ) : (
              recentUsers.map((user: any) => (
                <div
                  key={user.uid}
                  className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3.5"
                >
                  <div>
                    <p className="text-zinc-200 text-sm font-medium">{user.username}</p>
                    <p className="text-zinc-600 text-xs">{user.email}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    user.role === 'admin'
                      ? 'text-amber-400 bg-amber-950/40 border border-amber-900/50'
                      : 'text-zinc-500 bg-zinc-800 border border-zinc-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <p className="text-xs text-zinc-600 uppercase tracking-widest mb-4">Quick Links</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/conversations"
              className="text-sm text-zinc-400 border border-zinc-700 rounded-lg px-4 py-2 hover:border-zinc-500 hover:text-zinc-200 transition"
            >
              Inbox
            </Link>
            <Link
              href="/admin/portfolio"
              className="text-sm text-zinc-400 border border-zinc-700 rounded-lg px-4 py-2 hover:border-zinc-500 hover:text-zinc-200 transition"
            >
              จัดการ Portfolio
            </Link>
            <Link
              href="/admin/users"
              className="text-sm text-zinc-400 border border-zinc-700 rounded-lg px-4 py-2 hover:border-zinc-500 hover:text-zinc-200 transition"
            >
              รายชื่อ Users
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}