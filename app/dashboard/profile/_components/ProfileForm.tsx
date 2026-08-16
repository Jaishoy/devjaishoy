'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import type { UserProfile } from '@/lib/user'
import { useRouter } from 'next/navigation'

type ExtendedProfile = UserProfile & {
  company_name?: string | null
  tax_id?: string | null
  address?: string | null
  phone?: string | null
}

export default function ProfileForm({ profile }: { profile: ExtendedProfile }) {
  const supabase = createClient()
  const router = useRouter()

  const [username, setUsername] = useState(profile.username ?? '')
  const [companyName, setCompanyName] = useState(profile.company_name ?? '')
  const [taxId, setTaxId] = useState(profile.tax_id ?? '')
  const [address, setAddress] = useState(profile.address ?? '')
  const [phone, setPhone] = useState(profile.phone ?? '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    setLoading(true)
    setSuccess(false)
    setError('')

    const { error } = await supabase
      .from('users')
      .update({
        username: username.trim(),
        company_name: companyName.trim() || null,
        tax_id: taxId.trim() || null,
        address: address.trim() || null,
        phone: phone.trim() || null,
      })
      .eq('uid', profile.uid)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      router.push('/dashboard')
    }
  }

  const fields = [
    {
      label: 'Username',
      value: username,
      onChange: setUsername,
      placeholder: 'ชื่อผู้ใช้',
      required: true,
    },
    {
      label: 'ชื่อบริษัท / Company Name',
      value: companyName,
      onChange: setCompanyName,
      placeholder: 'ชื่อบริษัทหรือองค์กร (ถ้ามี)',
    },
    {
      label: 'เลขประจำตัวผู้เสียภาษี',
      value: taxId,
      onChange: setTaxId,
      placeholder: 'Tax Identification Number (ถ้ามี)',
    },
    {
      label: 'ที่อยู่',
      value: address,
      onChange: setAddress,
      placeholder: 'ที่อยู่สำหรับออกใบเสร็จ (ถ้ามี)',
      multiline: true,
    },
    {
      label: 'เบอร์โทรศัพท์',
      value: phone,
      onChange: setPhone,
      placeholder: '08x-xxx-xxxx',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Read-only info */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Email</span>
          <span className="text-zinc-300">{profile.email}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">Role</span>
          <span className={profile.role === 'admin' ? 'text-amber-400 text-sm' : 'text-zinc-300 text-sm'}>
            {profile.role}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-zinc-500">สมาชิกตั้งแต่</span>
          <span className="text-zinc-300">
            {new Date(profile.created_at).toLocaleDateString('th-TH')}
          </span>
        </div>
      </div>

      {/* Editable fields */}
      {fields.map(f => (
        <div key={f.label}>
          <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">
            {f.label}{f.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {f.multiline ? (
            <textarea
              value={f.value}
              onChange={e => f.onChange(e.target.value)}
              placeholder={f.placeholder}
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-500 resize-none"
            />
          ) : (
            <input
              type="text"
              value={f.value}
              onChange={e => f.onChange(e.target.value)}
              placeholder={f.placeholder}
              className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-500"
            />
          )}
        </div>
      ))}

      {error && (
        <p className="text-sm text-red-400 bg-red-950/40 border border-red-900 px-4 py-2.5 rounded-lg">
          {error}
        </p>
      )}

      {success && (
        <p className="text-sm text-green-400 bg-green-950/40 border border-green-900 px-4 py-2.5 rounded-lg">
          บันทึกเรียบร้อยแล้วครับ ✓
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={loading || !username.trim()}
        className="w-full bg-white text-zinc-900 font-medium text-sm rounded-lg py-2.5 hover:bg-zinc-100 disabled:opacity-40 transition"
      >
        {loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
      </button>
    </div>
  )
}