import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const adminClient = createAdminClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const { data: job } = await adminClient
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single()

    if (!job) return NextResponse.json({ error: 'not found' }, { status: 404 })
    if (job.client_id !== user.id) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    if (job.status !== 'sent') return NextResponse.json({ error: 'cannot reject' }, { status: 400 })

    await adminClient.from('jobs').update({ status: 'rejected' }).eq('id', id)

    // อัปเดต metadata ของ message quotation
    await adminClient
      .from('messages')
      .update({
        metadata: { ...job, status: 'rejected' }
      })
      .eq('conversation_id', job.conversation_id)
      .eq('type', 'quotation')
      .contains('metadata', { job_id: id })

    // ส่งข้อความแจ้ง
    await adminClient.from('messages').insert({
      conversation_id: job.conversation_id,
      sender_id: user.id,
      content: `ขออภัยครับ ผมขอปฏิเสธใบเสนอราคา "${job.title}" ครับ`,
      type: 'text',
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}