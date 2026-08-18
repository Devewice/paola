import { SHOP_KIND, SHOP_LIMITS } from '@modules/shop/constants/copy.ts'
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
  }
}

export function parseProductList(raw: unknown): readonly Product[] {
  if (!raw || typeof raw !== 'object') return []
  const body = raw as Record<string, unknown>
  if (!Array.isArray(body.products)) return []
  return body.products.map(parseProduct).filter((item): item is Product => item !== null)
}
