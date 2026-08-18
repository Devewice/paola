export const AGENDA_EMPTY_COPY =
  'Ahora mismo no hay fecha. El parche vive en WhatsApp: escríbele a Paola y te avisa la próxima.'

export const MEMORIES_EMPTY_COPY =
  'Vamos contando. Aún no hay kilómetros publicados de una memoria realizada.'

export const RIDES_ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export const RIDES_LIMITS = {
  NAME_MIN: 2,
  WHATSAPP_MIN: 10,
  WHATSAPP_MAX: 15,
  CAPACITY_MIN: 1,
} as const

export const RIDES_STATUS = {
  ABIERTO: 'abierto',
  LLENO: 'lleno',
  CERRADO: 'cerrado',
  REALIZADO: 'realizado',
} as const

export const RIDES_KIND = {
  RODADA: 'rodada',
  ACTIVIDAD: 'actividad',
} as const

export const RIDES_AGENDA_COPY = {
  heading: 'Agenda',
  aria: 'Agenda',
  emptyTitle: 'Sin fecha',
  full: 'Cupo lleno. Ya no se anota más gente.',
  closed: 'Inscripción cerrada.',
  done: 'Ya se rodó. Esta salida pasa a memorias cuando haya recuento.',
} as const

export const RIDES_MESSAGES = {
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
  ALREADY_DONE: 'Ya se marcó realizada. No se reabre desde aquí.',
  CUPO_PARSE_FAIL: 'La API devolvió un cupo que no se entiende.',
  SALIDA_PARSE_FAIL: 'La API devolvió una salida que no se entiende.',
  MEMORIA_PARSE_FAIL: 'La API devolvió una memoria que no se entiende.',
  BOARD_PARSE_FAIL: 'La lista de cupos no se entiende.',
} as const
