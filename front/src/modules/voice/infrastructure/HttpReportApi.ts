import { appError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import type { AppError } from '@core/errors/AppError.ts'
import type { VoiceReportDraft } from '@modules/voice/application/parseReportDraft.ts'
import { VOICE_COPY } from '@modules/voice/constants/copy.ts'
import type { ReportSubmitPort } from '@modules/voice/domain/ports/ReportSubmitPort.ts'
import { abortAfter } from '@shared/http/abortAfter.ts'
import { API, FETCH_TIMEOUT_MS, JSON_HEADERS } from '@shared/http/constants.ts'

export class HttpReportApi implements ReportSubmitPort {
  async submit(draft: VoiceReportDraft): Promise<Result<{ id: string }, AppError>> {
    try {
      const response = await fetch(API.REPORTS, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(draft),
        signal: abortAfter(FETCH_TIMEOUT_MS),
      })
      const body = (await response.json().catch(() => ({}))) as Record<string, unknown>
      if (!response.ok) {
        const detail = typeof body.detail === 'string' ? body.detail : VOICE_COPY.sendFail
        return err(appError('VALIDATION', detail))
      }
      const report = body.report as { id?: string } | undefined
      const id = typeof report?.id === 'string' ? report.id : ''
      if (!id) return err(appError('INFRASTRUCTURE', VOICE_COPY.sendFail))
      return ok({ id })
    } catch {
      return err(appError('INFRASTRUCTURE', VOICE_COPY.sendFail))
    }
  }
}
