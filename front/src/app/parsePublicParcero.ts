export type PublicParcero = {
  readonly id: string
  readonly alias: string
  readonly avatarSrc?: string
  readonly km: number
  readonly moto?: string
}

export function parsePublicParcero(raw: unknown): PublicParcero | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  if ('whatsapp' in row || 'email' in row || 'whatsappHref' in row || 'passwordHash' in row) return null
  if (typeof row.id !== 'string' || !row.id) return null
  if (typeof row.alias !== 'string' || !row.alias.trim()) return null
  const km = Number(row.km ?? 0)
  if (!Number.isFinite(km) || km < 0) return null
  return {
    id: row.id,
    alias: row.alias.trim(),
    avatarSrc: typeof row.avatarSrc === 'string' && row.avatarSrc ? row.avatarSrc : undefined,
    km,
    moto: typeof row.moto === 'string' && row.moto ? row.moto : undefined,
  }
}
