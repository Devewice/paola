import type { FineList } from '@modules/voice/domain/entities/Fine.ts'
import type { FineCatalogPort } from '@modules/voice/domain/ports/FineCatalogPort.ts'

export class GetFines {
  private readonly catalog: FineCatalogPort

  constructor(catalog: FineCatalogPort) {
    this.catalog = catalog
  }

  execute(): FineList {
    return this.catalog.list()
  }
}
