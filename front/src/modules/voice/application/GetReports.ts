import type { ReportList } from '@modules/voice/domain/entities/Report.ts'
import type { ReportCatalogPort } from '@modules/voice/domain/ports/ReportCatalogPort.ts'

export class GetReports {
  private readonly catalog: ReportCatalogPort

  constructor(catalog: ReportCatalogPort) {
    this.catalog = catalog
  }

  execute(): ReportList {
    return this.catalog.list()
  }
}
