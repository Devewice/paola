import type { Outing } from '@modules/rides/domain/entities/Outing.ts'

export type TicketDraft = {
  readonly name: string
  readonly whatsapp: string
  readonly moto?: string
  readonly privacyAccepted: boolean
}

export type RideLevel = 'primera' | 'rodado' | 'veterano'
export type RideConfirmation = 'pendiente' | 'firme'

export type Ticket = {
  readonly id: string
  readonly outingId: string
  readonly name: string
  readonly whatsapp: string
  readonly moto: string
  readonly passengerName?: string
  readonly level?: string
  readonly docsOk?: boolean
  readonly rulesOk?: boolean
  readonly confirmation?: RideConfirmation
}

/** Cupo en el tablero de la operadora, con la emergencia de la cuenta. */
export type OperatorTicket = Ticket & {
  readonly emergencyName?: string
  readonly emergencyPhone?: string
  readonly bloodType?: string
  readonly medicalNotes?: string
}

export type ClaimedSpot = {
  readonly ticket: Ticket
  readonly outing: Outing
}

/** Inscripción con cuenta: lo propio de esta salida más la emergencia si el perfil no la tiene. */
export type SignupDraft = {
  readonly moto?: string
  /** Va de parrillero o sin moto: el cupo no toma la moto del perfil. */
  readonly noMoto?: boolean
  readonly passenger: boolean
  readonly passengerName?: string
  readonly level: RideLevel | ''
  readonly docsOk: boolean
  readonly rulesOk: boolean
  readonly emergencyName?: string
  readonly emergencyPhone?: string
}

export type CrewRider = {
  readonly alias: string
  readonly moto: string
  readonly avatarSrc?: string
}

/** Lo que la página de la rodada sabe de quien la mira. `riders` llega vacío si no está inscrito. */
export type OutingCrew = {
  readonly signedIn: boolean
  readonly alias?: string
  readonly inscribed: boolean
  readonly needsEmergency: boolean
  readonly confirmation?: RideConfirmation
  /** Ya se puede responder "¿Sigues firme?". */
  readonly confirmOpen: boolean
  readonly moto?: string
  /** Garaje de la cuenta, principal primero. */
  readonly motorcycles: readonly string[]
  readonly riders: readonly CrewRider[]
}

export type OutingNotice = {
  readonly whatsappHref: string
  readonly mailtoHref: string
}
