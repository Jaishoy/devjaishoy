'use client'

type Props = {
  metadata: {
    job_id: string
    payment_url: string
    amount: number
    title: string
    status: string
  }
  isAdmin: boolean
}

export default function PaymentCard({ metadata, isAdmin }: Props) {
  const fmt = (n: number) => `฿${n.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`

  const isPaid = metadata.status === 'paid'

  return (
    <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-700 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300">
              <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <p className="text-zinc-300 text-xs font-medium">ลิงก์ชำระเงิน</p>
        </div>
        {isPaid ? (
          <span className="text-xs px-2.5 py-1 rounded-full border text-emerald-400 bg-emerald-950/40 border-emerald-900/50 font-medium">
            ชำระแล้ว
          </span>
        ) : (
          <span className="text-xs px-2.5 py-1 rounded-full border text-amber-400 bg-amber-950/40 border-amber-900/50 font-medium">
            รอชำระ
          </span>
        )}
      </div>

      <div className="px-4 py-3 space-y-3">
        <p className="text-zinc-200 text-sm font-medium">{metadata.title}</p>
        <div className="bg-zinc-800/60 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-zinc-500 text-sm">ยอดที่ต้องชำระ</span>
          <span className="text-zinc-100 font-semibold">{fmt(metadata.amount)}</span>
        </div>

        {!isAdmin && !isPaid && (
          <a
            href={metadata.payment_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full text-sm text-zinc-900 bg-white rounded-xl py-2.5 hover:bg-zinc-100 transition font-semibold"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
            ชำระเงินผ่าน Stripe
          </a>
        )}

        {isPaid && (
          <div className="flex items-center gap-2 text-emerald-400 text-sm justify-center py-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            ชำระเงินเรียบร้อยแล้ว
          </div>
        )}
      </div>
    </div>
  )
}