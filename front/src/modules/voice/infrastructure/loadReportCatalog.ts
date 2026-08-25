import type { ReportCatalogPort } from '@modules/voice/domain/ports/ReportCatalogPort.ts'
import { InMemoryReportCatalog } from '@modules/voice/infrastructure/InMemoryReportCatalog.ts'
import { parseReportList } from '@modules/voice/infrastructure/parseReport.ts'
import { abortAfter } from '@shared/http/abortAfter.ts'
import { API, FETCH_TIMEOUT_MS } from '@shared/http/constants.ts'

/** Origen único: MySQL vía GET /api/reports (solo publicados). */
export async function loadReportCatalog(): Promise<ReportCatalogPort> {
  try {
    const response = await fetch(API.REPORTS, { signal: abortAfter(FETCH_TIMEOUT_MS) })
    if (!response.ok) return new InMemoryReportCatalog()
    const body: unknown = await response.json()
    return new InMemoryReportCatalog(parseReportList(body).items)
  } catch {
    return new InMemoryReportCatalog()
  }
}
