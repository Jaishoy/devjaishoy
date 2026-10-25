import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import ReactPDF from '@react-pdf/renderer'
import React from 'react'
import QuotationPDF, { type QuotationData } from '@/lib/pdf/QuotationPDF'

export const runtime = 'nodejs'

function genQuotationNo(): string {
  const now = new Date()
  const year = now.getFullYear()
  const rand = Math.floor(Math.random() * 90000) + 10000
  return `Q-${year}-${rand}`
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const adminClient = createAdminClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const { data: profile } = await adminClient
      .from('users')
      .select('role')
      .eq('uid', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'admin only' }, { status: 403 })
    }

    const body = await request.json()
    const {
      conversation_id,
      client_id,
      title,
      description,
      timeline_days,
      revisions,
      notes,
      items, // [{ description, quantity, unit_price }]
    } = body

    // คำนวณ total
    const total = items.reduce((sum: number, item: any) =>
      sum + item.quantity * item.unit_price, 0)

    // สร้าง job
    const { data: job, error: jobError } = await adminClient
      .from('jobs')
      .insert({
        conversation_id,
        client_id,
        title,
        description,
        timeline_days,
        revisions,
        price: total,
        notes,
        status: 'sent',
      })
      .select()
      .single()

    if (jobError || !job) throw new Error(jobError?.message ?? 'cannot create job')

    // สร้าง job_items
    const jobItems = items.map((item: any) => ({
      job_id: job.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }))

    await adminClient.from('job_items').insert(jobItems)

    // ดึงข้อมูล client
    const { data: client } = await adminClient
      .from('users')
      .select('username, email, company_name, tax_id, address, phone')
      .eq('uid', client_id)
      .single()

    const quotationNo = genQuotationNo()
    const dateStr = new Date().toLocaleDateString('th-TH', {
      year: 'numeric', month: 'long', day: 'numeric'
    })

    // สร้าง PDF
    const pdfData: QuotationData = {
      quotationNo,
      date: dateStr,
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
      job: { title, description, timelineDays: timeline_days, revisions },
      items: items.map((item: any) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        amount: item.quantity * item.unit_price,
      })),
      total,
      notes,
    }

    const pdfBuffer = await ReactPDF.renderToBuffer(
      React.createElement(QuotationPDF, { data: pdfData })
    )

    // Upload PDF ไปที่ Supabase Storage
    const pdfPath = `quotations/${job.id}.pdf`
    await adminClient.storage
      .from('job-documents')
      .upload(pdfPath, pdfBuffer, { contentType: 'application/pdf', upsert: true })

    const { data: pdfUrlData } = adminClient.storage
      .from('job-documents')
      .getPublicUrl(pdfPath)

    // Update job ด้วย quotation info
    await adminClient
      .from('jobs')
      .update({ quotation_pdf_url: pdfUrlData.publicUrl })
      .eq('id', job.id)

    // ส่ง message type "quotation" ลงใน conversation
    await adminClient.from('messages').insert({
      conversation_id,
      sender_id: user.id,
      content: '',
      type: 'quotation',
      metadata: {
        job_id: job.id,
        quotation_no: quotationNo,
        title,
        total,
        timeline_days,
        revisions,
        pdf_url: pdfUrlData.publicUrl,
        status: 'sent',
      },
    })

    return NextResponse.json({ job_id: job.id, pdf_url: pdfUrlData.publicUrl })
  } catch (err: any) {
    console.error('Create job error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}