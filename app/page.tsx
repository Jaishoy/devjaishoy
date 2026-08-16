import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const stack = [
  'Next.js', 'Vite JS', 'Vue.js', 'React', 'TypeScript', 'Tailwind CSS',
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
    <div className="min-h-screen bg-zinc-950 overflow-x-hidden">

      {/* Ambient glow background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-zinc-800/20 rounded-full blur-3xl" />
        <div className="absolute top-32 right-1/4 w-64 h-64 bg-zinc-700/10 rounded-full blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-6 pt-28 pb-24">
        <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-zinc-400 text-xs tracking-wide">Available for freelance work</p>
        </div>

        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6">
          <span className="text-zinc-100">Hello, I'm </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
            devjaishoy
          </span>
          <br />
          <span className="text-zinc-500 text-4xl md:text-5xl font-medium">
            Full-stack Developer
          </span>
        </h1>

        <p className="text-zinc-400 text-base leading-relaxed max-w-xl mb-10">
          I'm DevJaishoy or you can call me Ja. I'm a full-stack developer who will create
          your web application — Front-end, Back-end, or everything in between!
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/chat"
            className="group inline-flex items-center gap-2 bg-white text-zinc-900 font-medium text-sm rounded-xl px-6 py-3 hover:bg-zinc-100 transition"
          >
            ติดต่อจ้างงาน
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-zinc-300 border border-zinc-700/80 text-sm rounded-xl px-6 py-3 hover:border-zinc-500 hover:text-white hover:bg-zinc-900 transition"
          >
            ดูผลงาน
          </Link>
        </div>
      </section>

      {/* Stack */}
      <section className="relative max-w-5xl mx-auto px-6 pb-24">
        <p className="text-xs text-zinc-600 uppercase tracking-widest mb-5">Tech Stack</p>
        <div className="flex flex-wrap gap-2">
          {stack.map(s => (
            <span
              key={s}
              className="text-xs text-zinc-500 border border-zinc-800 bg-zinc-900/50 rounded-full px-3.5 py-1.5 hover:border-zinc-600 hover:text-zinc-300 transition cursor-default"
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      </div>

      {/* Featured Portfolio */}
      <section className="relative max-w-5xl mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-zinc-600 uppercase tracking-widest mb-1">Featured work</p>
            <h2 className="text-xl font-medium text-zinc-200">ผลงานล่าสุด</h2>
          </div>
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition"
          >
            ดูทั้งหมด
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {!featured || featured.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="w-full h-44 bg-zinc-800/80 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-zinc-800 rounded-lg animate-pulse w-3/4" />
                  <div className="h-3 bg-zinc-800/60 rounded-lg animate-pulse" />
                  <div className="h-3 bg-zinc-800/40 rounded-lg animate-pulse w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featured.map(item => (
              <Link
                key={item.id}
                href={`/portfolio/${item.id}`}
                className="group bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-300"
              >
                {item.cover_url ? (
                  <div className="overflow-hidden">
                    <img
                      src={item.cover_url}
                      alt={item.title}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full h-44 bg-zinc-800/80 flex items-center justify-center">
                    <span className="text-zinc-600 text-xs">No image</span>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-zinc-100 text-sm font-medium mb-2 group-hover:text-white transition">
                    {item.title}
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 mb-3">
                    {item.description}
                  </p>
                  {item.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-xs text-zinc-600 bg-zinc-800/80 px-2 py-0.5 rounded-full">
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

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      </div>

      {/* CTA */}
      <section className="relative max-w-5xl mx-auto px-6 py-24">
        <div className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl px-8 py-12">
          {/* subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">Let's work together</p>
              <h2 className="text-zinc-100 font-medium text-2xl mb-2">
                "Do you have a project in mind?"
              </h2>
              <p className="text-zinc-500 text-sm">Get free consultation — no cost for inquiry</p>
            </div>
            <Link
              href="/chat"
              className="shrink-0 group inline-flex items-center gap-2 bg-white text-zinc-900 font-medium text-sm rounded-xl px-7 py-3 hover:bg-zinc-100 transition"
            >
              เริ่มคุยได้เลย
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}