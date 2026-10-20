/** Lugar con nombre: lo que se ve en la tarjeta y en el pin del mapa. */
export type MapPoint = {
  readonly label: string
  readonly lat: number
  readonly lng: number
}

/** Resultado de búsqueda: `detail` es la dirección completa para distinguir homónimos. */
export type PlaceResult = MapPoint & { readonly detail: string }

export type OutingRoute = {
  readonly start?: MapPoint
  readonly end?: MapPoint
  /** Trazado por carretera `[lat, lng]`; vacío si no se pudo trazar. */
  readonly path: readonly (readonly [number, number])[]
  readonly distanceKm?: number
  readonly durationMin?: number
}

export type OutingKind = 'rodada' | 'actividad' | 'tintada'
export type OutingStatus = 'abierto' | 'lleno' | 'cerrado' | 'realizado'
export type OperatorOutingStatus = Extract<OutingStatus, 'abierto' | 'cerrado' | 'realizado'>

/** Salida publicada. `taken` es cuántos cupos ya están a nombre de alguien. */
export type Outing = {
  readonly id: string
  readonly title: string
  /** Fecha ISO `YYYY-MM-DD`. */
  readonly date: string
  readonly kind: OutingKind
  readonly meetingPoint: string
  readonly routeText: string
  readonly capacity: number
  readonly taken: number
  readonly whatToBring: string
  readonly paid: boolean
  readonly status: OutingStatus
  readonly mapHref?: string
  readonly route?: OutingRoute
}

export type OutingDraft = {
  readonly title: string
  readonly date: string
  readonly kind: OutingKind
  readonly meetingPoint: string
  readonly routeText: string
  readonly capacity: number
  readonly whatToBring: string
  readonly paid: boolean
  readonly start?: MapPoint | null
  readonly end?: MapPoint | null
}

export function remainingSpots(outing: Outing): number {
  return Math.max(0, outing.capacity - outing.taken)
}

/** Abierta y con fecha de hoy en adelante. `today` es ISO `YYYY-MM-DD`. */
export function isClaimable(outing: Outing, today: string): boolean {
  return outing.status === 'abierto' && outing.date >= today
}

/** Días que faltan para la salida (0 = hoy, negativo = ya pasó). Fechas ISO. */
export function daysUntil(date: string, today: string): number {
  const target = Date.parse(`${date}T00:00:00Z`)
  const now = Date.parse(`${today}T00:00:00Z`)
  if (Number.isNaN(target) || Number.isNaN(now)) return 0
  return Math.round((target - now) / 86_400_000)
}

export const CONFIRM_WINDOW_DAYS = 2

/** "¿Sigues firme?" va desde `CONFIRM_WINDOW_DAYS` antes hasta el día de la salida. Fechas ISO. */
export function isConfirmOpen(date: string, status: string, today: string): boolean {
  if (status === 'realizado' || date < today) return false
  const opens = new Date(`${date}T00:00:00Z`)
  if (Number.isNaN(opens.valueOf())) return false
  opens.setUTCDate(opens.getUTCDate() - CONFIRM_WINDOW_DAYS)
  return today >= opens.toISOString().slice(0, 10)
}
