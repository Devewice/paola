import { GetAgenda } from '@modules/rides/application/GetAgenda.ts'
import { GetMemories } from '@modules/rides/application/GetMemories.ts'
import { ListOutings } from '@modules/rides/application/ListOutings.ts'
import type { MemoryDraft } from '@modules/rides/domain/entities/Memory.ts'
import type { OperatorOutingStatus, OutingDraft } from '@modules/rides/domain/entities/Outing.ts'
import type { TicketDraft } from '@modules/rides/domain/entities/Ticket.ts'
import type { MemoryCatalogPort } from '@modules/rides/domain/ports/MemoryCatalogPort.ts'
import type { OutingCatalogPort } from '@modules/rides/domain/ports/OutingCatalogPort.ts'
import type { RidesApiPort } from '@modules/rides/domain/ports/RidesApiPort.ts'

const today = () => new Date().toISOString().slice(0, 10)

export type RidesModule = {
  getAgenda: () => ReturnType<GetAgenda['execute']>
  listOutings: () => ReturnType<ListOutings['execute']>
  getMemories: () => ReturnType<GetMemories['execute']>
  claimSpot: RidesApiPort['claim']
  setOutingStatus: (
    outingId: string,
    status: OperatorOutingStatus,
    clave: string,
  ) => ReturnType<RidesApiPort['setStatus']>
  listOperatorBoard: RidesApiPort['listBoard']
  publishOuting: RidesApiPort['publish']
  publishMemory: RidesApiPort['publishMemory']
}

export function createRidesModule(
  catalog: OutingCatalogPort,
  memoryCatalog: MemoryCatalogPort,
  api: RidesApiPort,
): RidesModule {
  const getAgenda = new GetAgenda(catalog, today)
  const listOutings = new ListOutings(catalog, today)
  const getMemories = new GetMemories(memoryCatalog)

  return {
    getAgenda: () => getAgenda.execute(),
    listOutings: () => listOutings.execute(),
    getMemories: () => getMemories.execute(),
    claimSpot: (outingId, draft: TicketDraft) => api.claim(outingId, draft),
    setOutingStatus: (outingId, status, clave) => api.setStatus(outingId, status, clave),
    listOperatorBoard: (clave) => api.listBoard(clave),
    publishOuting: (draft: OutingDraft, clave) => api.publish(draft, clave),
    publishMemory: (draft: MemoryDraft, clave) => api.publishMemory(draft, clave),
  }
}
