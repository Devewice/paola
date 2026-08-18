import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import { buildOutingNotice } from '@modules/rides/application/buildOutingNotice.ts'
import type { OperatorOutingStatus, OutingDraft } from '@modules/rides/domain/entities/Outing.ts'
import type { Ticket, TicketDraft } from '@modules/rides/domain/entities/Ticket.ts'
import type { OperatorBoardOuting, RidesApiPort } from '@modules/rides/domain/ports/RidesApiPort.ts'
import { parseOuting } from '@modules/rides/infrastructure/parseOuting.ts'

type Contact = {
  readonly email: string
  readonly whatsappHref: string
}

export class HttpRidesApi implements RidesApiPort {
  private readonly contact: Contact

  constructor(contact: Contact) {
    this.contact = contact
  }

  async claim(outingId: string, draft: TicketDraft) {
    const response = await fetch(`/api/salidas/${encodeURIComponent(outingId)}/cupos`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(draft),
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)

    const outing = parseOuting(body.outing)
    const ticket = parseTicket(body.ticket)
    if (!outing || !ticket) {
      return err(appError('INFRASTRUCTURE', 'La API devolvió un cupo que no se entiende.'))
    }
    return ok({ ticket, outing, notice: buildOutingNotice(outing, ticket, this.contact) })
  }

  async setStatus(outingId: string, status: OperatorOutingStatus, clave: string) {
    const response = await fetch(`/api/operar/salidas/${encodeURIComponent(outingId)}/estado`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ clave, status }),
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    const outing = parseOuting(body.outing)
    if (!outing) return err(appError('INFRASTRUCTURE', 'La API devolvió una salida que no se entiende.'))
    return ok(outing)
  }

  async publish(draft: OutingDraft, clave: string) {
    const response = await fetch('/api/operar/salidas', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...draft, clave }),
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    const outing = parseOuting(body.outing)
    if (!outing) {
      return err(appError('INFRASTRUCTURE', 'La API devolvió una salida que no se entiende.'))
    }
    return ok(outing)
  }

  async listBoard(clave: string) {
    const response = await fetch('/api/operar/salidas', {
      headers: { 'x-operador-clave': clave },
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    if (!Array.isArray(body.outings)) {
      return err(appError('INFRASTRUCTURE', 'La lista de cupos no se entiende.'))
    }

    const outings: OperatorBoardOuting[] = []
    for (const row of body.outings) {
      if (!row || typeof row !== 'object') continue
      const outing = parseOuting(row)
      if (!outing) continue
      const rawTickets = (row as { tickets?: unknown }).tickets
      const tickets = Array.isArray(rawTickets)
        ? rawTickets.map(parseTicket).filter((item): item is Ticket => item !== null)
        : []
      outings.push({ ...outing, tickets })
    }
    return ok(outings)
  }
}

async function readBody(response: Response): Promise<Record<string, unknown>> {
  try {
    const body: unknown = await response.json()
    if (body && typeof body === 'object') return body as Record<string, unknown>
  } catch {
    /* vacío */
  }
  return {}
}

function parseTicket(raw: unknown): Ticket | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  if (typeof row.id !== 'string' || !row.id) return null
  if (typeof row.outingId !== 'string' || !row.outingId) return null
  if (typeof row.name !== 'string' || !row.name) return null
  if (typeof row.whatsapp !== 'string' || !row.whatsapp) return null
  if (typeof row.moto !== 'string') return null
  return {
    id: row.id,
    outingId: row.outingId,
    name: row.name,
    whatsapp: row.whatsapp,
    moto: row.moto,
  }
}

function fail(
  status: number,
  body: Record<string, unknown>,
): Result<never, AppError> {
  const detail = typeof body.detail === 'string' ? body.detail : 'No se pudo completar.'
  if (status === 404) return err(appError('NOT_FOUND', detail))
  if (status === 409) return err(appError('CONFLICT', detail))
  if (status === 400) return err(appError('VALIDATION', detail))
  if (status === 403) return err(appError('VALIDATION', detail))
  return err(appError('INFRASTRUCTURE', detail))
}
