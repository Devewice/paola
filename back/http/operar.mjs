import { createHash, timingSafeEqual } from 'node:crypto'

export function operadorClaveOk(given) {
  const expected = process.env.OPERADOR_CLAVE
  if (!expected || !given) return false
  const left = createHash('sha256').update(String(given)).digest()
  const right = createHash('sha256').update(expected).digest()
  return timingSafeEqual(left, right)
}

export function claveFromRequest(request, body = {}) {
  const header = request.headers['x-operador-clave']
  if (typeof header === 'string' && header) return header
  if (typeof body.clave === 'string') return body.clave
  return ''
}
