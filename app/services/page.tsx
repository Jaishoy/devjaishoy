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
    message: 'สวัสดีครับ ผมสนใจบริการ Front-end Development ครับ',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.5 2.5 0 1 1-3.5 3.5L6.5 20l-4 4 4-1.5 7.5-7.5z"/>
      </svg>
    ),
    title: 'Back-end Development',
    desc: 'พัฒนา API, ระบบฐานข้อมูล และ logic ฝั่ง server ที่แข็งแกร่ง ปลอดภัย พร้อมรองรับการขยายระบบ',
    items: ['REST API', 'Supabase / PostgreSQL', 'Authentication & Authorization', 'Row Level Security'],
    message: 'สวัสดีครับ ผมสนใจบริการ Back-end Development ครับ',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 18H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2z"/>
      </svg>
    ),
    title: 'Full-stack & Deploy',
    desc: 'รับทำโปรเจกต์แบบครบวงจรตั้งแต่ต้นจนจบ พร้อม deploy ขึ้น production และดูแลหลัง launch',
    items: ['Full-stack Next.js', 'Vercel / cloud deploy', 'CI/CD setup', 'Domain & SSL'],
    message: 'สวัสดีครับ ผมสนใจบริการ Full-stack & Deploy ครับ',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/>
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
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-24">

        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-zinc-100 mb-2">Services</h1>
          <p className="text-zinc-500 text-sm max-w-lg">
            รับงาน freelance ทุกขนาด ตั้งแต่เว็บไซต์ส่วนตัวไปจนถึงระบบ enterprise ครับ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {services.map(s => (
            <Link
              key={s.title}
              href={`/chat?message=${encodeURIComponent(s.message)}`}
              className="group bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-600 transition block"
            >
              <div className="text-zinc-400 mb-4 group-hover:text-zinc-200 transition">
                {s.icon}
              </div>
              <h2 className="text-zinc-100 font-medium text-base mb-2">{s.title}</h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-5">{s.desc}</p>
              <ul className="space-y-2 mb-5">
                {s.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-zinc-400">
                    <span className="w-1 h-1 rounded-full bg-zinc-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition">
                สอบถามราคา →
              </span>
            </Link>
          ))}
        </div>

        {/* Fastwork link */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-zinc-200 text-sm font-medium">จ้างผ่าน Fastwork</p>
            <p className="text-zinc-500 text-xs mt-0.5">ปลอดภัย มีระบบ escrow คุ้มครองทั้งสองฝ่าย</p>
          </div>
          
          <a href="https://fastwork.co/user/YOUR_FASTWORK_USERNAME"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-sm text-zinc-900 bg-zinc-100 hover:bg-white font-medium rounded-lg px-5 py-2 transition"
          >
            ดูโปรไฟล์ Fastwork ↗
          </a>
        </div>

        {/* CTA Banner */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-zinc-100 font-medium text-lg mb-1">ไม่แน่ใจว่าต้องการอะไร?</h2>
            <p className="text-zinc-500 text-sm">ปรึกษาฟรีไม่มีข้อผูกมัด บอกความต้องการมาแล้วผมจะแนะนำให้ครับ</p>
          </div>
          <Link
            href="/chat?message=สวัสดีครับ%20ผมอยากปรึกษาเกี่ยวกับโปรเจกต์ครับ"
            className="shrink-0 bg-white text-zinc-900 font-medium text-sm rounded-lg px-6 py-2.5 hover:bg-zinc-100 transition"
          >
            คุยกับผม →
          </Link>
        </div>

      </div>
    </div>
  )
}