export const POLL_TABLES = {
  POLLS: 'polls',
  QUESTIONS: 'poll_questions',
  OPTIONS: 'poll_options',
  ROWS: 'poll_rows',
  RESPONSES: 'poll_responses',
  ANSWERS: 'poll_answers',
  VIEWS: 'poll_views',
  SESSIONS: 'sessions',
  USERS: 'users',
} as const

export const POLL_ROUTES = {
  LIST: '/api/polls',
  DETAIL: '/api/polls/:id',
  VOTE: '/api/polls/:id/votes',
  VIEWS: '/api/polls/views',
  OPERAR_LIST: '/api/operar/polls',
  OPERAR_CREATE: '/api/operar/polls',
  OPERAR_UPDATE: '/api/operar/polls/:id',
  OPERAR_EDIT: '/api/operar/polls/:id/edit',
  OPERAR_DELETE: '/api/operar/polls/:id/delete',
  OPERAR_INSIGHTS: '/api/operar/polls/:id/insights',
  OPERAR_RESPONSE_DELETE: '/api/operar/polls/:id/responses/:responseId/delete',
  OPERAR_RESPONSES_CLEAR: '/api/operar/polls/:id/responses/clear',
  OPERAR_EXPORT: '/api/operar/polls/:id/export',
} as const

/** `impression`: la encuesta salió en pantalla (listas, Inicio, rodada); `visit`: abrieron su página. */
export const POLL_VIEW_KINDS = ['impression', 'visit'] as const

export const POLL_INSIGHTS = {
  /** No se cuenta otra vista igual del mismo visitante antes de este tiempo. */
  VIEW_COOLDOWN_MIN: 30,
  /** Encuestas por lote de impresiones. */
  VIEW_BATCH_MAX: 20,
  SERIES_DAYS: 30,
  VISITORS_MAX: 500,
  RESPONSES_MAX: 500,
  ANSWER_PREVIEW_MAX: 400,
} as const

export const POLL_QUERY = {
  OUTING: 'outingId',
  FEATURED: 'featured',
} as const

export const POLL_KINDS = ['single', 'multiple', 'ranking', 'scale', 'text', 'grid'] as const
export const POLL_CONDITION_MODES = ['any', 'none'] as const
/** Cómo se pinta la pregunta; `auto` decide según el tipo y lo largo de las opciones. */
export const POLL_DISPLAYS = ['auto', 'chips', 'cards', 'gate', 'deck', 'table'] as const
/** Estilo de las escalas y cuadrículas. */
export const POLL_TONES = ['plain', 'track', 'faces'] as const
export const POLL_STATUSES = ['draft', 'open', 'closed'] as const
export const POLL_AUDIENCES = ['public', 'account'] as const

export const POLL_LIMITS = {
  TITLE_MIN: 3,
  TITLE_MAX: 200,
  PROMPT_MIN: 2,
  PROMPT_MAX: 300,
  QUESTIONS_MAX: 40,
  OPTIONS_MIN: 2,
  OPTIONS_MAX: 20,
  OPTION_MAX: 200,
  ROWS_MIN: 1,
  ROWS_MAX: 12,
  SECTION_MAX: 160,
  CODE_MAX: 16,
  SCALE_MIN: 0,
  SCALE_MAX: 10,
  TEXT_MAX: 1000,
  VOTER_KEY_MIN: 16,
  VOTER_KEY_MAX: 80,
  OPERATOR_TEXTS: 200,
} as const

export const POLL_VOTER_PREFIX = {
  ACCOUNT: 'u:',
  ANON: 'a:',
} as const

export const POLL_MESSAGES = {
  NOT_FOUND: 'Esa encuesta no existe.',
  NOT_OPEN: 'Esta encuesta ya no recibe votos.',
  ACCOUNT_REQUIRED: 'Para votar en esta encuesta necesitas entrar a tu cuenta.',
  RIDERS_ONLY: 'Esta encuesta la votan quienes están inscritos a la rodada.',
  VOTER_REQUIRED: 'No pudimos identificar tu voto. Recarga la página e intenta de nuevo.',
  ALREADY_VOTED: 'Ya votaste en esta encuesta.',
  TITLE_REQUIRED: 'La encuesta necesita un título.',
  QUESTIONS_REQUIRED: 'La encuesta necesita al menos una pregunta.',
  QUESTIONS_TOO_MANY: 'Máximo 40 preguntas por encuesta.',
  PROMPT_REQUIRED: 'Cada pregunta necesita un enunciado.',
  KIND_INVALID: 'Tipo de pregunta no válido.',
  OPTIONS_REQUIRED: 'Las preguntas de opciones necesitan entre 2 y 20 opciones.',
  ROWS_REQUIRED: 'La cuadrícula necesita entre 1 y 12 filas.',
  OTHER_ONCE: 'Solo puede haber una opción «Otro» por pregunta.',
  OTHER_TEXT_REQUIRED: 'Escribe cuál es tu opción en «Otro».',
  EXCLUSIVE_MIXED: 'Esa opción no se puede combinar con otras.',
  CONDITION_INVALID: 'La condición debe apuntar a una pregunta de opciones anterior.',
  SCALE_INVALID: 'La escala va de 0 a 10 y el mínimo debe ser menor que el máximo.',
  AUDIENCE_INVALID: 'Elige si se vota con o sin cuenta.',
  STATUS_INVALID: 'Estado no válido.',
  OUTING_INVALID: 'Esa rodada no existe.',
  DATE_INVALID: 'La fecha de cierre no es válida.',
  ANSWER_REQUIRED: 'Responde las preguntas obligatorias.',
  ANSWER_INVALID: 'Alguna respuesta no es válida. Revisa e intenta de nuevo.',
  TOO_MANY_CHOICES: 'Elegiste más opciones de las permitidas.',
  VIEW_INVALID: 'Vista no válida.',
  RESPONSE_NOT_FOUND: 'Esa respuesta no existe.',
} as const

/** Descarga en Excel desde el panel. */
export const POLL_EXPORT = {
  RESPONSES_MAX: 20000,
  TIME_ZONE: 'America/Bogota',
  /** `sv-SE` da `2026-10-27 08:15`, que Excel ordena bien. */
  DATE_LOCALE: 'sv-SE',
  FILE_PREFIX: 'encuesta',
  SHEET_RESPONSES: 'Respuestas',
  SHEET_SUMMARY: 'Resumen',
  COL_DATE: 'Fecha',
  COL_VOTER: 'Quién',
  COL_ACCOUNT: 'Con cuenta',
  ANONYMOUS: 'Anónimo',
  YES: 'Sí',
  NO: 'No',
  GRID_COLUMN: ' — ',
  SUMMARY_HEADERS: ['Pregunta', 'Opción', 'Votos', '%', 'Puesto promedio'],
  TOTAL: 'Respuestas totales',
  AVERAGE: 'Promedio',
  WRITTEN: 'Respuestas escritas',
  DATE_WIDTH: 18,
  VOTER_WIDTH: 24,
  ACCOUNT_WIDTH: 11,
  ANSWER_WIDTH: 32,
  SUMMARY_WIDTHS: [48, 36, 10, 8, 16],
} as const

/** Cómo se describe cada respuesta en el panel. */
export const POLL_ANSWER_TEXT = {
  OTHER: 'Otro',
  SEPARATOR: ', ',
  RANK_SEPARATOR: ' › ',
  GRID_PAIR: ': ',
  GRID_SEPARATOR: ' · ',
} as const
