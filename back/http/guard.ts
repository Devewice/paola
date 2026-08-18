import type { IncomingMessage, ServerResponse } from 'node:http'
import { HTTP_MESSAGES, HTTP_STATUS } from './constants.js'
import { claveFromRequest, operadorClaveOk } from './operar.js'
import { readJson } from './readJson.js'
import { sendJson } from './send.js'

export async function readBodyOrReject(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<Record<string, unknown> | null> {
  try {
    return await readJson(request)
  } catch {
    sendJson(response, HTTP_STATUS.BAD_REQUEST, {
      ok: false,
      detail: HTTP_MESSAGES.JSON_INVALID,
    })
    return null
  }
}

export function requireOperador(
  request: IncomingMessage,
  response: ServerResponse,
  body: Record<string, unknown> = {},
): boolean {
  if (operadorClaveOk(claveFromRequest(request, body))) return true
  sendJson(response, HTTP_STATUS.FORBIDDEN, {
    ok: false,
    detail: HTTP_MESSAGES.CLAVE_INVALID,
  })
  return false
}
