export const MEMORY_LIMITS = {
  KM_MIN: 1,
  TEXT_MIN: 2,
  PHOTO_SRC_MIN: 4,
  PHOTO_ALT_MIN: 2,
} as const

export const MEMORY_TABLES = {
  MEMORIES: 'memories',
  PHOTOS: 'memory_photos',
  OUTINGS: 'outings',
} as const

export const MEMORY_STATUS_DONE = 'realizado'

export const MEMORY_ROUTES = {
  LIST: '/api/memories',
  CREATE: '/api/operar/memories',
} as const

export const MEMORY_MESSAGES = {
  OUTING_REQUIRED: 'Elige la salida realizada.',
  KM_REQUIRED: 'La memoria necesita kilómetros (entero ≥ 1).',
  CLOSING_REQUIRED: 'Cierra con un párrafo (Armargura).',
  CREDIT_REQUIRED: 'Di quién tomó las fotos (crédito).',
  PARTICIPANTS_REQUIRED: 'Di quién salió, con permiso.',
  PHOTO_REQUIRED: 'Al menos una foto con enlace y texto alterno.',
  OUTING_NOT_FOUND: 'Esa salida no está.',
  NOT_DONE: 'Solo se recuerda una salida marcada como realizada.',
  ALREADY_EXISTS: 'Esa salida ya tiene memoria.',
  READ_FAIL: 'Se guardó pero no se pudo leer la memoria.',
} as const
