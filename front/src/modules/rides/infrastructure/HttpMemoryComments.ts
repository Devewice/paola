import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import { RIDES_MESSAGES } from '@modules/rides/constants/copy.ts'
import type { MemoryCommentFilter, MemoryCommentStatus } from '@modules/rides/domain/entities/MemoryComment.ts'
import type { MemoryCommentsPort } from '@modules/rides/domain/ports/MemoryCommentsPort.ts'
import {
  parseList,
  parseMemoryComment,
  parseMemoryCommentCounts,
  parseMemoryCommentLike,
  parseOperatorMemoryComment,
} from '@modules/rides/infrastructure/parseMemoryComment.ts'
import {
  API_FAIL_FALLBACK,
  HTTP_STATUS,
  JSON_HEADERS,
  OPERADOR_CLAVE_HEADER,
  SESSION_HEADER,
  apiMemoryCommentLike,
  apiMemoryComments,
  apiOperarMemoryComment,
  apiOperarMemoryComments,
} from '@shared/http/constants.ts'

export class HttpMemoryComments implements MemoryCommentsPort {
  private readonly getSessionId: () => string

  constructor(getSessionId: () => string) {
    this.getSessionId = getSessionId
  }

  hasSession(): boolean {
    return Boolean(this.getSessionId())
  }

  private headers(): Record<string, string> {
    const headers: Record<string, string> = { ...JSON_HEADERS }
    const session = this.getSessionId()
    if (session) headers[SESSION_HEADER] = session
    return headers
  }

  async list(memoryId: string) {
    const response = await fetch(apiMemoryComments(memoryId), { headers: this.headers() })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    if (!Array.isArray(body.comments)) return err(appError('INFRASTRUCTURE', RIDES_MESSAGES.COMMENTS_PARSE_FAIL))
    return ok(parseList(body.comments, parseMemoryComment))
  }

  async post(memoryId: string, text: string, parentId?: string) {
    return this.send(apiMemoryComments(memoryId), this.headers(), { body: text, parentId })
  }

  async like(commentId: string) {
    const response = await fetch(apiMemoryCommentLike(commentId), {
      method: 'POST',
      headers: this.headers(),
      body: '{}',
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    const like = parseMemoryCommentLike(body)
    if (!like) return err(appError('INFRASTRUCTURE', RIDES_MESSAGES.LIKE_PARSE_FAIL))
    return ok(like)
  }

  async listOperator(filter: MemoryCommentFilter, clave: string) {
    const response = await fetch(apiOperarMemoryComments(filter), { headers: { [OPERADOR_CLAVE_HEADER]: clave } })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    if (!Array.isArray(body.comments)) return err(appError('INFRASTRUCTURE', RIDES_MESSAGES.COMMENTS_PARSE_FAIL))
    return ok({
      comments: parseList(body.comments, parseOperatorMemoryComment),
      counts: parseMemoryCommentCounts(body.counts),
    })
  }

  async moderate(commentId: string, status: MemoryCommentStatus, clave: string) {
    return this.send(apiOperarMemoryComment(commentId, 'status'), JSON_HEADERS, { clave, status })
  }

  async pin(commentId: string, clave: string) {
    return this.send(apiOperarMemoryComment(commentId, 'pin'), JSON_HEADERS, { clave })
  }

  async remove(commentId: string, clave: string) {
    return this.send(apiOperarMemoryComment(commentId, 'delete'), JSON_HEADERS, { clave })
  }

  private async send(
    url: string,
    headers: Record<string, string>,
    payload: Record<string, unknown>,
  ): Promise<Result<true, AppError>> {
    const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload) })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    return ok(true)
  }
}

async function readBody(response: Response): Promise<Record<string, unknown>> {
  try {
    const body: unknown = await response.json()
    if (body && typeof body === 'object') return body as Record<string, unknown>
  } catch {
    /* vacío */
  }
  return {}
}

function fail(status: number, body: Record<string, unknown>): Result<never, AppError> {
  const detail = typeof body.detail === 'string' ? body.detail : API_FAIL_FALLBACK
  if (status === HTTP_STATUS.NOT_FOUND) return err(appError('NOT_FOUND', detail))
  if (status === HTTP_STATUS.BAD_REQUEST || status === HTTP_STATUS.FORBIDDEN) return err(appError('VALIDATION', detail))
  return err(appError('INFRASTRUCTURE', detail))
}
