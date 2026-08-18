import { AGENDA_EMPTY_COPY, RIDES_STATUS } from '@modules/rides/constants/copy.ts'
import type { Agenda, AgendaItem } from '@modules/rides/domain/entities/Agenda.ts'
import type { Outing } from '@modules/rides/domain/entities/Outing.ts'
import type { OutingCatalogPort } from '@modules/rides/domain/ports/OutingCatalogPort.ts'

export class GetAgenda {
  private readonly catalog: OutingCatalogPort
  private readonly today: () => string

  constructor(catalog: OutingCatalogPort, today: () => string) {
    this.catalog = catalog
    this.today = today
  }

  execute(): Agenda {
    const today = this.today()
    const items = this.catalog.list().map((outing) => toAgendaItem(outing, today))
    const upcoming = items
      .filter((item) => item.when === 'proxima')
      .sort((a, b) => a.date.localeCompare(b.date))
    const past = items
      .filter((item) => item.when === 'pasada')
      .sort((a, b) => b.date.localeCompare(a.date))

    return {
      emptyCopy: AGENDA_EMPTY_COPY,
      items: [...upcoming, ...past],
    }
  }
}

function toAgendaItem(outing: Outing, today: string): AgendaItem {
  const past = outing.status === RIDES_STATUS.REALIZADO || outing.date < today
  return {
    id: outing.id,
    date: outing.date,
    title: outing.title,
    kind: outing.kind,
    point: outing.meetingPoint,
    when: past ? 'pasada' : 'proxima',
  }
}
