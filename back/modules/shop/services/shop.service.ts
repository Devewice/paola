import { randomUUID } from 'node:crypto'
import type { Fail } from '../../../http/types.js'
import type { Product, ShopService } from '../interfaces/shop.interface.js'
import {
  findProducts,
  findServices,
  insertProduct,
  insertService,
} from '../providers/shop.provider.js'
import { parseCreateProduct, parseCreateService } from '../schemas/shop.schema.js'

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
    color: parsed.value.color,
    size: parsed.value.size,
    category: parsed.value.category,
  }
  await insertProduct(product)
  return { ok: true, product }
}

export async function listServices(): Promise<ShopService[]> {
  return findServices()
}

export async function createService(
  draft: Record<string, unknown>,
): Promise<Fail | { ok: true; service: ShopService }> {
  const parsed = parseCreateService(draft)
  if (!parsed.ok) return parsed

  const service: ShopService = {
    id: randomUUID(),
    title: parsed.value.title,
    includesText: parsed.value.includesText,
    handoverText: parsed.value.handoverText,
    turnaroundText: parsed.value.turnaroundText,
    priceCop: parsed.value.priceCop,
  }
  await insertService(service)
  return { ok: true, service }
}
