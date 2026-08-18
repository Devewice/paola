import { randomUUID } from 'node:crypto'
import { getDb, rowsOf } from '../db/knex.js'

export type MemoryPhoto = {
  id: string
  src: string
  alt: string
}

export type Memory = {
  id: string
  salidaId: string
  title: string
  date: string
  km: number
  closingText: string
  credit: string
  participantsText: string
  instagramHref?: string
  photos: MemoryPhoto[]
}

type Fail = { ok: false; status: number; detail: string }

function formatDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'string') return value.slice(0, 10)
  return String(value)
}

function optionalHref(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const href = value.trim()
  return href.length > 0 ? href : undefined
}

function toPhoto(row: Record<string, unknown>): MemoryPhoto {
  return {
    id: String(row.id),
    src: String(row.src),
    alt: String(row.alt),
  }
}

function toMemory(row: Record<string, unknown>, photos: MemoryPhoto[]): Memory {
  return {
    id: String(row.id),
    salidaId: String(row.salida_id),
    title: String(row.title),
    date: formatDate(row.date),
    km: Number(row.km),
    closingText: String(row.closing_text),
    credit: String(row.credit),
    participantsText: String(row.participants_text),
    instagramHref: optionalHref(row.instagram_href),
    photos,
  }
}

export async function listMemorias(): Promise<{ memories: Memory[]; totalKm: number }> {
  const db = getDb()
  const raw = await db.raw(
    `SELECT m.id, m.salida_id, m.km, m.closing_text, m.credit, m.participants_text,
            m.instagram_href, s.title, s.date
     FROM memorias m
     INNER JOIN salidas s ON s.id = m.salida_id
     ORDER BY s.date DESC, m.created_at DESC`,
  )
  const rows = rowsOf(raw)
  if (rows.length === 0) return { memories: [], totalKm: 0 }

  const ids = rows.map((row) => String(row.id))
  const photoRows = await db('memoria_fotos')
    .select('id', 'memoria_id', 'src', 'alt', 'sort_order')
    .whereIn('memoria_id', ids)
    .orderBy('sort_order', 'asc')

  const byMemoria = new Map<string, MemoryPhoto[]>()
  for (const row of photoRows) {
    const memoriaId = String((row as Record<string, unknown>).memoria_id)
    const list = byMemoria.get(memoriaId) ?? []
    list.push(toPhoto(row as Record<string, unknown>))
    byMemoria.set(memoriaId, list)
  }

  const memories = rows.map((row) => toMemory(row, byMemoria.get(String(row.id)) ?? []))
  const totalRaw = await db('memorias').sum({ total: 'km' })
  const totalKm = Number((totalRaw[0] as { total?: number | string } | undefined)?.total ?? 0)
  return { memories, totalKm }
}

function parsePhotos(raw: unknown): { src: string; alt: string }[] {
  if (!Array.isArray(raw)) return []
  const photos: { src: string; alt: string }[] = []
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const row = item as Record<string, unknown>
    const src = String(row.src ?? '').trim()
    const alt = String(row.alt ?? '').trim()
    if (src.length < 4 || alt.length < 2) continue
    photos.push({ src, alt })
  }
  return photos
}

export async function createMemoria(
  draft: Record<string, unknown>,
): Promise<Fail | { ok: true; memory: Memory }> {
  const salidaId = String(draft.salidaId ?? '').trim()
  const km = Number(draft.km)
  const closingText = String(draft.closingText ?? '').trim()
  const credit = String(draft.credit ?? '').trim()
  const participantsText = String(draft.participantsText ?? '').trim()
  const instagramHref = optionalHref(draft.instagramHref)
  const photos = parsePhotos(draft.photos)

  if (!salidaId) {
    return { ok: false, status: 400, detail: 'Elige la salida realizada.' }
  }
  if (!Number.isInteger(km) || km < 1) {
    return { ok: false, status: 400, detail: 'La memoria necesita kilómetros (entero ≥ 1).' }
  }
  if (closingText.length < 2) {
    return { ok: false, status: 400, detail: 'Cierra con un párrafo (Armargura).' }
  }
  if (credit.length < 2) {
    return { ok: false, status: 400, detail: 'Di quién tomó las fotos (crédito).' }
  }
  if (participantsText.length < 2) {
    return { ok: false, status: 400, detail: 'Di quién salió, con permiso.' }
  }
  if (photos.length === 0) {
    return { ok: false, status: 400, detail: 'Al menos una foto con enlace y texto alterno.' }
  }

  const salida = await getDb()('salidas').where({ id: salidaId }).first()
  if (!salida) {
    return { ok: false, status: 404, detail: 'Esa salida no está.' }
  }
  if (String(salida.status) !== 'realizado') {
    return { ok: false, status: 409, detail: 'Solo se recuerda una salida marcada como realizada.' }
  }

  const existing = await getDb()('memorias').where({ salida_id: salidaId }).first()
  if (existing) {
    return { ok: false, status: 409, detail: 'Esa salida ya tiene memoria.' }
  }

  const memoriaId = randomUUID()
  await getDb().transaction(async (trx) => {
    await trx('memorias').insert({
      id: memoriaId,
      salida_id: salidaId,
      km,
      closing_text: closingText,
      credit,
      participants_text: participantsText,
      instagram_href: instagramHref ?? null,
    })
    let order = 0
    for (const photo of photos) {
      await trx('memoria_fotos').insert({
        id: randomUUID(),
        memoria_id: memoriaId,
        src: photo.src,
        alt: photo.alt,
        sort_order: order,
      })
      order += 1
    }
  })

  const listed = await listMemorias()
  const memory = listed.memories.find((item) => item.id === memoriaId)
  if (!memory) {
    return { ok: false, status: 500, detail: 'Se guardó pero no se pudo leer la memoria.' }
  }
  return { ok: true, memory }
}
