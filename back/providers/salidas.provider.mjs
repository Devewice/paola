import { getPool } from '../db/pool.mjs'

const KINDS = new Set(['rodada', 'actividad'])
const STATUSES = new Set(['abierto', 'lleno', 'cerrado', 'realizado'])

function formatDate(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'string') return value.slice(0, 10)
  return String(value)
}

export function toOuting(row) {
  const kind = KINDS.has(row.kind) ? row.kind : 'rodada'
  const status = STATUSES.has(row.status) ? row.status : 'abierto'
  return {
    id: String(row.id),
    title: String(row.title),
    date: formatDate(row.date),
    kind,
    meetingPoint: String(row.meeting_point),
    routeText: String(row.route_text ?? ''),
    capacity: Number(row.capacity),
    whatToBring: String(row.what_to_bring ?? ''),
    paid: Boolean(row.paid),
    status,
  }
}

export async function listSalidas() {
  const db = getPool()
  const [rows] = await db.query(
    `SELECT id, title, date, kind, meeting_point, route_text, capacity, what_to_bring, paid, status
     FROM salidas
     ORDER BY date ASC`,
  )
  return rows.map(toOuting)
}
