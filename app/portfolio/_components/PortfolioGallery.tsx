'use client'

import { useState } from 'react'

type Props = {
  images: string[]
  title: string
}

export default function PortfolioGallery({ images, title }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`${title} ${i + 1}`}
            onClick={() => setLightbox(i)}
            className="w-full h-32 sm:h-40 object-cover rounded-xl border border-zinc-800 cursor-zoom-in hover:opacity-90 transition"
          />
        ))}
      </div>

      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 cursor-zoom-out p-4"
        >
          <img
            src={images[lightbox]}
            alt=""
            className="max-w-full max-h-full rounded-xl object-contain"
          />

          {/* Prev / Next */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox(prev => (prev! - 1 + images.length) % images.length) }}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900/80 text-zinc-300 hover:text-white transition"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox(prev => (prev! + 1) % images.length) }}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900/80 text-zinc-300 hover:text-white transition"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}