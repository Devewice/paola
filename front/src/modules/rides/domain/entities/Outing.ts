export type OutingKind = 'rodada' | 'actividad'
export type OutingStatus = 'abierto' | 'lleno' | 'cerrado' | 'realizado'
export type OperatorOutingStatus = Extract<OutingStatus, 'cerrado' | 'realizado'>

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
}

export function remainingSpots(outing: Outing): number {
  return Math.max(0, outing.capacity - outing.taken)
}

/** Abierta y con fecha de hoy en adelante. `today` es ISO `YYYY-MM-DD`. */
export function isClaimable(outing: Outing, today: string): boolean {
  return outing.status === 'abierto' && outing.date >= today
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
