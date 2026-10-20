export type LatLng = readonly [lat: number, lng: number]

/** Polyline codificada de Google/OSRM (precisión 5) a pares `[lat, lng]`. Entrada inválida → lista vacía. */
export function decodePolyline(encoded: string, precision = 5): LatLng[] {
  const factor = 10 ** precision
  const points: LatLng[] = []
  let index = 0
  let lat = 0
  let lng = 0

  const next = (): number | null => {
    let result = 0
    let shift = 0
    let byte: number
    do {
      if (index >= encoded.length) return null
      byte = encoded.charCodeAt(index++) - 63
      if (byte < 0) return null
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)
    return result & 1 ? ~(result >> 1) : result >> 1
  }

  while (index < encoded.length) {
    const dLat = next()
    const dLng = next()
    if (dLat === null || dLng === null) return []
    lat += dLat
    lng += dLng
    points.push([lat / factor, lng / factor])
  }
  return points
}
