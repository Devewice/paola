import { LEGAL_COPY } from '@app/constants/legal.ts'
import { requirePrivacyNotice } from '@core/requirePrivacyNotice.ts'
import type { AppError } from '@core/errors/AppError.ts'
import type { Result } from '@core/result.ts'

export function parseAccountRegister(draft: {
  readonly privacyAccepted: unknown
}): Result<true, AppError> {
  return requirePrivacyNotice(draft.privacyAccepted, LEGAL_COPY.privacyRequired)
}
