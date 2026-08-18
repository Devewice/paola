import type { IncomingMessage, ServerResponse } from 'node:http'
import { readBodyOrReject, requireOperador } from '../../../http/guard.js'
import { withErrors } from '../../../http/middleware/errors.js'

export const withOrdersErrors = withErrors

export async function ordersJsonBody(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<Record<string, unknown> | null> {
  return readBodyOrReject(request, response)
}

export function ordersOperatorGuard(
  request: IncomingMessage,
  response: ServerResponse,
  body: Record<string, unknown> = {},
): boolean {
  return requireOperador(request, response, body)
}

