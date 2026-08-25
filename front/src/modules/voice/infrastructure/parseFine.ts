import type { FineGuide, FineList } from '@modules/voice/domain/entities/Fine.ts'
import { FINES_EMPTY_COPY, VOICE_LIMITS } from '@modules/voice/constants/copy.ts'

export function parseFine(raw: unknown): FineGuide | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  if (typeof row.id !== 'string' || !row.id) return null
  if (typeof row.title !== 'string' || row.title.trim().length < VOICE_LIMITS.TITLE_MIN) return null
  if (typeof row.guide !== 'string' || row.guide.trim().length < VOICE_LIMITS.BODY_MIN) return null
  if (typeof row.officialHref !== 'string' || !row.officialHref.trim()) return null
  if (typeof row.disclaimer !== 'string' || !row.disclaimer.trim()) return null
  return {
    id: row.id,
    title: row.title.trim(),
    guide: row.guide.trim(),
    officialHref: row.officialHref.trim(),
    disclaimer: row.disclaimer.trim(),
  }
}

export function parseFineList(raw: unknown): FineList {
  if (!raw || typeof raw !== 'object') {
    return { items: [], emptyCopy: FINES_EMPTY_COPY }
  }
  const body = raw as Record<string, unknown>
  const rawItems = body.fines ?? body.comparendos
  const items = Array.isArray(rawItems)
    ? rawItems.map(parseFine).filter((item): item is FineGuide => item !== null)
    : []
  return { items, emptyCopy: FINES_EMPTY_COPY }
}
