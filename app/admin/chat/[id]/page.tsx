import { requireAdmin } from '@/lib/user'
import { createAdminClient } from '@/lib/supabase/admin'
import ChatBox from '@/app/chat/_components/ChatBox'

// 1. ปรับ Type ของ params ให้เป็น Promise
export default async function AdminChatPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 2. Unwrapped params ด้วย await
  const { id } = await params
  
  const admin = await requireAdmin()
  const adminClient = createAdminClient()

  const { data: conversation } = await adminClient
    .from('conversations')
    .select('*, users(username, email)')
    .eq('id', id) // ใช้ id ที่ await มาแล้ว
    .single()

  const { data: messages } = await adminClient
    .from('messages')
    .select('*')
    .eq('conversation_id', id) // ใช้ id ที่ await มาแล้ว
    .order('created_at', { ascending: true })

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <div className="border-b border-zinc-800 px-6 py-4">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-0.5">conversation with</p>
        <h1 className="text-zinc-100 font-semibold">{conversation?.users?.username}</h1>
        <p className="text-zinc-500 text-sm">{conversation?.users?.email}</p>
      </div>
      <ChatBox
        conversationId={id} // ใช้ id ที่ await มาแล้ว
        initialMessages={messages ?? []}
        currentUserId={admin.uid}
      />
    </div>
  )
}