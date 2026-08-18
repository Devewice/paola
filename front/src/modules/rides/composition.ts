import { GetAgenda } from '@modules/rides/application/GetAgenda.ts'
import { ListOutings } from '@modules/rides/application/ListOutings.ts'
import type { OperatorOutingStatus, OutingDraft } from '@modules/rides/domain/entities/Outing.ts'
import type { TicketDraft } from '@modules/rides/domain/entities/Ticket.ts'
import type { OutingCatalogPort } from '@modules/rides/domain/ports/OutingCatalogPort.ts'
import type { RidesApiPort } from '@modules/rides/domain/ports/RidesApiPort.ts'

const today = () => new Date().toISOString().slice(0, 10)

export type RidesModule = {
  getAgenda: () => ReturnType<GetAgenda['execute']>
  listOutings: () => ReturnType<ListOutings['execute']>
  claimSpot: RidesApiPort['claim']
  setOutingStatus: (
    outingId: string,
    status: OperatorOutingStatus,
    clave: string,
  ) => ReturnType<RidesApiPort['setStatus']>
  listOperatorBoard: RidesApiPort['listBoard']
  publishOuting: RidesApiPort['publish']
}

export function createRidesModule(catalog: OutingCatalogPort, api: RidesApiPort): RidesModule {
  const getAgenda = new GetAgenda(catalog, today)
  const listOutings = new ListOutings(catalog, today)

  return {
    getAgenda: () => getAgenda.execute(),
    listOutings: () => listOutings.execute(),
    claimSpot: (outingId, draft: TicketDraft) => api.claim(outingId, draft),
    setOutingStatus: (outingId, status, clave) => api.setStatus(outingId, status, clave),
    listOperatorBoard: (clave) => api.listBoard(clave),
    publishOuting: (draft: OutingDraft, clave) => api.publish(draft, clave),
  }
}
