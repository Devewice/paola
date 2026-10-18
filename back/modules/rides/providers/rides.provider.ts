import { randomUUID } from 'node:crypto'
import type { DbClient } from '../../../db/knex.js'
import { getDb, rowsOf } from '../../../db/knex.js'
import {
  RIDES_CONFIRM_FIRM,
  RIDES_CONFIRM_PENDING,
  RIDES_DEFAULT_STATUS,
  RIDES_MOTO_LABEL_MAX,
  RIDES_TABLES,
  type RideConfirmation,
} from '../constants/rides.constants.js'
import type { CreateOutingDto, CrewRiderDto } from '../dtos/rides.dto.js'
import type { OperatorTicket, Outing, OutingStatus, Ticket } from '../interfaces/rides.interface.js'
import { toOperatorTicket, toOuting } from '../schemas/rides.schema.js'

const OUTING_GROUP = `s.id, s.title, s.date, s.kind, s.meeting_point, s.route_text, s.capacity,
         s.what_to_bring, s.paid, s.status`

/** Cada cupo ocupa uno; con parrillero, dos. */
const SEATS_OF = (alias: string) =>
  `CASE WHEN ${alias}.passenger_name IS NOT NULL AND ${alias}.passenger_name <> '' THEN 2 ELSE 1 END`

async function outingSelect(extraWhere = '', params: readonly string[] = [], order = false): Promise<Outing[]> {
  const hasRoutes = await getDb().schema.hasTable(RIDES_TABLES.OUTING_ROUTES)
  const mapSelect = hasRoutes ? ', r.map_href' : ''
  const mapJoin = hasRoutes ? `LEFT JOIN ${RIDES_TABLES.OUTING_ROUTES} r ON r.outing_id = s.id` : ''
  const mapGroup = hasRoutes ? ', r.map_href' : ''
  const orderSql = order ? ' ORDER BY s.date ASC' : ''
  const raw = await getDb().raw(
    `SELECT s.id, s.title, s.date, s.kind, s.meeting_point, s.route_text, s.capacity,
            s.what_to_bring, s.paid, s.status,
            COALESCE(SUM(CASE WHEN c.id IS NULL THEN 0 ELSE ${SEATS_OF('c')} END), 0) AS taken${mapSelect}
     FROM ${RIDES_TABLES.OUTINGS} s
     LEFT JOIN ${RIDES_TABLES.TICKETS} c ON c.outing_id = s.id
     ${mapJoin}
     ${extraWhere}
     GROUP BY ${OUTING_GROUP}${mapGroup}${orderSql}`,
    [...params],
  )
  return rowsOf(raw).map(toOuting)
}

export async function findOutings(): Promise<Outing[]> {
  return outingSelect('', [], true)
}

export async function findOutingById(id: string): Promise<Outing | null> {
  const rows = await outingSelect('WHERE s.id = ?', [id])
  return rows[0] ?? null
}

export async function findTickets(): Promise<OperatorTicket[]> {
  const t = RIDES_TABLES.TICKETS
  const u = RIDES_TABLES.USERS
  const rows = (await getDb()(t)
    .leftJoin(u, `${u}.id`, `${t}.user_id`)
    .select(
      `${t}.id`,
      `${t}.outing_id`,
      `${t}.name`,
      `${t}.whatsapp`,
      `${t}.moto`,
      `${t}.user_id`,
      `${t}.passenger_name`,
      `${t}.level`,
      `${t}.docs_ok`,
      `${t}.rules_ok`,
      `${t}.confirmation`,
      `${u}.emergency_name`,
      `${u}.emergency_phone`,
      `${u}.blood_type`,
      `${u}.medical_notes`,
    )
    .orderBy(`${t}.created_at`, 'asc')) as Record<string, unknown>[]
  return rows.map(toOperatorTicket)
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
  if (await getDb().schema.hasTable(RIDES_TABLES.OUTING_ROUTES)) {
    await getDb()(RIDES_TABLES.OUTING_ROUTES).insert({
      id: randomUUID(),
      outing_id: id,
      preview_text: draft.routeText || null,
      map_href: null,
    })
  }
}

export async function updateOuting(id: string, draft: CreateOutingDto, status: OutingStatus): Promise<void> {
  await getDb()(RIDES_TABLES.OUTINGS).where({ id }).update({
    title: draft.title,
    date: draft.date,
    kind: draft.kind,
    meeting_point: draft.meetingPoint,
    route_text: draft.routeText,
    capacity: draft.capacity,
    what_to_bring: draft.whatToBring,
    paid: draft.paid,
    status,
  })
  if (await getDb().schema.hasTable(RIDES_TABLES.OUTING_ROUTES)) {
    await getDb()(RIDES_TABLES.OUTING_ROUTES)
      .where({ outing_id: id })
      .update({ preview_text: draft.routeText || null })
  }
}

export async function outingHasMemory(id: string): Promise<boolean> {
  if (!(await getDb().schema.hasTable(RIDES_TABLES.MEMORIES))) return false
  return Boolean(await getDb()(RIDES_TABLES.MEMORIES).select('id').where({ outing_id: id }).first())
}

/** Los cupos y la ruta se van con la salida; chats y encuestas los resuelven sus llaves. */
export async function deleteOuting(id: string): Promise<void> {
  const hasRoutes = await getDb().schema.hasTable(RIDES_TABLES.OUTING_ROUTES)
  await getDb().transaction(async (trx) => {
    await trx(RIDES_TABLES.TICKETS).where({ outing_id: id }).delete()
    if (hasRoutes) await trx(RIDES_TABLES.OUTING_ROUTES).where({ outing_id: id }).delete()
    await trx(RIDES_TABLES.OUTINGS).where({ id }).delete()
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

/** Puestos ocupados: el parrillero cuenta como uno más. */
export async function countTickets(db: DbClient, outingId: string): Promise<number> {
  const raw = await db.raw(
    `SELECT COALESCE(SUM(${SEATS_OF('t')}), 0) AS taken FROM ${RIDES_TABLES.TICKETS} t WHERE t.outing_id = ?`,
    [outingId],
  )
  return Number(rowsOf(raw)[0]?.taken ?? 0)
}

export async function insertTicket(db: DbClient, ticket: Ticket): Promise<void> {
  await db(RIDES_TABLES.TICKETS).insert({
    id: ticket.id,
    outing_id: ticket.outingId,
    name: ticket.name,
    whatsapp: ticket.whatsapp,
    moto: ticket.moto,
    user_id: ticket.userId ?? null,
    passenger_name: ticket.passengerName ?? null,
    level: ticket.level,
    docs_ok: ticket.docsOk,
    rules_ok: ticket.rulesOk,
    confirmation: ticket.confirmation,
  })
}

export async function findUserTicket(
  db: DbClient,
  outingId: string,
  userId: string,
): Promise<{ id: string; confirmation: RideConfirmation } | null> {
  const row = await db(RIDES_TABLES.TICKETS)
    .select('id', 'confirmation')
    .where({ outing_id: outingId, user_id: userId })
    .first()
  if (!row) return null
  return {
    id: String(row.id),
    confirmation: row.confirmation === RIDES_CONFIRM_FIRM ? RIDES_CONFIRM_FIRM : RIDES_CONFIRM_PENDING,
  }
}

export async function confirmTicket(id: string): Promise<void> {
  await getDb()(RIDES_TABLES.TICKETS).where({ id }).update({ confirmation: RIDES_CONFIRM_FIRM, confirmed_at: getDb().fn.now() })
}

export async function deleteTicket(db: DbClient, id: string): Promise<void> {
  await db(RIDES_TABLES.TICKETS).where({ id }).delete()
}

export async function userHasEmergency(userId: string): Promise<boolean> {
  const row = await getDb()(RIDES_TABLES.USERS).select('emergency_name', 'emergency_phone').where({ id: userId }).first()
  return Boolean(row?.emergency_name && row?.emergency_phone)
}

export async function saveUserEmergency(userId: string, emergency: { name: string; phone: string }): Promise<void> {
  await getDb()(RIDES_TABLES.USERS)
    .where({ id: userId })
    .update({ emergency_name: emergency.name, emergency_phone: emergency.phone })
}

/** Motos del garaje como texto para el cupo; la principal primero. */
export async function findUserMotoLabels(userId: string): Promise<string[]> {
  const rows = (await getDb()(RIDES_TABLES.MOTORCYCLES)
    .select('brand', 'model', 'cc')
    .where({ user_id: userId })
    .orderBy([
      { column: 'is_primary', order: 'desc' },
      { column: 'created_at', order: 'asc' },
    ])) as Record<string, unknown>[]
  return rows.map((row) => {
    const model = String(row.model ?? '')
    const cc = row.cc ? String(row.cc) : ''
    const label = [String(row.brand ?? ''), model, cc && !model.includes(cc) ? `${cc}cc` : '']
      .filter(Boolean)
      .join(' ')
    return label.slice(0, RIDES_MOTO_LABEL_MAX)
  })
}

/** Quién va: alias de la cuenta si la hay; si no, solo el primer nombre del cupo. */
export async function findCrew(outingId: string): Promise<CrewRiderDto[]> {
  const rows = (await getDb()(RIDES_TABLES.TICKETS)
    .leftJoin(RIDES_TABLES.USERS, `${RIDES_TABLES.USERS}.id`, `${RIDES_TABLES.TICKETS}.user_id`)
    .select(
      `${RIDES_TABLES.TICKETS}.name`,
      `${RIDES_TABLES.TICKETS}.moto`,
      `${RIDES_TABLES.USERS}.alias`,
      `${RIDES_TABLES.USERS}.avatar_src`,
    )
    .where(`${RIDES_TABLES.TICKETS}.outing_id`, outingId)
    .orderBy(`${RIDES_TABLES.TICKETS}.created_at`, 'asc')) as Record<string, unknown>[]
  return rows.map((row) => ({
    alias: row.alias ? String(row.alias) : String(row.name ?? '').trim().split(/\s+/)[0] ?? '',
    moto: String(row.moto ?? ''),
    avatarSrc: row.avatar_src ? String(row.avatar_src) : undefined,
  }))
}

export async function updateOutingStatusOn(
  db: DbClient,
  id: string,
  status: OutingStatus,
): Promise<void> {
  await db(RIDES_TABLES.OUTINGS).where({ id }).update({ status })
}
