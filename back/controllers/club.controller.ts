import { sendJson } from '../http/send.js'
import { readJson } from '../http/readJson.js'
import { claveFromRequest, operadorClaveOk } from '../http/operar.js'
import {
  createAlianza,
  createIntegrante,
  listAlianzas,
  listIntegrantes,
} from '../providers/club.provider.js'
import type { RouteHandler } from '../http/types.js'

export const listAlianzasController: RouteHandler = async (_request, response) => {
  try {
    const alliances = await listAlianzas()
    sendJson(response, 200, { ok: true, alliances })
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'mysql'
    sendJson(response, 200, { ok: true, alliances: [], detail })
  }
}

export const listIntegrantesController: RouteHandler = async (_request, response) => {
  try {
    const members = await listIntegrantes()
    sendJson(response, 200, { ok: true, members })
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'mysql'
    sendJson(response, 200, { ok: true, members: [], detail })
  }
}

export const createAlianzaController: RouteHandler = async (request, response) => {
  let body: Record<string, unknown>
  try {
    body = await readJson(request)
  } catch {
    sendJson(response, 400, { ok: false, detail: 'El cuerpo no es JSON.' })
    return
  }
  if (!operadorClaveOk(claveFromRequest(request, body))) {
    sendJson(response, 403, { ok: false, detail: 'Clave de operadora no válida.' })
    return
  }
  const result = await createAlianza(body)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, 201, { ok: true, alliance: result.alliance })
}

export const createIntegranteController: RouteHandler = async (request, response) => {
  let body: Record<string, unknown>
  try {
    body = await readJson(request)
  } catch {
    sendJson(response, 400, { ok: false, detail: 'El cuerpo no es JSON.' })
    return
  }
  if (!operadorClaveOk(claveFromRequest(request, body))) {
    sendJson(response, 403, { ok: false, detail: 'Clave de operadora no válida.' })
    return
  }
  const result = await createIntegrante(body)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, 201, { ok: true, member: result.member })
}
