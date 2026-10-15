import type { IncomingMessage, ServerResponse } from 'node:http'
import { PERMISSION } from '../../../http/constants.js'
import { readBodyOrReject, requirePermission } from '../../../http/guard.js'
import { withErrors } from '../../../http/middleware/errors.js'

export const withPaymentsErrors = withErrors

export async function paymentsJsonBody(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<Record<string, unknown> | null> {
  return readBodyOrReject(request, response)
}

export async function paymentsOperatorGuard(
  request: IncomingMessage,
  response: ServerResponse,
  body: Record<string, unknown> = {},
): Promise<boolean> {
  return Boolean(await requirePermission(request, response, PERMISSION.AJUSTES, body))
}
