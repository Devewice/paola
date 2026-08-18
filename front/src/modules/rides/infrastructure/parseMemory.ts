import type { Memory, MemoryList, MemoryPhoto } from '@modules/rides/domain/entities/Memory.ts'
import { MEMORIES_EMPTY_COPY } from '@modules/rides/domain/entities/Memory.ts'

function optionalHref(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const href = value.trim()
  return href.length > 0 ? href : undefined
}

export function parseMemoryPhoto(raw: unknown): MemoryPhoto | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  if (typeof row.id !== 'string' || !row.id) return null
  if (typeof row.src !== 'string' || row.src.trim().length < 4) return null
  if (typeof row.alt !== 'string' || row.alt.trim().length < 2) return null
  return { id: row.id, src: row.src.trim(), alt: row.alt.trim() }
}

export function parseMemory(raw: unknown): Memory | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  if (typeof row.id !== 'string' || !row.id) return null
  if (typeof row.salidaId !== 'string' || !row.salidaId) return null
  if (typeof row.title !== 'string' || !row.title.trim()) return null
  if (typeof row.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(row.date)) return null
  const km = Number(row.km)
  if (!Number.isInteger(km) || km < 1) return null
  if (typeof row.closingText !== 'string' || row.closingText.trim().length < 2) return null
  if (typeof row.credit !== 'string' || row.credit.trim().length < 2) return null
  if (typeof row.participantsText !== 'string' || row.participantsText.trim().length < 2) return null

  const rawPhotos = row.photos
  const photos = Array.isArray(rawPhotos)
    ? rawPhotos.map(parseMemoryPhoto).filter((item): item is MemoryPhoto => item !== null)
    : []

  return {
    id: row.id,
    salidaId: row.salidaId,
    title: row.title.trim(),
    date: row.date,
    km,
    closingText: row.closingText.trim(),
    credit: row.credit.trim(),
    participantsText: row.participantsText.trim(),
    instagramHref: optionalHref(row.instagramHref),
    photos,
  }
}

export function parseMemoryList(raw: unknown): MemoryList {
  if (!raw || typeof raw !== 'object') {
    return { items: [], totalKm: 0, emptyCopy: MEMORIES_EMPTY_COPY }
  }
  const body = raw as Record<string, unknown>
  const totalKm = Number(body.totalKm ?? 0)
  const rawItems = body.memories
  const items = Array.isArray(rawItems)
    ? rawItems.map(parseMemory).filter((item): item is Memory => item !== null)
    : []
  return {
    items,
    totalKm: Number.isFinite(totalKm) && totalKm >= 0 ? totalKm : 0,
    emptyCopy: MEMORIES_EMPTY_COPY,
  }
}
