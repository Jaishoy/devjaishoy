import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const stack = [
  'Next.js', 'Vite JS','Vue.js', 'React', 'TypeScript', 'Tailwind CSS',
  'Supabase', 'PostgreSQL', 'Node.js', 'Git', 'more...'
]

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featured } = await supabase
    .from('portfolios')
    .select('id, title, description, cover_url, tags')
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div className="min-h-screen bg-zinc-950">

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20">
        <p className="text-zinc-500 text-sm mb-3 tracking-wide">Full-stack Developer & Freelancer</p>
        <h1 className="text-4xl md:text-5xl font-semibold text-zinc-100 leading-tight mb-5">
          Hello I'm <span className="text-white">devjaishoy</span>
          <br className="hidden md:block" />
          <span className="text-zinc-400"> Welcome to my webpage!</span>
        </h1>
        <p className="text-zinc-400 text-base leading-relaxed max-w-xl mb-8">
          Lorem ipsum dolor sit amet consectetur. Amet lectus donec nulla nibh turpis
          nunc risus amet sit. Velit urna consequat lorem amet.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/chat"
            className="bg-white text-zinc-900 font-medium text-sm rounded-lg px-5 py-2.5 hover:bg-zinc-100 transition"
          >
            ติดต่อจ้างงาน
          </Link>
          <Link
            href="/portfolio"
            className="text-zinc-300 border border-zinc-700 text-sm rounded-lg px-5 py-2.5 hover:border-zinc-500 hover:text-white transition"
          >
            ดูผลงาน
          </Link>
        </div>
      </section>

      {/* Stack */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <p className="text-xs text-zinc-600 uppercase tracking-widest mb-4">Tech Stack</p>
        <div className="flex flex-wrap gap-2">
          {stack.map(s => (
            <span
              key={s}
              className="text-xs text-zinc-400 border border-zinc-800 rounded-full px-3 py-1.5"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Featured Portfolio */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-zinc-600 uppercase tracking-widest">Featured work</p>
          <Link
            href="/portfolio"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition"
          >
            ดูทั้งหมด →
          </Link>
        </div>

        {!featured || featured.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="w-full h-40 bg-zinc-800 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-zinc-800 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-zinc-800 rounded animate-pulse w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featured.map(item => (
              <Link
                key={item.id}
                href="/portfolio"
                className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition"
              >
                {item.cover_url ? (
                  <img
                    src={item.cover_url}
                    alt={item.title}
                    className="w-full h-40 object-cover group-hover:opacity-90 transition"
                  />
                ) : (
                  <div className="w-full h-40 bg-zinc-800 flex items-center justify-center">
                    <span className="text-zinc-600 text-xs">No image</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-zinc-100 text-sm font-medium mb-1">{item.title}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                  {item.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
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
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-zinc-100 font-medium text-lg mb-1">"Do you have a project in mind?"</h2>
            <p className="text-zinc-500 text-sm">Get free consultation - no cost for inquiry</p>
          </div>
          <Link
            href="/chat"
            className="shrink-0 bg-white text-zinc-900 font-medium text-sm rounded-lg px-6 py-2.5 hover:bg-zinc-100 transition"
          >
            เริ่มคุยได้เลย →
          </Link>
        </div>
      </section>

    </div>
  )
}