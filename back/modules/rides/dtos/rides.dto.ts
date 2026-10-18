import type { OutingKind, OperatorOutingStatus } from '../interfaces/rides.interface.js'

export interface ClaimSpotDto {
  name: string
  whatsapp: string
  moto: string
  /** Datos nuevos para guardar en el perfil (solo los que no tenía). */
  profilePatch: { whatsapp?: string; moto?: string }
}

export interface CrewRiderDto {
  alias: string
  moto: string
  avatarSrc?: string
}

export interface OutingCrewDto {
  signedIn: boolean
  alias?: string
  inscribed: boolean
  needsWhatsapp: boolean
  moto?: string
  /** Garaje de la cuenta, principal primero. */
  motorcycles: string[]
  ticketId?: string
  riders: CrewRiderDto[]
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
