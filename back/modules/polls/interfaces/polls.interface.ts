import type { POLL_AUDIENCES, POLL_CONDITION_MODES, POLL_KINDS, POLL_STATUSES } from '../constants/polls.constants.js'

export type PollKind = (typeof POLL_KINDS)[number]
export type PollStatus = (typeof POLL_STATUSES)[number]
export type PollAudience = (typeof POLL_AUDIENCES)[number]
/** `any`: se muestra si eligieron alguna de las opciones; `none`: si no eligieron ninguna. */
export type PollConditionMode = (typeof POLL_CONDITION_MODES)[number]

export interface PollOption {
  id: string
  label: string
  imageSrc?: string
  /** Pide escribir cuál («Otro: ___»). */
  isOther?: boolean
  /** Al elegirla se desmarcan las demás («Ninguna», «No recuerdo»). */
  exclusive?: boolean
}

export interface PollRow {
  id: string
  label: string
}

export interface PollCondition {
  questionId: string
  optionIds: string[]
  mode: PollConditionMode
}

export interface PollQuestion {
  id: string
  kind: PollKind
  prompt: string
  help?: string
  /** Título de sección que arranca en esta pregunta. */
  section?: string
  required: boolean
  maxChoices?: number
  scaleMin?: number
  scaleMax?: number
  scaleMinLabel?: string
  scaleMaxLabel?: string
  /** En cuadrícula, `options` son las columnas y `rows` las filas. */
  options: PollOption[]
  rows: PollRow[]
  showIf?: PollCondition
}

export interface Poll {
  id: string
  title: string
  description?: string
  audience: PollAudience
  status: PollStatus
  featured: boolean
  outingId?: string
  outingTitle?: string
  closesAt?: string
  createdAt: string
  questions: PollQuestion[]
}

export interface OptionTally {
  optionId: string
  count: number
  percent: number
  /** Posición promedio en preguntas de ordenar (1 = primero). */
  averageRank?: number
}

export interface RowResult {
  rowId: string
  answered: number
  options: OptionTally[]
}

export interface QuestionResult {
  questionId: string
  answered: number
  options: OptionTally[]
  average?: number
  distribution?: { value: number; count: number }[]
  texts?: string[]
  /** Lo que escribieron en «Otro» (solo operadora). */
  otherTexts?: string[]
  rows?: RowResult[]
}

export interface PollResults {
  responses: number
  questions: QuestionResult[]
}

export interface AnswerInput {
  questionId: string
  optionIds?: string[]
  ranking?: string[]
  value?: number
  text?: string
  otherText?: string
  /** Cuadrícula: fila → columna elegida. */
  grid?: Record<string, string>
}

export interface AnswerRow {
  questionId: string
  optionId: string | null
  rowId: string | null
  rank: number | null
  valueNumber: number | null
  valueText: string | null
}

export interface Voter {
  key: string
  userId: string | null
}
