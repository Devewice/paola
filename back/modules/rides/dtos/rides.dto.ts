import type { RideConfirmation, RideLevel } from '../constants/rides.constants.js'
import type { MapPoint } from '../../maps/index.js'
import type { OutingKind, OperatorOutingStatus } from '../interfaces/rides.interface.js'

export interface ClaimSpotDto {
  name: string
  whatsapp: string
  moto: string
  passengerName?: string
  level: RideLevel
  /** Contacto de emergencia nuevo para guardar en el perfil (solo si no tenía). */
  emergency?: { name: string; phone: string }
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
  needsEmergency: boolean
  /** Solo si está inscrito. */
  confirmation?: RideConfirmation
  /** Ya se puede responder "¿Sigues firme?". */
  confirmOpen: boolean
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
  /** Solo si el cuerpo trae `start` o `end`; `null` borra el punto. */
  points?: { start: MapPoint | null; end: MapPoint | null }
}

export interface SetOutingStatusDto {
  status: OperatorOutingStatus
}
