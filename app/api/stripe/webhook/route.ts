import { NextResponse, type NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import ReactPDF from '@react-pdf/renderer'
import React from 'react'
import ReceiptPDF, { type ReceiptData } from '@/lib/pdf/ReceiptPDF'

export const runtime = 'nodejs'

function genReceiptNo(): string {
  const now = new Date()
  const year = now.getFullYear()
  const rand = Math.floor(Math.random() * 90000) + 10000
  return `R-${year}-${rand}`
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: any
  try {
    event = stripe.webhooks.constructEvent(
      body, signature, process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature error:', err.message)
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { job_id, conversation_id } = session.metadata

    const adminClient = createAdminClient()

    // ดึง job + items + client
    const { data: job } = await adminClient
      .from('jobs')
      .select('*, job_items(*)')
      .eq('id', job_id)
      .single()

    if (!job) return NextResponse.json({ error: 'job not found' }, { status: 404 })

    const { data: client } = await adminClient
      .from('users')
      .select('username, email, company_name, tax_id, address, phone')
      .eq('uid', job.client_id)
      .single()

    const receiptNo = genReceiptNo()
    const now = new Date()
    const dateStr = now.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })

    // Generate PDF Receipt
    const receiptData: ReceiptData = {
      receiptNo,
      quotationNo: `Q-${job_id.slice(0, 8).toUpperCase()}`,
      date: dateStr,
      paidAt: dateStr,
      stripePaymentIntent: session.payment_intent ?? '',
      freelancer: {
        name: process.env.FREELANCER_NAME ?? 'devjaishoy',
        email: process.env.FREELANCER_EMAIL ?? '',
        website: process.env.FREELANCER_WEBSITE,
        taxId: process.env.FREELANCER_TAX_ID,
        address: process.env.FREELANCER_ADDRESS,
        phone: process.env.FREELANCER_PHONE,
      },
      client: {
        name: client?.username ?? 'ลูกค้า',
        email: client?.email ?? '',
        companyName: client?.company_name ?? undefined,
        taxId: client?.tax_id ?? undefined,
        address: client?.address ?? undefined,
        phone: client?.phone ?? undefined,
      },
      job: { title: job.title },
      items: job.job_items.map((item: any) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        amount: item.amount,
      })),
      total: job.price,
    }

    const pdfBuffer = await ReactPDF.renderToBuffer(
      React.createElement(ReceiptPDF, { data: receiptData }) as any
    )

    // Upload receipt PDF
    const receiptPath = `receipts/${job_id}.pdf`
    await adminClient.storage
      .from('job-documents')
      .upload(receiptPath, pdfBuffer, { contentType: 'application/pdf', upsert: true })

    const { data: receiptUrlData } = adminClient.storage
      .from('job-documents')
      .getPublicUrl(receiptPath)

    // Update job
    await adminClient.from('jobs').update({
      status: 'paid',
      receipt_pdf_url: receiptUrlData.publicUrl,
      paid_at: now.toISOString(),
    }).eq('id', job_id)

    // Update payment
    await adminClient.from('payments').update({
      status: 'paid',
      stripe_payment_intent: session.payment_intent,
      paid_at: now.toISOString(),
    }).eq('stripe_session_id', session.id)

    // ส่ง message type "receipt"
    await adminClient.from('messages').insert({
      conversation_id,
      sender_id: job.client_id,
      content: '',
      type: 'receipt',
      metadata: {
        job_id,
        receipt_no: receiptNo,
        title: job.title,
        total: job.price,
        pdf_url: receiptUrlData.publicUrl,
        paid_at: dateStr,
      },
    })
  }

  return NextResponse.json({ received: true })
}