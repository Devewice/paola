import type { ReportList } from '@modules/voice/domain/entities/Report.ts'

export interface ReportCatalogPort {
  list(): ReportList
}
