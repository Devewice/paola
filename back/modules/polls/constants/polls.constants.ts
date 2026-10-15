export const POLL_TABLES = {
  POLLS: 'polls',
  QUESTIONS: 'poll_questions',
  OPTIONS: 'poll_options',
  RESPONSES: 'poll_responses',
  ANSWERS: 'poll_answers',
  SESSIONS: 'sessions',
} as const

export const POLL_ROUTES = {
  LIST: '/api/polls',
  DETAIL: '/api/polls/:id',
  VOTE: '/api/polls/:id/votes',
  OPERAR_LIST: '/api/operar/polls',
  OPERAR_CREATE: '/api/operar/polls',
  OPERAR_UPDATE: '/api/operar/polls/:id',
  OPERAR_DELETE: '/api/operar/polls/:id/delete',
} as const

export const POLL_QUERY = {
  OUTING: 'outingId',
  FEATURED: 'featured',
} as const

export const POLL_KINDS = ['single', 'multiple', 'ranking', 'scale', 'text'] as const
export const POLL_STATUSES = ['draft', 'open', 'closed'] as const
export const POLL_AUDIENCES = ['public', 'account'] as const

export const POLL_LIMITS = {
  TITLE_MIN: 3,
  TITLE_MAX: 200,
  PROMPT_MIN: 2,
  PROMPT_MAX: 300,
  QUESTIONS_MAX: 20,
  OPTIONS_MIN: 2,
  OPTIONS_MAX: 12,
  OPTION_MAX: 200,
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
  QUESTIONS_TOO_MANY: 'Máximo 20 preguntas por encuesta.',
  PROMPT_REQUIRED: 'Cada pregunta necesita un enunciado.',
  KIND_INVALID: 'Tipo de pregunta no válido.',
  OPTIONS_REQUIRED: 'Las preguntas de opciones necesitan entre 2 y 12 opciones.',
  SCALE_INVALID: 'La escala va de 0 a 10 y el mínimo debe ser menor que el máximo.',
  AUDIENCE_INVALID: 'Elige si se vota con o sin cuenta.',
  STATUS_INVALID: 'Estado no válido.',
  OUTING_INVALID: 'Esa rodada no existe.',
  DATE_INVALID: 'La fecha de cierre no es válida.',
  ANSWER_REQUIRED: 'Responde las preguntas obligatorias.',
  ANSWER_INVALID: 'Alguna respuesta no es válida. Revisa e intenta de nuevo.',
  TOO_MANY_CHOICES: 'Elegiste más opciones de las permitidas.',
} as const
