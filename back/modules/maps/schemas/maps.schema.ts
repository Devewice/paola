import { MAPS_LIMITS } from '../constants/maps.constants.js'
import type { MapPoint } from '../interfaces/maps.interface.js'

function coordinate(value: unknown, limit: number): number | null {
  const number = typeof value === 'string' ? Number(value) : value
  if (typeof number !== 'number' || !Number.isFinite(number) || Math.abs(number) > limit) return null
  return Math.round(number * 1e6) / 1e6
}

/** Punto válido o `null`. Sin etiqueta no se guarda: es lo que lee la gente en la tarjeta. */
export function parseMapPoint(raw: unknown): MapPoint | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  const label = typeof row.label === 'string' ? row.label.trim().slice(0, MAPS_LIMITS.LABEL_MAX) : ''
  const lat = coordinate(row.lat, 90)
  const lng = coordinate(row.lng, 180)
  if (!label || lat === null || lng === null) return null
  return { label, lat, lng }
}
