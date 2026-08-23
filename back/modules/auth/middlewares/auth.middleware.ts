import type { IncomingMessage, ServerResponse } from 'node:http'
import { requireOperador, readBodyOrReject } from '../../../http/guard.js'

export function authOperatorGuard(
  request: IncomingMessage,
  response: ServerResponse,
  body: Record<string, unknown> = {},
): boolean {
  return requireOperador(request, response, body)
}

export async function authJsonBody(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<Record<string, unknown> | null> {
  return readBodyOrReject(request, response)
}
