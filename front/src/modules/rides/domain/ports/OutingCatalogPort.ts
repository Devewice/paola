import type { Outing } from '@modules/rides/domain/entities/Outing.ts'

export interface OutingCatalogPort {
  list(): readonly Outing[]
  save(outing: Outing): void
}
