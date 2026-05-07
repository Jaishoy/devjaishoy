'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function RegisterPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${location.origin}/auth/callback?next=/dashboard`,
      },
    })
    if (error) {
      setError(error.message)
    } else {
      setDone(true)
    }
    setLoading(false)
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-green-950 border border-green-800 flex items-center justify-center mx-auto">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-zinc-100">ยืนยัน Email ของคุณ</h2>
          <p className="text-sm text-zinc-500">
            เราส่ง link ยืนยันไปที่{' '}
            <span className="text-zinc-300 font-medium">{email}</span>{' '}
            แล้วครับ
          </p>
          <a
            href="/auth/login"
            className="inline-block mt-2 text-sm text-zinc-400 hover:text-zinc-200 transition"
          >
            กลับไปหน้าเข้าสู่ระบบ →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-8 space-y-6">

        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-zinc-100">สมัครสมาชิก</h1>
          <p className="text-sm text-zinc-500">สร้างบัญชีใหม่ได้เลยครับ</p>
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-950/50 border border-red-900 px-4 py-2.5 rounded-lg">
            {error}
          </p>
        )}

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition"
          />
          <input
            type="password"
            placeholder="Password (อย่างน้อย 6 ตัว)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder-zinc-500 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition"
          />
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-white text-zinc-900 rounded-lg py-2.5 text-sm font-semibold hover:bg-zinc-100 disabled:opacity-40 transition"
          >
            {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
          </button>
        </div>

        <p className="text-sm text-center text-zinc-500">
          มีบัญชีแล้ว?{' '}
          <a href="/auth/login" className="text-zinc-200 font-medium hover:text-white transition">
            เข้าสู่ระบบ
          </a>
        </p>
      </div>
    </div>
  )
}