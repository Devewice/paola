import type { Outing, OutingKind, OutingStatus } from '@modules/rides/domain/entities/Outing.ts'

const KINDS = new Set<OutingKind>(['rodada', 'actividad'])
const STATUSES = new Set<OutingStatus>(['abierto', 'lleno', 'cerrado', 'realizado'])

export function parseOuting(raw: unknown): Outing | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  if (typeof row.id !== 'string' || row.id.length === 0) return null
  if (typeof row.title !== 'string' || row.title.length === 0) return null
  if (typeof row.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(row.date)) return null
  if (typeof row.kind !== 'string' || !KINDS.has(row.kind as OutingKind)) return null
  if (typeof row.meetingPoint !== 'string' || row.meetingPoint.length === 0) return null
  if (typeof row.routeText !== 'string') return null
  const capacity = Number(row.capacity)
  if (!Number.isInteger(capacity) || capacity < 1) return null
  if (typeof row.whatToBring !== 'string') return null
  if (typeof row.paid !== 'boolean') return null
  if (typeof row.status !== 'string' || !STATUSES.has(row.status as OutingStatus)) return null

  const taken = Number(row.taken ?? 0)
  if (!Number.isInteger(taken) || taken < 0) return null

  return {
    id: row.id,
    title: row.title,
    date: row.date,
    kind: row.kind as OutingKind,
    meetingPoint: row.meetingPoint,
    routeText: row.routeText,
    capacity,
    taken,
    whatToBring: row.whatToBring,
    paid: row.paid,
    status: row.status as OutingStatus,
    mapHref: typeof row.mapHref === 'string' && row.mapHref ? row.mapHref : undefined,
  }
}
