import { randomUUID } from 'node:crypto'
import { getDb } from '../db/knex.js'

const KINDS = new Set(['propia', 'colaboracion'])

export type ProductKind = 'propia' | 'colaboracion'

export type Product = {
  id: string
  title: string
  description: string
  kind: ProductKind
  priceCop: number | null
  stock: number | null
  photoSrc?: string
}

type Fail = { ok: false; status: number; detail: string }

function optionalText(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const text = value.trim()
  return text.length > 0 ? text : undefined
}

function parseOptionalCount(
  value: unknown,
): { ok: true; value: number | null } | { ok: false } {
  if (value === null || value === undefined || value === '') {
    return { ok: true, value: null }
  }
  const n = Number(value)
  if (!Number.isInteger(n) || n < 0) return { ok: false }
  return { ok: true, value: n }
}

function toProduct(row: Record<string, unknown>): Product {
  const rawKind = String(row.kind)
  const price = row.price_cop
  const stock = row.stock
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description),
    kind: KINDS.has(rawKind) ? (rawKind as ProductKind) : 'propia',
    priceCop: price === null || price === undefined ? null : Number(price),
    stock: stock === null || stock === undefined ? null : Number(stock),
    photoSrc: optionalText(row.photo_src),
  }
}

export async function listProductos(): Promise<Product[]> {
  const rows = await getDb()('productos')
    .select('id', 'title', 'description', 'kind', 'price_cop', 'stock', 'photo_src')
    .orderBy('created_at', 'desc')
  return rows.map((row) => toProduct(row as Record<string, unknown>))
}

export async function createProducto(
  draft: Record<string, unknown>,
): Promise<Fail | { ok: true; product: Product }> {
  const title = String(draft.title ?? '').trim()
  const description = String(draft.description ?? '').trim()
  const kindRaw = String(draft.kind ?? '').trim()
  const photoSrc = optionalText(draft.photoSrc)
  const price = parseOptionalCount(draft.priceCop)
  const stock = parseOptionalCount(draft.stock)

  if (title.length < 2) {
    return { ok: false, status: 400, detail: 'El producto necesita un nombre.' }
  }
  if (description.length < 2) {
    return { ok: false, status: 400, detail: 'Di qué es, en una frase.' }
  }
  if (!KINDS.has(kindRaw)) {
    return { ok: false, status: 400, detail: 'Elige estantería: propia o colaboración.' }
  }
  if (!price.ok) {
    return { ok: false, status: 400, detail: 'El precio es un entero en pesos, o vacío para preguntar.' }
  }
  if (!stock.ok) {
    return { ok: false, status: 400, detail: 'El stock es un entero ≥ 0, o vacío si no aplica.' }
  }

  const product: Product = {
    id: randomUUID(),
    title,
    description,
    kind: kindRaw as ProductKind,
    priceCop: price.value,
    stock: stock.value,
    photoSrc,
  }

  await getDb()('productos').insert({
    id: product.id,
    title: product.title,
    description: product.description,
    kind: product.kind,
    price_cop: product.priceCop,
    stock: product.stock,
    photo_src: product.photoSrc ?? null,
  })
  return { ok: true, product }
}
