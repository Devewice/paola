import { sendJson } from '../send.js'
import type { RouteHandler } from '../types.js'

export function withErrors(handler: RouteHandler): RouteHandler {
  return async (request, response, url, params) => {
    try {
      await handler(request, response, url, params)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'error interno'
      sendJson(response, 500, { ok: false, detail: message })
    }
  }
}
