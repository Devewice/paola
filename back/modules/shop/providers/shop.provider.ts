import { getDb } from '../../../db/knex.js'
import { SHOP_TABLES } from '../constants/shop.constants.js'
import type { Product, ShopService } from '../interfaces/shop.interface.js'
import { toProduct, toService } from '../schemas/shop.schema.js'

export async function findProducts(): Promise<Product[]> {
  const rows = await getDb()(SHOP_TABLES.PRODUCTS)
    .select(
      'id',
      'title',
      'description',
      'kind',
      'price_cop',
      'stock',
      'photo_src',
      'color',
      'size',
      'category',
      'created_at',
    )
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
    color: product.color ?? null,
    size: product.size ?? null,
    category: product.category ?? null,
  })
}

export async function updateProduct(product: Product): Promise<number> {
  return getDb()(SHOP_TABLES.PRODUCTS)
    .where({ id: product.id })
    .update({
      title: product.title,
      description: product.description,
      kind: product.kind,
      price_cop: product.priceCop,
      stock: product.stock,
      photo_src: product.photoSrc ?? null,
      color: product.color ?? null,
      size: product.size ?? null,
      category: product.category ?? null,
    })
}

/** Las cartas del mazo apuntan al producto sin llave: se limpian con él. */
export async function deleteProduct(id: string): Promise<number> {
  let affected = 0
  await getDb().transaction(async (trx) => {
    if (await trx.schema.hasTable(SHOP_TABLES.MYSTERY_CARDS)) {
      const cards = (await trx(SHOP_TABLES.MYSTERY_CARDS).select('id').where({ product_id: id })) as { id: string }[]
      const cardIds = cards.map((card) => String(card.id))
      if (cardIds.length && (await trx.schema.hasTable(SHOP_TABLES.MYSTERY_REVEALS))) {
        await trx(SHOP_TABLES.MYSTERY_REVEALS).whereIn('card_id', cardIds).delete()
      }
      if (cardIds.length) await trx(SHOP_TABLES.MYSTERY_CARDS).whereIn('id', cardIds).delete()
    }
    affected = await trx(SHOP_TABLES.PRODUCTS).where({ id }).delete()
  })
  return affected
}

export async function updateService(service: ShopService): Promise<number> {
  return getDb()(SHOP_TABLES.SERVICES)
    .where({ id: service.id })
    .update({
      title: service.title,
      includes_text: service.includesText,
      handover_text: service.handoverText,
      turnaround_text: service.turnaroundText,
      price_cop: service.priceCop,
    })
}

export async function serviceHasOrders(id: string): Promise<boolean> {
  if (!(await getDb().schema.hasTable(SHOP_TABLES.ORDERS))) return false
  return Boolean(await getDb()(SHOP_TABLES.ORDERS).select('id').where({ service_id: id }).first())
}

export async function deleteService(id: string): Promise<number> {
  return getDb()(SHOP_TABLES.SERVICES).where({ id }).delete()
}

export async function findServices(): Promise<ShopService[]> {
  const rows = await getDb()(SHOP_TABLES.SERVICES)
    .select('id', 'title', 'includes_text', 'handover_text', 'turnaround_text', 'price_cop', 'created_at')
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
