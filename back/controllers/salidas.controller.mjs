import { sendJson } from '../http/send.mjs'
import { readJson } from '../http/readJson.mjs'
import { claveFromRequest, operadorClaveOk } from '../http/operar.mjs'
import {
  claimCupo,
  listOperatorBoard,
  listSalidas,
  setSalidaStatus,
} from '../providers/salidas.provider.mjs'

export async function listSalidasController(_request, response) {
  try {
    const outings = await listSalidas()
    sendJson(response, 200, { ok: true, outings })
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'mysql'
    sendJson(response, 200, { ok: true, outings: [], detail })
  }
}

export async function claimCupoController(request, response, _url, params) {
  let draft
  try {
    draft = await readJson(request)
  } catch {
    sendJson(response, 400, { ok: false, detail: 'El cuerpo no es JSON.' })
    return
  }

  const result = await claimCupo(params.id, draft)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, 201, { ok: true, ticket: result.ticket, outing: result.outing })
}

export async function listOperatorBoardController(request, response) {
  if (!operadorClaveOk(claveFromRequest(request))) {
    sendJson(response, 403, { ok: false, detail: 'Clave de operadora no válida.' })
    return
  }
  const outings = await listOperatorBoard()
  sendJson(response, 200, { ok: true, outings })
}

export async function setSalidaStatusController(request, response, _url, params) {
  let body
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

  const result = await setSalidaStatus(params.id, body.status)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, 200, { ok: true, outing: result.outing })
}
