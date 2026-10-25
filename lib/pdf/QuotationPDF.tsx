import React from 'react'
import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer'
import fs from 'fs'
import path from 'path'

// อ่านไฟล์ฟอนต์เป็น Buffer โดยตรง เพื่อฝังลงใน Serverless Function ตัดปัญหาหาไฟล์ไม่เจอหรือ 404 บน Vercel
const regularFont = fs.readFileSync(path.join(process.cwd(), 'public/fonts/Sarabun-Regular.ttf'))
const boldFont = fs.readFileSync(path.join(process.cwd(), 'public/fonts/Sarabun-Bold.ttf'))

Font.register({
  family: 'Sarabun',
  fonts: [
    { data: regularFont, fontWeight: 400 },
    { data: boldFont, fontWeight: 700 },
  ],
})

const s = StyleSheet.create({
  page: { fontFamily: 'Sarabun', fontSize: 10, color: '#18181b', backgroundColor: '#fff', padding: 48 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#e4e4e7' },
  brandName: { fontSize: 18, fontWeight: 700, color: '#09090b', marginBottom: 3 },
  brandSub: { fontSize: 9, color: '#71717a' },
  docTitle: { fontSize: 22, fontWeight: 700, color: '#09090b', textAlign: 'right', marginBottom: 3 },
  docNo: { fontSize: 9, color: '#71717a', textAlign: 'right' },
  parties: { flexDirection: 'row', gap: 24, marginBottom: 24 },
  partyBox: { flex: 1, backgroundColor: '#f4f4f5', borderRadius: 6, padding: 12 },
  partyLabel: { fontSize: 8, fontWeight: 700, color: '#71717a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  partyName: { fontSize: 11, fontWeight: 700, color: '#09090b', marginBottom: 3 },
  partyText: { fontSize: 9, color: '#52525b', marginBottom: 2 },
  jobBox: { backgroundColor: '#f4f4f5', borderRadius: 6, padding: 12, marginBottom: 20 },
  jobLabel: { fontSize: 8, fontWeight: 700, color: '#71717a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  jobTitle: { fontSize: 12, fontWeight: 700, color: '#09090b', marginBottom: 6 },
  jobDesc: { fontSize: 10, color: '#3f3f46', lineHeight: 1.6, marginBottom: 8 },
  metaRow: { flexDirection: 'row', gap: 24 },
  metaItem: { flex: 1 },
  metaKey: { fontSize: 8, color: '#71717a', marginBottom: 2 },
  metaVal: { fontSize: 10, fontWeight: 700, color: '#09090b' },
  tableLabel: { fontSize: 8, fontWeight: 700, color: '#71717a', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },
  tableHead: { flexDirection: 'row', backgroundColor: '#09090b', borderRadius: 4, padding: '7 10', marginBottom: 3 },
  tableHeadTxt: { fontSize: 8, fontWeight: 700, color: '#fff' },
  tableRow: { flexDirection: 'row', padding: '8 10', borderBottomWidth: 1, borderBottomColor: '#f4f4f5' },
  tableCell: { fontSize: 10, color: '#3f3f46' },
  cDesc: { flex: 3 }, cQty: { flex: 1, textAlign: 'center' }, cUnit: { flex: 1.5, textAlign: 'right' }, cAmt: { flex: 1.5, textAlign: 'right' },
  totalSection: { alignItems: 'flex-end', marginTop: 8, marginBottom: 20 },
  totalBox: { backgroundColor: '#09090b', borderRadius: 6, padding: '10 16', flexDirection: 'row', gap: 32, minWidth: 200 },
  totalLabel: { fontSize: 11, fontWeight: 700, color: '#fff' },
  totalValue: { fontSize: 11, fontWeight: 700, color: '#fff', textAlign: 'right', flex: 1 },
  notesBox: { backgroundColor: '#f4f4f5', borderRadius: 6, padding: 12, marginBottom: 20 },
  notesLabel: { fontSize: 8, fontWeight: 700, color: '#71717a', marginBottom: 4, textTransform: 'uppercase' },
  notesText: { fontSize: 9, color: '#52525b', lineHeight: 1.5 },
  footer: { position: 'absolute', bottom: 32, left: 48, right: 48, borderTopWidth: 1, borderTopColor: '#e4e4e7', paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: '#a1a1aa' },
  validityText: { fontSize: 9, color: '#71717a', textAlign: 'center', marginBottom: 40 },
})

export type QuotationData = {
  quotationNo: string
  date: string
  freelancer: { name: string; email: string; taxId?: string; address?: string; phone?: string; website?: string }
  client: { name: string; email: string; companyName?: string; taxId?: string; address?: string; phone?: string }
  job: { title: string; description: string; timelineDays: number; revisions: number }
  items: { description: string; quantity: number; unitPrice: number; amount: number }[]
  total: number
  notes?: string
}

export default function QuotationPDF({ data }: { data: QuotationData }) {
  const fmt = (n: number) => `฿${n.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.brandName}>{data.freelancer.name}</Text>
            <Text style={s.brandSub}>Full-stack Developer & Freelancer</Text>
            {data.freelancer.website && <Text style={s.brandSub}>{data.freelancer.website}</Text>}
          </View>
          <View>
            <Text style={s.docTitle}>ใบเสนอราคา</Text>
            <Text style={s.docNo}>เลขที่: {data.quotationNo}</Text>
            <Text style={s.docNo}>วันที่: {data.date}</Text>
          </View>
        </View>

        {/* Parties */}
        <View style={s.parties}>
          <View style={s.partyBox}>
            <Text style={s.partyLabel}>ผู้ให้บริการ (From)</Text>
            <Text style={s.partyName}>{data.freelancer.name}</Text>
            <Text style={s.partyText}>{data.freelancer.email}</Text>
            {data.freelancer.taxId && <Text style={s.partyText}>เลขภาษี: {data.freelancer.taxId}</Text>}
            {data.freelancer.address && <Text style={s.partyText}>{data.freelancer.address}</Text>}
            {data.freelancer.phone && <Text style={s.partyText}>โทร: {data.freelancer.phone}</Text>}
          </View>
          <View style={s.partyBox}>
            <Text style={s.partyLabel}>ลูกค้า (Bill To)</Text>
            <Text style={s.partyName}>{data.client.companyName ?? data.client.name}</Text>
            {data.client.companyName && <Text style={s.partyText}>{data.client.name}</Text>}
            <Text style={s.partyText}>{data.client.email}</Text>
            {data.client.taxId && <Text style={s.partyText}>เลขภาษี: {data.client.taxId}</Text>}
            {data.client.address && <Text style={s.partyText}>{data.client.address}</Text>}
            {data.client.phone && <Text style={s.partyText}>โทร: {data.client.phone}</Text>}
          </View>
        </View>

        {/* Job details */}
        <View style={s.jobBox}>
          <Text style={s.jobLabel}>รายละเอียดงาน</Text>
          <Text style={s.jobTitle}>{data.job.title}</Text>
          <Text style={s.jobDesc}>{data.job.description}</Text>
          <View style={s.metaRow}>
            <View style={s.metaItem}>
              <Text style={s.metaKey}>ระยะเวลาดำเนินงาน</Text>
              <Text style={s.metaVal}>{data.job.timelineDays} วัน</Text>
            </View>
            <View style={s.metaItem}>
              <Text style={s.metaKey}>จำนวนครั้งที่แก้ได้</Text>
              <Text style={s.metaVal}>{data.job.revisions} ครั้ง</Text>
            </View>
          </View>
        </View>

        {/* Items table */}
        <Text style={s.tableLabel}>รายการค่าบริการ</Text>
        <View style={s.tableHead}>
          <Text style={[s.tableHeadTxt, s.cDesc]}>รายละเอียด</Text>
          <Text style={[s.tableHeadTxt, s.cQty]}>จำนวน</Text>
          <Text style={[s.tableHeadTxt, s.cUnit]}>ราคาต่อหน่วย</Text>
          <Text style={[s.tableHeadTxt, s.cAmt]}>จำนวนเงิน</Text>
        </View>
        {data.items.map((item, i) => (
          <View key={i} style={s.tableRow}>
            <Text style={[s.tableCell, s.cDesc]}>{item.description}</Text>
            <Text style={[s.tableCell, s.cQty]}>{item.quantity}</Text>
            <Text style={[s.tableCell, s.cUnit]}>{fmt(item.unitPrice)}</Text>
            <Text style={[s.tableCell, s.cAmt]}>{fmt(item.amount)}</Text>
          </View>
        ))}

        {/* Total */}
        <View style={s.totalSection}>
          <View style={s.totalBox}>
            <Text style={s.totalLabel}>ยอดรวมทั้งสิ้น</Text>
            <Text style={s.totalValue}>{fmt(data.total)}</Text>
          </View>
        </View>

        {/* Notes */}
        {data.notes && (
          <View style={s.notesBox}>
            <Text style={s.notesLabel}>หมายเหตุ</Text>
            <Text style={s.notesText}>{data.notes}</Text>
          </View>
        )}

        <Text style={s.validityText}>
          ใบเสนอราคานี้มีอายุ 30 วัน นับจากวันที่ออกเอกสาร
        </Text>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>{data.freelancer.name} · {data.freelancer.email}</Text>
          <Text style={s.footerText}>เอกสารเลขที่ {data.quotationNo}</Text>
        </View>

      </Page>
    </Document>
  )
}