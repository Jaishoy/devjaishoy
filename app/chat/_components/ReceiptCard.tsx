type Props = {
  metadata: {
    job_id: string
    receipt_no: string
    title: string
    total: number
    pdf_url: string
    paid_at: string
  }
}

export default function ReceiptCard({ metadata }: Props) {
  const fmt = (n: number) => `฿${n.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`

  return (
    <div className="w-full max-w-sm bg-zinc-900 border border-emerald-900/40 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800/60 flex items-center justify-between bg-emerald-950/20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-900/40 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div>
            <p className="text-emerald-300 text-xs font-medium">ใบเสร็จรับเงิน</p>
            <p className="text-zinc-600 text-xs">{metadata.receipt_no}</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full border text-emerald-400 bg-emerald-950/40 border-emerald-900/50 font-medium">
          ✓ ชำระแล้ว
        </span>
      </div>

      <div className="px-4 py-3 space-y-3">
        <p className="text-zinc-200 text-sm font-medium">{metadata.title}</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-zinc-800/60 rounded-lg px-3 py-2">
            <p className="text-zinc-600 mb-0.5">ยอดที่ชำระ</p>
            <p className="text-emerald-400 font-semibold text-sm">{fmt(metadata.total)}</p>
          </div>
          <div className="bg-zinc-800/60 rounded-lg px-3 py-2">
            <p className="text-zinc-600 mb-0.5">วันที่ชำระ</p>
            <p className="text-zinc-200 font-semibold">{metadata.paid_at}</p>
          </div>
        </div>

        <a
          href={metadata.pdf_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full text-sm text-zinc-400 border border-zinc-700 rounded-xl py-2 hover:border-zinc-500 hover:text-zinc-200 transition"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          ดาวน์โหลดใบเสร็จ PDF
        </a>
      </div>
    </div>
  )
}