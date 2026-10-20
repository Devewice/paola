import type { AppError } from '@core/errors/AppError.ts'
import type { Result } from '@core/result.ts'
import type { MemoryDraft } from '@modules/rides/domain/entities/Memory.ts'
import type { OperatorOutingStatus, Outing, OutingDraft, PlaceResult } from '@modules/rides/domain/entities/Outing.ts'
import type { Memory } from '@modules/rides/domain/entities/Memory.ts'
import type {
  ClaimedSpot,
  OutingCrew,
  OperatorTicket,
  OutingNotice,
  SignupDraft,
} from '@modules/rides/domain/entities/Ticket.ts'

export type OperatorBoardOuting = Outing & {
  readonly tickets: readonly OperatorTicket[]
}

export interface RidesApiPort {
  claim(
    outingId: string,
    draft: SignupDraft,
  ): Promise<Result<ClaimedSpot & { notice: OutingNotice }, AppError>>
  crew(outingId: string): Promise<Result<OutingCrew, AppError>>
  confirm(outingId: string): Promise<Result<true, AppError>>
  release(outingId: string): Promise<Result<true, AppError>>
  notice(outing: Outing, alias: string): OutingNotice
  setStatus(
    outingId: string,
    status: OperatorOutingStatus,
    clave: string,
  ): Promise<Result<Outing, AppError>>
  listBoard(clave: string): Promise<Result<readonly OperatorBoardOuting[], AppError>>
  publish(draft: OutingDraft, clave: string): Promise<Result<Outing, AppError>>
  update(outingId: string, draft: OutingDraft, clave: string): Promise<Result<Outing, AppError>>
  remove(outingId: string, clave: string): Promise<Result<true, AppError>>
  publishMemory(draft: MemoryDraft, clave: string): Promise<Result<Memory, AppError>>
  removeMemory(memoryId: string, clave: string): Promise<Result<true, AppError>>
  searchPlaces(query: string, clave: string): Promise<Result<readonly PlaceResult[], AppError>>
}
