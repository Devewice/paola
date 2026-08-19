export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL: 500,
} as const

export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
} as const

export const HTTP_HEADER = {
  CONTENT_TYPE: 'content-type',
  OPERADOR_CLAVE: 'x-operador-clave',
  SESSION_ID: 'x-session-id',
} as const

export const CONTENT_TYPE_JSON = 'application/json; charset=utf-8'

export const BODY_CLAVE_FIELD = 'clave'

export const HTTP_MESSAGES = {
  JSON_INVALID: 'El cuerpo no es JSON.',
  CLAVE_INVALID: 'Clave de operadora no válida.',
  MYSQL_FALLBACK: 'mysql',
  INTERNAL: 'error interno',
} as const
