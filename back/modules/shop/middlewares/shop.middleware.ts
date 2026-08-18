import type { IncomingMessage, ServerResponse } from 'node:http'
import { readBodyOrReject, requireOperador } from '../../../http/guard.js'
import { withErrors } from '../../../http/middleware/errors.js'

export const withShopErrors = withErrors

export async function shopJsonBody(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<Record<string, unknown> | null> {
  return readBodyOrReject(request, response)
}

export function shopOperatorGuard(
  request: IncomingMessage,
  response: ServerResponse,
  body: Record<string, unknown> = {},
): boolean {
  return requireOperador(request, response, body)
}
