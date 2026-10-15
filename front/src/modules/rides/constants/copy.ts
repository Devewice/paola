export const AGENDA_EMPTY_COPY = 'Aún no hay fecha.'

export const MEMORIES_EMPTY_COPY = 'Aún no hay memoria de rodada.'

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
  heading: 'Próximas',
  aria: 'Próximas salidas',
  emptyTitle: 'Sin fecha',
  full: 'El cupo está lleno.',
  closed: 'Ya se cerró la inscripción.',
  done: 'Esta ya se rodó. La memoria llega cuando la publiquemos.',
  past: 'Esta fecha ya pasó.',
  outingThread: 'Chat de esta salida',
} as const

export const RIDES_CLAIM_COPY = {
  kicker: 'Anotarse a la rodada',
  paidNotice: 'Es de pago. El cupo queda anotado; el cobro se habla por WhatsApp.',
  nameLabel: 'Nombre',
  namePlaceholder: 'Tu nombre',
  whatsappLabel: 'WhatsApp',
  whatsappPlaceholder: '312 000 0000',
  motoLabel: 'Moto (opcional)',
  motoPlaceholder: 'Si vas en moto',
  submit: 'Anotarse a la rodada',
  doneTitle: 'Cupo a tu nombre',
  doneCopy: 'El cupo quedó a tu nombre. Escríbeme por WhatsApp o correo para confirmarlo.',
  doneWhatsapp: 'Avisar por WhatsApp',
  doneMail: 'Avisar por correo',
} as const

export const RIDES_MEMORIES_COPY = {
  heading: 'Memorias',
  aria: 'Memorias',
  statKm: 'Km del parche',
  statPhotos: 'Fotos',
  statRides: 'Rodadas',
  instagram: 'Instagram de la salida',
  commentsHeading: 'Comentarios',
  commentsRules: 'Respeto, no doxxing, no menores. Moderamos. No es un chat ni un tribunal.',
  commentsEmpty: 'Aún no hay comentarios publicados.',
  commentLabel: 'Comentar',
  commentSend: 'Enviar',
  commentLogin: 'Entrar',
  commentNeedAccount: 'Entra a tu cuenta para comentar. WhatsApp sigue abierto.',
  commentFail: 'No se pudo enviar. Moderamos los comentarios.',
  commentSent: 'Enviado. Si entra a revisión, lo ves cuando lo publiquemos.',
  commentAuthorFallback: 'parcero',
  emptyTitle: 'Sin recuento aún',
} as const

export const RIDES_ADMIN_COPY = {
  boardTitle: 'Salidas publicadas',
  boardLead: 'Cupos, inscritos y estado. Al terminar una rodada, márcala realizada para poder subir su memoria.',
  boardEmpty: 'Aún no hay salidas publicadas.',
  boardLoadFail: 'No se pudo cargar el tablero de salidas.',
  spots: 'cupos',
  tickets: 'Inscritos',
  noTickets: 'Nadie anotado todavía.',
  showTickets: 'Ver inscritos',
  hideTickets: 'Ocultar inscritos',
  markClosed: 'Cerrar inscripción',
  markDone: 'Marcar realizada',
  statusOk: 'Estado actualizado.',
  statusFail: 'No se pudo cambiar el estado.',
  pastOpen: 'Ya pasó y sigue abierta',
  outingTitle: 'Nueva salida',
  outingLead: 'Fecha, punto de encuentro y cupo. Sale de una vez en Parchese.',
  fieldTitle: 'Título',
  fieldDate: 'Fecha',
  fieldKind: 'Tipo',
  kindRodada: 'Rodada',
  kindActividad: 'Actividad',
  fieldMeeting: 'Punto de encuentro',
  fieldRoute: 'Ruta',
  fieldBring: 'Qué llevar',
  fieldCapacity: 'Cupo máximo',
  fieldPaid: 'Es de pago (el cobro se habla por WhatsApp)',
  outingCta: 'Publicar salida',
  outingOk: 'Salida publicada.',
  outingFail: 'No se pudo publicar la salida.',
  memoryTitle: 'Nueva memoria',
  memoryLead: 'Solo para salidas realizadas. Una foto por línea: enlace | texto alterno.',
  memoryNoOutings: 'Marca una salida como realizada para subir su memoria.',
  fieldOuting: 'Salida realizada',
  fieldKm: 'Kilómetros',
  fieldClosing: 'Cierre (relato corto)',
  fieldCredit: 'Fotos por',
  fieldParticipants: 'Quiénes salieron (con permiso)',
  fieldInstagram: 'Instagram de la salida (opcional)',
  fieldPhotos: 'Fotos',
  photosPlaceholder: 'https://… | Parche en el mirador',
  memoryCta: 'Publicar memoria',
  memoryOk: 'Memoria publicada.',
  memoryFail: 'No se pudo publicar la memoria.',
  statusLabels: {
    abierto: 'Abierta',
    lleno: 'Llena',
    cerrado: 'Cerrada',
    realizado: 'Realizada',
  },
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
  ALREADY_DONE: 'Ya se marcó realizada. No se reabre desde aquí.',
  CUPO_PARSE_FAIL: 'La API devolvió un cupo que no se entiende.',
  SALIDA_PARSE_FAIL: 'La API devolvió una salida que no se entiende.',
  MEMORIA_PARSE_FAIL: 'La API devolvió una memoria que no se entiende.',
  BOARD_PARSE_FAIL: 'La lista de cupos no se entiende.',
} as const
