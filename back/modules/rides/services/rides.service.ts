import { randomUUID } from 'node:crypto'
import { getDb } from '../../../db/knex.js'
import { HTTP_STATUS } from '../../../http/constants.js'
import { fail } from '../../../http/fail.js'
import type { Fail } from '../../../http/types.js'
import {
  RIDES_CONFIRM_PENDING,
  RIDES_MESSAGES,
  RIDES_STATUS_CLOSED,
  RIDES_STATUS_DONE,
  RIDES_STATUS_FULL,
  RIDES_STATUS_OPEN,
} from '../constants/rides.constants.js'
import { routeBetween, type RoadRoute } from '../../maps/index.js'
import type { SessionUser } from '../../social/interfaces/social.interface.js'
import type { CreateOutingDto, OutingCrewDto } from '../dtos/rides.dto.js'
import type { OperatorBoardOuting, OperatorTicket, Outing, Ticket } from '../interfaces/rides.interface.js'
import {
  confirmTicket,
  countTickets,
  deleteOuting,
  deleteTicket,
  findCrew,
  findOutingById,
  findOutings,
  findTickets,
  findUserMotoLabels,
  findUserTicket,
  insertOuting,
  insertTicket,
  lockOutingRow,
  outingHasMemory,
  saveOutingRoute,
  saveUserEmergency,
  updateOuting,
  updateOutingStatus,
  updateOutingStatusOn,
  userHasEmergency,
} from '../providers/rides.provider.js'
import {
  isConfirmOpen,
  parseClaimSpot,
  parseCreateOuting,
  parseSetOutingStatus,
  todayIso,
} from '../schemas/rides.schema.js'

export async function listOutings(): Promise<Outing[]> {
  return findOutings()
}

export async function listOperatorBoard(): Promise<OperatorBoardOuting[]> {
  const outings = await findOutings()
  const tickets = await findTickets()
  const byOuting = new Map<string, OperatorTicket[]>()
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
  user: SessionUser | null,
): Promise<Fail | { ok: true; ticket: Ticket; outing: Outing | null }> {
  if (!user) return fail(HTTP_STATUS.FORBIDDEN, RIDES_MESSAGES.ACCOUNT_REQUIRED)
  const parsed = parseClaimSpot(draft, { ...user, hasEmergency: await userHasEmergency(user.id) })
  if (!parsed.ok) return parsed
  const seats = parsed.value.passengerName ? 2 : 1

  type TrxResult = { fail: Fail } | { ticket: Ticket }

  const result = await getDb().transaction(async (trx): Promise<TrxResult> => {
    const row = await lockOutingRow(trx, outingId)
    if (!row) {
      return { fail: fail(HTTP_STATUS.NOT_FOUND, RIDES_MESSAGES.NOT_FOUND) }
    }
    if (await findUserTicket(trx, outingId, user.id)) {
      return { fail: fail(HTTP_STATUS.CONFLICT, RIDES_MESSAGES.ALREADY_IN) }
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
    if (taken + seats > capacity) {
      return { fail: fail(HTTP_STATUS.CONFLICT, RIDES_MESSAGES.PASSENGER_NO_ROOM) }
    }

    const ticket: Ticket = {
      id: randomUUID(),
      outingId,
      name: parsed.value.name,
      whatsapp: parsed.value.whatsapp,
      moto: parsed.value.moto,
      userId: user.id,
      passengerName: parsed.value.passengerName,
      level: parsed.value.level,
      docsOk: true,
      rulesOk: true,
      confirmation: RIDES_CONFIRM_PENDING,
    }
    await insertTicket(trx, ticket)

    if (taken + seats >= capacity) {
      await updateOutingStatusOn(trx, outingId, RIDES_STATUS_FULL)
    }

    return { ticket }
  })

  if ('fail' in result) return result.fail
  if (parsed.value.emergency) await saveUserEmergency(user.id, parsed.value.emergency)
  const outing = await findOutingById(outingId)
  return { ok: true, ticket: result.ticket, outing }
}

export async function confirmSpot(outingId: string, user: SessionUser | null): Promise<Fail | { ok: true }> {
  if (!user) return fail(HTTP_STATUS.FORBIDDEN, RIDES_MESSAGES.ACCOUNT_REQUIRED)
  const outing = await findOutingById(outingId)
  if (!outing) return fail(HTTP_STATUS.NOT_FOUND, RIDES_MESSAGES.NOT_FOUND)
  const ticket = await findUserTicket(getDb(), outingId, user.id)
  if (!ticket) return fail(HTTP_STATUS.NOT_FOUND, RIDES_MESSAGES.NOT_INSCRIBED)
  if (outing.status === RIDES_STATUS_DONE || outing.date < todayIso()) {
    return fail(HTTP_STATUS.CONFLICT, RIDES_MESSAGES.RIDE_OVER)
  }
  if (!isConfirmOpen(outing.date, outing.status)) {
    return fail(HTTP_STATUS.CONFLICT, RIDES_MESSAGES.CONFIRM_TOO_EARLY)
  }
  await confirmTicket(ticket.id)
  return { ok: true }
}

/** Soltar el cupo lo deja libre para otro; si estaba lleno, se reabre. */
export async function releaseSpot(outingId: string, user: SessionUser | null): Promise<Fail | { ok: true }> {
  if (!user) return fail(HTTP_STATUS.FORBIDDEN, RIDES_MESSAGES.ACCOUNT_REQUIRED)
  const result = await getDb().transaction(async (trx): Promise<Fail | { ok: true }> => {
    const row = await lockOutingRow(trx, outingId)
    if (!row) return fail(HTTP_STATUS.NOT_FOUND, RIDES_MESSAGES.NOT_FOUND)
    if (row.status === RIDES_STATUS_DONE) return fail(HTTP_STATUS.CONFLICT, RIDES_MESSAGES.RIDE_OVER)
    const ticket = await findUserTicket(trx, outingId, user.id)
    if (!ticket) return fail(HTTP_STATUS.NOT_FOUND, RIDES_MESSAGES.NOT_INSCRIBED)
    await deleteTicket(trx, ticket.id)
    if (row.status === RIDES_STATUS_FULL && (await countTickets(trx, outingId)) < Number(row.capacity)) {
      await updateOutingStatusOn(trx, outingId, RIDES_STATUS_OPEN)
    }
    return { ok: true }
  })
  return result
}

/** Lo que ve cada quien en la página de la rodada; la lista de quién va es solo para inscritos. */
export async function readCrew(outingId: string, user: SessionUser | null): Promise<Fail | { ok: true; crew: OutingCrewDto }> {
  const outing = await findOutingById(outingId)
  if (!outing) return fail(HTTP_STATUS.NOT_FOUND, RIDES_MESSAGES.NOT_FOUND)
  if (!user) {
    return {
      ok: true,
      crew: { signedIn: false, inscribed: false, needsEmergency: true, confirmOpen: false, motorcycles: [], riders: [] },
    }
  }
  const ticket = await findUserTicket(getDb(), outingId, user.id)
  const motorcycles = await findUserMotoLabels(user.id)
  return {
    ok: true,
    crew: {
      signedIn: true,
      alias: user.alias,
      inscribed: Boolean(ticket),
      needsEmergency: !(await userHasEmergency(user.id)),
      confirmation: ticket?.confirmation,
      confirmOpen: Boolean(ticket) && isConfirmOpen(outing.date, outing.status),
      moto: motorcycles[0] ?? user.moto,
      motorcycles,
      ticketId: ticket?.id,
      riders: ticket ? await findCrew(outingId) : [],
    },
  }
}

async function roadFor(draft: CreateOutingDto): Promise<RoadRoute | null> {
  const { start, end } = draft.points ?? {}
  return start && end ? routeBetween(start, end) : null
}

export async function createOuting(
  draft: Record<string, unknown>,
): Promise<Fail | { ok: true; outing: Outing | null }> {
  const parsed = parseCreateOuting(draft)
  if (!parsed.ok) return parsed

  const id = randomUUID()
  await insertOuting(id, parsed.value)
  await saveOutingRoute(id, parsed.value, await roadFor(parsed.value))
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

  const reopenFull = parsed.value.status === RIDES_STATUS_OPEN && current.taken >= current.capacity
  await updateOutingStatus(outingId, reopenFull ? RIDES_STATUS_FULL : parsed.value.status)
  const outing = await findOutingById(outingId)
  return { ok: true, outing }
}

/** Editar no cambia cerrado ni realizado; abierto y lleno se recalculan con el cupo nuevo. */
export async function editOuting(
  outingId: string,
  draft: Record<string, unknown>,
): Promise<Fail | { ok: true; outing: Outing | null }> {
  const parsed = parseCreateOuting(draft)
  if (!parsed.ok) return parsed
  const current = await findOutingById(outingId)
  if (!current) return fail(HTTP_STATUS.NOT_FOUND, RIDES_MESSAGES.NOT_FOUND)
  if (parsed.value.capacity < current.taken) {
    return fail(HTTP_STATUS.CONFLICT, RIDES_MESSAGES.CAPACITY_BELOW_TAKEN(current.taken))
  }
  const keeps = current.status === RIDES_STATUS_CLOSED || current.status === RIDES_STATUS_DONE
  const status = keeps
    ? current.status
    : current.taken >= parsed.value.capacity
      ? RIDES_STATUS_FULL
      : RIDES_STATUS_OPEN
  await updateOuting(outingId, parsed.value, status)
  await saveOutingRoute(outingId, parsed.value, await roadFor(parsed.value))
  return { ok: true, outing: await findOutingById(outingId) }
}

export async function removeOuting(outingId: string): Promise<Fail | { ok: true }> {
  const current = await findOutingById(outingId)
  if (!current) return fail(HTTP_STATUS.NOT_FOUND, RIDES_MESSAGES.NOT_FOUND)
  if (await outingHasMemory(outingId)) return fail(HTTP_STATUS.CONFLICT, RIDES_MESSAGES.HAS_MEMORY)
  await deleteOuting(outingId)
  return { ok: true }
}
