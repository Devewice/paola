import type { MemoryCatalogPort } from '@modules/rides/domain/ports/MemoryCatalogPort.ts'
import type { MemoryList } from '@modules/rides/domain/entities/Memory.ts'

export class GetMemories {
  private readonly catalog: MemoryCatalogPort

  constructor(catalog: MemoryCatalogPort) {
    this.catalog = catalog
  }

  execute(): MemoryList {
    return this.catalog.list()
  }
}
