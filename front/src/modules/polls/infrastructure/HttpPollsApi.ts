import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import { POLLS_ADMIN_COPY, POLLS_COPY } from '@modules/polls/constants/copy.ts'
import type { AnswerPayload, Poll } from '@modules/polls/domain/entities/Poll.ts'
import type {
  OperatorPoll,
  PollDraft,
  PollExportFile,
  PollFilter,
  PollInsights,
  PollPatch,
  PollViewKind,
  PollsAdminPort,
  PollsPort,
  VoterIdentityPort,
} from '@modules/polls/domain/ports/PollsPort.ts'
import {
  parseInsights,
  parseOperatorPollList,
  parsePoll,
  parsePollList,
} from '@modules/polls/infrastructure/parsePoll.ts'
import { abortAfter } from '@shared/http/abortAfter.ts'
import {
  API,
  DOWNLOAD_TIMEOUT_MS,
  FETCH_TIMEOUT_MS,
  JSON_HEADERS,
  OPERADOR_CLAVE_HEADER,
  POLLS_QUERY,
  SESSION_HEADER,
  VOTER_KEY_HEADER,
  apiOperarPoll,
  apiOperarPollDelete,
  apiOperarPollEdit,
  apiOperarPollExport,
  apiOperarPollInsights,
  apiOperarPollResponseDelete,
  apiOperarPollResponsesClear,
  apiPoll,
  apiPollViews,
  apiPollVotes,
} from '@shared/http/constants.ts'
import { POLLS_TRACKING } from '@modules/polls/constants/copy.ts'

type Body = Record<string, unknown>

const HTTP_NOT_FOUND = 404

function detailOr(body: Body, fallback: string): string {
  return typeof body.detail === 'string' && body.detail ? body.detail : fallback
}

async function readJson(response: Response): Promise<Body> {
  return (await response.json().catch(() => ({}))) as Body
}

export class HttpPollsApi implements PollsPort {
  private readonly identity: VoterIdentityPort
  /** Lo ya enviado en esta pestaña, para no repetir al volver a pintar la misma encuesta. */
  private readonly tracked = new Set<string>()
  private readonly pending = new Map<PollViewKind, Set<string>>()
  private flushTimer: ReturnType<typeof setTimeout> | null = null

  constructor(identity: VoterIdentityPort) {
    this.identity = identity
  }

  track(pollId: string, kind: PollViewKind): void {
    const key = `${kind}:${pollId}`
    if (!pollId || this.tracked.has(key)) return
    this.tracked.add(key)
    const queue = this.pending.get(kind) ?? new Set<string>()
    queue.add(pollId)
    this.pending.set(kind, queue)
    if (!this.flushTimer) this.flushTimer = setTimeout(() => void this.flush(), POLLS_TRACKING.BATCH_DELAY_MS)
  }

  private async flush(): Promise<void> {
    this.flushTimer = null
    const batches = [...this.pending.entries()]
    this.pending.clear()
    for (const [kind, ids] of batches) {
      const all = [...ids]
      for (let start = 0; start < all.length; start += POLLS_TRACKING.BATCH_MAX) {
        const pollIds = all.slice(start, start + POLLS_TRACKING.BATCH_MAX)
        try {
          await fetch(apiPollViews(), {
            method: 'POST',
            headers: this.headers(),
            body: JSON.stringify({ kind, pollIds }),
            keepalive: true,
          })
        } catch {
          /* La métrica no frena la página. */
        }
      }
    }
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

  async get(pollId: string): Promise<Result<Poll | null, AppError>> {
    try {
      const response = await fetch(apiPoll(pollId), {
        headers: this.headers(),
        signal: abortAfter(FETCH_TIMEOUT_MS),
      })
      if (response.status === HTTP_NOT_FOUND) return ok(null)
      const body = await readJson(response)
      if (!response.ok) return err(appError('INFRASTRUCTURE', detailOr(body, POLLS_COPY.loadFail)))
      return ok(parsePoll(body.poll))
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

  async edit(id: string, draft: PollDraft, clave: string): Promise<Result<true, AppError>> {
    try {
      const { response, body } = await operatorPost(apiOperarPollEdit(id), { ...draft }, clave)
      if (!response.ok) return err(appError('VALIDATION', detailOr(body, POLLS_ADMIN_COPY.updateFail)))
      return ok(true)
    } catch {
      return err(appError('INFRASTRUCTURE', POLLS_ADMIN_COPY.updateFail))
    }
  }

  async insights(id: string, clave: string): Promise<Result<PollInsights, AppError>> {
    try {
      const response = await fetch(apiOperarPollInsights(id), {
        headers: { [OPERADOR_CLAVE_HEADER]: clave },
        signal: abortAfter(FETCH_TIMEOUT_MS),
      })
      const body = await readJson(response)
      if (!response.ok) return err(appError('VALIDATION', detailOr(body, POLLS_ADMIN_COPY.insightsFail)))
      return ok(parseInsights(body.insights))
    } catch {
      return err(appError('INFRASTRUCTURE', POLLS_ADMIN_COPY.insightsFail))
    }
  }

  async exportResponses(id: string, clave: string): Promise<Result<PollExportFile, AppError>> {
    try {
      const response = await fetch(apiOperarPollExport(id), {
        headers: { [OPERADOR_CLAVE_HEADER]: clave },
        signal: abortAfter(DOWNLOAD_TIMEOUT_MS),
      })
      if (!response.ok) {
        const body = await readJson(response)
        return err(appError('VALIDATION', detailOr(body, POLLS_ADMIN_COPY.exportFail)))
      }
      const disposition = response.headers.get('content-disposition') ?? ''
      const fileName = /filename="([^"]+)"/.exec(disposition)?.[1] ?? POLLS_ADMIN_COPY.exportFileFallback
      return ok({ fileName, data: await response.blob() })
    } catch {
      return err(appError('INFRASTRUCTURE', POLLS_ADMIN_COPY.exportFail))
    }
  }

  async removeResponse(id: string, responseId: string, clave: string): Promise<Result<true, AppError>> {
    try {
      const { response, body } = await operatorPost(apiOperarPollResponseDelete(id, responseId), {}, clave)
      if (!response.ok) return err(appError('VALIDATION', detailOr(body, POLLS_ADMIN_COPY.responseDeleteFail)))
      return ok(true)
    } catch {
      return err(appError('INFRASTRUCTURE', POLLS_ADMIN_COPY.responseDeleteFail))
    }
  }

  async clearResponses(id: string, clave: string): Promise<Result<true, AppError>> {
    try {
      const { response, body } = await operatorPost(apiOperarPollResponsesClear(id), {}, clave)
      if (!response.ok) return err(appError('VALIDATION', detailOr(body, POLLS_ADMIN_COPY.responseDeleteFail)))
      return ok(true)
    } catch {
      return err(appError('INFRASTRUCTURE', POLLS_ADMIN_COPY.responseDeleteFail))
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
