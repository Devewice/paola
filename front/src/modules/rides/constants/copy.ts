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
  done: 'Esta ya se rodó. Las fotos salen en Memorias apenas las suba.',
  past: 'Esta fecha ya pasó.',
  outingThread: 'Chat de esta salida',
} as const

export const RIDES_SIGNUP_COPY = {
  kicker: 'Inscríbete a la rodada',
  paidNotice: 'Esta rodada tiene costo. Te inscribes aquí y el pago lo cuadramos por WhatsApp.',
  guestLead: 'Para rodar con nosotros necesitas cuenta: así guardo tu cupo, te paso las encuestas de la salida y ves quién va.',
  guestCta: 'Entrar e inscribirme',
  asAlias: 'Te inscribes como',
  firstTimeLead: 'Es tu primera rodada: déjame tu WhatsApp para confirmarte el cupo. Queda guardado en tu cuenta.',
  whatsappLabel: 'WhatsApp',
  whatsappPlaceholder: '312 000 0000',
  motoLabel: 'Moto (opcional)',
  motoPlaceholder: 'Si vas en moto',
  submit: 'Inscribirme',
  sending: 'Inscribiendo…',
  insideTitle: 'Ya estás dentro',
  insideCopy: 'Tu cupo quedó a tu nombre. Escríbeme para confirmarlo y te paso los detalles.',
  insideWhatsapp: 'Confirmar por WhatsApp',
  insideMail: 'Confirmar por correo',
  loading: 'Revisando tu cupo…',
  loadFail: 'No pudimos revisar tu cupo. Recarga la página.',
  noticeBody: (title: string, date: string, alias: string) =>
    `Hola, ya me inscribí a ${title} (${date}) desde la web. Soy ${alias}.`,
} as const

export const RIDES_CARD_COPY = {
  signupCta: 'Inscribirme',
  detailCta: 'Ver la rodada',
  pollsOne: 'encuesta para inscritos',
  pollsMany: 'encuestas para inscritos',
} as const

export const RIDES_PAGE_COPY = {
  back: '← Todas las rodadas',
  notFoundTitle: 'Esa rodada no está',
  notFoundCopy: 'Puede que ya se haya rodado o que el enlace esté viejo.',
  pollsTitle: 'Decide con el parche',
  pollsLead: 'Las ves todos; votan quienes están inscritos.',
  pollsEmpty: 'Esta salida aún no tiene encuestas.',
  crewTitle: 'Quiénes van',
  crewLockedTitle: 'Inscríbete y ves quién va',
  crewLockedSteps: [
    'Te inscribes con tu cuenta.',
    'Votas las encuestas de la salida.',
    'Ves quién rueda contigo y entras al chat.',
  ],
  crewEmpty: 'Vas de primero. Comparte la rodada con tu parche.',
  crewChat: 'Abrir el chat en mi cuenta',
  crewNoMoto: 'Moto por confirmar',
} as const

export const RIDES_MEMORIES_COPY = {
  heading: 'Memorias',
  aria: 'Memorias',
  statKm: 'Km del parche',
  statPhotos: 'Fotos',
  statRides: 'Rodadas',
  instagram: 'Instagram de la salida',
  commentsHeading: 'Comentarios',
  commentsRules: 'Con respeto. Nada de datos personales de otros ni fotos de menores. Revisamos antes de publicar.',
  commentsEmpty: 'Aún no hay comentarios publicados.',
  commentLabel: 'Comentar',
  commentSend: 'Enviar',
  commentLogin: 'Entrar',
  commentNeedAccount: 'Entra a tu cuenta para comentar. WhatsApp sigue abierto.',
  commentFail: 'No se pudo enviar el comentario. Intenta de nuevo.',
  commentSent: 'Comentario enviado. Sale publicado apenas lo revisemos.',
  commentAuthorFallback: 'parcero',
  emptyTitle: 'Sin recuento aún',
  archiveHeading: 'Salidas anteriores',
  archiveCta: 'Ver memoria',
  bandTitle: 'Kilómetros juntos',
  emptyKicker: 'Cámara Incauta',
  emptySteps: [
    'Rodamos juntos una salida.',
    'Tomo fotos en ruta y en las paradas.',
    'Sale aquí el recuento con km, fotos y quién rodó.',
  ],
  emptyCta: 'Ver próximas rodadas',
  railKicker: 'Esta salida',
  railKm: 'Km',
  railPhotos: 'Fotos',
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
  CUPO_PARSE_FAIL: 'No pudimos leer el cupo. Recarga la página e intenta de nuevo.',
  SALIDA_PARSE_FAIL: 'No pudimos leer la salida. Recarga la página.',
  MEMORIA_PARSE_FAIL: 'No pudimos leer la memoria. Recarga la página.',
  BOARD_PARSE_FAIL: 'No pudimos leer la lista de cupos. Recarga la página.',
  CREW_PARSE_FAIL: 'No pudimos revisar tu cupo. Recarga la página.',
} as const
