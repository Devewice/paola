import type { MemoryList } from '@modules/rides/domain/entities/Memory.ts'
import { MEMORIES_EMPTY_COPY } from '@modules/rides/constants/copy.ts'
import type { MemoryCatalogPort } from '@modules/rides/domain/ports/MemoryCatalogPort.ts'

export class InMemoryMemoryCatalog implements MemoryCatalogPort {
  private readonly items: MemoryList

  constructor(items: MemoryList['items'] = [], totalKm = 0) {
    this.items = {
      items,
      totalKm,
      emptyCopy: MEMORIES_EMPTY_COPY,
    }
  }

  list(): MemoryList {
    return this.items
  }
}
