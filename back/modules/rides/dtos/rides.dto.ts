import type { OutingKind, OperatorOutingStatus } from '../interfaces/rides.interface.js'

export interface ClaimSpotDto {
  name: string
  whatsapp: string
  moto: string
}

export interface CreateOutingDto {
  title: string
  date: string
  kind: OutingKind
  meetingPoint: string
  routeText: string
  whatToBring: string
  capacity: number
  paid: boolean
}

export interface SetOutingStatusDto {
  status: OperatorOutingStatus
}
