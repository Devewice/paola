export type ActivityItem = {
  readonly kind: 'outing' | 'memory' | 'post'
  readonly id: string
  readonly title: string
  readonly createdAt: string
  readonly highlighted: boolean
}

export function parseActivityItem(raw: unknown): ActivityItem | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  if ('whatsapp' in row || 'email' in row || 'whatsappHref' in row) return null
  if (row.kind !== 'outing' && row.kind !== 'memory' && row.kind !== 'post') return null
  if (typeof row.id !== 'string' || !row.id) return null
  if (typeof row.title !== 'string' || !row.title.trim()) return null
  return {
    kind: row.kind,
    id: row.id,
    title: row.title.trim(),
    createdAt: typeof row.createdAt === 'string' ? row.createdAt : '',
    highlighted: row.highlighted === true,
  }
}
