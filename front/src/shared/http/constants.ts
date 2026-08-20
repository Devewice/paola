export const FETCH_TIMEOUT_MS = 2500

export const JSON_HEADERS = { 'content-type': 'application/json' } as const

export const OPERADOR_CLAVE_HEADER = 'x-operador-clave'

export const SESSION_HEADER = 'x-session-id'

export const API_FAIL_FALLBACK = 'No se pudo completar.'

export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
} as const

export const POST_REACTION = {
  LATE: 'late',
  AHI: 'ahi',
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
  ME_VISIBILITY: '/api/me/visibility',
  COMMUNITIES: '/api/communities',
  FEED: '/api/feed',
  ACTIVITY: '/api/activity',
  FRIENDS: '/api/friends',
  FRIEND_REQUEST: '/api/friends/request',
  CHATS: '/api/chats',
  PRODUCTS: '/api/products',
  SERVICES: '/api/services',
  SHOP_MYSTERY_DECK: '/api/shop/mystery-deck',
  SHOP_MYSTERY_REVEAL: '/api/shop/mystery-deck/reveal',
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
  OPERAR_REPORTS: '/api/operar/reports',
  OPERAR_COMMUNITIES: '/api/operar/communities',
  OPERAR_SHOP_MYSTERY: '/api/operar/shop/mystery',
  PAYMENTS_METHODS: '/api/payments/methods',
  PAYMENTS_CHECKOUT: '/api/payments/checkout',
  OPERAR_PAYMENTS: '/api/operar/payments',
  OPERAR_PAYMENTS_TEST: '/api/operar/payments/test',
} as const

export function apiOutingTickets(id: string): string {
  return `${API.OUTINGS}/${encodeURIComponent(id)}/tickets`
}

export function apiOutingChat(id: string): string {
  return `${API.OUTINGS}/${encodeURIComponent(id)}/chat`
}

export function apiOutingChatMessages(id: string): string {
  return `${API.OUTINGS}/${encodeURIComponent(id)}/chat/messages`
}

export function apiOperarOutingChatPin(id: string): string {
  return `/api/operar/outings/${encodeURIComponent(id)}/chat/pin`
}

export function apiOperarOutingStatus(id: string): string {
  return `${API.OPERAR_OUTINGS}/${encodeURIComponent(id)}/status`
}

export function apiOperarReportStatus(id: string): string {
  return `${API.OPERAR_REPORTS}/${encodeURIComponent(id)}/status`
}

export function apiMemoryComments(id: string): string {
  return `${API.MEMORIES}/${encodeURIComponent(id)}/comments`
}

export function apiCommunityJoin(id: string): string {
  return `${API.COMMUNITIES}/${encodeURIComponent(id)}/join`
}

export function apiCommunityFollow(id: string): string {
  return `${API.COMMUNITIES}/${encodeURIComponent(id)}/follow`
}

export function apiCommunityPosts(id: string): string {
  return `${API.COMMUNITIES}/${encodeURIComponent(id)}/posts`
}

export function apiPostReactions(id: string): string {
  return `/api/posts/${encodeURIComponent(id)}/reactions`
}

export function apiPostHide(id: string): string {
  return `/api/posts/${encodeURIComponent(id)}/hide`
}

export function apiPostPin(id: string): string {
  return `/api/posts/${encodeURIComponent(id)}/pin`
}

export function apiOperarPostHighlight(id: string): string {
  return `/api/operar/posts/${encodeURIComponent(id)}/highlight`
}

export function apiOperarCommunityModerators(id: string): string {
  return `/api/operar/communities/${encodeURIComponent(id)}/moderators`
}

export function apiFriendAccept(id: string): string {
  return `${API.FRIENDS}/${encodeURIComponent(id)}/accept`
}

export function apiFriendBlock(id: string): string {
  return `${API.FRIENDS}/${encodeURIComponent(id)}/block`
}

export function apiChatMessages(id: string): string {
  return `${API.CHATS}/${encodeURIComponent(id)}/messages`
}

export function apiUserFollow(id: string): string {
  return `/api/users/${encodeURIComponent(id)}/follow`
}

export function apiParcero(alias: string): string {
  return `/api/parcero/${encodeURIComponent(alias)}`
}

export const APP_PATHS = {
  INICIO: '/',
  PARCHESE: '/parchese',
  TU_VOZ: '/tu-voz',
  TIENDA: '/tienda',
  PAOLA: '/paola',
  ADMIN: '/admin',
  ADMIN_UI: '/admin/ui',
  KIT: '/kit',
  OPERAR: '/operar',
  PRIVACIDAD: '/privacidad',
  CUENTA: '/cuenta',
  FEED: '/feed',
  PARCERO: '/parcero',
} as const

export function appTiendaFicha(id: string): string {
  return `${APP_PATHS.TIENDA}/${encodeURIComponent(id)}`
}

export function appTiendaServicio(id: string): string {
  return `${APP_PATHS.TIENDA}/servicio/${encodeURIComponent(id)}`
}

export function appParcero(alias: string): string {
  return `${APP_PATHS.PARCERO}/${encodeURIComponent(alias)}`
}
