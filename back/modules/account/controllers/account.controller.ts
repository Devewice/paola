import type { IncomingMessage, ServerResponse } from 'node:http'
import { HTTP_HEADER, HTTP_STATUS } from '../../../http/constants.js'
import { readBodyOrReject } from '../../../http/guard.js'
import { sendJson } from '../../../http/send.js'
import type { Parsed, RouteHandler } from '../../../http/types.js'
import {
  addMotorcycle,
  makePrimaryMotorcycle,
  readAccount,
  readCatalog,
  removeMotorcycle,
  saveProfile,
  type AccountView,
} from '../services/account.service.js'

function sessionOf(request: IncomingMessage): string {
  const value = request.headers[HTTP_HEADER.SESSION_ID]
  if (typeof value === 'string') return value.trim()
  if (Array.isArray(value)) return (value[0] ?? '').trim()
  return ''
}

function sendView(response: ServerResponse, result: Parsed<AccountView>): void {
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, { ok: true, ...result.value })
}

export const readAccountController: RouteHandler = async (request, response) => {
  sendView(response, await readAccount(sessionOf(request)))
}

export const saveProfileController: RouteHandler = async (request, response) => {
  const body = await readBodyOrReject(request, response)
  if (!body) return
  sendView(response, await saveProfile(sessionOf(request), body))
}

export const catalogController: RouteHandler = async (_request, response) => {
  sendJson(response, HTTP_STATUS.OK, { ok: true, catalog: await readCatalog() })
}

export const addMotorcycleController: RouteHandler = async (request, response) => {
  const body = await readBodyOrReject(request, response)
  if (!body) return
  sendView(response, await addMotorcycle(sessionOf(request), body))
}

export const primaryMotorcycleController: RouteHandler = async (request, response, _url, params) => {
  sendView(response, await makePrimaryMotorcycle(sessionOf(request), params.id ?? ''))
}

export const removeMotorcycleController: RouteHandler = async (request, response, _url, params) => {
  sendView(response, await removeMotorcycle(sessionOf(request), params.id ?? ''))
}
