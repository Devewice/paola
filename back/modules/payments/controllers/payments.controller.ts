import { HTTP_STATUS } from '../../../http/constants.js'
import { sendJson } from '../../../http/send.js'
import type { RouteHandler } from '../../../http/types.js'
import { paymentsJsonBody, paymentsOperatorGuard } from '../middlewares/payments.middleware.js'
import { parseCheckout, parseSaveGateways, parseTestGateway } from '../schemas/payments.schema.js'
import {
  createCheckout,
  listOperatorGateways,
  listPublicMethods,
  saveGateways,
  testGateway,
} from '../services/payments.service.js'

export const listMethodsController: RouteHandler = async (_request, response) => {
  try {
    const methods = await listPublicMethods()
    sendJson(response, HTTP_STATUS.OK, { ok: true, methods })
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'mysql'
    sendJson(response, HTTP_STATUS.OK, { ok: true, methods: [], detail })
  }
}

export const checkoutController: RouteHandler = async (request, response) => {
  const body = await paymentsJsonBody(request, response)
  if (!body) return
  const parsed = parseCheckout(body)
  if (!parsed.ok) {
    sendJson(response, parsed.status, { ok: false, detail: parsed.detail })
    return
  }
  const result = await createCheckout(parsed.value)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, { ok: true, checkout: result.checkout })
}

export const listOperatorGatewaysController: RouteHandler = async (request, response) => {
  if (!paymentsOperatorGuard(request, response)) return
  try {
    const gateways = await listOperatorGateways()
    sendJson(response, HTTP_STATUS.OK, { ok: true, gateways })
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'mysql'
    sendJson(response, HTTP_STATUS.OK, { ok: true, gateways: [], detail })
  }
}

export const saveGatewaysController: RouteHandler = async (request, response) => {
  const body = await paymentsJsonBody(request, response)
  if (!body) return
  if (!paymentsOperatorGuard(request, response, body)) return
  const parsed = parseSaveGateways(body)
  if (!parsed.ok) {
    sendJson(response, parsed.status, { ok: false, detail: parsed.detail })
    return
  }
  const result = await saveGateways(parsed.value)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, HTTP_STATUS.OK, { ok: true, gateways: result.gateways })
}

export const testGatewayController: RouteHandler = async (request, response) => {
  const body = await paymentsJsonBody(request, response)
  if (!body) return
  if (!paymentsOperatorGuard(request, response, body)) return
  const parsed = parseTestGateway(body)
  if (!parsed.ok) {
    sendJson(response, parsed.status, { ok: false, detail: parsed.detail })
    return
  }
  const result = await testGateway(parsed.value.provider)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, HTTP_STATUS.OK, { ok: true, test: result.test })
}
