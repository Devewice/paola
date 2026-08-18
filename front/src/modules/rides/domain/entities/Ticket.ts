import type { Outing } from '@modules/rides/domain/entities/Outing.ts'

export type TicketDraft = {
  readonly name: string
  readonly whatsapp: string
  readonly moto?: string
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

export type OutingNotice = {
  readonly whatsappHref: string
  readonly mailtoHref: string
}
