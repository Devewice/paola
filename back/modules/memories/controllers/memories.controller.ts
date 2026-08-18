import { HTTP_MESSAGES, HTTP_STATUS } from '../../../http/constants.js'
import { sendJson } from '../../../http/send.js'
import type { RouteHandler } from '../../../http/types.js'
import { memoriesJsonBody, memoriesOperatorGuard } from '../middlewares/memories.middleware.js'
import { createMemory, listMemories } from '../services/memories.service.js'

export const listMemoriesController: RouteHandler = async (_request, response) => {
  try {
    const { memories, totalKm } = await listMemories()
    sendJson(response, HTTP_STATUS.OK, { ok: true, memories, totalKm })
  } catch (error) {
    const detail = error instanceof Error ? error.message : HTTP_MESSAGES.MYSQL_FALLBACK
    sendJson(response, HTTP_STATUS.OK, { ok: true, memories: [], totalKm: 0, detail })
  }
}

export const createMemoryController: RouteHandler = async (request, response) => {
  const body = await memoriesJsonBody(request, response)
  if (!body) return
  if (!memoriesOperatorGuard(request, response, body)) return

  const result = await createMemory(body)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, { ok: true, memory: result.memory })
}
