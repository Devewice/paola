import { randomUUID } from 'node:crypto'
import { getDb, rowsOf } from '../../../db/knex.js'
import { MEMORY_TABLES } from '../constants/memories.constants.js'
import type { CreateMemoryDto } from '../dtos/memories.dto.js'
import type { Memory, MemoryList, MemoryPhoto } from '../interfaces/memories.interface.js'
import { toMemory, toPhoto } from '../schemas/memories.schema.js'

export async function findMemories(): Promise<MemoryList> {
  const db = getDb()
  const raw = await db.raw(
    `SELECT m.id, m.outing_id, m.km, m.closing_text, m.credit, m.participants_text,
            m.instagram_href, s.title, s.date
     FROM ${MEMORY_TABLES.MEMORIES} m
     INNER JOIN ${MEMORY_TABLES.OUTINGS} s ON s.id = m.outing_id
     ORDER BY s.date DESC, m.created_at DESC`,
  )
  const rows = rowsOf(raw)
  if (rows.length === 0) return { memories: [], totalKm: 0 }

  const ids = rows.map((row) => String(row.id))
  const photoRows = await db(MEMORY_TABLES.PHOTOS)
    .select('id', 'memory_id', 'src', 'alt', 'sort_order')
    .whereIn('memory_id', ids)
    .orderBy('sort_order', 'asc')

  const byMemory = new Map<string, MemoryPhoto[]>()
  for (const row of photoRows) {
    const memoryId = String((row as Record<string, unknown>).memory_id)
    const list = byMemory.get(memoryId) ?? []
    list.push(toPhoto(row as Record<string, unknown>))
    byMemory.set(memoryId, list)
  }

  const memories = rows.map((row) => toMemory(row, byMemory.get(String(row.id)) ?? []))
  const totalRaw = await db(MEMORY_TABLES.MEMORIES).sum({ total: 'km' })
  const totalKm = Number((totalRaw[0] as { total?: number | string } | undefined)?.total ?? 0)
  return { memories, totalKm }
}

export async function findOutingRow(id: string): Promise<Record<string, unknown> | undefined> {
  return getDb()(MEMORY_TABLES.OUTINGS).where({ id }).first() as Promise<
    Record<string, unknown> | undefined
  >
}

export async function findMemoryByOuting(outingId: string): Promise<unknown> {
  return getDb()(MEMORY_TABLES.MEMORIES).where({ outing_id: outingId }).first()
}

export async function insertMemory(id: string, draft: CreateMemoryDto): Promise<void> {
  await getDb().transaction(async (trx) => {
    await trx(MEMORY_TABLES.MEMORIES).insert({
      id,
      outing_id: draft.outingId,
      km: draft.km,
      closing_text: draft.closingText,
      credit: draft.credit,
      participants_text: draft.participantsText,
      instagram_href: draft.instagramHref ?? null,
    })
    let order = 0
    for (const photo of draft.photos) {
      await trx(MEMORY_TABLES.PHOTOS).insert({
        id: randomUUID(),
        memory_id: id,
        src: photo.src,
        alt: photo.alt,
        sort_order: order,
      })
      order += 1
    }
  })
}

export async function findMemoryById(id: string): Promise<Memory | undefined> {
  const listed = await findMemories()
  return listed.memories.find((item) => item.id === id)
}
