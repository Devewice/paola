import type { FineList } from '@modules/voice/domain/entities/Fine.ts'

export interface FineCatalogPort {
  list(): FineList
}
