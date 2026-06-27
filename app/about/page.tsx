import Link from 'next/link'

const experience = [
  {
    year: '2024 — ปัจจุบัน',
    role: 'Freelance Full-stack Developer',
    desc: 'Full-stack website development services on Fastwork.',
  },
  {
    year: '2024',
    role: 'Software engineer',
    desc: 'Utilized Grafana and Prometheus to identify and resolve a critical performance bottleneck in the database, reducing load time by 15%',
  },
  {
    year: '2024',
    role: 'Full-stack Developer',
    desc: 'Developed a full-stack application, ensuring seamless integration between vite js, Next js front-end and Express.js back-end.',
  },
  {
    year: '2024',
    role: 'B.S. Computer Science',
    desc: 'B.S. Computer Science (Cyber Security Program) Khon Kaen University | January 2024 – Present (Expected Graduation Date: May 2027)',
  },
]

const socials = [
  {
    label: 'GitHub',
    href: 'https://github.com/Jaishoy',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: 'Fastwork',
    href: 'https://fastwork.co/user/devjaishoy',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 2h11.5c.8 0 1.5.7 1.5 1.5v3c0 .8-.7 1.5-1.5 1.5H10v3.5h5.5c.8 0 1.5.7 1.5 1.5v3c0 .8-.7 1.5-1.5 1.5H10V22H4V2z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:devjaishoy@gmail.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-24">

        {/* Bio */}
        <div className="flex flex-col sm:flex-row gap-6 items-start mb-14">
          <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 text-zinc-500 text-lg font-medium">
            <img src="DevJaishoyLogo.png" alt="DevJaishoy" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100 mb-1">devjaishoy</h1>
            <p className="text-zinc-500 text-sm mb-4">Full-stack Developer · Freelancer</p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Hello, My name is Jakree Sittipun or you can call me DevJaishoy! I’m developer who will manipulate your application and It’s something about me.
            </p>
          </div>
        </div>

        {/* Experience */}
        <div className="mb-14">
          <p className="text-xs text-zinc-600 uppercase tracking-widest mb-6">Experience</p>
          <div className="space-y-6">
            {experience.map((exp, i) => (
              <div key={i} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
                  {i < experience.length - 1 && (
                    <div className="w-px flex-1 bg-zinc-800 mt-2" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="text-xs text-zinc-600 mb-1">{exp.year}</p>
                  <p className="text-zinc-200 text-sm font-medium mb-1">{exp.role}</p>
                  <p className="text-zinc-500 text-sm leading-relaxed">{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social links */}
        <div className="mb-14">
          <p className="text-xs text-zinc-600 uppercase tracking-widest mb-4">Contact & Social</p>
          <div className="flex flex-wrap gap-3">
            {socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-zinc-400 border border-zinc-800 rounded-lg px-4 py-2 hover:border-zinc-600 hover:text-zinc-200 transition"
              >
                {s.icon}
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="text-zinc-100 font-medium mb-1">สนใจร่วมงานกันครับ</p>
            <p className="text-zinc-500 text-sm">พร้อมรับงานใหม่ ติดต่อมาได้เลย</p>
          </div>
          <Link
            href="/chat"
            className="shrink-0 bg-white text-zinc-900 font-medium text-sm rounded-lg px-5 py-2.5 hover:bg-zinc-100 transition"
          >
            ติดต่อเลย →
          </Link>
        </div>

      </div>
    </div>
  )
}