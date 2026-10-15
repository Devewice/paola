import { HTTP_STATUS, PERMISSION } from '../../../http/constants.js'
import { readBodyOrReject, requirePermission } from '../../../http/guard.js'
import { operadorSessionFrom } from '../../../http/operar.js'
import { sendJson } from '../../../http/send.js'
import type { RouteHandler } from '../../../http/types.js'
import {
  changeUserRole,
  createRole,
  editRole,
  readAccess,
  readRolesBoard,
  readUsers,
  removeRole,
} from '../services/roles.service.js'

export const accessController: RouteHandler = async (request, response) => {
  const result = await readAccess(operadorSessionFrom(request))
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, HTTP_STATUS.OK, { ok: true, access: result.value })
}

export const listRolesController: RouteHandler = async (request, response) => {
  if (!(await requirePermission(request, response, PERMISSION.ROLES))) return
  sendJson(response, HTTP_STATUS.OK, { ok: true, ...(await readRolesBoard()) })
}

export const createRoleController: RouteHandler = async (request, response) => {
  const body = await readBodyOrReject(request, response)
  if (!body || !(await requirePermission(request, response, PERMISSION.ROLES, body))) return
  const result = await createRole(body)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, { ok: true, id: result.value.id })
}

export const updateRoleController: RouteHandler = async (request, response, _url, params) => {
  const body = await readBodyOrReject(request, response)
  if (!body || !(await requirePermission(request, response, PERMISSION.ROLES, body))) return
  const result = await editRole(params.id ?? '', body)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, { ok: true })
}

export const deleteRoleController: RouteHandler = async (request, response, _url, params) => {
  const body = await readBodyOrReject(request, response)
  if (!body || !(await requirePermission(request, response, PERMISSION.ROLES, body))) return
  const result = await removeRole(params.id ?? '')
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, { ok: true })
}

export const listUsersController: RouteHandler = async (request, response, url) => {
  if (!(await requirePermission(request, response, PERMISSION.ROLES))) return
  sendJson(response, HTTP_STATUS.OK, { ok: true, users: await readUsers(url.searchParams.get('q') ?? '') })
}

export const setUserRoleController: RouteHandler = async (request, response, _url, params) => {
  const body = await readBodyOrReject(request, response)
  if (!body) return
  const actor = await requirePermission(request, response, PERMISSION.ROLES, body)
  if (!actor) return
  const result = await changeUserRole(actor, params.id ?? '', body.roleId)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, { ok: true })
}
