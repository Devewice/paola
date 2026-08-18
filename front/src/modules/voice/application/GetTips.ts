import type { TipList } from '@modules/voice/domain/entities/Tip.ts'
import type { TipCatalogPort } from '@modules/voice/domain/ports/TipCatalogPort.ts'

export class GetTips {
  private readonly catalog: TipCatalogPort

  constructor(catalog: TipCatalogPort) {
    this.catalog = catalog
  }

  execute(): TipList {
    return this.catalog.list()
  }
}
