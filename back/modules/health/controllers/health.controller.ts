import { HTTP_STATUS } from '../../../http/constants.js'
import { sendJson } from '../../../http/send.js'
import type { RouteHandler } from '../../../http/types.js'
import { getHealth } from '../services/health.service.js'

export const healthController: RouteHandler = async (_request, response) => {
  const payload = await getHealth()
  sendJson(response, HTTP_STATUS.OK, payload)
}
