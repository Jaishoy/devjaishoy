import React from 'react'
import { Text as RPText, type TextProps } from '@react-pdf/renderer'
import './pdf-setup'
import { thai } from './thai'

type Props = React.PropsWithChildren<TextProps>

function convert(node: React.ReactNode): React.ReactNode {
  if (typeof node === 'string') return thai(node)
  if (Array.isArray(node)) return node.map(convert)
  return node
}

/**
 * ใช้แทน <Text> ของ @react-pdf/renderer
 *  - แก้ข้อความไทยทุกจุดอัตโนมัติ (ดู thai.ts)
 *  - hyphenationPenalty = 10000 (= infinity ของ line breaker) → ห้ามตัดบรรทัดแบบเติมขีด "-"
 *    ให้ตัดได้เฉพาะที่ช่องว่าง/ขอบคำเท่านั้น
 */
export function Text({ children, ...rest }: Props) {
  return (
    <RPText hyphenationPenalty={10000} {...rest}>
      {convert(children)}
    </RPText>
  )
}
