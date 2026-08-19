import { HTTP_HEADER, HTTP_MESSAGES, HTTP_STATUS } from '../../../http/constants.js'
import { sendJson } from '../../../http/send.js'
import type { RouteHandler } from '../../../http/types.js'
import { findSessionUser } from '../../social/providers/social.provider.js'
import { ensureOutingChatMembership } from '../../social/services/social.service.js'
import { ridesJsonBody, ridesOperatorGuard } from '../middlewares/rides.middleware.js'
import {
  claimSpot,
  createOuting,
  listOperatorBoard,
  listOutings,
  setOutingStatus,
} from '../services/rides.service.js'

function sessionId(request: Parameters<RouteHandler>[0]): string {
  const header = request.headers[HTTP_HEADER.SESSION_ID]
  if (typeof header === 'string') return header
  if (Array.isArray(header)) return header[0] ?? ''
  return ''
}

export const listOutingsController: RouteHandler = async (_request, response) => {
  try {
    const outings = await listOutings()
    sendJson(response, HTTP_STATUS.OK, { ok: true, outings })
  } catch (error) {
    const detail = error instanceof Error ? error.message : HTTP_MESSAGES.MYSQL_FALLBACK
    sendJson(response, HTTP_STATUS.OK, { ok: true, outings: [], detail })
  }
}

export const claimSpotController: RouteHandler = async (request, response, _url, params) => {
  const draft = await ridesJsonBody(request, response)
  if (!draft) return

  const sid = sessionId(request)
  const user = sid ? await findSessionUser(sid) : null
  const result = await claimSpot(params.id ?? '', draft, user?.id)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  if (user) {
    await ensureOutingChatMembership(user.id, params.id ?? '')
  }
  sendJson(response, HTTP_STATUS.CREATED, { ok: true, ticket: result.ticket, outing: result.outing })
}

export const listOperatorBoardController: RouteHandler = async (request, response) => {
  if (!ridesOperatorGuard(request, response)) return
  const outings = await listOperatorBoard()
  sendJson(response, HTTP_STATUS.OK, { ok: true, outings })
}

export const createOutingController: RouteHandler = async (request, response) => {
  const body = await ridesJsonBody(request, response)
  if (!body) return
  if (!ridesOperatorGuard(request, response, body)) return

  const result = await createOuting(body)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, { ok: true, outing: result.outing })
}

export const setOutingStatusController: RouteHandler = async (request, response, _url, params) => {
  const body = await ridesJsonBody(request, response)
  if (!body) return
  if (!ridesOperatorGuard(request, response, body)) return

  const result = await setOutingStatus(params.id ?? '', body.status)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, HTTP_STATUS.OK, { ok: true, outing: result.outing })
}
