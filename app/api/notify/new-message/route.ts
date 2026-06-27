import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse, type NextRequest } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(request: NextRequest) {
  // ตรวจสอบ secret กันคนอื่นยิงมาปลอม
  const secret = request.headers.get('x-webhook-secret')
  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const message = body.record // Supabase webhook ส่ง row ใหม่มาใน record

  if (!message) {
    return NextResponse.json({ error: 'no record' }, { status: 400 })
  }

  const adminClient = createAdminClient()

  // เช็คว่าคนส่งเป็น admin หรือไม่ ถ้าเป็น admin ไม่ต้องแจ้งเตือน (กันแจ้งเตือนตัวเอง)
  const { data: sender } = await adminClient
    .from('users')
    .select('username, email, role')
    .eq('uid', message.sender_id)
    .single()

  if (!sender || sender.role === 'admin') {
    return NextResponse.json({ skipped: true })
  }

  // ดึง conversation id เพื่อทำลิงก์ตอบกลับ
  const conversationId = message.conversation_id

  const hasImages = message.image_urls?.length > 0
  const preview = message.content?.trim()
    ? message.content
    : hasImages ? '📎 ส่งรูปภาพมา' : 'ส่งข้อความใหม่'

  try {
    await resend.emails.send({
      from: 'Devjaishoy Chat <onboarding@resend.dev>', // ใช้ test domain ของ resend ก่อนได้
      to: process.env.ADMIN_NOTIFY_EMAIL!,
      subject: `💬 ข้อความใหม่จาก ${sender.username}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <p style="color:#666; font-size:13px;">มีข้อความใหม่เข้ามาในเว็บไซต์ครับ</p>
          <p style="font-weight:600; font-size:15px; margin-bottom:4px;">${sender.username}</p>
          <p style="font-size:13px; color:#999; margin-top:0;">${sender.email}</p>
          <div style="background:#f4f4f5; border-radius:8px; padding:12px 16px; margin:16px 0; font-size:14px;">
            ${preview}
          </div>
          <a href="https://devjaishoy.vercel.app/admin/chat/${conversationId}"
             style="display:inline-block; background:#18181b; color:#fff; text-decoration:none; padding:10px 20px; border-radius:8px; font-size:13px;">
            ตอบกลับเลย →
          </a>
        </div>
      `,
    })

    return NextResponse.json({ sent: true })
  } catch (err: any) {
    console.error('Resend error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}