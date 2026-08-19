import { randomUUID } from 'node:crypto'
import { getDb } from '../../../db/knex.js'
import { HTTP_STATUS } from '../../../http/constants.js'
import { fail } from '../../../http/fail.js'
import type { Fail } from '../../../http/types.js'
import {
  RIDES_MESSAGES,
  RIDES_STATUS_CLOSED,
  RIDES_STATUS_DONE,
  RIDES_STATUS_FULL,
  RIDES_STATUS_OPEN,
} from '../constants/rides.constants.js'
import type { Outing, OperatorBoardOuting, Ticket } from '../interfaces/rides.interface.js'
import {
  countTickets,
  findOutingById,
  findOutings,
  findTickets,
  insertOuting,
  insertTicket,
  lockOutingRow,
  updateOutingStatus,
  updateOutingStatusOn,
} from '../providers/rides.provider.js'
import {
  parseClaimSpot,
  parseCreateOuting,
  parseSetOutingStatus,
} from '../schemas/rides.schema.js'

export async function listOutings(): Promise<Outing[]> {
  return findOutings()
}

export async function listOperatorBoard(): Promise<OperatorBoardOuting[]> {
  const outings = await findOutings()
  const tickets = await findTickets()
  const byOuting = new Map<string, Ticket[]>()
  for (const ticket of tickets) {
    const list = byOuting.get(ticket.outingId) ?? []
    list.push(ticket)
    byOuting.set(ticket.outingId, list)
  }
  return outings.map((outing) => ({
    ...outing,
    tickets: byOuting.get(outing.id) ?? [],
  }))
}

export async function claimSpot(
  outingId: string,
  draft: Record<string, unknown>,
  userId?: string,
): Promise<Fail | { ok: true; ticket: Ticket; outing: Outing | null }> {
  const parsed = parseClaimSpot(draft)
  if (!parsed.ok) return parsed

  type TrxResult = { fail: Fail } | { ticket: Ticket }

  const result = await getDb().transaction(async (trx): Promise<TrxResult> => {
    const row = await lockOutingRow(trx, outingId)
    if (!row) {
      return { fail: fail(HTTP_STATUS.NOT_FOUND, RIDES_MESSAGES.NOT_FOUND) }
    }

    if (row.status === RIDES_STATUS_DONE) {
      return { fail: fail(HTTP_STATUS.CONFLICT, RIDES_MESSAGES.ALREADY_RODE) }
    }
    if (row.status === RIDES_STATUS_CLOSED) {
      return { fail: fail(HTTP_STATUS.CONFLICT, RIDES_MESSAGES.CLOSED) }
    }
    if (row.status !== RIDES_STATUS_OPEN) {
      return { fail: fail(HTTP_STATUS.CONFLICT, RIDES_MESSAGES.FULL) }
    }

    const taken = await countTickets(trx, outingId)
    const capacity = Number(row.capacity)
    if (taken >= capacity) {
      await updateOutingStatusOn(trx, outingId, RIDES_STATUS_FULL)
      return { fail: fail(HTTP_STATUS.CONFLICT, RIDES_MESSAGES.FULL) }
    }

    const ticket: Ticket = {
      id: randomUUID(),
      outingId,
      name: parsed.value.name,
      whatsapp: parsed.value.whatsapp,
      moto: parsed.value.moto,
      userId,
    }
    await insertTicket(trx, ticket)

    if (taken + 1 >= capacity) {
      await updateOutingStatusOn(trx, outingId, RIDES_STATUS_FULL)
    }

    return { ticket }
  })

  if ('fail' in result) return result.fail
  const outing = await findOutingById(outingId)
  return { ok: true, ticket: result.ticket, outing }
}

export async function createOuting(
  draft: Record<string, unknown>,
): Promise<Fail | { ok: true; outing: Outing | null }> {
  const parsed = parseCreateOuting(draft)
  if (!parsed.ok) return parsed

  const id = randomUUID()
  await insertOuting(id, parsed.value)
  const outing = await findOutingById(id)
  return { ok: true, outing }
}

export async function setOutingStatus(
  outingId: string,
  status: unknown,
): Promise<Fail | { ok: true; outing: Outing | null }> {
  const parsed = parseSetOutingStatus(status)
  if (!parsed.ok) return parsed

  const current = await findOutingById(outingId)
  if (!current) {
    return fail(HTTP_STATUS.NOT_FOUND, RIDES_MESSAGES.NOT_FOUND)
  }
  if (current.status === RIDES_STATUS_DONE && parsed.value.status !== RIDES_STATUS_DONE) {
    return fail(HTTP_STATUS.CONFLICT, RIDES_MESSAGES.ALREADY_DONE)
  }

  await updateOutingStatus(outingId, parsed.value.status)
  const outing = await findOutingById(outingId)
  return { ok: true, outing }
}
