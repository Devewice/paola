import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import type { Outing, OutingDraft } from '@modules/rides/domain/entities/Outing.ts'
import type { OutingCatalogPort } from '@modules/rides/domain/ports/OutingCatalogPort.ts'

const DATE = /^\d{4}-\d{2}-\d{2}$/

export class PublishOuting {
  private readonly catalog: OutingCatalogPort
  private readonly nextId: () => string

  constructor(catalog: OutingCatalogPort, nextId: () => string) {
    this.catalog = catalog
    this.nextId = nextId
  }

  execute(draft: OutingDraft): Result<Outing, AppError> {
    const title = draft.title.trim()
    const meetingPoint = draft.meetingPoint.trim()
    const routeText = draft.routeText.trim()
    const whatToBring = draft.whatToBring.trim()
    const date = draft.date.trim()

    if (!DATE.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00`))) {
      return err(appError('VALIDATION', 'No se publica una salida sin fecha válida.'))
    }

    if (!Number.isInteger(draft.capacity) || draft.capacity < 1) {
      return err(appError('VALIDATION', 'No se publica una salida sin cupo máximo (entero ≥ 1).'))
    }

    if (!title) {
      return err(appError('VALIDATION', 'No se publica una salida sin título.'))
    }

    if (draft.kind !== 'rodada' && draft.kind !== 'actividad') {
      return err(appError('VALIDATION', 'La salida es rodada o actividad.'))
    }

    if (!meetingPoint) {
      return err(appError('VALIDATION', 'No se publica una salida sin punto de encuentro.'))
    }

    const outing: Outing = {
      id: this.nextId(),
      title,
      date,
      kind: draft.kind,
      meetingPoint,
      routeText,
      capacity: draft.capacity,
      whatToBring,
      paid: draft.paid,
      status: 'abierto',
    }

    this.catalog.save(outing)
    return ok(outing)
  }
}
