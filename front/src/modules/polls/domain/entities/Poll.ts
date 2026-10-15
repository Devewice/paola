export type PollKind = 'single' | 'multiple' | 'ranking' | 'scale' | 'text'
export type PollStatus = 'draft' | 'open' | 'closed'
export type PollAudience = 'public' | 'account'

export type PollOption = {
  readonly id: string
  readonly label: string
  readonly imageSrc?: string
}

export type PollQuestion = {
  readonly id: string
  readonly kind: PollKind
  readonly prompt: string
  readonly help?: string
  readonly required: boolean
  readonly maxChoices?: number
  readonly scaleMin?: number
  readonly scaleMax?: number
  readonly scaleMinLabel?: string
  readonly scaleMaxLabel?: string
  readonly options: readonly PollOption[]
}

export type OptionTally = {
  readonly optionId: string
  readonly count: number
  readonly percent: number
  readonly averageRank?: number
}

export type QuestionResult = {
  readonly questionId: string
  readonly answered: number
  readonly options: readonly OptionTally[]
  readonly average?: number
  readonly distribution?: readonly { readonly value: number; readonly count: number }[]
  readonly texts?: readonly string[]
}

export type PollResults = {
  readonly responses: number
  readonly questions: readonly QuestionResult[]
}

export type Poll = {
  readonly id: string
  readonly title: string
  readonly description?: string
  readonly audience: PollAudience
  readonly status: PollStatus
  readonly featured: boolean
  readonly outingId?: string
  readonly outingTitle?: string
  readonly closesAt?: string
  readonly createdAt: string
  readonly questions: readonly PollQuestion[]
  readonly isOpen: boolean
  readonly hasVoted: boolean
  /** Encuesta de rodada: la ven todos, la votan los inscritos. */
  readonly ridersOnly: boolean
  readonly isInscribed: boolean
  readonly results?: PollResults
}

/** Respuesta en curso de una pregunta, antes de enviarla. */
export type BallotAnswer = {
  readonly optionIds: readonly string[]
  readonly ranking: readonly string[]
  readonly value: number | null
  readonly text: string
}

export type Ballot = Readonly<Record<string, BallotAnswer>>

export type AnswerPayload = {
  readonly questionId: string
  readonly optionIds?: readonly string[]
  readonly ranking?: readonly string[]
  readonly value?: number
  readonly text?: string
}

export const EMPTY_ANSWER: BallotAnswer = { optionIds: [], ranking: [], value: null, text: '' }

export function choiceLimit(question: PollQuestion): number {
  if (question.kind === 'single') return 1
  return question.maxChoices ?? question.options.length
}

/** Estado inicial: las preguntas de ordenar arrancan con el orden publicado. */
export function emptyBallot(poll: Pick<Poll, 'questions'>): Ballot {
  const ballot: Record<string, BallotAnswer> = {}
  for (const question of poll.questions) {
    ballot[question.id] = {
      ...EMPTY_ANSWER,
      ranking: question.kind === 'ranking' ? question.options.map((option) => option.id) : [],
    }
  }
  return ballot
}

export function isAnswered(question: PollQuestion, answer: BallotAnswer | undefined): boolean {
  if (!answer) return false
  switch (question.kind) {
    case 'single':
    case 'multiple':
      return answer.optionIds.length > 0
    case 'ranking':
      return answer.ranking.length === question.options.length
    case 'scale':
      return answer.value !== null
    case 'text':
      return answer.text.trim().length > 0
  }
}

export function toggleChoice(question: PollQuestion, answer: BallotAnswer, optionId: string): BallotAnswer {
  if (question.kind === 'single') return { ...answer, optionIds: [optionId] }
  if (answer.optionIds.includes(optionId)) {
    return { ...answer, optionIds: answer.optionIds.filter((id) => id !== optionId) }
  }
  if (answer.optionIds.length >= choiceLimit(question)) return answer
  return { ...answer, optionIds: [...answer.optionIds, optionId] }
}

export function moveRank(answer: BallotAnswer, from: number, to: number): BallotAnswer {
  if (from === to || from < 0 || to < 0 || from >= answer.ranking.length || to >= answer.ranking.length) return answer
  const ranking = [...answer.ranking]
  const [item] = ranking.splice(from, 1)
  if (item === undefined) return answer
  ranking.splice(to, 0, item)
  return { ...answer, ranking }
}

/** Preguntas obligatorias que faltan por responder. */
export function missingRequired(poll: Pick<Poll, 'questions'>, ballot: Ballot): readonly PollQuestion[] {
  return poll.questions.filter((question) => question.required && !isAnswered(question, ballot[question.id]))
}

export function toPayload(poll: Pick<Poll, 'questions'>, ballot: Ballot): readonly AnswerPayload[] {
  return poll.questions
    .filter((question) => isAnswered(question, ballot[question.id]))
    .map((question) => {
      const answer = ballot[question.id] ?? EMPTY_ANSWER
      switch (question.kind) {
        case 'single':
        case 'multiple':
          return { questionId: question.id, optionIds: answer.optionIds }
        case 'ranking':
          return { questionId: question.id, ranking: answer.ranking }
        case 'scale':
          return { questionId: question.id, value: answer.value ?? undefined }
        case 'text':
          return { questionId: question.id, text: answer.text.trim() }
      }
    })
}

export function canVote(
  poll: Pick<Poll, 'isOpen' | 'hasVoted' | 'audience' | 'ridersOnly' | 'isInscribed'>,
  signedIn: boolean,
): boolean {
  if (!poll.isOpen || poll.hasVoted) return false
  if (poll.ridersOnly) return poll.isInscribed
  return poll.audience === 'public' || signedIn
}

/** Abierta, sin votar y a la espera de que la persona se inscriba a la rodada. */
export function needsTicket(poll: Pick<Poll, 'isOpen' | 'hasVoted' | 'ridersOnly' | 'isInscribed'>): boolean {
  return poll.isOpen && !poll.hasVoted && poll.ridersOnly && !poll.isInscribed
}
