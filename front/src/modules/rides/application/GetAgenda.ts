import type { Agenda } from '@modules/rides/domain/entities/Agenda.ts'
import type { AgendaPort } from '@modules/rides/domain/ports/AgendaPort.ts'

export class GetAgenda {
  private readonly agenda: AgendaPort

  constructor(agenda: AgendaPort) {
    this.agenda = agenda
  }

  execute(): Agenda {
    const list = this.agenda.getAgenda()
    const upcoming = list.items.filter((item) => item.when === 'proxima')
    const past = list.items.filter((item) => item.when === 'pasada')

    return {
      emptyCopy: list.emptyCopy,
      items: [...upcoming, ...past],
    }
  }
}
