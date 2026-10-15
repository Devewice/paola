import { GetAgenda } from '@modules/rides/application/GetAgenda.ts'
import { GetMemories } from '@modules/rides/application/GetMemories.ts'
import { ListOutings } from '@modules/rides/application/ListOutings.ts'
import type { MemoryDraft } from '@modules/rides/domain/entities/Memory.ts'
import {
  isClaimable,
  type OperatorOutingStatus,
  type Outing,
  type OutingDraft,
} from '@modules/rides/domain/entities/Outing.ts'
import type { SignupDraft } from '@modules/rides/domain/entities/Ticket.ts'
import type { MemoryCatalogPort } from '@modules/rides/domain/ports/MemoryCatalogPort.ts'
import type { OutingCatalogPort } from '@modules/rides/domain/ports/OutingCatalogPort.ts'
import type { RidesApiPort } from '@modules/rides/domain/ports/RidesApiPort.ts'

const today = () => new Date().toISOString().slice(0, 10)

export type RidesModule = {
  getAgenda: () => ReturnType<GetAgenda['execute']>
  listOutings: () => ReturnType<ListOutings['execute']>
  getOuting: (id: string) => Outing | null
  nextOpenOuting: () => Outing | null
  canClaim: (outing: Outing) => boolean
  getMemories: () => ReturnType<GetMemories['execute']>
  claimSpot: RidesApiPort['claim']
  loadCrew: RidesApiPort['crew']
  noticeFor: RidesApiPort['notice']
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
    getOuting: (id) => catalog.get(id) ?? null,
    nextOpenOuting: () => listOutings.execute().find((item) => isClaimable(item, today())) ?? null,
    canClaim: (outing) => isClaimable(outing, today()),
    getMemories: () => getMemories.execute(),
    claimSpot: (outingId, draft: SignupDraft) => api.claim(outingId, draft),
    loadCrew: (outingId) => api.crew(outingId),
    noticeFor: (outing, alias) => api.notice(outing, alias),
    setOutingStatus: (outingId, status, clave) => api.setStatus(outingId, status, clave),
    listOperatorBoard: (clave) => api.listBoard(clave),
    publishOuting: (draft: OutingDraft, clave) => api.publish(draft, clave),
    publishMemory: (draft: MemoryDraft, clave) => api.publishMemory(draft, clave),
  }
}
