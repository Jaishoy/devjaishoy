import { Font } from '@react-pdf/renderer'
import { REGULAR_BASE64, BOLD_BASE64 } from '../fonts/sarabun-data'

// ลงทะเบียนฟอนต์ "ที่เดียว" (ไฟล์นี้ถูก import โดย PdfText เท่านั้น)
Font.register({
  family: 'Sarabun',
  fonts: [
    { src: `data:font/ttf;base64,${REGULAR_BASE64}`, fontWeight: 400 },
    { src: `data:font/ttf;base64,${BOLD_BASE64}`, fontWeight: 700 },
  ],
})

// ปิด hyphenation ของ react-pdf (ที่ออกแบบมาสำหรับอังกฤษ) — กันขีด "-" แทรกกลางคำ
Font.registerHyphenationCallback((word) => [word])
