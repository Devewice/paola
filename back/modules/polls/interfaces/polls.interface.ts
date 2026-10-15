import type { POLL_AUDIENCES, POLL_KINDS, POLL_STATUSES } from '../constants/polls.constants.js'

export type PollKind = (typeof POLL_KINDS)[number]
export type PollStatus = (typeof POLL_STATUSES)[number]
export type PollAudience = (typeof POLL_AUDIENCES)[number]

export interface PollOption {
  id: string
  label: string
  imageSrc?: string
}

export interface PollQuestion {
  id: string
  kind: PollKind
  prompt: string
  help?: string
  required: boolean
  maxChoices?: number
  scaleMin?: number
  scaleMax?: number
  scaleMinLabel?: string
  scaleMaxLabel?: string
  options: PollOption[]
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

export interface QuestionResult {
  questionId: string
  answered: number
  options: OptionTally[]
  average?: number
  distribution?: { value: number; count: number }[]
  texts?: string[]
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
}

export interface AnswerRow {
  questionId: string
  optionId: string | null
  rank: number | null
  valueNumber: number | null
  valueText: string | null
}

export interface Voter {
  key: string
  userId: string | null
}
