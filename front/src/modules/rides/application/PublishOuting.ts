import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import { RIDES_ISO_DATE, RIDES_KIND, RIDES_LIMITS, RIDES_MESSAGES, RIDES_STATUS } from '@modules/rides/constants/copy.ts'
import type { Outing, OutingDraft } from '@modules/rides/domain/entities/Outing.ts'
import type { OutingCatalogPort } from '@modules/rides/domain/ports/OutingCatalogPort.ts'

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

    if (!RIDES_ISO_DATE.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00`))) {
      return err(appError('VALIDATION', RIDES_MESSAGES.DATE_INVALID))
    }

    if (!Number.isInteger(draft.capacity) || draft.capacity < RIDES_LIMITS.CAPACITY_MIN) {
      return err(appError('VALIDATION', RIDES_MESSAGES.CAPACITY_INVALID))
    }

    if (!title) {
      return err(appError('VALIDATION', RIDES_MESSAGES.TITLE_REQUIRED))
    }

    if (draft.kind !== RIDES_KIND.RODADA && draft.kind !== RIDES_KIND.ACTIVIDAD) {
      return err(appError('VALIDATION', RIDES_MESSAGES.KIND_INVALID))
    }

    if (!meetingPoint) {
      return err(appError('VALIDATION', RIDES_MESSAGES.MEETING_REQUIRED))
    }

    const outing: Outing = {
      id: this.nextId(),
      title,
      date,
      kind: draft.kind,
      meetingPoint,
      routeText,
      capacity: draft.capacity,
      taken: 0,
      whatToBring,
      paid: draft.paid,
      status: RIDES_STATUS.ABIERTO,
    }

    this.catalog.save(outing)
    return ok(outing)
  }
}
