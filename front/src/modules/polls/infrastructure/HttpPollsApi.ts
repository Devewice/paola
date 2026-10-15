import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import { POLLS_ADMIN_COPY, POLLS_COPY } from '@modules/polls/constants/copy.ts'
import type { AnswerPayload, Poll } from '@modules/polls/domain/entities/Poll.ts'
import type {
  OperatorPoll,
  PollDraft,
  PollFilter,
  PollPatch,
  PollsAdminPort,
  PollsPort,
  VoterIdentityPort,
} from '@modules/polls/domain/ports/PollsPort.ts'
import { parseOperatorPollList, parsePoll, parsePollList } from '@modules/polls/infrastructure/parsePoll.ts'
import { abortAfter } from '@shared/http/abortAfter.ts'
import {
  API,
  FETCH_TIMEOUT_MS,
  JSON_HEADERS,
  OPERADOR_CLAVE_HEADER,
  POLLS_QUERY,
  SESSION_HEADER,
  VOTER_KEY_HEADER,
  apiOperarPoll,
  apiOperarPollDelete,
  apiPollVotes,
} from '@shared/http/constants.ts'

type Body = Record<string, unknown>

function detailOr(body: Body, fallback: string): string {
  return typeof body.detail === 'string' && body.detail ? body.detail : fallback
}

async function readJson(response: Response): Promise<Body> {
  return (await response.json().catch(() => ({}))) as Body
}

export class HttpPollsApi implements PollsPort {
  private readonly identity: VoterIdentityPort

  constructor(identity: VoterIdentityPort) {
    this.identity = identity
  }

  private headers(): Record<string, string> {
    return {
      ...JSON_HEADERS,
      [SESSION_HEADER]: this.identity.sessionId(),
      [VOTER_KEY_HEADER]: this.identity.anonKey(),
    }
  }

  async list(filter: PollFilter = {}): Promise<Result<readonly Poll[], AppError>> {
    const params = new URLSearchParams()
    if (filter.outingId) params.set(POLLS_QUERY.OUTING, filter.outingId)
    if (filter.featured) params.set(POLLS_QUERY.FEATURED, '1')
    const query = params.toString()
    try {
      const response = await fetch(query ? `${API.POLLS}?${query}` : API.POLLS, {
        headers: this.headers(),
        signal: abortAfter(FETCH_TIMEOUT_MS),
      })
      const body = await readJson(response)
      if (!response.ok) return err(appError('INFRASTRUCTURE', detailOr(body, POLLS_COPY.loadFail)))
      return ok(parsePollList(body.polls))
    } catch {
      return err(appError('INFRASTRUCTURE', POLLS_COPY.loadFail))
    }
  }

  async vote(pollId: string, answers: readonly AnswerPayload[]): Promise<Result<Poll, AppError>> {
    try {
      const response = await fetch(apiPollVotes(pollId), {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({ answers }),
        signal: abortAfter(FETCH_TIMEOUT_MS),
      })
      const body = await readJson(response)
      if (!response.ok) return err(appError('VALIDATION', detailOr(body, POLLS_COPY.voteFail)))
      const poll = parsePoll(body.poll)
      return poll ? ok(poll) : err(appError('INFRASTRUCTURE', POLLS_COPY.voteFail))
    } catch {
      return err(appError('INFRASTRUCTURE', POLLS_COPY.voteFail))
    }
  }
}

async function operatorPost(url: string, payload: Body, clave: string): Promise<{ response: Response; body: Body }> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { ...JSON_HEADERS, [OPERADOR_CLAVE_HEADER]: clave },
    body: JSON.stringify({ ...payload, clave }),
    signal: abortAfter(FETCH_TIMEOUT_MS),
  })
  return { response, body: await readJson(response) }
}

export class HttpPollsAdminApi implements PollsAdminPort {
  async list(clave: string): Promise<Result<readonly OperatorPoll[], AppError>> {
    try {
      const response = await fetch(API.OPERAR_POLLS, {
        headers: { [OPERADOR_CLAVE_HEADER]: clave },
        signal: abortAfter(FETCH_TIMEOUT_MS),
      })
      const body = await readJson(response)
      if (!response.ok) return err(appError('VALIDATION', detailOr(body, POLLS_ADMIN_COPY.loadFail)))
      return ok(parseOperatorPollList(body.polls))
    } catch {
      return err(appError('INFRASTRUCTURE', POLLS_ADMIN_COPY.loadFail))
    }
  }

  async create(draft: PollDraft, clave: string): Promise<Result<string, AppError>> {
    try {
      const { response, body } = await operatorPost(API.OPERAR_POLLS, { ...draft }, clave)
      if (!response.ok) return err(appError('VALIDATION', detailOr(body, POLLS_ADMIN_COPY.createFail)))
      return ok(String(body.id ?? ''))
    } catch {
      return err(appError('INFRASTRUCTURE', POLLS_ADMIN_COPY.createFail))
    }
  }

  async update(id: string, patch: PollPatch, clave: string): Promise<Result<true, AppError>> {
    try {
      const { response, body } = await operatorPost(apiOperarPoll(id), { ...patch }, clave)
      if (!response.ok) return err(appError('VALIDATION', detailOr(body, POLLS_ADMIN_COPY.updateFail)))
      return ok(true)
    } catch {
      return err(appError('INFRASTRUCTURE', POLLS_ADMIN_COPY.updateFail))
    }
  }

  async remove(id: string, clave: string): Promise<Result<true, AppError>> {
    try {
      const { response, body } = await operatorPost(apiOperarPollDelete(id), {}, clave)
      if (!response.ok) return err(appError('VALIDATION', detailOr(body, POLLS_ADMIN_COPY.deleteFail)))
      return ok(true)
    } catch {
      return err(appError('INFRASTRUCTURE', POLLS_ADMIN_COPY.deleteFail))
    }
  }
}
