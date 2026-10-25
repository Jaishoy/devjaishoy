'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  metadata: {
    job_id: string
    quotation_no: string
    title: string
    total: number
    timeline_days: number
    revisions: number
    pdf_url: string
    status: string
  }
  isOwnMessage: boolean
  isAdmin: boolean
}

export default function QuotationCard({ metadata, isOwnMessage, isAdmin }: Props) {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [status, setStatus] = useState(metadata.status)
  const fmt = (n: number) => `฿${n.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`

  async function handleAction(action: 'approve' | 'reject') {
    setLoading(action)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      const res = await fetch(`/api/jobs/${metadata.job_id}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session?.access_token}` },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      if (action === 'approve') {
        const data = await res.json()
        window.open(data.payment_url, '_blank')
        setStatus('approved')
      } else {
        setStatus('rejected')
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(null)
    }
  }

  const statusLabel: Record<string, { label: string; className: string }> = {
    sent:     { label: 'รอการตอบรับ', className: 'text-amber-400 bg-amber-950/40 border-amber-900/50' },
    approved: { label: 'อนุมัติแล้ว', className: 'text-blue-400 bg-blue-950/40 border-blue-900/50' },
    rejected: { label: 'ปฏิเสธแล้ว', className: 'text-red-400 bg-red-950/40 border-red-900/50' },
    paid:     { label: 'ชำระแล้ว', className: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50' },
  }

  const st = statusLabel[status] ?? statusLabel['sent']

  return (
    <div className={`w-full max-w-sm rounded-2xl border overflow-hidden ${
      isOwnMessage
        ? 'bg-zinc-800 border-zinc-700'
        : 'bg-zinc-900 border-zinc-800'
    }`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-700 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div>
            <p className="text-zinc-300 text-xs font-medium">ใบเสนอราคา</p>
            <p className="text-zinc-600 text-xs">{metadata.quotation_no}</p>
          </div>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${st.className}`}>
          {st.label}
        </span>
      </div>

      {/* Content */}
      <div className="px-4 py-3 space-y-3">
        <div>
          <p className="text-zinc-100 font-medium text-sm mb-0.5">{metadata.title}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-zinc-800/60 rounded-lg px-3 py-2">
            <p className="text-zinc-600 mb-0.5">ยอดรวม</p>
            <p className="text-zinc-100 font-semibold">{fmt(metadata.total)}</p>
          </div>
          <div className="bg-zinc-800/60 rounded-lg px-3 py-2">
            <p className="text-zinc-600 mb-0.5">ระยะเวลา</p>
            <p className="text-zinc-100 font-semibold">{metadata.timeline_days} วัน</p>
          </div>
          <div className="bg-zinc-800/60 rounded-lg px-3 py-2 col-span-2">
            <p className="text-zinc-600 mb-0.5">แก้ไขได้</p>
            <p className="text-zinc-100 font-semibold">{metadata.revisions} ครั้ง</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 space-y-2">
        {/* Download PDF */}
        <a
          href={metadata.pdf_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full text-sm text-zinc-400 border border-zinc-700 rounded-xl py-2 hover:border-zinc-500 hover:text-zinc-200 transition"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          ดาวน์โหลด PDF
        </a>

        {/* Approve / Reject — แสดงเฉพาะ user ที่เป็น client และ status = sent */}
        {!isAdmin && status === 'sent' && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAction('reject')}
              disabled={!!loading}
              className="text-sm text-red-400 border border-red-900/50 rounded-xl py-2 hover:bg-red-950/30 disabled:opacity-40 transition"
            >
              {loading === 'reject' ? '...' : 'ปฏิเสธ'}
            </button>
            <button
              onClick={() => handleAction('approve')}
              disabled={!!loading}
              className="text-sm text-zinc-900 bg-white rounded-xl py-2 hover:bg-zinc-100 disabled:opacity-40 transition font-medium"
            >
              {loading === 'approve' ? '...' : 'อนุมัติ & ชำระ'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}