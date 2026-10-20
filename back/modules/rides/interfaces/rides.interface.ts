import type { MapPoint } from '../../maps/index.js'

export type OutingKind = 'rodada' | 'actividad' | 'tintada'
export type OutingStatus = 'abierto' | 'lleno' | 'cerrado' | 'realizado'
export type OperatorOutingStatus = Extract<OutingStatus, 'abierto' | 'cerrado' | 'realizado'>

export interface Outing {
  id: string
  title: string
  date: string
  kind: OutingKind
  meetingPoint: string
  routeText: string
  capacity: number
  taken: number
  whatToBring: string
  paid: boolean
  status: OutingStatus
  mapHref?: string
  route?: OutingRoute
  /** Primera foto de la memoria de la salida, si ya se publicó. */
  cover?: { src: string; alt: string }
}

/** Salida y destino en el mapa; `path` es la polyline por carretera si se pudo trazar. */
export interface OutingRoute {
  start?: MapPoint
  end?: MapPoint
  path?: string
  distanceKm?: number
  durationMin?: number
}

export interface Ticket {
  id: string
  outingId: string
  name: string
  whatsapp: string
  moto: string
  userId?: string
  passengerName?: string
  level: string
  docsOk: boolean
  rulesOk: boolean
  confirmation: string
}

/** Lo que ve la operadora en el tablero: el cupo más los datos de emergencia de la cuenta. */
export interface OperatorTicket extends Ticket {
  emergencyName?: string
  emergencyPhone?: string
  bloodType?: string
  medicalNotes?: string
}

export interface OperatorBoardOuting extends Outing {
  tickets: OperatorTicket[]
}

