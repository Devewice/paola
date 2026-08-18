import { randomUUID } from 'node:crypto'
import { getDb, rowsOf } from '../db/knex.js'

const KINDS = new Set(['rodada', 'actividad'])
const STATUSES = new Set(['abierto', 'lleno', 'cerrado', 'realizado'])

export type OutingKind = 'rodada' | 'actividad'
export type OutingStatus = 'abierto' | 'lleno' | 'cerrado' | 'realizado'

export type Outing = {
  id: string
  title: string
  date: string
  kind: OutingKind
  meetingPoint: string
  routeText: string
  capacity: number
  taken: number
  whatToBring: string
  paid: boolean
  status: OutingStatus
}

export type Ticket = {
  id: string
  outingId: string
  name: string
  whatsapp: string
  moto: string
}

type Fail = { ok: false; status: number; detail: string }

function formatDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'string') return value.slice(0, 10)
  return String(value)
}

export function toOuting(row: Record<string, unknown>): Outing {
  const capacity = Number(row.capacity)
  const taken = Number(row.taken ?? 0)
  const rawStatus = String(row.status)
  let status: OutingStatus = STATUSES.has(rawStatus) ? (rawStatus as OutingStatus) : 'abierto'
  if (status === 'abierto' && taken >= capacity) status = 'lleno'
  const rawKind = String(row.kind)
  return {
    id: String(row.id),
    title: String(row.title),
    date: formatDate(row.date),
    kind: KINDS.has(rawKind) ? (rawKind as OutingKind) : 'rodada',
    meetingPoint: String(row.meeting_point),
    routeText: String(row.route_text ?? ''),
    capacity,
    taken,
    whatToBring: String(row.what_to_bring ?? ''),
    paid: Boolean(row.paid),
    status,
  }
}

export function toTicket(row: Record<string, unknown>): Ticket {
  return {
    id: String(row.id),
    outingId: String(row.salida_id),
    name: String(row.name),
    whatsapp: String(row.whatsapp),
    moto: String(row.moto ?? ''),
  }
}

const SALIDA_SELECT = `
  SELECT s.id, s.title, s.date, s.kind, s.meeting_point, s.route_text, s.capacity,
         s.what_to_bring, s.paid, s.status, COUNT(c.id) AS taken
  FROM salidas s
  LEFT JOIN cupos c ON c.salida_id = s.id
`

export async function listSalidas(): Promise<Outing[]> {
  const raw = await getDb().raw(
    `${SALIDA_SELECT}
     GROUP BY s.id, s.title, s.date, s.kind, s.meeting_point, s.route_text, s.capacity,
              s.what_to_bring, s.paid, s.status
     ORDER BY s.date ASC`,
  )
  return rowsOf(raw).map(toOuting)
}

export async function getSalida(id: string): Promise<Outing | null> {
  const raw = await getDb().raw(
    `${SALIDA_SELECT}
     WHERE s.id = ?
     GROUP BY s.id, s.title, s.date, s.kind, s.meeting_point, s.route_text, s.capacity,
              s.what_to_bring, s.paid, s.status`,
    [id],
  )
  const row = rowsOf(raw)[0]
  return row ? toOuting(row) : null
}

export async function listOperatorBoard() {
  const outings = await listSalidas()
  const rows = await getDb()('cupos')
    .select('id', 'salida_id', 'name', 'whatsapp', 'moto')
    .orderBy('created_at', 'asc')
  const bySalida = new Map<string, Ticket[]>()
  for (const row of rows) {
    const ticket = toTicket(row as Record<string, unknown>)
    const list = bySalida.get(ticket.outingId) ?? []
    list.push(ticket)
    bySalida.set(ticket.outingId, list)
  }
  return outings.map((outing) => ({
    ...outing,
    tickets: bySalida.get(outing.id) ?? [],
  }))
}

export async function claimCupo(
  outingId: string,
  draft: Record<string, unknown>,
): Promise<Fail | { ok: true; ticket: Ticket; outing: Outing | null }> {
  const name = String(draft.name ?? '').trim()
  const whatsapp = String(draft.whatsapp ?? '').replace(/\D/g, '')
  const moto = String(draft.moto ?? '').trim()

  if (name.length < 2) {
    return { ok: false, status: 400, detail: 'El cupo necesita un nombre.' }
  }
  if (whatsapp.length < 10 || whatsapp.length > 15) {
    return { ok: false, status: 400, detail: 'El cupo necesita un WhatsApp (mínimo 10 dígitos).' }
  }

  type TrxResult = { fail: Fail } | { ticket: Ticket }

  const result = await getDb().transaction(async (trx): Promise<TrxResult> => {
    const locked = await trx.raw('SELECT * FROM salidas WHERE id = ? FOR UPDATE', [outingId])
    const row = rowsOf(locked)[0]
    if (!row) {
      return { fail: { ok: false, status: 404, detail: 'Esa salida no está.' } }
    }

    if (row.status === 'realizado') {
      return { fail: { ok: false, status: 409, detail: 'Esa salida ya se rodó. Ya no hay cupos.' } }
    }
    if (row.status === 'cerrado') {
      return { fail: { ok: false, status: 409, detail: 'La inscripción está cerrada.' } }
    }
    if (row.status !== 'abierto') {
      return { fail: { ok: false, status: 409, detail: 'Ese cupo ya está lleno.' } }
    }

    const countRaw = await trx('cupos').where({ salida_id: outingId }).count({ taken: 'id' })
    const taken = Number((countRaw[0] as { taken?: number | string } | undefined)?.taken ?? 0)
    const capacity = Number(row.capacity)
    if (taken >= capacity) {
      await trx('salidas').where({ id: outingId }).update({ status: 'lleno' })
      return { fail: { ok: false, status: 409, detail: 'Ese cupo ya está lleno.' } }
    }

    const created: Ticket = {
      id: randomUUID(),
      outingId,
      name,
      whatsapp,
      moto,
    }
    await trx('cupos').insert({
      id: created.id,
      salida_id: outingId,
      name,
      whatsapp,
      moto,
    })

    if (taken + 1 >= capacity) {
      await trx('salidas').where({ id: outingId }).update({ status: 'lleno' })
    }

    return { ticket: created }
  })

  if ('fail' in result) return result.fail
  const outing = await getSalida(outingId)
  return { ok: true, ticket: result.ticket, outing }
}

export async function createSalida(
  draft: Record<string, unknown>,
): Promise<Fail | { ok: true; outing: Outing | null }> {
  const title = String(draft.title ?? '').trim()
  const date = String(draft.date ?? '').trim()
  const kind = String(draft.kind ?? '').trim()
  const meetingPoint = String(draft.meetingPoint ?? '').trim()
  const routeText = String(draft.routeText ?? '').trim()
  const whatToBring = String(draft.whatToBring ?? '').trim()
  const capacity = Number(draft.capacity)
  const paid = draft.paid === true

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00`))) {
    return { ok: false, status: 400, detail: 'No se publica una salida sin fecha válida.' }
  }
  if (!Number.isInteger(capacity) || capacity < 1) {
    return { ok: false, status: 400, detail: 'No se publica una salida sin cupo máximo (entero ≥ 1).' }
  }
  if (!title) {
    return { ok: false, status: 400, detail: 'No se publica una salida sin título.' }
  }
  if (!KINDS.has(kind)) {
    return { ok: false, status: 400, detail: 'La salida es rodada o actividad.' }
  }
  if (!meetingPoint) {
    return { ok: false, status: 400, detail: 'No se publica una salida sin punto de encuentro.' }
  }

  const id = randomUUID()
  await getDb()('salidas').insert({
    id,
    title,
    date,
    kind,
    meeting_point: meetingPoint,
    route_text: routeText,
    capacity,
    what_to_bring: whatToBring,
    paid,
    status: 'abierto',
  })
  const outing = await getSalida(id)
  return { ok: true, outing }
}

export async function setSalidaStatus(
  outingId: string,
  status: unknown,
): Promise<Fail | { ok: true; outing: Outing | null }> {
  if (status !== 'cerrado' && status !== 'realizado') {
    return { ok: false, status: 400, detail: 'Solo se marca cerrado o realizado.' }
  }

  const current = await getSalida(outingId)
  if (!current) {
    return { ok: false, status: 404, detail: 'Esa salida no está.' }
  }
  if (current.status === 'realizado' && status !== 'realizado') {
    return { ok: false, status: 409, detail: 'Ya se marcó realizada. No se reabre desde aquí.' }
  }

  await getDb()('salidas').where({ id: outingId }).update({ status })
  const outing = await getSalida(outingId)
  return { ok: true, outing }
}
