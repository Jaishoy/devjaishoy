import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ExternalLinkButton from './_components/ExternalLinkButton'

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>
}) {
  const { tag: activeTag } = await searchParams
  const supabase = await createClient()

  const { data: allPortfolios } = await supabase
    .from('portfolios')
    .select('*')
    .order('created_at', { ascending: false })

  const allTags = Array.from(
    new Set((allPortfolios ?? []).flatMap(p => p.tags ?? []))
  )

  const portfolios = activeTag
    ? (allPortfolios ?? []).filter(p => p.tags?.includes(activeTag))
    : allPortfolios

  return (
    <div className="min-h-screen bg-zinc-950">

      {/* Hero section */}
      <div className="relative border-b border-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-12">
          <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Work</p>
          <h1 className="text-4xl font-semibold text-zinc-100 mb-3">Portfolio</h1>
          <p className="text-zinc-500 text-sm max-w-md">
            ผลงานที่ผ่านมาทั้งหมดครับ — เลือกดูตาม tag ได้เลย
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-8 pb-24">

        {/* Filter tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <Link
              href="/portfolio"
              className={`text-xs rounded-full px-4 py-1.5 transition font-medium ${
                !activeTag
                  ? 'text-zinc-900 bg-zinc-100'
                  : 'text-zinc-500 border border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:text-zinc-300'
              }`}
            >
              ทั้งหมด
              {!activeTag && (
                <span className="ml-1.5 text-zinc-600 font-normal">
                  ({allPortfolios?.length ?? 0})
                </span>
              )}
            </Link>
            {allTags.map(tag => (
              <Link
                key={tag}
                href={`/portfolio?tag=${encodeURIComponent(tag)}`}
                className={`text-xs rounded-full px-4 py-1.5 transition font-medium ${
                  activeTag === tag
                    ? 'text-zinc-900 bg-zinc-100'
                    : 'text-zinc-500 border border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:text-zinc-300'
                }`}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Grid */}
        {!portfolios || portfolios.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-zinc-700 text-lg mb-2">ไม่พบผลงาน</p>
            <p className="text-zinc-600 text-sm">
              {activeTag ? `ในแท็ก "${activeTag}"` : 'ยังไม่มีผลงานครับ'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolios.map(item => (
              <div
                key={item.id}
                className="group relative bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-300"
              >
                <Link
                  href={`/portfolio/${item.id}`}
                  className="absolute inset-0 z-0"
                  aria-label={item.title}
                />
                <div className="overflow-hidden">
                  {item.cover_url ? (
                    <img
                      src={item.cover_url}
                      alt={item.title}
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                    />
                  ) : (
                    <div className="w-full h-52 bg-zinc-800/60 flex items-center justify-center pointer-events-none">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-zinc-700">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-5 relative z-10">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h2 className="text-zinc-100 font-medium text-base group-hover:text-white transition pointer-events-none">
                      {item.title}
                    </h2>
                    {item.url && (
                      <div className="relative z-20 shrink-0">
                        <ExternalLinkButton href={item.url} />
                      </div>
                    )}
                  </div>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-4 line-clamp-2 pointer-events-none">
                    {item.description}
                  </p>
                  {item.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pointer-events-none">
                      {item.tags.map((tag: string) => (
                        <span key={tag} className="text-xs text-zinc-600 bg-zinc-800/80 px-2.5 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}