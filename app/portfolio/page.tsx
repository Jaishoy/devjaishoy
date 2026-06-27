import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: { tag?: string }
}) {
  const supabase = await createClient()
  const activeTag = searchParams.tag

  const { data: allPortfolios } = await supabase
    .from('portfolios')
    .select('*')
    .order('created_at', { ascending: false })

  const allTags = Array.from(
    new Set((allPortfolios ?? []).flatMap(p => p.tags ?? []))
  )

  // filter ตาม tag ถ้ามีการเลือก
  const portfolios = activeTag
    ? (allPortfolios ?? []).filter(p => p.tags?.includes(activeTag))
    : allPortfolios

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-24">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-zinc-100 mb-2">Portfolio</h1>
          <p className="text-zinc-500 text-sm">ผลงานที่ผ่านมาทั้งหมดครับ</p>
        </div>

        {/* Filter tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/portfolio"
              className={`text-xs rounded-full px-3 py-1.5 transition ${!activeTag
                  ? 'text-zinc-900 bg-zinc-100'
                  : 'text-zinc-500 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
                }`}
            >
              ทั้งหมด
            </Link>
            {allTags.map(tag => (
              <Link
                key={tag}
                href={`/portfolio?tag=${encodeURIComponent(tag)}`}
                className={`text-xs rounded-full px-3 py-1.5 transition ${activeTag === tag
                    ? 'text-zinc-900 bg-zinc-100'
                    : 'text-zinc-500 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Grid */}
        {!portfolios || portfolios.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-zinc-600">
              {activeTag ? `ไม่มีผลงานในแท็ก "${activeTag}"` : 'ยังไม่มีผลงานครับ'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {portfolios.map(item => (
              <Link
                key={item.id}
                href={`/portfolio/${item.id}`}
                className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition"
              >
                {item.cover_url ? (
                  <img
                    src={item.cover_url}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:opacity-90 transition"
                  />
                ) : (
                  <div className="w-full h-48 bg-zinc-800 flex items-center justify-center">
                    <span className="text-zinc-600 text-xs">No image</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h2 className="text-zinc-100 font-medium text-base">{item.title}</h2>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="shrink-0 text-zinc-500 hover:text-zinc-300 transition text-xs border border-zinc-700 rounded-lg px-2.5 py-1 hover:border-zinc-500"
                      >
                        ดูโปรเจกต์ ↗
                      </a>
                    )}
                  </div>
                  <p className="text-zinc-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  {item.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag: string) => (
                        <span key={tag} className="text-xs text-zinc-500 bg-zinc-800 px-2.5 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}