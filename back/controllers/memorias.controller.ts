import { sendJson } from '../http/send.js'
import { readJson } from '../http/readJson.js'
import { claveFromRequest, operadorClaveOk } from '../http/operar.js'
import { createMemoria, listMemorias } from '../providers/memorias.provider.js'
import type { RouteHandler } from '../http/types.js'

export const listMemoriasController: RouteHandler = async (_request, response) => {
  try {
    const { memories, totalKm } = await listMemorias()
    sendJson(response, 200, { ok: true, memories, totalKm })
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'mysql'
    sendJson(response, 200, { ok: true, memories: [], totalKm: 0, detail })
  }
}

export const createMemoriaController: RouteHandler = async (request, response) => {
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

  const result = await createMemoria(body)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, 201, { ok: true, memory: result.memory })
}
