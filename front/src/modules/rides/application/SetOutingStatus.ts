import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import { RIDES_MESSAGES, RIDES_STATUS } from '@modules/rides/constants/copy.ts'
import type { OperatorOutingStatus, Outing } from '@modules/rides/domain/entities/Outing.ts'
import type { OutingCatalogPort } from '@modules/rides/domain/ports/OutingCatalogPort.ts'

export class SetOutingStatus {
  private readonly catalog: OutingCatalogPort

  constructor(catalog: OutingCatalogPort) {
    this.catalog = catalog
  }

  execute(outingId: string, status: OperatorOutingStatus): Result<Outing, AppError> {
    const outing = this.catalog.get(outingId)
    if (!outing) {
      return err(appError('NOT_FOUND', RIDES_MESSAGES.NOT_FOUND))
    }

    if (outing.status === RIDES_STATUS.REALIZADO && status !== RIDES_STATUS.REALIZADO) {
      return err(appError('CONFLICT', RIDES_MESSAGES.ALREADY_DONE))
    }

    const updated = { ...outing, status }
    this.catalog.save(updated)
    return ok(updated)
  }
}
