import Link from 'next/link'

const services = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/>
      </svg>
    ),
    title: 'Front-end Development',
    desc: 'ออกแบบและพัฒนา UI/UX ที่สวยงาม responsive ทุกอุปกรณ์ ด้วย React, Next.js และ Tailwind CSS',
    items: ['React / Next.js', 'Responsive design', 'UI/UX implementation', 'Performance optimization'],
    message: 'สวัสดีครับ ผมสนใจบริการ Front-end Development ครับ',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    title: 'Back-end Development',
    desc: 'พัฒนา API, ระบบฐานข้อมูล และ logic ฝั่ง server ที่แข็งแกร่ง ปลอดภัย พร้อมรองรับการขยายระบบ',
    items: ['REST API', 'Supabase / PostgreSQL', 'Authentication & Authorization', 'Row Level Security'],
    message: 'สวัสดีครับ ผมสนใจบริการ Back-end Development ครับ',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    title: 'Full-stack & Deploy',
    desc: 'รับทำโปรเจกต์แบบครบวงจรตั้งแต่ต้นจนจบ พร้อม deploy ขึ้น production และดูแลหลัง launch',
    items: ['Full-stack Next.js', 'Vercel / cloud deploy', 'CI/CD setup', 'Domain & SSL'],
    message: 'สวัสดีครับ ผมสนใจบริการ Full-stack & Deploy ครับ',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'ปรึกษา & สอบถาม',
    desc: 'ให้คำแนะนำด้านการพัฒนาเว็บไซต์ เลือก tech stack, วางแผนโปรเจกต์ หรือ review โค้ด',
    items: ['Tech stack consulting', 'Project planning', 'Code review', 'ปรึกษาฟรีครั้งแรก'],
    message: 'สวัสดีครับ ผมอยากขอคำปรึกษาเกี่ยวกับการพัฒนาเว็บไซต์ครับ',
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-zinc-950">

      {/* Hero */}
      <div className="relative border-b border-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-12">
          <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Services</p>
          <h1 className="text-4xl font-semibold text-zinc-100 mb-3">What I do</h1>
          <p className="text-zinc-500 text-sm max-w-md">
            รับงาน freelance ทุกขนาด ตั้งแต่เว็บไซต์ส่วนตัวไปจนถึงระบบ enterprise ครับ — กดการ์ดเพื่อสอบถามได้เลย
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-10 pb-24">

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {services.map(s => (
            <Link
              key={s.title}
              href={`/chat?message=${encodeURIComponent(s.message)}`}
              className="group relative bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 hover:bg-zinc-900 transition-all duration-300 overflow-hidden"
            >
              {/* hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-700/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 mb-5 group-hover:border-zinc-600 group-hover:text-zinc-200 transition">
                  {s.icon}
                </div>

                <h2 className="text-zinc-100 font-medium text-base mb-2 group-hover:text-white transition">
                  {s.title}
                </h2>
                <p className="text-zinc-500 text-sm leading-relaxed mb-5">{s.desc}</p>

                <ul className="space-y-2 mb-6">
                  {s.items.map(item => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-zinc-500">
                      <span className="w-1 h-1 rounded-full bg-zinc-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="inline-flex items-center gap-1.5 text-xs text-zinc-600 group-hover:text-zinc-300 transition">
                  สอบถามราคา
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Fastwork link */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <p className="text-zinc-200 text-sm font-medium">จ้างผ่าน Fastwork</p>
              <p className="text-zinc-500 text-xs mt-0.5">มีระบบ escrow คุ้มครองทั้งสองฝ่าย ปลอดภัยกว่า</p>
            </div>
          </div>
          <a
            href="https://fastwork.co/user/YOUR_FASTWORK_USERNAME"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 text-sm text-zinc-900 bg-zinc-100 hover:bg-white font-medium rounded-xl px-5 py-2.5 transition"
          >
            Fastwork Profile
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </a>
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl px-8 py-10">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-2">Free consultation</p>
              <h2 className="text-zinc-100 font-medium text-xl mb-1">ไม่แน่ใจว่าต้องการอะไร?</h2>
              <p className="text-zinc-500 text-sm">บอกความต้องการมา แล้วผมจะแนะนำให้ครับ</p>
            </div>
            <Link
              href="/chat?message=สวัสดีครับ%20ผมอยากปรึกษาเกี่ยวกับโปรเจกต์ครับ"
              className="shrink-0 group inline-flex items-center gap-2 bg-white text-zinc-900 font-medium text-sm rounded-xl px-6 py-3 hover:bg-zinc-100 transition"
            >
              คุยกับผม
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}