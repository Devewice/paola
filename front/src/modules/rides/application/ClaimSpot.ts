import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import type { ClaimedSpot, Ticket, TicketDraft } from '@modules/rides/domain/entities/Ticket.ts'
import type { OutingStatus } from '@modules/rides/domain/entities/Outing.ts'
import type { OutingCatalogPort } from '@modules/rides/domain/ports/OutingCatalogPort.ts'

export class ClaimSpot {
  private readonly catalog: OutingCatalogPort
  private readonly nextId: () => string

  constructor(catalog: OutingCatalogPort, nextId: () => string) {
    this.catalog = catalog
    this.nextId = nextId
  }

  execute(outingId: string, draft: TicketDraft): Result<ClaimedSpot, AppError> {
    const name = draft.name.trim()
    const whatsapp = digitsOnly(draft.whatsapp)
    const moto = (draft.moto ?? '').trim()

    if (name.length < 2) {
      return err(appError('VALIDATION', 'El cupo necesita un nombre.'))
    }

    if (whatsapp.length < 10 || whatsapp.length > 15) {
      return err(appError('VALIDATION', 'El cupo necesita un WhatsApp (mínimo 10 dígitos).'))
    }

    const outing = this.catalog.get(outingId)
    if (!outing) {
      return err(appError('NOT_FOUND', 'Esa salida no está.'))
    }

    if (outing.status === 'realizado') {
      return err(appError('CONFLICT', 'Esa salida ya se rodó. Ya no hay cupos.'))
    }

    if (outing.status === 'cerrado') {
      return err(appError('CONFLICT', 'La inscripción está cerrada.'))
    }

    if (outing.status !== 'abierto') {
      return err(appError('CONFLICT', 'Ese cupo ya está lleno.'))
    }

    const taken = this.catalog.listTickets(outingId).length
    if (taken >= outing.capacity) {
      this.catalog.save({ ...outing, status: 'lleno', taken: outing.capacity })
      return err(appError('CONFLICT', 'Ese cupo ya está lleno.'))
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
    const status: OutingStatus = nextTaken >= outing.capacity ? 'lleno' : outing.status
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
  return value.replace(/\D/g, '')
}
