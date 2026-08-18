export const FETCH_TIMEOUT_MS = 2500

export const JSON_HEADERS = { 'content-type': 'application/json' } as const

export const OPERADOR_CLAVE_HEADER = 'x-operador-clave'

export const API_FAIL_FALLBACK = 'No se pudo completar.'

export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
} as const

export const API = {
  OUTINGS: '/api/outings',
  MEMORIES: '/api/memories',
  TIPS: '/api/tips',
  PRODUCTS: '/api/products',
  ALLIANCES: '/api/alliances',
  MEMBERS: '/api/members',
  OPERAR_OUTINGS: '/api/operar/outings',
  OPERAR_ALLIANCES: '/api/operar/alliances',
  OPERAR_MEMBERS: '/api/operar/members',
  OPERAR_MEMORIES: '/api/operar/memories',
  OPERAR_PRODUCTS: '/api/operar/products',
} as const

export function apiOutingTickets(id: string): string {
  return `${API.OUTINGS}/${encodeURIComponent(id)}/tickets`
}

export function apiOperarOutingStatus(id: string): string {
  return `${API.OPERAR_OUTINGS}/${encodeURIComponent(id)}/status`
}

export const APP_PATHS = {
  INICIO: '/',
  PARCHESE: '/parchese',
  TU_VOZ: '/tu-voz',
  TIENDA: '/tienda',
  PAOLA: '/paola',
  KIT: '/kit',
  OPERAR: '/operar',
} as const

export function appTiendaFicha(id: string): string {
  return `${APP_PATHS.TIENDA}/${id}`
}
