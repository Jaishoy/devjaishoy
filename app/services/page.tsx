import Link from 'next/link'

const services = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/>
      </svg>
    ),
    title: 'Front-end Development',
    desc: 'ออกแบบและพัฒนา UI/UX ที่สวยงาม responsive ทุกอุปกรณ์ ด้วย React, Next.js และ Tailwind CSS',
    items: ['React / Next.js', 'Responsive design', 'UI/UX implementation', 'Performance optimization'],
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    title: 'Back-end Development',
    desc: 'พัฒนา API, ระบบฐานข้อมูล และ logic ฝั่ง server ที่แข็งแกร่ง ปลอดภัย พร้อมรองรับการขยายระบบ',
    items: ['REST API', 'Supabase / PostgreSQL', 'Authentication & Authorization', 'Row Level Security'],
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    title: 'Full-stack & Deploy',
    desc: 'รับทำโปรเจกต์แบบครบวงจรตั้งแต่ต้นจนจบ พร้อม deploy ขึ้น production และดูแลหลัง launch',
    items: ['Full-stack Next.js', 'Vercel / cloud deploy', 'CI/CD setup', 'Domain & SSL'],
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'ปรึกษา & สอบถาม',
    desc: 'ให้คำแนะนำด้านการพัฒนาเว็บไซต์ เลือก tech stack, วางแผนโปรเจกต์ หรือ review โค้ด',
    items: ['Tech stack consulting', 'Project planning', 'Code review', 'ปรึกษาฟรีครั้งแรก'],
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-24">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-zinc-100 mb-2">Services</h1>
          <p className="text-zinc-500 text-sm max-w-lg">
            รับงาน freelance ทุกขนาด ตั้งแต่เว็บไซต์ส่วนตัวไปจนถึงระบบ enterprise ครับ
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {services.map(s => (
            <div
              key={s.title}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-600 transition"
            >
              <div className="text-zinc-400 mb-4">{s.icon}</div>
              <h2 className="text-zinc-100 font-medium text-base mb-2">{s.title}</h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-5">{s.desc}</p>
              <ul className="space-y-2">
                {s.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-zinc-400">
                    <span className="w-1 h-1 rounded-full bg-zinc-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-zinc-100 font-medium text-lg mb-1">
              ไม่แน่ใจว่าต้องการอะไร?
            </h2>
            <p className="text-zinc-500 text-sm">
              ปรึกษาฟรีไม่มีข้อผูกมัด บอกความต้องการมาแล้วผมจะแนะนำให้ครับ
            </p>
          </div>
          <Link
            href="/chat"
            className="shrink-0 bg-white text-zinc-900 font-medium text-sm rounded-lg px-6 py-2.5 hover:bg-zinc-100 transition"
          >
            คุยกับผม →
          </Link>
        </div>

      </div>
    </div>
  )
}