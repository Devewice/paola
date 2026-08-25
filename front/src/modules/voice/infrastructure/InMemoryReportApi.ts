import { appError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import type { AppError } from '@core/errors/AppError.ts'
import type { VoiceReportDraft } from '@modules/voice/application/parseReportDraft.ts'
import type { ReportSubmitPort } from '@modules/voice/domain/ports/ReportSubmitPort.ts'

/** Fallback sin red: no crea nada. */
export class InMemoryReportApi implements ReportSubmitPort {
  async submit(_draft: VoiceReportDraft): Promise<Result<{ id: string }, AppError>> {
    return err(appError('INFRASTRUCTURE', 'Sin API de reportes en memoria.'))
  }
}

export function memoryReportOk(): ReportSubmitPort {
  return {
    async submit() {
      return ok({ id: 'memory-report' })
    },
  }
}
