import type { Product } from '@modules/shop/domain/entities/Product.ts'
import type { ProductCatalogPort } from '@modules/shop/domain/ports/ProductCatalogPort.ts'

export class InMemoryProductCatalog implements ProductCatalogPort {
  private readonly items: readonly Product[]

  constructor(seed: readonly Product[] = []) {
    this.items = [...seed]
  }

  list(): readonly Product[] {
    return this.items
  }

  get(id: string): Product | undefined {
    return this.items.find((item) => item.id === id)
  }
}
