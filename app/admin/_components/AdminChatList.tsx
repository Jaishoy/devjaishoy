'use client'

import { useRouter } from 'next/navigation'

type Props = {
  conversations: any[]
}

export default function AdminChatList({ conversations }: Props) {
  const router = useRouter()

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-2 px-4">
      {conversations.length === 0 && (
        <p className="text-center text-zinc-600 text-sm py-12">ยังไม่มีการสนทนา</p>
      )}
      {conversations.map(conv => {
        const lastMsg = conv.messages?.at(-1)
        const hasImage = lastMsg?.image_urls?.length > 0
        return (
          <div
            key={conv.id}
            onClick={() => router.push(`/admin/chat/${conv.id}`)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 cursor-pointer hover:border-zinc-600 transition space-y-1"
          >
            <div className="flex justify-between items-center">
              <p className="text-zinc-100 font-medium text-sm">{conv.users?.username}</p>
              <p className="text-zinc-600 text-xs">
                {lastMsg ? new Date(lastMsg.created_at).toLocaleDateString('th-TH') : ''}
              </p>
            </div>
            <p className="text-zinc-500 text-sm truncate">
              {hasImage && !lastMsg?.content ? '📎 ส่งรูปภาพ' : lastMsg?.content ?? 'ยังไม่มีข้อความ'}
              {hasImage && lastMsg?.content ? ' 📎' : ''}
            </p>
          </div>
        )
      })}
    </div>
  )
}