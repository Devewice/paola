import { HTTP_MESSAGES, HTTP_STATUS, PERMISSION } from '../../../http/constants.js'
import { readBodyOrReject, requirePermission } from '../../../http/guard.js'
import { sendJson } from '../../../http/send.js'
import type { RouteHandler } from '../../../http/types.js'
import type { Report } from '../interfaces/voice.interface.js'
import {
  createFine,
  createReport,
  createTip,
  editFine,
  editTip,
  listFines,
  listOperatorReports,
  listReports,
  listTips,
  moderateReport,
  removeFine,
  removeTip,
} from '../services/voice.service.js'

export const listTipsController: RouteHandler = async (_request, response) => {
  try {
    const tips = await listTips()
    sendJson(response, HTTP_STATUS.OK, { ok: true, tips })
  } catch (error) {
    const detail = error instanceof Error ? error.message : HTTP_MESSAGES.MYSQL_FALLBACK
    sendJson(response, HTTP_STATUS.OK, { ok: true, tips: [], detail })
  }
}

export const createTipController: RouteHandler = async (request, response) => {
  const body = await readBodyOrReject(request, response)
  if (!body || !(await requirePermission(request, response, PERMISSION.VOZ, body))) return
  const result = await createTip(body)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, { ok: true, tip: result.tip })
}

type VoiceResult = { ok: true } | { ok: false; status: number; detail: string }

/** Editar y borrar en Tu voz comparten guardia y forma de respuesta. */
function voiceOperation(
  run: (id: string, body: Record<string, unknown>) => Promise<VoiceResult & Record<string, unknown>>,
): RouteHandler {
  return async (request, response, _url, params) => {
    const body = await readBodyOrReject(request, response)
    if (!body || !(await requirePermission(request, response, PERMISSION.VOZ, body))) return
    const result = await run(params.id ?? '', body)
    if (!result.ok) {
      sendJson(response, result.status, { ok: false, detail: result.detail })
      return
    }
    sendJson(response, HTTP_STATUS.OK, result)
  }
}

export const updateTipController = voiceOperation((id, body) => editTip(id, body))
export const deleteTipController = voiceOperation((id) => removeTip(id))
export const updateFineController = voiceOperation((id, body) => editFine(id, body))
export const deleteFineController = voiceOperation((id) => removeFine(id))

export const listFinesController: RouteHandler = async (_request, response) => {
  try {
    const fines = await listFines()
    sendJson(response, HTTP_STATUS.OK, { ok: true, fines, comparendos: fines })
  } catch (error) {
    const detail = error instanceof Error ? error.message : HTTP_MESSAGES.MYSQL_FALLBACK
    sendJson(response, HTTP_STATUS.OK, { ok: true, fines: [], comparendos: [], detail })
  }
}

export const createFineController: RouteHandler = async (request, response) => {
  const body = await readBodyOrReject(request, response)
  if (!body || !(await requirePermission(request, response, PERMISSION.VOZ, body))) return
  const result = await createFine(body)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, { ok: true, fine: result.fine, comparendo: result.fine })
}

export const listReportsController: RouteHandler = async (_request, response) => {
  try {
    const reports = await listReports()
    sendJson(response, HTTP_STATUS.OK, { ok: true, reports, denuncias: reports })
  } catch (error) {
    const detail = error instanceof Error ? error.message : HTTP_MESSAGES.MYSQL_FALLBACK
    sendJson(response, HTTP_STATUS.OK, { ok: true, reports: [], denuncias: [], detail })
  }
}

export const listOperatorReportsController: RouteHandler = async (request, response) => {
  if (!(await requirePermission(request, response, PERMISSION.VOZ))) return
  try {
    const reports = await listOperatorReports()
    sendJson(response, HTTP_STATUS.OK, { ok: true, reports, denuncias: reports })
  } catch (error) {
    const detail = error instanceof Error ? error.message : HTTP_MESSAGES.MYSQL_FALLBACK
    sendJson(response, HTTP_STATUS.OK, { ok: true, reports: [], denuncias: [], detail })
  }
}

export const createReportController: RouteHandler = async (request, response) => {
  const body = await readBodyOrReject(request, response)
  if (!body) return
  const result = await createReport(body)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, { ok: true, report: result.report, denuncia: result.report })
}

export const moderateReportController: RouteHandler = async (request, response, _url, params) => {
  const body = await readBodyOrReject(request, response)
  if (!body || !(await requirePermission(request, response, PERMISSION.VOZ, body))) return
  const status = typeof body.status === 'string' ? body.status : ''
  const note = typeof body.note === 'string' ? body.note : undefined
  const result = await moderateReport(params.id ?? '', status as Report['moderationStatus'], note)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, { ok: true })
}
