'use client'

import type { Message } from './ChatBox'
import { useState } from 'react'

type Props = {
  message: Message
  isOwn: boolean
}

export default function MessageBubble({ message, isOwn }: Props) {
  const [lightbox, setLightbox] = useState<string | null>(null)

  const time = new Date(message.created_at).toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const hasText = message.content.length > 0
  const hasImages = message.image_urls.length > 0

  return (
    <>
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
        <div className="max-w-[75%] space-y-1">

          {/* Images grid */}
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

          {/* Text bubble */}
          {hasText && (
            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              isOwn
                ? 'bg-white text-zinc-900 rounded-br-sm'
                : 'bg-zinc-800 text-zinc-100 rounded-bl-sm'
            }`}>
              {message.content}
            </div>
          )}

          <p className={`text-xs text-zinc-600 ${isOwn ? 'text-right' : 'text-left'} px-1`}>
            {time}
          </p>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-zoom-out p-4"
        >
          <img
            src={lightbox}
            alt=""
            className="max-w-full max-h-full rounded-xl object-contain"
          />
        </div>
      )}
    </>
  )
}