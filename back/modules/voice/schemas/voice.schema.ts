import { optionalText } from '../../../shared/text.js'
import { fail } from '../../../http/fail.js'
import { HTTP_STATUS } from '../../../http/constants.js'
import type { Parsed } from '../../../http/types.js'
import type { FineGuide, Report, Tip } from '../interfaces/voice.interface.js'
import { VOICE_MESSAGES } from '../constants/voice.constants.js'

export function toTip(row: Record<string, unknown>): Tip {
  return {
    id: String(row.id),
    title: String(row.title),
    body: String(row.body),
    officialHref: optionalText(row.official_href),
  }
}

export function toFine(row: Record<string, unknown>): FineGuide {
  return {
    id: String(row.id),
    title: String(row.title),
    guide: String(row.guide),
    officialHref: String(row.official_href),
    disclaimer: String(row.disclaimer),
  }
}

export function toReport(row: Record<string, unknown>): Report {
  const rawStatus = String(row.moderation_status)
  const normalizedStatus: Report['moderationStatus'] =
    rawStatus === 'publicada'
      ? 'published'
      : rawStatus === 'oculta'
        ? 'hidden'
        : rawStatus === 'rechazada'
          ? 'rejected'
          : rawStatus === 'en_revision'
            ? 'in_review'
            : (rawStatus as Report['moderationStatus'])

  return {
    id: String(row.id),
    title: String(row.title),
    whatHappened: String(row.what_happened),
    whereText: String(row.where_text),
    happenedAt: String(row.happened_at),
    evidenceSrc: optionalText(row.evidence_src),
    moderationStatus: normalizedStatus,
    moderationNote: optionalText(row.moderation_note),
  }
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function parseTipDraft(draft: Record<string, unknown>): Parsed<{ title: string; body: string; officialHref?: string }> {
  const title = text(draft.title)
  const body = text(draft.body)
  if (title.length < 3 || body.length < 6) {
    return fail(HTTP_STATUS.BAD_REQUEST, 'Tip incompleto: título y cuerpo son obligatorios.')
  }
  return { ok: true, value: { title, body, officialHref: optionalText(draft.officialHref) } }
}

export function parseFineDraft(
  draft: Record<string, unknown>,
): Parsed<{ title: string; guide: string; officialHref: string; disclaimer: string }> {
  const title = text(draft.title)
  const guide = text(draft.guide)
  const officialHref = text(draft.officialHref)
  const disclaimer = text(draft.disclaimer)
  if (!title || !guide || !officialHref || !disclaimer) {
    return fail(HTTP_STATUS.BAD_REQUEST, 'Fine guide incompleto: guía, enlace y disclaimer son obligatorios.')
  }
  return { ok: true, value: { title, guide, officialHref, disclaimer } }
}

export function parseReportDraft(
  draft: Record<string, unknown>,
): Parsed<{ title: string; whatHappened: string; whereText: string; happenedAt: string; evidenceSrc?: string }> {
  if (draft.privacyAccepted !== true) {
    return fail(HTTP_STATUS.BAD_REQUEST, VOICE_MESSAGES.PRIVACY_REQUIRED)
  }
  const title = text(draft.title)
  const whatHappened = text(draft.whatHappened)
  const whereText = text(draft.whereText)
  const happenedAt = text(draft.happenedAt)
  if (!title || !whatHappened || !whereText || !happenedAt) {
    return fail(HTTP_STATUS.BAD_REQUEST, VOICE_MESSAGES.REPORT_INCOMPLETE)
  }
  return { ok: true, value: { title, whatHappened, whereText, happenedAt, evidenceSrc: optionalText(draft.evidenceSrc) } }
}
