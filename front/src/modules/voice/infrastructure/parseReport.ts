import type { ReportList, ReportStatus, VoiceReport } from '@modules/voice/domain/entities/Report.ts'
import { REPORTS_EMPTY_COPY, VOICE_LIMITS } from '@modules/voice/constants/copy.ts'

const STATUSES: readonly ReportStatus[] = ['in_review', 'published', 'hidden', 'rejected']

function parseStatus(value: unknown): ReportStatus | null {
  if (typeof value !== 'string') return null
  if (value === 'publicada') return 'published'
  if (value === 'en_revision') return 'in_review'
  if (value === 'oculta') return 'hidden'
  if (value === 'rechazada') return 'rejected'
  return STATUSES.includes(value as ReportStatus) ? (value as ReportStatus) : null
}

export function parseReport(raw: unknown): VoiceReport | null {
  if (!raw || typeof raw !== 'object') return null
  const row = raw as Record<string, unknown>
  if (typeof row.id !== 'string' || !row.id) return null
  if (typeof row.title !== 'string' || row.title.trim().length < VOICE_LIMITS.TITLE_MIN) return null
  if (typeof row.whatHappened !== 'string' || row.whatHappened.trim().length < VOICE_LIMITS.BODY_MIN) {
    return null
  }
  if (typeof row.whereText !== 'string' || !row.whereText.trim()) return null
  if (typeof row.happenedAt !== 'string' || !row.happenedAt.trim()) return null
  const moderationStatus = parseStatus(row.moderationStatus)
  if (!moderationStatus) return null
  const evidenceSrc =
    typeof row.evidenceSrc === 'string' && row.evidenceSrc.trim() ? row.evidenceSrc.trim() : undefined
  return {
    id: row.id,
    title: row.title.trim(),
    whatHappened: row.whatHappened.trim(),
    whereText: row.whereText.trim(),
    happenedAt: row.happenedAt.trim(),
    evidenceSrc,
    moderationStatus,
  }
}

export function parseReportList(raw: unknown): ReportList {
  if (!raw || typeof raw !== 'object') {
    return { items: [], emptyCopy: REPORTS_EMPTY_COPY }
  }
  const body = raw as Record<string, unknown>
  const rawItems = body.reports ?? body.denuncias
  const items = Array.isArray(rawItems)
    ? rawItems.map(parseReport).filter((item): item is VoiceReport => item !== null)
    : []
  return { items, emptyCopy: REPORTS_EMPTY_COPY }
}
