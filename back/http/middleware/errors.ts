import { HTTP_MESSAGES, HTTP_STATUS } from '../constants.js'
import { sendJson } from '../send.js'
import type { RouteHandler } from '../types.js'

export function withErrors(handler: RouteHandler): RouteHandler {
  return async (request, response, url, params) => {
    try {
      await handler(request, response, url, params)
    } catch (error) {
      const message = error instanceof Error ? error.message : HTTP_MESSAGES.INTERNAL
      sendJson(response, HTTP_STATUS.INTERNAL, { ok: false, detail: message })
    }
  }
}
