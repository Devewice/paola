import { MAPS_COORDS_PATTERN, MAPS_LIMITS, MAPS_MESSAGES, MAPS_SERVICES } from '../constants/maps.constants.js'
import type { MapPoint, PlaceResult, RoadRoute } from '../interfaces/maps.interface.js'

async function getJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { 'User-Agent': MAPS_SERVICES.USER_AGENT, Accept: 'application/json' },
    signal: AbortSignal.timeout(MAPS_SERVICES.TIMEOUT_MS),
  })
  if (!response.ok) throw new Error(MAPS_MESSAGES.SEARCH_FAIL)
  return response.json()
}

function shortLabel(displayName: string): string {
  return displayName.split(',').slice(0, 2).join(',').trim().slice(0, MAPS_LIMITS.LABEL_MAX)
}

/** Coordenadas pegadas se devuelven tal cual; lo demás se busca en Colombia. */
export async function searchPlaces(query: string): Promise<PlaceResult[]> {
  const coords = MAPS_COORDS_PATTERN.exec(query)
  if (coords) {
    const lat = Number(coords[1])
    const lng = Number(coords[2])
    if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
      return [{ label: MAPS_MESSAGES.COORDS_LABEL, detail: `${lat}, ${lng}`, lat, lng }]
    }
  }
  const params = new URLSearchParams({
    format: 'jsonv2',
    q: query,
    countrycodes: MAPS_SERVICES.COUNTRY,
    limit: String(MAPS_LIMITS.RESULTS),
    'accept-language': 'es',
  })
  const body = await getJson(`${MAPS_SERVICES.SEARCH}?${params}`)
  if (!Array.isArray(body)) return []
  return body.flatMap((item): PlaceResult[] => {
    const row = item as Record<string, unknown>
    const lat = Number(row.lat)
    const lng = Number(row.lon)
    const detail = typeof row.display_name === 'string' ? row.display_name : ''
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || !detail) return []
    return [{ label: shortLabel(detail), detail, lat, lng }]
  })
}

/** Ruta por carretera entre dos puntos; `null` si el servicio no responde (el mapa traza línea recta). */
export async function routeBetween(start: MapPoint, end: MapPoint): Promise<RoadRoute | null> {
  try {
    const coords = `${start.lng},${start.lat};${end.lng},${end.lat}`
    const body = (await getJson(`${MAPS_SERVICES.ROUTE}/${coords}?overview=simplified&geometries=polyline`)) as {
      routes?: { geometry?: unknown; distance?: unknown; duration?: unknown }[]
    }
    const route = body.routes?.[0]
    if (!route || typeof route.geometry !== 'string') return null
    return {
      path: route.geometry,
      distanceM: Math.round(Number(route.distance) || 0),
      durationS: Math.round(Number(route.duration) || 0),
    }
  } catch {
    return null
  }
}
