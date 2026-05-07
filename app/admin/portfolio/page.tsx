import { requireAdmin } from '@/lib/user'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

export default async function AdminPortfolioPage() {
  await requireAdmin()
  const adminClient = createAdminClient()

  const { data: portfolios } = await adminClient
    .from('portfolios')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-24">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-zinc-100">Portfolio</h1>
            <p className="text-zinc-500 text-sm mt-0.5">{portfolios?.length ?? 0} ผลงาน</p>
          </div>
          <Link
            href="/admin/portfolio/new"
            className="bg-white text-zinc-900 text-sm font-medium rounded-lg px-4 py-2 hover:bg-zinc-100 transition"
          >
            + เพิ่มผลงาน
          </Link>
        </div>

        {!portfolios || portfolios.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-zinc-800 rounded-xl">
            <p className="text-zinc-600 text-sm">ยังไม่มีผลงาน</p>
            <Link
              href="/admin/portfolio/new"
              className="inline-block mt-3 text-sm text-zinc-400 hover:text-zinc-200 transition"
            >
              เพิ่มผลงานแรกได้เลย →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {portfolios.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 hover:border-zinc-700 transition"
              >
                {item.cover_url ? (
                  <img
                    src={item.cover_url}
                    alt={item.title}
                    className="w-14 h-14 object-cover rounded-lg border border-zinc-700 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 bg-zinc-800 rounded-lg border border-zinc-700 shrink-0 flex items-center justify-center">
                    <span className="text-zinc-600 text-xs">N/A</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-zinc-100 text-sm font-medium truncate">{item.title}</p>
                  <p className="text-zinc-500 text-xs mt-0.5 truncate">{item.description}</p>
                  {item.tags?.length > 0 && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {item.tags.slice(0, 4).map((tag: string) => (
                        <span key={tag} className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/portfolio/${item.id}`}
                    className="text-xs text-zinc-400 border border-zinc-700 rounded-lg px-3 py-1.5 hover:border-zinc-500 hover:text-zinc-200 transition"
                  >
                    แก้ไข
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}