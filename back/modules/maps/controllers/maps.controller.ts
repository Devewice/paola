import { HTTP_STATUS, PERMISSION } from '../../../http/constants.js'
import { requirePermission } from '../../../http/guard.js'
import { sendJson } from '../../../http/send.js'
import type { RouteHandler } from '../../../http/types.js'
import { MAPS_LIMITS, MAPS_MESSAGES } from '../constants/maps.constants.js'
import { searchPlaces } from '../services/maps.service.js'

/** Solo quien arma rodadas busca lugares: así no se gasta la cuota de Nominatim desde afuera. */
export const searchPlacesController: RouteHandler = async (request, response, url) => {
  if (!(await requirePermission(request, response, PERMISSION.RODADAS))) return
  const query = (url.searchParams.get('q') ?? '').trim().slice(0, MAPS_LIMITS.QUERY_MAX)
  if (query.length < MAPS_LIMITS.QUERY_MIN) {
    sendJson(response, HTTP_STATUS.BAD_REQUEST, { ok: false, detail: MAPS_MESSAGES.QUERY_SHORT })
    return
  }
  try {
    sendJson(response, HTTP_STATUS.OK, { ok: true, places: await searchPlaces(query) })
  } catch {
    sendJson(response, HTTP_STATUS.BAD_GATEWAY, { ok: false, detail: MAPS_MESSAGES.SEARCH_FAIL })
  }
}
