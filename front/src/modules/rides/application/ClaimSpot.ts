import { appError, type AppError } from '@core/errors/AppError.ts'
import { requirePrivacyNotice } from '@core/requirePrivacyNotice.ts'
import { err, ok, type Result } from '@core/result.ts'
import { RIDES_LIMITS, RIDES_MESSAGES, RIDES_STATUS } from '@modules/rides/constants/copy.ts'
import type { ClaimedSpot, Ticket, TicketDraft } from '@modules/rides/domain/entities/Ticket.ts'
import type { OutingStatus } from '@modules/rides/domain/entities/Outing.ts'
import type { OutingCatalogPort } from '@modules/rides/domain/ports/OutingCatalogPort.ts'

const WHATSAPP_NON_DIGIT = /\D/g

export class ClaimSpot {
  private readonly catalog: OutingCatalogPort
  private readonly nextId: () => string

  constructor(catalog: OutingCatalogPort, nextId: () => string) {
    this.catalog = catalog
    this.nextId = nextId
  }

  execute(outingId: string, draft: TicketDraft): Result<ClaimedSpot, AppError> {
    const privacy = requirePrivacyNotice(draft.privacyAccepted, RIDES_MESSAGES.PRIVACY_REQUIRED)
    if (!privacy.ok) return privacy

    const name = draft.name.trim()
    const whatsapp = digitsOnly(draft.whatsapp)
    const moto = (draft.moto ?? '').trim()

    if (name.length < RIDES_LIMITS.NAME_MIN) {
      return err(appError('VALIDATION', RIDES_MESSAGES.NAME_REQUIRED))
    }

    if (
      whatsapp.length < RIDES_LIMITS.WHATSAPP_MIN ||
      whatsapp.length > RIDES_LIMITS.WHATSAPP_MAX
    ) {
      return err(appError('VALIDATION', RIDES_MESSAGES.WHATSAPP_REQUIRED))
    }

    const outing = this.catalog.get(outingId)
    if (!outing) {
      return err(appError('NOT_FOUND', RIDES_MESSAGES.NOT_FOUND))
    }

    if (outing.status === RIDES_STATUS.REALIZADO) {
      return err(appError('CONFLICT', RIDES_MESSAGES.ALREADY_RODE))
    }

    if (outing.status === RIDES_STATUS.CERRADO) {
      return err(appError('CONFLICT', RIDES_MESSAGES.CLOSED))
    }

    if (outing.status !== RIDES_STATUS.ABIERTO) {
      return err(appError('CONFLICT', RIDES_MESSAGES.FULL))
    }

    const taken = this.catalog.listTickets(outingId).length
    if (taken >= outing.capacity) {
      this.catalog.save({ ...outing, status: RIDES_STATUS.LLENO, taken: outing.capacity })
      return err(appError('CONFLICT', RIDES_MESSAGES.FULL))
    }

    const ticket: Ticket = {
      id: this.nextId(),
      outingId,
      name,
      whatsapp,
      moto,
    }
    this.catalog.addTicket(ticket)

    const nextTaken = taken + 1
    const status: OutingStatus = nextTaken >= outing.capacity ? RIDES_STATUS.LLENO : outing.status
    const updated = {
      ...outing,
      taken: nextTaken,
      status,
    }
    this.catalog.save(updated)
    return ok({ ticket, outing: updated })
  }
}

function digitsOnly(value: string): string {
  return value.replace(WHATSAPP_NON_DIGIT, '')
}
