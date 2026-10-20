import type { OutingKind, OutingStatus } from '../interfaces/rides.interface.js'

export const RIDES_KINDS: readonly OutingKind[] = ['rodada', 'actividad', 'tintada']
export const RIDES_STATUSES: readonly OutingStatus[] = ['abierto', 'lleno', 'cerrado', 'realizado']
export const RIDES_OPERATOR_STATUSES = ['abierto', 'cerrado', 'realizado'] as const

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
  PASSENGER_MIN: 2,
  PASSENGER_MAX: 80,
  EMERGENCY_NAME_MIN: 2,
  EMERGENCY_NAME_MAX: 80,
  EMERGENCY_PHONE_MIN: 7,
  EMERGENCY_PHONE_MAX: 15,
  /** Días antes de la salida en que se abre el "¿Sigues firme?". */
  CONFIRM_WINDOW_DAYS: 2,
} as const

export const RIDES_LEVELS = ['primera', 'rodado', 'veterano'] as const
export type RideLevel = (typeof RIDES_LEVELS)[number]
export const RIDES_LEVEL_SET = new Set<string>(RIDES_LEVELS)

export const RIDES_CONFIRM_PENDING = 'pendiente'
export const RIDES_CONFIRM_FIRM = 'firme'
export type RideConfirmation = typeof RIDES_CONFIRM_PENDING | typeof RIDES_CONFIRM_FIRM

export const RIDES_TIMEZONE = 'America/Bogota'

export const RIDES_TABLES = {
  OUTINGS: 'outings',
  TICKETS: 'tickets',
  OUTING_ROUTES: 'outing_routes',
  USERS: 'users',
  MOTORCYCLES: 'user_motorcycles',
  MEMORIES: 'memories',
} as const

export const RIDES_MOTO_LABEL_MAX = 120

export const WHATSAPP_NON_DIGIT = /\D/g

export const RIDES_ROUTES = {
  LIST: '/api/outings',
  CLAIM: '/api/outings/:id/tickets',
  CREW: '/api/outings/:id/crew',
  CONFIRM: '/api/outings/:id/confirm',
  RELEASE: '/api/outings/:id/release',
  OPERATE_LIST: '/api/operar/outings',
  OPERATE_CREATE: '/api/operar/outings',
  OPERATE_STATUS: '/api/operar/outings/:id/status',
  OPERATE_UPDATE: '/api/operar/outings/:id',
  OPERATE_DELETE: '/api/operar/outings/:id/delete',
} as const

export const RIDES_MESSAGES = {
  PRIVACY_REQUIRED: 'Necesitas leer el aviso de privacidad para continuar.',
  NAME_REQUIRED: 'El cupo necesita un nombre.',
  WHATSAPP_REQUIRED: 'El cupo necesita un WhatsApp (mínimo 10 dígitos).',
  ACCOUNT_REQUIRED: 'Para inscribirte necesitas entrar a tu cuenta.',
  ALREADY_IN: 'Ya estás inscrito en esta salida.',
  NOT_FOUND: 'Esa salida no está.',
  ALREADY_RODE: 'Esa salida ya se rodó. Ya no hay cupos.',
  CLOSED: 'La inscripción está cerrada.',
  FULL: 'Ese cupo ya está lleno.',
  DATE_INVALID: 'No se publica una salida sin fecha válida.',
  CAPACITY_INVALID: 'No se publica una salida sin cupo máximo (entero ≥ 1).',
  TITLE_REQUIRED: 'No se publica una salida sin título.',
  KIND_INVALID: 'La salida es rodada, actividad o tintada.',
  MEETING_REQUIRED: 'No se publica una salida sin punto de encuentro.',
  STATUS_INVALID: 'Solo se marca abierto, cerrado o realizado.',
  CAPACITY_BELOW_TAKEN: (taken: number) => `Ya hay ${taken} puestos tomados: el cupo no puede quedar por debajo.`,
  HAS_MEMORY: 'Esa salida ya tiene memoria. Borra primero la memoria.',
  ALREADY_DONE: 'Ya se marcó realizada. No se reabre desde aquí.',
  LEVEL_REQUIRED: 'Cuéntame tu nivel para armar la fila.',
  DOCS_REQUIRED: 'Para rodar necesitas SOAT, tecnomecánica y licencia al día.',
  RULES_REQUIRED: 'Necesitas aceptar las reglas de la rodada.',
  PASSENGER_REQUIRED: 'Escribe el nombre de tu parrillero.',
  PASSENGER_NO_ROOM: 'Solo queda un cupo: no alcanza para ti y tu parrillero.',
  EMERGENCY_REQUIRED: 'Déjame un contacto de emergencia: nombre y teléfono (7 a 15 dígitos).',
  NOT_INSCRIBED: 'No estás inscrito en esta salida.',
  CONFIRM_TOO_EARLY: 'La confirmación se abre dos días antes de la salida.',
  RIDE_OVER: 'Esa salida ya pasó.',
} as const
