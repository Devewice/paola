import type { MemoryList } from '@modules/rides/domain/entities/Memory.ts'

export interface MemoryCatalogPort {
  list(): MemoryList
}
