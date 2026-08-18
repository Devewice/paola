import { getDb } from '../../../db/knex.js'
import { SHOP_TABLES } from '../constants/shop.constants.js'
import type { Product } from '../interfaces/shop.interface.js'
import { toProduct } from '../schemas/shop.schema.js'

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
