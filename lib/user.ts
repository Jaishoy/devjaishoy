import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type UserProfile = {
  uid: string
  username: string
  email: string
  role: 'user' | 'admin'
  created_at: string
}

// ดึง profile ของ user ที่ login อยู่
// ถ้าไม่ได้ login จะ redirect ไป /auth/login
export async function getProfile(): Promise<UserProfile> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/dashboard')

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('uid', user.id)
    .single()

  if (error || !data) redirect('/')

  return data as UserProfile
}

// ตรวจสอบว่าเป็น admin หรือไม่
export async function requireAdmin(): Promise<UserProfile> {
  const profile = await getProfile()
  if (profile.role !== 'admin') redirect('/dashboard')
  return profile
}