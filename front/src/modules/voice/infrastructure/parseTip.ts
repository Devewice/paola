import type { Tip, TipList } from '@modules/voice/domain/entities/Tip.ts'
import { TIPS_EMPTY_COPY } from '@modules/voice/domain/entities/Tip.ts'

function optionalHref(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const href = value.trim()
  return href.length > 0 ? href : undefined
}

export function parseTip(raw: unknown): Tip | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  if (typeof row.id !== 'string' || !row.id) return null
  if (typeof row.title !== 'string' || row.title.trim().length < 2) return null
  if (typeof row.body !== 'string' || row.body.trim().length < 2) return null
  return {
    id: row.id,
    title: row.title.trim(),
    body: row.body.trim(),
    officialHref: optionalHref(row.officialHref),
  }
}

export function parseTipList(raw: unknown): TipList {
  if (!raw || typeof raw !== 'object') {
    return { items: [], emptyCopy: TIPS_EMPTY_COPY }
  }
  const body = raw as Record<string, unknown>
  const rawItems = body.tips
  const items = Array.isArray(rawItems)
    ? rawItems.map(parseTip).filter((item): item is Tip => item !== null)
    : []
  return { items, emptyCopy: TIPS_EMPTY_COPY }
}
