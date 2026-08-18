import type { Outing } from '@modules/rides/domain/entities/Outing.ts'
import type { OutingCatalogPort } from '@modules/rides/domain/ports/OutingCatalogPort.ts'

export class InMemoryOutingCatalog implements OutingCatalogPort {
  private items: Outing[]

  constructor(seed: readonly Outing[] = []) {
    this.items = [...seed]
  }

  list(): readonly Outing[] {
    return this.items
  }

  save(outing: Outing): void {
    this.items = [...this.items, outing]
  }
}
