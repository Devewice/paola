import type { Outing } from '@modules/rides/domain/entities/Outing.ts'
import type { Ticket } from '@modules/rides/domain/entities/Ticket.ts'
import type { OutingCatalogPort } from '@modules/rides/domain/ports/OutingCatalogPort.ts'

export class InMemoryOutingCatalog implements OutingCatalogPort {
  private items: Outing[]
  private tickets: Ticket[]

  constructor(seed: readonly Outing[] = [], tickets: readonly Ticket[] = []) {
    this.items = [...seed]
    this.tickets = [...tickets]
  }

  list(): readonly Outing[] {
    return this.items.map((outing) => this.withTaken(outing))
  }

  get(id: string): Outing | undefined {
    const outing = this.items.find((item) => item.id === id)
    return outing ? this.withTaken(outing) : undefined
  }

  save(outing: Outing): void {
    const index = this.items.findIndex((item) => item.id === outing.id)
    if (index === -1) {
      this.items = [...this.items, outing]
      return
    }
    this.items = this.items.map((item) => (item.id === outing.id ? outing : item))
  }

  listTickets(outingId: string): readonly Ticket[] {
    return this.tickets.filter((ticket) => ticket.outingId === outingId)
  }

  addTicket(ticket: Ticket): void {
    this.tickets = [...this.tickets, ticket]
  }

  private withTaken(outing: Outing): Outing {
    return { ...outing, taken: this.listTickets(outing.id).length }
  }
}
