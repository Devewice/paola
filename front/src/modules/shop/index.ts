export type {
  Product,
  ProductDraft,
  ProductKind,
  ShopShelves,
} from '@modules/shop/domain/entities/Product.ts'
export type {
  ServiceBoard,
  ServiceDraft,
  ShopService,
} from '@modules/shop/domain/entities/ShopService.ts'
export type {
  ServiceOrder,
  ServiceOrderDraft,
  ServiceOrderNotice,
} from '@modules/shop/domain/entities/ServiceOrder.ts'
export {
  SHOP_COPY,
  SHOP_DELIVERY_COPY,
  SHOP_EMPTY_COLLAB,
  SHOP_EMPTY_FICHA,
  SHOP_EMPTY_OWN,
  SHOP_EMPTY_SERVICE,
  SHOP_EMPTY_SERVICE_FICHA,
  SHOP_SERVICE_WARRANTY_COPY,
  SHOP_SERVICE_ZONE_COPY,
  SHOP_WARRANTY_COPY,
} from '@modules/shop/constants/copy.ts'
export type { ShopContact } from '@modules/shop/domain/entities/ShopContact.ts'
export type { ProductCatalogPort } from '@modules/shop/domain/ports/ProductCatalogPort.ts'
export type { ServiceCatalogPort } from '@modules/shop/domain/ports/ServiceCatalogPort.ts'
export type { ShopWritePort } from '@modules/shop/domain/ports/ShopWritePort.ts'
export type { ServiceOrderApiPort } from '@modules/shop/domain/ports/ServiceOrderApiPort.ts'
export { createShopModule, type ShopModule } from '@modules/shop/composition.ts'
export { loadProductCatalog } from '@modules/shop/infrastructure/loadProductCatalog.ts'
export { loadServiceCatalog } from '@modules/shop/infrastructure/loadServiceCatalog.ts'
export { InMemoryProductCatalog } from '@modules/shop/infrastructure/InMemoryProductCatalog.ts'
export { InMemoryServiceCatalog } from '@modules/shop/infrastructure/InMemoryServiceCatalog.ts'
export { InMemoryServiceOrderApi } from '@modules/shop/infrastructure/InMemoryServiceOrderApi.ts'
export { HttpShopApi } from '@modules/shop/infrastructure/HttpShopApi.ts'
export { HttpShopOrdersApi } from '@modules/shop/infrastructure/HttpShopOrdersApi.ts'
export { parseProduct, parseProductList } from '@modules/shop/infrastructure/parseProduct.ts'
export { parseService, parseServiceList } from '@modules/shop/infrastructure/parseService.ts'
