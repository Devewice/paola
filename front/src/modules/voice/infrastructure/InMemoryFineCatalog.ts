import type { FineList } from '@modules/voice/domain/entities/Fine.ts'
import { FINES_EMPTY_COPY } from '@modules/voice/constants/copy.ts'
import type { FineCatalogPort } from '@modules/voice/domain/ports/FineCatalogPort.ts'

export class InMemoryFineCatalog implements FineCatalogPort {
  private readonly items: FineList

  constructor(items: FineList['items'] = []) {
    this.items = { items, emptyCopy: FINES_EMPTY_COPY }
  }

  list(): FineList {
    return this.items
  }
}
