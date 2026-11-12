const THAI = /[\u0E00-\u0E7F]/
const HAIR_SPACE = '\u200A' // ช่องว่างบางมาก — react-pdf ถือเป็น whitespace จึงตัดบรรทัดได้โดยไม่เติมขีด "-"
const segmenter = new Intl.Segmenter('th', { granularity: 'word' })

/**
 * เตรียมข้อความไทยให้ @react-pdf/renderer
 * 1) แตก "ำ" (U+0E33) เป็น "ํ"+"า" ล่วงหน้า
 *    ไม่งั้น fontkit จะแตกเองกลางทาง ทำให้ index ของ glyph/string เหลื่อม → ตัวท้ายข้อความหาย + ตัดบรรทัดผิดตำแหน่ง
 * 2) แทรก hair space ระหว่างคำไทย (ตัดคำด้วย Intl.Segmenter) เพื่อให้ตัดบรรทัดตามขอบคำได้
 */
export function thai(text: string | null | undefined): string {
  if (!text) return ''
  const fixed = text.replace(/\u0E33/g, '\u0E4D\u0E32')
  if (!THAI.test(fixed)) return fixed

  const parts = Array.from(segmenter.segment(fixed), (s) => s.segment)
  let out = parts[0] ?? ''
  for (let i = 1; i < parts.length; i++) {
    const bothThai = THAI.test(parts[i - 1]) && THAI.test(parts[i])
    out += (bothThai ? HAIR_SPACE : '') + parts[i]
  }
  return out
}
