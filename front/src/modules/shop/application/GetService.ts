import type { ShopService } from '@modules/shop/domain/entities/ShopService.ts'
import type { ServiceCatalogPort } from '@modules/shop/domain/ports/ServiceCatalogPort.ts'

export class GetService {
  private readonly catalog: ServiceCatalogPort

  constructor(catalog: ServiceCatalogPort) {
    this.catalog = catalog
  }

  execute(id: string): ShopService | undefined {
    return this.catalog.get(id)
  }
}
