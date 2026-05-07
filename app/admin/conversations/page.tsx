import { requireAdmin } from '@/lib/user'
import { createAdminClient } from '@/lib/supabase/admin'
import AdminChatList from '@/app/admin/_components/AdminChatList'

export default async function AdminConversationsPage() {
  await requireAdmin()
  const adminClient = createAdminClient()

  const { data: conversations } = await adminClient
    .from('conversations')
    .select(`*, users(username, email), messages(content, image_urls, created_at)`)
    .order('updated_at', { ascending: false })

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="border-b border-zinc-800 px-6 py-4">
        <h1 className="text-zinc-100 font-semibold">Inbox</h1>
        <p className="text-zinc-500 text-sm">{conversations?.length ?? 0} conversations</p>
      </div>
      <AdminChatList conversations={conversations ?? []} />
    </div>
  )
}