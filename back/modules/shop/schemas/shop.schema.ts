import { HTTP_STATUS } from '../../../http/constants.js'
import { fail } from '../../../http/fail.js'
import type { Parsed } from '../../../http/types.js'
import { optionalText } from '../../../shared/text.js'
import {
  SHOP_DEFAULT_KIND,
  SHOP_KIND_SET,
  SHOP_LIMITS,
  SHOP_MESSAGES,
} from '../constants/shop.constants.js'
import type { CreateProductDto, CreateServiceDto } from '../dtos/shop.dto.js'
import type { Product, ProductKind, ShopService } from '../interfaces/shop.interface.js'

function parseOptionalCount(
  value: unknown,
): { ok: true; value: number | null } | { ok: false } {
  if (value === null || value === undefined || value === '') {
    return { ok: true, value: null }
  }
  const n = Number(value)
  if (!Number.isInteger(n) || n < SHOP_LIMITS.COUNT_MIN) return { ok: false }
  return { ok: true, value: n }
}

export function parseCreateProduct(draft: Record<string, unknown>): Parsed<CreateProductDto> {
  const title = String(draft.title ?? '').trim()
  const description = String(draft.description ?? '').trim()
  const kindRaw = String(draft.kind ?? '').trim()
  const photoSrc = optionalText(draft.photoSrc)
  const color = optionalText(draft.color)
  const size = optionalText(draft.size)
  const category = optionalText(draft.category)
  const price = parseOptionalCount(draft.priceCop)
  const stock = parseOptionalCount(draft.stock)

  if (title.length < SHOP_LIMITS.TITLE_MIN) {
    return fail(HTTP_STATUS.BAD_REQUEST, SHOP_MESSAGES.TITLE_REQUIRED)
  }
  if (description.length < SHOP_LIMITS.DESCRIPTION_MIN) {
    return fail(HTTP_STATUS.BAD_REQUEST, SHOP_MESSAGES.DESCRIPTION_REQUIRED)
  }
  if (!SHOP_KIND_SET.has(kindRaw)) {
    return fail(HTTP_STATUS.BAD_REQUEST, SHOP_MESSAGES.KIND_INVALID)
  }
  if (!price.ok) {
    return fail(HTTP_STATUS.BAD_REQUEST, SHOP_MESSAGES.PRICE_INVALID)
  }
  if (!stock.ok) {
    return fail(HTTP_STATUS.BAD_REQUEST, SHOP_MESSAGES.STOCK_INVALID)
  }

  return {
    ok: true,
    value: {
      title,
      description,
      kind: kindRaw as ProductKind,
      priceCop: price.value,
      stock: stock.value,
      photoSrc,
      color,
      size,
      category,
    },
  }
}

export function parseCreateService(draft: Record<string, unknown>): Parsed<CreateServiceDto> {
  const title = String(draft.title ?? '').trim()
  const includesText = String(draft.includesText ?? '').trim()
  const handoverText = String(draft.handoverText ?? '').trim()
  const turnaroundText = String(draft.turnaroundText ?? '').trim()
  const price = parseOptionalCount(draft.priceCop)

  if (title.length < SHOP_LIMITS.TITLE_MIN) {
    return fail(HTTP_STATUS.BAD_REQUEST, SHOP_MESSAGES.SERVICE_TITLE_REQUIRED)
  }
  if (includesText.length < SHOP_LIMITS.DESCRIPTION_MIN) {
    return fail(HTTP_STATUS.BAD_REQUEST, SHOP_MESSAGES.INCLUDES_REQUIRED)
  }
  if (handoverText.length < SHOP_LIMITS.DESCRIPTION_MIN) {
    return fail(HTTP_STATUS.BAD_REQUEST, SHOP_MESSAGES.HANDOVER_REQUIRED)
  }
  if (turnaroundText.length < SHOP_LIMITS.DESCRIPTION_MIN) {
    return fail(HTTP_STATUS.BAD_REQUEST, SHOP_MESSAGES.TURNAROUND_REQUIRED)
  }
  if (!price.ok) {
    return fail(HTTP_STATUS.BAD_REQUEST, SHOP_MESSAGES.PRICE_INVALID)
  }

  return {
    ok: true,
    value: {
      title,
      includesText,
      handoverText,
      turnaroundText,
      priceCop: price.value,
    },
  }
}

export function toIso(value: unknown): string | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString()
  if (typeof value === 'string' && value.trim()) {
    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) return date.toISOString()
  }
  return undefined
}

export function toProduct(row: Record<string, unknown>): Product {
  const rawKind = String(row.kind)
  const price = row.price_cop
  const stock = row.stock
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description),
    kind: SHOP_KIND_SET.has(rawKind) ? (rawKind as ProductKind) : SHOP_DEFAULT_KIND,
    priceCop: price === null || price === undefined ? null : Number(price),
    stock: stock === null || stock === undefined ? null : Number(stock),
    photoSrc: optionalText(row.photo_src),
    color: optionalText(row.color),
    size: optionalText(row.size),
    category: optionalText(row.category),
    createdAt: toIso(row.created_at),
  }
}

export function toService(row: Record<string, unknown>): ShopService {
  const price = row.price_cop
  return {
    id: String(row.id),
    title: String(row.title),
    includesText: String(row.includes_text),
    handoverText: String(row.handover_text),
    turnaroundText: String(row.turnaround_text),
    priceCop: price === null || price === undefined ? null : Number(price),
    createdAt: toIso(row.created_at),
  }
}
