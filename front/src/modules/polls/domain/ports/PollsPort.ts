import type { AppError } from '@core/errors/AppError.ts'
import type { Result } from '@core/result.ts'
import type {
  AnswerPayload,
  Poll,
  PollAudience,
  PollKind,
  PollResults,
  PollStatus,
} from '@modules/polls/domain/entities/Poll.ts'

export type PollFilter = {
  readonly outingId?: string
  readonly featured?: boolean
}

export type OptionDraft = {
  readonly label: string
  readonly imageSrc?: string
}

export type QuestionDraft = {
  readonly kind: PollKind
  readonly prompt: string
  readonly help?: string
  readonly required: boolean
  readonly maxChoices?: number
  readonly scaleMin?: number
  readonly scaleMax?: number
  readonly scaleMinLabel?: string
  readonly scaleMaxLabel?: string
  readonly options: readonly OptionDraft[]
}

export type PollDraft = {
  readonly title: string
  readonly description?: string
  readonly audience: PollAudience
  readonly status: PollStatus
  readonly featured: boolean
  readonly outingId?: string
  readonly closesAt?: string
  readonly questions: readonly QuestionDraft[]
}

export type PollPatch = {
  readonly status?: PollStatus
  readonly featured?: boolean
  readonly closesAt?: string | null
}

export type OperatorPoll = Omit<Poll, 'isOpen' | 'hasVoted' | 'ridersOnly' | 'isInscribed' | 'results'> & {
  readonly results: PollResults
}

export interface PollsPort {
  list(filter?: PollFilter): Promise<Result<readonly Poll[], AppError>>
  /** `null` si no existe o no está publicada. */
  get(pollId: string): Promise<Result<Poll | null, AppError>>
  vote(pollId: string, answers: readonly AnswerPayload[]): Promise<Result<Poll, AppError>>
}

export interface PollsAdminPort {
  list(clave: string): Promise<Result<readonly OperatorPoll[], AppError>>
  create(draft: PollDraft, clave: string): Promise<Result<string, AppError>>
  update(id: string, patch: PollPatch, clave: string): Promise<Result<true, AppError>>
  remove(id: string, clave: string): Promise<Result<true, AppError>>
}

/** Sesión y llave anónima del navegador; la app decide de dónde salen. */
export interface VoterIdentityPort {
  sessionId(): string
  anonKey(): string
}
