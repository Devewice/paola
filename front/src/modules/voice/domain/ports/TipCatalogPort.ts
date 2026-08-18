import type { TipList } from '@modules/voice/domain/entities/Tip.ts'

export interface TipCatalogPort {
  list(): TipList
}
