import { randomUUID } from 'node:crypto'
import { getPool } from '../db/pool.mjs'

const KINDS = new Set(['rodada', 'actividad'])
const STATUSES = new Set(['abierto', 'lleno', 'cerrado', 'realizado'])

function formatDate(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'string') return value.slice(0, 10)
  return String(value)
}

export function toOuting(row) {
  const capacity = Number(row.capacity)
  const taken = Number(row.taken ?? 0)
  let status = STATUSES.has(row.status) ? row.status : 'abierto'
  if (status === 'abierto' && taken >= capacity) status = 'lleno'
  return {
    id: String(row.id),
    title: String(row.title),
    date: formatDate(row.date),
    kind: KINDS.has(row.kind) ? row.kind : 'rodada',
    meetingPoint: String(row.meeting_point),
    routeText: String(row.route_text ?? ''),
    capacity,
    taken,
    whatToBring: String(row.what_to_bring ?? ''),
    paid: Boolean(row.paid),
    status,
  }
}

export function toTicket(row) {
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

export async function listSalidas() {
  const db = getPool()
  const [rows] = await db.query(
    `${SALIDA_SELECT}
     GROUP BY s.id, s.title, s.date, s.kind, s.meeting_point, s.route_text, s.capacity,
              s.what_to_bring, s.paid, s.status
     ORDER BY s.date ASC`,
  )
  return rows.map(toOuting)
}

export async function getSalida(id) {
  const db = getPool()
  const [rows] = await db.query(
    `${SALIDA_SELECT}
     WHERE s.id = ?
     GROUP BY s.id, s.title, s.date, s.kind, s.meeting_point, s.route_text, s.capacity,
              s.what_to_bring, s.paid, s.status`,
    [id],
  )
  return rows[0] ? toOuting(rows[0]) : null
}

export async function listOperatorBoard() {
  const outings = await listSalidas()
  const db = getPool()
  const [rows] = await db.query(
    'SELECT id, salida_id, name, whatsapp, moto FROM cupos ORDER BY created_at ASC',
  )
  const bySalida = new Map()
  for (const row of rows) {
    const ticket = toTicket(row)
    const list = bySalida.get(ticket.outingId) ?? []
    list.push(ticket)
    bySalida.set(ticket.outingId, list)
  }
  return outings.map((outing) => ({
    ...outing,
    tickets: bySalida.get(outing.id) ?? [],
  }))
}

export async function claimCupo(outingId, draft) {
  const name = String(draft.name ?? '').trim()
  const whatsapp = String(draft.whatsapp ?? '').replace(/\D/g, '')
  const moto = String(draft.moto ?? '').trim()

  if (name.length < 2) {
    return { ok: false, status: 400, detail: 'El cupo necesita un nombre.' }
  }
  if (whatsapp.length < 10 || whatsapp.length > 15) {
    return { ok: false, status: 400, detail: 'El cupo necesita un WhatsApp (mínimo 10 dígitos).' }
  }

  const db = getPool()
  const conn = await db.getConnection()
  try {
    await conn.beginTransaction()
    const [salidas] = await conn.query('SELECT * FROM salidas WHERE id = ? FOR UPDATE', [outingId])
    const row = salidas[0]
    if (!row) {
      await conn.rollback()
      return { ok: false, status: 404, detail: 'Esa salida no está.' }
    }

    if (row.status === 'realizado') {
      await conn.rollback()
      return { ok: false, status: 409, detail: 'Esa salida ya se rodó. Ya no hay cupos.' }
    }
    if (row.status === 'cerrado') {
      await conn.rollback()
      return { ok: false, status: 409, detail: 'La inscripción está cerrada.' }
    }
    if (row.status !== 'abierto') {
      await conn.rollback()
      return { ok: false, status: 409, detail: 'Ese cupo ya está lleno.' }
    }

    const [countRows] = await conn.query('SELECT COUNT(*) AS taken FROM cupos WHERE salida_id = ?', [
      outingId,
    ])
    const taken = Number(countRows[0]?.taken ?? 0)
    const capacity = Number(row.capacity)
    if (taken >= capacity) {
      await conn.query("UPDATE salidas SET status = 'lleno' WHERE id = ?", [outingId])
      await conn.commit()
      return { ok: false, status: 409, detail: 'Ese cupo ya está lleno.' }
    }

    const ticket = {
      id: randomUUID(),
      outingId,
      name,
      whatsapp,
      moto,
    }
    await conn.query(
      'INSERT INTO cupos (id, salida_id, name, whatsapp, moto) VALUES (?, ?, ?, ?, ?)',
      [ticket.id, outingId, name, whatsapp, moto],
    )

    const nextTaken = taken + 1
    if (nextTaken >= capacity) {
      await conn.query("UPDATE salidas SET status = 'lleno' WHERE id = ?", [outingId])
    }

    await conn.commit()
    const outing = await getSalida(outingId)
    return { ok: true, ticket, outing }
  } catch (error) {
    await conn.rollback()
    throw error
  } finally {
    conn.release()
  }
}

export async function setSalidaStatus(outingId, status) {
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

  const db = getPool()
  await db.query('UPDATE salidas SET status = ? WHERE id = ?', [status, outingId])
  const outing = await getSalida(outingId)
  return { ok: true, outing }
}
