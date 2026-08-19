export type PublicPostReaction = {
  readonly reaction: string
  readonly count: number
  readonly mine?: boolean
}

export type PublicPost = {
  readonly id: string
  readonly authorAlias: string
  readonly body: string
  readonly createdAt: string
  readonly communityId?: string
  readonly parentId?: string
  readonly photos: readonly string[]
  readonly isPinned: boolean
  readonly isHighlighted: boolean
  readonly canModerate: boolean
  readonly reactions: readonly PublicPostReaction[]
  readonly replies: readonly PublicPost[]
}

function asRecord(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object') return null
  return raw as Record<string, unknown>
}

function parsePhotos(row: Record<string, unknown>): string[] {
  if (!Array.isArray(row.photos)) {
    return typeof row.photoSrc === 'string' && row.photoSrc ? [row.photoSrc] : []
  }
  return row.photos.filter((item): item is string => typeof item === 'string' && Boolean(item.trim()))
}

function parseReactions(row: Record<string, unknown>): PublicPostReaction[] {
  if (!Array.isArray(row.reactions)) return []
  const list: PublicPostReaction[] = []
  for (const item of row.reactions) {
    if (!item || typeof item !== 'object') continue
    const rec = item as Record<string, unknown>
    if (typeof rec.reaction !== 'string' || !rec.reaction) continue
    list.push({
      reaction: rec.reaction,
      count: Number(rec.count ?? 0),
      mine: rec.mine === true,
    })
  }
  return list
}

export function parsePublicPost(raw: unknown): PublicPost | null {
  const row = asRecord(raw)
  if (!row) return null
  if (typeof row.id !== 'string' || !row.id) return null
  if (typeof row.authorAlias !== 'string' || !row.authorAlias.trim()) return null
  if (typeof row.body !== 'string' || !row.body.trim()) return null
  if ('whatsapp' in row || 'email' in row || 'whatsappHref' in row) return null
  const repliesRaw = Array.isArray(row.replies) ? row.replies : []
  const replies = repliesRaw
    .map((item) => parsePublicPost(item))
    .filter((item): item is PublicPost => item !== null)
  return {
    id: row.id,
    authorAlias: row.authorAlias.trim(),
    body: row.body.trim(),
    createdAt: typeof row.createdAt === 'string' ? row.createdAt : '',
    communityId: typeof row.communityId === 'string' ? row.communityId : undefined,
    parentId: typeof row.parentId === 'string' && row.parentId ? row.parentId : undefined,
    photos: parsePhotos(row),
    isPinned: row.isPinned === true,
    isHighlighted: row.isHighlighted === true,
    canModerate: row.canModerate === true,
    reactions: parseReactions(row),
    replies,
  }
}
