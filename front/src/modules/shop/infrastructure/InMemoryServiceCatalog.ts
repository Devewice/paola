import type { ShopService } from '@modules/shop/domain/entities/ShopService.ts'
import type { ServiceCatalogPort } from '@modules/shop/domain/ports/ServiceCatalogPort.ts'

export class InMemoryServiceCatalog implements ServiceCatalogPort {
  private readonly items: readonly ShopService[]

  constructor(seed: readonly ShopService[] = []) {
    this.items = [...seed]
  }

  list(): readonly ShopService[] {
    return this.items
  }

  get(id: string): ShopService | undefined {
    return this.items.find((item) => item.id === id)
  }
}
