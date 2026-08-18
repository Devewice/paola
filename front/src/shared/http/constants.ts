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
  FINES: '/api/fines',
  REPORTS: '/api/reports',
  USERS_REGISTER: '/api/users/register',
  USERS_LOGIN: '/api/users/login',
  ME_PANEL: '/api/me/panel',
  COMMUNITIES: '/api/communities',
  FEED: '/api/feed',
  PRODUCTS: '/api/products',
  SERVICES: '/api/services',
  ALLIANCES: '/api/alliances',
  MEMBERS: '/api/members',
  ORDERS: '/api/orders',
  OPERAR_OUTINGS: '/api/operar/outings',
  OPERAR_ALLIANCES: '/api/operar/alliances',
  OPERAR_MEMBERS: '/api/operar/members',
  OPERAR_MEMORIES: '/api/operar/memories',
  OPERAR_PRODUCTS: '/api/operar/products',
  OPERAR_SERVICES: '/api/operar/services',
  OPERAR_ORDERS: '/api/operar/orders',
  OPERAR_FINES: '/api/operar/fines',
  OPERAR_REPORT_STATUS: '/api/operar/reports',
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
  PRIVACIDAD: '/privacidad',
  CUENTA: '/cuenta',
  FEED: '/feed',
} as const

export function appTiendaFicha(id: string): string {
  return `${APP_PATHS.TIENDA}/${encodeURIComponent(id)}`
}

export function appTiendaServicio(id: string): string {
  return `${APP_PATHS.TIENDA}/servicio/${encodeURIComponent(id)}`
}
