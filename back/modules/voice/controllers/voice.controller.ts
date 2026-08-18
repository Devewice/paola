import { HTTP_MESSAGES, HTTP_STATUS } from '../../../http/constants.js'
import { sendJson } from '../../../http/send.js'
import type { RouteHandler } from '../../../http/types.js'
import { listTips } from '../services/voice.service.js'

export const listTipsController: RouteHandler = async (_request, response) => {
  try {
    const tips = await listTips()
    sendJson(response, HTTP_STATUS.OK, { ok: true, tips })
  } catch (error) {
    const detail = error instanceof Error ? error.message : HTTP_MESSAGES.MYSQL_FALLBACK
    sendJson(response, HTTP_STATUS.OK, { ok: true, tips: [], detail })
  }
}
