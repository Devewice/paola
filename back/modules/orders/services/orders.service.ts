import { randomUUID } from 'node:crypto'
import { HTTP_STATUS } from '../../../http/constants.js'
import type { Fail } from '../../../http/types.js'
import { parseCreateOrder } from '../schemas/orders.schema.js'
import type { ServiceOrder } from '../interfaces/orders.interface.js'
import { findServiceTitle, insertOrder, listOperatorOrders } from '../providers/orders.provider.js'

export async function createOrder(draft: Record<string, unknown>): Promise<Fail | { ok: true; order: ServiceOrder }> {
  const parsed = parseCreateOrder(draft)
  if (!parsed.ok) return parsed

  const serviceTitle = await findServiceTitle(parsed.value.serviceId)
  if (!serviceTitle) {
    return { ok: false, status: HTTP_STATUS.NOT_FOUND, detail: 'Servicio no encontrado.' }
  }

  const order: ServiceOrder = {
    id: randomUUID(),
    kind: 'lavado',
    status: 'pendiente',
    serviceId: parsed.value.serviceId,
    itemTitle: serviceTitle,
    size: parsed.value.size,
    deliveryZone: parsed.value.deliveryZone,
    customerName: parsed.value.customerName,
    customerWhatsapp: parsed.value.customerWhatsapp,
    paid: false,
    createdAt: new Date().toISOString(),
  }

  await insertOrder(order)
  return { ok: true, order }
}

export async function findOperatorOrders(): Promise<ServiceOrder[]> {
  return listOperatorOrders()
}

