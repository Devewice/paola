import { ok, type Result } from '@core/result.ts'
import type { AppError } from '@core/errors/AppError.ts'
import type { FineGuide } from '@modules/voice/domain/entities/Fine.ts'
import type { ReportStatus, VoiceReport } from '@modules/voice/domain/entities/Report.ts'
import type { Tip } from '@modules/voice/domain/entities/Tip.ts'
import type { FineDraft, TipDraft, VoiceAdminPort } from '@modules/voice/domain/ports/VoiceAdminPort.ts'

export class InMemoryVoiceAdminApi implements VoiceAdminPort {
  private reports: VoiceReport[] = []

  async createTip(draft: TipDraft): Promise<Result<Tip, AppError>> {
    return ok({ id: `tip-${Date.now()}`, ...draft })
  }

  async createFine(draft: FineDraft): Promise<Result<FineGuide, AppError>> {
    return ok({ id: `fine-${Date.now()}`, ...draft })
  }

  async listReports(): Promise<Result<readonly VoiceReport[], AppError>> {
    return ok(this.reports)
  }

  async moderateReport(id: string, status: ReportStatus): Promise<Result<true, AppError>> {
    this.reports = this.reports.map((item) => (item.id === id ? { ...item, moderationStatus: status } : item))
    return ok(true)
  }
}
