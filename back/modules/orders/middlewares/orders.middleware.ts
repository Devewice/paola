import type { IncomingMessage, ServerResponse } from 'node:http'
import { PERMISSION } from '../../../http/constants.js'
import { readBodyOrReject, requirePermission } from '../../../http/guard.js'
import { withErrors } from '../../../http/middleware/errors.js'

export const withOrdersErrors = withErrors

export async function ordersJsonBody(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<Record<string, unknown> | null> {
  return readBodyOrReject(request, response)
}

export async function ordersOperatorGuard(
  request: IncomingMessage,
  response: ServerResponse,
  body: Record<string, unknown> = {},
): Promise<boolean> {
  return Boolean(await requirePermission(request, response, PERMISSION.TIENDA, body))
}
