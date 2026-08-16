import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PortfolioGallery from '../_components/PortfolioGallery'

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: item } = await supabase
    .from('portfolios')
    .select('*')
    .eq('id', id)
    .single()

  if (!item) notFound()

  return (
    <div className="min-h-screen bg-zinc-950">

      {/* Cover hero */}
      <div className="relative w-full h-72 sm:h-96 overflow-hidden">
        {item.cover_url ? (
          <>
            <img
              src={item.cover_url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-zinc-900 border-b border-zinc-800" />
        )}

        {/* Back button overlay */}
        <div className="absolute top-6 left-6">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-zinc-300 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/60 rounded-xl px-4 py-2 hover:bg-zinc-800 hover:text-white transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Portfolio
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-16 pb-24 relative">

        {/* Header card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-100">{item.title}</h1>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 text-sm text-zinc-900 bg-zinc-100 hover:bg-white rounded-xl px-4 py-2 font-medium transition"
              >
                เปิดโปรเจกต์
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7H7M17 7V17"/>
                </svg>
              </a>
            )}
          </div>

          {item.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag: string) => (
                <span key={tag} className="text-xs text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-full px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-10">
          <p className="text-xs text-zinc-600 uppercase tracking-widest mb-4">About</p>
          <p className="text-zinc-400 text-[15px] leading-relaxed whitespace-pre-line">
            {item.description}
          </p>
        </div>

        {/* Gallery */}
        {item.images?.length > 0 && (
          <div>
            <p className="text-xs text-zinc-600 uppercase tracking-widest mb-4">Gallery</p>
            <PortfolioGallery images={item.images} title={item.title} />
          </div>
        )}

      </div>
    </div>
  )
}