import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import { SHOP_API_MESSAGES } from '@modules/shop/constants/copy.ts'
import type {
  MysteryDeck,
  MysteryDeckCard,
  MysteryOperatorCardDraft,
  MysteryOperatorConfig,
} from '@modules/shop/domain/entities/MysteryDeck.ts'
import type { MysteryDeckPort } from '@modules/shop/domain/ports/MysteryDeckPort.ts'
import { parseProduct } from '@modules/shop/infrastructure/parseProduct.ts'
import {
  API,
  API_FAIL_FALLBACK,
  HTTP_STATUS,
  JSON_HEADERS,
  OPERADOR_CLAVE_HEADER,
  SESSION_HEADER,
} from '@shared/http/constants.ts'

export class HttpMysteryDeckApi implements MysteryDeckPort {
  async loadDeck(sessionId: string): Promise<MysteryDeck> {
    try {
      const response = await fetch(API.SHOP_MYSTERY_DECK, {
        headers: sessionId ? { [SESSION_HEADER]: sessionId } : undefined,
      })
      const body = await readBody(response)
      return parseDeck(body)
    } catch {
      return { enabled: false, cards: [] }
    }
  }

  async revealCard(cardId: string, sessionId: string): Promise<Result<MysteryDeckCard, AppError>> {
    const response = await fetch(API.SHOP_MYSTERY_REVEAL, {
      method: 'POST',
      headers: { ...JSON_HEADERS, [SESSION_HEADER]: sessionId },
      body: JSON.stringify({ cardId }),
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    const card = parseCard(body.card)
    if (!card || card.face !== 'open') {
      return err(appError('INFRASTRUCTURE', SHOP_API_MESSAGES.PARSE_FAIL))
    }
    return ok(card)
  }

  async loadOperator(clave: string): Promise<Result<MysteryOperatorConfig, AppError>> {
    const response = await fetch(API.OPERAR_SHOP_MYSTERY, {
      headers: { [OPERADOR_CLAVE_HEADER]: clave },
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    return ok(parseOperator(body))
  }

  async saveOperator(
    clave: string,
    draft: {
      enabled: boolean
      deckSize: number
      cards: readonly MysteryOperatorCardDraft[]
    },
  ): Promise<Result<MysteryOperatorConfig, AppError>> {
    const response = await fetch(API.OPERAR_SHOP_MYSTERY, {
      method: 'POST',
      headers: { ...JSON_HEADERS, [OPERADOR_CLAVE_HEADER]: clave },
      body: JSON.stringify({ ...draft, clave }),
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    return ok(parseOperator(body))
  }
}

function parseDeck(body: Record<string, unknown>): MysteryDeck {
  const cardsRaw = Array.isArray(body.cards) ? body.cards : []
  const cards = cardsRaw
    .map((item) => parseCard(item))
    .filter((item): item is MysteryDeckCard => item !== null)
  return {
    enabled: Boolean(body.enabled),
    cards,
  }
}

function parseCard(raw: unknown): MysteryDeckCard | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  if (typeof row.id !== 'string' || !row.id) return null
  if (row.face === 'mystery') return { id: row.id, face: 'mystery' }
  if (row.face !== 'open') return null
  const product = parseProduct(row.product)
  if (!product) return null
  if (typeof row.couponCode !== 'string' || !row.couponCode.trim()) return null
  return {
    id: row.id,
    face: 'open',
    couponCode: row.couponCode.trim(),
    product,
  }
}

function parseOperator(body: Record<string, unknown>): MysteryOperatorConfig {
  const settingsRaw =
    body.settings && typeof body.settings === 'object'
      ? (body.settings as Record<string, unknown>)
      : {}
  const cardsRaw = Array.isArray(body.cards) ? body.cards : []
  return {
    settings: {
      enabled: Boolean(settingsRaw.enabled),
      deckSize: Number(settingsRaw.deckSize) || 3,
    },
    cards: cardsRaw
      .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
      .map((row) => ({
        id: String(row.id ?? ''),
        productId: String(row.productId ?? ''),
        couponCode: String(row.couponCode ?? ''),
        active: row.active !== false,
        sortOrder: Number(row.sortOrder) || 0,
        productTitle: typeof row.productTitle === 'string' ? row.productTitle : undefined,
      })),
  }
}

async function readBody(response: Response): Promise<Record<string, unknown>> {
  try {
    const body: unknown = await response.json()
    if (body && typeof body === 'object') return body as Record<string, unknown>
  } catch {
    /* vacío */
  }
  return {}
}

function fail(status: number, body: Record<string, unknown>): Result<never, AppError> {
  const detail = typeof body.detail === 'string' ? body.detail : API_FAIL_FALLBACK
  if (status === HTTP_STATUS.BAD_REQUEST || status === HTTP_STATUS.FORBIDDEN) {
    return err(appError('VALIDATION', detail))
  }
  return err(appError('INFRASTRUCTURE', detail))
}
