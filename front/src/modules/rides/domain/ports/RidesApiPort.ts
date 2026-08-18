import type { AppError } from '@core/errors/AppError.ts'
import type { Result } from '@core/result.ts'
import type { OperatorOutingStatus, Outing, OutingDraft } from '@modules/rides/domain/entities/Outing.ts'
import type { ClaimedSpot, OutingNotice, Ticket, TicketDraft } from '@modules/rides/domain/entities/Ticket.ts'

export type OperatorBoardOuting = Outing & {
  readonly tickets: readonly Ticket[]
}

export interface RidesApiPort {
  claim(
    outingId: string,
    draft: TicketDraft,
  ): Promise<Result<ClaimedSpot & { notice: OutingNotice }, AppError>>
  setStatus(
    outingId: string,
    status: OperatorOutingStatus,
    clave: string,
  ): Promise<Result<Outing, AppError>>
  listBoard(clave: string): Promise<Result<readonly OperatorBoardOuting[], AppError>>
  publish(draft: OutingDraft, clave: string): Promise<Result<Outing, AppError>>
}
