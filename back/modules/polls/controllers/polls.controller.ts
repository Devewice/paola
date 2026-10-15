import type { IncomingMessage } from 'node:http'
import { HTTP_HEADER, HTTP_MESSAGES, HTTP_STATUS, PERMISSION } from '../../../http/constants.js'
import { readBodyOrReject, requirePermission } from '../../../http/guard.js'
import { sendJson } from '../../../http/send.js'
import type { RouteHandler } from '../../../http/types.js'
import { POLL_QUERY } from '../constants/polls.constants.js'
import {
  createPoll,
  listOperatorPolls,
  listPublicPolls,
  patchPoll,
  readPublicPoll,
  removePoll,
  vote,
  type VoterIdentity,
} from '../services/polls.service.js'

function header(request: IncomingMessage, name: string): string {
  const value = request.headers[name]
  return typeof value === 'string' ? value.trim() : ''
}

function identityOf(request: IncomingMessage): VoterIdentity {
  return {
    sessionId: header(request, HTTP_HEADER.SESSION_ID),
    anonKey: header(request, HTTP_HEADER.VOTER_KEY),
  }
}

export const listPollsController: RouteHandler = async (request, response, url) => {
  try {
    const polls = await listPublicPolls(
      {
        outingId: url.searchParams.get(POLL_QUERY.OUTING) ?? undefined,
        featured: url.searchParams.get(POLL_QUERY.FEATURED) === '1',
      },
      identityOf(request),
    )
    sendJson(response, HTTP_STATUS.OK, { ok: true, polls })
  } catch (error) {
    const detail = error instanceof Error ? error.message : HTTP_MESSAGES.MYSQL_FALLBACK
    sendJson(response, HTTP_STATUS.OK, { ok: true, polls: [], detail })
  }
}

export const readPollController: RouteHandler = async (request, response, _url, params) => {
  const result = await readPublicPoll(params.id ?? '', identityOf(request))
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, { ok: true, poll: result.value })
}

export const votePollController: RouteHandler = async (request, response, _url, params) => {
  const body = await readBodyOrReject(request, response)
  if (!body) return
  const result = await vote(params.id ?? '', body, identityOf(request))
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, { ok: true, poll: result.value })
}

export const listOperatorPollsController: RouteHandler = async (request, response) => {
  if (!(await requirePermission(request, response, PERMISSION.ENCUESTAS))) return
  try {
    const polls = await listOperatorPolls()
    sendJson(response, HTTP_STATUS.OK, { ok: true, polls })
  } catch (error) {
    const detail = error instanceof Error ? error.message : HTTP_MESSAGES.MYSQL_FALLBACK
    sendJson(response, HTTP_STATUS.OK, { ok: true, polls: [], detail })
  }
}

export const createPollController: RouteHandler = async (request, response) => {
  const body = await readBodyOrReject(request, response)
  if (!body || !(await requirePermission(request, response, PERMISSION.ENCUESTAS, body))) return
  const result = await createPoll(body)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, { ok: true, id: result.value.id })
}

export const updatePollController: RouteHandler = async (request, response, _url, params) => {
  const body = await readBodyOrReject(request, response)
  if (!body || !(await requirePermission(request, response, PERMISSION.ENCUESTAS, body))) return
  const result = await patchPoll(params.id ?? '', body)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, { ok: true })
}

export const deletePollController: RouteHandler = async (request, response, _url, params) => {
  const body = await readBodyOrReject(request, response)
  if (!body || !(await requirePermission(request, response, PERMISSION.ENCUESTAS, body))) return
  const result = await removePoll(params.id ?? '')
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, { ok: true })
}
