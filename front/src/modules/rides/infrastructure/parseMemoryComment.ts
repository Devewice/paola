import {
  MEMORY_COMMENT_STATUSES,
  isMemoryCommentStatus,
  type MemoryComment,
  type MemoryCommentCounts,
  type MemoryCommentLike,
  type OperatorMemoryComment,
} from '@modules/rides/domain/entities/MemoryComment.ts'

function text(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function count(value: unknown): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0
}

export function parseMemoryComment(raw: unknown): MemoryComment | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  const id = text(row.id)
  const body = text(row.body)
  if (!id || !body || !isMemoryCommentStatus(row.status)) return null
  const parentId = text(row.parentId)
  return {
    id,
    memoryId: text(row.memoryId),
    authorAlias: text(row.authorAlias) || text(row.alias),
    body,
    parentId: parentId || undefined,
    status: row.status,
    createdAt: text(row.createdAt),
    isPinned: row.isPinned === true,
    likes: count(row.likes),
    liked: row.liked === true,
    mine: row.mine === true,
  }
}

export function parseOperatorMemoryComment(raw: unknown): OperatorMemoryComment | null {
  const comment = parseMemoryComment(raw)
  if (!comment) return null
  const row = raw as Record<string, unknown>
  return { ...comment, memoryTitle: text(row.memoryTitle), outingId: text(row.outingId) }
}

export function parseMemoryCommentCounts(raw: unknown): MemoryCommentCounts {
  const row = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  return Object.fromEntries(MEMORY_COMMENT_STATUSES.map((status) => [status, count(row[status])])) as MemoryCommentCounts
}

export function parseMemoryCommentLike(raw: Record<string, unknown>): MemoryCommentLike | null {
  if (typeof raw.liked !== 'boolean') return null
  return { likes: count(raw.likes), liked: raw.liked }
}

export function parseList<T>(raw: unknown, parse: (row: unknown) => T | null): T[] {
  if (!Array.isArray(raw)) return []
  return raw.map(parse).filter((item): item is T => item !== null)
}
