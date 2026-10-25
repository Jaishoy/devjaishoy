import React from 'react'
import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer'
import fs from 'fs'
import path from 'path'

// อ่านไฟล์ฟอนต์แล้วแปลงเป็น Base64 Data URI String
const regularFontBase64 = fs.readFileSync(path.join(process.cwd(), 'lib/fonts/Sarabun-Regular.ttf')).toString('base64')
const boldFontBase64 = fs.readFileSync(path.join(process.cwd(), 'lib/fonts/Sarabun-Bold.ttf')).toString('base64')

Font.register({
  family: 'Sarabun',
  fonts: [
    { src: `data:font/ttf;base64,${regularFontBase64}`, fontWeight: 400 },
    { src: `data:font/ttf;base64,${boldFontBase64}`, fontWeight: 700 },
  ],
})

const s = StyleSheet.create({
  page: { fontFamily: 'Sarabun', fontSize: 10, color: '#18181b', backgroundColor: '#fff', padding: 48 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#e4e4e7' },
  brandName: { fontSize: 18, fontWeight: 700, color: '#09090b', marginBottom: 3 },
  brandSub: { fontSize: 9, color: '#71717a' },
  docTitle: { fontSize: 22, fontWeight: 700, color: '#09090b', textAlign: 'right', marginBottom: 3 },
  docNo: { fontSize: 9, color: '#71717a', textAlign: 'right' },
  confirmedBadge: { backgroundColor: '#166534', borderRadius: 4, padding: '4 10', alignSelf: 'flex-end', marginBottom: 4 },
  confirmedText: { fontSize: 8, fontWeight: 700, color: '#fff' },
  parties: { flexDirection: 'row', gap: 24, marginBottom: 24 },
  partyBox: { flex: 1, backgroundColor: '#f4f4f5', borderRadius: 6, padding: 12 },
  partyLabel: { fontSize: 8, fontWeight: 700, color: '#71717a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  partyName: { fontSize: 11, fontWeight: 700, color: '#09090b', marginBottom: 3 },
  partyText: { fontSize: 9, color: '#52525b', marginBottom: 2 },
  paymentBox: { backgroundColor: '#f0fdf4', borderRadius: 6, padding: 12, marginBottom: 20, borderWidth: 1, borderColor: '#bbf7d0' },
  paymentLabel: { fontSize: 8, fontWeight: 700, color: '#166534', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  paymentRow: { flexDirection: 'row', gap: 24 },
  paymentItem: { flex: 1 },
  paymentKey: { fontSize: 8, color: '#4b7c5e', marginBottom: 2 },
  paymentVal: { fontSize: 10, fontWeight: 700, color: '#14532d' },
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
  thankYou: { textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#09090b', marginBottom: 4 },
  thankYouSub: { textAlign: 'center', fontSize: 9, color: '#71717a', marginBottom: 32 },
  footer: { position: 'absolute', bottom: 32, left: 48, right: 48, borderTopWidth: 1, borderTopColor: '#e4e4e7', paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between' },
  footerText: { fontSize: 8, color: '#a1a1aa' },
})

export type ReceiptData = {
  receiptNo: string
  quotationNo: string
  date: string
  paidAt: string
  stripePaymentIntent: string
  freelancer: { name: string; email: string; taxId?: string; address?: string; phone?: string; website?: string }
  client: { name: string; email: string; companyName?: string; taxId?: string; address?: string; phone?: string }
  job: { title: string }
  items: { description: string; quantity: number; unitPrice: number; amount: number }[]
  total: number
}

export default function ReceiptPDF({ data }: { data: ReceiptData }) {
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
            <View style={s.confirmedBadge}>
              <Text style={s.confirmedText}>✓ ชำระเงินแล้ว</Text>
            </View>
            <Text style={s.docTitle}>ใบเสร็จรับเงิน</Text>
            <Text style={s.docNo}>เลขที่: {data.receiptNo}</Text>
            <Text style={s.docNo}>วันที่: {data.date}</Text>
          </View>
        </View>

        {/* Parties */}
        <View style={s.parties}>
          <View style={s.partyBox}>
            <Text style={s.partyLabel}>ผู้รับเงิน</Text>
            <Text style={s.partyName}>{data.freelancer.name}</Text>
            <Text style={s.partyText}>{data.freelancer.email}</Text>
            {data.freelancer.taxId && <Text style={s.partyText}>เลขภาษี: {data.freelancer.taxId}</Text>}
            {data.freelancer.address && <Text style={s.partyText}>{data.freelancer.address}</Text>}
            {data.freelancer.phone && <Text style={s.partyText}>โทร: {data.freelancer.phone}</Text>}
          </View>
          <View style={s.partyBox}>
            <Text style={s.partyLabel}>ผู้ชำระเงิน</Text>
            <Text style={s.partyName}>{data.client.companyName ?? data.client.name}</Text>
            {data.client.companyName && <Text style={s.partyText}>{data.client.name}</Text>}
            <Text style={s.partyText}>{data.client.email}</Text>
            {data.client.taxId && <Text style={s.partyText}>เลขภาษี: {data.client.taxId}</Text>}
            {data.client.address && <Text style={s.partyText}>{data.client.address}</Text>}
            {data.client.phone && <Text style={s.partyText}>โทร: {data.client.phone}</Text>}
          </View>
        </View>

        {/* Payment details */}
        <View style={s.paymentBox}>
          <Text style={s.paymentLabel}>ข้อมูลการชำระเงิน</Text>
          <View style={s.paymentRow}>
            <View style={s.paymentItem}>
              <Text style={s.paymentKey}>วันที่ชำระ</Text>
              <Text style={s.paymentVal}>{data.paidAt}</Text>
            </View>
            <View style={s.paymentItem}>
              <Text style={s.paymentKey}>ช่องทาง</Text>
              <Text style={s.paymentVal}>Stripe Payment</Text>
            </View>
            <View style={s.paymentItem}>
              <Text style={s.paymentKey}>อ้างอิงใบเสนอราคา</Text>
              <Text style={s.paymentVal}>{data.quotationNo}</Text>
            </View>
          </View>
        </View>

        {/* Items table */}
        <Text style={s.tableLabel}>รายการที่ชำระ · {data.job.title}</Text>
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
            <Text style={s.totalLabel}>ยอดที่ได้รับ</Text>
            <Text style={s.totalValue}>{fmt(data.total)}</Text>
          </View>
        </View>

        {/* Thank you */}
        <Text style={s.thankYou}>ขอบคุณที่ไว้วางใจครับ 🙏</Text>
        <Text style={s.thankYouSub}>หากมีคำถามเพิ่มเติม ติดต่อได้ที่ {data.freelancer.email}</Text>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>{data.freelancer.name} · {data.freelancer.email}</Text>
          <Text style={s.footerText}>ใบเสร็จเลขที่ {data.receiptNo}</Text>
        </View>

      </Page>
    </Document>
  )
}