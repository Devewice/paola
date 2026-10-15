import type { Poll, PollResults } from '../interfaces/polls.interface.js'

export type PublicPollDto = Poll & {
  hasVoted: boolean
  isOpen: boolean
  /** Encuesta de rodada: solo votan los inscritos. */
  ridersOnly: boolean
  isInscribed: boolean
  results?: PollResults
}

export type OperatorPollDto = Poll & {
  results: PollResults
}
