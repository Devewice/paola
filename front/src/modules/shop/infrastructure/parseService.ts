import { SHOP_LIMITS } from '@modules/shop/constants/copy.ts'
import type { ShopService } from '@modules/shop/domain/entities/ShopService.ts'

function optionalCount(value: unknown): number | null | 'bad' {
  if (value === null || value === undefined) return null
  const n = Number(value)
  if (!Number.isInteger(n) || n < SHOP_LIMITS.COUNT_MIN) return 'bad'
  return n
}

function requiredText(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const text = value.trim()
  return text.length >= SHOP_LIMITS.DESCRIPTION_MIN ? text : null
}

function optionalTime(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined
  const ms = Date.parse(value)
  return Number.isNaN(ms) ? undefined : new Date(ms).toISOString()
}

export function parseService(raw: unknown): ShopService | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  if (typeof row.id !== 'string' || !row.id) return null
  const title = requiredText(row.title)
  const includesText = requiredText(row.includesText)
  const handoverText = requiredText(row.handoverText)
  const turnaroundText = requiredText(row.turnaroundText)
  const priceCop = optionalCount(row.priceCop)
  if (!title || !includesText || !handoverText || !turnaroundText) return null
  if (priceCop === 'bad') return null
  return {
    id: row.id,
    title,
    includesText,
    handoverText,
    turnaroundText,
    priceCop,
    createdAt: optionalTime(row.createdAt),
  }
}

export function parseServiceList(raw: unknown): readonly ShopService[] {
  if (!raw || typeof raw !== 'object') return []
  const body = raw as Record<string, unknown>
  if (!Array.isArray(body.services)) return []
  return body.services.map(parseService).filter((item): item is ShopService => item !== null)
}
