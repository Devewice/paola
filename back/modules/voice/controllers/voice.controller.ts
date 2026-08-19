import { HTTP_MESSAGES, HTTP_STATUS } from '../../../http/constants.js'
import { readBodyOrReject, requireOperador } from '../../../http/guard.js'
import { sendJson } from '../../../http/send.js'
import type { RouteHandler } from '../../../http/types.js'
import type { Report } from '../interfaces/voice.interface.js'
import {
  createFine,
  createReport,
  createTip,
  listFines,
  listOperatorReports,
  listReports,
  listTips,
  moderateReport,
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
  if (!body || !requireOperador(request, response, body)) return
  const result = await createTip(body)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.CREATED, { ok: true, tip: result.tip })
}

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
  if (!body || !requireOperador(request, response, body)) return
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
  if (!requireOperador(request, response)) return
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
  if (!body || !requireOperador(request, response, body)) return
  const status = typeof body.status === 'string' ? body.status : ''
  const note = typeof body.note === 'string' ? body.note : undefined
  const result = await moderateReport(params.id ?? '', status as Report['moderationStatus'], note)
  if (!result.ok) {
    sendJson(response, result.status, result)
    return
  }
  sendJson(response, HTTP_STATUS.OK, { ok: true })
}
