import { appError, type AppError } from '@core/errors/AppError.ts'
import { requirePrivacyNotice } from '@core/requirePrivacyNotice.ts'
import { err, ok, type Result } from '@core/result.ts'
import { RIDES_MESSAGES } from '@modules/rides/constants/copy.ts'
import { buildOutingNotice } from '@modules/rides/application/buildOutingNotice.ts'
import type { OperatorOutingStatus, OutingDraft } from '@modules/rides/domain/entities/Outing.ts'
import type { Ticket, TicketDraft } from '@modules/rides/domain/entities/Ticket.ts'
import type { OperatorBoardOuting, RidesApiPort } from '@modules/rides/domain/ports/RidesApiPort.ts'
import type { MemoryDraft } from '@modules/rides/domain/entities/Memory.ts'
import { parseMemory } from '@modules/rides/infrastructure/parseMemory.ts'
import { parseOuting } from '@modules/rides/infrastructure/parseOuting.ts'
import {
  API,
  API_FAIL_FALLBACK,
  HTTP_STATUS,
  JSON_HEADERS,
  OPERADOR_CLAVE_HEADER,
  SESSION_HEADER,
  apiOperarOutingStatus,
  apiOutingTickets,
} from '@shared/http/constants.ts'

type Contact = {
  readonly email: string
  readonly whatsappHref: string
  readonly getSessionId?: () => string
}

export class HttpRidesApi implements RidesApiPort {
  private readonly contact: Contact

  constructor(contact: Contact) {
    this.contact = contact
  }

  async claim(outingId: string, draft: TicketDraft) {
    const privacy = requirePrivacyNotice(draft.privacyAccepted, RIDES_MESSAGES.PRIVACY_REQUIRED)
    if (!privacy.ok) return privacy

    const headers: Record<string, string> = { ...JSON_HEADERS }
    const session = this.contact.getSessionId?.() ?? ''
    if (session) headers[SESSION_HEADER] = session
    const response = await fetch(apiOutingTickets(outingId), {
      method: 'POST',
      headers,
      body: JSON.stringify(draft),
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)

    const outing = parseOuting(body.outing)
    const ticket = parseTicket(body.ticket)
    if (!outing || !ticket) {
      return err(appError('INFRASTRUCTURE', RIDES_MESSAGES.CUPO_PARSE_FAIL))
    }
    return ok({ ticket, outing, notice: buildOutingNotice(outing, ticket, this.contact) })
  }

  async setStatus(outingId: string, status: OperatorOutingStatus, clave: string) {
    const response = await fetch(apiOperarOutingStatus(outingId), {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ clave, status }),
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    const outing = parseOuting(body.outing)
    if (!outing) return err(appError('INFRASTRUCTURE', RIDES_MESSAGES.SALIDA_PARSE_FAIL))
    return ok(outing)
  }

  async publish(draft: OutingDraft, clave: string) {
    const response = await fetch(API.OPERAR_OUTINGS, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ ...draft, clave }),
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    const outing = parseOuting(body.outing)
    if (!outing) {
      return err(appError('INFRASTRUCTURE', RIDES_MESSAGES.SALIDA_PARSE_FAIL))
    }
    return ok(outing)
  }

  async publishMemory(draft: MemoryDraft, clave: string) {
    const response = await fetch(API.OPERAR_MEMORIES, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ ...draft, clave }),
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    const memory = parseMemory(body.memory)
    if (!memory) {
      return err(appError('INFRASTRUCTURE', RIDES_MESSAGES.MEMORIA_PARSE_FAIL))
    }
    return ok(memory)
  }

  async listBoard(clave: string) {
    const response = await fetch(API.OPERAR_OUTINGS, {
      headers: { [OPERADOR_CLAVE_HEADER]: clave },
    })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    if (!Array.isArray(body.outings)) {
      return err(appError('INFRASTRUCTURE', RIDES_MESSAGES.BOARD_PARSE_FAIL))
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
  const detail = typeof body.detail === 'string' ? body.detail : API_FAIL_FALLBACK
  if (status === HTTP_STATUS.NOT_FOUND) return err(appError('NOT_FOUND', detail))
  if (status === HTTP_STATUS.CONFLICT) return err(appError('CONFLICT', detail))
  if (status === HTTP_STATUS.BAD_REQUEST) return err(appError('VALIDATION', detail))
  if (status === HTTP_STATUS.FORBIDDEN) return err(appError('VALIDATION', detail))
  return err(appError('INFRASTRUCTURE', detail))
}
