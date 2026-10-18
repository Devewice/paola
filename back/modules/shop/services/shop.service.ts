import { randomUUID } from 'node:crypto'
import { HTTP_STATUS } from '../../../http/constants.js'
import { fail } from '../../../http/fail.js'
import type { Fail } from '../../../http/types.js'
import { SHOP_MESSAGES } from '../constants/shop.constants.js'
import type { Product, ShopService } from '../interfaces/shop.interface.js'
import {
  deleteProduct,
  deleteService,
  findProducts,
  findServices,
  insertProduct,
  insertService,
  serviceHasOrders,
  updateProduct,
  updateService,
} from '../providers/shop.provider.js'
import { parseCreateProduct, parseCreateService } from '../schemas/shop.schema.js'

export async function listProducts(): Promise<Product[]> {
  return findProducts()
}

export async function createProduct(
  draft: Record<string, unknown>,
): Promise<Fail | { ok: true; product: Product }> {
  const parsed = parseCreateProduct(draft)
  if (!parsed.ok) return parsed

  const product: Product = { id: randomUUID(), ...parsed.value }
  await insertProduct(product)
  return { ok: true, product }
}

export async function editProduct(
  id: string,
  draft: Record<string, unknown>,
): Promise<Fail | { ok: true; product: Product }> {
  const parsed = parseCreateProduct(draft)
  if (!parsed.ok) return parsed
  const product: Product = { id, ...parsed.value }
  if (!(await updateProduct(product))) return fail(HTTP_STATUS.NOT_FOUND, SHOP_MESSAGES.PRODUCT_NOT_FOUND)
  return { ok: true, product }
}

export async function removeProduct(id: string): Promise<Fail | { ok: true }> {
  if (!(await deleteProduct(id))) return fail(HTTP_STATUS.NOT_FOUND, SHOP_MESSAGES.PRODUCT_NOT_FOUND)
  return { ok: true }
}

export async function listServices(): Promise<ShopService[]> {
  return findServices()
}

export async function createService(
  draft: Record<string, unknown>,
): Promise<Fail | { ok: true; service: ShopService }> {
  const parsed = parseCreateService(draft)
  if (!parsed.ok) return parsed

  const service: ShopService = { id: randomUUID(), ...parsed.value }
  await insertService(service)
  return { ok: true, service }
}

export async function editService(
  id: string,
  draft: Record<string, unknown>,
): Promise<Fail | { ok: true; service: ShopService }> {
  const parsed = parseCreateService(draft)
  if (!parsed.ok) return parsed
  const service: ShopService = { id, ...parsed.value }
  if (!(await updateService(service))) return fail(HTTP_STATUS.NOT_FOUND, SHOP_MESSAGES.SERVICE_NOT_FOUND)
  return { ok: true, service }
}

export async function removeService(id: string): Promise<Fail | { ok: true }> {
  if (await serviceHasOrders(id)) return fail(HTTP_STATUS.CONFLICT, SHOP_MESSAGES.SERVICE_HAS_ORDERS)
  if (!(await deleteService(id))) return fail(HTTP_STATUS.NOT_FOUND, SHOP_MESSAGES.SERVICE_NOT_FOUND)
  return { ok: true }
}
