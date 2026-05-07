'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useRef, useState } from 'react'
import MessageBubble from './MessageBubble'

export type Message = {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  image_urls: string[]
  created_at: string
}

type Props = {
  conversationId: string
  initialMessages: Message[]
  currentUserId: string
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export default function ChatBox({ conversationId, initialMessages, currentUserId }: Props) {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages(prev => {
            const exists = prev.some(m => m.id === payload.new.id)
            if (exists) return prev
            return [...prev, payload.new as Message]
          })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [conversationId])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    setError('')

    const invalid = selected.filter(f => !ALLOWED_TYPES.includes(f.type))
    if (invalid.length > 0) {
      setError('รองรับเฉพาะไฟล์ jpg, png, webp, gif เท่านั้น')
      return
    }

    const tooBig = selected.filter(f => f.size > MAX_FILE_SIZE)
    if (tooBig.length > 0) {
      setError('ไฟล์บางรูปมีขนาดเกิน 10MB')
      return
    }

    setFiles(prev => [...prev, ...selected])
    const newPreviews = selected.map(f => URL.createObjectURL(f))
    setPreviews(prev => [...prev, ...newPreviews])

    // reset input เพื่อให้เลือกไฟล์เดิมซ้ำได้
    e.target.value = ''
  }

  function removeFile(index: number) {
    URL.revokeObjectURL(previews[index])
    setFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
  }

  async function uploadImages(): Promise<string[]> {
    const urls: string[] = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${currentUserId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage
        .from('chat-images')
        .upload(path, file, { contentType: file.type })

      if (error) throw new Error(`Upload failed: ${error.message}`)

      const { data } = supabase.storage.from('chat-images').getPublicUrl(path)
      urls.push(data.publicUrl)
    }
    return urls
  }

  async function sendMessage() {
    if ((!input.trim() && files.length === 0) || sending) return
    setSending(true)
    setError('')

    try {
      const image_urls = files.length > 0 ? await uploadImages() : []

      await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: currentUserId,
        content: input.trim(),
        image_urls,
      })

      setInput('')
      setFiles([])
      previews.forEach(p => URL.revokeObjectURL(p))
      setPreviews([])
    } catch (err: any) {
      setError(err.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const canSend = (input.trim().length > 0 || files.length > 0) && !sending

  return (
    <div className="flex flex-col flex-1 max-w-2xl w-full mx-auto h-[calc(100vh-73px)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-zinc-600 text-sm">
            ยังไม่มีข้อความ เริ่มการสนทนาได้เลยครับ
          </p>
        )}
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.sender_id === currentUserId}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && (
        <p className="px-4 py-2 text-sm text-red-400 bg-red-950/40 border-t border-red-900">
          {error}
        </p>
      )}

      {/* Image previews */}
      {previews.length > 0 && (
        <div className="flex gap-2 px-4 py-3 border-t border-zinc-800 flex-wrap">
          {previews.map((src, i) => (
            <div key={i} className="relative group">
              <img
                src={src}
                alt=""
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
              <button
                onClick={() => removeFile(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-zinc-900 border border-zinc-600 rounded-full text-zinc-400 hover:text-white text-xs flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-zinc-800 p-4 flex gap-3 items-end">
        {/* Upload button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition"
          title="แนบรูป"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="พิมพ์ข้อความ... (Enter เพื่อส่ง)"
          rows={1}
          className="flex-1 bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-500 resize-none"
        />

        <button
          onClick={sendMessage}
          disabled={!canSend}
          className="shrink-0 bg-white text-zinc-900 rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-zinc-100 disabled:opacity-40 transition"
        >
          {sending ? '...' : 'ส่ง'}
        </button>
      </div>
    </div>
  )
}