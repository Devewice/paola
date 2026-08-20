import { HTTP_HEADER, HTTP_MESSAGES, HTTP_STATUS } from '../../../http/constants.js'
import { sendJson } from '../../../http/send.js'
import type { RouteHandler } from '../../../http/types.js'
import { shopJsonBody, shopOperatorGuard } from '../middlewares/shop.middleware.js'
import {
  readOperatorMystery,
  readPublicMysteryDeck,
  revealMysteryCard,
  saveOperatorMystery,
} from '../services/mystery.service.js'
import {
  createProduct,
  createService,
  listProducts,
  listServices,
} from '../services/shop.service.js'

function sessionFrom(request: { headers: Record<string, string | string[] | undefined> }): string {
  const header = request.headers[HTTP_HEADER.SESSION_ID]
  if (typeof header === 'string') return header
  if (Array.isArray(header)) return header[0] ?? ''
  return ''
}

export const listProductsController: RouteHandler = async (_request, response) => {
  try {
    const products = await listProducts()
    sendJson(response, HTTP_STATUS.OK, { ok: true, products })
  } catch (error) {
    const detail = error instanceof Error ? error.message : HTTP_MESSAGES.MYSQL_FALLBACK
    sendJson(response, HTTP_STATUS.OK, { ok: true, products: [], detail })
  }
}

export const createProductController: RouteHandler = async (request, response) => {
  const body = await shopJsonBody(request, response)
  if (!body) return
  if (!shopOperatorGuard(request, response, body)) return

  const result = await createProduct(body)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, { ok: true, product: result.product })
}

export const listServicesController: RouteHandler = async (_request, response) => {
  try {
    const services = await listServices()
    sendJson(response, HTTP_STATUS.OK, { ok: true, services })
  } catch (error) {
    const detail = error instanceof Error ? error.message : HTTP_MESSAGES.MYSQL_FALLBACK
    sendJson(response, HTTP_STATUS.OK, { ok: true, services: [], detail })
  }
}

export const createServiceController: RouteHandler = async (request, response) => {
  const body = await shopJsonBody(request, response)
  if (!body) return
  if (!shopOperatorGuard(request, response, body)) return

  const result = await createService(body)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, { ok: true, service: result.service })
}

export const listMysteryDeckController: RouteHandler = async (request, response) => {
  try {
    const deck = await readPublicMysteryDeck(sessionFrom(request))
    sendJson(response, HTTP_STATUS.OK, { ok: true, ...deck })
  } catch (error) {
    const detail = error instanceof Error ? error.message : HTTP_MESSAGES.MYSQL_FALLBACK
    sendJson(response, HTTP_STATUS.OK, { ok: true, enabled: false, cards: [], detail })
  }
}

export const revealMysteryCardController: RouteHandler = async (request, response) => {
  const body = await shopJsonBody(request, response)
  if (!body) return
  const cardId = typeof body.cardId === 'string' ? body.cardId.trim() : ''
  const result = await revealMysteryCard(sessionFrom(request), cardId)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, HTTP_STATUS.OK, { ok: true, card: result.value.card })
}

export const readOperatorMysteryController: RouteHandler = async (request, response) => {
  if (!shopOperatorGuard(request, response)) return
  try {
    const config = await readOperatorMystery()
    sendJson(response, HTTP_STATUS.OK, { ok: true, ...config })
  } catch (error) {
    const detail = error instanceof Error ? error.message : HTTP_MESSAGES.MYSQL_FALLBACK
    sendJson(response, HTTP_STATUS.INTERNAL, { ok: false, detail })
  }
}

export const saveOperatorMysteryController: RouteHandler = async (request, response) => {
  const body = await shopJsonBody(request, response)
  if (!body) return
  if (!shopOperatorGuard(request, response, body)) return
  const result = await saveOperatorMystery(body)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, HTTP_STATUS.OK, { ok: true, ...result.value })
}
