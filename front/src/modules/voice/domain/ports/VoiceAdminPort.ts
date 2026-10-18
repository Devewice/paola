import type { AppError } from '@core/errors/AppError.ts'
import type { Result } from '@core/result.ts'
import type { FineGuide } from '@modules/voice/domain/entities/Fine.ts'
import type { ReportStatus, VoiceReport } from '@modules/voice/domain/entities/Report.ts'
import type { Tip } from '@modules/voice/domain/entities/Tip.ts'

export type TipDraft = {
  readonly title: string
  readonly body: string
  readonly officialHref?: string
}

export type FineDraft = {
  readonly title: string
  readonly guide: string
  readonly officialHref: string
  readonly disclaimer: string
}

export interface VoiceAdminPort {
  createTip(draft: TipDraft, clave: string): Promise<Result<Tip, AppError>>
  updateTip(id: string, draft: TipDraft, clave: string): Promise<Result<Tip, AppError>>
  removeTip(id: string, clave: string): Promise<Result<true, AppError>>
  createFine(draft: FineDraft, clave: string): Promise<Result<FineGuide, AppError>>
  updateFine(id: string, draft: FineDraft, clave: string): Promise<Result<FineGuide, AppError>>
  removeFine(id: string, clave: string): Promise<Result<true, AppError>>
  listReports(clave: string): Promise<Result<readonly VoiceReport[], AppError>>
  moderateReport(id: string, status: ReportStatus, clave: string, note?: string): Promise<Result<true, AppError>>
}
