export type {
  Product,
  ProductDraft,
  ProductKind,
  ShopShelves,
} from '@modules/shop/domain/entities/Product.ts'
export {
  SHOP_DELIVERY_COPY,
  SHOP_EMPTY_COLLAB,
  SHOP_EMPTY_FICHA,
  SHOP_EMPTY_OWN,
  SHOP_WARRANTY_COPY,
} from '@modules/shop/domain/entities/Product.ts'
export type { ShopContact } from '@modules/shop/domain/entities/ShopContact.ts'
export type { ProductCatalogPort } from '@modules/shop/domain/ports/ProductCatalogPort.ts'
export type { ShopWritePort } from '@modules/shop/domain/ports/ShopWritePort.ts'
export { createShopModule, type ShopModule } from '@modules/shop/composition.ts'
export { loadProductCatalog } from '@modules/shop/infrastructure/loadProductCatalog.ts'
export { InMemoryProductCatalog } from '@modules/shop/infrastructure/InMemoryProductCatalog.ts'
export { HttpShopApi } from '@modules/shop/infrastructure/HttpShopApi.ts'
export { parseProduct, parseProductList } from '@modules/shop/infrastructure/parseProduct.ts'
