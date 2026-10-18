import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import { RIDES_MESSAGES } from '@modules/rides/constants/copy.ts'
import { buildOutingNotice, buildSignupNotice } from '@modules/rides/application/buildOutingNotice.ts'
import type { OperatorOutingStatus, Outing, OutingDraft } from '@modules/rides/domain/entities/Outing.ts'
import type {
  CrewRider,
  OperatorTicket,
  OutingCrew,
  OutingNotice,
  SignupDraft,
  Ticket,
} from '@modules/rides/domain/entities/Ticket.ts'
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
  apiOutingConfirm,
  apiOutingCrew,
  apiOutingRelease,
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

  private sessionHeaders(): Record<string, string> {
    const headers: Record<string, string> = { ...JSON_HEADERS }
    const session = this.contact.getSessionId?.() ?? ''
    if (session) headers[SESSION_HEADER] = session
    return headers
  }

  async crew(outingId: string) {
    const response = await fetch(apiOutingCrew(outingId), { headers: this.sessionHeaders() })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    const crew = parseCrew(body.crew)
    if (!crew) return err(appError('INFRASTRUCTURE', RIDES_MESSAGES.CREW_PARSE_FAIL))
    return ok(crew)
  }

  async confirm(outingId: string) {
    return this.postSession(apiOutingConfirm(outingId))
  }

  async release(outingId: string) {
    return this.postSession(apiOutingRelease(outingId))
  }

  private async postSession(url: string): Promise<Result<true, AppError>> {
    const response = await fetch(url, { method: 'POST', headers: this.sessionHeaders(), body: '{}' })
    const body = await readBody(response)
    if (!response.ok) return fail(response.status, body)
    return ok(true)
  }

  notice(outing: Outing, alias: string): OutingNotice {
    return buildSignupNotice(outing, alias, this.contact)
  }

  async claim(outingId: string, draft: SignupDraft) {
    const response = await fetch(apiOutingTickets(outingId), {
      method: 'POST',
      headers: this.sessionHeaders(),
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
        ? rawTickets.map(parseOperatorTicket).filter((item): item is OperatorTicket => item !== null)
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
  if (typeof row.moto !== 'string') return null
  return {
    id: row.id,
    outingId: row.outingId,
    name: row.name,
    whatsapp: typeof row.whatsapp === 'string' ? row.whatsapp : '',
    moto: row.moto,
    passengerName: text(row.passengerName),
    level: text(row.level),
    docsOk: row.docsOk === true,
    rulesOk: row.rulesOk === true,
    confirmation: row.confirmation === 'firme' ? 'firme' : 'pendiente',
  }
}

function text(value: unknown): string | undefined {
  return typeof value === 'string' && value ? value : undefined
}

function parseOperatorTicket(raw: unknown): OperatorTicket | null {
  const ticket = parseTicket(raw)
  if (!ticket) return null
  const row = raw as Record<string, unknown>
  return {
    ...ticket,
    emergencyName: text(row.emergencyName),
    emergencyPhone: text(row.emergencyPhone),
    bloodType: text(row.bloodType),
    medicalNotes: text(row.medicalNotes),
  }
}

function parseCrew(raw: unknown): OutingCrew | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  if (typeof row.signedIn !== 'boolean' || typeof row.inscribed !== 'boolean') return null
  const riders: CrewRider[] = []
  if (Array.isArray(row.riders)) {
    for (const item of row.riders) {
      if (!item || typeof item !== 'object') continue
      const rider = item as Record<string, unknown>
      if (typeof rider.alias !== 'string' || !rider.alias) continue
      riders.push({
        alias: rider.alias,
        moto: typeof rider.moto === 'string' ? rider.moto : '',
        avatarSrc: typeof rider.avatarSrc === 'string' && rider.avatarSrc ? rider.avatarSrc : undefined,
      })
    }
  }
  return {
    signedIn: row.signedIn,
    alias: typeof row.alias === 'string' && row.alias ? row.alias : undefined,
    inscribed: row.inscribed,
    needsEmergency: row.needsEmergency !== false,
    confirmation: row.confirmation === 'firme' ? 'firme' : row.confirmation === 'pendiente' ? 'pendiente' : undefined,
    confirmOpen: row.confirmOpen === true,
    moto: typeof row.moto === 'string' && row.moto ? row.moto : undefined,
    motorcycles: Array.isArray(row.motorcycles)
      ? row.motorcycles.filter((item): item is string => typeof item === 'string' && Boolean(item))
      : [],
    riders,
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
