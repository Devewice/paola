import type { IncomingMessage } from 'node:http'
import { findAccess } from '../modules/roles/providers/roles.provider.js'
import type { Access } from '../modules/roles/interfaces/roles.interface.js'
import { BODY_CLAVE_FIELD, HTTP_HEADER, type Permission } from './constants.js'

function headerOf(request: IncomingMessage, name: string): string {
  const value = request.headers[name]
  if (typeof value === 'string') return value.trim()
  if (Array.isArray(value)) return (value[0] ?? '').trim()
  return ''
}

/** La sesión de panel viaja como `x-operador-clave`, campo `clave` o `x-session-id`. */
export function operadorSessionFrom(request: IncomingMessage, body: Record<string, unknown> = {}): string {
  const header = headerOf(request, HTTP_HEADER.OPERADOR_CLAVE)
  if (header) return header
  const clave = body[BODY_CLAVE_FIELD]
  if (typeof clave === 'string' && clave.trim()) return clave.trim()
  return headerOf(request, HTTP_HEADER.SESSION_ID)
}

export async function operadorAccess(
  request: IncomingMessage,
  body: Record<string, unknown> = {},
): Promise<Access | null> {
  try {
    return await findAccess(operadorSessionFrom(request, body))
  } catch {
    return null
  }
}

export async function hasPermission(
  request: IncomingMessage,
  permission: Permission,
  body: Record<string, unknown> = {},
): Promise<boolean> {
  const access = await operadorAccess(request, body)
  return Boolean(access?.permissions.includes(permission))
}
