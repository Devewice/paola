import type { Alliance } from '@modules/club/domain/entities/Alliance.ts'
import type { Member } from '@modules/club/domain/entities/Member.ts'

function optionalHref(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const href = value.trim()
  return href.length > 0 ? href : undefined
}

export function parseAlliance(raw: unknown): Alliance | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  if (typeof row.id !== 'string' || row.id.length === 0) return null
  if (typeof row.name !== 'string' || row.name.trim().length === 0) return null
  if (typeof row.support !== 'string' || row.support.trim().length === 0) return null
  return {
    id: row.id,
    name: row.name.trim(),
    support: row.support.trim(),
    href: optionalHref(row.href),
  }
}

export function parseMember(raw: unknown): Member | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  if (typeof row.id !== 'string' || row.id.length === 0) return null
  if (typeof row.alias !== 'string' || row.alias.trim().length === 0) return null
  const photoSrc = optionalHref(row.photoSrc)
  const moto = typeof row.moto === 'string' && row.moto.trim() ? row.moto.trim() : undefined
  return {
    id: row.id,
    alias: row.alias.trim(),
    photoSrc,
    moto,
    instagramHref: optionalHref(row.instagramHref),
  }
}
