import { createHash, timingSafeEqual } from 'node:crypto'
import type { IncomingMessage } from 'node:http'
import { ENV } from '../constants.js'
import { BODY_CLAVE_FIELD, HTTP_HEADER } from './constants.js'

export function operadorClaveOk(given: string): boolean {
  const expected = process.env[ENV.OPERADOR_CLAVE]
  if (!expected || !given) return false
  const left = createHash('sha256').update(String(given)).digest()
  const right = createHash('sha256').update(expected).digest()
  return timingSafeEqual(left, right)
}

export function claveFromRequest(request: IncomingMessage, body: Record<string, unknown> = {}): string {
  const header = request.headers[HTTP_HEADER.OPERADOR_CLAVE]
  if (typeof header === 'string' && header) return header
  const clave = body[BODY_CLAVE_FIELD]
  if (typeof clave === 'string') return clave
  return ''
}
