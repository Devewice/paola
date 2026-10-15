import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Access } from '../modules/roles/interfaces/roles.interface.js'
import { HTTP_MESSAGES, HTTP_STATUS, type Permission } from './constants.js'
import { operadorAccess } from './operar.js'
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

export async function requirePermission(
  request: IncomingMessage,
  response: ServerResponse,
  permission: Permission,
  body: Record<string, unknown> = {},
): Promise<Access | null> {
  const access = await operadorAccess(request, body)
  if (access?.permissions.includes(permission)) return access
  if (!access?.permissions.length) {
    sendJson(response, HTTP_STATUS.NOT_FOUND, { ok: false, detail: HTTP_MESSAGES.HIDDEN })
    return null
  }
  sendJson(response, HTTP_STATUS.FORBIDDEN, { ok: false, detail: HTTP_MESSAGES.CLAVE_INVALID })
  return null
}
