import type { Product } from '@modules/shop/domain/entities/Product.ts'
import type { ProductCatalogPort } from '@modules/shop/domain/ports/ProductCatalogPort.ts'

export class GetProduct {
  private readonly catalog: ProductCatalogPort

  constructor(catalog: ProductCatalogPort) {
    this.catalog = catalog
  }

  execute(id: string): Product | undefined {
    return this.catalog.get(id)
  }
}
