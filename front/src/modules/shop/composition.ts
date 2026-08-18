import { GetProduct } from '@modules/shop/application/GetProduct.ts'
import { GetService } from '@modules/shop/application/GetService.ts'
import { ListServices } from '@modules/shop/application/ListServices.ts'
import { ListShelves } from '@modules/shop/application/ListShelves.ts'
import { CreateServiceOrder } from '@modules/shop/application/CreateServiceOrder.ts'
import { ListOperatorOrders } from '@modules/shop/application/ListOperatorOrders.ts'
import type { ShopContact } from '@modules/shop/domain/entities/ShopContact.ts'
import type { ProductCatalogPort } from '@modules/shop/domain/ports/ProductCatalogPort.ts'
import type { ServiceCatalogPort } from '@modules/shop/domain/ports/ServiceCatalogPort.ts'
import type { ShopWritePort } from '@modules/shop/domain/ports/ShopWritePort.ts'
import type { ServiceOrderApiPort } from '@modules/shop/domain/ports/ServiceOrderApiPort.ts'
import type { AppError } from '@core/errors/AppError.ts'
import type { Result } from '@core/result.ts'
import type { ServiceOrder, ServiceOrderDraft } from '@modules/shop/domain/entities/ServiceOrder.ts'

export type ShopModule = {
  getShelves: () => ReturnType<ListShelves['execute']>
  getProduct: (id: string) => ReturnType<GetProduct['execute']>
  getServices: () => ReturnType<ListServices['execute']>
  getService: (id: string) => ReturnType<GetService['execute']>
  getContact: () => ShopContact
  publishProduct: ShopWritePort['publish']
  publishService: ShopWritePort['publishService']
  createServiceOrder: (draft: ServiceOrderDraft) => Promise<Result<{ order: ServiceOrder; notice: { whatsappHref: string } }, AppError>>
  listOperatorOrders: (clave: string) => ReturnType<ListOperatorOrders['execute']>
}

export function createShopModule(
  catalog: ProductCatalogPort,
  services: ServiceCatalogPort,
  write: ShopWritePort,
  orders: ServiceOrderApiPort,
  contact: ShopContact,
): ShopModule {
  const listShelves = new ListShelves(catalog)
  const getProduct = new GetProduct(catalog)
  const listServices = new ListServices(services)
  const getService = new GetService(services)
  const createServiceOrder = new CreateServiceOrder(orders)
  const listOperatorOrders = new ListOperatorOrders(orders)

  return {
    getShelves: () => listShelves.execute(),
    getProduct: (id) => getProduct.execute(id),
    getServices: () => listServices.execute(),
    getService: (id) => getService.execute(id),
    getContact: () => contact,
    publishProduct: (draft, clave) => write.publish(draft, clave),
    publishService: (draft, clave) => write.publishService(draft, clave),
    createServiceOrder: (draft) => createServiceOrder.execute({ ...draft }),
    listOperatorOrders: (clave) => listOperatorOrders.execute(clave),
  }
}
