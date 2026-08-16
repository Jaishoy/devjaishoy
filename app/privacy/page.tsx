export default function PrivacyPage() {
  const lastUpdated = '16 สิงหาคม 2568'

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="relative border-b border-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6 pt-16 pb-12">
          <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-semibold text-zinc-100 mb-3">Privacy Policy</h1>
          <p className="text-zinc-500 text-sm">อัปเดตล่าสุด: {lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-10 pb-24 space-y-12">

        {/* Intro */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm leading-relaxed">
            นโยบายความเป็นส่วนตัวนี้อธิบายวิธีที่ <strong className="text-zinc-200">devjaishoy</strong>{' '}
            ("เรา", "ผู้ให้บริการ") เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของท่าน
            ภายใต้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
            และกฎหมายที่เกี่ยวข้อง
          </p>
        </div>

        <Section index="1" title="ข้อมูลที่เราเก็บรวบรวม">
          <p>เราเก็บรวบรวมข้อมูลส่วนบุคคลของท่านดังต่อไปนี้:</p>
          <SubSection title="1.1 ข้อมูลที่ท่านให้โดยตรง">
            <ul>
              <li><strong className="text-zinc-300">ข้อมูลบัญชี</strong> — ชื่อผู้ใช้ (Username), อีเมล, รหัสผ่าน (เข้ารหัสเสมอ)</li>
              <li><strong className="text-zinc-300">ข้อมูลธุรกิจ</strong> — ชื่อบริษัท, เลขประจำตัวผู้เสียภาษี, ที่อยู่, เบอร์โทรศัพท์ (กรอกโดยสมัครใจ)</li>
              <li><strong className="text-zinc-300">ข้อความและไฟล์</strong> — ข้อความที่ส่งผ่านระบบ chat รวมถึงรูปภาพที่แนบมา</li>
            </ul>
          </SubSection>
          <SubSection title="1.2 ข้อมูลที่เก็บโดยอัตโนมัติ">
            <ul>
              <li><strong className="text-zinc-300">ข้อมูล Session</strong> — Token การยืนยันตัวตน, วันเวลาที่เข้าใช้งาน</li>
              <li><strong className="text-zinc-300">ข้อมูลจาก OAuth</strong> — ชื่อ, อีเมล, รูปโปรไฟล์จาก Google หรือ GitHub (เฉพาะที่จำเป็น)</li>
            </ul>
          </SubSection>
        </Section>

        <Section index="2" title="วัตถุประสงค์ในการใช้ข้อมูล">
          <p>เราใช้ข้อมูลส่วนบุคคลของท่านเพื่อวัตถุประสงค์ดังต่อไปนี้:</p>
          <div className="space-y-3 mt-4">
            {[
              { purpose: 'ยืนยันตัวตนและจัดการบัญชีผู้ใช้', basis: 'สัญญา' },
              { purpose: 'ให้บริการระบบ chat เพื่อติดต่อสอบถามและว่าจ้างงาน', basis: 'สัญญา' },
              { purpose: 'ส่งการแจ้งเตือนเมื่อมีข้อความใหม่', basis: 'ประโยชน์โดยชอบด้วยกฎหมาย' },
              { purpose: 'จัดทำใบเสร็จ/ใบแจ้งหนี้จากข้อมูลธุรกิจ', basis: 'สัญญา' },
              { purpose: 'ปรับปรุงและพัฒนาบริการ', basis: 'ประโยชน์โดยชอบด้วยกฎหมาย' },
              { purpose: 'ปฏิบัติตามกฎหมายและข้อบังคับที่เกี่ยวข้อง', basis: 'หน้าที่ตามกฎหมาย' },
            ].map((item, i) => (
              <div key={i} className="flex items-start justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-xl px-4 py-3">
                <p className="text-zinc-400 text-sm">{item.purpose}</p>
                <span className="shrink-0 text-xs text-zinc-500 border border-zinc-700 rounded-full px-2.5 py-1">
                  {item.basis}
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section index="3" title="การเปิดเผยข้อมูลให้บุคคลที่สาม">
          <p>เราไม่ขายหรือให้เช่าข้อมูลส่วนบุคคลของท่านแก่บุคคลภายนอก โดยเราเปิดเผยข้อมูลเฉพาะในกรณีดังต่อไปนี้:</p>
          <SubSection title="ผู้ให้บริการที่เราใช้งาน (Data Processors)">
            <ul>
              <li>
                <strong className="text-zinc-300">Supabase</strong> — ฐานข้อมูลและระบบยืนยันตัวตน
                {' '}<a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2 transition text-xs">Privacy Policy ↗</a>
              </li>
              <li>
                <strong className="text-zinc-300">Vercel</strong> — ระบบ hosting เว็บไซต์
                {' '}<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2 transition text-xs">Privacy Policy ↗</a>
              </li>
              <li>
                <strong className="text-zinc-300">Resend</strong> — ระบบส่งอีเมลแจ้งเตือน
                {' '}<a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2 transition text-xs">Privacy Policy ↗</a>
              </li>
              <li>
                <strong className="text-zinc-300">Google / GitHub</strong> — OAuth (เมื่อท่านเลือกใช้การเข้าสู่ระบบผ่านช่องทางดังกล่าว)
              </li>
            </ul>
          </SubSection>
          <SubSection title="กรณีอื่น">
            <ul>
              <li>เมื่อมีคำสั่งศาลหรือหน่วยงานรัฐที่มีอำนาจตามกฎหมาย</li>
              <li>เพื่อปกป้องสิทธิ ทรัพย์สิน หรือความปลอดภัยของผู้ใช้และผู้ให้บริการ</li>
            </ul>
          </SubSection>
        </Section>

        <Section index="4" title="ระยะเวลาการเก็บรักษาข้อมูล">
          <div className="space-y-3">
            {[
              { type: 'ข้อมูลบัญชีผู้ใช้', period: 'ตลอดอายุบัญชี + 30 วันหลังลบบัญชี' },
              { type: 'ข้อความใน chat', period: 'ตลอดอายุบัญชี หรือจนกว่าจะร้องขอลบ' },
              { type: 'ข้อมูลธุรกิจ (ใบแจ้งหนี้)', period: '5 ปี ตามกฎหมายภาษีอากร' },
              { type: 'ไฟล์รูปภาพใน chat', period: 'ตลอดอายุบัญชี หรือจนกว่าจะร้องขอลบ' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-xl px-4 py-3">
                <p className="text-zinc-400 text-sm">{item.type}</p>
                <p className="text-zinc-500 text-xs text-right">{item.period}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section index="5" title="สิทธิของเจ้าของข้อมูล (PDPA)">
          <p>ภายใต้ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 ท่านมีสิทธิดังต่อไปนี้:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {[
              { right: 'สิทธิในการเข้าถึง', desc: 'ขอดูข้อมูลส่วนบุคคลที่เราเก็บไว้' },
              { right: 'สิทธิในการแก้ไข', desc: 'ขอแก้ไขข้อมูลที่ไม่ถูกต้องหรือไม่สมบูรณ์' },
              { right: 'สิทธิในการลบ', desc: 'ขอให้ลบข้อมูลเมื่อไม่จำเป็นอีกต่อไป' },
              { right: 'สิทธิในการคัดค้าน', desc: 'คัดค้านการประมวลผลข้อมูลในบางกรณี' },
              { right: 'สิทธิในการโอนย้าย', desc: 'ขอรับข้อมูลในรูปแบบที่ใช้งานได้ทั่วไป' },
              { right: 'สิทธิในการถอนความยินยอม', desc: 'ถอนความยินยอมได้ทุกเมื่อโดยไม่กระทบสิทธิที่เกิดขึ้นก่อนหน้า' },
            ].map((item, i) => (
              <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded-xl px-4 py-3">
                <p className="text-zinc-200 text-sm font-medium mb-1">{item.right}</p>
                <p className="text-zinc-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-zinc-500 text-sm">
            หากต้องการใช้สิทธิดังกล่าว กรุณาติดต่อเราผ่านหน้า{' '}
            <a href="/chat" className="text-zinc-300 hover:text-white underline underline-offset-2 transition">
              Chat
            </a>{' '}
            หรืออีเมล{' '}
            <a href="mailto:devjaishoy@gmail.com" className="text-zinc-300 hover:text-white underline underline-offset-2 transition">
              devjaishoy@gmail.com
            </a>
          </p>
        </Section>

        <Section index="6" title="ความปลอดภัยของข้อมูล">
          <p>เราดำเนินมาตรการรักษาความปลอดภัยดังต่อไปนี้:</p>
          <div className="space-y-2 mt-4">
            {[
              'ข้อมูลทั้งหมดถูกส่งผ่านการเข้ารหัส HTTPS/TLS',
              'รหัสผ่านถูกเข้ารหัสด้วย bcrypt ก่อนบันทึก ไม่มีการเก็บรหัสผ่านในรูปแบบ plain text',
              'ระบบ Row Level Security (RLS) ป้องกันการเข้าถึงข้อมูลข้ามผู้ใช้',
              'การเข้าถึงระดับ admin ต้องผ่านการยืนยันตัวตน 2 ชั้น',
              'Service Role Key ถูกเก็บในฝั่ง server เท่านั้น ไม่เปิดเผยต่อ client',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-zinc-600 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </Section>

        <Section index="7" title="การใช้ Cookies">
          <p>เราใช้ cookies เฉพาะที่จำเป็นต่อการทำงานของระบบ ได้แก่:</p>
          <div className="space-y-3 mt-4">
            {[
              { name: 'sb-[project]-auth-token', purpose: 'Session token สำหรับการยืนยันตัวตน', duration: 'ตามการตั้งค่า session' },
              { name: '__next_hmr_refresh_hash__', purpose: 'ใช้ใน development เท่านั้น', duration: 'Session' },
            ].map((item, i) => (
              <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded-xl px-4 py-3 space-y-1">
                <p className="text-zinc-300 text-xs font-mono">{item.name}</p>
                <p className="text-zinc-500 text-xs">{item.purpose} · {item.duration}</p>
              </div>
            ))}
          </div>
          <p className="text-zinc-500 text-sm mt-4">
            เราไม่ใช้ tracking cookies หรือ cookies เพื่อวัตถุประสงค์ทางการตลาดครับ
          </p>
        </Section>

        <Section index="8" title="การเปลี่ยนแปลงนโยบาย">
          <p>
            เราอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว
            โดยจะแจ้งให้ท่านทราบผ่านหน้าเว็บไซต์นี้พร้อมระบุวันที่อัปเดตล่าสุด
            การใช้บริการต่อเนื่องหลังจากการเปลี่ยนแปลงถือว่าท่านยอมรับนโยบายใหม่
          </p>
        </Section>

        <Section index="9" title="ติดต่อเรา">
          <p>หากมีคำถามหรือข้อกังวลเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ กรุณาติดต่อ:</p>
          <div className="mt-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-2">
            <p className="text-zinc-200 font-medium">devjaishoy</p>
            <p className="text-zinc-500 text-sm">
              Email:{' '}
              <a href="mailto:devjaishoy@gmail.com" className="text-zinc-300 hover:text-white underline underline-offset-2 transition">
                devjaishoy@gmail.com
              </a>
            </p>
            <p className="text-zinc-500 text-sm">
              Chat:{' '}
              <a href="/chat" className="text-zinc-300 hover:text-white underline underline-offset-2 transition">
                devjaishoy.vercel.app/chat
              </a>
            </p>
          </div>
        </Section>

      </div>
    </div>
  )
}

function Section({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xs text-zinc-600 font-mono">{index}.</span>
        <h2 className="text-lg font-medium text-zinc-100">{title}</h2>
      </div>
      <div className="text-zinc-400 text-sm leading-relaxed space-y-4 pl-5">
        {children}
      </div>
    </div>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-zinc-300 text-sm font-medium mb-2">{title}</p>
      <ul className="space-y-2 list-none">
        {children}
      </ul>
    </div>
  )
}