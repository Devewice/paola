import type { Agenda } from '@modules/rides/domain/entities/Agenda.ts'

export interface AgendaPort {
  getAgenda(): Agenda
}
