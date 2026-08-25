import type { ReportList } from '@modules/voice/domain/entities/Report.ts'
import { REPORTS_EMPTY_COPY } from '@modules/voice/constants/copy.ts'
import type { ReportCatalogPort } from '@modules/voice/domain/ports/ReportCatalogPort.ts'

export class InMemoryReportCatalog implements ReportCatalogPort {
  private readonly items: ReportList

  constructor(items: ReportList['items'] = []) {
    this.items = { items, emptyCopy: REPORTS_EMPTY_COPY }
  }

  list(): ReportList {
    return this.items
  }
}
