export const AUTH_TABLES = {
  PROVIDERS: 'auth_providers',
} as const

export const AUTH_PROVIDER = {
  GOOGLE: 'google',
  PASSWORD: 'password',
} as const

export type AuthProviderId = (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER]

export const AUTH_STATUS = {
  DRAFT: 'draft',
  READY: 'ready',
  LIVE: 'live',
  OFF: 'off',
} as const

export type AuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS]

export const AUTH_CREDENTIAL_KEYS = {
  CLIENT_ID: 'clientId',
  CLIENT_SECRET: 'clientSecret',
  REDIRECT_URI: 'redirectUri',
} as const

export const AUTH_MESSAGES = {
  MISSING_KEYS: 'Faltan client ID, secret o redirect de Gmail.',
  NOT_READY: 'Gmail todavía no está activado.',
  SAVE_OK: 'Login con Gmail guardado.',
} as const

export const AUTH_ROUTES = {
  METHODS: '/api/auth/methods',
  GOOGLE_START: '/api/auth/google/start',
  OPERAR_GET: '/api/operar/auth',
  OPERAR_SAVE: '/api/operar/auth',
} as const

export const GOOGLE_SCOPES = 'openid email profile'
export const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
