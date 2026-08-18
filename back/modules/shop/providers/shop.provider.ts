import { getDb } from '../../../db/knex.js'
import { SHOP_TABLES } from '../constants/shop.constants.js'
import type { Product, ShopService } from '../interfaces/shop.interface.js'
import { toProduct, toService } from '../schemas/shop.schema.js'

export async function findProducts(): Promise<Product[]> {
  const rows = await getDb()(SHOP_TABLES.PRODUCTS)
    .select('id', 'title', 'description', 'kind', 'price_cop', 'stock', 'photo_src')
    .orderBy('created_at', 'desc')
  return rows.map((row) => toProduct(row as Record<string, unknown>))
}

export async function insertProduct(product: Product): Promise<void> {
  await getDb()(SHOP_TABLES.PRODUCTS).insert({
    id: product.id,
    title: product.title,
    description: product.description,
    kind: product.kind,
    price_cop: product.priceCop,
    stock: product.stock,
    photo_src: product.photoSrc ?? null,
  })
}

export async function findServices(): Promise<ShopService[]> {
  const rows = await getDb()(SHOP_TABLES.SERVICES)
    .select('id', 'title', 'includes_text', 'handover_text', 'turnaround_text', 'price_cop')
    .orderBy('created_at', 'desc')
  return rows.map((row) => toService(row as Record<string, unknown>))
}

export async function insertService(service: ShopService): Promise<void> {
  await getDb()(SHOP_TABLES.SERVICES).insert({
    id: service.id,
    title: service.title,
    includes_text: service.includesText,
    handover_text: service.handoverText,
    turnaround_text: service.turnaroundText,
    price_cop: service.priceCop,
  })
}
