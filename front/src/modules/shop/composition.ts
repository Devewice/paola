import { GetProduct } from '@modules/shop/application/GetProduct.ts'
import { ListShelves } from '@modules/shop/application/ListShelves.ts'
import type { ShopContact } from '@modules/shop/domain/entities/ShopContact.ts'
import type { ProductCatalogPort } from '@modules/shop/domain/ports/ProductCatalogPort.ts'
import type { ShopWritePort } from '@modules/shop/domain/ports/ShopWritePort.ts'

export type ShopModule = {
  getShelves: () => ReturnType<ListShelves['execute']>
  getProduct: (id: string) => ReturnType<GetProduct['execute']>
  getContact: () => ShopContact
  publishProduct: ShopWritePort['publish']
}

export function createShopModule(
  catalog: ProductCatalogPort,
  write: ShopWritePort,
  contact: ShopContact,
): ShopModule {
  const listShelves = new ListShelves(catalog)
  const getProduct = new GetProduct(catalog)

  return {
    getShelves: () => listShelves.execute(),
    getProduct: (id) => getProduct.execute(id),
    getContact: () => contact,
    publishProduct: (draft, clave) => write.publish(draft, clave),
  }
}
