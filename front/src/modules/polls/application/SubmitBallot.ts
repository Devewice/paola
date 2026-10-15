import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, type Result } from '@core/result.ts'
import { POLLS_COPY } from '@modules/polls/constants/copy.ts'
import {
  canVote,
  missingRequired,
  needsTicket,
  toPayload,
  type Ballot,
  type Poll,
} from '@modules/polls/domain/entities/Poll.ts'
import type { PollsPort } from '@modules/polls/domain/ports/PollsPort.ts'

export class SubmitBallot {
  private readonly polls: PollsPort

  constructor(polls: PollsPort) {
    this.polls = polls
  }

  async execute(poll: Poll, ballot: Ballot, signedIn: boolean): Promise<Result<Poll, AppError>> {
    if (!canVote(poll, signedIn)) {
      return err(appError('VALIDATION', blockedMessage(poll, signedIn)))
    }
    const missing = missingRequired(poll, ballot)
    if (missing.length) {
      return err(appError('VALIDATION', `${POLLS_COPY.missing} ${missing.map((question) => question.prompt).join(' · ')}`))
    }
    return this.polls.vote(poll.id, toPayload(poll, ballot))
  }
}

function blockedMessage(poll: Poll, signedIn: boolean): string {
  if (needsTicket(poll)) return POLLS_COPY.ridersOnly
  if (poll.audience === 'account' && !signedIn) return POLLS_COPY.accountRequired
  return POLLS_COPY.voteFail
}
