import type { Outing } from '@modules/rides/domain/entities/Outing.ts'

export type TicketDraft = {
  readonly name: string
  readonly whatsapp: string
  readonly moto?: string
  readonly privacyAccepted: boolean
}

export type Ticket = {
  readonly id: string
  readonly outingId: string
  readonly name: string
  readonly whatsapp: string
  readonly moto: string
}

export type ClaimedSpot = {
  readonly ticket: Ticket
  readonly outing: Outing
}

/** Inscripción con cuenta: solo viaja lo que el perfil aún no tiene. */
export type SignupDraft = {
  readonly whatsapp?: string
  readonly moto?: string
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
  readonly needsWhatsapp: boolean
  readonly moto?: string
  readonly riders: readonly CrewRider[]
}

export type OutingNotice = {
  readonly whatsappHref: string
  readonly mailtoHref: string
}
