'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Item = { description: string; quantity: number; unit_price: number }

type Props = {
  conversationId: string
  clientId: string
  onClose: () => void
}

export default function JobForm({ conversationId, clientId, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [timelineDays, setTimelineDays] = useState(14)
  const [revisions, setRevisions] = useState(3)
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<Item[]>([
    { description: '', quantity: 1, unit_price: 0 }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const total = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0)
  const fmt = (n: number) => `฿${n.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`

  function updateItem(index: number, field: keyof Item, value: any) {
    setItems(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ))
  }

  function addItem() {
    setItems(prev => [...prev, { description: '', quantity: 1, unit_price: 0 }])
  }

  function removeItem(index: number) {
    if (items.length === 1) return
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit() {
    if (!title.trim() || !description.trim()) {
      setError('กรุณากรอก Title และ Description')
      return
    }
    if (items.some(i => !i.description.trim() || i.unit_price <= 0)) {
      setError('กรุณากรอกรายละเอียดและราคาให้ครบทุกรายการ')
      return
    }

    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          client_id: clientId,
          title: title.trim(),
          description: description.trim(),
          timeline_days: timelineDays,
          revisions,
          notes: notes.trim() || null,
          items: items.map(i => ({
            description: i.description.trim(),
            quantity: i.quantity,
            unit_price: i.unit_price,
          })),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'เกิดข้อผิดพลาด')
      }

      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
          <div>
            <h2 className="text-zinc-100 font-semibold">สร้างใบเสนอราคา</h2>
            <p className="text-zinc-500 text-xs mt-0.5">ระบบจะสร้าง PDF และส่งไปยัง user ในแชทอัตโนมัติ</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-200 transition w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {error && (
            <p className="text-sm text-red-400 bg-red-950/40 border border-red-900 px-4 py-2.5 rounded-lg">
              {error}
            </p>
          )}

          {/* Title */}
          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
              ชื่องาน *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="เช่น พัฒนาเว็บไซต์ E-commerce"
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
              รายละเอียดงาน *
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="อธิบายขอบเขตงาน สิ่งที่จะได้รับ..."
              rows={4}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-500 resize-none"
            />
          </div>

          {/* Timeline + Revisions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
                ระยะเวลา (วัน) *
              </label>
              <input
                type="number"
                value={timelineDays}
                onChange={e => setTimelineDays(Number(e.target.value))}
                min={1}
                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-500"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
                จำนวนครั้งที่แก้ได้ *
              </label>
              <input
                type="number"
                value={revisions}
                onChange={e => setRevisions(Number(e.target.value))}
                min={0}
                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-500"
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-zinc-500 uppercase tracking-widest">
                รายการค่าบริการ *
              </label>
              <button
                onClick={addItem}
                className="text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-lg px-3 py-1 hover:border-zinc-500 transition"
              >
                + เพิ่มรายการ
              </button>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 px-3 py-1.5 mb-1">
              <span className="col-span-6 text-xs text-zinc-600">รายละเอียด</span>
              <span className="col-span-2 text-xs text-zinc-600 text-center">จำนวน</span>
              <span className="col-span-3 text-xs text-zinc-600 text-right">ราคา/หน่วย</span>
              <span className="col-span-1"/>
            </div>

            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center bg-zinc-800/50 border border-zinc-800 rounded-xl px-3 py-2">
                  <input
                    type="text"
                    value={item.description}
                    onChange={e => updateItem(i, 'description', e.target.value)}
                    placeholder="รายละเอียดรายการ"
                    className="col-span-6 bg-transparent text-zinc-100 placeholder-zinc-600 text-sm outline-none"
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={e => updateItem(i, 'quantity', Number(e.target.value))}
                    min={1}
                    className="col-span-2 bg-transparent text-zinc-100 text-sm text-center outline-none"
                  />
                  <input
                    type="number"
                    value={item.unit_price || ''}
                    onChange={e => updateItem(i, 'unit_price', Number(e.target.value))}
                    placeholder="0"
                    min={0}
                    className="col-span-3 bg-transparent text-zinc-100 text-sm text-right outline-none placeholder-zinc-600"
                  />
                  <button
                    onClick={() => removeItem(i)}
                    disabled={items.length === 1}
                    className="col-span-1 text-zinc-700 hover:text-red-400 transition disabled:opacity-30 flex items-center justify-center"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-end mt-3">
              <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-5 py-2.5 flex items-center gap-4">
                <span className="text-zinc-500 text-sm">ยอดรวม</span>
                <span className="text-zinc-100 font-semibold">{fmt(total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
              หมายเหตุ (ถ้ามี)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="เงื่อนไขเพิ่มเติม, ข้อตกลง..."
              rows={2}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-500 resize-none"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-zinc-800 sticky bottom-0 bg-zinc-900">
          <button
            onClick={handleSubmit}
            disabled={loading || total === 0}
            className="flex-1 bg-white text-zinc-900 font-semibold text-sm rounded-xl py-2.5 hover:bg-zinc-100 disabled:opacity-40 transition"
          >
            {loading ? 'กำลังสร้าง PDF...' : `ส่งใบเสนอราคา ${fmt(total)}`}
          </button>
          <button
            onClick={onClose}
            className="text-sm text-zinc-400 border border-zinc-700 rounded-xl px-5 py-2.5 hover:border-zinc-500 transition"
          >
            ยกเลิก
          </button>
        </div>

      </div>
    </div>
  )
}