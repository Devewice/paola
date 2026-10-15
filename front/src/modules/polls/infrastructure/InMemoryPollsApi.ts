import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import { POLLS_ADMIN_COPY, POLLS_COPY } from '@modules/polls/constants/copy.ts'
import type { AnswerPayload, Poll } from '@modules/polls/domain/entities/Poll.ts'
import type {
  OperatorPoll,
  PollFilter,
  PollsAdminPort,
  PollsPort,
} from '@modules/polls/domain/ports/PollsPort.ts'

/** Sin API: no hay encuestas que mostrar ni dónde guardar votos. */
export class InMemoryPollsApi implements PollsPort {
  private readonly polls: readonly Poll[]

  constructor(polls: readonly Poll[] = []) {
    this.polls = polls
  }

  async list(filter: PollFilter = {}): Promise<Result<readonly Poll[], AppError>> {
    return ok(
      this.polls.filter(
        (poll) =>
          (!filter.outingId || poll.outingId === filter.outingId) && (!filter.featured || poll.featured),
      ),
    )
  }

  async vote(_pollId: string, _answers: readonly AnswerPayload[]): Promise<Result<Poll, AppError>> {
    return err(appError('INFRASTRUCTURE', POLLS_COPY.voteFail))
  }
}

export class InMemoryPollsAdminApi implements PollsAdminPort {
  async list(_clave: string): Promise<Result<readonly OperatorPoll[], AppError>> {
    return ok([])
  }

  async create(): Promise<Result<string, AppError>> {
    return err(appError('INFRASTRUCTURE', POLLS_ADMIN_COPY.createFail))
  }

  async update(): Promise<Result<true, AppError>> {
    return err(appError('INFRASTRUCTURE', POLLS_ADMIN_COPY.updateFail))
  }

  async remove(): Promise<Result<true, AppError>> {
    return err(appError('INFRASTRUCTURE', POLLS_ADMIN_COPY.deleteFail))
  }
}
