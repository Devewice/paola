export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL: 500,
  BAD_GATEWAY: 502,
} as const

export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
} as const

export const HTTP_HEADER = {
  CONTENT_TYPE: 'content-type',
  OPERADOR_CLAVE: 'x-operador-clave',
  SESSION_ID: 'x-session-id',
  VOTER_KEY: 'x-voter-key',
} as const

export const CONTENT_TYPE_JSON = 'application/json; charset=utf-8'

export const BODY_CLAVE_FIELD = 'clave'

export const PERMISSION = {
  RODADAS: 'rodadas',
  VOZ: 'voz',
  ENCUESTAS: 'encuestas',
  TIENDA: 'tienda',
  PARCHE: 'parche',
  COMUNIDAD: 'comunidad',
  AJUSTES: 'ajustes',
  ROLES: 'roles',
} as const

export type Permission = (typeof PERMISSION)[keyof typeof PERMISSION]

export const PERMISSION_LIST: readonly Permission[] = Object.values(PERMISSION)

export const ADMIN_ROLE_ID = 'admin'
export const DEFAULT_ROLE_ID = 'usuario'

export const HTTP_MESSAGES = {
  JSON_INVALID: 'El cuerpo no es JSON.',
  CLAVE_INVALID: 'Tu cuenta no tiene permiso para esto.',
  /** Igual al 404 de ruta inexistente: el panel no se delata sin permisos. */
  HIDDEN: 'ruta de API no existe aún',
  MYSQL_FALLBACK: 'mysql',
  INTERNAL: 'error interno',
} as const
