import { randomUUID } from 'node:crypto'
import type { Fail } from '../../../http/types.js'
import type { Product } from '../interfaces/shop.interface.js'
import { findProducts, insertProduct } from '../providers/shop.provider.js'
import { parseCreateProduct } from '../schemas/shop.schema.js'

export async function listProducts(): Promise<Product[]> {
  return findProducts()
}

export async function createProduct(
  draft: Record<string, unknown>,
): Promise<Fail | { ok: true; product: Product }> {
  const parsed = parseCreateProduct(draft)
  if (!parsed.ok) return parsed

  const product: Product = {
    id: randomUUID(),
    title: parsed.value.title,
    description: parsed.value.description,
    kind: parsed.value.kind,
    priceCop: parsed.value.priceCop,
    stock: parsed.value.stock,
    photoSrc: parsed.value.photoSrc,
  }
  await insertProduct(product)
  return { ok: true, product }
}
