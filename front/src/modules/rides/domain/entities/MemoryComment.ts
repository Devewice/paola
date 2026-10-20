export const MEMORY_COMMENT_STATUSES = ['en_revision', 'publicado', 'rechazado', 'oculto'] as const

export type MemoryCommentStatus = (typeof MEMORY_COMMENT_STATUSES)[number]

export type MemoryComment = {
  readonly id: string
  readonly memoryId: string
  readonly authorAlias: string
  readonly body: string
  readonly parentId?: string
  readonly status: MemoryCommentStatus
  readonly createdAt: string
  readonly isPinned: boolean
  readonly likes: number
  readonly liked: boolean
  readonly mine: boolean
}

export type OperatorMemoryComment = MemoryComment & {
  readonly memoryTitle: string
  readonly outingId: string
}

export type MemoryCommentCounts = Readonly<Record<MemoryCommentStatus, number>>

export type MemoryCommentFilter = {
  readonly status?: MemoryCommentStatus
  readonly memoryId?: string
}

export type MemoryCommentLike = {
  readonly likes: number
  readonly liked: boolean
}

export type MemoryCommentThread = {
  readonly comment: MemoryComment
  readonly replies: readonly MemoryComment[]
}

export function isMemoryCommentStatus(value: unknown): value is MemoryCommentStatus {
  return typeof value === 'string' && (MEMORY_COMMENT_STATUSES as readonly string[]).includes(value)
}

export function sortMemoryComments<T extends MemoryComment>(comments: readonly T[]): T[] {
  return [...comments].sort(
    (a, b) => Number(b.isPinned) - Number(a.isPinned) || a.createdAt.localeCompare(b.createdAt),
  )
}

/** Raíces en el orden recibido (fijados primero); respuestas debajo en orden cronológico. Huérfanas suben a raíz. */
export function threadMemoryComments(comments: readonly MemoryComment[]): MemoryCommentThread[] {
  const ids = new Set(comments.map((item) => item.id))
  const replies = new Map<string, MemoryComment[]>()
  const roots: MemoryComment[] = []
  for (const item of comments) {
    if (item.parentId && ids.has(item.parentId)) {
      const list = replies.get(item.parentId) ?? []
      list.push(item)
      replies.set(item.parentId, list)
    } else {
      roots.push(item)
    }
  }
  return roots.map((comment) => ({
    comment,
    replies: (replies.get(comment.id) ?? []).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
  }))
}

/** Aplica un like sin esperar al servidor, para pintar al instante. */
export function applyMemoryCommentLike(
  comments: readonly MemoryComment[],
  commentId: string,
  like: MemoryCommentLike,
): MemoryComment[] {
  return comments.map((item) => (item.id === commentId ? { ...item, ...like } : item))
}
