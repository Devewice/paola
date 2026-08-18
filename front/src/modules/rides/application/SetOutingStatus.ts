import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
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
      return err(appError('NOT_FOUND', 'Esa salida no está.'))
    }

    if (outing.status === 'realizado' && status !== 'realizado') {
      return err(appError('CONFLICT', 'Ya se marcó realizada. No se reabre desde aquí.'))
    }

    const updated = { ...outing, status }
    this.catalog.save(updated)
    return ok(updated)
  }
}
