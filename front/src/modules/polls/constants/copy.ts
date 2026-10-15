import type { PollAudience, PollDisplay, PollKind, PollStatus, PollTone } from '@modules/polls/domain/entities/Poll.ts'
import { MASCOT } from '@shared/ui/mascot.ts'

export const POLLS_HOME_FIGURE = MASCOT.X5

export const POLLS_VOTER_STORAGE_KEY = 'paola_voter_key'
export const POLLS_DRAFT_STORAGE_PREFIX = 'paola_poll_draft_'
/** Hasta este número de preguntas se responde dentro de la tarjeta; más largas abren su vista. */
export const POLLS_INLINE_MAX = 3
/** Segundos estimados por pregunta para el «te toma N min». */
export const POLLS_SECONDS_PER_QUESTION = 20
/** Pausa antes de pasar sola a la siguiente pantalla tras elegir. */
export const POLLS_AUTO_ADVANCE_MS = 380

/** Escena inmersiva del recorrido: fotos de fondo por sección y poses de la cámara. */
export const POLLS_STAGE = {
  photos: ['/kit-assets/Rodada anapoimap.png', '/kit-assets/Primera rodada.webp'],
  poses: [MASCOT.EN_PIE, MASCOT.X5, MASCOT.TUMBADA],
  /** Segundos que se sostiene el título de sección antes de pasar solo. */
  sectionHold: 1.25,
} as const

/** Lo que dice la cámara según el avance (0 a 1). */
export const POLLS_COMPANION_LINES: readonly { readonly from: number; readonly text: string }[] = [
  { from: 0, text: 'Arranquemos. Yo voy grabando.' },
  { from: 0.2, text: 'Buen ritmo, sigue así.' },
  { from: 0.45, text: 'Ya vas por la mitad del camino.' },
  { from: 0.7, text: 'Recta final, no aflojes.' },
  { from: 0.9, text: 'Un par más y llegamos.' },
]

export const POLLS_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  hour: 'numeric',
  minute: '2-digit',
}
export const POLLS_LOCALE = 'es-CO'

export const POLLS_COPY = {
  kicker: 'Encuesta',
  sectionHeading: 'Encuestas',
  sectionLead: 'Tu opinión decide rutas, fechas y lo que sigue en el parche. Votas una vez y ves cómo va.',
  sectionEmptyTitle: 'Sin encuestas por ahora',
  sectionEmpty: 'Cuando haya algo para decidir entre todos, sale aquí.',
  openHeading: 'Abiertas',
  closedHeading: 'Cerradas',
  rideHeading: 'Decide con el parche',
  homeKicker: 'Tú decides',
  homeCta: 'Ver todas las encuestas',
  homeSteps: ['Eliges tu respuesta.', 'Votas una sola vez.', 'Ves cómo va al instante.'],
  voteCta: 'Enviar mi voto',
  sending: 'Enviando…',
  voted: 'Gracias, tu voto quedó.',
  voteFail: 'No se pudo enviar el voto. Intenta de nuevo.',
  loadFail: 'No pudimos cargar las encuestas.',
  missing: 'Te falta responder:',
  required: 'Obligatoria',
  optional: 'Opcional',
  accountRequired: 'Esta encuesta es solo para quienes tienen cuenta.',
  accountCta: 'Entrar para votar',
  ridersOnly: 'Esta encuesta la votan quienes están inscritos a la rodada.',
  ridersCta: 'Inscribirme a la rodada',
  anonymousNote: 'Votas sin cuenta. Un voto por persona.',
  accountNote: 'Votas con tu cuenta. Un voto por persona.',
  alreadyVoted: 'Ya votaste. Así va:',
  closedNote: 'Encuesta cerrada. Resultado final:',
  closesOn: 'Cierra el',
  closedOn: 'Cerró el',
  linkedRide: 'Rodada:',
  responsesOne: '1 voto',
  responsesMany: 'votos',
  answeredOne: '1 respuesta',
  answeredMany: 'respuestas',
  pickOne: 'Elige una opción.',
  pickMany: 'Elige las que quieras.',
  pickUpTo: 'Elige hasta',
  pickUpToSuffix: 'opciones.',
  rankHint: 'Arrastra o usa las flechas para ordenar. Arriba va tu favorita.',
  moveUp: 'Subir',
  moveDown: 'Bajar',
  scaleHint: 'Toca un número.',
  gridHint: 'Elige una opción por fila.',
  textPlaceholder: 'Escribe tu respuesta',
  averageLabel: 'Promedio',
  firstPlaceOne: '1 la puso de primera',
  firstPlaceMany: 'la pusieron de primera',
  averageRankLabel: 'Posición promedio',
  textResultsNote: 'Las respuestas escritas solo las lee el equipo.',
  noVotes: 'Aún no hay votos.',
  counterOf: 'de',
  counterChosen: 'elegidas',
  limitReached: 'Llegaste al máximo. Quita una para cambiarla.',
  deckProgress: 'Afirmaciones',
  stepStart: 'Empezar',
  stepNext: 'Siguiente',
  stepBack: 'Atrás',
  stepSkip: 'Saltar',
  stepContinue: 'Seguir',
  stepOf: 'de',
  stepSection: 'Sección',
  stepRequired: 'Responde para seguir.',
  stepKeys: 'Usa los números para elegir y Enter para seguir.',
  stepMinutes: 'min aprox.',
  stepQuestions: 'preguntas',
  stepSubmitTitle: 'Eso es todo',
  stepSubmitLead: 'Revisa lo que quieras con «Atrás» y envía cuando estés listo.',
  stepAnswered: 'respondidas',
  stepGateEnd: 'Gracias por pasar. Envía para terminar.',
  stepDraftSaved: 'Tus respuestas se guardan en este navegador hasta que envíes.',
  longCta: 'Responder encuesta',
  stageSkip: 'Toca para seguir',
  stageSubmitLine: 'Última foto. Envía y queda guardado.',
  stageIntroLine: 'Te acompaño en todo el recorrido.',
  otherPlaceholder: '¿Cuál?',
  otherMissing: 'Escribe cuál en «Otro».',
  gridRowHeader: 'Pregunta',
  pageBack: 'Todas las encuestas',
  pageNotFoundTitle: 'Esa encuesta no está',
  pageNotFoundCopy: 'Puede que la hayan quitado o que el enlace esté mal.',
} as const

export const POLLS_ADMIN_COPY = {
  listTitle: 'Encuestas publicadas',
  listLead: 'Abre, cierra o destaca en Inicio. Los resultados se actualizan con cada voto.',
  listEmpty: 'Aún no hay encuestas.',
  loadFail: 'No se pudieron cargar las encuestas.',
  formTitle: 'Nueva encuesta',
  formLead: 'Arma las preguntas, elige quién vota y si va atada a una rodada.',
  fieldTitle: 'Título',
  fieldDescription: 'Descripción (opcional)',
  fieldAudience: 'Quién puede votar',
  fieldStatus: 'Estado al guardar',
  fieldOuting: 'Atada a una rodada (opcional)',
  outingNone: 'Ninguna',
  fieldClosesAt: 'Cierra el (opcional)',
  fieldFeatured: 'Destacar en Inicio',
  questionsTitle: 'Preguntas',
  addQuestion: 'Agregar pregunta',
  removeQuestion: 'Quitar pregunta',
  moveUp: 'Subir',
  moveDown: 'Bajar',
  fieldKind: 'Tipo',
  fieldPrompt: 'Pregunta',
  fieldHelp: 'Ayuda (opcional)',
  fieldRequired: 'Obligatoria',
  fieldMaxChoices: 'Máximo de opciones (vacío = sin límite)',
  fieldScaleMin: 'Desde',
  fieldScaleMax: 'Hasta',
  fieldScaleMinLabel: 'Texto del mínimo',
  fieldScaleMaxLabel: 'Texto del máximo',
  optionsTitle: 'Opciones',
  optionLabel: 'Opción',
  optionImage: 'Imagen (enlace, opcional)',
  addOption: 'Agregar opción',
  removeOption: 'Quitar',
  createCta: 'Guardar encuesta',
  createOk: 'Encuesta guardada.',
  createFail: 'No se pudo guardar la encuesta.',
  updateOk: 'Encuesta actualizada.',
  updateFail: 'No se pudo actualizar la encuesta.',
  deleteCta: 'Borrar',
  deleteConfirm: 'Toca otra vez para borrar',
  deleteOk: 'Encuesta borrada.',
  deleteFail: 'No se pudo borrar la encuesta.',
  openCta: 'Abrir',
  closeCta: 'Cerrar',
  featureCta: 'Destacar en Inicio',
  unfeatureCta: 'Quitar de Inicio',
  featuredChip: 'En Inicio',
  showResults: 'Ver resultados',
  hideResults: 'Ocultar resultados',
  textAnswers: 'Respuestas escritas',
  noTexts: 'Nadie ha escrito todavía.',
  otherAnswers: 'Escribieron en «Otro»:',
  fieldSection: 'Arranca sección (opcional)',
  rowsTitle: 'Filas',
  rowLabel: 'Fila',
  addRow: 'Agregar fila',
  columnsTitle: 'Columnas',
  optionOther: 'Es «Otro» (pide escribir cuál)',
  optionExclusive: 'Exclusiva (desmarca las demás)',
  conditionTitle: 'Mostrar solo si…',
  conditionQuestion: 'Depende de la pregunta',
  conditionAlways: 'Siempre visible',
  conditionMode: 'Cuando',
  conditionAny: 'eligieron alguna de',
  conditionNone: 'no eligieron ninguna de',
  fieldCode: 'Número visible (opcional)',
  fieldDisplay: 'Cómo se muestra',
  fieldTone: 'Estilo de la escala',
  rowCode: 'Número',
} as const

export const POLL_DISPLAY_LABELS: Readonly<Record<PollDisplay, string>> = {
  auto: 'Automático',
  chips: 'Fichas',
  cards: 'Tarjetas',
  gate: 'Portada (filtro)',
  deck: 'Baraja (una fila por vez)',
  table: 'Tabla',
}

export const POLL_TONE_LABELS: Readonly<Record<PollTone, string>> = {
  plain: 'Sencillo',
  track: 'Riel de color',
  faces: 'Caritas',
}

export const POLL_KIND_LABELS: Readonly<Record<PollKind, string>> = {
  single: 'Una opción',
  multiple: 'Varias opciones',
  ranking: 'Ordenar',
  scale: 'Escala',
  text: 'Texto libre',
  grid: 'Cuadrícula',
}

export const POLL_STATUS_LABELS: Readonly<Record<PollStatus, string>> = {
  draft: 'Borrador',
  open: 'Abierta',
  closed: 'Cerrada',
}

export const POLL_AUDIENCE_LABELS: Readonly<Record<PollAudience, string>> = {
  public: 'Cualquiera, sin cuenta',
  account: 'Solo con cuenta',
}

export const POLLS_LIMITS = {
  OPTIONS_MIN: 2,
  OPTIONS_MAX: 20,
  ROWS_MIN: 1,
  ROWS_MAX: 12,
  QUESTIONS_MAX: 40,
  SCALE_MIN: 0,
  SCALE_MAX: 10,
  TEXT_MAX: 1000,
} as const

export const POLLS_EDITOR_MESSAGES = {
  question: 'pregunta',
  titleRequired: 'Ponle un título a la encuesta.',
  questionsRequired: 'Agrega al menos una pregunta.',
  questionsTooMany: `Máximo ${POLLS_LIMITS.QUESTIONS_MAX} preguntas.`,
  promptRequired: 'Escribe la pregunta',
  optionsRequired: `Necesita al menos ${POLLS_LIMITS.OPTIONS_MIN} opciones con texto`,
  optionsTooMany: `Máximo ${POLLS_LIMITS.OPTIONS_MAX} opciones`,
  maxInvalid: 'El máximo de opciones no cuadra con las opciones que hay',
  scaleInvalid: `La escala va de ${POLLS_LIMITS.SCALE_MIN} a ${POLLS_LIMITS.SCALE_MAX} y el inicio debe ser menor que el final`,
  dateInvalid: 'La fecha de cierre no es válida.',
  rowsRequired: `La cuadrícula necesita entre ${POLLS_LIMITS.ROWS_MIN} y ${POLLS_LIMITS.ROWS_MAX} filas con texto`,
  otherOnce: 'Solo puede haber una opción «Otro»',
  conditionInvalid: 'La condición debe apuntar a una pregunta anterior de una o varias opciones',
  conditionOptions: 'Marca al menos una opción para la condición',
} as const
