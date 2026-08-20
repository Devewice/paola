import { fail } from '../../../http/fail.js'
import type { Parsed } from '../../../http/types.js'
import {
  SHOP_MESSAGES,
  SHOP_MYSTERY_LIMITS,
} from '../constants/shop.constants.js'
import {
  clampDeckSize,
  findMysteryCard,
  findProductById,
  findSessionUserId,
  listMysteryCards,
  listRevealedCardIds,
  readMysterySettings,
  replaceMysteryConfig,
  saveMysteryReveal,
  type MysteryDeckCard,
  type MysterySettings,
} from '../providers/mystery.provider.js'

export type PublicMysteryDeck = {
  readonly enabled: boolean
  readonly cards: readonly MysteryDeckCard[]
}

export type OperatorMysteryConfig = {
  readonly settings: MysterySettings
  readonly cards: readonly {
    readonly id: string
    readonly productId: string
    readonly couponCode: string
    readonly active: boolean
    readonly sortOrder: number
    readonly productTitle?: string
  }[]
}

export async function readPublicMysteryDeck(sessionId = ''): Promise<PublicMysteryDeck> {
  const settings = await readMysterySettings()
  if (!settings.enabled) return { enabled: false, cards: [] }

  const all = await listMysteryCards(true)
  const limited = all.slice(0, settings.deckSize)
  const userId = await findSessionUserId(sessionId)
  const revealed = userId ? await listRevealedCardIds(userId) : new Set<string>()

  const cards: MysteryDeckCard[] = []
  for (const card of limited) {
    if (userId && revealed.has(card.id)) {
      const product = await findProductById(card.productId)
      if (!product) {
        cards.push({ id: card.id, face: 'mystery' })
        continue
      }
      cards.push({
        id: card.id,
        face: 'open',
        couponCode: card.couponCode,
        product,
      })
      continue
    }
    cards.push({ id: card.id, face: 'mystery' })
  }
  return { enabled: true, cards }
}

export async function revealMysteryCard(
  sessionId: string,
  cardId: string,
): Promise<Parsed<{ card: MysteryDeckCard }>> {
  const userId = await findSessionUserId(sessionId)
  if (!userId) return fail(403, SHOP_MESSAGES.MYSTERY_SESSION)

  const settings = await readMysterySettings()
  if (!settings.enabled) return fail(404, SHOP_MESSAGES.MYSTERY_DISABLED)

  const card = await findMysteryCard(cardId)
  if (!card || !card.active) return fail(404, SHOP_MESSAGES.MYSTERY_CARD_MISSING)

  const product = await findProductById(card.productId)
  if (!product) return fail(404, SHOP_MESSAGES.MYSTERY_CARD_MISSING)

  await saveMysteryReveal(card.id, userId)
  return {
    ok: true,
    value: {
      card: {
        id: card.id,
        face: 'open',
        couponCode: card.couponCode,
        product,
      },
    },
  }
}

export async function readOperatorMystery(): Promise<OperatorMysteryConfig> {
  const settings = await readMysterySettings()
  const cards = await listMysteryCards(false)
  const withTitles = await Promise.all(
    cards.map(async (card) => {
      const product = await findProductById(card.productId)
      return {
        ...card,
        productTitle: product?.title,
      }
    }),
  )
  return { settings, cards: withTitles }
}

export async function saveOperatorMystery(draft: Record<string, unknown>): Promise<Parsed<OperatorMysteryConfig>> {
  const deckSize = clampDeckSize(draft.deckSize)
  if (deckSize === 'bad') return fail(400, SHOP_MESSAGES.MYSTERY_DECK_SIZE)

  const enabled = Boolean(draft.enabled)
  const rawCards = Array.isArray(draft.cards) ? draft.cards : []
  const cards: { productId: string; couponCode: string; active: boolean }[] = []

  for (const entry of rawCards) {
    if (!entry || typeof entry !== 'object') continue
    const row = entry as Record<string, unknown>
    const productId = typeof row.productId === 'string' ? row.productId.trim() : ''
    const couponCode = typeof row.couponCode === 'string' ? row.couponCode.trim().toUpperCase() : ''
    if (!productId) return fail(400, SHOP_MESSAGES.MYSTERY_PRODUCT)
    if (!couponCode) return fail(400, SHOP_MESSAGES.MYSTERY_COUPON)
    const product = await findProductById(productId)
    if (!product) return fail(400, SHOP_MESSAGES.MYSTERY_PRODUCT)
    cards.push({
      productId,
      couponCode,
      active: row.active === false ? false : true,
    })
  }

  if (enabled && cards.filter((item) => item.active).length < SHOP_MYSTERY_LIMITS.DECK_MIN) {
    return fail(400, SHOP_MESSAGES.MYSTERY_PRODUCT)
  }

  await replaceMysteryConfig({ enabled, deckSize, cards })
  return { ok: true, value: await readOperatorMystery() }
}
