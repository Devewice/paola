import type { IncomingMessage, ServerResponse } from 'node:http'
import { PERMISSION } from '../../../http/constants.js'
import { readBodyOrReject, requirePermission } from '../../../http/guard.js'

export async function authOperatorGuard(
  request: IncomingMessage,
  response: ServerResponse,
  body: Record<string, unknown> = {},
): Promise<boolean> {
  return Boolean(await requirePermission(request, response, PERMISSION.AJUSTES, body))
}

export async function authJsonBody(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<Record<string, unknown> | null> {
  return readBodyOrReject(request, response)
}
