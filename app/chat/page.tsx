import { getProfile } from '@/lib/user'
import { createClient } from '@/lib/supabase/server'
import ChatBox from './_components/ChatBox'

export default async function ChatPage() {
  const profile = await getProfile()
  const supabase = await createClient()

  let { data: conversation } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', profile.uid)
    .single()

  if (!conversation) {
    const { data } = await supabase
      .from('conversations')
      .insert({ user_id: profile.uid })
      .select()
      .single()
    conversation = data
  }

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversation!.id)
    .order('created_at', { ascending: true })

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <div className="border-b border-zinc-800 px-6 py-4">
        <h1 className="text-zinc-100 font-semibold">ติดต่อ Admin</h1>
        <p className="text-zinc-500 text-sm">ส่งข้อความถึงเราได้เลยครับ</p>
      </div>
      <ChatBox
        conversationId={conversation!.id}
        initialMessages={messages ?? []}
        currentUserId={profile.uid}
      />
    </div>
  )
}