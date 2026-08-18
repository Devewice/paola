import type { Outing } from '@modules/rides/domain/entities/Outing.ts'
import type { Ticket } from '@modules/rides/domain/entities/Ticket.ts'

export interface OutingCatalogPort {
  list(): readonly Outing[]
  get(id: string): Outing | undefined
  save(outing: Outing): void
  listTickets(outingId: string): readonly Ticket[]
  addTicket(ticket: Ticket): void
}
