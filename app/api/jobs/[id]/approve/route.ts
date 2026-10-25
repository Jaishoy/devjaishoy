import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { stripe } from '@/lib/stripe'

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

    // ดึง job + ตรวจสอบว่า user เป็น client
    const { data: job } = await adminClient
      .from('jobs')
      .select('*, job_items(*)')
      .eq('id', id)
      .single()

    if (!job) return NextResponse.json({ error: 'job not found' }, { status: 404 })
    if (job.client_id !== user.id) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    if (job.status !== 'sent') return NextResponse.json({ error: 'cannot approve' }, { status: 400 })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://devjaishoy.vercel.app'

    // สร้าง Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      currency: 'thb',
      line_items: job.job_items.map((item: any) => ({
        quantity: 1,
        price_data: {
          currency: 'thb',
          unit_amount: Math.round(item.amount * 100), // satang
          product_data: {
            name: item.description,
          },
        },
      })),
      metadata: {
        job_id: job.id,
        client_id: user.id,
        conversation_id: job.conversation_id,
      },
      success_url: `${siteUrl}/chat?payment=success&job_id=${job.id}`,
      cancel_url: `${siteUrl}/chat?payment=cancelled&job_id=${job.id}`,
      customer_email: undefined, // ดึงจาก user ถ้าต้องการ
    })

    // อัปเดต job status
    await adminClient
      .from('jobs')
      .update({
        status: 'approved',
        stripe_session_id: session.id,
        stripe_payment_url: session.url,
      })
      .eq('id', id)

    // บันทึก payment record
    await adminClient.from('payments').insert({
      job_id: job.id,
      stripe_session_id: session.id,
      amount: job.price,
      currency: 'thb',
      status: 'pending',
    })

    // ส่ง message type "payment" ใน chat
    await adminClient.from('messages').insert({
      conversation_id: job.conversation_id,
      sender_id: user.id,
      content: '',
      type: 'payment',
      metadata: {
        job_id: job.id,
        payment_url: session.url,
        amount: job.price,
        title: job.title,
        status: 'pending',
      },
    })

    return NextResponse.json({ payment_url: session.url })
  } catch (err: any) {
    console.error('Approve job error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}