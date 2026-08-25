import type { AppError } from '@core/errors/AppError.ts'
import type { Result } from '@core/result.ts'
import { parseReportDraft, type VoiceReportDraft } from '@modules/voice/application/parseReportDraft.ts'
import type { ReportSubmitPort } from '@modules/voice/domain/ports/ReportSubmitPort.ts'

export class SubmitReport {
  private readonly api: ReportSubmitPort

  constructor(api: ReportSubmitPort) {
    this.api = api
  }

  async execute(draft: Record<string, unknown>): Promise<Result<{ id: string }, AppError>> {
    const parsed = parseReportDraft(draft)
    if (!parsed.ok) return parsed
    return this.api.submit(parsed.value)
  }
}

export type { VoiceReportDraft }
