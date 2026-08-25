import type { Result } from '@core/result.ts'
import type { AppError } from '@core/errors/AppError.ts'
import type { VoiceReportDraft } from '@modules/voice/application/parseReportDraft.ts'

export interface ReportSubmitPort {
  submit(draft: VoiceReportDraft): Promise<Result<{ id: string }, AppError>>
}
