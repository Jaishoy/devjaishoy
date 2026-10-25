'use client'

import { useState } from 'react'
import QuotationCard from './QuotationCard'
import PaymentCard from './PaymentCard'
import ReceiptCard from './ReceiptCard'

export type Message = {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  image_urls: string[]
  created_at: string
  type: 'text' | 'quotation' | 'payment' | 'receipt'
  metadata?: any
}

type Props = {
  message: Message
  isOwn: boolean
  isAdmin: boolean
}

function linkify(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)
  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:opacity-80 transition break-all"
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

export default function MessageBubble({ message, isOwn, isAdmin }: Props) {
  const [lightbox, setLightbox] = useState<string | null>(null)

  const time = new Date(message.created_at).toLocaleTimeString('th-TH', {
    hour: '2-digit', minute: '2-digit',
  })

  // Special message types — ไม่มี bubble ปกติ
  if (message.type === 'quotation' && message.metadata) {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div className="space-y-1 max-w-[90%] sm:max-w-sm">
          <QuotationCard
            metadata={message.metadata}
            isOwnMessage={isOwn}
            isAdmin={isAdmin}
          />
          <p className={`text-xs text-zinc-600 ${isOwn ? 'text-right' : 'text-left'} px-1`}>
            {time}
          </p>
        </div>
      </div>
    )
  }

  if (message.type === 'payment' && message.metadata) {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div className="space-y-1 max-w-[90%] sm:max-w-sm">
          <PaymentCard metadata={message.metadata} isAdmin={isAdmin} />
          <p className={`text-xs text-zinc-600 ${isOwn ? 'text-right' : 'text-left'} px-1`}>
            {time}
          </p>
        </div>
      </div>
    )
  }

  if (message.type === 'receipt' && message.metadata) {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div className="space-y-1 max-w-[90%] sm:max-w-sm">
          <ReceiptCard metadata={message.metadata} />
          <p className={`text-xs text-zinc-600 ${isOwn ? 'text-right' : 'text-left'} px-1`}>
            {time}
          </p>
        </div>
      </div>
    )
  }

  // Default text message
  const hasText = message.content?.length > 0
  const hasImages = message.image_urls?.length > 0

  return (
    <>
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div className="max-w-[75%] space-y-1">
          {hasImages && (
            <div className={`grid gap-1 ${message.image_urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {message.image_urls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  onClick={() => setLightbox(url)}
                  className="rounded-xl object-cover w-full max-h-60 cursor-zoom-in border border-zinc-700"
                />
              ))}
            </div>
          )}
          {hasText && (
            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              isOwn
                ? 'bg-white text-zinc-900 rounded-br-sm'
                : 'bg-zinc-800 text-zinc-100 rounded-bl-sm'
            }`}>
              {linkify(message.content)}
            </div>
          )}
          <p className={`text-xs text-zinc-600 ${isOwn ? 'text-right' : 'text-left'} px-1`}>
            {time}
          </p>
        </div>
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 cursor-zoom-out p-4"
        >
          <img src={lightbox} alt="" className="max-w-full max-h-full rounded-xl object-contain" />
        </div>
      )}
    </>
  )
}