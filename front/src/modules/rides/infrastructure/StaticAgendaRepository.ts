import type { Agenda } from '@modules/rides/domain/entities/Agenda.ts'
import type { AgendaPort } from '@modules/rides/domain/ports/AgendaPort.ts'

/** Fase 6: Paola aún no publicó fechas. */
export class StaticAgendaRepository implements AgendaPort {
  getAgenda(): Agenda {
    return {
      items: [],
      emptyCopy:
        'Ahora mismo no hay fecha. El parche vive en WhatsApp: escríbele a Paola y te avisa la próxima.',
    }
  }
}
