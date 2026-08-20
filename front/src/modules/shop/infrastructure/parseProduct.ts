import { SHOP_CATEGORY, SHOP_KIND, SHOP_LIMITS } from '@modules/shop/constants/copy.ts'
import type { Product, ProductKind } from '@modules/shop/domain/entities/Product.ts'

const KINDS = new Set<ProductKind>([SHOP_KIND.OWN, SHOP_KIND.COLLAB])

function optionalHref(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const href = value.trim()
  return href.length > 0 ? href : undefined
}

function optionalCount(value: unknown): number | null | 'bad' {
  if (value === null || value === undefined) return null
  const n = Number(value)
  if (!Number.isInteger(n) || n < SHOP_LIMITS.COUNT_MIN) return 'bad'
  return n
}

function optionalLabel(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const label = value.trim()
  return label.length > 0 ? label : undefined
}

const CATEGORIES = new Set<string>(Object.values(SHOP_CATEGORY))

function optionalCategory(value: unknown): string | undefined {
  const label = optionalLabel(value)
  if (!label || !CATEGORIES.has(label)) return undefined
  return label
}

function optionalTime(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined
  const ms = Date.parse(value)
  return Number.isNaN(ms) ? undefined : new Date(ms).toISOString()
}

export function parseProduct(raw: unknown): Product | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  if (typeof row.id !== 'string' || !row.id) return null
  if (typeof row.title !== 'string' || row.title.trim().length < SHOP_LIMITS.TITLE_MIN) return null
  if (typeof row.description !== 'string' || row.description.trim().length < SHOP_LIMITS.DESCRIPTION_MIN) {
    return null
  }
  if (typeof row.kind !== 'string' || !KINDS.has(row.kind as ProductKind)) return null
  const priceCop = optionalCount(row.priceCop)
  const stock = optionalCount(row.stock)
  if (priceCop === 'bad' || stock === 'bad') return null
  return {
    id: row.id,
    title: row.title.trim(),
    description: row.description.trim(),
    kind: row.kind as ProductKind,
    priceCop,
    stock,
    photoSrc: optionalHref(row.photoSrc),
    color: optionalLabel(row.color),
    size: optionalLabel(row.size),
    category: optionalCategory(row.category),
    createdAt: optionalTime(row.createdAt),
  }
}

export function parseProductList(raw: unknown): readonly Product[] {
  if (!raw || typeof raw !== 'object') return []
  const body = raw as Record<string, unknown>
  if (!Array.isArray(body.products)) return []
  return body.products.map(parseProduct).filter((item): item is Product => item !== null)
}
