import { HTTP_MESSAGES, HTTP_STATUS } from '../../../http/constants.js'
import { sendJson } from '../../../http/send.js'
import type { RouteHandler } from '../../../http/types.js'
import { clubJsonBody, clubOperatorGuard } from '../middlewares/club.middleware.js'
import {
  createAlliance,
  createMember,
  listAlliances,
  listMembers,
} from '../services/club.service.js'

export const listAlliancesController: RouteHandler = async (_request, response) => {
  try {
    const alliances = await listAlliances()
    sendJson(response, HTTP_STATUS.OK, { ok: true, alliances })
  } catch (error) {
    const detail = error instanceof Error ? error.message : HTTP_MESSAGES.MYSQL_FALLBACK
    sendJson(response, HTTP_STATUS.OK, { ok: true, alliances: [], detail })
  }
}

export const listMembersController: RouteHandler = async (_request, response) => {
  try {
    const members = await listMembers()
    sendJson(response, HTTP_STATUS.OK, { ok: true, members })
  } catch (error) {
    const detail = error instanceof Error ? error.message : HTTP_MESSAGES.MYSQL_FALLBACK
    sendJson(response, HTTP_STATUS.OK, { ok: true, members: [], detail })
  }
}

export const createAllianceController: RouteHandler = async (request, response) => {
  const body = await clubJsonBody(request, response)
  if (!body) return
  if (!clubOperatorGuard(request, response, body)) return

  const result = await createAlliance(body)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, { ok: true, alliance: result.alliance })
}

export const createMemberController: RouteHandler = async (request, response) => {
  const body = await clubJsonBody(request, response)
  if (!body) return
  if (!clubOperatorGuard(request, response, body)) return

  const result = await createMember(body)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, { ok: true, member: result.member })
}
