import { HTTP_MESSAGES, HTTP_STATUS } from '../../../http/constants.js'
import { sendJson } from '../../../http/send.js'
import type { RouteHandler } from '../../../http/types.js'
import { shopJsonBody, shopOperatorGuard } from '../middlewares/shop.middleware.js'
import { createProduct, listProducts } from '../services/shop.service.js'

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
