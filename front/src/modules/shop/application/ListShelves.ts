import type { ProductCatalogPort } from '@modules/shop/domain/ports/ProductCatalogPort.ts'
import type { ShopShelves } from '@modules/shop/domain/entities/Product.ts'
import {
  SHOP_DELIVERY_COPY,
  SHOP_EMPTY_COLLAB,
  SHOP_EMPTY_OWN,
  SHOP_KIND,
  SHOP_WARRANTY_COPY,
} from '@modules/shop/constants/copy.ts'

export class ListShelves {
  private readonly catalog: ProductCatalogPort

  constructor(catalog: ProductCatalogPort) {
    this.catalog = catalog
  }

  execute(): ShopShelves {
    const items = this.catalog.list()
    return {
      own: items.filter((item) => item.kind === SHOP_KIND.OWN),
      collab: items.filter((item) => item.kind === SHOP_KIND.COLLAB),
      emptyOwnCopy: SHOP_EMPTY_OWN,
      emptyCollabCopy: SHOP_EMPTY_COLLAB,
      deliveryCopy: SHOP_DELIVERY_COPY,
      warrantyCopy: SHOP_WARRANTY_COPY,
    }
  }
}
