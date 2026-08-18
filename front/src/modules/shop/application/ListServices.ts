import {
  SHOP_EMPTY_SERVICE,
  SHOP_SERVICE_WARRANTY_COPY,
  SHOP_SERVICE_ZONE_COPY,
} from '@modules/shop/constants/copy.ts'
import type { ServiceBoard } from '@modules/shop/domain/entities/ShopService.ts'
import type { ServiceCatalogPort } from '@modules/shop/domain/ports/ServiceCatalogPort.ts'

export class ListServices {
  private readonly catalog: ServiceCatalogPort

  constructor(catalog: ServiceCatalogPort) {
    this.catalog = catalog
  }

  execute(): ServiceBoard {
    return {
      items: this.catalog.list(),
      emptyCopy: SHOP_EMPTY_SERVICE,
      warrantyCopy: SHOP_SERVICE_WARRANTY_COPY,
      zoneCopy: SHOP_SERVICE_ZONE_COPY,
    }
  }
}
