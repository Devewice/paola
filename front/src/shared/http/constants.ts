export const FETCH_TIMEOUT_MS = 2500

export const JSON_HEADERS = { 'content-type': 'application/json' } as const

export const OPERADOR_CLAVE_HEADER = 'x-operador-clave'

export const SESSION_HEADER = 'x-session-id'

export const VOTER_KEY_HEADER = 'x-voter-key'

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
  OPERAR_TIPS: '/api/operar/tips',
  OPERAR_FINES: '/api/operar/fines',
  OPERAR_REPORTS: '/api/operar/reports',
  OPERAR_COMMUNITIES: '/api/operar/communities',
  OPERAR_SHOP_MYSTERY: '/api/operar/shop/mystery',
  PAYMENTS_METHODS: '/api/payments/methods',
  PAYMENTS_CHECKOUT: '/api/payments/checkout',
  OPERAR_PAYMENTS: '/api/operar/payments',
  OPERAR_PAYMENTS_TEST: '/api/operar/payments/test',
  AUTH_METHODS: '/api/auth/methods',
  AUTH_GOOGLE_START: '/api/auth/google/start',
  OPERAR_AUTH: '/api/operar/auth',
  POLLS: '/api/polls',
  OPERAR_POLLS: '/api/operar/polls',
  OPERAR_ACCESS: '/api/operar/access',
  OPERAR_ROLES: '/api/operar/roles',
  OPERAR_USERS: '/api/operar/users',
} as const

export function apiOperarRole(id: string): string {
  return `${API.OPERAR_ROLES}/${encodeURIComponent(id)}`
}

export function apiOperarRoleDelete(id: string): string {
  return `${apiOperarRole(id)}/delete`
}

export function apiOperarUserRole(id: string): string {
  return `${API.OPERAR_USERS}/${encodeURIComponent(id)}/role`
}

export function apiOperarUsers(query: string): string {
  return query ? `${API.OPERAR_USERS}?q=${encodeURIComponent(query)}` : API.OPERAR_USERS
}

export const POLLS_QUERY = {
  OUTING: 'outingId',
  FEATURED: 'featured',
} as const

export function apiPoll(id: string): string {
  return `${API.POLLS}/${encodeURIComponent(id)}`
}

export function apiPollVotes(id: string): string {
  return `${apiPoll(id)}/votes`
}

export function apiOperarPoll(id: string): string {
  return `${API.OPERAR_POLLS}/${encodeURIComponent(id)}`
}

export function apiOperarPollDelete(id: string): string {
  return `${apiOperarPoll(id)}/delete`
}

export function apiOutingTickets(id: string): string {
  return `${API.OUTINGS}/${encodeURIComponent(id)}/tickets`
}

export function apiOutingCrew(id: string): string {
  return `${API.OUTINGS}/${encodeURIComponent(id)}/crew`
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
  PARCHESE_RODADAS: '/parchese/rodadas',
  PARCHESE_MEMORIAS: '/parchese/memorias',
  PARCHESE_EL_PARCHE: '/parchese/el-parche',
  TU_VOZ: '/tu-voz',
  TU_VOZ_TIPS: '/tu-voz/tips',
  TU_VOZ_COMPARENDOS: '/tu-voz/comparendos',
  TU_VOZ_REPORTES: '/tu-voz/reportes',
  TU_VOZ_ENCUESTAS: '/tu-voz/encuestas',
  TIENDA: '/tienda',
  PAOLA: '/paola',
  ADMIN: '/admin',
  ADMIN_UI: '/admin/ui',
  OPERAR: '/operar',
  PRIVACIDAD: '/privacidad',
  CUENTA: '/cuenta',
  ENTRAR: '/entrar',
  FEED: '/feed',
  PARCERO: '/parcero',
} as const

export const SHOP_SHELF_QUERY = 'estanteria'

export function appTiendaEstanteria(shelf: string): string {
  return `${APP_PATHS.TIENDA}?${SHOP_SHELF_QUERY}=${encodeURIComponent(shelf)}#catalogo`
}

export function appTiendaFicha(id: string): string {
  return `${APP_PATHS.TIENDA}/${encodeURIComponent(id)}`
}

export function appTiendaServicio(id: string): string {
  return `${APP_PATHS.TIENDA}/servicio/${encodeURIComponent(id)}`
}

export function appRodada(id: string): string {
  return `${APP_PATHS.PARCHESE_RODADAS}/${encodeURIComponent(id)}`
}

export function appEncuesta(id: string): string {
  return `${APP_PATHS.TU_VOZ_ENCUESTAS}/${encodeURIComponent(id)}`
}

export function appEntrarYVolver(next: string): string {
  return `${APP_PATHS.ENTRAR}?next=${encodeURIComponent(next)}`
}

export function appParcero(alias: string): string {
  return `${APP_PATHS.PARCERO}/${encodeURIComponent(alias)}`
}
