import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'

export function requirePrivacyNotice(
  accepted: unknown,
  message: string,
): Result<true, AppError> {
  if (accepted !== true) {
    return err(appError('VALIDATION', message))
  }
  return ok(true)
}
