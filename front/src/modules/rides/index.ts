export type { Memory, MemoryDraft, MemoryList, MemoryPhoto } from '@modules/rides/domain/entities/Memory.ts'
export { MEMORIES_EMPTY_COPY } from '@modules/rides/domain/entities/Memory.ts'
export type { Agenda, AgendaItem, AgendaKind, AgendaWhen } from '@modules/rides/domain/entities/Agenda.ts'
export type {
  OperatorOutingStatus,
  Outing,
  OutingDraft,
  OutingKind,
  OutingStatus,
} from '@modules/rides/domain/entities/Outing.ts'
export { remainingSpots } from '@modules/rides/domain/entities/Outing.ts'
export type {
  ClaimedSpot,
  OutingNotice,
  Ticket,
  TicketDraft,
} from '@modules/rides/domain/entities/Ticket.ts'
export type { OperatorBoardOuting } from '@modules/rides/domain/ports/RidesApiPort.ts'
export type { RidesModule } from '@modules/rides/composition.ts'
export { createRidesModule } from '@modules/rides/composition.ts'
export { PublishOuting } from '@modules/rides/application/PublishOuting.ts'
export { ClaimSpot } from '@modules/rides/application/ClaimSpot.ts'
export { SetOutingStatus } from '@modules/rides/application/SetOutingStatus.ts'
export { GetAgenda } from '@modules/rides/application/GetAgenda.ts'
export { ListOutings } from '@modules/rides/application/ListOutings.ts'
export { InMemoryOutingCatalog } from '@modules/rides/infrastructure/InMemoryOutingCatalog.ts'
export { HttpRidesApi } from '@modules/rides/infrastructure/HttpRidesApi.ts'
export { loadOutingCatalog } from '@modules/rides/infrastructure/loadOutingCatalog.ts'
export { GetMemories } from '@modules/rides/application/GetMemories.ts'
export { InMemoryMemoryCatalog } from '@modules/rides/infrastructure/InMemoryMemoryCatalog.ts'
export { loadMemoryCatalog } from '@modules/rides/infrastructure/loadMemoryCatalog.ts'
