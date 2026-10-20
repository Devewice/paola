import type {
  MapPoint,
  Outing,
  OutingKind,
  OutingRoute,
  OutingStatus,
} from '@modules/rides/domain/entities/Outing.ts'
import { decodePolyline } from '@shared/geo/polyline.ts'

const KINDS = new Set<OutingKind>(['rodada', 'actividad', 'tintada'])
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
    route: parseRoute(row.route),
  }
}

export function parseMapPoint(raw: unknown): MapPoint | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const row = raw as Record<string, unknown>
  const lat = Number(row.lat)
  const lng = Number(row.lng)
  if (typeof row.label !== 'string' || !Number.isFinite(lat) || !Number.isFinite(lng)) return undefined
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return undefined
  return { label: row.label, lat, lng }
}

function positive(value: unknown): number | undefined {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : undefined
}

function parseRoute(raw: unknown): OutingRoute | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const row = raw as Record<string, unknown>
  const start = parseMapPoint(row.start)
  const end = parseMapPoint(row.end)
  if (!start && !end) return undefined
  return {
    start,
    end,
    path: typeof row.path === 'string' ? decodePolyline(row.path) : [],
    distanceKm: positive(row.distanceKm),
    durationMin: positive(row.durationMin),
  }
}
