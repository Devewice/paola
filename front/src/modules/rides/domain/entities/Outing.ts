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
