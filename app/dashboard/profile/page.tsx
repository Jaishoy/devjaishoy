import { getProfile } from '@/lib/user'
import ProfileForm from './_components/ProfileForm'

export default async function ProfilePage() {
  const profile = await getProfile()
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-xl mx-auto px-6 pt-12 pb-24">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-zinc-100">Profile</h1>
          <p className="text-zinc-500 text-sm mt-0.5">แก้ไขข้อมูลส่วนตัวครับ</p>
        </div>
        <ProfileForm profile={profile} />
      </div>
    </div>
  )
}