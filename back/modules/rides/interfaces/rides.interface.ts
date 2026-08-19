export type OutingKind = 'rodada' | 'actividad'
export type OutingStatus = 'abierto' | 'lleno' | 'cerrado' | 'realizado'
export type OperatorOutingStatus = Extract<OutingStatus, 'cerrado' | 'realizado'>

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
}

export interface Ticket {
  id: string
  outingId: string
  name: string
  whatsapp: string
  moto: string
  userId?: string
}

export interface OperatorBoardOuting extends Outing {
  tickets: Ticket[]
}

