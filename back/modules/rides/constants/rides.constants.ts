import type { OutingKind, OutingStatus } from '../interfaces/rides.interface.js'

export const RIDES_KINDS: readonly OutingKind[] = ['rodada', 'actividad']
export const RIDES_STATUSES: readonly OutingStatus[] = ['abierto', 'lleno', 'cerrado', 'realizado']
export const RIDES_OPERATOR_STATUSES = ['cerrado', 'realizado'] as const

export const RIDES_DEFAULT_KIND: OutingKind = 'rodada'
export const RIDES_DEFAULT_STATUS: OutingStatus = 'abierto'
export const RIDES_STATUS_OPEN: OutingStatus = 'abierto'
export const RIDES_STATUS_FULL: OutingStatus = 'lleno'
export const RIDES_STATUS_CLOSED: OutingStatus = 'cerrado'
export const RIDES_STATUS_DONE: OutingStatus = 'realizado'

export const RIDES_KIND_SET = new Set<string>(RIDES_KINDS)
export const RIDES_STATUS_SET = new Set<string>(RIDES_STATUSES)

export const RIDES_LIMITS = {
  NAME_MIN: 2,
  WHATSAPP_MIN: 10,
  WHATSAPP_MAX: 15,
  CAPACITY_MIN: 1,
} as const

export const RIDES_TABLES = {
  OUTINGS: 'outings',
  TICKETS: 'tickets',
} as const

export const WHATSAPP_NON_DIGIT = /\D/g

export const RIDES_ROUTES = {
  LIST: '/api/outings',
  CLAIM: '/api/outings/:id/tickets',
  OPERATE_LIST: '/api/operar/outings',
  OPERATE_CREATE: '/api/operar/outings',
  OPERATE_STATUS: '/api/operar/outings/:id/status',
} as const

export const RIDES_MESSAGES = {
  PRIVACY_REQUIRED: 'Necesitas leer el aviso de privacidad para continuar.',
  NAME_REQUIRED: 'El cupo necesita un nombre.',
  WHATSAPP_REQUIRED: 'El cupo necesita un WhatsApp (mínimo 10 dígitos).',
  NOT_FOUND: 'Esa salida no está.',
  ALREADY_RODE: 'Esa salida ya se rodó. Ya no hay cupos.',
  CLOSED: 'La inscripción está cerrada.',
  FULL: 'Ese cupo ya está lleno.',
  DATE_INVALID: 'No se publica una salida sin fecha válida.',
  CAPACITY_INVALID: 'No se publica una salida sin cupo máximo (entero ≥ 1).',
  TITLE_REQUIRED: 'No se publica una salida sin título.',
  KIND_INVALID: 'La salida es rodada o actividad.',
  MEETING_REQUIRED: 'No se publica una salida sin punto de encuentro.',
  STATUS_INVALID: 'Solo se marca cerrado o realizado.',
  ALREADY_DONE: 'Ya se marcó realizada. No se reabre desde aquí.',
} as const
