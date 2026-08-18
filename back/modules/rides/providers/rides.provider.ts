import type { DbClient } from '../../../db/knex.js'
import { getDb, rowsOf } from '../../../db/knex.js'
import {
  RIDES_DEFAULT_STATUS,
  RIDES_TABLES,
} from '../constants/rides.constants.js'
import type { CreateOutingDto } from '../dtos/rides.dto.js'
import type { Outing, OutingStatus, Ticket } from '../interfaces/rides.interface.js'
import { toOuting, toTicket } from '../schemas/rides.schema.js'

const OUTING_SELECT = `
  SELECT s.id, s.title, s.date, s.kind, s.meeting_point, s.route_text, s.capacity,
         s.what_to_bring, s.paid, s.status, COUNT(c.id) AS taken
  FROM ${RIDES_TABLES.OUTINGS} s
  LEFT JOIN ${RIDES_TABLES.TICKETS} c ON c.outing_id = s.id
`

export async function findOutings(): Promise<Outing[]> {
  const raw = await getDb().raw(
    `${OUTING_SELECT}
     GROUP BY s.id, s.title, s.date, s.kind, s.meeting_point, s.route_text, s.capacity,
              s.what_to_bring, s.paid, s.status
     ORDER BY s.date ASC`,
  )
  return rowsOf(raw).map(toOuting)
}

export async function findOutingById(id: string): Promise<Outing | null> {
  const raw = await getDb().raw(
    `${OUTING_SELECT}
     WHERE s.id = ?
     GROUP BY s.id, s.title, s.date, s.kind, s.meeting_point, s.route_text, s.capacity,
              s.what_to_bring, s.paid, s.status`,
    [id],
  )
  const row = rowsOf(raw)[0]
  return row ? toOuting(row) : null
}

export async function findTickets(): Promise<Ticket[]> {
  const rows = await getDb()(RIDES_TABLES.TICKETS)
    .select('id', 'outing_id', 'name', 'whatsapp', 'moto')
    .orderBy('created_at', 'asc')
  return rows.map((row) => toTicket(row as Record<string, unknown>))
}

export async function insertOuting(id: string, draft: CreateOutingDto): Promise<void> {
  await getDb()(RIDES_TABLES.OUTINGS).insert({
    id,
    title: draft.title,
    date: draft.date,
    kind: draft.kind,
    meeting_point: draft.meetingPoint,
    route_text: draft.routeText,
    capacity: draft.capacity,
    what_to_bring: draft.whatToBring,
    paid: draft.paid,
    status: RIDES_DEFAULT_STATUS,
  })
}

export async function updateOutingStatus(id: string, status: OutingStatus): Promise<void> {
  await getDb()(RIDES_TABLES.OUTINGS).where({ id }).update({ status })
}

export async function lockOutingRow(
  db: DbClient,
  id: string,
): Promise<Record<string, unknown> | undefined> {
  const locked = await db.raw(`SELECT * FROM ${RIDES_TABLES.OUTINGS} WHERE id = ? FOR UPDATE`, [id])
  return rowsOf(locked)[0]
}

export async function countTickets(db: DbClient, outingId: string): Promise<number> {
  const countRaw = await db(RIDES_TABLES.TICKETS).where({ outing_id: outingId }).count({ taken: 'id' })
  return Number((countRaw[0] as { taken?: number | string } | undefined)?.taken ?? 0)
}

export async function insertTicket(db: DbClient, ticket: Ticket): Promise<void> {
  await db(RIDES_TABLES.TICKETS).insert({
    id: ticket.id,
    outing_id: ticket.outingId,
    name: ticket.name,
    whatsapp: ticket.whatsapp,
    moto: ticket.moto,
  })
}

export async function updateOutingStatusOn(
  db: DbClient,
  id: string,
  status: OutingStatus,
): Promise<void> {
  await db(RIDES_TABLES.OUTINGS).where({ id }).update({ status })
}
