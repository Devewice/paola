import { appError, type AppError } from '@core/errors/AppError.ts'
import { err, ok, type Result } from '@core/result.ts'
import { VOICE_ADMIN_COPY } from '@modules/voice/constants/copy.ts'
import type { FineGuide } from '@modules/voice/domain/entities/Fine.ts'
import type { ReportStatus, VoiceReport } from '@modules/voice/domain/entities/Report.ts'
import type { Tip } from '@modules/voice/domain/entities/Tip.ts'
import type { FineDraft, TipDraft, VoiceAdminPort } from '@modules/voice/domain/ports/VoiceAdminPort.ts'
import { parseFine } from '@modules/voice/infrastructure/parseFine.ts'
import { parseReportList } from '@modules/voice/infrastructure/parseReport.ts'
import { parseTip } from '@modules/voice/infrastructure/parseTip.ts'
import { abortAfter } from '@shared/http/abortAfter.ts'
import {
  API,
  FETCH_TIMEOUT_MS,
  JSON_HEADERS,
  OPERADOR_CLAVE_HEADER,
  apiOperarReportStatus,
} from '@shared/http/constants.ts'

type Body = Record<string, unknown>

async function post(url: string, payload: Body, clave: string): Promise<{ response: Response; body: Body }> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { ...JSON_HEADERS, [OPERADOR_CLAVE_HEADER]: clave },
    body: JSON.stringify({ ...payload, clave }),
    signal: abortAfter(FETCH_TIMEOUT_MS),
  })
  const body = (await response.json().catch(() => ({}))) as Body
  return { response, body }
}

function detailOr(body: Body, fallback: string): string {
  return typeof body.detail === 'string' && body.detail ? body.detail : fallback
}

export class HttpVoiceAdminApi implements VoiceAdminPort {
  async createTip(draft: TipDraft, clave: string): Promise<Result<Tip, AppError>> {
    try {
      const { response, body } = await post(API.OPERAR_TIPS, { ...draft }, clave)
      if (!response.ok) return err(appError('VALIDATION', detailOr(body, VOICE_ADMIN_COPY.tipFail)))
      const tip = parseTip(body.tip)
      return tip ? ok(tip) : err(appError('INFRASTRUCTURE', VOICE_ADMIN_COPY.tipFail))
    } catch {
      return err(appError('INFRASTRUCTURE', VOICE_ADMIN_COPY.tipFail))
    }
  }

  async createFine(draft: FineDraft, clave: string): Promise<Result<FineGuide, AppError>> {
    try {
      const { response, body } = await post(API.OPERAR_FINES, { ...draft }, clave)
      if (!response.ok) return err(appError('VALIDATION', detailOr(body, VOICE_ADMIN_COPY.fineFail)))
      const fine = parseFine(body.fine)
      return fine ? ok(fine) : err(appError('INFRASTRUCTURE', VOICE_ADMIN_COPY.fineFail))
    } catch {
      return err(appError('INFRASTRUCTURE', VOICE_ADMIN_COPY.fineFail))
    }
  }

  async listReports(clave: string): Promise<Result<readonly VoiceReport[], AppError>> {
    try {
      const response = await fetch(API.OPERAR_REPORTS, {
        headers: { [OPERADOR_CLAVE_HEADER]: clave },
        signal: abortAfter(FETCH_TIMEOUT_MS),
      })
      const body = (await response.json().catch(() => ({}))) as Body
      if (!response.ok) return err(appError('VALIDATION', detailOr(body, VOICE_ADMIN_COPY.reportsLoadFail)))
      return ok(parseReportList(body).items)
    } catch {
      return err(appError('INFRASTRUCTURE', VOICE_ADMIN_COPY.reportsLoadFail))
    }
  }

  async moderateReport(
    id: string,
    status: ReportStatus,
    clave: string,
    note?: string,
  ): Promise<Result<true, AppError>> {
    try {
      const { response, body } = await post(apiOperarReportStatus(id), { status, note }, clave)
      if (!response.ok) return err(appError('VALIDATION', detailOr(body, VOICE_ADMIN_COPY.reportFail)))
      return ok(true)
    } catch {
      return err(appError('INFRASTRUCTURE', VOICE_ADMIN_COPY.reportFail))
    }
  }
}
