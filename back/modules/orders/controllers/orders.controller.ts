import { HTTP_STATUS } from '../../../http/constants.js'
import { sendJson } from '../../../http/send.js'
import type { RouteHandler } from '../../../http/types.js'
import { ordersJsonBody, ordersOperatorGuard } from '../middlewares/orders.middleware.js'
import { createOrder, findOperatorOrders } from '../services/orders.service.js'

export const createOrderController: RouteHandler = async (request, response) => {
  const body = await ordersJsonBody(request, response)
  if (!body) return

  const result = await createOrder(body)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }

  sendJson(response, HTTP_STATUS.CREATED, { ok: true, order: result.order })
}

export const listOperatorOrdersController: RouteHandler = async (request, response) => {
  if (!ordersOperatorGuard(request, response)) return

  const orders = await findOperatorOrders()
  sendJson(response, HTTP_STATUS.OK, { ok: true, orders })
}

