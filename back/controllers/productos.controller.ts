import { sendJson } from '../http/send.js'
import { readJson } from '../http/readJson.js'
import { claveFromRequest, operadorClaveOk } from '../http/operar.js'
import { createProducto, listProductos } from '../providers/productos.provider.js'
import type { RouteHandler } from '../http/types.js'

export const listProductosController: RouteHandler = async (_request, response) => {
  try {
    const products = await listProductos()
    sendJson(response, 200, { ok: true, products })
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'mysql'
    sendJson(response, 200, { ok: true, products: [], detail })
  }
}

export const createProductoController: RouteHandler = async (request, response) => {
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

  const result = await createProducto(body)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, 201, { ok: true, product: result.product })
}
