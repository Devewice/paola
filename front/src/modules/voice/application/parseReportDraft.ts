import { appError, type AppError } from '@core/errors/AppError.ts'
import { requirePrivacyNotice } from '@core/requirePrivacyNotice.ts'
import { err, ok, type Result } from '@core/result.ts'
import { VOICE_MESSAGES } from '@modules/voice/constants/copy.ts'

export type VoiceReportDraft = {
  readonly title: string
  readonly whatHappened: string
  readonly whereText: string
  readonly happenedAt: string
  readonly evidenceSrc: string
  readonly privacyAccepted: true
}

export function parseReportDraft(draft: Record<string, unknown>): Result<VoiceReportDraft, AppError> {
  const privacy = requirePrivacyNotice(draft.privacyAccepted, VOICE_MESSAGES.PRIVACY_REQUIRED)
  if (!privacy.ok) return privacy

  const title = String(draft.title ?? '').trim()
  const whatHappened = String(draft.whatHappened ?? '').trim()
  const whereText = String(draft.whereText ?? '').trim()
  const happenedAt = String(draft.happenedAt ?? '').trim()
  const evidenceSrc = String(draft.evidenceSrc ?? '').trim()

  if (!title || !whatHappened || !whereText || !happenedAt) {
    return err(appError('VALIDATION', VOICE_MESSAGES.REPORT_INCOMPLETE))
  }

  return ok({
    title,
    whatHappened,
    whereText,
    happenedAt,
    evidenceSrc,
    privacyAccepted: true,
  })
}
