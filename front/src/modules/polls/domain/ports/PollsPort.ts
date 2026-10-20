import type { AppError } from '@core/errors/AppError.ts'
import type { Result } from '@core/result.ts'
import type {
  AnswerPayload,
  Ballot,
  Poll,
  PollAudience,
  PollConditionMode,
  PollDisplay,
  PollKind,
  PollTone,
  PollResults,
  PollStatus,
} from '@modules/polls/domain/entities/Poll.ts'

export type PollFilter = {
  readonly outingId?: string
  readonly featured?: boolean
}

/** `id` solo al editar: lo que ya existe conserva sus respuestas. */
export type OptionDraft = {
  readonly id?: string
  readonly label: string
  readonly imageSrc?: string
  readonly isOther?: boolean
  readonly exclusive?: boolean
}

/** Condición por posiciones: al crear, preguntas y opciones aún no tienen id. */
export type ConditionDraft = {
  readonly question: number
  readonly options: readonly number[]
  readonly mode: PollConditionMode
}

export type RowDraft = {
  readonly id?: string
  readonly label: string
  readonly code?: string
}

export type QuestionDraft = {
  readonly id?: string
  readonly kind: PollKind
  readonly prompt: string
  readonly help?: string
  readonly section?: string
  readonly code?: string
  readonly display?: PollDisplay
  readonly tone?: PollTone
  readonly rows?: readonly RowDraft[]
  readonly showIf?: ConditionDraft
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
  readonly showResults: boolean
  readonly outingId?: string
  readonly closesAt?: string
  readonly questions: readonly QuestionDraft[]
}

export type PollPatch = {
  readonly status?: PollStatus
  readonly featured?: boolean
  readonly showResults?: boolean
  readonly closesAt?: string | null
}

export type PollStats = {
  readonly impressions: number
  readonly visits: number
  /** Personas distintas que la vieron. */
  readonly visitors: number
}

export type OperatorPoll = Omit<Poll, 'isOpen' | 'hasVoted' | 'ridersOnly' | 'isInscribed' | 'results'> & {
  readonly results: PollResults
  readonly stats: PollStats
}

export type PollVisitor = {
  readonly key: string
  readonly userId?: string
  readonly name?: string
  readonly whatsapp?: string
  readonly impressions: number
  readonly visits: number
  readonly firstSeen: string
  readonly lastSeen: string
  readonly responded: boolean
}

export type PollDayPoint = {
  readonly day: string
  readonly impressions: number
  readonly visits: number
  readonly responses: number
}

export type PollResponseEntry = {
  readonly id: string
  readonly createdAt: string
  readonly userId?: string
  readonly name?: string
  readonly answers: readonly { readonly questionId: string; readonly text: string }[]
}

export type PollInsights = {
  readonly stats: PollStats & { readonly responses: number }
  readonly series: readonly PollDayPoint[]
  readonly visitors: readonly PollVisitor[]
  readonly responses: readonly PollResponseEntry[]
}

/** `impression`: salió en pantalla; `visit`: abrieron su página. */
export type PollViewKind = 'impression' | 'visit'

export interface PollsPort {
  list(filter?: PollFilter): Promise<Result<readonly Poll[], AppError>>
  /** `null` si no existe o no está publicada. */
  get(pollId: string): Promise<Result<Poll | null, AppError>>
  vote(pollId: string, answers: readonly AnswerPayload[]): Promise<Result<Poll, AppError>>
  /** Mejor esfuerzo: si falla, no molesta a quien está viendo. */
  track(pollId: string, kind: PollViewKind): void
}

export interface PollsAdminPort {
  list(clave: string): Promise<Result<readonly OperatorPoll[], AppError>>
  create(draft: PollDraft, clave: string): Promise<Result<string, AppError>>
  edit(id: string, draft: PollDraft, clave: string): Promise<Result<true, AppError>>
  update(id: string, patch: PollPatch, clave: string): Promise<Result<true, AppError>>
  remove(id: string, clave: string): Promise<Result<true, AppError>>
  insights(id: string, clave: string): Promise<Result<PollInsights, AppError>>
  removeResponse(id: string, responseId: string, clave: string): Promise<Result<true, AppError>>
  clearResponses(id: string, clave: string): Promise<Result<true, AppError>>
}

/** Respuestas a medio camino, para no perderlas si recargan la página. */
export interface BallotDraftPort {
  load(pollId: string): Ballot | null
  save(pollId: string, ballot: Ballot): void
  clear(pollId: string): void
}

/** Sesión y llave anónima del navegador; la app decide de dónde salen. */
export interface VoterIdentityPort {
  sessionId(): string
  anonKey(): string
}
