export type OutingKind = 'rodada' | 'actividad'
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

