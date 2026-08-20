import { randomUUID } from 'node:crypto'
import { getDb } from '../../../db/knex.js'
import {
  SHOP_MESSAGES,
  SHOP_MYSTERY_LIMITS,
  SHOP_TABLES,
} from '../constants/shop.constants.js'
import type { Product } from '../interfaces/shop.interface.js'
import { toProduct } from '../schemas/shop.schema.js'

export type MysterySettings = {
  readonly enabled: boolean
  readonly deckSize: number
}

export type MysteryCardRow = {
  readonly id: string
  readonly productId: string
  readonly couponCode: string
  readonly active: boolean
  readonly sortOrder: number
}

export type MysteryRevealFace = {
  readonly id: string
  readonly face: 'open'
  readonly couponCode: string
  readonly product: Product
}

export type MysteryHiddenFace = {
  readonly id: string
  readonly face: 'mystery'
}

export type MysteryDeckCard = MysteryRevealFace | MysteryHiddenFace

export async function readMysterySettings(): Promise<MysterySettings> {
  const row = await getDb()(SHOP_TABLES.MYSTERY_SETTINGS).where({ id: 'default' }).first()
  if (!row) {
    return { enabled: false, deckSize: SHOP_MYSTERY_LIMITS.DECK_DEFAULT }
  }
  const size = Number(row.deck_size)
  return {
    enabled: Boolean(row.enabled),
    deckSize: Number.isFinite(size) ? size : SHOP_MYSTERY_LIMITS.DECK_DEFAULT,
  }
}

export async function listMysteryCards(activeOnly = false): Promise<MysteryCardRow[]> {
  let query = getDb()(SHOP_TABLES.MYSTERY_CARDS).select(
    'id',
    'product_id',
    'coupon_code',
    'active',
    'sort_order',
  ).orderBy('sort_order', 'asc')
  if (activeOnly) query = query.where({ active: true })
  const rows = await query
  return rows.map((row) => ({
    id: String(row.id),
    productId: String(row.product_id),
    couponCode: String(row.coupon_code),
    active: Boolean(row.active),
    sortOrder: Number(row.sort_order) || 0,
  }))
}

export async function findMysteryCard(id: string): Promise<MysteryCardRow | null> {
  const row = await getDb()(SHOP_TABLES.MYSTERY_CARDS).where({ id }).first()
  if (!row) return null
  return {
    id: String(row.id),
    productId: String(row.product_id),
    couponCode: String(row.coupon_code),
    active: Boolean(row.active),
    sortOrder: Number(row.sort_order) || 0,
  }
}

export async function findProductById(id: string): Promise<Product | null> {
  const row = await getDb()(SHOP_TABLES.PRODUCTS)
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
    .where({ id })
    .first()
  if (!row) return null
  return toProduct(row as Record<string, unknown>)
}

export async function findSessionUserId(sessionId: string): Promise<string | null> {
  if (!sessionId) return null
  const row = await getDb()(SHOP_TABLES.SESSIONS)
    .select('user_id as userId', 'expires_at as expiresAt')
    .where({ id: sessionId })
    .first()
  if (!row?.userId) return null
  const expiresAt = new Date(String(row.expiresAt))
  if (Number.isNaN(expiresAt.valueOf()) || expiresAt.getTime() < Date.now()) return null
  return String(row.userId)
}

export async function listRevealedCardIds(userId: string): Promise<ReadonlySet<string>> {
  const rows = await getDb()(SHOP_TABLES.MYSTERY_REVEALS)
    .select('card_id')
    .where({ user_id: userId })
  return new Set(rows.map((row) => String(row.card_id)))
}

export async function saveMysteryReveal(cardId: string, userId: string): Promise<void> {
  const existing = await getDb()(SHOP_TABLES.MYSTERY_REVEALS)
    .where({ card_id: cardId, user_id: userId })
    .first()
  if (existing) return
  await getDb()(SHOP_TABLES.MYSTERY_REVEALS).insert({
    id: randomUUID(),
    card_id: cardId,
    user_id: userId,
  })
}

export async function replaceMysteryConfig(input: {
  enabled: boolean
  deckSize: number
  cards: readonly { productId: string; couponCode: string; active: boolean }[]
}): Promise<void> {
  const db = getDb()
  await db.transaction(async (trx) => {
    await trx(SHOP_TABLES.MYSTERY_SETTINGS)
      .insert({
        id: 'default',
        enabled: input.enabled,
        deck_size: input.deckSize,
        updated_at: trx.fn.now(),
      })
      .onConflict('id')
      .merge(['enabled', 'deck_size', 'updated_at'])

    await trx(SHOP_TABLES.MYSTERY_REVEALS).del()
    await trx(SHOP_TABLES.MYSTERY_CARDS).del()

    if (!input.cards.length) return
    await trx(SHOP_TABLES.MYSTERY_CARDS).insert(
      input.cards.map((card, index) => ({
        id: randomUUID(),
        product_id: card.productId,
        coupon_code: card.couponCode,
        active: card.active,
        sort_order: index,
      })),
    )
  })
}

export function clampDeckSize(value: unknown): number | 'bad' {
  const n = Number(value)
  if (!Number.isInteger(n) || n < SHOP_MYSTERY_LIMITS.DECK_MIN || n > SHOP_MYSTERY_LIMITS.DECK_MAX) {
    return 'bad'
  }
  return n
}

export { SHOP_MESSAGES }
