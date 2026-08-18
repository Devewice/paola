import { sendJson } from '../http/send.js'
import { readJson } from '../http/readJson.js'
import { claveFromRequest, operadorClaveOk } from '../http/operar.js'
import {
  claimCupo,
  createSalida,
  listOperatorBoard,
  listSalidas,
  setSalidaStatus,
} from '../providers/salidas.provider.js'
import type { RouteHandler } from '../http/types.js'

export const listSalidasController: RouteHandler = async (_request, response) => {
  try {
    const outings = await listSalidas()
    sendJson(response, 200, { ok: true, outings })
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'mysql'
    sendJson(response, 200, { ok: true, outings: [], detail })
  }
}

export const claimCupoController: RouteHandler = async (request, response, _url, params) => {
  let draft: Record<string, unknown>
  try {
    draft = await readJson(request)
  } catch {
    sendJson(response, 400, { ok: false, detail: 'El cuerpo no es JSON.' })
    return
  }

  const result = await claimCupo(params.id ?? '', draft)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, 201, { ok: true, ticket: result.ticket, outing: result.outing })
}

export const listOperatorBoardController: RouteHandler = async (request, response) => {
  if (!operadorClaveOk(claveFromRequest(request))) {
    sendJson(response, 403, { ok: false, detail: 'Clave de operadora no válida.' })
    return
  }
  const outings = await listOperatorBoard()
  sendJson(response, 200, { ok: true, outings })
}

export const createSalidaController: RouteHandler = async (request, response) => {
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

  const result = await createSalida(body)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, 201, { ok: true, outing: result.outing })
}

export const setSalidaStatusController: RouteHandler = async (request, response, _url, params) => {
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

  const result = await setSalidaStatus(params.id ?? '', body.status)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, 200, { ok: true, outing: result.outing })
}
