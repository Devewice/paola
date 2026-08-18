import { sendJson } from '../http/send.js'
import { listTips } from '../providers/tips.provider.js'
import type { RouteHandler } from '../http/types.js'

export const listTipsController: RouteHandler = async (_request, response) => {
  try {
    const tips = await listTips()
    sendJson(response, 200, { ok: true, tips })
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'mysql'
    sendJson(response, 200, { ok: true, tips: [], detail })
  }
}
