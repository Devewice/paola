import type { TipList } from '@modules/voice/domain/entities/Tip.ts'
import { TIPS_EMPTY_COPY } from '@modules/voice/constants/copy.ts'
import type { TipCatalogPort } from '@modules/voice/domain/ports/TipCatalogPort.ts'

export class InMemoryTipCatalog implements TipCatalogPort {
  private readonly items: TipList

  constructor(items: TipList['items'] = []) {
    this.items = { items, emptyCopy: TIPS_EMPTY_COPY }
  }

  list(): TipList {
    return this.items
  }
}
