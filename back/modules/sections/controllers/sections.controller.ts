import { HTTP_MESSAGES, HTTP_STATUS, PERMISSION } from '../../../http/constants.js'
import { readBodyOrReject, requirePermission } from '../../../http/guard.js'
import { sendJson } from '../../../http/send.js'
import type { RouteHandler } from '../../../http/types.js'
import { SECTION_IDS } from '../constants/sections.constants.js'
import { listSections, updateSection } from '../services/sections.service.js'

/** Sin MySQL todo queda abierto: el portal no se apaga por un fallo de base. */
export const listSectionsController: RouteHandler = async (_request, response) => {
  try {
    sendJson(response, HTTP_STATUS.OK, { ok: true, sections: await listSections() })
  } catch (error) {
    const detail = error instanceof Error ? error.message : HTTP_MESSAGES.MYSQL_FALLBACK
    sendJson(response, HTTP_STATUS.OK, {
      ok: true,
      sections: SECTION_IDS.map((id) => ({ id, enabled: true })),
      detail,
    })
  }
}

export const updateSectionController: RouteHandler = async (request, response, _url, params) => {
  const body = await readBodyOrReject(request, response)
  if (!body) return
  if (!(await requirePermission(request, response, PERMISSION.AJUSTES, body))) return
  const result = await updateSection(params.id ?? '', body)
  if (!result.ok) {
    sendJson(response, result.status, { ok: false, detail: result.detail })
    return
  }
  sendJson(response, HTTP_STATUS.OK, { ok: true, section: result.section })
}
